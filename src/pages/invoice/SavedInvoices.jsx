import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axios.get(`/api/invoices/saved-invoice`, {
        params: {
          sortBy,
          order,
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter out any invoices without valid IDs
        const validInvoices = response.data.data.filter(invoice => 
          invoice._id && /^[0-9a-fA-F]{24}$/.test(invoice._id)
        );
        setInvoices(validInvoices);
      } else {
        throw new Error(response.data.message || "Failed to fetch invoices");
      }
    } catch (error) {
      setError("Failed to fetch invoices. Please try again later.");
      console.error("Error fetching invoices:", error);
      toast.error(error.response?.data?.message || "Failed to fetch invoices");
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

  const handleViewInvoice = async (invoice) => {
    try {
      setLoading(true);
      const invoiceElement = document.getElementById(`invoice-${invoice._id}`);
      if (!invoiceElement) {
        toast.error("Invoice element not found");
        return;
      }

      // Create a clone of the element to avoid affecting the original
      const clone = invoiceElement.cloneNode(true);
      clone.style.width = '210mm'; // A4 width
      clone.style.padding = '20mm';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 210 * 3.78, // Convert mm to pixels (1mm = 3.78px)
        height: clone.scrollHeight * 2,
      });

      // Remove the clone
      document.body.removeChild(clone);

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Create a blob from the PDF
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
      
      // Clean up the URL object after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);

      toast.success("Invoice opened in PDF format");
    } catch (error) {
      console.error("Error viewing invoice:", error);
      toast.error("Failed to view invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoiceId) => {
    try {
      setLoading(true);
      const invoiceElement = document.getElementById(`invoice-${invoiceId}`);
      if (!invoiceElement) {
        toast.error("Invoice element not found");
        return;
      }

      // Create a clone of the element to avoid affecting the original
      const clone = invoiceElement.cloneNode(true);
      clone.style.width = '210mm'; // A4 width
      clone.style.padding = '20mm';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 210 * 3.78, // Convert mm to pixels (1mm = 3.78px)
        height: clone.scrollHeight * 2,
      });

      // Remove the clone
      document.body.removeChild(clone);

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(`Invoice-${invoiceId}.pdf`);
      toast.success("Invoice downloaded successfully as PDF");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InvoiceCard = ({ invoice }) => (
    <div id={`invoice-${invoice._id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold dark:text-white text-gray-800">
            INVOICE
          </h1>
          {invoice.billingDetails.from.logo && (
            <img
              src={invoice.billingDetails.from.logo}
              alt="Company Logo"
              className="max-h-20 object-contain"
            />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-gray-600 dark:text-gray-400">
              Invoice Number:
            </label>
            <span className="font-medium">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-600 dark:text-gray-400">Date:</label>
            <span className="font-medium">{formatDate(invoice.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-600 dark:text-gray-400">Due Date:</label>
            <span className="font-medium">{formatDate(invoice.dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="p-4 dark:bg-gray-700 bg-gray-50 rounded-lg">
          <h2 className="text-lg dark:text-white font-semibold mb-4 text-gray-700">
            Bill From
          </h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">{invoice.billingDetails.from.companyName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.email}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 dark:text-white text-gray-700">
            Bill To
          </h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">{invoice.billingDetails.to.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-400 text-gray-700">
          Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 rounded-sm">
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-2">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="ml-auto w-80">
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="font-medium">{formatCurrency(invoice.tax)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-900">
            <span className="font-bold">Total:</span>
            <span className="font-bold">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => handleDownload(invoice._id)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
        >
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
        <button
          onClick={() => handleViewInvoice(invoice)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
        >
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View
        </button>
        <button
          onClick={() => handleDeleteInvoice(invoice._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
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
