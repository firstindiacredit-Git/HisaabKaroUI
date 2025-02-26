import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaTh,
  FaList,
  FaUser,
  FaArrowLeft,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Button, Input, Image, Tag, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const BookUsers = () => {
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [bookId]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.clientUserId.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPagedTransactions = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTransactions.map((transaction) => (
        <div
          key={transaction._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate(`/history/${transaction._id}`)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaMoneyBillWave className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {transaction.clientUserId.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {transaction.clientUserId.email}
                  </p>
                </div>
              </div>
              <Tag color={transaction.outstandingBalance > 0 ? "red" : "green"}>
                ₹{Math.abs(transaction.outstandingBalance)}
              </Tag>
            </div>

            {transaction.transactionHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Latest Transaction
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {transaction.transactionHistory[0].transactionType}
                    </span>
                    {/* <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{transaction.transactionHistory[0].amount}
                    </span> */}
                  </div>
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.transactionHistory[0].description}
                  </p> */}
                  <div className="mt-2 text-xs text-gray-400">
                    {moment(
                      transaction.transactionHistory[0].transactionDate
                    ).format("MMM DD, YYYY")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Outstanding Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {getPagedTransactions().map((transaction, index) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                onClick={() => navigate(`/history/${transaction._id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.clientUserId.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.clientUserId.email}
                      </div>
                    </div>
                  </div>    
                </td>
                <td className="px-6 py-4 rounded-4xl whitespace-nowrap">
                  <Tag
                    color={transaction.outstandingBalance > 0 ? "green" : "red"}
                  >
                    ₹{Math.abs(transaction.outstandingBalance)}
                  </Tag>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(transaction.updatedAt).format("MMM DD, YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          total={filteredTransactions.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            icon={<FaArrowLeft />}
            onClick={() => navigate("/books")}
            className="mb-4"
          >
            Back to Books
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Transactions
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            View all transactions and balances for this book
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <Button
              type={viewMode === "grid" ? "primary" : "text"}
              icon={<FaTh />}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-indigo-600" : ""}
            />
            <Button
              type={viewMode === "list" ? "primary" : "text"}
              icon={<FaList />}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-indigo-600" : ""}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <FaMoneyBillWave className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no transactions associated with this book yet
            </p>
          </div>
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </div>
    </div>
  );
};

export default BookUsers;
