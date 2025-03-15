'use client';

// import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Simple date formatter function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const orders = [
  {
    id: 1,
    customer: 'John Doe',
    total: 42.50,
    status: 'Completed',
    date: new Date(2024, 2, 15, 14, 30),
  },
  {
    id: 2,
    customer: 'Jane Smith',
    total: 27.80,
    status: 'Processing',
    date: new Date(2024, 2, 15, 14, 15),
  },
  {
    id: 3,
    customer: 'Bob Johnson',
    total: 35.20,
    status: 'Completed',
    date: new Date(2024, 2, 15, 13, 45),
  },
  {
    id: 4,
    customer: 'Alice Brown',
    total: 18.90,
    status: 'Completed',
    date: new Date(2024, 2, 15, 13, 30),
  },
];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
      <div className="flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.date.toISOString())}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className={`text-sm ${
                    order.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="/orders"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View all orders
        </a>
      </div>
    </div>
  );
} 