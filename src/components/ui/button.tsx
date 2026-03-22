import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonProps = {
  variant?: "default" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  default: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-border text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  accent: "bg-accent text-white hover:bg-accent-light",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", href, className, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
