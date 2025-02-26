import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSwap, AiOutlineClockCircle } from "react-icons/ai";

const HomeSummary = ({ transactions }) => {
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
    <div className="grid grid-cols-3 gap-1.5 md:gap-4 mb-6 max-w-5xl mx-auto px-2 md:px-4">
      <div className="relative overflow-hidden  bg-gradient-to-br from-green-50 to-emerald-50 p-2 sm:p-3.5 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-300">
        <div className="relative">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-[10px] sm:text-sm font-medium text-green-800 truncate pr-1">
              {t("transactions.totalYouWillGet")}
            </h3>
            <div className="p-0.5 sm:p-1.5 bg-green-100 rounded-md flex-shrink-0">
              <AiOutlineArrowDown className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
          </div>
          <p className="text-sm sm:text-2xl font-bold text-green-600 mb-0.5 sm:mb-1">
            {totalWillGet.toLocaleString('en-IN')}
          </p>
          {unconfirmedWillGet > 0 && (
            <div className="flex flex-wrap items-center text-[8px] sm:text-xs bg-white/50 rounded-md p-0.5 sm:p-1.5">
              <AiOutlineClockCircle className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-green-500 mr-0.5" />
              <span className="text-green-600 font-medium">+</span>
              <span className="text-green-600 font-medium ml-0.5">
                {unconfirmedWillGet.toLocaleString('en-IN')}
              </span>
              <span className="text-green-500 ml-0.5 whitespace-nowrap">
                {t("transactions.unconfirmed")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 p-2 sm:p-3.5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-all duration-300">
        <div className="relative">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-[10px] sm:text-sm font-medium text-red-800 truncate pr-1">
              {t("transactions.totalYouWillGive")}
            </h3>
            <div className="p-0.5 sm:p-1.5 bg-red-100 rounded-md flex-shrink-0">
              <AiOutlineArrowUp className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-red-600" />
            </div>
          </div>
          <p className="text-sm sm:text-2xl font-bold text-red-600 mb-0.5 sm:mb-1">
            {totalWillGive.toLocaleString('en-IN')}
          </p>
          {unconfirmedWillGive > 0 && (
            <div className="flex flex-wrap items-center text-[8px] sm:text-xs bg-white/50 rounded-md p-0.5 sm:p-1.5">
              <AiOutlineClockCircle className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-red-500 mr-0.5" />
              <span className="text-red-600 font-medium">+</span>
              <span className="text-red-600 font-medium ml-0.5">
                {unconfirmedWillGive.toLocaleString('en-IN')}
              </span>
              <span className="text-red-500 ml-0.5 whitespace-nowrap">
                {t("transactions.unconfirmed")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-3.5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
        <div className="relative">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-[10px] sm:text-sm font-medium text-blue-800 truncate pr-1">
              {t("transactions.totalOutstanding")}
            </h3>
            <div className="p-0.5 sm:p-1.5 bg-blue-100 rounded-md flex-shrink-0">
              <AiOutlineSwap className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </div>
          <p className={`text-sm sm:text-2xl font-bold mb-0.5 sm:mb-1 ${
            totalOutstanding >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {Math.abs(totalOutstanding).toLocaleString('en-IN')}
          </p>
          {(unconfirmedWillGet > 0 || unconfirmedWillGive > 0) && (
            <div className="flex flex-wrap items-center text-[8px] sm:text-xs bg-white/50 rounded-md p-0.5 sm:p-1.5">
              <AiOutlineClockCircle className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-gray-500 mr-0.5" />
              <span className="text-gray-600">
                {t("transactions.afterSettlement")}:
              </span>
              <span className={`font-medium ml-0.5 ${
                potentialOutstanding >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {Math.abs(potentialOutstanding).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSummary;
