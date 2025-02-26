import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
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

  const handleSentEmail = async (invoice) => {
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
      alert("Email sent successfully with invoice attachment!");
      setSelectedInvoice(null);
      setEmailData({ to: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  const handleSendEmail = async (invoice) => {
    const subject = `Invoice #${invoice.invoiceNumber} from HisaabKaro`;
    const body = `Dear ${invoice.client?.name || "Valued Customer"},

Please find attached the invoice #${invoice.invoiceNumber} for your reference.

Thank you for your business!

Best regards,
[Your Company Name]`;

    const mailtoLink = `mailto:${
      invoice.client?.email || ""
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Update invoice status to sent
    try {
      await axios.patch(`/api/invoices/${invoice._id}/status`, {
        status: "sent",
      });
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-6 dark:bg-gray-900 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sent Invoices</h1>
        <button
          onClick={() => navigate("/invoice")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Create New Invoice
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sent: {new Date(invoice.sentAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Client: {invoice.client?.name || "No Client Name"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Template: {invoice.template}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!invoice._id) {
                        toast.error("Invalid invoice ID");
                        return;
                      }
                      navigate(`/invoice/view/${invoice._id}`);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleSendEmail(invoice)}
                    className="text-green-500 hover:text-green-600"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sent Invoice Email</h2>
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
                  Sent
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
