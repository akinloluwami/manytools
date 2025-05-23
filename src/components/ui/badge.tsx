import classNames from "classnames";
import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const getVariantClasses = (variant: BadgeVariant = "default"): string => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses: Record<BadgeVariant, string> = {
    default:
      "border-transparent bg-purple-500/10 text-purple-500 hover:bg-purple-400/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return classNames(baseClasses, variantClasses[variant]);
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={classNames(getVariantClasses(variant), className)}
      {...props}
    />
  );
}
const badgeVariants = ({ variant }: { variant?: BadgeVariant } = {}) =>
  getVariantClasses(variant);

export { Badge, badgeVariants };
