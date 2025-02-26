import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSettings } from "../../components/Settings/LanguageSettings";

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const Setting = () => {
  const [activeTab, setActiveTab] = useState("security");
  const { t } = useTranslation();

  const tabs = [
    { id: "security", label: t("profile.tabs.security") },
    { id: "preferences", label: t("profile.tabs.preferences") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center py-12 px-4 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-slow-spin"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-slow-spin-reverse"></div>
      </div>
      <motion.div
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
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
                <h3 className="text-xl font-semibold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Password Settings</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Change your password or set up password recovery
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">User Preferences</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Notification Settings</h4>
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
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
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
      </div>
    </motion.div>
  );
};

export default Setting;
