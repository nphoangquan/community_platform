import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Link from "next/link";
import UserInfoCardInteraction from "./UserInfoCardInteraction";
import UpdateUser from "./UpdateUser";

// Lucide Icons
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  CalendarDays,
  MoreVertical,
  Cake,
} from "lucide-react";

const UserInfoCard = async ({ user }: { user: User }) => {
  const createdAtDate = new Date(user.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format ngày sinh theo kiểu Việt Nam
  let formattedBirthDate = "";
  if (user.birthDate) {
    const birthDate = new Date(user.birthDate);
    formattedBirthDate = birthDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const { userId: currentUserId } = await auth();

  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });

    isUserBlocked = !!blockRes;

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    isFollowing = !!followRes;

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });

    isFollowingSent = !!followReqRes;
  }

  return (
    <div className="p-6 bg-zinc-900/80 rounded-2xl border border-zinc-800/50 text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2 font-medium text-zinc-400">
        <span className="text-xs uppercase tracking-wider font-semibold">User Info - Thông tin người dùng</span>
        {currentUserId === user.id ? (
          <UpdateUser user={user} />
        ) : (
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-zinc-300 transition-colors" />
        )}
      </div>

      <div className="flex flex-col gap-4 text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="text-xl text-white font-medium">
            {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
          </span>
          <span className="text-sm text-zinc-400">@{user.username}</span>
        </div>

        {user.description && <p className="leading-relaxed">{user.description}</p>}

        {user.city && (
          <div className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
            <MapPin className="w-4 h-4" />
            <span>
              Sống tại <b className="text-white">{user.city}</b>
            </span>
          </div>
        )}

        {user.school && (
          <div className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
            <GraduationCap className="w-4 h-4" />
            <span>
              Đã tốt nghiệp tại <b className="text-white">{user.school}</b>
            </span>
          </div>
        )}

        {user.work && (
          <div className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
            <Briefcase className="w-4 h-4" />
            <span>
              Làm việc tại <b className="text-white">{user.work}</b>
            </span>
          </div>
        )}

        {user.website && (
          <div className="flex gap-1 items-center hover:text-zinc-200 transition-colors">
            <LinkIcon className="w-4 h-4" />
            <Link
              href={user.website}
              className="text-zinc-300 hover:text-white transition-colors font-medium"
            >
              {user.website}
            </Link>
          </div>
        )}
        
        {user.birthDate && (
          <div className="flex gap-1 items-center text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
            <Cake className="w-4 h-4" />
            <span>Sinh ngày <b className="text-white">{formattedBirthDate}</b></span>
          </div>
        )}
        
        <div className="flex gap-1 items-center text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
          <CalendarDays className="w-4 h-4" />
          <span>Đã tham gia {formattedDate}</span>
        </div>

        {currentUserId && currentUserId !== user.id && (
          <UserInfoCardInteraction
            userId={user.id}
            username={user.username}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          />
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;


