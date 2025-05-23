import React from "react";

interface SliderProps {
  defaultValue: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  defaultValue,
  onValueChange,
}) => {
  const [min, max] = defaultValue;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = Number(e.target.value);
    const newValues: [number, number] =
      index === 0 ? [value, max] : [min, value];
    onValueChange(newValues);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min="0"
        max="100"
        value={min}
        onChange={(e) => handleChange(e, 0)}
        className="w-full"
      />
      <input
        type="range"
        min="0"
        max="100"
        value={max}
        onChange={(e) => handleChange(e, 1)}
        className="w-full"
      />
    </div>
  );
};
