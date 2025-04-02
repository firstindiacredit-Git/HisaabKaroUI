import React from 'react';

export const GridSkeleton = () => {
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

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden border border-gray-200">
            {/* Status Notch */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 bg-gray-200"></div>

            {/* Index Number */}
            <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
              <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Header */}
            <div className="flex items-start space-x-3 mb-6 mt-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-4 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Description */}
            <div className="mb-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
