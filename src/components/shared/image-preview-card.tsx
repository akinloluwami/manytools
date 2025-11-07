import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewCardProps {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  onRemove?: () => void;
  className?: string;
  imageClassName?: string;
  actions?: React.ReactNode;
}

export const ImagePreviewCard = ({
  src,
  alt = "Preview",
  title,
  subtitle,
  onRemove,
  className = "",
  imageClassName = "",
  actions,
}: ImagePreviewCardProps) => {
  return (
    <div className={cn("w-full", className)}>
      {(title || onRemove || actions) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && <p className="font-semibold text-lg">{title}</p>}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-red-600 flex items-center gap-2 text-sm hover:bg-red-50 py-2 px-3 rounded-lg transition-colors font-medium"
              >
                <Trash size={16} /> Remove
              </button>
            )}
          </div>
        </div>
      )}
      <div className="bg-gray-100 rounded-lg p-4">
        <img
          src={src}
          alt={alt}
          className={cn("w-full h-auto rounded-lg shadow-sm", imageClassName)}
        />
      </div>
    </div>
  );
};
