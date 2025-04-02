import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import TransactionSummary from "../../components/Dashboard/TransactionSummary";
import MobileListView from "../../components/Dashboard/MobileListView";
import MobileGridView from "../../components/Dashboard/MobileGridView";
import DesktopTableView from "../../components/Dashboard/DesktopTableView";
import DesktopGridView from "../../components/Dashboard/DesktopGridView";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import Pagination from "../../components/Dashboard/Pagination";
import { DashboardSkeleton } from "../../components/Dashboard/skeletons/DashboardSkeleton";

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("dashboardViewMode") || 'list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dashboardViewMode", mode);
  };

  const fetchAllTransactions = async () => {
    setLoading(true);
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

      const clientTransactionsWithSource = (
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
          source: "client",
          transactionId: transaction._id,
        };
      });

      const transactionsWithSource = (transactionsData.transactions || []).map(
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

          const outstandingBalance = transaction.outstandingBalance;

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            outstandingBalance,
            source: "transaction",
            transactionId: transaction._id,
          };
        }
      );

      setTransactions([
        ...clientTransactionsWithSource,
        ...transactionsWithSource,
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const bookName = transaction.bookId?.bookname || '';
      return bookName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const viewTransactionDetails = (transactionId, source) => {
    if (source === "client") {
      navigate(`/transaction-details/${transactionId}`);
    } else {
      navigate(`/history/${transactionId}`);
    }
  };

  const addTransaction = () => {
    navigate("/addtransaction");
  };

  const transactionsFromSource = filteredTransactions
    .filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      const name =
        transaction.source === "client"
          ? transaction.userId?.name
          : transaction.clientUserId?.name;
      const bookName = transaction.bookId?.bookname;

      return (
        !searchTerm ||
        (name && name.toLowerCase().includes(searchLower)) ||
        (bookName && bookName.toLowerCase().includes(searchLower))
      );
    })
    .map((transaction, index) => ({
      ...transaction,
      index: (currentPage - 1) * pageSize + index + 1
    }));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, transactionsFromSource.length);
  const currentTransactions = transactionsFromSource.slice(startIndex, endIndex);

  if (loading) {
    return <DashboardSkeleton viewMode={viewMode} />;
  }

  return (
    <div className="p-4 w-full md:p-6  mx-auto dark:bg-gray-900 bg-gray-50 min-h-screen">
      {filteredTransactions.length > 0 && (
        <TransactionSummary transactions={filteredTransactions} />
      )}

      <DashboardHeader
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        viewMode={viewMode}
        setViewMode={handleViewModeChange}
        onAddTransaction={addTransaction}
        onRefresh={fetchAllTransactions}
      />

      {transactionsFromSource.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 dark:bg-gray-800 bg-white rounded-2xl shadow-sm">
          <div className="text-lg text-gray-600 mb-6">
            {t("common.noRecordsFound")}
          </div>
          <button
            onClick={addTransaction}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("transactions.addYourFirstTransaction")}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Views */}
          <div className="block md:hidden">
            {viewMode === "list" ? (
              <MobileListView
                transactions={currentTransactions}
                currentPage={currentPage}
                pageSize={pageSize}
                onTransactionClick={viewTransactionDetails}
              />
            ) : (
              <MobileGridView
                transactions={currentTransactions}
                currentPage={currentPage}
                pageSize={pageSize}
                onTransactionClick={viewTransactionDetails}
              />
            )}
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={transactionsFromSource.length}
              onPageChange={setCurrentPage}
              isMobile={true}
            />
          </div>

          {/* Desktop Views */}
          <div className="hidden  md:block">
            {viewMode === "list" ? (
              <DesktopTableView
                transactions={currentTransactions}
                currentPage={currentPage}
                pageSize={pageSize}
                onTransactionClick={viewTransactionDetails}
              />
            ) : (
              <DesktopGridView
                transactions={currentTransactions}
                currentPage={currentPage}
                pageSize={pageSize}
                onTransactionClick={viewTransactionDetails}
              />
            )}
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={transactionsFromSource.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
