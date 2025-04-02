import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Button, Space } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import axios from '../../config/axios';
import { io } from 'socket.io-client';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchNotifications();
    setupSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const setupSocket = () => {
    const newSocket = io(process.env.REACT_APP_URL);
    newSocket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    setSocket(newSocket);
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const content = (
    <div style={{ width: 300 }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space>
          <Button 
            type="text" 
            icon={<CheckOutlined />} 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </Space>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <List.Item
            actions={[
              !item.isRead && (
                <Button 
                  type="text" 
                  size="small" 
                  onClick={() => markAsRead(item._id)}
                >
                  Mark as read
                </Button>
              )
            ]}
          >
            <List.Item.Meta
              title={
                <div style={{ 
                  fontWeight: item.isRead ? 'normal' : 'bold',
                  color: item.isRead ? '#000000' : '#1890ff'
                }}>
                  {item.title}
                </div>
              }
              description={
                <div>
                  <div>{item.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover content={content} title="Notifications" trigger="click">
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '21px' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationBell; 