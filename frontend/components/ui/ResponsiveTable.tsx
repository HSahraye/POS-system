'use client';

import React from 'react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  actions?: (record: any) => React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  keyField,
  actions,
}) => {
  // Show standard table on desktop
  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {column.title}
              </th>
            ))}
            {actions && (
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((record) => (
            <tr key={record[keyField]} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={`${record[keyField]}-${column.key}`} className="px-4 py-3 text-sm">
                  {column.render ? column.render(record[column.key], record) : record[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right text-sm font-medium">
                  {actions(record)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Show card layout on mobile
  const renderMobileCards = () => (
    <div className="md:hidden space-y-4">
      {data.map((record) => (
        <div key={record[keyField]} className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex flex-wrap justify-between mb-2">
            <div className="font-medium text-gray-900">
              {/* Use the first column as the card title */}
              {columns[0].render 
                ? columns[0].render(record[columns[0].key], record) 
                : record[columns[0].key]}
            </div>
            {actions && (
              <div className="flex space-x-2">
                {actions(record)}
              </div>
            )}
          </div>
          
          <div className="space-y-2 mt-3">
            {columns.slice(1).map((column) => (
              <div key={`${record[keyField]}-${column.key}`} className="flex justify-between text-sm">
                <div className="text-gray-500 font-medium">{column.title}:</div>
                <div className="text-gray-900">
                  {column.render 
                    ? column.render(record[column.key], record) 
                    : record[column.key] || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {renderDesktopTable()}
      {renderMobileCards()}
    </div>
  );
}; 