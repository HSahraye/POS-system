'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Sample order data
const orders = [
  {
    id: '1',
    customer: 'John Smith',
    date: 'Mar 15, 2023, 9:24 AM',
    amount: '$156.00',
    status: 'completed',
    items: 3
  },
  {
    id: '2',
    customer: 'Jane Doe',
    date: 'Mar 15, 2023, 10:15 AM',
    amount: '$89.99',
    status: 'pending',
    items: 2
  },
  {
    id: '3',
    customer: 'Bob Johnson',
    date: 'Mar 15, 2023, 11:05 AM',
    amount: '$45.50',
    status: 'processing',
    items: 1
  },
  {
    id: '4',
    customer: 'Sarah Wilson',
    date: 'Mar 15, 2023, 11:30 AM',
    amount: '$234.00',
    status: 'completed',
    items: 4
  },
  {
    id: '5',
    customer: 'Mike Brown',
    date: 'Mar 15, 2023, 12:00 PM',
    amount: '$78.50',
    status: 'pending',
    items: 2
  },
  {
    id: '6',
    customer: 'Emily Davis',
    date: 'Mar 15, 2023, 1:15 PM',
    amount: '$125.75',
    status: 'cancelled',
    items: 3
  },
  {
    id: '7',
    customer: 'Alex Johnson',
    date: 'Mar 15, 2023, 2:30 PM',
    amount: '$67.25',
    status: 'completed',
    items: 1
  },
  {
    id: '8',
    customer: 'Lisa Miller',
    date: 'Mar 15, 2023, 3:45 PM',
    amount: '$189.99',
    status: 'processing',
    items: 5
  },
];

const statusStyles = {
  completed: { icon: CheckCircleIcon, className: 'bg-green-50 text-green-700 ring-green-600/20' },
  pending: { icon: ClockIcon, className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' },
  processing: { icon: ArrowPathIcon, className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  cancelled: { icon: XCircleIcon, className: 'bg-red-50 text-red-700 ring-red-600/20' },
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders in your store including customer name, order ID, date, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add order
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusStyles[order.status].icon;
                    return (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          #{order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customer}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.amount}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={cn(
                              statusStyles[order.status].className,
                              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                            )}
                          >
                            <StatusIcon className="mr-1 h-4 w-4" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href={`/dashboard/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                            View<span className="sr-only">, order {order.id}</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 