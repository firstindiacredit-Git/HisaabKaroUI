import React from 'react';

export const GridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div
          key={index}
          className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header Section */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* You Will Get */}
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
              </div>

              {/* You Will Give */}
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
              </div>
            </div>

            {/* Outstanding Balance */}
            <div className="pt-3 border-t border-gray-100">
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
