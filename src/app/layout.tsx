import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import AvatarRefresh from "@/components/AvatarRefresh";
import UserInitializer from "@/components/UserInitializer";
import Chatbot from '@/components/Chatbot';
import NavigationShell from "@/components/NavigationShell";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Commun - Community Platform",
  description: "Community platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body suppressHydrationWarning className={`${inter.className} bg-zinc-950 text-zinc-100`}>
          <SocketProvider>
            <NotificationProvider>
              <UserInitializer />
              <AvatarRefresh />
              
              <NavigationShell logoFont={orbitron.className} />
              
              <div className="bg-zinc-950 pt-4">
                {children}
              </div>
              <Chatbot />
            </NotificationProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}