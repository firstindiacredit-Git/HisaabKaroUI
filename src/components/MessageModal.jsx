import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, List, Avatar, message } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import axios from "../config/axios";
import "./MessageModel.css";
// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_URL; // Add your backend URL
axios.defaults.withCredentials = true;

const MessageModal = ({
  isOpen,
  onClose,
  transactionId,
  entryId,
  currentUser,
  otherUser,
  onMessageSent,
  pageInfo,
  onPageChange,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const loggedInUserId = localStorage.getItem('userId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update fetchTransactionDetails function
  const fetchTransactionDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success && response.data?.data) {
        const transaction = response.data.data;
        // Set both client and user info for proper name display
        setClientInfo({
          clientUser: transaction.clientUserId,
          mainUser: transaction.userId
        });
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  useEffect(() => {
    console.log("Modal Opened with Transaction ID:", transactionId, "Entry ID:", entryId);
    
    if (isOpen && transactionId && entryId) {
      fetchMessages();
      fetchTransactionDetails();

      // Polling messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, transactionId, entryId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add click outside handler for emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add emoji handler
  const onEmojiClick = (emojiObject) => {
    const cursor = document.getElementById('message-input').selectionStart;
    const text = newMessage.slice(0, cursor) + emojiObject.emoji + newMessage.slice(cursor);
    setNewMessage(text);
  };

  const fetchMessages = async () => {
    if (!transactionId || !entryId) {
      console.warn("Transaction ID or Entry ID is missing, skipping message fetch.");
      return;
    }

    console.log("Fetching messages for Transaction ID:", transactionId, "Entry ID:", entryId);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get(`${process.env.REACT_APP_URL}/api/messages/messages/${transactionId}/${entryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Messages API Response:", response);

      if (response.data?.status === "success" && Array.isArray(response.data?.data?.messages)) {
        setMessages(response.data.data.messages);
        if (response.data.data.pagination && onPageChange) {
          onPageChange(response.data.data.pagination);
        }
      } else {
        console.warn("Unexpected response format:", response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch messages";
      message.error(errorMessage);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      message.warning("Cannot send an empty message.");
      return;
    }

    if (!transactionId || !entryId) {
      message.error("Transaction ID and Entry ID are required to send a message.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/messages/send",
        {
          transactionId,
          message: newMessage.trim(),
          entryId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Message Sent Response:", response.data);

      if (response.data?.status === "success" && response.data?.data?.message) {
        // Create a properly formatted message object with sender info
        const newMessageObj = {
          ...response.data.data.message,
          sender: {
            _id: loggedInUserId,
            name: currentUser?.name || 'You'
          },
          recipient: {
            _id: otherUser?._id,
            name: otherUser?.name || 'Other'
          }
        };
        
        setMessages((prev) => [...prev, newMessageObj]);
        setNewMessage("");
        if (onMessageSent) onMessageSent();
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error sending message:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to format messages consistently
  const formatMessage = (msg) => ({
    ...msg,
    sender: msg.sender || loggedInUserId // Ensure sender is always present
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Modal
      title={
        <div className="flex dark:text-white dark:bg-gray-800 items-center space-x-3">
          <Avatar>
            {messages.length > 0 && messages[0].sender && messages[0].recipient
              ? (messages[0].sender._id === loggedInUserId 
                ? messages[0].recipient.name?.charAt(0) || 'U'
                : messages[0].sender.name?.charAt(0) || 'U')
              : otherUser?.name?.charAt(0) || 'U'}
          </Avatar>
          <div>
            <div className="font-semibold">
              {messages.length > 0 && messages[0].sender && messages[0].recipient
                ? (messages[0].sender._id === loggedInUserId 
                  ? messages[0].recipient.name || 'User'
                  : messages[0].sender.name || 'User')
                : otherUser?.name || 'User'}
            </div>
            <div className="text-xs  text-gray-500">Transaction Entry Chat</div>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{
        body: { height: "60vh", display: "flex", flexDirection: "column" },
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.sender._id === loggedInUserId;
              const otherPersonName = isCurrentUser ? msg.recipient.name : msg.sender.name;
              
              return (
                <div
                  key={msg._id || index}
                  className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`rounded-lg px-4 py-2 break-words ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ml-2'
                      }`}
                    >
                      <div className="text-sm">{msg.message}</div>
                    </div>
                  </div>
                  <div className={`text-xs mt-1 ${
                    isCurrentUser ? 'mr-2' : 'ml-8'
                  } text-gray-500 dark:text-gray-400 select-none`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 dark:bg-gray-800">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input.TextArea
              id="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            />
            <Button
              type="text"
              icon={<SmileOutlined style={{ fontSize: '20px' }} className="dark:text-gray-300" />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 dark:hover:bg-gray-700"
            />
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-2"
                style={{ zIndex: 1000 }}
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                  theme="dark"
                />
              </div>
            )}
          </div>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            disabled={!newMessage.trim()}
            className="self-end dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-600"
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
