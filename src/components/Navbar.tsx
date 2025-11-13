"use client";

import Link from "next/link";
import MobileMenu from "@/shared/ui/MobileMenu";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Home, Users, BookOpen, Search, UserPlus, MessageSquare, LogIn, ShieldAlert } from "lucide-react";
import Image from "next/image";
import NotificationBell from "@/app/notifications/_components/NotificationBell";
import SearchBar from "@/shared/ui/SearchBar";
import dynamic from "next/dynamic";
const MessagesBadge = dynamic(() => import("./messages/MessagesBadge"), { ssr: false });
import { useEffect, useState } from "react";

interface NavbarProps {
  logoFont: string;
}

const Navbar = ({ logoFont }: NavbarProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch("/api/users/me/role");
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      
      fetchUserRole();
    }
  }, [isSignedIn]);

  const isAdminOrModerator = userRole === "admin" || userRole === "moderator";

  return (
    <div className="h-24 flex items-center justify-between px-4">
      <div className="md:hidden lg:flex lg:w-[20%] items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/introvertia-icon.png"
              alt="Introvertia Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className={`text-2xl font-bold text-white ${logoFont}`}>
            INTROVERTIA
          </span>
        </Link>
      </div>
      
      <div className="hidden md:flex md:w-[50%] lg:w-[45%] text-sm items-center justify-between ml-4">
        <div className="flex gap-4 lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
          
          <Link href="/friends" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </Link>
          
          <Link href="/stories" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Stories</span>
          </Link>
          
          {isAdminOrModerator && (
            <Link href="/admin" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </div>
        
        <div className="hidden xl:block pl-4 lg:pl-8">
          <SearchBar />
        </div>
      </div>
      
      <div className="flex-1 md:w-[35%] lg:w-[30%] flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-solid border-current border-e-transparent align-[-0.125em]" />
        </ClerkLoading>
        
        <ClerkLoaded>
          <SignedIn>
            <div className="xl:hidden">
              <Link href="/search" className="p-1 text-zinc-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </Link>
            </div>
            
            {isAdminOrModerator && (
              <Link href="/admin" className="p-1 text-zinc-400 hover:text-white transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </Link>
            )}
            
            <Link href="/friend-requests" className="p-1 text-zinc-400 hover:text-white transition-colors">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            
            <Link href="/messages" className="relative p-1 text-zinc-400 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
              <MessagesBadge />
            </Link>
            
            <div className="p-1">
              <NotificationBell />
            </div>
            
            <UserButton />
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <LogIn className="w-5 h-5 text-zinc-400" />
              <Link href="/sign-in" className="text-zinc-400 hover:text-white transition-colors">
                Đăng nhập/Đăng ký
              </Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        
        <div className="block lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;