import React, { useState, useEffect } from 'react';
import { Badge, Popover, List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import axios from '../../config/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const content = (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
          <div className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <Popover content={content} title="Notifications" trigger="click">
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '20px' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationBell; 