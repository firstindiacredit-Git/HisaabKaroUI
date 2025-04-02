import React from 'react';
import { AiOutlineCheckCircle, AiOutlineClockCircle } from 'react-icons/ai';

const GridView = ({ transactions, handleFileClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {transactions.map((entry) => (
        <div
          key={entry._id}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden ${
            entry.confirmationStatus === "pending"
              ? "border border-yellow-200 dark:border-yellow-500"
              : entry.transactionType === "you will get"
              ? "border border-red-200 dark:border-red-500"
              : "border border-green-200 dark:border-green-700"
          }`}
        >
          {/* Status Notch */}
          <div
            className={`absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 ${
              entry.confirmationStatus === "pending"
                ? "bg-yellow-200 dark:bg-yellow-500"
                : entry.transactionType === "you will get"
                ? "bg-red-200 dark:bg-red-500"
                : "bg-green-200 dark:bg-green-700"
            }`}
          />

          {/* User Info */}
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-12 h-12 dark:bg-gray-900 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {entry.initiatedBy.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium dark:text-gray-100 text-gray-900">
                {entry.initiatedBy}
              </h3>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium ${
                  entry.transactionType === "you will get"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <span
                  className={
                    entry.transactionType === "you will get"
                      ? "text-red-800"
                      : "text-green-800"
                  }
                >
                  {entry.transactionType === "you will get"
                    ? "you will give"
                    : "you will get"}
                </span>
              </span>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
                {entry.description || "No description"}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <span
              className={`text-3xl font-bold ${
                entry.transactionType === "you will get"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {entry.amount?.toFixed(2) || "0.00"}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(entry.transactionDate).toLocaleString()}
            </p>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              {entry.confirmationStatus === "confirmed" ? (
                <span className="flex items-center text-green-600">
                  <AiOutlineCheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm">Confirmed</span>
                </span>
              ) : (
                <span className="flex items-center text-yellow-600">
                  <AiOutlineClockCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm">Pending</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {entry.file && (
                <button
                  onClick={() => handleFileClick(entry.file)}
                  className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${
                    entry.file.toLowerCase().endsWith(".pdf")
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                  title={
                    entry.file.toLowerCase().endsWith(".pdf")
                      ? "View PDF"
                      : "View Image"
                  }
                >
                  {entry.file.toLowerCase().endsWith(".pdf") ? (
                    <BsFilePdf className="w-5 h-5" />
                  ) : (
                    <AiOutlineFileImage className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;