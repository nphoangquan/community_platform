import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import FriendRequestList from "@/app/friend-requests/_components/FriendRequestList";
import { MoreVertical } from "lucide-react";

const FriendRequests = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  if (requests.length === 0) return null;
  
  return (
    <div className="p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 text-sm">
      <div className="flex items-center justify-between text-zinc-400 font-medium mb-5">
        <span className="text-xs uppercase tracking-wider font-semibold">Lời mời kết bạn</span>
        <MoreVertical className="w-4 h-4 cursor-pointer hover:text-zinc-300 transition-colors" />
      </div>
      
      <div className="flex flex-col gap-5">
        <FriendRequestList requests={requests}/>
        
        <Link href="/friend-requests" className="block">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 text-xs rounded-lg transition-colors font-medium w-full">
            Xem tất cả lời mời
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FriendRequests;


