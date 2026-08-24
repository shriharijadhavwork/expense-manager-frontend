import { apiRequest } from "@/lib/api/client";
import type { AuthResult, User } from "@/types/api";

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
};
