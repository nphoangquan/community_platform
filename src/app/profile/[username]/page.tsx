import Feed from "@/app/(app)/_components/Feed";
import LeftMenu from "@/app/(app)/_components/LeftMenu";
import RightMenu from "@/app/(app)/_components/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Camera, MapPin, GraduationCap, Briefcase, Link as LinkIcon } from "lucide-react";

type PageProps = {
  params: Promise<{ username: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
  const { username } = await params;
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  let isBlocked = false;
  const isCurrentUser = userId === user.id;

  if (userId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: userId,
      },
    });

    if (res) isBlocked = true;
  }

  if (isBlocked) return notFound();

  return (
    <div className="flex pt-6">
      <div className="hidden xl:block w-[320px] shrink-0 pl-4">
        <LeftMenu type="profile" />
      </div>
      <div className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-[720px] px-4">
          <div className="flex flex-col gap-8">
          {/* Phần Ảnh Bìa và Thông Tin Hồ Sơ */}
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden">
            {/* Phần Ảnh Bìa */}
            <div className="relative h-64 w-full bg-gradient-to-r from-zinc-800 to-zinc-900">
              {user.cover ? (
                <Image
                  src={user.cover}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-500 text-lg">No cover photo</span>
                </div>
              )}
              
              {/* Nút Chỉnh Sửa Ảnh Bìa (chỉ dành cho người dùng hiện tại) */}
              {isCurrentUser && (
                <Link
                  href="/settings"
                  className="absolute bottom-4 right-4 bg-zinc-800/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-zinc-700 transition-colors"
                  aria-label="Edit cover photo"
                >
                  <Camera className="w-5 h-5" />
                </Link>
              )}
            </div>
            
            {/* Liên kết Quay lại */}
            {/* <div className="px-6 pt-4">
              <Link
                href="/friends"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span>Back to friends</span>
              </Link>
            </div> */}

            {/* Phần Thông Tin Hồ Sơ */}
            <div className="relative px-6 pb-6">
              {/* Ảnh đại diện - đặt vị trí để chồng lên ảnh bìa */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-xl mt-[-64px] mb-4 mx-auto md:mx-0">
                <Image
                  src={user.avatar || "/noAvatar.png"}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-semibold text-white mb-2">
                    {user.name && user.surname 
                      ? `${user.name} ${user.surname}` 
                      : user.username}
                  </h1>
                  
                  <div className="text-zinc-400 mb-4">
                    @{user.username}
                  </div>

                  {user.description && (
                    <div className="text-zinc-300 mb-6 max-w-lg">
                      {user.description}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start text-sm">
                    {user.city && (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <MapPin className="w-4 h-4" />
                        <span>{user.city}</span>
                      </div>
                    )}
                    
                    {user.school && (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <GraduationCap className="w-4 h-4" />
                        <span>{user.school}</span>
                      </div>
                    )}
                    
                    {user.work && (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.work}</span>
                      </div>
                    )}
                    
                    {user.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4 text-zinc-400" />
                        <Link 
                          href={user.website} 
                          className="text-zinc-300 hover:text-white hover:underline"
                        >
                          {user.website.replace(/(^\w+:|^)\/\//, '')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Feed username={user.username}/>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-[320px] shrink-0 pr-4">
        <RightMenu user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;