import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  onClick: () => void;
  fileName?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  children?: React.ReactNode;
}

export const DownloadButton = ({
  onClick,
  fileName,
  className = "",
  disabled = false,
  size = "md",
  variant = "default",
  children,
}: DownloadButtonProps) => {
  const sizeClasses = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-3 px-5 text-base",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "bg-white text-black border-2 border-black hover:bg-black/5",
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 font-medium transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <Download size={iconSizes[size]} />
      {children || (fileName ? `Download ${fileName}` : "Download")}
    </Button>
  );
};
