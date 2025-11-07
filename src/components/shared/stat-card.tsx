import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
  variant?: "default" | "success" | "info" | "warning";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  vertical?: boolean;
}

export const StatCard = ({
  label,
  value,
  className = "",
  variant = "default",
  size = "md",
  icon,
  vertical = false,
}: StatCardProps) => {
  const variantStyles = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    success: "bg-green-50 border-green-200 text-green-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-600",
  };

  const sizeStyles = {
    sm: {
      container: "p-3",
      label: "text-xs",
      value: "text-lg",
    },
    md: {
      container: "p-4",
      label: "text-sm",
      value: "text-xl",
    },
    lg: {
      container: "p-5",
      label: "text-base",
      value: "text-2xl",
    },
  };

  if (vertical) {
    return (
      <div
        className={cn(
          "rounded-lg border flex flex-col items-center justify-center",
          variantStyles[variant],
          sizeStyles[size].container,
          className,
        )}
      >
        {icon && <div className="mb-2">{icon}</div>}
        <p className={cn("font-medium mb-1", sizeStyles[size].label)}>
          {label}
        </p>
        <p className={cn("font-semibold", sizeStyles[size].value)}>{value}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border flex items-center justify-between",
        variantStyles[variant],
        sizeStyles[size].container,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <span className={cn("font-medium", sizeStyles[size].label)}>
          {label}
        </span>
      </div>
      <span className={cn("font-semibold", sizeStyles[size].value)}>
        {value}
      </span>
    </div>
  );
};
