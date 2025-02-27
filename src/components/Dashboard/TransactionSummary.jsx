import React from "react";
import { useTranslation } from "react-i18next";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineSwap,
  AiOutlineClockCircle,
} from "react-icons/ai";

const TransactionSummary = ({ transactions }) => {
  const { t } = useTranslation();

  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        const unconfirmedBalance =
          transaction.unconfirmedYouWillGet -
          transaction.unconfirmedYouWillGive;
        return {
          totalWillGet: acc.totalWillGet + transaction.confirmedYouWillGet,
          totalWillGive: acc.totalWillGive + transaction.confirmedYouWillGive,
          totalOutstanding:
            acc.totalOutstanding + transaction.outstandingBalance,
          unconfirmedWillGet:
            acc.unconfirmedWillGet + transaction.unconfirmedYouWillGet,
          unconfirmedWillGive:
            acc.unconfirmedWillGive + transaction.unconfirmedYouWillGive,
          totalUnconfirmedBalance:
            acc.totalUnconfirmedBalance + unconfirmedBalance,
        };
      },
      {
        totalWillGet: 0,
        totalWillGive: 0,
        totalOutstanding: 0,
        unconfirmedWillGet: 0,
        unconfirmedWillGive: 0,
        totalUnconfirmedBalance: 0,
      }
    );
  };

  const {
    totalWillGet,
    totalWillGive,
    totalOutstanding,
    unconfirmedWillGet,
    unconfirmedWillGive,
    totalUnconfirmedBalance,
  } = calculateTotals();

  const potentialOutstanding = totalOutstanding + totalUnconfirmedBalance;

  return (
    <div className="mb-4 md:mb-6">
      {/* Container with no horizontal scroll on mobile */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 px-2 md:px-0 w-full mx-auto">
        {/* You Will Get Card - Smaller on mobile */}
        <div className="relative overflow-hidden bg-green-50 dark:border-green-500 dark:bg-green-500 p-2 md:p-3.5 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h3 className="text-xs md:text-sm font-medium text-green-800 dark:text-green-200 truncate pr-1 md:pr-2">
                {t("transactions.totalYouWillGet")}
              </h3>
              <div className="p-1 md:p-1.5 bg-green-100 dark:bg-green-200 rounded-md flex-shrink-0">
                <AiOutlineArrowDown className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-800" />
              </div>
            </div>
            <p className="text-base md:text-2xl font-bold text-green-600 dark:text-green-200 mb-0.5 md:mb-1">
              {totalWillGet.toLocaleString("en-IN")}
            </p>
            {unconfirmedWillGet > 0 && (
              <div className="flex items-center text-[10px] md:text-xs bg-white/50 rounded-md p-1 md:p-1.5">
                <AiOutlineClockCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 dark:text-green-700 text-green-500 mr-0.5 md:mr-1" />
                <span className="text-green-600 font-medium">+</span>
                <span className="text-green-600 dark:text-green-700 font-medium ml-0.5 md:ml-1">
                  {unconfirmedWillGet.toLocaleString("en-IN")}
                </span>
                <span className="text-green-500 dark:text-green-700 ml-0.5 md:ml-1 hidden md:inline">
                  {t("transactions.unconfirmed")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* You Will Give Card - Smaller on mobile */}
        <div className="relative overflow-hidden bg-red-50 dark:border-red-500 dark:bg-red-500 p-2 md:p-3.5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h3 className="text-xs md:text-sm font-medium text-red-800 dark:text-red-200  truncate pr-1 md:pr-2">
                {t("transactions.totalYouWillGive")}
              </h3>
              <div className="p-1 md:p-1.5 bg-red-100 dark:bg-red-200 rounded-md flex-shrink-0">
                <AiOutlineArrowUp className="w-3 h-3 md:w-4 md:h-4 text-red-600 dark:text-red-800" />
              </div>
            </div>
            <p className="text-base md:text-2xl font-bold text-red-600 dark:text-red-200 mb-0.5 md:mb-1">
              {totalWillGive.toLocaleString("en-IN")}
            </p>
            {unconfirmedWillGive > 0 && (
              <div className="flex items-center text-[10px] md:text-xs bg-white/50 rounded-md p-1 md:p-1.5">
                <AiOutlineClockCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-red-500 mr-0.5 md:mr-1" />
                <span className="text-red-600 font-medium">+</span>
                <span className="text-red-600 font-medium ml-0.5 md:ml-1">
                  {unconfirmedWillGive.toLocaleString("en-IN")}
                </span>
                <span className="text-red-500 dark:text-red-700 ml-0.5 md:ml-1 hidden md:inline">
                  {t("transactions.unconfirmed")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Outstanding Balance Card - Smaller on mobile */}
        <div className="relative overflow-hidden bg-blue-50 dark:border-blue-500 dark:bg-blue-500  p-2 md:p-3.5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <h3 className="text-xs md:text-sm font-medium text-blue-800 truncate pr-1 md:pr-2">
                {t("transactions.totalOutstanding")}
              </h3>
              <div className="p-1 md:p-1.5 bg-blue-100 dark:bg-blue-200 rounded-md flex-shrink-0">
                <AiOutlineSwap className="w-3 h-3 md:w-4 md:h-4 text-blue-600 dark:text-blue-800" />
              </div>
            </div>
            <p
              className={`text-base md:text-2xl font-bold mb-0.5 md:mb-1 ${
                totalOutstanding >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {/* {Math.abs(totalOutstanding).toLocaleString("en-IN")} */}
              {totalOutstanding < 0 ? (
                <span className="text-red-600 ml-2">
                  <AiOutlineArrowDown className="inline w-4 h-4" />
                  {Math.abs(totalOutstanding).toLocaleString("en-IN")}
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-200 ml-2">
                  <AiOutlineArrowUp className="inline w-4 h-4" />
                  {Math.abs(totalOutstanding).toLocaleString("en-IN")}
                </span>
              )}
            </p>
            {(unconfirmedWillGet > 0 || unconfirmedWillGive > 0) && (
              <div className="flex items-center text-[10px] md:text-xs bg-white/50 rounded-md p-1 md:p-1.5">
                <AiOutlineClockCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-gray-500 mr-0.5 md:mr-1" />
                <span className="text-gray-600 hidden md:inline">
                  {t("transactions.afterSettlement")}:
                </span>
                <span
                  className={`font-medium ml-0.5 md:ml-1 ${
                    potentialOutstanding >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.abs(potentialOutstanding).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
