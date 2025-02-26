import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  requestNotificationPermission,
  onMessageListener,
  refreshToken,
} from "../firebase-config";

const NotificationHandler = () => {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("🚀 NotificationHandler: Initializing...");

    const initializeFCM = async () => {
      try {
        if ("serviceWorker" in navigator) {
          console.log("✅ Service Worker is supported");
          const token = await requestNotificationPermission();

          if (!token) {
            console.warn("⚠️ No token received, skipping backend request");
            return;
          }

          console.log("🔑 Got FCM token, sending to backend...");
          
          
          try {
            const response = await fetch(
              `${process.env.REACT_APP_URL}/api/fcm/token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ token }),
              }
            );

            if (response.ok) {
              console.log("✅ Token saved to backend successfully");
            } else {
              console.error(
                "❌ Failed to save token to backend:",
                await response.text()
              );
            }
          } catch (error) {
            console.error("❌ Error saving token to backend:", error);
          }
        } else {
          console.error("❌ Service workers are not supported");
        }
      } catch (error) {
        console.error("❌ Error initializing FCM:", error);
      }
    };

    initializeFCM();

    // Set up periodic token refresh
    console.log("⏰ Setting up token refresh interval");
    const tokenRefreshInterval = setInterval(async () => {
      console.log("🔄 Refreshing FCM token...");
      const newToken = await refreshToken();

      if (!newToken) {
        console.warn("⚠️ No new token received, skipping backend update");
        return;
      }

      console.log("✅ Token refreshed, updating backend...");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/fcm/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ token: newToken }),
          }
        );

        if (response.ok) {
          console.log("✅ Refreshed token saved to backend");
        } else {
          console.error(
            "❌ Failed to save refreshed token:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("❌ Error saving refreshed token:", error);
      }
    }, 3600000); // Refresh every hour

    // Listen for foreground messages
    console.log("👂 Setting up foreground message listener");
    const messageUnsubscribe = onMessageListener((payload) => {
      console.log("📨 Received foreground notification:", payload);
      setNotification(payload);
      setVisible(true);

      setTimeout(() => setVisible(false), 5000); // Auto-hide after 5s
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up NotificationHandler...");
      clearInterval(tokenRefreshInterval);
      if (messageUnsubscribe) {
        console.log("🛑 Unsubscribing from message listener");
        messageUnsubscribe();
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-5 bg-gray-800 text-white shadow-lg rounded-2xl p-4 w-80 border-l-4 
                     border-green-500 dark:bg-gray-900 dark:text-gray-100 z-[998]"
        >
          <h4 className="text-lg font-semibold">
            {notification.notification?.title}
          </h4>
          <p className="text-sm">{notification.notification?.body}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationHandler;
