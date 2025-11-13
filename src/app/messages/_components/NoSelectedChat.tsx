import { MessageSquare } from "lucide-react";

export default function NoSelectedChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="bg-zinc-800/50 p-6 rounded-full mb-3">
        <MessageSquare className="w-16 h-16 text-zinc-400" />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-white">Tin nhắn của bạn</h2>
      <p className="text-zinc-400 max-w-md">
        Chọn một cuộc trò chuyện để bắt đầu
      </p>
    </div>
  );
}


