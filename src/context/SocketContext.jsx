import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const token = localStorage.getItem('split_access_token');

    // Create client instance with reconnects
    const newSocket = io(socketUrl, {
      auth: { token },
      autoConnect: false,
      reconnectionAttempts: 3,
      timeout: 5000,
      transports: ['websocket', 'polling'],
    });

    if (user) {
      newSocket.connect();
    }

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    // Real-time synchronization event listeners
    newSocket.on('expense:created', (data) => {
      window.dispatchEvent(new CustomEvent('expense:created', { detail: data?.expense || data }));
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('expense:deleted', (data) => {
      window.dispatchEvent(new CustomEvent('expense:deleted', { detail: data }));
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('expense:changed', (data) => {
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('balance:updated', (data) => {
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('group:finalized', (data) => {
      window.dispatchEvent(new CustomEvent('group:finalized', { detail: data }));
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('group:member-joined', (data) => {
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('payment:updated', (data) => {
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    newSocket.on('group:bill-preview', (data) => {
      window.dispatchEvent(new CustomEvent('group:bill-preview', { detail: data }));
    });

    newSocket.on('group:status-changed', (data) => {
      window.dispatchEvent(new CustomEvent('group:status-changed', { detail: data }));
      window.dispatchEvent(new CustomEvent('group:data-changed', { detail: data }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinGroupRoom = (groupId) => {
    if (socket && isConnected) {
      socket.emit('group:join', { groupId });
    }
  };

  const leaveGroupRoom = (groupId) => {
    if (socket && isConnected) {
      socket.emit('group:leave', { groupId });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinGroupRoom, leaveGroupRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext) || { socket: null, isConnected: false, joinGroupRoom: () => {}, leaveGroupRoom: () => {} };
};
