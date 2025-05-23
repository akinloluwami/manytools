import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
