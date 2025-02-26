import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaBook,
  FaIdCard,
  FaHandHoldingUsd,
  FaReceipt,
  FaFileInvoiceDollar,
  FaTools,
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import SidebarTransactionSummary from "../../components/Dashboard/SidebarTransactionSummary";

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollabOpen, setCollabOpen] = useState(false);
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
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

        const processedClientTransactions = (
          clientTransactions.transactions || []
        ).map((transaction) => {
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

        const processedTransactions = (transactionsData.transactions || []).map(
          (transaction) => {
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

            const outstandingBalance =
              confirmedYouWillGet - confirmedYouWillGive;

            return {
              ...transaction,
              confirmedYouWillGet,
              confirmedYouWillGive,
              unconfirmedYouWillGet,
              unconfirmedYouWillGive,
              outstandingBalance,
            };
          }
        );

        const allTransactions = [
          ...processedClientTransactions,
          ...processedTransactions,
        ];
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (isLoggedIn) {
      fetchTransactions();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  // eslint-disable-next-line
  const toggleCollabDropdown = () => {
    setCollabOpen(!isCollabOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    {
      path: "/dashboard",
      icon: FaTachometerAlt,
      label: t("navigation.dashboard"),
    },
    {
      path: "/your-books",
      icon: FaFileInvoiceDollar,
      label: t("navigation.selfRecord"),
    },
    { path: "/book", icon: FaBook, label: t("navigation.books") },
    { path: "/users", icon: FaUsers, label: t("navigation.users") },
    // { path: "/loans", icon: FaHandHoldingUsd, label: t('navigation.loans') },
    { path: "/invoice", icon: FaReceipt, label: t("navigation.invoice") },
    { path: "/tools", icon: FaTools, label: "Tools" },
  ];

  return (
    <div className="fixed left-0 h-screen text-white dark:bg-gray-700 w-50 bg-gradient-to-b from-slate-50 to-slate-100 shadow-lg flex flex-col">
      {/* Logo Section with glass effect */}
      <div className="relative p-[1.19rem] dark:bg-gray-800 border-b border-slate-200 dark:border-gray-600 bg-[#f3f7fa] bg-opacity-70 backdrop-blur-sm ">
        <div className="flex items-center gap-3 ">
          <div className="rounded-lg">
            <img
              src={`${process.env.PUBLIC_URL}/favicon.png`}
              alt="Logo"
              className="h-9"
            />
          </div>
          <span className="text-2xl dark:text-white font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
            Hisaab करो!
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 dark:bg-gray-600 bg-gray-50 dark:text-white px-3 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative group flex dark:text-white items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white hover:dark:bg-gray-700 hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            <item.icon
              className={`text-lg ${
                isActive(item.path)
                  ? "text-white"
                  : "text-blue-600 group-hover:text-blue-600"
              }`}
            />
            <span className="ml-3 font-medium">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}
          </Link>
        ))}

        {/* {isLoggedIn && (
          <Link
            to="/profile"
            className={`relative group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/profile")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            <FaIdCard
              className={`text-lg ${
                isActive("/profile")
                  ? "text-white"
                  : "text-blue-500 group-hover:text-blue-600"
              }`}
            />
            <span className="ml-3 font-medium">{t("common.profile")}</span>
            {isActive("/profile") && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}
          </Link>
        )} */}
      </nav>

      {/* Transaction Summary Section */}
      {location.pathname !== "/dashboard" && location.pathname !== "/home" && (
        <div className="px-2 py-0.5 border-t border-slate-200 dark:border-gray-600 bg-gray-50 dark:text-white dark:bg-gray-600">
          <h2 className="text-[9px] dark:text-white font-semibold text-slate-600 mb-0.5">
            {t("transactions.summary")}
          </h2>
          <SidebarTransactionSummary transactions={transactions} />
        </div>
      )}

      {/* Logout Button */}
      {/* <div className="p-1.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 hover:scale-[1.02]"
        >
          <FaSignOutAlt className="text-lg text-blue-500" />
          <span className="ml-3 font-medium">{t("common.logout")}</span>
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
