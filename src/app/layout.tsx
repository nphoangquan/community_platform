import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import AvatarRefresh from "@/components/AvatarRefresh";
import UserInitializer from "@/components/UserInitializer";
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Introvertia - Social Media App",
  description: "Social media app built with Next.js",
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
              
              <div className="relative w-full sticky top-0 z-50">
                <div className="absolute inset-0 bg-zinc-900/80"></div>
                <div className="relative w-full bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50 px-4">
                  <Navbar logoFont={orbitron.className} />
                </div>
              </div>
              
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