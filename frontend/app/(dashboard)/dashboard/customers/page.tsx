'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

// Sample customer data
const customers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    orders: 12,
    spent: '$1,245.89',
    lastOrder: 'Mar 10, 2023',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '(555) 987-6543',
    orders: 8,
    spent: '$876.50',
    lastOrder: 'Mar 12, 2023',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '(555) 234-5678',
    orders: 5,
    spent: '$432.75',
    lastOrder: 'Mar 5, 2023',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '(555) 876-5432',
    orders: 15,
    spent: '$1,876.25',
    lastOrder: 'Mar 15, 2023',
    status: 'active',
  },
  {
    id: '5',
    name: 'Mike Brown',
    email: 'mike.brown@example.com',
    phone: '(555) 345-6789',
    orders: 3,
    spent: '$245.50',
    lastOrder: 'Feb 28, 2023',
    status: 'inactive',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 765-4321',
    orders: 7,
    spent: '$678.90',
    lastOrder: 'Mar 8, 2023',
    status: 'active',
  },
  {
    id: '7',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 456-7890',
    orders: 2,
    spent: '$156.25',
    lastOrder: 'Feb 20, 2023',
    status: 'inactive',
  },
  {
    id: '8',
    name: 'Lisa Miller',
    email: 'lisa.miller@example.com',
    phone: '(555) 654-3210',
    orders: 10,
    spent: '$1,023.75',
    lastOrder: 'Mar 14, 2023',
    status: 'active',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all customers in your store including their name, email, phone, and order history.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add customer
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search customers..."
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Orders
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Spent
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Order
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
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {customer.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <EnvelopeIcon className="mr-1 h-4 w-4 text-gray-400" />
                            <a href={`mailto:${customer.email}`} className="text-primary-600 hover:text-primary-900">
                              {customer.email}
                            </a>
                          </div>
                          <div className="mt-1 flex items-center">
                            <PhoneIcon className="mr-1 h-4 w-4 text-gray-400" />
                            <a href={`tel:${customer.phone}`} className="text-gray-500">
                              {customer.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.orders}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.spent}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.lastOrder}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            customer.status === 'active'
                              ? 'bg-green-50 text-green-700 ring-green-600/20'
                              : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                          }`}
                        >
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href={`/dashboard/customers/${customer.id}`} className="text-primary-600 hover:text-primary-900">
                          View<span className="sr-only">, {customer.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 