'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StripePayment from '../../components/StripePayment';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image?: string;
}

interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  loyaltyTier: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function CustomerPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'profile'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStripePayment, setShowStripePayment] = useState(false);

  useEffect(() => {
    fetchCustomerData();
    fetchProducts();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch profile
      const profileResponse = await fetch('http://localhost:5000/customers/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:5000/customers/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const profileData = await profileResponse.json();
      const ordersData = await ordersResponse.json();

      setProfile(profileData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('Error loading customer data. Please try again later.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error loading products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateProfile = async (updatedProfile: Partial<CustomerProfile>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/customers/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError('Error updating profile. Please try again later.');
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      setShowStripePayment(true);
      setCart([]);
      fetchCustomerData(); // Refresh orders list
    } catch (err) {
      setError('Error processing order. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Portal</h1>
        {profile && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {profile.firstName}!</p>
            <p className="text-sm text-blue-600">{profile.loyaltyPoints} Loyalty Points</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'shop'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-6">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Shopping Cart */}
          {cart.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shopping Cart</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      ${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  order.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-medium">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            updateProfile({
              firstName: formData.get('firstName') as string,
              lastName: formData.get('lastName') as string,
              phone: formData.get('phone') as string,
              address: formData.get('address') as string
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={profile.firstName}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={profile.lastName}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profile.phone}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={profile.email}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                defaultValue={profile.address}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Loyalty Program</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Current Tier: {profile.loyaltyTier}</p>
                  <p className="text-sm text-gray-600">Points: {profile.loyaltyPoints}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Next Tier: {
                    profile.loyaltyTier === 'BRONZE' ? '1,000 points for SILVER' :
                    profile.loyaltyTier === 'SILVER' ? '5,000 points for GOLD' :
                    profile.loyaltyTier === 'GOLD' ? '10,000 points for PLATINUM' :
                    'Maximum tier reached'
                  }</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showStripePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h2>
            <StripePayment
              amount={cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
              orderId="latest"
              onSuccess={() => {
                setShowStripePayment(false);
                setActiveTab('orders');
              }}
              onError={(error) => {
                setError(error);
                setShowStripePayment(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 