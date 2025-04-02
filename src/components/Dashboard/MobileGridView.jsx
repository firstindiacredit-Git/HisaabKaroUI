import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const MobileGridView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2">
      {transactions
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((transaction, index) => {
          const hasUnconfirmedBalance = transaction.unconfirmedYouWillGet > 0 || transaction.unconfirmedYouWillGive > 0;
          const unconfirmedBalance = transaction.unconfirmedYouWillGet - transaction.unconfirmedYouWillGive;
          
          return (
            <div
              key={transaction._id}
              onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
              className="bg-white rounded-lg shadow-sm p-2.5 relative"
            >
              {/* Header with Index and Avatar */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {((currentPage - 1) * pageSize) + index + 1}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {(transaction.source === "client"
                      ? transaction.userId?.name
                      : transaction.clientUserId?.name || "N/A"
                    ).charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate">
                    {transaction.source === "client"
                      ? transaction.userId?.name || "N/A"
                      : transaction.clientUserId?.name || "N/A"}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    {transaction.source === "client" ? (
                      <AiOutlineArrowLeft className="text-blue-500 mr-0.5 w-3 h-3 flex-shrink-0" />
                    ) : (
                      <AiOutlineArrowRight className="text-orange-500 mr-0.5 w-3 h-3 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Outstanding Balance */}
              <div className="mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{t("transactions.outstandingBalance")}</span>
                  <span className={`text-sm font-medium ${
                    transaction.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                      {Math.abs(transaction.outstandingBalance || 0)}
                  </span>
                </div>
                {hasUnconfirmedBalance && (
                  <div className="flex items-center justify-end text-[10px] mt-0.5">
                    <AiOutlineClockCircle className="w-3 h-3 text-gray-400 mr-0.5" />
                    <span className={`${
                      unconfirmedBalance >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {Math.abs(unconfirmedBalance)}
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 rounded-md p-2">
                  <div className="text-green-600 mb-0.5">{t("transactions.youWillGet")}</div>
                  <div className="font-medium text-green-600">
                      {transaction.confirmedYouWillGet || 0}
                  </div>
                  {transaction.unconfirmedYouWillGet > 0 && (
                    <div className="flex items-center text-[10px] mt-0.5">
                      <AiOutlineClockCircle className="w-2.5 h-2.5 text-green-400 mr-0.5" />
                      <span className="text-green-500">
                        +  {transaction.unconfirmedYouWillGet}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-red-50 rounded-md p-2">
                  <div className="text-red-600 mb-0.5">{t("transactions.youWillGive")}</div>
                  <div className="font-medium text-red-600">
                      {transaction.confirmedYouWillGive || 0}
                  </div>
                  {transaction.unconfirmedYouWillGive > 0 && (
                    <div className="flex items-center text-[10px] mt-0.5">
                      <AiOutlineClockCircle className="w-2.5 h-2.5 text-red-400 mr-0.5" />
                      <span className="text-red-500">
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

export default MobileGridView;