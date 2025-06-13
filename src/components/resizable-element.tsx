import { useRef, useState, useEffect } from "react";

interface ResizableElementProps {
  initialWidth?: number;
  minWidth?: number;
  className?: string;
}

export function ResizableElement({
  initialWidth = 300,
  minWidth = 100,
  className = "",
}: ResizableElementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);
  const [left, setLeft] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeSide, setResizeSide] = useState<"left" | "right" | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startLeft, setStartLeft] = useState(0);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    const updateParentWidth = () => {
      if (containerRef.current?.parentElement) {
        setParentWidth(containerRef.current.parentElement.clientWidth);
      }
    };

    updateParentWidth();
    window.addEventListener("resize", updateParentWidth);

    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeSide) return;

      const deltaX = e.clientX - startX;

      if (resizeSide === "right") {
        const newWidth = Math.min(
          parentWidth - left,
          Math.max(minWidth, startWidth + deltaX)
        );
        setWidth(newWidth);
      } else {
        const newWidth = Math.min(
          parentWidth - (startLeft + startWidth - left),
          Math.max(minWidth, startWidth - deltaX)
        );
        const newLeft = startLeft + (startWidth - newWidth);
        setWidth(newWidth);
        setLeft(newLeft);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeSide(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizeSide,
    startX,
    startWidth,
    startLeft,
    minWidth,
    parentWidth,
    left,
  ]);

  const handleMouseDown = (e: React.MouseEvent, side: "left" | "right") => {
    e.preventDefault();
    setIsResizing(true);
    setResizeSide(side);
    setStartX(e.clientX);
    setStartWidth(width);
    setStartLeft(left);
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-20 rounded-2xl border border-black overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        left: `${left}px`,
        position: "relative",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 active:bg-blue-500/40"
        onMouseDown={(e) => handleMouseDown(e, "left")}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/20 active:bg-blue-500/40"
        onMouseDown={(e) => handleMouseDown(e, "right")}
      />
    </div>
  );
}
