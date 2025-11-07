import { cn } from "@/lib/utils";
import { DownloadButton } from "./download-button";
import { CopyButton } from "./copy-button";

interface ResultCardProps {
  title?: string;
  children: React.ReactNode;
  onDownload?: () => void;
  downloadLabel?: string;
  onCopy?: () => void;
  copyText?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    variant?: "default" | "success" | "info" | "warning";
  }>;
  className?: string;
  headerClassName?: string;
}

export const ResultCard = ({
  title = "Result",
  children,
  onDownload,
  downloadLabel,
  onCopy,
  copyText,
  stats,
  className = "",
  headerClassName = "",
}: ResultCardProps) => {
  return (
    <div
      className={cn(
        "border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50",
          headerClassName,
        )}
      >
        <p className="font-semibold text-lg">{title}</p>
        <div className="flex items-center gap-2">
          {onCopy && copyText && (
            <CopyButton textToCopy={copyText} variant="minimal" size="sm" />
          )}
          {onDownload && (
            <DownloadButton onClick={onDownload} size="sm">
              {downloadLabel || "Download"}
            </DownloadButton>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <div className={cn("grid gap-3 mt-6", `grid-cols-${stats.length}`)}>
            {stats.map((stat, index) => {
              const variantStyles = {
                default: "bg-gray-50 border-gray-200 text-gray-900",
                success: "bg-green-50 border-green-200 text-green-600",
                info: "bg-blue-50 border-blue-200 text-blue-600",
                warning: "bg-yellow-50 border-yellow-200 text-yellow-600",
              };

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    variantStyles[stat.variant || "default"],
                  )}
                >
                  <p className="text-xs font-medium mb-1">{stat.label}</p>
                  <p className="font-semibold text-lg">{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
