import React from 'react';
import { TableSkeleton } from './TableSkeleton';
import { GridSkeleton } from './GridSkeleton';

export const DashboardSkeleton = ({ viewMode }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* Transaction Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="flex items-center space-x-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      {viewMode === 'grid' ? <GridSkeleton /> : <TableSkeleton />}

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
