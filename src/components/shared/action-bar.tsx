import { cn } from "@/lib/utils";

interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sticky" | "floating";
  position?: "top" | "bottom";
}

export const ActionBar = ({
  children,
  className = "",
  variant = "default",
  position = "bottom",
}: ActionBarProps) => {
  const variantStyles = {
    default: "bg-white border-t border-gray-200",
    sticky: "sticky bg-white border-t border-gray-200 shadow-lg z-10",
    floating:
      "fixed left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-xl z-20",
  };

  const positionStyles = {
    top: variant === "sticky" ? "top-0" : "top-4",
    bottom: variant === "sticky" ? "bottom-0" : "bottom-4",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4",
        variantStyles[variant],
        variant !== "default" && positionStyles[position],
        className,
      )}
    >
      {children}
    </div>
  );
};
