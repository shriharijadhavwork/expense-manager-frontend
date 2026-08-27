"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ApiError, getStoredToken, setStoredToken } from "@/lib/api/client";
import { appConfig } from "@/config/env";
import { realtimeClient } from "@/lib/realtime/client";
import type { User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: (redirectTo?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(null);
      setToken(null);
      return;
    }

    const me = await authApi.me(stored);
    setToken(stored);
    setUser(me);
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const stored = getStoredToken();
        if (!stored) {
          return;
        }

        const me = await authApi.me(stored);
        if (!active) return;
        setToken(stored);
        setUser(me);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setStoredToken(null);
        }
        if (!active) return;
        setToken(null);
        setUser(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (token) {
      realtimeClient.connect(token, appConfig.wsUrl);
    } else {
      realtimeClient.disconnect();
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    setStoredToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authApi.signup({ name, email, password });
      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
      return result.user;
    },
    [],
  );

  const logout = useCallback(
    async (redirectTo = "/login") => {
      try {
        await authApi.logout();
      } catch {
        // Client discard still happens even if logout endpoint fails.
      }
      setStoredToken(null);
      setToken(null);
      setUser(null);
      router.replace(redirectTo);
    },
    [router],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, isLoading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
