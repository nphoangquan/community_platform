import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureUserExists } from "@/lib/utils/userCreation";

/**
 * API route để đảm bảo user tồn tại trong database
 * Được gọi khi user đăng nhập/đăng ký để tạo user nếu chưa có
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await ensureUserExists(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to ensure user exists" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      created: result.created,
      message: result.message
    });
  } catch (error) {
    console.error("Error in ensure user route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

