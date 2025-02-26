import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const TransactionList = () => {
  // Dummy transactions data
  const dummyTransactions = [
    {
      _id: 1,
      description: "Salary Deposit",
      date: "2024-03-15",
      amount: 45000,
      transactionType: "credit"
    },
    {
      _id: 2,
      description: "Rent Payment",
      date: "2024-03-14",
      amount: 15000,
      transactionType: "debit"
    },
    {
      _id: 3,
      description: "Freelance Work",
      date: "2024-03-13",
      amount: 25000,
      transactionType: "credit"
    },
    {
      _id: 4,
      description: "Grocery Shopping",
      date: "2024-03-12",
      amount: 3500,
      transactionType: "debit"
    },
    {
      _id: 5,
      description: "Client Payment",
      date: "2024-03-11",
      amount: 30000,
      transactionType: "credit"
    }
  ];

  return (
    <div>
      <h3 className="text-base sm:text-xl font-semibold dark:text-white  text-gray-800 mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {dummyTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-gray-50 dark:bg-gray-600 dark:text-white p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    transaction.transactionType === "credit"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.transactionType === "credit" ? (
                    <AiOutlineArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <AiOutlineArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs dark:text-white sm:text-sm font-medium text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-[10px] sm:text-xs dark:text-gray-400 text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  transaction.transactionType === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.transactionType === "credit" ? "+" : "-"}
                {transaction.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
