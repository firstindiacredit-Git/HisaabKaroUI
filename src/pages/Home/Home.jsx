import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import HomeSummary from "./HomeSummary";
import HomeSummarySkeleton from "../../components/Skeletons/HomeSummarySkeleton";
import { useAuth } from "../../context/AuthContext";

// Lazy load the chart components
const BarChart = React.lazy(() => import("./BarChart"));
const PieChart = React.lazy(() => import("./PieChart"));
const TransactionList = React.lazy(() => import("./TransactionList"));
const TransactionDetails = React.lazy(() => import("./TransactionDetails"));

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth() || {};
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        let creditSum = 0;
        let debitSum = 0;

        response.data.forEach((transaction) => {
          if (transaction.transactionType === "credit") {
            creditSum += transaction.amount;
          } else {
            debitSum += transaction.amount;
          }
        });

        setTotalCredit(creditSum);
        setTotalDebit(Math.abs(debitSum));
        setTotalBalance(creditSum - Math.abs(debitSum));
      } catch (error) {
        console.error("Error fetching totals:", error);
        // toast.error("Failed to load financial summary");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [clientTransactionsRes, transactionsRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_URL}/api/collab-transactions/client-transactions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.REACT_APP_URL}/api/collab-transactions/transactions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const clientTransactions = await clientTransactionsRes.json();
        const transactionsData = await transactionsRes.json();

        const processedClientTransactions = (clientTransactions.transactions || []).map((transaction) => {
          const confirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const confirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const outstandingBalance = confirmedYouWillGet - confirmedYouWillGive;

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            outstandingBalance,
          };
        });

        const processedTransactions = (transactionsData.transactions || []).map((transaction) => {
          const confirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const confirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const outstandingBalance = confirmedYouWillGet - confirmedYouWillGive;

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            outstandingBalance,
          };
        });

        const allTransactions = [...processedClientTransactions, ...processedTransactions];
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchTransactions();
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      <div className="max-w-7xl bg-white dark:bg-gray-800 mx-auto p-4 sm:p-6">
        {/* Header - Hidden on mobile */}
        <div className="hidden sm:block mb-8 text-center">
          <h1 className="text-3xl dark:text-white font-bold text-gray-800 mb-2">
            Financial Dashboard
          </h1>
          <p className="dark:text-gray-400 text-gray-600">
            Track your transactions and financial activities
          </p>
        </div>

        {isLoading ? (
          <HomeSummarySkeleton />
        ) : (
          <HomeSummary transactions={transactions} />
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 dark:bg-gray-800 bg-white lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-700 p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-base dark:text-white sm:text-xl font-semibold text-gray-800 mb-1">
              Weekly Activity
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Credit and debit transactions for the week
            </p>
            <div className="p-2 sm:p-4">
              <Suspense
                fallback={
                  <div className="h-48 sm:h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                }
              >
                <BarChart />
              </Suspense>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl dark:text-white font-semibold text-gray-800 mb-6">
              Books/Clients Statistics
            </h3>
            <div className="p-4">
              <Suspense
                fallback={
                  <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                }
              >
                <PieChart />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 dark:bg-gray-700 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Suspense
              fallback={
                <div className="h-48 sm:h-64 dark:bg-gray-600 bg-gray-100 animate-pulse rounded-lg"></div>
              }
            >
              <TransactionList />
            </Suspense>
          </div>
          <div className="bg-white p-6 dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Suspense
              fallback={
                <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              }
            >
              <TransactionDetails />
            </Suspense>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="flex justify-center py-6">
          <button
            onClick={handleDashboardClick}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

