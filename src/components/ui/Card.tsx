import * as React from "react";
import { cn } from "@/src/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'glass' | 'dashed';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', ...props }, ref) => {
    const variants = {
      flat: "bg-surface-container-low border border-surface-container-high",
      elevated: "bg-surface-container-lowest shadow-soft border border-surface-container-high",
      glass: "bg-white/85 backdrop-blur-md border border-white/30",
      dashed: "bg-surface-container-lowest border border-dashed border-outline-variant hover:bg-surface-container-low transition-colors",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-md",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
