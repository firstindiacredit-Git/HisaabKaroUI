import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditUser from "./EditUser";
import { UserContext } from "../Layout/Layout";

const ClientUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [collaboratorClients, setCollaboratorClients] = useState([]); // New state for collaborator clients
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const { userAdded, handleAddUser } = useContext(UserContext);
  const [userTransactions, setUserTransactions] = useState({});

  // Array of gradient colors for cards
  const gradients = [
    { bg: "from-blue-50 to-indigo-100", avatar: "from-blue-400 to-indigo-500" },
    { bg: "from-purple-50 to-pink-100", avatar: "from-purple-400 to-pink-500" },
    {
      bg: "from-green-50 to-emerald-100",
      avatar: "from-green-400 to-emerald-500",
    },
    {
      bg: "from-yellow-50 to-orange-100",
      avatar: "from-yellow-400 to-orange-500",
    },
    { bg: "from-pink-50 to-rose-100", avatar: "from-pink-400 to-rose-500" },
    { bg: "from-sky-50 to-cyan-100", avatar: "from-sky-400 to-cyan-500" },
    {
      bg: "from-violet-50 to-purple-100",
      avatar: "from-violet-400 to-purple-500",
    },
    {
      bg: "from-teal-50 to-emerald-100",
      avatar: "from-teal-400 to-emerald-500",
    },
    {
      bg: "from-fuchsia-50 to-pink-100",
      avatar: "from-fuchsia-400 to-pink-500",
    },
    {
      bg: "from-amber-50 to-orange-100",
      avatar: "from-amber-400 to-orange-500",
    },
  ];

  const API_URL = `${process.env.REACT_APP_URL}/api/v3/client`;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^(?:\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  const showNotification = (message, type) => {
    if (type === "success") {
      setSuccessModal({ isOpen: true, message });
      setTimeout(() => {
        setSuccessModal({ isOpen: false, message: "" });
      }, 2000);
    } else {
      setErrorMessage(message);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.get(`${API_URL}/getAll-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
        console.warn("Invalid users data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status !== 401) {
        showNotification("Failed to fetch users. Please try again.", "error");
      }
    }
  };

  const fetchCollaboratorClients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/collab-transactions/client-transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const usersWithTransactions = response.data.transactions.map(
        (transaction) => ({
          _id: transaction.userId._id,
          name: transaction.userId.name,
          email: transaction.userId.email,
          phone: transaction.userId.phone,
          profilePicture: transaction.userId.profilePicture,
          transactionId: transaction._id,
          bookId: transaction.bookId._id,
          bookName: transaction.bookId.bookname,
          createdAt: transaction.bookId.createdAt,
        })
      );

      console.log("Processed users:", usersWithTransactions);
      setCollaboratorClients(usersWithTransactions);
    } catch (error) {
      console.error("Error fetching collaborator clients:", error);
      setErrorMessage(error.message);
    }
  };

  const fetchUserTransactions = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v3/client/transactions/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const transactions = response.data.data || [];
      const totalValue = transactions.reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
        0
      );

      setUserTransactions((prev) => ({
        ...prev,
        [userId]: {
          count: transactions.length,
          totalValue: totalValue,
        },
      }));
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      setUserTransactions((prev) => ({
        ...prev,
        [userId]: { count: 0, totalValue: 0 },
      }));
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/delete-client/${deleteModal.user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("User deleted successfully!", "success");
      setUsers(users.filter((user) => user._id !== deleteModal.user._id));
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error deleting user",
        "error"
      );
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleUserUpdate = (updatedUser) => {
    // Ensure we have the updated user data
    if (!updatedUser || !updatedUser._id) {
      console.error("Invalid updated user data:", updatedUser);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );

    // Refresh the users list to ensure we have the latest data
    fetchUsers();
    showNotification("User updated successfully", "success");
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchCollaboratorClients();
    };
    fetchData();
  }, [userAdded]);

  useEffect(() => {
    users.forEach((user) => {
      fetchUserTransactions(user._id);
    });
  }, [users]);

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      false ||
      user?.mobile?.includes(searchQuery) ||
      false
  );

  return (
    <div className="min-h-screen dark:bg-[#111827] bg-gray-50 py-4 sm:py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Add User Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-4 sm:mb-0">
            Users
          </h1>
          <button
            onClick={() => handleAddUser()}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4 sm:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add User
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.user && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 relative z-10">
              <div className="text-center">
                {/* Warning Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete {deleteModal.user.name}?
                </h3>

                {/* Warning Message */}
                <div className="mb-6 space-y-3">
                  <p className="text-gray-500">
                    This action cannot be undone. Are you sure you want to
                    delete this user?
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Warning: This will permanently delete:
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>All transaction records associated with this user</li>
                      <li>All payment history and outstanding balances</li>
                      <li>User profile and contact information</li>
                    </ul>
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    * These changes are irreversible and cannot be recovered
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                  >
                    Yes, Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <SuccessModal
          isOpen={successModal.isOpen}
          message={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        />
        {errorMessage && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        {/* Search and View Toggle Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 dark:bg-gray-700   bg-white rounded-lg dark:border-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Hide view toggle on mobile */}
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={() => setViewType("grid")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Grid View - Always shown on mobile */}
        <div
          className={
            viewType === "grid" || window.innerWidth < 640 ? "block" : "hidden"
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="relative bg-white dark:bg-gray-800 text-white  rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Card Header with Gradient Background */}
                <div className={`relative p-3 -mb-2  }`}>
                  {/* Top Actions Row */}
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-3 py-1 text-xs font-medium bg-green-400 dark:bg-gray-700 text-white  rounded-full backdrop-blur-sm">
                      Active Client
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-1.5 dark:text-white text-gray-700 dark:bg-gray-700 hover:bg-gray-200 bg-gray-50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-1.5 dark:text-white text-gray-700 dark:bg-gray-700 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* User Avatar and Name */}
                  <div className="flex dark:bg-gray-900/50 p-1 bg-gray-50 rounded-md items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl text-gray-800 dark:text-white dark:bg-gray-800 bg-white backdrop-blur-sm flex items-center justify-center  text-2xl font-bold">
                        {user.name ? user.name[0].toUpperCase() : "?"}
                      </div>
                      {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div> */}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white ">
                        {user.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {user.email && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.mobile && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {user.mobile}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-2 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center p-3 -mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {userTransactions[user._id]?.count || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Transactions
                      </p>
                    </div>
                    <div className="text-center p-3 -mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹
                        {(
                          userTransactions[user._id]?.totalValue || 0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Value
                      </p>
                    </div>
                  </div>

                  {/* Loading State for Stats */}
                  {!userTransactions[user._id] && (
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto mt-2"></div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-pulse">
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto mt-2"></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {/* <button
                    className="mt-6 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                    text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="font-medium">View Full Profile</span>
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List View - Hidden on mobile */}
        <div
          className={
            viewType === "list" && window.innerWidth >= 640 ? "block" : "hidden"
          }
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Contact Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                              gradients[index % gradients.length].avatar
                            } flex items-center justify-center`}
                          >
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Client
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.mobile}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Display Users who added me */}
        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Users Who Added Me As Client
          </h2>
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collaboratorClients.map((user, index) => (
                <div
                  key={user._id}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    navigate(`/transaction-details/${user.transactionId}`)
                  }
                >
                  {/* Card Header with Gradient Background */}
                  <div
                    className={`relative p-6  `}
                  >
                    {/* Top Actions Row */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs dark:bg-blue-700 font-medium bg-blue-700 text-white rounded-full backdrop-blur-sm">
                        Added You
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-yellow-400 text-white rounded-xl backdrop-blur-sm">
                          Book: {user.bookName}
                        </span>
                      </div>
                    </div>

                    {/* User Avatar and Name */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {user.profilePicture ? (
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30">
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl  bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                            {user.name ? user.name[0].toUpperCase() : "?"}
                          </div>
                        )}
                        {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div> */}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-black/80 text-[12px] dark:text-white">
                          Added on{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 -mt-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      {user.email && (
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Email
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.phone && (
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Phone
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/transaction-details/${user.transactionId}`);
                      }}
                      className="mt-4 w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                        text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-sm">
                        View Transaction Details
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Column Headers */}
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-2 items-center bg-gray-50 p-2 border-b">
                <div className="font-medium text-gray-500 text-sm uppercase">
                  #
                </div>
                <div className="font-medium text-gray-500 text-sm uppercase">
                  Date Added
                </div>
                <div className="font-medium text-gray-500 text-sm uppercase">
                  Name
                </div>
                <div className="font-medium text-gray-500 text-sm uppercase">
                  Email
                </div>
                <div className="font-medium text-gray-500 text-sm uppercase">
                  Phone
                </div>
                <div className="font-medium text-gray-500 text-sm uppercase">
                  Actions
                </div>
              </div>
              {/* List Items */}
              {collaboratorClients.map((user, index) => (
                <div
                  key={user._id}
                  className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/transaction-details/${user.transactionId}`)
                  }
                >
                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-2 items-center">
                    <div className="text-gray-600 font-medium">{index + 1}</div>
                    <div className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-3">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${
                            gradients[index % gradients.length].avatar
                          }`}
                        >
                          {user.name ? user.name[0].toUpperCase() : "?"}
                        </div>
                      )}

                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-gray-600">{user.email}</div>
                    <div className="text-gray-600">{user.phone || "-"}</div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          navigate(
                            `/transaction-details/${user.transactionId}`
                          );
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center dark:border-none py-16 dark:bg-gray-700 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 border bg-gray-50 rounded-full animate-pulse"></div>
              <svg
                className="w-full h-full relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12ZM12 14C9.79 14 6 15.79 6 18V20H18V18C18 15.79 14.21 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">
              No Clients Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Looks like you haven't added any clients yet. Start by adding your
              first client!
            </p>
            <button
              onClick={() => handleAddUser()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add User
            </button>
          </div>
        )}

        {editingUser && (
          <EditUser
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUserUpdated={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ClientUsers;
