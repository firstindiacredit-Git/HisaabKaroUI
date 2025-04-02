import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SendInvoice = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sentInvoices, setSentInvoices] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/invoices/sent-invoice", {
        recipientEmail,
        amount: parseFloat(amount),
        description,
      });

      toast.success("Invoice sent successfully!");
      // Add new invoice to sent history
      setSentInvoices([response.data, ...sentInvoices]);

      // Clear form
      setRecipientEmail("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Send Invoice</h2>

      <form onSubmit={handleSubmit} className="max-w-md mb-8">
        <div className="mb-4">
          <label className="block mb-2">Recipient Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Send Invoice
        </button>
      </form>

      <h3 className="text-xl font-bold mb-4">Sent Invoices History</h3>
      <div className="grid gap-4">
        {sentInvoices.map((invoice) => (
          <div key={invoice._id} className="border p-4 rounded-lg shadow">
            <div>
              <h4 className="font-semibold">To: {invoice.recipientEmail}</h4>
              <p>Amount: ${invoice.amount}</p>
              <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p>Status: {invoice.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SendInvoice;
