"use client";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: "success" }),
  error: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: "error" }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: "warning" }),
  info: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: "info" }),
};

const icons = {
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
};

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl",
            "bg-[#16161A] border-[#1E1E24] animate-in slide-in-from-right-2"
          )}
        >
          <div className="mt-0.5">{icons[t.type]}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-gray-400">{t.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-gray-500 transition-colors hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
