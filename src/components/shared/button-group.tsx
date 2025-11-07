import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ButtonGroupItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
}

interface ButtonGroupProps {
  items: ButtonGroupItem[];
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  spacing?: "tight" | "normal" | "loose";
  className?: string;
}

export const ButtonGroup = ({
  items,
  orientation = "horizontal",
  fullWidth = false,
  spacing = "normal",
  className = "",
}: ButtonGroupProps) => {
  const spacingMap = {
    tight: "gap-1",
    normal: "gap-2",
    loose: "gap-4",
  };

  const orientationClass = orientation === "vertical" ? "flex-col" : "flex-row";

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "bg-white text-black border-2 border-black hover:bg-black/5",
    ghost: "bg-transparent text-black hover:bg-black/5",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <div
      className={cn(
        "flex",
        orientationClass,
        spacingMap[spacing],
        fullWidth && "w-full",
        className,
      )}
    >
      {items.map((item, index) => (
        <Button
          key={index}
          onClick={item.onClick}
          disabled={item.disabled}
          className={cn(
            "flex items-center gap-2",
            fullWidth && "flex-1",
            item.variant && variantClasses[item.variant],
          )}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </Button>
      ))}
    </div>
  );
};
