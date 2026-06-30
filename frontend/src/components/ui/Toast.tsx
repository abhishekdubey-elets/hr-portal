"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";
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
    <ToastPrimitive.Provider>
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open
          onOpenChange={(open) => !open && removeToast(t.id)}
          className={cn(
            "fixed bottom-4 right-4 z-[100] flex items-start gap-3 p-4 rounded-xl border shadow-2xl max-w-sm",
            "bg-[#16161A] border-[#1E1E24] animate-in slide-in-from-right-2"
          )}
        >
          <div className="mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            <ToastPrimitive.Title className="text-sm font-medium text-white">{t.title}</ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="text-xs text-gray-400 mt-0.5">{t.description}</ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            onClick={() => removeToast(t.id)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
}
