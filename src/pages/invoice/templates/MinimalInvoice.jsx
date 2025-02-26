import React, { useState, useEffect, useRef } from "react";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MinimalInvoice = () => {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    billedBy: {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      logo: null,
    },
    billedTo: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    items: [{ description: "", quantity: 1, price: 0 }],
  });

  // Helper functions (same as other templates)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({
          ...invoiceData,
          billedBy: { ...invoiceData.billedBy, logo: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      const response = await axios.post("/api/invoices/save-invoice", {
        template: "minimal",
        invoiceData,
        status: "save",
        subtotal,
        tax,
        total,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        billingDetails: {
          from: invoiceData.billedBy,
          to: invoiceData.billedTo,
        },
        dueDate: invoiceData.dueDate,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
      });

      if (response.data.success) {
        navigate("/saved-invoices");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      Modal.error({
        title: "Error",
        content:
          "Failed to save invoice. Please fill all fields and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedClient) {
      Modal.error({
        title: "Error",
        content: "Please select a client to send the invoice.",
      });
      return;
    }

    try {
      setLoading(true);
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      // Get the selected client's details
      const client = clients.find((c) => c._id === selectedClient);
      if (!client) {
        throw new Error("Selected client not found");
      }

      const response = await axios.post("/api/invoices/sent-invoice", {
        template: "minimal",
        recipientEmail: client.email,
        recipientId: client._id,
        status: "sent",
        subtotal,
        tax,
        total,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        billingDetails: {
          from: {
            companyName: invoiceData.billedBy.companyName,
            email: invoiceData.billedBy.email,
            address: invoiceData.billedBy.address,
            phone: invoiceData.billedBy.phone,
            logo: invoiceData.billedBy.logo,
          },
          to: {
            name: client.name,
            email: client.email,
            address: client.address,
            phone: client.phone,
          },
        },
        dueDate: invoiceData.dueDate,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
      });

      if (response.data.success) {
        Modal.success({
          title: "Success",
          content: "Invoice sent successfully!",
          onOk: () => navigate("/invoice/sent"),
        });
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      Modal.error({
        title: "Error",
        content:
          error.response?.data?.message ||
          "Failed to send invoice. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const invoice = invoiceRef.current;
      const canvas = await html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false,
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
      pdf.save(`Invoice-${invoiceData.invoiceNumber || "INV-0001"}.pdf`);

      Modal.success({
        title: "Success",
        content: "Invoice downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading invoice:", error);
      Modal.error({
        title: "Error",
        content: "Failed to download invoice. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("/api/v3/client/getAll-clients");
        setClients(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="w-full h-full mx-auto p-8 dark:bg-gray-800 bg-white">
      <div ref={invoiceRef}>
        {/* Minimal Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start">
            {invoiceData.billedBy.logo && (
              <img
                src={invoiceData.billedBy.logo}
                alt="Company Logo"
                className="max-h-12 object-contain"
              />
            )}
            <input
              type="text"
              value={invoiceData.invoiceNumber}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  invoiceNumber: e.target.value,
                })
              }
              placeholder="Invoice #"
              className="text-right text-gray-600 dark:bg-gray-700 bg-gray-100 focus:outline-none"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mt-2 text-sm text-gray-500"
          />
        </div>

        {/* Dates */}
        <div className="flex justify-between mb-12">
          <div>
            <input
              type="date"
              value={invoiceData.date}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, date: e.target.value })
              }
              className="block bg-gray-100 dark:bg-gray-700 p-1 rounded dark:text-white text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, dueDate: e.target.value })
              }
              className="block text-gray-600 bg-gray-100 dark:bg-gray-700 p-1 rounded dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 rounded dark:text-gray-400 mb-2">
              From
            </h2>
            <input
              type="text"
              value={invoiceData.billedBy.companyName}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedBy: {
                    ...invoiceData.billedBy,
                    companyName: e.target.value,
                  },
                })
              }
              placeholder="Your Company"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded mb-2 focus:outline-none"
            />
            <textarea
              value={invoiceData.billedBy.address}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedBy: {
                    ...invoiceData.billedBy,
                    address: e.target.value,
                  },
                })
              }
              placeholder="Address"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded mb-2 focus:outline-none resize-none"
              rows="2"
            />
            <input
              type="email"
              value={invoiceData.billedBy.email}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedBy: { ...invoiceData.billedBy, email: e.target.value },
                })
              }
              placeholder="Email"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded focus:outline-none"
            />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Bill To
            </h2>
            <input
              type="text"
              value={invoiceData.billedTo.name}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedTo: { ...invoiceData.billedTo, name: e.target.value },
                })
              }
              placeholder="Client Name"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded mb-2 focus:outline-none"
            />
            <textarea
              value={invoiceData.billedTo.address}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedTo: {
                    ...invoiceData.billedTo,
                    address: e.target.value,
                  },
                })
              }
              placeholder="Address"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded mb-2 focus:outline-none resize-none"
              rows="2"
            />
            <input
              type="email"
              value={invoiceData.billedTo.email}
              onChange={(e) =>
                setInvoiceData({
                  ...invoiceData,
                  billedTo: { ...invoiceData.billedTo, email: e.target.value },
                })
              }
              placeholder="Email"
              className="block w-full bg-gray-100 dark:bg-gray-700 p-1 rounded focus:outline-none"
            />
          </div>
        </div>

        {/* Items */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </th>
                <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Qty
                </th>
                <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="py-2 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="w-full bg-gray-100 dark:bg-gray-700 pl-2 rounded focus:outline-none"
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 bg-gray-100 dark:bg-gray-700 pl-2 rounded focus:outline-none"
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-24  bg-gray-100 dark:bg-gray-700 pl-2 rounded focus:outline-none"
                    />
                  </td>
                  <td className="py-4">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            + Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="ml-auto w-64">
          <div className="text-right">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (10%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Add action buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleDownload}
            disabled={loading}
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
            onClick={handleSave}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Invoice
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
            Send Invoice
          </button>
        </div>
      </div>

      {/* Client Selection Modal */}
      <Modal
        title="Select Client"
        open={isModalOpen}
        onOk={handleSend}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Client to Send Invoice
          </label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Choose a client...</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default MinimalInvoice;
