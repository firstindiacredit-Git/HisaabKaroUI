import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const SentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices/sent-invoices");
        setInvoices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sent invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentInvoices();
  }, []);

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

  const getTemplateDisplayName = (template) => {
    switch (template) {
      case "classic":
        return "Classic Invoice";
      case "modern":
        return "Modern Invoice";
      case "business":
        return "Business Invoice";
      case "minimal":
        return "Minimal Invoice";
      default:
        return template;
    }
  };

  const getTemplateIcon = (template) => {
    switch (template) {
      case "classic":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "modern":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "business":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "minimal":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredInvoices = selectedTemplate === "all" 
    ? invoices 
    : invoices.filter(invoice => invoice.template === selectedTemplate);

  const templateCategories = [
    { value: "all", label: "All Templates" },
    { value: "classic", label: "Classic" },
    { value: "modern", label: "Modern" },
    { value: "business", label: "Business" },
    { value: "minimal", label: "Minimal" }
  ];

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

  const handleDownload = async (invoice) => {
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

      // Save the PDF
      pdf.save(`Invoice-${invoice._id}.pdf`);
      toast.success("Invoice downloaded successfully as PDF");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (invoice) => {
    setSelectedInvoice(invoice);
    setEmailData({
      to: invoice.client?.email || "",
      subject: `Invoice #${invoice.invoiceNumber}`,
      message: `Dear ${invoice.client?.name},\n\nPlease find attached invoice #${invoice.invoiceNumber}.`,
    });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("to", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("message", emailData.message);
      formData.append("invoiceId", selectedInvoice._id);

      await axios.post(
        `/api/invoices/${selectedInvoice._id}/send-email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Email sent successfully!");
      setSelectedInvoice(null);
      setEmailData({ to: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const InvoiceCard = ({ invoice }) => {
    if (invoice.template === "classic") {
      return (
        <div id={`invoice-${invoice._id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
          {/* Classic Header Section */}
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
              onClick={() => handleDownload(invoice)}
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
              onClick={() => handleSendEmail(invoice)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </button>
          </div>
        </div>
      );
    } else if (invoice.template === "modern") {
      return (
        <div id={`invoice-${invoice._id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          {/* Modern Header with full-width blue background */}
          <div className="bg-blue-600 text-white py-4">
            <div className="w-full mx-auto px-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">INVOICE</h1>
                  <p className="text-blue-100">
                    #{invoice.invoiceNumber}
                  </p>
                </div>
                {invoice.billingDetails.from.logo && (
                  <img
                    src={invoice.billingDetails.from.logo}
                    alt="Company Logo"
                    className="max-h-16 object-contain bg-white p-2 rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full mx-auto px-6 py-8">
            {/* Dates Section */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                  Invoice Date
                </label>
                <span className="font-medium">{formatDate(invoice.date)}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                  Due Date
                </label>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                  Status
                </label>
                <span className="font-medium capitalize">{invoice.status || "Sent"}</span>
              </div>
            </div>

            {/* Billing Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6 text-blue-600">
                  Bill From
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{invoice.billingDetails.from.companyName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6 text-blue-600">Bill To</h2>
                <div className="space-y-4">
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
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden mb-8">
              <h2 className="text-xl font-bold p-6 text-blue-600 border-b">
                Items
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-600">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 ml-auto w-80">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax
                  </span>
                  <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between py-4 border-t-2 border-blue-600">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => handleDownload(invoice)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
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
                onClick={() => handleSendEmail(invoice)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email
              </button>
            </div>
          </div>
        </div>
      );
    } else if (invoice.template === "business") {
      return (
        <div id={`invoice-${invoice._id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          {/* Business Header */}
          <div className="bg-gray-50 dark:bg-gray-700 py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">INVOICE</h1>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Invoice #</span>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                    <p className="font-medium">{formatDate(invoice.date)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                    <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
              {invoice.billingDetails.from.logo && (
                <img
                  src={invoice.billingDetails.from.logo}
                  alt="Company Logo"
                  className="max-h-16 object-contain"
                />
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Billing Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Bill From</h2>
                <div className="space-y-2">
                  <p className="font-medium">{invoice.billingDetails.from.companyName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.phone}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.email}</p>
                  {invoice.billingDetails.from.gst && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">GST: {invoice.billingDetails.from.gst}</p>
                  )}
                  {invoice.billingDetails.from.pan && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">PAN: {invoice.billingDetails.from.pan}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Bill To</h2>
                <div className="space-y-2">
                  <p className="font-medium">{invoice.billingDetails.to.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.phone}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.email}</p>
                  {invoice.billingDetails.to.gst && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">GST: {invoice.billingDetails.to.gst}</p>
                  )}
                  {invoice.billingDetails.to.pan && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">PAN: {invoice.billingDetails.to.pan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Description</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-2 font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                onClick={() => handleDownload(invoice)}
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
                onClick={() => handleSendEmail(invoice)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email
              </button>
            </div>
          </div>
        </div>
      );
    } else if (invoice.template === "minimal") {
      return (
        <div id={`invoice-${invoice._id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          {/* Minimal Header */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-8">
              {invoice.billingDetails.from.logo && (
                <img
                  src={invoice.billingDetails.from.logo}
                  alt="Company Logo"
                  className="max-h-12 object-contain"
                />
              )}
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">INVOICE</h1>
                <p className="text-gray-600 dark:text-gray-400">#{invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">From</h2>
                <p className="font-medium">{invoice.billingDetails.from.companyName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.from.email}</p>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Bill To</h2>
                <p className="font-medium">{invoice.billingDetails.to.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.billingDetails.to.email}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                    <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Qty</th>
                    <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                    <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">{item.description}</td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4">{formatCurrency(item.price)}</td>
                      <td className="py-4">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="ml-auto w-64">
              <div className="text-right">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => handleDownload(invoice)}
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
                onClick={() => handleSendEmail(invoice)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default template (if none of the above)
    return (
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
            onClick={() => handleDownload(invoice)}
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
            onClick={() => handleSendEmail(invoice)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Email
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-6 dark:bg-gray-900 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sent Invoices</h1>
        <div className="flex gap-4 items-center">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            {templateCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
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
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No sent invoices found for {selectedTemplate === "all" ? "any template" : `the ${getTemplateDisplayName(selectedTemplate)} template`}
          </p>
          <button
            onClick={() => navigate("/invoice")}
            className="text-blue-500 hover:text-blue-600"
          >
            Create your first invoice
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {templateCategories
            .filter(category => category.value !== "all")
            .map(category => {
              const templateInvoices = filteredInvoices.filter(
                invoice => invoice.template === category.value
              );
              
              if (templateInvoices.length === 0) return null;

              return (
                <div key={category.value} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {getTemplateIcon(category.value)}
                    <h2 className="text-xl font-semibold">
                      {getTemplateDisplayName(category.value)}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({templateInvoices.length} invoices)
                    </span>
                  </div>
                  <div className="grid gap-6">
                    {templateInvoices.map((invoice) => (
                      <InvoiceCard key={invoice._id} invoice={invoice} />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Email Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Send Invoice Email</h2>
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To:</label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) =>
                    setEmailData({ ...emailData, to: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message:
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentInvoices;
