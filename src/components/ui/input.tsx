import React from "react";
import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        "border-2 border-purple-100 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none transition-all",
        className
      )}
      {...props}
    />
  );
};
