'use client';

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// Sample data for analytics
const metrics = [
  { 
    id: 1, 
    name: 'Total Revenue', 
    value: '$24,567.89', 
    change: '+12.5%', 
    trend: 'up',
    description: 'Total revenue from all sales'
  },
  { 
    id: 2, 
    name: 'Orders', 
    value: '356', 
    change: '+8.2%', 
    trend: 'up',
    description: 'Total number of orders'
  },
  { 
    id: 3, 
    name: 'Average Order Value', 
    value: '$68.73', 
    change: '+3.1%', 
    trend: 'up',
    description: 'Average value per order'
  },
  { 
    id: 4, 
    name: 'Refunds', 
    value: '$1,245.30', 
    change: '-2.3%', 
    trend: 'down',
    description: 'Total value of refunds'
  },
];

const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'yesterday', name: 'Yesterday' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
];

// Sample chart data
const revenueData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 15000 },
  { month: 'Mar', value: 18000 },
  { month: 'Apr', value: 16000 },
  { month: 'May', value: 21000 },
  { month: 'Jun', value: 19000 },
  { month: 'Jul', value: 22000 },
  { month: 'Aug', value: 25000 },
  { month: 'Sep', value: 23000 },
  { month: 'Oct', value: 27000 },
  { month: 'Nov', value: 29000 },
  { month: 'Dec', value: 32000 },
];

const ordersData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 150 },
  { month: 'Mar', value: 180 },
  { month: 'Apr', value: 160 },
  { month: 'May', value: 210 },
  { month: 'Jun', value: 190 },
  { month: 'Jul', value: 220 },
  { month: 'Aug', value: 250 },
  { month: 'Sep', value: 230 },
  { month: 'Oct', value: 270 },
  { month: 'Nov', value: 290 },
  { month: 'Dec', value: 320 },
];

// Sample product performance data
const topProducts = [
  { id: 1, name: 'Product A', sales: 245, revenue: '$12,250.00', growth: '+15.3%' },
  { id: 2, name: 'Product B', sales: 187, revenue: '$9,350.00', growth: '+8.7%' },
  { id: 3, name: 'Product C', sales: 156, revenue: '$7,800.00', growth: '+5.2%' },
  { id: 4, name: 'Product D', sales: 124, revenue: '$6,200.00', growth: '+3.8%' },
  { id: 5, name: 'Product E', sales: 98, revenue: '$4,900.00', growth: '-2.1%' },
];

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  // Function to get the maximum value for the chart
  const getMaxValue = (data: { month: string; value: number }[]) => {
    return Math.max(...data.map(item => item.value)) * 1.1; // Add 10% padding
  };

  // Function to normalize values for the chart (0-100 scale)
  const normalizeValue = (value: number, maxValue: number) => {
    return (value / maxValue) * 100;
  };

  const maxRevenueValue = getMaxValue(revenueData);
  const maxOrdersValue = getMaxValue(ordersData);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            View detailed analytics and metrics for your business performance.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <select
            id="timeRange"
            name="timeRange"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUpIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    )}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">{metric.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{metric.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <div className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">from previous period</div>
                </div>
                <div className="mt-1 text-sm text-gray-500">{metric.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Revenue</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-80 relative">
              <div className="absolute inset-0 flex items-end">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full mx-1 bg-primary-600 rounded-t"
                      style={{ 
                        height: `${normalizeValue(item.value, maxRevenueValue)}%`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Orders</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-80 relative">
              <div className="absolute inset-0 flex items-end">
                {ordersData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full mx-1 bg-blue-500 rounded-t"
                      style={{ 
                        height: `${normalizeValue(item.value, maxOrdersValue)}%`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Top Performing Products
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sales
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Revenue
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.sales}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.revenue}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.growth.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.growth}
                        </span>
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