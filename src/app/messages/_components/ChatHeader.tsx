'use client';

import { UserType } from '@/lib/actions/messages';
import Link from 'next/link';
import Image from 'next/image';
interface ChatHeaderProps {
  user: UserType | null;
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-zinc-800 flex items-center gap-3 h-[68px]">
      {user ? (
        <>
          <Link href={`/profile/${user.username}`} className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
              {user.avatar && (
                <Image
                  src={user.avatar} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              )}
            </div>
            
          </Link>
          
          <div>
            <Link href={`/profile/${user.username}`} className="font-medium text-white hover:text-zinc-300 transition-colors">
              {user.name || user.username}
            </Link>
            <p className="text-sm text-zinc-400">@{user.username}</p>
          </div>
        </>
      ) : (
        <div className="animate-pulse flex items-center gap-3">
          <div className="bg-zinc-800 w-10 h-10 rounded-full"></div>
          <div>
            <div className="h-4 bg-zinc-800 rounded w-24 mb-1"></div>
            <div className="h-3 bg-zinc-800 rounded w-16"></div>
          </div>
        </div>
      )}
    </div>
  );
}


