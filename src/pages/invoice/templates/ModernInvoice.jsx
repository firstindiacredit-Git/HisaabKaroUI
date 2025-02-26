import React, { useState, useEffect, useRef } from "react";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ModernInvoice = () => {
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

  // Reuse the same helper functions
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
        template: "modern",
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
        content: "Failed to save invoice fill all field. Please try again.",
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
        template: "modern",
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
    <div className="min-h-screen w-full dark:bg-gray-900 bg-gray-50">
      <div ref={invoiceRef}>
        {/* Modern Header with full-width blue background */}
        <div className="bg-blue-600 text-white py-4">
          <div className="w-full mx-auto px-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">INVOICE</h1>
                <p className="text-blue-100">
                  #{invoiceData.invoiceNumber || "INV-0001"}
                </p>
              </div>
              {invoiceData.billedBy.logo && (
                <img
                  src={invoiceData.billedBy.logo}
                  alt="Company Logo"
                  className="max-h-16 object-contain bg-white p-2 rounded"
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto px-6 py-8">
          {/* Logo Upload */}
          <div className="mb-8">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, date: e.target.value })
                }
                className="w-full bg-gray-200 rounded dark:bg-gray-700 p-1 border-gray-200 focus:ring-0 focus:border-blue-500"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                }
                className="w-full bg-gray-200 rounded dark:bg-gray-700 p-1 border-gray-200 focus:ring-0 focus:border-blue-500"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    invoiceNumber: e.target.value,
                  })
                }
                className="w-full bg-gray-200 rounded dark:bg-gray-700 p-1 border-gray-200 focus:ring-0 focus:border-blue-500"
                placeholder="INV-0001"
              />
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-blue-600">
                Bill From
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                    Company Name
                  </label>
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
                    className="w-full dark:bg-gray-700 bg-gray-100 rounded border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                    Address
                  </label>
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
                    className="w-full dark:bg-gray-700  bg-gray-100 rounded-lg focus:ring-0 focus:border-blue-500 py-2 px-3"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={invoiceData.billedBy.phone}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          billedBy: {
                            ...invoiceData.billedBy,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full dark:bg-gray-700 bg-gray-200 rounded border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={invoiceData.billedBy.email}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          billedBy: {
                            ...invoiceData.billedBy,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full dark:bg-gray-700 bg-gray-200 rounded border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-blue-600">Bill To</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={invoiceData.billedTo.name}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        billedTo: {
                          ...invoiceData.billedTo,
                          name: e.target.value,
                        },
                      })
                    }
                    className="w-full dark:bg-gray-700 bg-gray-200 rounded border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                    Address
                  </label>
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
                    className="w-full dark:bg-gray-700 bg-gray-200 rounded-lg focus:ring-0 focus:border-blue-500 py-2 px-3"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={invoiceData.billedTo.phone}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          billedTo: {
                            ...invoiceData.billedTo,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-gray-200 rounded dark:bg-gray-700 border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={invoiceData.billedTo.email}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          billedTo: {
                            ...invoiceData.billedTo,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full dark:bg-gray-700 bg-gray-200 rounded border-gray-200 focus:ring-0 focus:border-blue-500 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            <h2 className="text-xl font-bold p-6 text-blue-600 border-b">
              Items
            </h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full dark:bg-gray-600 bg-gray-50 rounded pl-2 border-gray-200 focus:ring-0 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
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
                        className="w-full dark:bg-gray-600 bg-gray-50 rounded pl-2 border-gray-200 focus:ring-0 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
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
                        className="w-full dark:bg-gray-600 bg-gray-50 rounded pl-2 border-gray-200 focus:ring-0 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 dark:text-white text-gray-900 font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 border-t">
              <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ml-auto w-80">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax (10%)
                </span>
                <span className="font-medium">
                  ${calculateTax().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-blue-600">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons section - outside of invoiceRef */}
      <div className="flex justify-end gap-4 mt-8 px-6 pb-8">
        <button
          onClick={handleDownload}
          disabled={loading}
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
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
          Send Invoice
        </button>
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

export default ModernInvoice;
