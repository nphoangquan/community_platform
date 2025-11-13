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
import { useEffect, useMemo, useState } from "react";

interface NavbarProps {
  logoFont: string;
}

const navItems = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Home,
  },
  {
    href: "/friends",
    label: "Bạn bè",
    icon: Users,
  },
  {
    href: "/stories",
    label: "Tin",
    icon: BookOpen,
  },
];

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

  const navigationLinks = useMemo(() => {
    if (isAdminOrModerator) {
      return [
        ...navItems,
        {
          href: "/admin",
          label: "Quản trị",
          icon: ShieldAlert,
        },
      ];
    }
    return navItems;
  }, [isAdminOrModerator]);

  return (
    <nav className="flex h-20 items-center">
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image
              src="/introvertia-icon.png"
              alt="Commun"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className={`text-2xl font-semibold tracking-tight text-white ${logoFont}`}>
            COMMUN
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-1 flex-1 ml-8">
        {navigationLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 transition-colors hover:text-white hover:bg-zinc-800/50"
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center flex-1 justify-end max-w-md mr-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ClerkLoading>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-solid border-e-transparent" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="p-2 rounded-lg transition-colors hover:text-white hover:bg-zinc-800/50 lg:hidden"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5 text-zinc-400" />
              </Link>

              {isAdminOrModerator && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex p-2 rounded-lg transition-colors hover:text-white hover:bg-zinc-800/50"
                  aria-label="Trang quản trị"
                >
                  <ShieldAlert className="h-5 w-5 text-zinc-400" />
                </Link>
              )}

              <Link
                href="/friend-requests"
                className="p-2 rounded-lg transition-colors hover:text-white hover:bg-zinc-800/50"
                aria-label="Lời mời kết bạn"
              >
                <UserPlus className="h-5 w-5 text-zinc-400" />
              </Link>

              <Link
                href="/messages"
                className="relative p-2 rounded-lg transition-colors hover:text-white hover:bg-zinc-800/50"
                aria-label="Tin nhắn"
              >
                <MessageSquare className="h-5 w-5 text-zinc-400" />
                <MessagesBadge />
              </Link>

              <div className="p-2">
                <NotificationBell />
              </div>

              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm transition-colors hover:border-zinc-600 hover:text-white"
            >
              <LogIn className="h-5 w-5" />
              <span>Đăng nhập / Đăng ký</span>
            </Link>
          </SignedOut>
        </ClerkLoaded>

        <div className="block lg:hidden ml-2">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;