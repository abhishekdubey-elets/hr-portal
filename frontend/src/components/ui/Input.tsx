import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  floating?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefixIcon, suffixIcon, className, floating, value, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [internal, setInternal] = useState("");
    const hasValue = (value ?? internal) !== "" && (value ?? internal) !== undefined;

    const base = cn(
      "w-full bg-[#111114] border rounded-xl text-white placeholder-gray-500 text-sm",
      "transition-all duration-200 outline-none",
      "focus:border-[#8B5CF6]/70 focus:ring-4 focus:ring-[#8B5CF6]/12",
      error ? "border-[#f43f5e]/60 focus:ring-[#f43f5e]/12" : "border-[#26262e] hover:border-[#33333d]",
      prefixIcon && "pl-9",
      suffixIcon && "pr-9",
      className
    );

    /* Floating-label variant */
    if (floating && label) {
      return (
        <div className="w-full">
          <div className="relative">
            {prefixIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">{prefixIcon}</div>
            )}
            <input
              ref={ref}
              value={value}
              onChange={(e) => {
                setInternal(e.target.value);
                onChange?.(e);
              }}
              onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
              placeholder=" "
              {...props}
              className={cn(base, "px-4 pt-5 pb-2 peer")}
            />
            <label
              className={cn(
                "pointer-events-none absolute left-4 text-gray-500 transition-all duration-200",
                prefixIcon && "left-9",
                focused || hasValue
                  ? "top-1.5 text-[10px] font-medium tracking-wide uppercase text-[#a78bfa]"
                  : "top-1/2 -translate-y-1/2 text-sm"
              )}
            >
              {label}
            </label>
            {suffixIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffixIcon}</div>
            )}
          </div>
          {error && <p className="mt-1.5 text-xs text-[#fb7185]">{error}</p>}
          {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefixIcon}</div>
          )}
          <input ref={ref} value={value} onChange={onChange} {...props} className={cn(base, "px-4 py-2.5")} />
          {suffixIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffixIcon}</div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[#fb7185]">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
