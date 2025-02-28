import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFileImage,
} from "react-icons/ai";
import { BsFilePdf } from "react-icons/bs";
import TransactionForm from "./TransactionForm";
import EditTransactionForm from "./EditTransactionForm";
import { useTransaction } from "./useTransaction";
import { useTransactionForm } from "./useTransactionForm";
import { useEditTransaction } from "./useEditTransaction";
import DeleteConfirmationModal from "../youAdded/DeleteConfirmationModal";
import SuccessModal from "../youAdded/SuccessModal";
import ErrorModal from "../youAdded/ErrorModal";
import FileModal from "../youAdded/FileModal";
import { Image, Button, Dropdown, Space, Skeleton } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./CollaborativeBookRecords.css";

const TransactionCardsSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Skeleton */}
        <div className="p-3 border-b border-gray-100">
          <Skeleton.Input
            style={{ width: 200, height: 24 }}
            active
            size="small"
          />
        </div>

        {/* Card Items Skeleton */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-100"
          >
            <div className="flex items-center space-x-2">
              <Skeleton.Avatar active size="small" />
              <Skeleton.Input style={{ width: 60 }} active size="small" />
            </div>
            <Skeleton.Input style={{ width: 80 }} active size="small" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="relative bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Skeleton.Avatar active size="small" />
            <div className="ml-2 flex-1">
              <Skeleton.Input style={{ width: "100%" }} active size="small" />
            </div>
          </div>
          <Skeleton.Input style={{ width: "100%" }} active size="small" />
        </div>
      ))}
    </div>
  );
};

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams();
  const {
    transaction,
    setTransaction,
    updatingEntryId,
    userId,
    updateTransactionStatus,
    handleDeleteClick,
    handleDownload,
    errorMessage,
    setErrorMessage,
    confirmDelete,
    cancelDelete,
    deleteTransactionDetails,
    setDeleteTransactionDetails, // Get the setter function
  } = useTransaction(transactionId);

  const {
    showForm,
    formData,
    isSubmitting,
    error,
    success,
    setShowForm,
    setFormData,
    setError,
    setSuccess,
    handleInputChange,
    handleAddTransaction,
  } = useTransactionForm(transactionId, setTransaction);

  const [modalState, setModalState] = useState({
    showDeleteModal: false,
    showSuccessModal: false,
    showErrorModal: false,
    previewImageId: null,
    isModalOpen: false,
    modalImage: null,
    currentFile: null,
    selectedEntry: null,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const {
    isEditing,
    editData,
    setEditData,
    openEditForm,
    closeEditForm,
    handleEditSubmit,
  } = useEditTransaction(transactionId, setTransaction, {
    onSuccess: () => {
      setSuccessMessage("Transaction updated successfully!");
      setModalState((prev) => ({ ...prev, showSuccessModal: true }));
      closeEditForm();
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to update transaction. Please try again."
      );
      setModalState((prev) => ({ ...prev, showErrorModal: true }));
    },
  });

  const [sortConfig, setSortConfig] = useState({
    type: "date", // 'date' or 'amount'
    order: "desc", // 'asc' or 'desc'
  });

  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'confirmed', 'pending'
  const [userFilter, setUserFilter] = useState({ id: "all", name: "All" });
  const [clientFilter, setClientFilter] = useState("all");
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (transaction?.transactionHistory) {
      // Extract unique users and clients with full information
      const usersMap = new Map();
      const clientsMap = new Map();

      transaction.transactionHistory.forEach((history) => {
        if (history.initiatedBy) {
          usersMap.set(history.initiaterId, {
            id: history.initiaterId,
            name: history.initiatedBy,
          });
        }
        if (history.clientName) {
          clientsMap.set(history.clientId, {
            id: history.clientId,
            name: history.clientName,
          });
        }
      });

      setUniqueUsers(Array.from(usersMap.values()));
      setUniqueClients(Array.from(clientsMap.values()));
    }
  }, [transaction?.transactionHistory]);

  const [userItems, setUserItems] = useState([
    {
      key: "all",
      label: "All",
    },
  ]);

  // Update userItems when uniqueUsers changes
  useEffect(() => {
    const updatedUserItems = [
      {
        key: "all",
        label: "All",
      },
      ...uniqueUsers.map((user) => ({
        key: user.id,
        label: user.name,
      })),
    ];
    setUserItems(updatedUserItems);
  }, [uniqueUsers]);

  const filterAndSortTransactions = (transactions) => {
    if (!transactions) return [];

    // First filter by status, user, and client
    let filteredTransactions = transactions.filter((history) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed"
          ? history.confirmationStatus === "confirmed"
          : statusFilter === "pending"
          ? history.confirmationStatus !== "confirmed"
          : true);

      const matchesUser =
        userFilter.id === "all" || history.initiaterId === userFilter.id;
      const matchesClient =
        clientFilter === "all" || history.clientId === clientFilter;

      return matchesStatus && matchesUser && matchesClient;
    });

    // Then sort the filtered results
    return [...filteredTransactions].sort((a, b) => {
      if (sortConfig.type === "date") {
        const dateA = new Date(a.transactionDate);
        const dateB = new Date(b.transactionDate);
        return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortConfig.order === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }
    });
  };

  const handleSortChange = (value) => {
    switch (value) {
      case "oldest":
        setSortConfig({ type: "date", order: "asc" });
        break;
      case "newest":
        setSortConfig({ type: "date", order: "desc" });
        break;
      case "amount_high":
        setSortConfig({ type: "amount", order: "desc" });
        break;
      case "amount_low":
        setSortConfig({ type: "amount", order: "asc" });
        break;
      default:
        setSortConfig({ type: "date", order: "desc" });
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleUserFilterChange = (value) => {
    const selectedUser = uniqueUsers.find((user) => user.id === value) || {
      id: "all",
      name: "All",
    };
    setUserFilter(selectedUser);
  };

  const handleClientFilterChange = (value) => {
    setClientFilter(value);
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setUserFilter({ id: "all", name: "All" });
    setClientFilter("all");
    setSortConfig({
      type: "date",
      order: "desc",
    });
  };

  const [sortItems] = useState([
    {
      key: "newest",
      label: "Newest First",
    },
    {
      key: "oldest",
      label: "Oldest First",
    },
    {
      key: "amount_high",
      label: "Amount: High to Low",
    },
    {
      key: "amount_low",
      label: "Amount: Low to High",
    },
  ]);

  const [statusItems] = useState([
    {
      key: "all",
      label: "All",
    },
    {
      key: "confirmed",
      label: "Confirmed",
    },
    {
      key: "pending",
      label: "Pending",
    },
  ]);

  const handleFileClick = (file) => {
    setModalState((prev) => ({
      ...prev,
      isModalOpen: true,
      modalImage: `${process.env.REACT_APP_URL}/${file.replace(/\\/g, "/")}`,
      currentFile: file,
    }));
  };

  const sortedAndFilteredTransactions = filterAndSortTransactions(
    transaction?.transactionHistory
  );

  useEffect(() => {
    if (error) {
      setModalState((prev) => ({
        ...prev,
        showErrorModal: true,
        errorMessage: error,
      }));
      setError("");
    }
  }, [error, setError, setModalState]);

  useEffect(() => {
    if (success) {
      setSuccessMessage("Transaction added successfully!");
      setModalState((prev) => ({ ...prev, showSuccessModal: true }));
      setSuccess(false);
    }
  }, [success, setSuccess, setModalState]);

  const getSortLabel = () => {
    if (sortConfig.type === "date") {
      return sortConfig.order === "desc" ? "Newest First" : "Oldest First";
    }
    return sortConfig.order === "desc"
      ? "Amount: High to Low"
      : "Amount: Low to High";
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      default:
        return "All";
    }
  };

  const getUserLabel = () => {
    return userFilter.name;
  };

  const getFirstName = (fullName) => {
    return fullName?.split(" ")[0] || "";
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {sortedAndFilteredTransactions.map((entry, index) => (
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

                {userId === entry.initiaterId ? (
                  <>
                    <button
                      onClick={() => openEditForm(entry)}
                      className="p-2 rounded-full hover:bg-gray-50 transition-colors text-yellow-500"
                      title="Edit"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="p-2 rounded-full hover:bg-gray-50 transition-colors text-red-500"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                ) : entry.confirmationStatus === "pending" ? (
                  <button
                    onClick={() => updateTransactionStatus(entry._id)}
                    disabled={updatingEntryId === entry._id}
                    className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    {updatingEntryId === entry._id ? "Updating..." : "Confirm"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = (entry) => {
    setDeleteTransactionDetails(entry);
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: true,
    }));
  };

  const handleConfirmDelete = async () => {
    await confirmDelete();
    setSuccessMessage("Transaction deleted successfully!");
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: false,
      showSuccessModal: true,
    }));
  };

  const handleCancelDelete = () => {
    setDeleteTransactionDetails(null);
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: false,
    }));
  };

  const totalItems = sortedAndFilteredTransactions?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems =
    sortedAndFilteredTransactions?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Set title to blue
    doc.text("Transaction History", 14, 15);

    // Add cards for user info and balance
    const pageWidth = doc.internal.pageSize.width;
    const cardWidth = (pageWidth - 28 - 3 * 7) / 4; // Distribute space evenly among 4 cards with gaps
    const cardHeight = 30;
    const startY = 25;
    const gap = 7;

    // Card 1 - User Name (Blue)
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.setDrawColor(37, 99, 235); // Blue border
    doc.roundedRect(14, startY, cardWidth, cardHeight, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Your Name", 17, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(transaction.userId.name, 17, startY + 15, {
      maxWidth: cardWidth - 6,
    });

    // Card 2 - Other User (Purple)
    doc.setFillColor(245, 243, 255); // Light purple background
    doc.setDrawColor(139, 92, 246); // Purple border
    doc.roundedRect(
      14 + cardWidth + gap,
      startY,
      cardWidth,
      cardHeight,
      3,
      3,
      "FD"
    );
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Other User", 17 + cardWidth + gap, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(139, 92, 246);
    doc.text(transaction.clientUserId.name, 17 + cardWidth + gap, startY + 15, {
      maxWidth: cardWidth - 6,
    });

    // Card 3 - Book Name (Green)
    doc.setFillColor(240, 253, 244); // Light green background
    doc.setDrawColor(34, 197, 94); // Green border
    doc.roundedRect(
      14 + (cardWidth + gap) * 2,
      startY,
      cardWidth,
      cardHeight,
      3,
      3,
      "FD"
    );
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Book Name", 17 + (cardWidth + gap) * 2, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94);
    doc.text(
      transaction.bookId.bookname,
      17 + (cardWidth + gap) * 2,
      startY + 15,
      { maxWidth: cardWidth - 6 }
    );

    // Card 4 - Outstanding Balance (Orange/Red based on balance)
    const balance = transaction.outstandingBalance || 0;
    const isPositive = balance >= 0;

    // Set fill color based on balance
    if (isPositive) {
      doc.setFillColor(255, 247, 237); // Light orange background
      doc.setDrawColor(249, 115, 22); // Orange border
    } else {
      doc.setFillColor(254, 242, 242); // Light red background
      doc.setDrawColor(239, 68, 68); // Red border
    }

    const card4X = 14 + (cardWidth + gap) * 3;
    doc.roundedRect(card4X, startY, cardWidth, cardHeight, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Outstanding Balance", card4X + 3, startY + 7);
    doc.setFontSize(11);

    // Set text color based on balance
    if (isPositive) {
      doc.setTextColor(249, 115, 22); // Orange text
    } else {
      doc.setTextColor(239, 68, 68); // Red text
    }

    // Format the balance with appropriate spacing
    const formattedBalance = Math.abs(balance).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    const balanceText = `${formattedBalance}`;
    doc.text(balanceText, card4X + 3, startY + 15, { maxWidth: cardWidth - 6 });

    doc.setFontSize(8);
    doc.text(
      isPositive ? "You will give" : "You will get",
      card4X + 3,
      startY + 22
    );

    // Add filters info
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // Reset text color

    // Prepare table data
    const tableData = sortedAndFilteredTransactions.map((history, index) => [
      (currentPage - 1) * pageSize + index + 1,
      history?.transactionDate
        ? new Date(history.transactionDate).toLocaleString()
        : "N/A",
      history.initiatedBy,
      history?.transactionType === "you will give"
        ? "You will get"
        : "You will give",
      history?.amount?.toFixed(2) || "0.00",
      history?.description || "",
      history?.confirmationStatus === "confirmed" ? "Confirmed" : "Pending",
    ]);

    // Define table headers
    const headers = [
      [
        "S.No",
        "Date",
        "Initiated By",
        "Type",
        "Amount",
        "Description",
        "Status",
      ],
    ];

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: startY + cardHeight + 10, // Adjusted starting position for table
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 }, // S.No
        1: { cellWidth: 35 }, // Date
        2: { cellWidth: 25 }, // Initiated By
        3: { cellWidth: 20 }, // Type
        4: { cellWidth: 20 }, // Amount
        5: { cellWidth: 50 }, // Description
        6: { cellWidth: 20 }, // Status
      },
      headStyles: {
        fillColor: [37, 99, 235], // Changed to blue
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [71, 85, 105], // Slate gray for better readability
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255], // Light blue background
      },
      margin: { top: 40 },
      didDrawPage: function (data) {
        // Add footer to each page
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 25;

        // Footer divider line
        doc.setDrawColor(37, 99, 235); // Blue divider
        doc.setLineWidth(0.5);
        doc.line(14, footerY, pageWidth - 14, footerY);

        // Footer content
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("HisaabKaro", 14, footerY + 8);

        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105); // Slate gray
        doc.text("Your Digital Expense Management Partner", 14, footerY + 14);

        doc.setTextColor(37, 99, 235);
        doc.text("www.hisaabkaro.com", pageWidth / 2, footerY + 14, {
          align: "center",
        });

        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105); // Slate gray
        const currentDate = new Date().toLocaleDateString("en-US");
        const year = new Date().getFullYear();
        doc.text(`Generated: ${currentDate}`, 14, footerY + 20);
        doc.text(
          ` ${year} HisaabKaro. All rights reserved`,
          pageWidth - 14,
          footerY + 20,
          { align: "right" }
        );
      },
    });

    // Save PDF
    doc.save("transaction-history.pdf");
  };

  // Update the filter section to be responsive
  const renderFilterSection = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <div className="flex  flex-wrap items-center gap-2">
        <Dropdown
          menu={{
            items: sortItems,
            onClick: ({ key }) => handleSortChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-900 border-gray-300 dark:border-gray-800 font-semibold dark:bg-gray-800 bg-white h-10 w-full sm:w-auto">
            <Space>
              <SortAscendingOutlined className="dark:text-white text-gray-600" />
              <span className="font-semibold dark:text-white  text-gray-600 ">
                Sort By
              </span>
            </Space>
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: statusItems,
            onClick: ({ key }) => handleStatusFilterChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center border-gray-300 dark:border-gray-800 font-semibold dark:bg-gray-800 bg-white h-10 w-full sm:w-auto">
            <Space>
              <FilterOutlined className="dark:text-white text-gray-600" />
              <span className="font-semibold dark:text-white  text-gray-600 ">
                Status: {getStatusLabel()}
              </span>
            </Space>
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "all",
                label: "All",
              },
              ...uniqueUsers.map((user) => ({
                key: user.id,
                label: user.name,
              })),
            ],
            onClick: ({ key }) => handleUserFilterChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center border-gray-300 dark:border-gray-800 font-semibold dark:bg-gray-800 bg-white h-10 w-full sm:w-auto">
            <Space>
              <FilterOutlined className="dark:text-white text-gray-600" />
              <span className="font-semibold dark:text-white  text-gray-600 truncate">
                Added By: {userFilter.name}
              </span>
            </Space>
          </Button>
        </Dropdown>

        <Button
          onClick={clearAllFilters}
          className="flex items-center h-10 dark:bg-gray-900 border-gray-300 dark:border-gray-800 font-semibold dark:bg-gray-800 bg-white w-full sm:w-auto"
          disabled={
            statusFilter === "all" &&
            userFilter.id === "all" &&
            sortConfig.type === "date" &&
            sortConfig.order === "desc"
          }
        >
          <span className="font-semibold dark:text-white text-gray-600  ">
            Clear Filter
          </span>
        </Button>

        <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center justify-center px-2 py-2.5 rounded-xl transition-all duration-300 ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-700 shadow-sm transform translate-y-[-1px] text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <div className="flex items-center ">
              <UnorderedListOutlined
                className={`text-lg ${
                  viewMode === "list"
                    ? "transform scale-110 transition-transform duration-300"
                    : ""
                }`}
              />
              <span
                className={`font-medium ${
                  viewMode === "list"
                    ? "transform scale-105 transition-transform duration-300"
                    : ""
                }`}
              ></span>
            </div>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center justify-center px-2 py-2.5 rounded-xl transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-white dark:bg-gray-700 shadow-sm transform translate-y-[-1px] text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <div className="flex items-center">
              <AppstoreOutlined
                className={`text-lg ${
                  viewMode === "grid"
                    ? "transform scale-110 transition-transform duration-300"
                    : ""
                }`}
              />
              <span
                className={`font-medium ${
                  viewMode === "grid"
                    ? "transform scale-105 transition-transform duration-300"
                    : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap dark:bg-gray-800 bg-white rounded-xl shadow-sm items-center gap-2 mt-2 sm:mt-0">
       
        <div className="flex dark:bg-gray-800 bg-white rounded-xl shadow-sm items-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 dark:bg-gray-800 dark:border-gray-800 bg-white/50 dark:text-gray-300 text-gray-800 rounded"
            icon={<LeftOutlined />}
          />
          <span className="inline-block px-4 py-2 min-w-[40px] text-center dark:bg-gray-700 bg-white dark:text-gray-300 text-gray-800 rounded">
            {currentPage}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 dark:bg-gray-800 dark:border-gray-800 bg-white/50 dark:text-gray-300 text-gray-800 rounded"
            icon={<RightOutlined />}
          />
        </div>
      </div>
    </div>
  );

  // Update the action buttons section
  const renderActionButtons = () => (
    <div className="relative z-5 flex flex-wrap gap-4 mb-6 mt-6">
      <button
        onClick={() => {
          setShowForm(true);
          setFormData((prev) => ({
            ...prev,
            transactionType: "you will give",
          }));
        }}
        className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl 
        hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md"
      >
        <PlusOutlined className="mr-2" />
        <span className="font-semibold">Receive</span>
      </button>
      <button
        onClick={() => {
          setShowForm(true);
          setFormData((prev) => ({
            ...prev,
            transactionType: "you will get",
          }));
        }}
        className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl 
        hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-md"
      >
        <MinusOutlined className="mr-2" />
        <span className="font-semibold">Send</span>
      </button>
      <button
        className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl 
        hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
        onClick={handleExportPDF}
      >
        <DownloadOutlined className="mr-2" />
        <span className="font-semibold">Export PDF</span>
      </button>
    </div>
  );

  // Update the transaction info cards section
  const renderTransactionInfoCards = () => (
    <div className="mb-4">
      {/* Mobile View */}
      <div className="block sm:hidden dark:bg-gray-900 bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-3 border-b border-gray-100">
          Transaction Detail
        </h1>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {/* Book Card */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/50">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xs font-medium text-gray-600">Book</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
              {transaction.bookId.bookname}
            </span>
          </div>

          {/* Balance Card */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-amber-50/50">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-600">Balance</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {Math.abs(transaction.outstandingBalance).toLocaleString("en-IN")}
            </span>
          </div>

          {/* User Card */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-emerald-50/50">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-600">User</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
              {getFirstName(transaction.userId.name)}
            </span>
          </div>

          {/* Client Card */}
          <div className="flex items-center justify-between p-2 bg-purple-50/50">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-600">Client</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
              {getFirstName(transaction.clientUserId.name)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Book Card */}
        <div className="relative group">
          <div className="absolute inset-0  rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative dark:bg-gray-800 bg-white ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl p-3 sm:p-6 transition-shadow duration-200">
            <div className="text-blue-600 mb-1 sm:mb-2 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-semibold text-sm sm:text-base">
                Book Name
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base truncate">
              {transaction.bookId.bookname}
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="relative group">
          <div className="absolute inset-0  rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative dark:bg-gray-800 bg-white ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl p-3 sm:p-6 transition-shadow duration-200">
            <div className="text-emerald-600 mb-1 sm:mb-2 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-semibold text-sm sm:text-base">
                User Name
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base truncate">
              {transaction.userId.name}
            </p>
          </div>
        </div>

        {/* Client Card */}
        {/* <div className="relative group">
          <div className="absolute inset-0  rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative dark:bg-gray-800 bg-white ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl p-3 sm:p-6 transition-shadow duration-200">
            <div className="text-purple-600 mb-1 sm:mb-2 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-semibold text-sm sm:text-base">
                Client Name
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base truncate">
              {transaction.clientUserId.name}
            </p>
          </div>
        </div> */}


        {/* Balance Card */}
        <div className="relative group">
          <div className="absolute inset-0  rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative dark:bg-gray-800 bg-white ring-1 ring-gray-200 dark:ring-gray-800 rounded-xl p-3 sm:p-6 transition-shadow duration-200">
            <div className="text-amber-600 mb-1 sm:mb-2 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold text-sm sm:text-base">
                Balance
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
              {Math.abs(transaction.outstandingBalance).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Update the action buttons for mobile
  const renderActionButtonsMobile = () => (
    <div className="relative z-5 flex gap-2 mb-4 mt-4">
      <button
        onClick={() => {
          setShowForm(true);
          setFormData((prev) => ({
            ...prev,
            transactionType: "you will give",
          }));
        }}
        className="flex-1 flex items-center justify-center px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg 
        hover:bg-green-600 transition-all duration-200 shadow-sm text-sm sm:text-base"
      >
        <span className="font-medium">Get</span>
      </button>
      <button
        onClick={() => {
          setShowForm(true);
          setFormData((prev) => ({
            ...prev,
            transactionType: "you will get",
          }));
        }}
        className="flex-1 flex items-center justify-center px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg 
        hover:bg-red-600 transition-all duration-200 shadow-sm text-sm sm:text-base"
      >
        <span className="font-medium">Give</span>
      </button>
    </div>
  );

  // Update the export PDF button for mobile
  const renderExportButtonMobile = () => (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg 
        hover:bg-blue-700 transition-all duration-200 shadow-sm text-sm sm:text-base"
        onClick={handleExportPDF}
      >
        <span className="font-medium">Export PDF</span>
      </button>
    </div>
  );

  // Update the filter controls for mobile - removing the view toggle
  const renderFilterControlsMobile = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Dropdown
          menu={{
            items: sortItems,
            onClick: ({ key }) => handleSortChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm">
            <Space>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M3 6h18M6 12h12M9 18h6" />
                </svg>
                Sort
              </span>
            </Space>
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: statusItems,
            onClick: ({ key }) => handleStatusFilterChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm">
            <Space>
              <span className="flex items-center">
                <FilterOutlined className="mr-1" />
                Status
              </span>
            </Space>
          </Button>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "all",
                label: "All",
              },
              ...uniqueUsers.map((user) => ({
                key: user.id,
                label: user.name,
              })),
            ],
            onClick: ({ key }) => handleUserFilterChange(key),
          }}
          trigger={["click"]}
        >
          <Button className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm">
            <Space>
              <span className="flex items-center">
                <FilterOutlined className="mr-1" />
                Added by
              </span>
            </Space>
          </Button>
        </Dropdown>
      </div>

      <div className="flex justify-end items-center">
        
      </div>
    </div>
  );

  // Add a new function to render the mobile view of transactions
  const renderMobileTransactionList = () => {
    if (currentItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-medium flex justify-between">
          <div>Details</div>
          <div>Actions</div>
        </div>
        {currentItems.map((entry, index) => (
          <div key={entry._id} className="px-4 py-3 relative">
            {/* Index badge */}
            <div className="absolute left-0 top-0 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-br-md">
              {(currentPage - 1) * pageSize + index + 1}
            </div>

            <div className="flex justify-between mb-2 mt-2">
              <div className="flex items-center">
                <span
                  className={`text-base font-semibold ${
                    entry.transactionType === "you will give"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {entry.amount?.toFixed(2) || "0.00"}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    entry.transactionType === "you will give"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {entry.transactionType === "you will give"
                    ? "you will get"
                    : "you will give"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {entry.file && (
                  <button
                    onClick={() => handleFileClick(entry.file)}
                    className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
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

                {userId === entry.initiaterId ? (
                  <>
                    <button
                      onClick={() => openEditForm(entry)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-yellow-500"
                      title="Edit"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-red-500"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                ) : entry.confirmationStatus === "pending" ? (
                  <button
                    onClick={() => updateTransactionStatus(entry._id)}
                    disabled={updatingEntryId === entry._id}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {updatingEntryId === entry._id ? "..." : "Confirm"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-1">
              {entry.transactionDate
                ? new Date(entry.transactionDate).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </div>

            {entry.description && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">
                {entry.description}
              </div>
            )}

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
                  {entry.initiatedBy}
                </span>
              </div>
              <div>
                {entry.confirmationStatus === "confirmed" ? (
                  <span className="flex items-center text-green-600">
                    <AiOutlineCheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Confirmed</span>
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600">
                    <AiOutlineClockCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Pending</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Title Skeleton */}
          <div className="hidden sm:block mb-8">
            <Skeleton.Input
              style={{ width: 300, height: 36 }}
              active
              size="large"
            />
          </div>

          {/* Transaction Cards Skeleton */}
          <div className="block sm:hidden">
            <TransactionCardsSkeleton isMobile={true} />
          </div>
          <div className="hidden sm:block">
            <TransactionCardsSkeleton isMobile={false} />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2 mt-4 mb-4">
            <Skeleton.Button
              active
              size="large"
              style={{ width: "33%", height: 40 }}
            />
            <Skeleton.Button
              active
              size="large"
              style={{ width: "33%", height: 40 }}
            />
            <Skeleton.Button
              active
              size="large"
              style={{ width: "33%", height: 40 }}
            />
          </div>

          {/* Filter Controls Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                size="small"
                style={{ width: 100, height: 32 }}
              />
            ))}
          </div>

          {/* Table/Grid Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3"
                >
                  <Skeleton.Input
                    style={{ width: "30%" }}
                    active
                    size="small"
                  />
                  <Skeleton.Input
                    style={{ width: "20%" }}
                    active
                    size="small"
                  />
                  <Skeleton.Input
                    style={{ width: "20%" }}
                    active
                    size="small"
                  />
                  <Skeleton.Input
                    style={{ width: "15%" }}
                    active
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hide title on mobile as it's included in the card */}
        <h1 className="hidden sm:block dark:text-white  mt-4 text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center sm:text-left">
          Transaction Details
        </h1>

        {renderTransactionInfoCards()}

        <div className="block sm:hidden">
          {renderActionButtonsMobile()}
          {renderExportButtonMobile()}
          {renderFilterControlsMobile()}
        </div>

        <div className="hidden sm:block">
          {/* Existing desktop layout */}
          {renderActionButtons()}
          {renderFilterSection()}
        </div>

        <div className="container mx-auto">
          {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 dark:bg-gray-800 bg-gray-100 rounded-md shadow-sm mb-4">
            <span className="text-sm sm:text-base text-gray-800 dark:text-white/50 font-medium mb-2 sm:mb-0">
              <b className="text-blue-600">Showing:</b> {startIndex + 1} to{" "}
              {Math.min(endIndex, totalItems)}
            </span>
            <span className="text-sm sm:text-base text-gray-800 font-medium">
              <b className="text-green-600">Total Entries:</b> {totalItems}
            </span>
          </div> */}

          {/* Transaction History */}
          <div className="shadow overflow-hidden border-b dark:border-gray-700 border-gray-200 sm:rounded-lg">
            <div className="max-w-screen-xl mx-auto">
              {isMobile ? (
                renderMobileTransactionList()
              ) : viewMode === "list" ? (
                <div className="overflow-x-auto pb-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="dark:bg-gray-800 bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                          S.No
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          Date
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          Initiated By
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Type
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Amount
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                          Description
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                          Files
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Status
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:bg-gray-700 dark:text-white bg-gray-50">
                      {currentItems.length > 0
                        ? currentItems.map((history, index) => (
                            <tr
                              key={history._id}
                              className={`${
                                history?.transactionType === "you will give"
                                  ? "hover:bg-green-50 dark:hover:bg-gray-500"
                                  : "hover:bg-red-50 dark:hover:bg-gray-500"
                              }`}
                            >
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {history?.transactionDate
                                  ? new Date(
                                      history.transactionDate
                                    ).toLocaleString()
                                  : "N/A"}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {history.initiatedBy}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <span
                                  className={`font-medium ${
                                    history?.transactionType === "you will give"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {history?.transactionType === "you will give"
                                    ? "You will get"
                                    : "You will give"}
                                </span>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                <span
                                  className={`font-medium ${
                                    history?.transactionType === "you will give"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {history?.amount?.toFixed(2) || "0.00"}
                                </span>
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900 dark:text-white break-words w-64">
                                {history?.description || ""}
                              </td>
                              <td className="px-3 py-4">
                                <div className="h-6 flex items-center justify-center">
                                  {typeof history.file === "string" &&
                                  history.file.trim() !== "" ? (
                                    history.file
                                      .toLowerCase()
                                      .endsWith(".pdf") ? (
                                      <div
                                        className="cursor-pointer hover:opacity-80 h-6 flex items-center"
                                        onClick={() =>
                                          handleFileClick(history.file)
                                        }
                                      >
                                        <FilePdfOutlined
                                          style={{
                                            fontSize: "24px",
                                            color: "#ff4d4f",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div className="relative cursor-pointer h-6 flex items-center">
                                        <div
                                          onClick={() =>
                                            handleFileClick(history.file)
                                          }
                                        >
                                          <FileImageOutlined
                                            style={{
                                              fontSize: "24px",
                                              color: "#1890ff",
                                            }}
                                            className="hover:opacity-80"
                                          />
                                        </div>
                                        <Image
                                          src={`${
                                            process.env.REACT_APP_URL
                                          }/${history.file.replace(
                                            /\\/g,
                                            "/"
                                          )}`}
                                          alt="Transaction File"
                                          className="hidden"
                                          preview={{
                                            visible:
                                              modalState.previewImageId ===
                                              history._id,
                                            onVisibleChange: (visible) => {
                                              setModalState((prev) => ({
                                                ...prev,
                                                previewImageId: visible
                                                  ? history._id
                                                  : null,
                                              }));
                                            },
                                            mask: null,
                                            toolbarRender: (
                                              _,
                                              { transform: { scale }, actions }
                                            ) => (
                                              <div className="ant-image-preview-operations">
                                                <div className="ant-image-preview-operations-operation">
                                                  <DownloadOutlined
                                                    onClick={() =>
                                                      handleDownload(
                                                        history.file
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <div className="ant-image-preview-operations-operation">
                                                  <RotateLeftOutlined
                                                    onClick={
                                                      actions.onRotateLeft
                                                    }
                                                  />
                                                </div>
                                                <div className="ant-image-preview-operations-operation">
                                                  <RotateRightOutlined
                                                    onClick={
                                                      actions.onRotateRight
                                                    }
                                                  />
                                                </div>
                                                <div className="ant-image-preview-operations-operation">
                                                  <ZoomOutOutlined
                                                    disabled={scale === 1}
                                                    onClick={actions.onZoomOut}
                                                  />
                                                </div>
                                                <div className="ant-image-preview-operations-operation">
                                                  <ZoomInOutlined
                                                    disabled={scale === 50}
                                                    onClick={actions.onZoomIn}
                                                  />
                                                </div>
                                              </div>
                                            ),
                                          }}
                                        />
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-sm text-gray-500 whitespace-nowrap h-6 flex items-center">
                                      No file
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                {history?.confirmationStatus === "confirmed" ? (
                                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmed
                                  </span>
                                ) : userId === history?.initiaterId ? (
                                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      updateTransactionStatus(history._id)
                                    }
                                    disabled={updatingEntryId === history._id}
                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                      updatingEntryId === history._id
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    {updatingEntryId === history._id
                                      ? "Updating..."
                                      : "Confirm"}
                                  </button>
                                )}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                {userId === history?.initiaterId ? (
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => openEditForm(history)}
                                      className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                      title="Edit"
                                    >
                                      <MdEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(history)}
                                      className="text-red-600 hover:text-red-900 transition-colors"
                                      title="Delete"
                                    >
                                      <MdDelete className="h-5 w-5" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500 italic">
                                    Not initiated by you
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        : renderGridView()}
                    </tbody>
                  </table>
                </div>
              ) : (
                renderGridView()
              )}
            </div>
          </div>
        </div>

        <EditTransactionForm
          editData={editData}
          onSubmit={handleEditSubmit}
          onChange={setEditData}
          onCancel={closeEditForm}
          isOpen={isEditing}
        />

        <DeleteConfirmationModal
          isOpen={modalState.showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          transactionDetails={deleteTransactionDetails}
        />

        <SuccessModal
          isOpen={modalState.showSuccessModal}
          message={successMessage}
          onClose={() => {
            setModalState((prev) => ({ ...prev, showSuccessModal: false }));
            setSuccessMessage("");
          }}
        />

        <ErrorModal
          isOpen={modalState.showErrorModal}
          message={errorMessage}
          onClose={() =>
            setModalState((prev) => ({ ...prev, showErrorModal: false }))
          }
        />

        <FileModal
          isOpen={modalState.isModalOpen}
          fileUrl={modalState.modalImage}
          onClose={() =>
            setModalState((prev) => ({
              ...prev,
              isModalOpen: false,
              modalImage: null,
              currentFile: null,
            }))
          }
          onDownload={() => handleDownload(modalState.currentFile)}
        />

        {showForm && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={() => setShowForm(false)}
              ></div>

              {/* Modal panel */}
              <div className="inline-block w-full align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                <div className="w-full">
                  <TransactionForm
                    formData={formData}
                    isSubmitting={isSubmitting}
                    onSubmit={handleAddTransaction}
                    onChange={handleInputChange}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeBookRecords;
<style jsx>{`
  .ant-btn {
    background: transparent;
    border: none !important;
    box-shadow: none !important;
  }
  .ant-btn:hover {
    color: white !important;
    border-color: transparent !important;
  }
  .ant-btn:focus {
    color: white !important;
    border-color: transparent !important;
  }
`}</style>;