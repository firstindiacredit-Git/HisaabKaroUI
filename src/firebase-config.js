import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAWBQQS0pt-dEJxx3JbQaCP-dlmThIOmsQ",
  authDomain: "apnakahata.firebaseapp.com",
  projectId: "apnakahata",
  storageBucket: "apnakahata.firebasestorage.app",
  messagingSenderId: "181428736249",
  appId: "1:181428736249:web:b35981a877290fd7d1d228",
  measurementId: "G-WSMTSLK59V",
  vapidKey:
    "BJYKJFtr7C9cH_ScmusjquJGu91XIwg4ZB2TDe9Cp7MPU5VaUAuL7H2-noLsYVq84-6LbgodyXnYLYUVMTCPjMY",
};

// Validate Firebase Config
const validateConfig = () => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field]
  );

  if (missingFields.length > 0) {
    console.error("❌ Missing required Firebase config fields:", missingFields);
    throw new Error(
      `Missing required Firebase configuration fields: ${missingFields.join(
        ", "
      )}`
    );
  }
  console.log("✅ Firebase config validation passed");
};

// Validate config before initialization
validateConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    console.log("🔄 Registering service worker...");
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("✅ Service Worker registered successfully:", registration);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("❌ Notification permission denied.");
      return null;
    }

    console.log("✅ Notification permission granted.");
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: registration, // Ensure service worker is passed
    });

    if (token) {
      console.log("🎯 FCM Token:", token);
      return token;
    }

    console.warn("⚠️ No FCM token received.");
    return null;
  } catch (error) {
    console.error("❌ Error in notification setup:", error);
    return null;
  }
};

// Function to refresh token
export const refreshToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      forceRefresh: true,
    });

    if (token) {
      console.log("🔄 Token refreshed successfully");
      return token;
    }

    console.warn("⚠️ No new token received.");
    return null;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return null;
  }
};

// Function to handle foreground messages with unsubscribe capability
export const onMessageListener = (callback) => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("📩 Received foreground message:", payload);
    callback(payload);
  });

  return () => {
    console.log("🛑 Unsubscribing from message listener");
    unsubscribe();
  };
};

export { messaging };

