import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SavedInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt"); // Changed from 'date' to match backend
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedInvoices();
  }, [page, sortBy, order]);

  const fetchSavedInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/invoices/saved-invoice`, {
        params: {
          sortBy,
          order,
          userId: localStorage.getItem("userId"),
        },
      });

      // Simply set the invoices from the response
      setInvoices(response.data.data || []);
    } catch (error) {
      setError("Failed to fetch invoices. Please try again later.");
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await axios.delete(`/api/invoices/${invoiceId}`);
      setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.invoiceNumber - a.invoiceNumber;
  });

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Add pagination controls
  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {page} of {pagination.pages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagination.pages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  // Update the sort handler
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setOrder("desc");
    }
  };

  const InvoiceCard = ({ invoice }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">
            Invoice #{invoice.invoiceNumber}
          </h3>
          <span className={getStatusBadgeClass(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/invoice/edit/${invoice._id}`)}
            className="px-3 py-1 text-blue-500 hover:bg-blue-50 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (!invoice._id) {
                toast.error("Invalid invoice ID");
                return;
              }
              navigate(`/invoice/view/${invoice._id}`);
            }}
            className="px-3 py-1 text-green-500 hover:bg-green-50 rounded"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteInvoice(invoice._id)}
            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Company Logo */}
          {invoice.billingDetails.from.logo && (
            <div className="w-32 h-32">
              <img
                src={invoice.billingDetails.from.logo}
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Dates Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-600 dark:text-gray-400 text-sm">
                Invoice Date
              </h4>
              <p>{formatDate(invoice.date)}</p>
            </div>
            <div>
              <h4 className="text-gray-600 dark:text-gray-400 text-sm">
                Due Date
              </h4>
              <p>{invoice.dueDate ? formatDate(invoice.dueDate) : "Not set"}</p>
            </div>
          </div>

          {/* From Section */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              From
            </h4>
            <div className="space-y-1">
              <p className="font-medium">
                {invoice.billingDetails.from.companyName}
              </p>
              <p className="text-sm">{invoice.billingDetails.from.address}</p>
              <p className="text-sm">{invoice.billingDetails.from.phone}</p>
              <p className="text-sm">{invoice.billingDetails.from.email}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* To Section */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              To
            </h4>
            <div className="space-y-1">
              <p className="font-medium">{invoice.billingDetails.to.name}</p>
              <p className="text-sm">{invoice.billingDetails.to.address}</p>
              <p className="text-sm">{invoice.billingDetails.to.phone}</p>
              <p className="text-sm">{invoice.billingDetails.to.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Items
            </h4>
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-sm font-medium border-b pb-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {invoice.items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="grid grid-cols-12 text-sm gap-2"
                >
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="col-span-2 text-right">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 text-sm text-gray-500 flex justify-between items-center pt-4 border-t">
        <div>Created: {formatDate(invoice.createdAt)}</div>
        <div>Last Updated: {formatDate(invoice.updatedAt)}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Invoices</h1>
        <div className="flex gap-4 items-center">
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [newSortBy, newOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setOrder(newOrder);
            }}
            className="border border-gray-300 rounded-md px-2 py-2 bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="invoiceNumber-desc">
              Invoice Number (High to Low)
            </option>
            <option value="invoiceNumber-asc">
              Invoice Number (Low to High)
            </option>
          </select>
          <button
            onClick={() => navigate("/invoice")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New Invoice
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No invoices found
          </p>
          <button
            onClick={() => navigate("/invoice")}
            className="text-blue-500 hover:text-blue-600"
          >
            Create your first invoice
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedInvoices.map((invoice) => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default SavedInvoices;
