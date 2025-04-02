import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { notification, Spin, Empty, Badge, Tag } from "antd";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const ReceivedInvoices = () => {
  const [receivedInvoices, setReceivedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    unreadCount: 0,
    showNotifications: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceivedInvoices();
    setupWebSocket();
  }, []);

  const setupWebSocket = () => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    if (!email || !userId) return;

    // Use Socket.IO instead of WebSocket
    const socket = io(process.env.REACT_APP_WS_URL || "http://localhost:5100", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket.IO Connected");
      // Register for notifications
      socket.emit("REGISTER", {
        email: email,
        userId: userId,
      });
    });

    socket.on("newNotification", (data) => {
      console.log("New notification received:", data);
      if (data.type === "NEW_INVOICE") {
        toast.success(`New invoice received from ${data.senderName}`);
        fetchReceivedInvoices(); // Refresh the list
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    return () => {
      socket.disconnect();
    };
  };

  const fetchReceivedInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");

      if (!token || !userId || !email) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axios.get("/api/invoices/received-invoices", {
        params: {
          userId,
          email,
          markAsRead: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        if (response.data.data.length === 0) {
          toast.info("No invoices found");
        }

        // Sort invoices by date, with unread ones first
        const sortedInvoices = response.data.data.sort((a, b) => {
          // First sort by read status
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
          }
          // Then sort by date
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setReceivedInvoices(sortedInvoices);
        setNotifications({
          unreadCount: response.data.unreadCount || 0,
          showNotifications: false,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch invoices");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch invoices";
      toast.error(errorMessage);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 dark:bg-gray-900 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Received Invoices
          {notifications.unreadCount > 0 && (
            <Badge count={notifications.unreadCount} className="ml-2" />
          )}
        </h1>
      </div>

      {receivedInvoices.length === 0 ? (
        <Empty description="No invoices received" className="my-8" />
      ) : (
        <div className="grid gap-4">
          {receivedInvoices.map((invoice) => (
            <div
              key={invoice._id}
              className={`border border-blue-50 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                !invoice.isRead
                  ? "bg-blue-50  dark:bg-gray-800"
                  : ""
              }`}
              onClick={() => {
                if (!invoice._id) {
                  toast.error("Invalid invoice ID");
                  return;
                }
                navigate(`/invoice/view/${invoice._id}`);
              }}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Invoice #{invoice.invoiceNumber}
                    </h3>
                    {!invoice.isRead && <Badge dot className="animate-pulse" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    From:{" "}
                    {invoice.sender?.name ||
                      invoice.billingDetails.from.companyName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sender Email:{" "}
                    {invoice.sender?.email || invoice.billingDetails.from.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(invoice.date).toLocaleDateString()}
                  </p>
                  {invoice.dueDate && (
                    <p className="text-sm text-gray-500">
                      Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg">
                    ₹{invoice.total.toFixed(2)}
                  </span>
                  <Tag color={getStatusColor(invoice.status)} className="mt-2">
                    {invoice.status.toUpperCase()}
                  </Tag>
                  {invoice.sentAt && (
                    <span className="text-xs text-gray-500 mt-1">
                      Received: {new Date(invoice.sentAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedInvoices;
