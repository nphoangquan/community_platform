"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

interface NavigationShellProps {
  logoFont: string;
}

const HIDDEN_PATHS = ["/sign-in", "/sign-up", "/landing"];

export default function NavigationShell({ logoFont }: NavigationShellProps) {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));
  if (shouldHide) {
    return null;
  }

  return (
    <div className="relative w-full sticky top-0 z-50">
      <div className="absolute inset-0 bg-zinc-900/80" />
      <div className="relative w-full border-b border-zinc-800/50 px-4">
        <Navbar logoFont={logoFont} />
      </div>
    </div>
  );
}
