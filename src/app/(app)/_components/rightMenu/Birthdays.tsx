"use client";

import Image from "next/image";
import { Gift, MoreVertical, Cake } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface FriendWithBirthday extends User {
  isBirthdayToday: boolean;
}

const Birthdays = () => {
  const [friends, setFriends] = useState<FriendWithBirthday[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [celebrating, setCelebrating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/birthdays");
        if (!res.ok) {
          setFriends([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setFriends(data);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching birthdays:", error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleSeeAllClick = () => {
    router.push("/events/birthdays");
  };

  const handleCelebrate = async (friendId: string) => {
    if (celebrating[friendId]) return;
    
    setCelebrating(prev => ({ ...prev, [friendId]: true }));
    
    try {
      await fetch("/api/birthdays/celebrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: friendId }),
      });
    } catch (error) {
      console.error("Error celebrating birthday:", error);
    } finally {
      setTimeout(() => {
        setCelebrating(prev => ({ ...prev, [friendId]: false }));
      }, 5000);
    }
  };

  const todayBirthdays = Array.isArray(friends) ? friends.filter(friend => friend.isBirthdayToday) : [];
  const upcomingBirthdaysCount = Array.isArray(friends) ? friends.length - todayBirthdays.length : 0;

  if (loading) {
    return (
      <div className="p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 text-sm min-h-[200px] flex items-center justify-center">
        <span className="text-zinc-400">Loading birthdays...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 text-sm">
      {/* TOP */}
      <div className="flex items-center justify-between text-zinc-400 font-medium mb-5">
        <span className="text-xs uppercase tracking-wider font-semibold">Sinh nhật</span>
        <MoreVertical className="w-4 h-4 cursor-pointer hover:text-zinc-300 transition-colors" />
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-5">
        {/* TODAY'S BIRTHDAYS */}
        {todayBirthdays.length > 0 ? (
          todayBirthdays.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-zinc-900 shadow-md">
                <Image
                  src={friend.avatar || "/noavatar.png"}
                  alt={friend.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-white font-medium hover:text-zinc-300 cursor-pointer transition-colors">
                  {friend.name || friend.username}
                </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Cake className="w-3 h-3" /> Hôm nay
                </span>
              </div>
              <button 
                className={`${
                  celebrating[friend.id] 
                    ? "bg-zinc-700 text-white" 
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                } p-2 text-xs rounded-lg transition-colors font-medium`}
                onClick={() => handleCelebrate(friend.id)}
                disabled={celebrating[friend.id]}
              >
                {celebrating[friend.id] ? "Đã chúc mừng!" : "Chúc mừng"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-zinc-400">
            Không có sinh nhật hôm nay
          </div>
        )}
        
        <div 
          className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3 hover:bg-zinc-800 transition-colors cursor-pointer"
          onClick={handleSeeAllClick}
        >
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
            <Gift className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex flex-col gap-1">
                    <span className="text-white font-medium">
                      Sinh nhật sắp tới
                    </span>
                    <span className="text-xs text-zinc-400">
                      {upcomingBirthdaysCount} {upcomingBirthdaysCount === 1 ? 'bạn' : 'bạn'} có sinh nhật sắp tới
                    </span>
          </div>
        </div>
        
        <button 
          className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 text-xs rounded-lg transition-colors font-medium w-full"
          onClick={handleSeeAllClick}
        >
                  Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default Birthdays;


