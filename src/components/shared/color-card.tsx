import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface ColorCardProps {
  color: string;
  index?: number;
  onClick?: () => void;
  showCopyButton?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ColorCard = ({
  color,
  index,
  onClick,
  showCopyButton = true,
  className = "",
  size = "md",
}: ColorCardProps) => {
  const sizeStyles = {
    sm: {
      container: "h-12 px-3",
      swatch: "w-6 h-6",
      text: "text-xs",
    },
    md: {
      container: "h-16 px-5",
      swatch: "w-10 h-10",
      text: "text-sm",
    },
    lg: {
      container: "h-20 px-6",
      swatch: "w-12 h-12",
      text: "text-base",
    },
  };

  return (
    <div
      className={cn(
        "w-full bg-white border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-black hover:shadow-md transition-all group",
        sizeStyles[size].container,
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "rounded-lg shadow-sm border border-gray-200 flex-shrink-0",
            sizeStyles[size].swatch,
          )}
          style={{ backgroundColor: color }}
        />
        <div>
          <p
            className={cn(
              "text-gray-900 font-mono font-semibold",
              sizeStyles[size].text,
            )}
          >
            {color.toUpperCase()}
          </p>
          {index !== undefined && (
            <p className="text-xs text-gray-500">Color {index + 1}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showCopyButton && (
          <div onClick={(e) => e.stopPropagation()}>
            <CopyButton
              textToCopy={color}
              variant="icon"
              size="sm"
              showLabel={false}
            />
          </div>
        )}
        {onClick && (
          <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
            Details
          </span>
        )}
      </div>
    </div>
  );
};
