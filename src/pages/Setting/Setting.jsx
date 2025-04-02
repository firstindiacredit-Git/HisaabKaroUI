import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSettings } from "../../components/Settings/LanguageSettings";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import axios from 'axios';
import { message } from "antd";

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const Setting = () => {
  const [activeTab, setActiveTab] = useState("security");
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [newPin, setNewPin] = useState(["", "", "", ""]);

  // Get userId from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // API configuration
  const api = axios.create({
    baseURL: "http://localhost:5100/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return; // Ensure only one digit
    
    setNewPin((prevPin) => {
      const newPin = [...prevPin];
      newPin[index] = value;
      return newPin;
    });

    // Move to next input if value is entered
    if (value && index < 3) {
      document.getElementById(`pin-input-${index + 1}`).focus();
    }
  };

  const handleChangePin = async () => {
    const enteredNewPin = newPin.join("");

    if (!userId) {
      message.error("User ID is not set. Please log in.");
      return;
    }

    if (enteredNewPin.length !== 4) {
      message.error("Please enter a valid 4-digit PIN.");
      return;
    }

    try {
      const response = await api.patch(`/users/update-pin/${userId}`, {
        newPin: enteredNewPin
      });

      if (response.status === 200) {
        message.success("PIN updated successfully!");
        setNewPin(["", "", "", ""]);
      }
    } catch (error) {
      console.error("Error changing PIN:", error);
      message.error(error.response?.data?.message || "Failed to update PIN. Please try again.");
    }
  };

  const tabs = [
    { id: "security", label: t("profile.tabs.security") },
    { id: "preferences", label: t("profile.tabs.preferences") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen dark:bg-gray-900 bg-blue-50  flex flex-col items-center py-12 px-4 relative"
    >
      
      <motion.div
        className="bg-white/90 w-[50%] h-full dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "security" && (
              <div className="p-8">
                <h3 className="text-xl dark:text-white font-semibold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
                    <h4 className="dark:text-white font-medium">Change PIN</h4>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New PIN
                        </label>
                        <div className="flex items-center space-x-2">
                          {newPin.map((digit, index) => (
                            <input
                              key={index}
                              id={`pin-input-${index}`}
                              type={showPin ? "text" : "password"}
                              value={digit}
                              maxLength="1"
                              onChange={(e) => handleInputChange(e, index)}
                              className="w-10 h-10 text-center text-2xl border p-1 rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                          >
                            {showPin ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleChangePin}
                        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                      >
                        Update PIN
                      </button>
                    </div>
                  </div>
                  <div className="p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
                    <h4 className="dark:text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
                    <h4 className="dark:text-white font-medium">Password Settings</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Change your password or set up password recovery
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="p-8">
                  <h3 className="text-xl dark:text-white font-semibold mb-4">
                  User Preferences
                </h3>
                <div className="space-y-4">
                  <div className="p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
                    <h4 className="dark:text-white font-medium">Notification Settings</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your email and push notifications
                    </p>
                  </div>
                  <LanguageSettings />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {/* <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center">
          <div className="bg-red-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800">
              Unable to Load Profile
            </h3>
            <p className="text-red-700 mt-1">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        </div>
      </div> */}
    </motion.div>
  );
};

export default Setting;
