'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Mock data generation functions
const generateSalesData = (startDate: Date, endDate: Date) => {
  const data = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push({
      date: new Date(currentDate).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 10000) + 1000,
      orders: Math.floor(Math.random() * 100) + 10,
      averageOrderValue: Math.floor(Math.random() * 200) + 50,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const generateProductData = () => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'];
  return categories.map(category => ({
    category,
    sales: Math.floor(Math.random() * 1000) + 100,
    revenue: Math.floor(Math.random() * 50000) + 5000,
    inventory: Math.floor(Math.random() * 200) + 20,
  }));
};

const generateCustomerData = () => ({
  newCustomers: Math.floor(Math.random() * 100) + 10,
  repeatCustomers: Math.floor(Math.random() * 200) + 50,
  churnRate: (Math.random() * 5 + 1).toFixed(2),
  averageLTV: Math.floor(Math.random() * 1000) + 200,
});

export default function ReportsPage() {
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('last30days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeRange(e.target.value);
    setShowDatePicker(e.target.value === 'custom');
    
    // Generate date range based on selection
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (e.target.value) {
      case 'today':
        start = today;
        end = today;
        break;
      case 'yesterday':
        start = new Date(today.setDate(today.getDate() - 1));
        end = new Date(start);
        break;
      case 'last7days':
        start = new Date(today.setDate(today.getDate() - 7));
        end = new Date();
        break;
      case 'last30days':
        start = new Date(today.setDate(today.getDate() - 30));
        end = new Date();
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date();
        break;
    }

    if (e.target.value !== 'custom') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      generateReport(start, end);
    }
  };

  const generateReport = (start: Date, end: Date) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const data = {
        sales: generateSalesData(start, end),
        products: generateProductData(),
        customers: generateCustomerData(),
      };
      setReportData(data);
      setLoading(false);
    }, 1000);
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      generateReport(new Date(startDate), new Date(endDate));
    }
  };

  const handleDownload = (reportId: string) => {
    if (!reportData) return;
    
    // Create CSV content based on report type
    let csvContent = '';
    switch (reportId) {
      case 'sales':
        csvContent = 'Date,Revenue,Orders,Average Order Value\n' +
          reportData.sales.map((day: any) => 
            `${day.date},${day.revenue},${day.orders},${day.averageOrderValue}`
          ).join('\n');
        break;
      case 'products':
        csvContent = 'Category,Sales,Revenue,Inventory\n' +
          reportData.products.map((product: any) =>
            `${product.category},${product.sales},${product.revenue},${product.inventory}`
          ).join('\n');
        break;
      // Add other report types as needed
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${reportId}_report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleCustomDateChange();
                }}
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
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleCustomDateChange();
                }}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Generating reports...</span>
        </div>
      ) : reportData ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <report.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900">{report.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{report.description}</p>

                {/* Report-specific metrics */}
                <div className="mt-4 space-y-2">
                  {report.id === 'sales' && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Total Revenue: </span>
                        {formatCurrency(reportData.sales.reduce((sum: number, day: any) => sum + day.revenue, 0))}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total Orders: </span>
                        {reportData.sales.reduce((sum: number, day: any) => sum + day.orders, 0)}
                      </p>
                    </>
                  )}
                  {report.id === 'products' && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Top Category: </span>
                        {reportData.products.sort((a: any, b: any) => b.revenue - a.revenue)[0].category}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Total Inventory: </span>
                        {reportData.products.reduce((sum: number, product: any) => sum + product.inventory, 0)} units
                      </p>
                    </>
                  )}
                  {report.id === 'customers' && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">New Customers: </span>
                        {reportData.customers.newCustomers}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Churn Rate: </span>
                        {reportData.customers.churnRate}%
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <button
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => {
                    // Store the current time range and dates in localStorage
                    localStorage.setItem('reportTimeRange', JSON.stringify({
                      range: selectedTimeRange,
                      startDate,
                      endDate,
                    }));
                    // Navigate to the detailed report page
                    router.push(`/dashboard/reports/${report.id}`);
                  }}
                >
                  <span>View details</span>
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(report.id);
                  }}
                >
                  <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Download {report.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          Select a time range to generate reports
        </div>
      )}
    </div>
  );
} 