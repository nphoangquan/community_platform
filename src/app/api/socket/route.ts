import { getSocketIO } from "@/lib/socket";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Kiểm tra Socket.IO server có sẵn sàng không
    const io = getSocketIO();
    
    if (io) {
      return NextResponse.json({ 
        success: true, 
        message: "Socket.IO server is running",
        connectedClients: io.sockets.sockets.size
      });
    }
    
    return NextResponse.json(
      { success: false, message: "Socket.IO server not initialized" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Socket check error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check Socket.IO server" },
      { status: 500 }
    );
  }
} 