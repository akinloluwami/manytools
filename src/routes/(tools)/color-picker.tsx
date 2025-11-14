import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import iro from "@jaames/iro";
import { useEffect, useRef, useState } from "react";
import { convertHexColorCode } from "@/utils/convert-hex-color-code";
import { getLuminosity } from "@/utils/get-luminosity";
import { CopyButton } from "@/components/shared";

export const Route = createFileRoute("/(tools)/color-picker")({
  component: RouteComponent,
});

function RouteComponent() {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#f00");
  const [colorCode, setColorCode] = useState(convertHexColorCode(color));

  useEffect(() => {
    const container = colorPickerRef.current;
    if (container) {
      container.innerHTML = "";

      // Determine size based on screen width
      const getPickerWidth = () => {
        if (window.innerWidth < 640)
          return Math.min(window.innerWidth - 32, 280);
        if (window.innerWidth < 1024) return 350;
        return 500;
      };

      // @ts-ignore
      const colorPicker = new iro.ColorPicker(container, {
        width: getPickerWidth(),
        color: color,
      });

      colorPicker.on("color:change", (color: iro.Color) => {
        setColor(color.hexString);
        setColorCode(convertHexColorCode(color.hexString));
      });
    }
  }, []);

  return (
    <ContentLayout title="Color Picker">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 w-full">
        <div ref={colorPickerRef} className="w-fit mx-auto lg:mx-0" />
        <div className="w-full">
          <div
            className="h-24 lg:h-20 w-full rounded-lg flex items-center justify-center mb-6"
            style={{
              backgroundColor: color,
              color: getLuminosity(color) > 0.5 ? "black" : "white",
            }}
          >
            <p className="text-lg lg:text-xl font-semibold px-4 text-center">
              {colorCode.name}
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(colorCode)
              .filter(([key]) => key !== "name")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <p className="uppercase font-medium text-sm w-16">{key}</p>
                    <p className="text-sm font-mono truncate">{value}</p>
                  </div>
                  <CopyButton textToCopy={value as string} variant="icon" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
