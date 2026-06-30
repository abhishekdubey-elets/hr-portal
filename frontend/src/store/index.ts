import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setUser: (user: User | null) => void;

  // UI
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  toggleTheme: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: {
        id: "u1",
        name: "Sarah Admin",
        email: "sarah@company.com",
        role: "admin",
        department: "HR",
      },
      isAuthenticated: false,
      token: null,
      login: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("peopleai_token", token);
        }
        set({ user, isAuthenticated: true, token });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("peopleai_token");
          localStorage.removeItem("peopleai_user");
        }
        set({ user: null, isAuthenticated: false, token: null });
      },
      updateUser: (partial) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...partial } });
      },
      setUser: (user) => set({ user }),

      // UI
      theme: "dark",
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "peopleai-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
