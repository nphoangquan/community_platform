"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function UserInitializer() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasInitialized.current) {
      return;
    }

    if (pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
      return;
    }

    const ensureUser = async () => {
      try {
        hasInitialized.current = true;
        
        const response = await fetch('/api/users/ensure', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.created) {
            console.log('User created in database');
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        } else {
          hasInitialized.current = false;
        }
      } catch (error) {
        console.error('Failed to ensure user exists:', error);
        hasInitialized.current = false;
      }
    };

    ensureUser();
  }, [user, isLoaded, pathname]);

  return null;
}

