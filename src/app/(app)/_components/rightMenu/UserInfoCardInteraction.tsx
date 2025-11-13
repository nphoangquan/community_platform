"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Ban, Check, SquareX, UserCheck, UserMinus, UserPlus, UserX } from "lucide-react";

const UserInfoCardInteraction = ({
  userId,
  username,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  username: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const { userId: currentUserId } = useAuth();
  const [blocked, setBlocked] = useState(isUserBlocked);
  const [following, setFollowing] = useState(isFollowing);
  const [requestSent, setRequestSent] = useState(isFollowingSent);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setBlocked(isUserBlocked);
  }, [isUserBlocked]);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  useEffect(() => {
    setRequestSent(isFollowingSent);
  }, [isFollowingSent]);

  const onFollow = async () => {
    if (!currentUserId || isProcessing) return;
    setIsProcessing("follow");
    try {
      // Backend toggles request/follow state depending on current status
      await switchFollow(userId);
      // Optimistically toggle request state when not following
      if (!following) setRequestSent(prev => !prev);
    } finally {
      setIsProcessing(null);
    }
  };

  const onToggleFollow = async () => {
    if (!currentUserId || isProcessing) return;
    setIsProcessing("toggle-follow");
    try {
      // Backend toggles: when following -> unfollow, otherwise creates/cancels request
      await switchFollow(userId);
      if (following) {
        setFollowing(false);
        setRequestSent(false);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const onToggleBlock = async () => {
    if (!currentUserId || isProcessing) return;
    setIsProcessing("toggle-block");
    try {
      await switchBlock(userId);
      setBlocked(prev => !prev);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Follow/Unfollow or Request/Cancel */}
      {following && (
        <button
          onClick={onToggleFollow}
          disabled={!!isProcessing}
          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs disabled:opacity-50 flex items-center gap-1"
          title="Bỏ theo dõi"
        >
          <UserMinus className="w-4 h-4" />
          <span className="hidden sm:inline">Bỏ theo dõi</span>
        </button>
      )}

      <button
        onClick={onFollow}
        disabled={!!isProcessing}
        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs disabled:opacity-50 flex items-center gap-1"
        title={requestSent ? "Hủy lời mời" : "Gửi lời mời"}
      >
        {requestSent ? <SquareX className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        <span className="hidden sm:inline">{requestSent ? "Hủy" : "Kết bạn"}</span>
      </button>

      {/* Block/Unblock */}
      <button
        onClick={onToggleBlock}
        disabled={!!isProcessing}
        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs disabled:opacity-50 flex items-center gap-1"
        title={blocked ? "Bỏ chặn" : "Chặn"}
      >
        {blocked ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
        <span className="hidden sm:inline">{blocked ? "Bỏ chặn" : "Chặn"}</span>
      </button>
    </div>
  );
};

export default UserInfoCardInteraction;



