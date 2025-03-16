'use client';

import { useState, useEffect } from 'react';

// Static data for sales overview
const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function SalesOverview() {
  const [isClient, setIsClient] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate totals
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = 245;

  // Find highest value for scaling
  const maxSales = Math.max(...data.map(item => item.sales));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
      
      {isClient ? (
        <div className="h-64 mb-4">
          <div className="flex h-full items-end space-x-2">
            {data.map((item) => (
              <div key={item.name} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-indigo-600 rounded-t"
                  style={{ 
                    height: `${(item.sales / maxSales) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs mt-1 text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="text-2xl font-semibold text-gray-900">${totalSales.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Orders</p>
          <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
        </div>
      </div>
    </div>
  );
} 