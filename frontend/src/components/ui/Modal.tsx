"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-[#16161A] border border-[#1E1E24] rounded-2xl shadow-2xl p-6 w-full",
            sizeMap[size],
            "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-48"
          )}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-[#1E1E24] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {description && (
            <Dialog.Description className="text-sm text-gray-400 mb-4">{description}</Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
