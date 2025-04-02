import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaBell } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import NotificationPanel from '../../components/NotificationPanel/NotificationPanel';

const Notification = ({ notificationRef, isMobile }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Add audio reference
  const notificationSound = useRef(new Audio('/inform.wav'));

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      notificationSound.current.currentTime = 0; // Reset sound to start
      notificationSound.current.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    } catch (error) {
      console.error('Error with notification sound:', error);
    }
  };

  // Define fetchNotifications function first
  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications - started');
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('email');
      
      console.log('Token available:', !!token);
      console.log('Email available:', !!userEmail);

      if (!token || !userEmail) {
        console.warn('Missing token or email');
        return;
      }

      // console.log('Making API request to:', `${process.env.REACT_APP_URL}/api/notifications`);
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Raw API Response:', response);
      console.log('Notifications data:', response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        console.log('Setting notifications:', response.data.data);
        setNotifications(response.data.data);
        // Update unread count when fetching notifications
        const unreadNotifications = response.data.data.filter(n => !n.isRead).length;
        setUnreadCount(unreadNotifications);
      } else {
        console.warn('Unexpected response format:', response.data);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:');
      console.error('Error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      console.log('Fetch notifications - completed');
      setLoading(false);
    }
  };

  // Add debug logs
  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    console.log('User email from localStorage:', userEmail);
    console.log('Show notifications:', showNotifications);
  }, [showNotifications]);

  // Fetch notifications when showing dropdown
  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (userEmail && showNotifications) {
      console.log('Conditions met to fetch notifications:', {
        userEmail,
        showNotifications
      });
      fetchNotifications();
    } else {
      console.log('Skipping notification fetch:', {
        userEmail,
        showNotifications
      });
    }
  }, [showNotifications]);

  // Socket connection
  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      console.log('Initializing socket connection for:', userEmail);
      const newSocket = io(process.env.REACT_APP_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        cors: {
          origin: true,
          credentials: true
        },
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        newSocket.emit('join', `client_${userEmail}`);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.error('Connection URL:', process.env.REACT_APP_URL);
      });

      newSocket.on('newNotification', (notification) => {
        console.log('Received new notification:', notification);
        setNotifications(prev => {
          const exists = prev.some(n => n._id === notification._id);
          if (!exists) {
            // Play sound when new notification arrives
            playNotificationSound();
            return [notification, ...prev];
          }
          return prev;
        });
        
        setUnreadCount(prevCount => prevCount + 1);
      });

      // Initial fetch of notifications
      fetchNotifications();

      return () => {
        console.log('Closing socket connection');
        if (newSocket) {
          newSocket.close();
        }
      };
    }
  }, []); // Empty dependency array since we want this to run once

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );

      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_URL}/api/notifications/mark-all-read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state to mark all notifications as read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Reset the unread count to 0
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/notifications/clear-all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/notifications/clear-read`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Keep only unread notifications
      setNotifications(prev => prev.filter(notif => !notif.isRead));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  };

  // Format notification time
  const formatNotificationTime = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return '💰';
      case 'SYSTEM':
        return '⚙️';
      case 'REMINDER':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getTransactionColor = (notification) => {
    // Return white background if notification is read
    if (notification.isRead) {
      return 'bg-white';
    }

    // For unread transaction notifications
    if (notification.type === 'TRANSACTION') {
      if (notification.message.toLowerCase().includes('added')) {
        return 'bg-green-50';  // Light green for new/added
      } else if (notification.message.toLowerCase().includes('updated')) {
        return 'bg-[#fff9c4]';  // Custom yellow for updates
      } else if (notification.message.toLowerCase().includes('deleted')) {
        return 'bg-red-50';    // Light red for deletions
      }
    }
    return 'bg-white';  // Default white background
  };

  // Add function to filter notifications
  const getFilteredNotifications = () => {
    return activeTab === 'unread' 
      ? notifications.filter(notification => !notification.isRead)
      : notifications;
  };

  const NotificationSkeleton = () => (
    <div className="p-3 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`relative ${isMobile ? "block md:hidden" : "hidden md:block"}`}
      ref={notificationRef}
    >
      {/* Notification Bell with Counter */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300  dark:hover:bg-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        aria-label="Notifications"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
            rounded-full flex items-center justify-center animate-pulse"
          >
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        markAllAsRead={markAllAsRead}
        clearAllNotifications={clearAllNotifications}
        markAsRead={markAsRead}
        getFilteredNotifications={getFilteredNotifications}
        getTransactionColor={getTransactionColor}
        getNotificationIcon={getNotificationIcon}
        formatNotificationTime={formatNotificationTime}
        NotificationSkeleton={NotificationSkeleton}
      />
    </div>
  );
};

export default Notification;
