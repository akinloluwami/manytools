import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
  size = "md",
}: EmptyStateProps) => {
  const sizeStyles = {
    sm: {
      icon: "w-12 h-12 mb-3",
      iconSize: 24,
      title: "text-base",
      description: "text-xs",
    },
    md: {
      icon: "w-16 h-16 mb-4",
      iconSize: 32,
      title: "text-lg",
      description: "text-sm",
    },
    lg: {
      icon: "w-20 h-20 mb-5",
      iconSize: 40,
      title: "text-xl",
      description: "text-base",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center text-gray-400 p-8",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "rounded-full bg-gray-100 flex items-center justify-center opacity-50",
            sizeStyles[size].icon,
          )}
        >
          {icon}
        </div>
      )}
      <p className={cn("font-medium text-gray-500", sizeStyles[size].title)}>
        {title}
      </p>
      {description && (
        <p className={cn("mt-2 text-gray-400", sizeStyles[size].description)}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
