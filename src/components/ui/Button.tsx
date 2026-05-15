import * as React from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-primary-container text-on-primary-container hover:opacity-90 shadow-soft active:scale-[0.98]",
      secondary: "bg-surface-container text-primary hover:bg-surface-container-high active:scale-[0.98]",
      ghost: "bg-transparent text-primary hover:bg-surface-container-low active:scale-[0.98]",
      outline: "bg-transparent border border-outline text-on-surface hover:bg-surface-container-low active:scale-[0.98]",
      error: "bg-error-container text-on-error-container hover:bg-error-container/80 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-label-md rounded-md",
      md: "px-4 py-2 text-label-lg rounded-lg",
      lg: "px-6 py-3 text-label-lg rounded-xl",
      xl: "px-8 py-4 text-label-lg rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
