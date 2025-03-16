'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const reports = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Overview of sales performance over time with revenue, order count, and average order value.',
    icon: CurrencyDollarIcon,
  },
  {
    id: 'products',
    name: 'Product Performance',
    description: 'Analysis of top-selling products, inventory levels, and product category performance.',
    icon: ShoppingCartIcon,
  },
  {
    id: 'customers',
    name: 'Customer Analysis',
    description: 'Customer acquisition, retention rates, and lifetime value metrics.',
    icon: UserGroupIcon,
  },
  {
    id: 'inventory',
    name: 'Inventory Status',
    description: 'Current inventory levels, low stock alerts, and inventory turnover rates.',
    icon: DocumentTextIcon,
  },
  {
    id: 'revenue',
    name: 'Revenue Breakdown',
    description: 'Detailed breakdown of revenue by product category, time period, and payment method.',
    icon: ChartBarIcon,
  },
  {
    id: 'trends',
    name: 'Sales Trends',
    description: 'Visualization of sales trends over time with seasonal analysis and growth metrics.',
    icon: ChartPieIcon,
  },
];

const timeRanges = [
  { id: 'today', name: 'Today' },
  { id: 'yesterday', name: 'Yesterday' },
  { id: 'last7days', name: 'Last 7 days' },
  { id: 'last30days', name: 'Last 30 days' },
  { id: 'thisMonth', name: 'This month' },
  { id: 'lastMonth', name: 'Last month' },
  { id: 'thisYear', name: 'This year' },
  { id: 'custom', name: 'Custom range' },
];

export default function ReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last30days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeRange(e.target.value);
    setShowDatePicker(e.target.value === 'custom');
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and view reports to analyze your business performance.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="time-range" className="block text-sm font-medium leading-6 text-gray-900">
            Time Range
          </label>
          <select
            id="time-range"
            name="time-range"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={selectedTimeRange}
            onChange={handleTimeRangeChange}
          >
            {timeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>

        {showDatePicker && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium leading-6 text-gray-900">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium leading-6 text-gray-900">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            onClick={() => window.location.href = `/dashboard/reports/${report.id}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <report.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-4">
              <h3 className="text-base font-semibold leading-6 text-gray-900">{report.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{report.description}</p>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-600">
              <span className="font-medium">View report</span>
              <span className="ml-1">→</span>
            </div>
            <div className="absolute top-4 right-4">
              <button
                type="button"
                className="rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Downloading ${report.name}...`);
                }}
              >
                <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Download {report.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 