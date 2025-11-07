import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  submessage?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  message,
  submessage,
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const textSizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2Icon
        className="animate-spin text-black mb-4"
        size={sizeMap[size]}
      />
      {message && (
        <p className={cn("text-black font-semibold", textSizeMap[size])}>
          {message}
        </p>
      )}
      {submessage && <p className="text-gray-500 text-sm mt-2">{submessage}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};
