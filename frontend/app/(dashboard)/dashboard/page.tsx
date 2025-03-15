'use client';

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { cn } from '@/src/lib/utils';
import { SalesOverview } from '@/src/components/dashboard/SalesOverview';
import { RecentOrders } from '@/src/components/dashboard/RecentOrders';

const stats = [
  {
    name: 'Total Revenue',
    value: '$405,091.00',
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Total Orders',
    value: '2,345',
    change: '+5.25%',
    changeType: 'positive',
  },
  {
    name: 'Average Order Value',
    value: '$172.73',
    change: '-1.39%',
    changeType: 'negative',
  },
  {
    name: 'Active Customers',
    value: '1,234',
    change: '+2.15%',
    changeType: 'positive',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {stat.name}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                {stat.value}
              </div>

              <div
                className={cn(
                  stat.changeType === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                  'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                )}
              >
                {stat.changeType === 'positive' ? (
                  <ArrowUpIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}
                {stat.change}
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Add more dashboard components here */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="min-h-96 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Sales Overview
            </h3>
            <SalesOverview />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Orders
            </h3>
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
} 