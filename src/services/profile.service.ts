import { apiClient } from "@/lib/api-client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface UserPreferences {
  dietary: string[];
  allergies: string[];
  health_goals: string[];
}

export type UserMeResponse = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  collected_points: number;
  role: string;
  preferences?: UserPreferences;
};

export interface AddressPayload {
  label?: string;
  receiver_name: string;
  phone: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export type UpdateMePayload = {
  username?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
  addresses?: AddressPayload[];
};

export const userService = {
  getMe() {
    return apiClient.get<ApiResponse<UserMeResponse>>("/users/me");
  },

  updateMe(payload: UpdateMePayload) {
    return apiClient.patch<ApiResponse<UserMeResponse>>("/users/me", payload);
  },

  updatePreferences(preferences: Partial<UserPreferences>) {
    return apiClient.patch<ApiResponse<UserMeResponse>>("/users/me", {
      preferences,
    });
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiClient.patch<ApiResponse<null>>("/users/me/password", payload);
  },

  updateAvatar(file: File) {
    const form = new FormData();
    form.append("file", file);

    return apiClient.patch<ApiResponse<UserMeResponse>>(
      "/users/me/avatar",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },
};
