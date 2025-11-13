"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Trash2, Edit, Flag } from "lucide-react";
import EditPostWidget from "./EditPostWidget";
import PostDetail from "./PostDetail";
import ReportPostButton from "./ReportPostButton";
import { Post, User, Comment } from "@prisma/client";

type PostWithUserAndComments = Post & {
  user: User;
  comments: (Comment & { user: User })[];
};

const PostInfo = ({ post, currentUserId }: { post: PostWithUserAndComments; currentUserId?: string }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const isOwner = currentUserId === post.userId;

  const handleDeleteClick = async () => {
    try {
      setOpen(false);
      const result = await deletePost(post.id);
      
      if (result && result.success) {
        const deletePostEvent = new CustomEvent('deletePost', {
          detail: { postId: post.id }
        });
        window.dispatchEvent(deletePostEvent);
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(e.target as Node) && 
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  
  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Post options"
        >
          <MoreVertical className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
        </button>
        
        {open && (
          <div 
            ref={menuRef}
            className="absolute top-8 right-0 bg-zinc-900 p-4 w-40 rounded-xl flex flex-col gap-3 text-sm shadow-lg border border-zinc-800 z-50"
          >
            <button 
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => {
                setOpen(false);
                setShowPostDetail(true);
              }}
              type="button"
            >
              <Eye className="w-4 h-4 text-white group-hover:text-zinc-300 transition-colors" />
              <span className="text-white group-hover:text-zinc-300 transition-colors">Xem chi tiết</span>
            </button>
            
            {isOwner && (
              <>
                <button 
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setIsEditing(true);
                  }}
                  type="button"
                >
                  <Edit className="w-4 h-4 text-white group-hover:text-zinc-300 transition-colors" />
                  <span className="text-white group-hover:text-zinc-300 transition-colors">Chỉnh sửa</span>
                </button>
                
                <button 
                  className="flex items-center gap-2 group cursor-pointer"
                  type="button"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors" />
                  <span className="text-red-500 group-hover:text-red-400 transition-colors">Xóa</span>
                </button>
              </>
            )}
            
            {!isOwner && (
              <button 
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setShowReportModal(true);
                }}
                type="button"
              >
                <Flag className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                <span className="text-white group-hover:text-zinc-300 transition-colors">
                  Báo cáo
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <EditPostWidget
          post={post}
          onClose={() => setIsEditing(false)}
        />
      )}

      {showPostDetail && (
        <PostDetail
          post={post}
          onClose={() => setShowPostDetail(false)}
        />
      )}
      
      {/* Nút report bài viết */}
      <ReportPostButton 
        postId={post.id} 
        isModalOpen={showReportModal}
        onModalClose={() => setShowReportModal(false)}
      />
    </>
  );
};

export default PostInfo;


