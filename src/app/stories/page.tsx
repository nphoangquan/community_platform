import { getAllStories } from "@/lib/actions/story";
import StoryList from "@/app/stories/_components/StoryList";
import Link from "next/link";
import { Plus, Sparkles, Clock, Film } from "lucide-react";
import Image from "next/image";

export default async function StoriesPage() {
  const stories = await getAllStories();

  if (!stories || stories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 rounded-lg">
        <div className="relative p-8 bg-zinc-900/80 backdrop-blur-sm rounded-2xl max-w-md w-full border border-zinc-800/50">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Stories</h1>
            <p className="text-zinc-400 mb-8">Chia sẻ khoảnh khắc của bạn với bạn bè bằng cách tạo story</p>
            <Link 
              href="/stories/create" 
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo Story</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex rounded-lg">
      <div className="hidden md:block">
        <StoryList stories={stories} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative p-8 bg-zinc-900/80 backdrop-blur-sm rounded-2xl max-w-md w-full border border-zinc-800/50">
          <div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Stories</h1>
            
            <p className="text-zinc-400 text-center text-sm mb-8">
              Chọn story từ danh sách hoặc tạo story
            </p>
            
            {/* Phần Featured story preview */}
            {stories[0] && (
              <div className="mb-8">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-3 relative">
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  
                  {stories[0].video ? (
                    <div className="relative w-full h-full">
                      <video 
                        src={stories[0].video}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image 
                      src={stories[0].img || "/placeholder.png"}
                      alt="Featured story"
                      fill
                      className="object-cover"
                    />
                  )}
                  
                  <div className="absolute bottom-3 left-3 z-10 flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 ring-2 ring-zinc-800">
                      <Image 
                        src={stories[0].user.avatar || "/placeholder.png"}
                        alt={stories[0].user.username || "User"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-white">
                      {stories[0].user.name || stories[0].user.username}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <Link 
                href={`/story/${stories[0].id}`} 
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors flex-1 justify-center"
              >
                <Clock className="w-4 h-4" />
                <span>Xem Mới Nhất</span>
              </Link>
              <Link 
                href="/stories/create" 
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors flex-1 justify-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo Mới</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}