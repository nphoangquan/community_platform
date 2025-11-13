"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Image as ImageIcon, Camera } from "lucide-react";
import { env } from "@/shared/config/env";
import { updateProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(user.avatar || null);
  const [cover, setCover] = useState<string | null>(user.cover || null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    description: user.description || "",
    city: user.city || "",
    school: user.school || "",
    work: user.work || "",
    website: user.website || "",
    birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setAvatar(user.avatar || null);
    setCover(user.cover || null);
    setFormData({
      name: user.name || "",
      surname: user.surname || "",
      description: user.description || "",
      city: user.city || "",
      school: user.school || "",
      work: user.work || "",
      website: user.website || "",
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
    });
  }, [user]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social-media");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.client.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url as string;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      setAvatar(url);
    } catch (err) {
      setError("Không thể tải ảnh đại diện");
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      setCover(url);
    } catch (err) {
      setError("Không thể tải ảnh bìa");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    
    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitFormData.append(key, value);
      });
      
      const result = await updateProfile(
        { success: false, error: false },
        { formData: submitFormData, cover: cover || "", avatar: avatar || undefined }
      );
      
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError("Không thể cập nhật thông tin");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs transition-colors"
      >
        Cập nhật
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Cập nhật hồ sơ</h3>
              <button 
                onClick={() => setOpen(false)} 
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors" 
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Ảnh bìa</label>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-zinc-800">
                    {cover ? (
                      <Image src={cover} alt="Cover" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        Chưa có ảnh bìa
                      </div>
                    )}
                    <input 
                      ref={coverInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleCoverChange} 
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-zinc-800">
                    <Image src={avatar || "/noAvatar.png"} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <input 
                      ref={avatarInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-white transition-colors"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Đổi ảnh đại diện
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                      placeholder="Tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Họ</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                      placeholder="Họ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={255}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
                    placeholder="Giới thiệu về bản thân"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Thành phố</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                      placeholder="Thành phố"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Ngày sinh</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Trường học</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    placeholder="Trường học"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Nơi làm việc</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    placeholder="Nơi làm việc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
