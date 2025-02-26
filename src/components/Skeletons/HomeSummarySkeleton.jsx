import React from 'react';

const HomeSummarySkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5 md:gap-4 mb-6 max-w-5xl mx-auto px-2 md:px-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="relative overflow-hidden bg-white p-2 sm:p-3.5 rounded-lg shadow-sm border border-gray-100 animate-pulse">
          <div className="relative">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 mb-0.5 sm:mb-1"></div>
            <div className="flex items-center mt-2">
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-full max-w-[120px]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSummarySkeleton; 