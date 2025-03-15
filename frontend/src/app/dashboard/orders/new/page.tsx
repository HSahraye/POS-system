'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScanner from '../../../../components/BarcodeScanner';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  customizations?: {
    size?: string;
    color?: string;
    addons?: string[];
    specialRequests?: string;
  };
}

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomersAndProducts();
  }, []);

  const fetchCustomersAndProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch customers
      const customersResponse = await fetch('http://localhost:5000/customers', {
        headers
      });
      if (!customersResponse.ok) throw new Error('Failed to fetch customers');
      const customersData = await customersResponse.json();
      setCustomers(customersData);

      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/products', {
        headers
      });
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      const productsData = await productsResponse.json();
      setProducts(productsData);

      setError(null);
    } catch (err) {
      setError('Error loading data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = orderItems.find(item => item.productId === productId);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId,
        quantity: 1,
        unitPrice: product.price
      }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity < 1 || quantity > product.stockQuantity) return;

    setOrderItems(orderItems.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || orderItems.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: selectedCustomer,
          items: orderItems
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      router.push(`/dashboard/orders/${order.id}`);
    } catch (err) {
      setError('Error creating order. Please try again.');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Order</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Orders
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer</h2>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Products Selection */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Products</h2>
          
          {/* Barcode Scanner */}
          <div className="mb-6">
            <BarcodeScanner
              onScan={async (barcode) => {
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:5000/products/barcode/${barcode}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });

                  if (!response.ok) {
                    throw new Error('Product not found');
                  }

                  const product = await response.json();
                  handleAddItem(product.id);
                } catch (error) {
                  setError('Error scanning product. Please try again or add manually.');
                }
              }}
              onError={() => setError('Error accessing camera. Please check permissions.')}
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${product.price.toFixed(2)} - Stock: {product.stockQuantity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddItem(product.id)}
                  disabled={product.stockQuantity === 0}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          {orderItems.length === 0 ? (
            <p className="text-gray-500">No items added to order</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.unitPrice.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={orderItems.length === 0 || !selectedCustomer}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
} 