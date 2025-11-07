import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PresetButton {
  label: string;
  value: any;
  icon?: React.ReactNode;
}

interface PresetSelectorProps {
  presets: PresetButton[];
  selected: any;
  onSelect: (value: any) => void;
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const PresetSelector = ({
  presets,
  selected,
  onSelect,
  title,
  columns = 2,
  className = "",
}: PresetSelectorProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={className}>
      {title && <p className="font-medium mb-3">{title}</p>}
      <div className={cn("grid gap-2", gridCols[columns])}>
        {presets.map((preset) => (
          <Button
            key={preset.label}
            onClick={() => onSelect(preset.value)}
            className={cn(
              "text-xs text-center border !border-black border-dotted flex items-center justify-center transition-all h-auto py-2 gap-2",
              preset.value === selected
                ? "bg-black text-white"
                : "!bg-black/5 !text-black hover:!bg-black/10",
            )}
          >
            {preset.icon && <span>{preset.icon}</span>}
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
