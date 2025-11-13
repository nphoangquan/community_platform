import { emitToUser, NotificationPayload } from "@/lib/socket";
import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Lấy nội dung thông báo từ request body
    const body = await req.json();
    const schema = z.object({
      receiverId: z.string().min(1),
      type: z.string().min(1),
      content: z.string().min(1),
      url: z.string().url().optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    const notification: NotificationPayload = parsed.data as NotificationPayload;
    
    // Gửi thông báo đến user qua socket
    const success = emitToUser(notification.receiverId, 'notification', notification);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Socket.IO server not available" },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Socket notification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send notification" },
      { status: 500 }
    );
  }
} 