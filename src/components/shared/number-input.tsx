import { cn } from "@/lib/utils";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  unit?: string;
  helperText?: string;
  error?: string;
}

export const NumberInput = ({
  label,
  unit,
  helperText,
  error,
  className,
  ...props
}: NumberInputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          className={cn(
            "w-full px-4 py-2 border-2 border-black/10 focus:border-black/50 rounded-lg outline-none transition-colors",
            unit && "pr-12",
            error && "border-red-500 focus:border-red-500",
            className,
          )}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
