'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';
import { isFeatureEnabled } from '@/shared/constants/featureFlags';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Singleton socket instance
let socketInstance: Socket | null = null;
let connectionCount = 0;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  // Khởi tạo socket connection một lần duy nhất
  const initializeSocket = useCallback(() => {
    // Nếu đã có socket instance và đang connected, không tạo mới
    if (socketInstance?.connected) {
      setIsConnected(true);
      return socketInstance;
    }

    // Nếu đang trong quá trình kết nối, không tạo mới
    if (isConnectingRef.current) {
      return socketInstance;
    }

    // Nếu chưa có socket hoặc đã disconnect, tạo mới
    if (!socketInstance || socketInstance.disconnected) {
      isConnectingRef.current = true;

      const socketUrl = process.env.NEXT_PUBLIC_SITE_URL || 
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

      socketInstance = io(socketUrl, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: false, // Sử dụng lại connection nếu có
        autoConnect: true,
      });

      // Xử lý kết nối thành công
      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance?.id);
        setIsConnected(true);
        isConnectingRef.current = false;

        // Join user room nếu có user
        if (user?.id) {
          socketInstance?.emit('join', user.id);
        }
      });

      // Xử lý disconnect
      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        isConnectingRef.current = false;

        // Tự động reconnect nếu không phải disconnect thủ công
        if (reason === 'io server disconnect') {
          // Server disconnect, cần reconnect thủ công
          socketInstance?.connect();
        }
      });

      // Xử lý lỗi
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        isConnectingRef.current = false;
        setIsConnected(false);
      });

      // Xử lý reconnect
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        if (user?.id) {
          socketInstance?.emit('join', user.id);
        }
      });

      // Xử lý reconnect failed
      socketInstance.on('reconnect_failed', () => {
        console.error('Socket reconnection failed');
        isConnectingRef.current = false;
        setIsConnected(false);
      });
    }

    return socketInstance;
  }, [user?.id]);

  // Connect socket khi có user
  useEffect(() => {
    if (!user || !isFeatureEnabled('enableSocketNotifications')) {
      return;
    }

    connectionCount++;
    const socket = initializeSocket();

    // Cleanup khi component unmount
    return () => {
      connectionCount--;
      // Chỉ disconnect socket khi không còn component nào sử dụng
      if (connectionCount <= 0 && socketInstance) {
        console.log('Disconnecting socket - no more active connections');
        socketInstance.disconnect();
        socketInstance = null;
        setIsConnected(false);
        connectionCount = 0;
      }
    };
  }, [user, initializeSocket]);

  // Join room khi user thay đổi
  useEffect(() => {
    if (socketInstance?.connected && user?.id) {
      socketInstance.emit('join', user.id);
    }
  }, [user?.id, isConnected]);

  const connect = useCallback(() => {
    if (!socketInstance || socketInstance.disconnected) {
      initializeSocket();
    }
  }, [initializeSocket]);

  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      setIsConnected(false);
      connectionCount = 0;
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

