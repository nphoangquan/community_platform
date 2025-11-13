"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

/**
 * Tạo user trong database từ Clerk user data
 * Sử dụng upsert để tránh duplicate và đảm bảo user luôn tồn tại
 */
export async function ensureUserExists(userId: string) {
  try {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (existingUser) {
      return { success: true, created: false, message: "User already exists" };
    }

    // Lấy thông tin user từ Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Clerk user not found" };
    }

    // Tạo username nếu chưa có
    let username = clerkUser.username;
    
    if (!username) {
      // Sử dụng email để tạo username
      if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (email) {
          username = email.split('@')[0];
        }
      }
      
      // Fallback: sử dụng ID
      if (!username) {
        username = 'user_' + userId.substring(0, 8);
      }
      
      // Đảm bảo username là duy nhất
      let finalUsername = username;
      let counter = 1;
      
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${username}_${counter}`;
        counter++;
      }
      
      username = finalUsername;
    } else {
      // Kiểm tra username có unique không
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });
      
      if (existingUsername) {
        // Thêm số ngẫu nhiên nếu username đã tồn tại
        username = username + '_' + Math.floor(Math.random() * 10000);
      }
    }

    // Tạo user trong database
    const userData = {
      id: userId,
      username: username,
      name: clerkUser.firstName || null,
      surname: clerkUser.lastName || null,
      avatar: clerkUser.imageUrl || "/noAvatar.png",
      cover: "/noCover.png",
    };

    await prisma.user.create({
      data: userData,
    });

    return { success: true, created: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return { success: false, error: "Failed to create user" };
  }
}

