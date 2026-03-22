import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-white",
  accent: "bg-accent text-white",
  outline: "border border-border text-foreground",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
