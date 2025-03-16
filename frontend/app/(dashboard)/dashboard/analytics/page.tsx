'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import ChartComponent from '../reports/components/ChartComponent';
import { mockOrders, mockCustomers, mockInventory, formatCurrency } from '../mockData';

// Types
interface RevenueData {
  month: string;
  revenue: number;
  previousRevenue: number;
}

interface KPIData {
  current: number;
  previous: number;
  trend: 'up' | 'down';
}

interface KPIs {
  revenue: KPIData;
  orders: KPIData;
  customers: KPIData;
  averageOrder: KPIData;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface CustomerSegment {
  name: string;
  value: number;
}

// Mock data generation functions
const generateRevenueData = (): RevenueData[] => {
  const currentMonth = new Date().getMonth();
  const data = [];
  for (let i = 0; i < 12; i++) {
    const revenue = Math.floor(Math.random() * 50000) + 10000;
    data.push({
      month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      revenue,
      previousRevenue: Math.floor(Math.random() * revenue * 0.8) + 5000,
    });
  }
  return data;
};

const generateKPIs = (): KPIs => {
  const calculateKPI = (current: number, previous: number): KPIData => ({
    current,
    previous,
    trend: current >= previous ? 'up' : 'down',
  });

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0);
  const previousRevenue = totalRevenue * 0.9; // Simulated previous period

  const currentOrders = mockOrders.length;
  const previousOrders = Math.floor(currentOrders * 0.85);

  const currentCustomers = mockCustomers.length;
  const previousCustomers = Math.floor(currentCustomers * 0.8);

  const averageOrder = totalRevenue / currentOrders;
  const previousAverageOrder = previousRevenue / previousOrders;

  return {
    revenue: calculateKPI(totalRevenue, previousRevenue),
    orders: calculateKPI(currentOrders, previousOrders),
    customers: calculateKPI(currentCustomers, previousCustomers),
    averageOrder: calculateKPI(averageOrder, previousAverageOrder),
  };
};

const generateTopProducts = (): TopProduct[] => {
  return mockInventory
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      sales: Math.floor(Math.random() * 100) + 50,
      revenue: item.price * (Math.floor(Math.random() * 100) + 50),
      growth: Math.floor(Math.random() * 40) - 20,
    }));
};

const generateCustomerSegments = (): CustomerSegment[] => {
  const active = mockCustomers.filter(c => c.status === 'Active').length;
  const inactive = mockCustomers.filter(c => c.status === 'Inactive').length;
  const vip = mockCustomers.filter(c => c.totalSpent > 1000).length;
  const regular = active - vip;

  return [
    { name: 'Regular', value: regular },
    { name: 'VIP', value: vip },
    { name: 'Inactive', value: inactive },
  ];
};

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [kpis, setKPIs] = useState<KPIs | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRevenueData(generateRevenueData());
      setKPIs(generateKPIs());
      setTopProducts(generateTopProducts());
      setCustomerSegments(generateCustomerSegments());
      setLoading(false);
    };

    fetchData();
  }, []);

  const getKPIIcon = (kpiType: string) => {
    switch (kpiType) {
      case 'revenue':
        return CurrencyDollarIcon;
      case 'orders':
        return ShoppingCartIcon;
      case 'customers':
        return UserGroupIcon;
      case 'averageOrder':
        return ChartBarIcon;
      default:
        return ChartBarIcon;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis && Object.entries(kpis).map(([key, data]) => {
          const Icon = getKPIIcon(key);
          const percentChange = ((data.current - data.previous) / data.previous) * 100;
          
          return (
            <div key={key} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {percentChange >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                  {Math.abs(percentChange).toFixed(1)}%
                </span>
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-500 uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {key === 'revenue' || key === 'averageOrder' 
                  ? formatCurrency(data.current)
                  : data.current.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
        <div className="h-80">
          <ChartComponent
            type="line"
            data={{
              labels: revenueData.map(d => d.month),
              datasets: [
                {
                  label: 'Current Year',
                  data: revenueData.map(d => d.revenue),
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
                {
                  label: 'Previous Year',
                  data: revenueData.map(d => d.previousRevenue),
                  borderColor: '#9CA3AF',
                  backgroundColor: 'rgba(156, 163, 175, 0.1)',
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value: number) => formatCurrency(value),
                  },
                },
              },
            }}
            height={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Sales</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="text-right">{product.sales}</td>
                    <td className="text-right">{formatCurrency(product.revenue)}</td>
                    <td className={`text-right ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Segments</h2>
          <div className="h-64">
            <ChartComponent
              type="pie"
              data={{
                labels: customerSegments.map(segment => segment.name),
                datasets: [
                  {
                    data: customerSegments.map(segment => segment.value),
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
              height={250}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 