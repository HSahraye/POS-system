'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import StripePayment from '../../../../components/StripePayment';

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  customizations?: {
    size?: string;
    color?: string;
    addons?: string[];
    specialRequests?: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    authorizationCode?: string;
    receiptUrl?: string;
  };
}

interface Order {
  id: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  payments: Payment[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

// Simple date formatter function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CREDIT_CARD');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Error loading order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !paymentAmount || processingPayment) return;

    setProcessingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/orders/${order.id}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          paymentMethod,
          paymentDetails: {
            // In a real application, this would come from a payment gateway
            cardLast4: '4242',
            cardBrand: 'Visa',
            authorizationCode: `AUTH-${Date.now()}`
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      // Refresh order data
      fetchOrder();
      setPaymentAmount('');
    } catch (err) {
      setError('Error processing payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getRemainingBalance = () => {
    if (!order) return 0;
    const totalPaid = order.payments.reduce((sum, payment) => 
      payment.status === 'COMPLETED' ? sum + payment.amount : sum, 0
    );
    return Math.max(0, order.total - totalPaid);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handlePaymentSuccess = () => {
    setShowStripePayment(false);
    fetchOrder();
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setShowStripePayment(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Order not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Order #{order.id.slice(0, 8)}
        </h1>
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
                <p className="text-sm text-gray-500">
                  Created on {formatDate(order.createdAt)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <p className="text-sm text-gray-600">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-gray-600">{order.customer.email}</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </p>
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item.customizations.size && <span>Size: {item.customizations.size} </span>}
                        {item.customizations.color && <span>Color: {item.customizations.color} </span>}
                        {item.customizations.addons && (
                          <span>Add-ons: {item.customizations.addons.join(', ')} </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center font-medium">
                <span>Total Amount</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Amount Paid</span>
                <span>${(order.total - getRemainingBalance()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-medium text-blue-600">
                <span>Remaining Balance</span>
                <span>${getRemainingBalance().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {getRemainingBalance() > 0 && order.status !== 'CANCELLED' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Process Payment</h2>
              {!showStripePayment ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowStripePayment(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pay with Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('CASH')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Pay with Cash
                  </button>
                </div>
              ) : (
                <StripePayment
                  amount={getRemainingBalance()}
                  orderId={order.id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
            {order.payments.length === 0 ? (
              <p className="text-sm text-gray-500">No payments recorded</p>
            ) : (
              <div className="space-y-4">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {payment.paymentMethod.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    {payment.paymentDetails && (
                      <div className="mt-2 text-xs text-gray-500">
                        {payment.paymentDetails.cardBrand && payment.paymentDetails.cardLast4 && (
                          <p>{payment.paymentDetails.cardBrand} ending in {payment.paymentDetails.cardLast4}</p>
                        )}
                        {payment.paymentDetails.authorizationCode && (
                          <p>Auth Code: {payment.paymentDetails.authorizationCode}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 