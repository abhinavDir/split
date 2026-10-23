import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification.service';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const res = await notificationService.getNotifications();
      if (res?.data?.notifications) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error('Error fetching notifications:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    fetchNotifications();

    if (socket) {
      socket.on('notification:new', (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }

    const handleSettlementFinalized = (e) => {
      const newNotif = {
        _id: `notif-${Date.now()}`,
        type: 'SETTLEMENT_FINALIZED',
        title: 'Settlement Finalized',
        message: `Settlement for group finalized. Note: ${e.detail?.note || 'No notes'}`,
        createdAt: new Date().toISOString(),
        isRead: false,
        link: '/settlements',
      };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    window.addEventListener('settlement:finalized', handleSettlementFinalized);

    return () => {
      if (socket) socket.off('notification:new');
      window.removeEventListener('settlement:finalized', handleSettlementFinalized);
    };
  }, [user, socket, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch {
      // ignore
    }
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch {
      // ignore
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  return useContext(NotificationContext) || {
    notifications: [],
    unreadCount: 0,
    loading: false,
    markAsRead: () => {},
    markAllAsRead: () => {},
    fetchNotifications: () => {},
  };
};
