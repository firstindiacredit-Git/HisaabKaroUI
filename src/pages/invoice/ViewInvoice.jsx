import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { Spin, Tag, Modal } from "antd";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "react-hot-toast";

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");

      if (!token || !userId || !email) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axios.get(`/api/invoices/${id}`, {
        params: {
          userId,
          email,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setInvoice(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch invoice");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error(error.response?.data?.message || "Failed to fetch invoice");
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      if (!invoiceRef.current || !invoice) {
        toast.error("Invoice data not available");
        return;
      }

      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Open PDF in new tab instead of downloading
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      toast.success("Invoice opened in PDF format");
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "sent":
        return "processing";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Invoice not found</h2>
        <button
          onClick={() => navigate("/received-invoices")}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
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
            View as PDF
          </button>
        </div>

        {/* Invoice Content */}
        <div
          ref={invoiceRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                INVOICE
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                #{invoice.invoiceNumber}
              </p>
            </div>
            <div className="text-right">
              <Tag color={getStatusColor(invoice.status)} className="text-sm">
                {invoice.status.toUpperCase()}
              </Tag>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Date: {formatDate(invoice.date)}
              </p>
              {invoice.dueDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due Date: {formatDate(invoice.dueDate)}
                </p>
              )}
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* From Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                From
              </h2>
              <div className="space-y-2">
                <p className="font-medium">
                  {invoice.billingDetails.from.companyName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.from.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.from.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.from.email}
                </p>
                {invoice.billingDetails.from.gst && (
                  <p className="text-gray-600 dark:text-gray-400">
                    GST: {invoice.billingDetails.from.gst}
                  </p>
                )}
                {invoice.billingDetails.from.pan && (
                  <p className="text-gray-600 dark:text-gray-400">
                    PAN: {invoice.billingDetails.from.pan}
                  </p>
                )}
              </div>
            </div>

            {/* To Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                To
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{invoice.billingDetails.to.name}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.to.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.to.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.billingDetails.to.email}
                </p>
                {invoice.billingDetails.to.gst && (
                  <p className="text-gray-600 dark:text-gray-400">
                    GST: {invoice.billingDetails.to.gst}
                  </p>
                )}
                {invoice.billingDetails.to.pan && (
                  <p className="text-gray-600 dark:text-gray-400">
                    PAN: {invoice.billingDetails.to.pan}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="text-right py-3 px-4">{item.quantity}</td>
                    <td className="text-right py-3 px-4">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">
                  {formatCurrency(invoice.tax)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t dark:border-gray-700">
                <span className="font-bold text-gray-800 dark:text-white">
                  Total
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          {invoice.termsAndConditions &&
            invoice.termsAndConditions.length > 0 && (
              <div className="border-t dark:border-gray-700 pt-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Terms and Conditions
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {invoice.termsAndConditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
