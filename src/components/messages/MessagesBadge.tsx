'use client';

import { useEffect, useState } from 'react';
import { getUnreadCount } from '@/lib/actions/messages';
import { useSocketContext } from '@/lib/contexts/SocketContext';
import { useAuth } from '@clerk/nextjs';

export default function MessagesBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocketContext();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();

    if (!socket) {
      return;
    }

    const handleNewMessage = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error updating unread count:', error);
      }
    };
    
    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [userId, socket]);

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-medium text-white">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
} 