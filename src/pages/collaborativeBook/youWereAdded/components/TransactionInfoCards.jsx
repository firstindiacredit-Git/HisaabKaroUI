import React from "react";
import { Skeleton } from "antd";

const TransactionInfoCards = ({
  transaction,
  getFirstName,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="block sm:hidden dark:bg-gray-900 bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-3 border-b border-gray-100">
          Transaction Detail
        </h1>
        {/* Mobile cards layout */}
        // ...existing code from renderTransactionInfoCards() mobile section...
      </div>
    );
  }

  return (
    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Desktop cards layout */}
      // ...existing code from renderTransactionInfoCards() desktop section...
    </div>
  );
};

export default TransactionInfoCards;
