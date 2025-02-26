import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const MobileListView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1.5">
      {transactions
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((transaction, index) => {
          const hasUnconfirmedBalance = transaction.unconfirmedYouWillGet > 0 || transaction.unconfirmedYouWillGive > 0;
          const unconfirmedBalance = transaction.unconfirmedYouWillGet - transaction.unconfirmedYouWillGive;
          
          return (
            <div
              key={transaction._id}
              onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
              className="bg-white rounded-md shadow-sm relative overflow-hidden"
            >
              {/* Main Content */}
              <div className="px-2.5 py-2 flex items-center space-x-2">
                {/* Index Badge */}
                <div className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {((currentPage - 1) * pageSize) + index + 1}
                  </span>
                </div>

                {/* Avatar Circle */}
                <div className="w-7 h-7 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {(transaction.source === "client"
                      ? transaction.userId?.name
                      : transaction.clientUserId?.name || "N/A"
                    ).charAt(0)}
                  </span>
                </div>

                {/* Transaction Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-gray-900 truncate pr-2">
                      {transaction.source === "client"
                        ? transaction.userId?.name || "N/A"
                        : transaction.clientUserId?.name || "N/A"}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-medium ${
                        transaction.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                          {Math.abs(transaction.outstandingBalance || 0)}
                      </span>
                      {hasUnconfirmedBalance && (
                        <div className="flex items-center text-[10px]">
                          <AiOutlineClockCircle className="w-3 h-3 text-gray-400 mr-0.5" />
                          <span className={`${
                            unconfirmedBalance >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                              {Math.abs(unconfirmedBalance)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* Transaction Summary Bar */}
              <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 text-[10px]">
                <div className="py-1 px-2">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-gray-500">{t("transactions.youWillGet")}:</span>
                    <span className="font-medium text-green-600">
                        {transaction.confirmedYouWillGet || 0}
                    </span>
                  </div>
                  {transaction.unconfirmedYouWillGet > 0 && (
                    <div className="flex items-center justify-center space-x-0.5">
                      <AiOutlineClockCircle className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-gray-400">
                        +  {transaction.unconfirmedYouWillGet}
                      </span>
                    </div>
                  )}
                </div>
                <div className="py-1 px-2">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-gray-500">{t("transactions.youWillGive")}:</span>
                    <span className="font-medium text-red-600">
                        {transaction.confirmedYouWillGive || 0}
                    </span>
                  </div>
                  {transaction.unconfirmedYouWillGive > 0 && (
                    <div className="flex items-center justify-center space-x-0.5">
                      <AiOutlineClockCircle className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-gray-400">
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

export default MobileListView;