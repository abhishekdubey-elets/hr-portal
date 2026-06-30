"use client";
import { useStore } from "@/store";
import { login as apiLogin } from "@/lib/api";
import type { User } from "@/types";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useStore();

  const signIn = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      const { token, user: userData } = res.data;
      login(userData as User, token);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const signOut = () => {
    logout();
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  return { user, isAuthenticated, signIn, signOut };
}
