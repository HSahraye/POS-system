'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const lowStockItems = [
  {
    id: 1,
    name: 'Coffee',
    stock: 5,
    threshold: 10,
    category: 'Beverages',
  },
  {
    id: 2,
    name: 'Tea',
    stock: 8,
    threshold: 15,
    category: 'Beverages',
  },
  {
    id: 3,
    name: 'Sandwich',
    stock: 3,
    threshold: 8,
    category: 'Food',
  },
];

export default function InventoryStatus() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Inventory Status</h2>
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          {lowStockItems.length} Low Stock
        </span>
      </div>
      <div className="flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {lowStockItems.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-yellow-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {item.stock} in stock
                  </p>
                  <p className="text-sm text-gray-500">
                    Threshold: {item.threshold}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="/inventory"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View inventory
        </a>
      </div>
    </div>
  );
} 