import { Suspense } from 'react';
import ReportClient from './ReportClient';

// This is a Server Component
export function generateStaticParams() {
  // Pre-render these report types at build time
  return [
    { type: 'sales' },
    { type: 'products' },
    { type: 'customers' },
    { type: 'inventory' }
  ];
}

export default function DetailedReportPage() {
  return (
    <Suspense fallback={<div className="mt-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span className="ml-2 text-gray-600">Loading report data...</span>
    </div>}>
      <ReportClient />
    </Suspense>
  );
} 