import { cn } from "@/lib/utils";

interface InfoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated";
  padding?: "sm" | "md" | "lg";
  actions?: React.ReactNode;
}

export const InfoCard = ({
  title,
  children,
  className = "",
  variant = "default",
  padding = "md",
  actions,
}: InfoCardProps) => {
  const variantStyles = {
    default: "bg-white border border-gray-200",
    bordered: "bg-white border-2 border-black",
    elevated: "bg-white border border-gray-200 shadow-md",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
