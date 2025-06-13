import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";

interface CustomRangeProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export const CustomRange: React.FC<CustomRangeProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = min,
  onChange,
  label,
  className = "",
  orientation = "horizontal",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setValue(clampedValue);
    onChange?.(clampedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        isVertical && "flex-col",
        className
      )}
    >
      {label && (
        <label
          className={cn(
            "text-sm font-medium text-gray-700",
            isVertical && "order-2"
          )}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative bg-gray-800 rounded-lg p-2",
          isVertical ? "h-48 w-10" : "h-10 w-full"
        )}
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          className={cn(
            "absolute opacity-0 cursor-pointer z-10",
            isVertical
              ? "h-full w-full -rotate-90 origin-center"
              : "w-full h-full"
          )}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />
        <div
          className={cn(
            "absolute bg-gray-700 rounded-full overflow-hidden",
            isVertical
              ? "w-2 h-[calc(100%-1rem)] left-1/2 -translate-x-1/2"
              : "h-2 w-[calc(100%-1rem)] top-1/2 -translate-y-1/2"
          )}
        >
          <div
            className={cn(
              "absolute bg-blue-400 rounded-full transition-all duration-100",
              isVertical ? "w-full" : "h-full"
            )}
            style={
              isVertical
                ? { height: `${percentage}%`, bottom: 0 }
                : { width: `${percentage}%` }
            }
          />
        </div>
        <div
          className={cn(
            "absolute bg-white border-2 border-blue-400 rounded-full transition-all duration-100 z-5",
            isVertical
              ? "w-4 h-8 left-1/2 -translate-x-1/2"
              : "w-8 h-4 top-1/2 -translate-y-1/2",
            isDragging &&
              "scale-110 shadow-lg shadow-blue-400/30 cursor-grabbing",
            !isDragging && "cursor-grab"
          )}
          style={
            isVertical
              ? { bottom: `${percentage}%` }
              : { left: `${percentage}%` }
          }
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full" />
        </div>
        <div
          className={cn(
            "absolute bg-gray-800 text-white px-3 py-1 rounded text-xs font-medium opacity-0 transition-opacity duration-200 whitespace-nowrap",
            (isDragging || "group-hover:opacity-100") && "opacity-100",
            isVertical
              ? "left-full ml-2 top-1/2 -translate-y-1/2"
              : "-top-8 left-1/2 -translate-x-1/2"
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
