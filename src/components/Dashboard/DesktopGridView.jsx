import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const DesktopGridView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-4">
      {transactions
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((transaction, index) => {
          const hasUnconfirmedBalance = transaction.unconfirmedYouWillGet > 0 || transaction.unconfirmedYouWillGive > 0;
          const unconfirmedBalance = transaction.unconfirmedYouWillGet - transaction.unconfirmedYouWillGive;
          
          return (
            <div
              key={transaction._id}
              onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium  text-gray-600 dark:text-gray-400">
                    {((currentPage - 1) * pageSize) + index + 1}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-700 flex-shrink-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {(transaction.source === "client"
                      ? transaction.userId?.name
                      : transaction.clientUserId?.name || "N/A"
                    ).charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {transaction.source === "client"
                      ? transaction.userId?.name || "N/A"
                      : transaction.clientUserId?.name || "N/A"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {transaction.source === "client" ? (
                      <AiOutlineArrowLeft className="text-blue-500 mr-1 flex-shrink-0" />
                    ) : (
                      <AiOutlineArrowRight className="text-orange-500 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Outstanding Balance */}
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("transactions.outstandingBalance")}</span>
                  <span className={`text-lg font-medium ${
                    transaction.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                      {Math.abs(transaction.outstandingBalance || 0)}
                  </span>
                </div>
                {hasUnconfirmedBalance && (
                  <div className="flex items-center justify-end text-xs mt-1">
                    <AiOutlineClockCircle className="w-4 h-4 text-gray-400 mr-1" />
                    <span className={`${
                      unconfirmedBalance >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {Math.abs(unconfirmedBalance)}
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-500 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-green-600 dark:text-green-700">{t("transactions.youWillGet")}</div>
                    <div className="text-base font-medium text-green-600 dark:text-green-700">
                        {transaction.confirmedYouWillGet || 0}
                    </div>
                  </div>
                  {transaction.unconfirmedYouWillGet > 0 && (
                    <div className="flex items-center justify-between text-xs bg-white/50 dark:bg-green-700 rounded-md px-2 py-1">
                      <AiOutlineClockCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-500 dark:text-green-400 font-medium">
                        +  {transaction.unconfirmedYouWillGet}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-red-600 dark:text-red-500">{t("transactions.youWillGive")}</div>
                    <div className="text-base font-medium text-red-600 dark:text-red-500">
                        {transaction.confirmedYouWillGive || 0}
                    </div>
                  </div>
                  {transaction.unconfirmedYouWillGive > 0 && (
                    <div className="flex items-center justify-between text-xs  bg-white/50 dark:bg-red-700 rounded-md px-2 py-1">
                      <AiOutlineClockCircle className="w-3.5 h-3.5  text-red-300" />
                      <span className="text-red-500 dark:text-red-300 font-medium">
                        +  {transaction.unconfirmedYouWillGive}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DesktopGridView; 