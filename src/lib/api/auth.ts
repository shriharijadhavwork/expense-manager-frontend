import { apiRequest } from "@/lib/api/client";
import type { AuthResult, User, UserPreferences } from "@/types/api";

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const authApi = {
  signup(input: SignupInput): Promise<AuthResult> {
    return apiRequest<AuthResult>("/auth/signup", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  login(input: LoginInput): Promise<AuthResult> {
    return apiRequest<AuthResult>("/auth/login", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  logout(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
      auth: false,
    });
  },

  me(token?: string | null): Promise<User> {
    return apiRequest<User>("/auth/me", {
      method: "GET",
      token,
    });
  },

  verifyEmail(code: string): Promise<User> {
    return apiRequest<User>("/auth/verify-email", {
      method: "POST",
      body: { code },
    });
  },

  resendOtp(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/resend-otp", {
      method: "POST",
    });
  },

  forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },

  resetPassword(input: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: input,
      auth: false,
    });
  },

  updateMe(input: {
    preferences: Partial<UserPreferences>;
  }): Promise<UserPreferences> {
    return apiRequest<UserPreferences>("/auth/me", {
      method: "PATCH",
      body: input,
    });
  },
};
