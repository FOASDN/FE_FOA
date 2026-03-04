import { apiClient } from "@/lib/api-client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserMeResponse = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  collected_points: number;
  role: string;
};

export type UpdateMePayload = {
  username?: string;
  phone?: string;
  avatar?: string;
};

export const userService = {
  getMe() {
    return apiClient.get<ApiResponse<UserMeResponse>>("/users/me");
  },

  updateMe(payload: UpdateMePayload) {
    return apiClient.patch<ApiResponse<UserMeResponse>>("/users/me", payload);
  },
  updateAvatar(file: File) {
    const form = new FormData();
    form.append("file", file);

    return apiClient.patch<ApiResponse<UserMeResponse>>("/users/me/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};