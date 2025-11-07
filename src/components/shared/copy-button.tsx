import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  variant?: "default" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  disabled?: boolean;
}

export const CopyButton = ({
  textToCopy,
  className = "",
  variant = "default",
  size = "md",
  showLabel = true,
  disabled = false,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy || disabled) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sizeClasses = {
    sm: "py-1 px-2 text-xs",
    md: "py-2 px-3 text-sm",
    lg: "py-2 px-4 text-base",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={`p-2 transition-colors rounded-lg ${
          copied
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check size={iconSizes[size]} />
        ) : (
          <Copy size={iconSizes[size]} />
        )}
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={`flex items-center gap-2 transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {copied ? (
          <Check size={iconSizes[size]} className="text-green-600" />
        ) : (
          <Copy size={iconSizes[size]} />
        )}
        {showLabel && (
          <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 ${sizeClasses[size]} min-w-[90px] overflow-hidden relative transition-colors ${
        copied ? "bg-green-600 hover:bg-green-700" : ""
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check size={iconSizes[size]} />
              {showLabel && "Copied"}
            </>
          ) : (
            <>
              <Copy size={iconSizes[size]} />
              {showLabel && "Copy"}
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
