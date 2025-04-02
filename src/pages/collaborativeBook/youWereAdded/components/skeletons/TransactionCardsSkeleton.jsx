import React from 'react';
import { Skeleton } from 'antd';

export const TransactionCardsSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Transaction Header Skeleton */}
        <div className="p-3 border-b border-gray-100">
          <Skeleton.Input
            style={{ width: 200, height: 24 }}
            active
            size="small"
          />
        </div>

        {/* Card Items Skeleton */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-100"
          >
            <div className="flex items-center space-x-2">
              <Skeleton.Avatar active size="small" />
              <Skeleton.Input style={{ width: 60 }} active size="small" />
            </div>
            <Skeleton.Input style={{ width: 80 }} active size="small" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="relative bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Skeleton.Avatar active size="small" />
            <div className="ml-2 flex-1">
              <Skeleton.Input style={{ width: "100%" }} active size="small" />
            </div>
          </div>
          <Skeleton.Input style={{ width: "100%" }} active size="small" />
        </div>
      ))}
    </div>
  );
};

export default TransactionCardsSkeleton;