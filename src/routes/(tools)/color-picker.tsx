import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import iro from "@jaames/iro";
import { useEffect, useRef, useState } from "react";
import { convertHexColorCode } from "@/utils/convert-hex-color-code";
import { getLuminosity } from "@/utils/get-luminosity";

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
      // Wipe any previous render if it exists (StrictMode dev double-run)
      container.innerHTML = "";

      // @ts-ignore
      const colorPicker = new iro.ColorPicker(container, {
        width: 500,
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
      <div className="flex gap-20 w-full">
        <div ref={colorPickerRef} className="w-fit" />
        <div className="w-full">
          <div
            className="h-20 w-full rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: color,
              color: getLuminosity(color) > 0.5 ? "black" : "white",
            }}
          >
            <p className="text-xl font-semibold">Name: {colorCode.name}</p>
          </div>
          <div className="space-y-4 mt-7">
            {Object.entries(colorCode)
              .filter(([key]) => key !== "name")
              .map(([key, value]) => (
                <div key={key} className="flex items-center text-lg gap-4">
                  <p className="uppercase">{key}</p>
                  <p className="">{value}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
