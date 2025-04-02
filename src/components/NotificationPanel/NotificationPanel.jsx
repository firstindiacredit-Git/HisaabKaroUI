import React from 'react';
import { createPortal } from 'react-dom';

const NotificationPanel = ({ 
  showNotifications, 
  setShowNotifications,
  notifications,
  unreadCount,
  loading,
  activeTab,
  setActiveTab,
  markAllAsRead,
  clearAllNotifications,
  markAsRead,
  getFilteredNotifications,
  getTransactionColor,
  getNotificationIcon,
  formatNotificationTime,
  NotificationSkeleton 
}) => {
  if (!showNotifications) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex sm:items-center sm:justify-center z-50">
      {/* Close overlay on background click */}
      <div 
        className="absolute inset-0 bg-transparent" 
        onClick={() => setShowNotifications(false)}
      ></div>
      
      {/* Notification Container */}
      <div className={`
        relative w-full sm:w-[400px] 
        max-h-[90vh] sm:max-h-[600px]
        bg-white dark:bg-gray-800 sm:rounded-xl shadow-2xl 
        overflow-hidden z-50
        transform transition-all duration-200
        translate-y-0 scale-100 opacity-100
        fixed sm:relative
        bottom-0 sm:bottom-auto
        left-0 sm:left-auto
        right-0 sm:right-auto
        rounded-t-2xl sm:rounded-xl
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm">
          {/* Mobile Pull Indicator */}
          <div className="h-1.5 flex items-center justify-center sm:hidden">
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full my-2"></div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Close Button - Adjusted positioning */}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="inline-flex items-center justify-center p-1.5 rounded-full dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div>
                  <h3 className="text-base font-semibold dark:text-gray-300 text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unreadCount 
                      ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                      : 'No new notifications'
                    }
                  </p>
                </div>
              </div>

              {/* Actions Group */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs flex items-center gap-1 px-2 py-1.5 
                      rounded-full  bg-blue-50 dark:bg-blue-900 text-blue-600 hover:bg-blue-100 
                      transition-colors duration-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden  dark:text-gray-300 sm:inline">Mark all read</span>
                  </button>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs flex items-center gap-1 px-2 py-1.5 
                      rounded-full text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-400 hover:bg-gray-100
                      transition-colors duration-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden dark:text-gray-300 sm:inline">Clear all</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b  border-gray-100 dark:border-gray-700 px-4">
            <div className="flex space-x-6">
              {['all', 'unread'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2.5 text-xs font-medium transition-colors
                    ${activeTab === tab 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {tab === 'all' ? 'All' : 'Unread'}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                  <span className="ml-1 text-xs text-gray-400">
                    ({tab === 'all' ? notifications.length : unreadCount})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] dark:bg-gray-800 bg-white sm:max-h-[520px] p-2 pb-16">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <NotificationSkeleton key={index} />
            ))
          ) : getFilteredNotifications().length > 0 ? (
            <div className="space-y-2">
              {getFilteredNotifications().map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  className={`${getTransactionColor(notification)} rounded-lg shadow-sm hover:shadow 
                    transition-all duration-200 ${!notification.isRead && 'border-l-3 border-blue-500'}`}
                >
                  <div className="p-2 dark:bg-gray-700 rounded bg-white">
                    {/* Notification content */}
                    <div className="flex items-center dark:bg-gray-700 bg-white justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg 
                          ${!notification.isRead && notification.type === 'TRANSACTION' ? 
                            (notification.message.toLowerCase().includes('added') ? 'bg-green-100 text-green-600' :
                             notification.message.toLowerCase().includes('updated') ? 'bg-[#fff9c4] text-yellow-700' :
                             'bg-red-100 text-red-600') : 
                            'bg-gray-100 text-gray-600'}`}
                        >
                          <span className="text-base ">{getNotificationIcon(notification.type)}</span>
                        </div>
                        <div>
                          <p className="text-xs dark:text-gray-300 font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          <span className="text-[11px] dark:text-gray-400 text-gray-500">
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
                      )}
                    </div>

                    <div className="pl-8">
                      <p className="text-xs dark:text-white text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1 pt-1  border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <button className="text-[11px] px-2 py-1 rounded bg-blue-50 
                              text-blue-600 hover:bg-blue-100 transition-colors duration-200">
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-3">
                <span className="text-xl">🔔</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                {activeTab === 'unread' ? 'No unread notifications' : 'All Clear!'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-1">
                {activeTab === 'unread' 
                  ? 'You have read all your notifications'
                  : 'No new notifications to show'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationPanel; 