'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChartComponent from '../components/ChartComponent';

// Reuse the data generation functions from the main reports page
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
  customerSegments: [
    { name: 'New', value: Math.floor(Math.random() * 100) + 50 },
    { name: 'Regular', value: Math.floor(Math.random() * 200) + 100 },
    { name: 'VIP', value: Math.floor(Math.random() * 50) + 20 },
  ],
});

export default function ReportClient() {
  const params = useParams();
  const router = useRouter();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<{
    range: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    // Load time range from localStorage
    const storedTimeRange = localStorage.getItem('reportTimeRange');
    if (storedTimeRange) {
      setTimeRange(JSON.parse(storedTimeRange));
    }
  }, []);

  useEffect(() => {
    const generateReport = () => {
      setLoading(true);
      let start: Date;
      let end: Date;

      if (timeRange) {
        if (timeRange.range === 'custom') {
          start = new Date(timeRange.startDate);
          end = new Date(timeRange.endDate);
        } else {
          end = new Date();
          start = new Date();

          switch (timeRange.range) {
            case 'today':
              break;
            case 'yesterday':
              start.setDate(end.getDate() - 1);
              end = new Date(start);
              break;
            case 'last7days':
              start.setDate(end.getDate() - 7);
              break;
            case 'last30days':
              start.setDate(end.getDate() - 30);
              break;
            case 'thisMonth':
              start = new Date(end.getFullYear(), end.getMonth(), 1);
              break;
            case 'lastMonth':
              start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
              end = new Date(end.getFullYear(), end.getMonth(), 0);
              break;
            case 'thisYear':
              start = new Date(end.getFullYear(), 0, 1);
              break;
            default:
              start.setDate(end.getDate() - 30); // Default to last 30 days
          }
        }
      } else {
        // Default to last 30 days if no time range is stored
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 30);
      }

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

    generateReport();
  }, [params.type, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getChartData = () => {
    if (!reportData) return null;

    switch (params.type) {
      case 'sales':
        return {
          type: 'line' as const,
          data: {
            labels: reportData.sales.map((day: any) => day.date),
            datasets: [
              {
                label: 'Revenue',
                data: reportData.sales.map((day: any) => day.revenue),
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
              },
              {
                label: 'Orders',
                data: reportData.sales.map((day: any) => day.orders),
                borderColor: 'rgb(16, 185, 129)',
                tension: 0.1,
              },
            ],
          },
        };

      case 'products':
        return {
          type: 'bar' as const,
          data: {
            labels: reportData.products.map((product: any) => product.category),
            datasets: [
              {
                label: 'Sales',
                data: reportData.products.map((product: any) => product.sales),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
              },
              {
                label: 'Inventory',
                data: reportData.products.map((product: any) => product.inventory),
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
              },
            ],
          },
        };

      case 'customers':
        return {
          type: 'pie' as const,
          data: {
            labels: reportData.customers.customerSegments.map((segment: any) => segment.name),
            datasets: [
              {
                data: reportData.customers.customerSegments.map((segment: any) => segment.value),
                backgroundColor: [
                  'rgba(59, 130, 246, 0.5)',
                  'rgba(16, 185, 129, 0.5)',
                  'rgba(251, 191, 36, 0.5)',
                ],
              },
            ],
          },
        };

      default:
        return null;
    }
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading report data...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No data available for this report type
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 rounded-md p-2 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {params.type} Report
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Detailed analysis and metrics for {params.type}.
              {timeRange && (
                <span className="ml-2 text-primary-600">
                  {timeRange.range === 'custom'
                    ? `${new Date(timeRange.startDate).toLocaleDateString()} - ${new Date(timeRange.endDate).toLocaleDateString()}`
                    : timeRange.range.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chart Section */}
        {chartData && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              {params.type === 'sales' ? 'Revenue & Orders Trend' :
                params.type === 'products' ? 'Product Performance' :
                'Customer Segments'}
            </h2>
            <ChartComponent
              type={chartData.type}
              data={chartData.data}
              height={400}
            />
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {params.type === 'sales' && (
            <>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {formatCurrency(reportData.sales.reduce((sum: number, day: any) => sum + day.revenue, 0))}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.sales.reduce((sum: number, day: any) => sum + day.orders, 0)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {formatCurrency(
                    reportData.sales.reduce((sum: number, day: any) => sum + day.averageOrderValue, 0) /
                    reportData.sales.length
                  )}
                </p>
              </div>
            </>
          )}

          {params.type === 'products' && (
            <>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Products Sold</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.products.reduce((sum: number, product: any) => sum + product.sales, 0)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {formatCurrency(reportData.products.reduce((sum: number, product: any) => sum + product.revenue, 0))}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Inventory</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.products.reduce((sum: number, product: any) => sum + product.inventory, 0)}
                </p>
              </div>
            </>
          )}

          {params.type === 'customers' && (
            <>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.customers.newCustomers}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Repeat Customers</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.customers.repeatCustomers}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-medium text-gray-500">Churn Rate</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {reportData.customers.churnRate}%
                </p>
              </div>
            </>
          )}
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Data</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {params.type === 'sales' && (
                      <>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Revenue</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Orders</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Avg Order Value</th>
                      </>
                    )}
                    {params.type === 'products' && (
                      <>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sales</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Revenue</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Inventory</th>
                      </>
                    )}
                    {params.type === 'customers' && (
                      <>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Segment</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Count</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Percentage</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {params.type === 'sales' &&
                    reportData.sales.map((day: any, index: number) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{day.date}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(day.revenue)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{day.orders}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(day.averageOrderValue)}</td>
                      </tr>
                    ))}
                  {params.type === 'products' &&
                    reportData.products.map((product: any, index: number) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.sales}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.inventory}</td>
                      </tr>
                    ))}
                  {params.type === 'customers' &&
                    reportData.customers.customerSegments.map((segment: any, index: number) => {
                      const total = reportData.customers.customerSegments.reduce((sum: number, s: any) => sum + s.value, 0);
                      const percentage = ((segment.value / total) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{segment.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{segment.value}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{percentage}%</td>
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