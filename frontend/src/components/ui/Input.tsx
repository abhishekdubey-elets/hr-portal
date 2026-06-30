import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function Input({ label, error, prefixIcon, suffixIcon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefixIcon}</div>
        )}
        <input
          {...props}
          className={cn(
            "w-full px-4 py-2.5 bg-[#111114] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 text-sm",
            "focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors",
            prefixIcon && "pl-9",
            suffixIcon && "pr-9",
            error && "border-red-500",
            className
          )}
        />
        {suffixIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffixIcon}</div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
