import { Server as SocketIOServer } from 'socket.io';

// Lấy Socket.IO server instance từ global (được set trong server.js)
export const getSocketIO = (): SocketIOServer | null => {
  // Trong môi trường server, sử dụng global.io từ server.js
  if (typeof global !== 'undefined' && (global as any).io) {
    return (global as any).io as SocketIOServer;
  }
  
  // Fallback: trả về null nếu không có server
  console.warn('Socket.IO server not initialized. Make sure server.js is running.');
  return null;
};

// Hàm helper để gửi event đến user
export const emitToUser = (userId: string, event: string, data: any): boolean => {
  const io = getSocketIO();
  if (!io) {
    console.warn('Cannot emit event: Socket.IO server not available');
    return false;
  }
  
  try {
    io.to(userId).emit(event, data);
    return true;
  } catch (error) {
    console.error('Error emitting event:', error);
    return false;
  }
};

export type NotificationPayload = {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId: string;
  postId?: number;
  commentId?: number;
  link?: string;
  createdAt: Date;
}; 