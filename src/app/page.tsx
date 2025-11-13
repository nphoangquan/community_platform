import AddPost from "@/shared/ui/AddPost";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Stories from "@/app/(app)/_components/Stories";
import Feed from "@/app/(app)/_components/Feed";
import LeftMenu from "@/app/(app)/_components/LeftMenu";
import RightMenu from "@/app/(app)/_components/RightMenu";

const Homepage = async () => {
  const { userId: currentUserId } = await auth();
  const stories = currentUserId
    ? await prisma.story.findMany({
        where: { expiresAt: { gt: new Date() } },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
    : [];

  const user = currentUserId
    ? await prisma.user.findUnique({
        where: { id: currentUserId },
      })
    : null;

  return (
    <div className="flex pt-6">
      <div className="hidden xl:block w-[360px] shrink-0 pl-4">
        <LeftMenu type="home"/>
      </div>
      <div className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-[720px] px-4">
          <div className="flex flex-col gap-8">
            {currentUserId && stories.length > 0 && (
              <Stories stories={stories} />
            )}
            <AddPost />
            <Feed />
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-[360px] shrink-0 pr-4">
        <RightMenu user={user || undefined} />
      </div>
    </div>
  );
};

export default Homepage;