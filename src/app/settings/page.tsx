import LeftMenu from "@/app/(app)/_components/LeftMenu";
import RightMenu from "@/app/(app)/_components/RightMenu";
import SyncAvatarButton from "./_components/SyncAvatarButton";
import { User } from "lucide-react";

const SettingsPage = () => {  
  return (  
    <div className="flex pt-6">
      <div className="hidden xl:block w-[320px] shrink-0 pl-4">
        <LeftMenu type="home" />
      </div>
      
      <div className="flex-1 flex justify-center min-w-0">
        <div className="w-full max-w-[720px] px-4">
          <div className="p-6 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50">
            <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-zinc-400" />
                <h2 className="text-lg font-medium text-white">Profile Avatar</h2>
              </div>
              
              <div className="pl-7">
                <p className="text-sm text-zinc-400 mb-4">
                  Nếu hình ảnh đại diện của bạn không cập nhật sau khi thay đổi nó trong Clerk, bạn có thể đồng bộ hóa nó bằng cách nhấp vào nút bên dưới.
                </p>
                
                <SyncAvatarButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-[320px] shrink-0 pr-4">
        <RightMenu />
      </div>
    </div>
  );
}  

export default SettingsPage;