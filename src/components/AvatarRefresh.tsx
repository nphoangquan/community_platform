"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { synchronizeUserAvatar } from "@/lib/actions";

export default function AvatarRefresh() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [prevImageUrl, setPrevImageUrl] = useState('');
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  useEffect(() => {
    if (!user || !isLoaded || syncInProgress) return;
    
    if (!user.imageUrl || user.imageUrl === '') {
      console.log("User has no avatar image, skipping sync");
      return;
    }
    
    if (user.imageUrl && user.imageUrl !== prevImageUrl) {
      console.log("Avatar image URL changed, syncing with database...");
      setPrevImageUrl(user.imageUrl);
      setSyncInProgress(true);
      
      synchronizeUserAvatar().then((result) => {
        if (result.success) {
          console.log("Avatar synchronized successfully");
          
          const timeout = setTimeout(() => {
            router.refresh();
          }, 500);
          
          return () => clearTimeout(timeout);
        } else {
          if (result.error && !result.error.includes("not found in database")) {
            console.error("Failed to sync avatar:", result.error);
          } else {
            console.log("Avatar sync skipped:", result.error || "No avatar to sync");
          }
        }
      }).catch(error => {
        console.error("Error during avatar sync:", error);
      }).finally(() => {
        setSyncInProgress(false);
      });
    }
  }, [user, isLoaded, prevImageUrl, router, syncInProgress]);
  
  return null;
} 