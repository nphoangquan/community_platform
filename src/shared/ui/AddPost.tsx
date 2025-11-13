"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import CreatePostModal from "@/shared/ui/CreatePostModal";
import { useUserAvatar } from "@/shared/hooks/useUserAvatar";

const AddPost = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { avatarUrl } = useUserAvatar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50">
        <div className="h-10 w-full bg-zinc-800/50 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400 text-sm">Đăng nhập để chia sẻ bài viết</p>
          <Link 
            href="/sign-in" 
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 flex gap-4 justify-between text-sm">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-zinc-800">
          <Image src={avatarUrl || "/noAvatar.png"} alt="" fill className="object-cover" priority />
        </div>
        <button 
          className="flex-1 bg-zinc-800/50 rounded-full px-4 text-left text-zinc-400 cursor-pointer hover:bg-zinc-700/50 transition-colors" 
          onClick={() => setIsModalOpen(true)}
        >
          Viết gì đi...
        </button>
      </div>
      {isModalOpen && (<CreatePostModal onClose={() => setIsModalOpen(false)} />)}
    </>
  );
};

export default AddPost;


