import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { cn } from "@/shared/utils/cn";
import { ExternalLink, Users } from "lucide-react";

const getUser = unstable_cache(
  async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { followers: true } } },
    });
  },
  ['user-profile-card'],
  { revalidate: 5 }
);

const ProfileCard = async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await getUser(userId);
  if (!user) return null;

  return (
    <div className="p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50">
      <div className="relative h-36 -mx-6 -mt-6 mb-4 overflow-hidden">
        <Image src={user.cover || "/noCover.png"} alt="" fill className="object-cover rounded-t-2xl" priority />
      </div>
      <div className="flex justify-center -mt-16 mb-4">
        <Link href={`/profile/${user.username}`} className="block">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-zinc-900">
            <Image src={user.avatar || "/noAvatar.png"} alt="" fill className="object-cover" priority />
          </div>
        </Link>
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-white mb-1">
          {user.name && user.surname ? user.name + " " + user.surname : user.username}
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm mb-4">
          <div className="py-1.5 px-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-300">{user._count.followers}</span>
            <span className="text-zinc-400">Followers</span>
          </div>
        </div>
      </div>
      <Link href={`/profile/${user.username}`} className="block">
        <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors">
          <span>Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
};

export default ProfileCard;


