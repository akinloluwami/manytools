import { cn } from "@/lib/utils";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valueUnit?: string;
  showMarkers?: boolean;
  markers?: string[];
  className?: string;
  disabled?: boolean;
}

export const RangeSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueUnit = "%",
  showMarkers = false,
  markers,
  className = "",
  disabled = false,
}: RangeSliderProps) => {
  const defaultMarkers = ["Low", "Medium", "High"];
  const displayMarkers = markers || defaultMarkers;

  return (
    <div className={cn("w-full", className)}>
      {/* Label and Value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          {showValue && (
            <span className="text-2xl font-bold text-gray-900">
              {value}
              {valueUnit}
            </span>
          )}
        </div>
      )}

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Custom thumb styling
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer",
        )}
      />

      {/* Markers */}
      {showMarkers && displayMarkers.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {displayMarkers.map((marker, index) => (
            <span key={index}>{marker}</span>
          ))}
        </div>
      )}
    </div>
  );
};
