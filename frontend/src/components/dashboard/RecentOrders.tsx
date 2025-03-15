'use client';

import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';

const orders = [
  {
    id: 1,
    customer: 'John Smith',
    items: 3,
    total: '$156.00',
    status: 'completed',
    date: new Date('2024-03-15T09:24:00'),
  },
  {
    id: 2,
    customer: 'Jane Doe',
    items: 2,
    total: '$89.99',
    status: 'pending',
    date: new Date('2024-03-15T10:15:00'),
  },
  {
    id: 3,
    customer: 'Bob Johnson',
    items: 1,
    total: '$45.50',
    status: 'processing',
    date: new Date('2024-03-15T11:05:00'),
  },
  {
    id: 4,
    customer: 'Sarah Wilson',
    items: 4,
    total: '$234.00',
    status: 'completed',
    date: new Date('2024-03-15T11:30:00'),
  },
  {
    id: 5,
    customer: 'Mike Brown',
    items: 2,
    total: '$78.50',
    status: 'pending',
    date: new Date('2024-03-15T12:00:00'),
  },
];

const statusStyles = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
};

export function RecentOrders() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Order ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Items
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                #{order.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {order.customer}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {order.items}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {order.total}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={cn(
                    statusStyles[order.status as keyof typeof statusStyles],
                    'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {format(order.date, 'MMM d, h:mm a')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 