import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const DesktopTableView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                #
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("common.name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("common.bookName")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("transactions.youWillGet")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("transactions.youWillGive")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("transactions.outstandingBalance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((transaction, index) => {
                const hasUnconfirmedBalance = transaction.unconfirmedYouWillGet > 0 || transaction.unconfirmedYouWillGive > 0;
                const unconfirmedBalance = transaction.unconfirmedYouWillGet - transaction.unconfirmedYouWillGive;
                
                return (
                  <tr
                    key={transaction.transactionId}
                    onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {transaction.source === "client" ? (
                          <AiOutlineArrowLeft className="text-blue-500 text-lg" />
                        ) : (
                          <AiOutlineArrowRight className="text-orange-500 text-lg" />
                        )}
                        <span>
                          {transaction.source === "client"
                            ? transaction.userId?.name || "N/A"
                            : transaction.clientUserId?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600">
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                            {transaction.confirmedYouWillGet || 0}
                        </div>
                        {transaction.unconfirmedYouWillGet > 0 && (
                          <div className="flex items-center justify-end text-xs text-gray-400 mt-0.5">
                            <AiOutlineClockCircle className="w-3 h-3 mr-1" />
                            +  {transaction.unconfirmedYouWillGet}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                            {transaction.confirmedYouWillGive || 0}
                        </div>
                        {transaction.unconfirmedYouWillGive > 0 && (
                          <div className="flex items-center justify-end text-xs text-gray-400 mt-0.5">
                            <AiOutlineClockCircle className="w-3 h-3 mr-1" />
                            +  {transaction.unconfirmedYouWillGive}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      transaction.outstandingBalance > 0
                        ? "text-green-600"
                        : transaction.outstandingBalance < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          transaction.outstandingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {Math.abs(transaction.outstandingBalance) || 0}
                        </div>
                        {hasUnconfirmedBalance && (
                          <div className="flex items-center justify-end text-xs mt-0.5">
                            <AiOutlineClockCircle className="w-3 h-3 text-gray-400 mr-1" />
                            <span className={`${
                              unconfirmedBalance >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                                {Math.abs(unconfirmedBalance)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesktopTableView; 