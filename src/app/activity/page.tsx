import { getUserActivity } from "@/lib/actions/activity";
import ActivityLog from "@/components/activity/ActivityLog";
import LeftMenu from "@/app/(app)/_components/LeftMenu";
import RightMenu from "@/app/(app)/_components/RightMenu";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const { userId } = await auth();
  
  if (!userId) {
    // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
    redirect("/sign-in");
  }
  
  // Lấy hoạt động của người dùng (server component có thể gọi trực tiếp server action)
  const activities = await getUserActivity(1, 20);

  return (
    <div className="flex pt-6">
      <div className="hidden xl:block w-[320px] shrink-0 pl-4">
        <LeftMenu type="home" />
      </div>
      <div className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-[720px] px-4">
          <ActivityLog initialActivities={activities} />
        </div>
      </div>
      <div className="hidden lg:block w-[320px] shrink-0 pr-4">
        <RightMenu />
      </div>
    </div>
  );
} 