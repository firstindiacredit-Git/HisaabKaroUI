import React from 'react';

export const TableSkeleton = () => {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Transaction Header Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="relative z-5 mb-6 mt-6">
        <div className="hidden sm:flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Filter Controls Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm mb-4">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="flex items-center space-x-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Date', 'Initiated By', 'Type', 'Amount', 'Description', 'File', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
