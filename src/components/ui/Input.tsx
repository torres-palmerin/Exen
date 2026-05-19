import * as React from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, rightIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-xs w-full">
        {label && <label className="font-label-md text-label-md text-on-surface-variant px-xs">{label}</label>}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
              {icon}
            </div>
          )}
          <input
            className={cn(
              "w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl py-sm border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none",
              icon ? "pl-11" : "pl-md",
              rightIcon ? "pr-11" : "pr-md",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
