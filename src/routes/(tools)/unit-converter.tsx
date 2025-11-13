import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(tools)/unit-converter")({
  component: RouteComponent,
});

type TabType = "length" | "temperature" | "weight" | "area" | "volume";

interface UnitConversion {
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const lengthUnits: Record<string, UnitConversion> = {
  meter: {
    name: "Meter (m)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  kilometer: {
    name: "Kilometer (km)",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  centimeter: {
    name: "Centimeter (cm)",
    toBase: (v) => v / 100,
    fromBase: (v) => v * 100,
  },
  millimeter: {
    name: "Millimeter (mm)",
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  mile: {
    name: "Mile (mi)",
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
  yard: {
    name: "Yard (yd)",
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  foot: {
    name: "Foot (ft)",
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  inch: {
    name: "Inch (in)",
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
};

const temperatureUnits: Record<string, UnitConversion> = {
  celsius: {
    name: "Celsius (°C)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  fahrenheit: {
    name: "Fahrenheit (°F)",
    toBase: (v) => (v - 32) * (5 / 9),
    fromBase: (v) => v * (9 / 5) + 32,
  },
  kelvin: {
    name: "Kelvin (K)",
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
};

const weightUnits: Record<string, UnitConversion> = {
  kilogram: {
    name: "Kilogram (kg)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  gram: {
    name: "Gram (g)",
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  milligram: {
    name: "Milligram (mg)",
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  ton: {
    name: "Metric Ton (t)",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  pound: {
    name: "Pound (lb)",
    toBase: (v) => v * 0.453592,
    fromBase: (v) => v / 0.453592,
  },
  ounce: {
    name: "Ounce (oz)",
    toBase: (v) => v * 0.0283495,
    fromBase: (v) => v / 0.0283495,
  },
};

const areaUnits: Record<string, UnitConversion> = {
  squareMeter: {
    name: "Square Meter (m²)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  squareKilometer: {
    name: "Square Kilometer (km²)",
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  squareCentimeter: {
    name: "Square Centimeter (cm²)",
    toBase: (v) => v / 10000,
    fromBase: (v) => v * 10000,
  },
  squareMile: {
    name: "Square Mile (mi²)",
    toBase: (v) => v * 2589988.110336,
    fromBase: (v) => v / 2589988.110336,
  },
  squareYard: {
    name: "Square Yard (yd²)",
    toBase: (v) => v * 0.836127,
    fromBase: (v) => v / 0.836127,
  },
  squareFoot: {
    name: "Square Foot (ft²)",
    toBase: (v) => v * 0.092903,
    fromBase: (v) => v / 0.092903,
  },
  acre: {
    name: "Acre (ac)",
    toBase: (v) => v * 4046.86,
    fromBase: (v) => v / 4046.86,
  },
  hectare: {
    name: "Hectare (ha)",
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
};

const volumeUnits: Record<string, UnitConversion> = {
  liter: {
    name: "Liter (L)",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  milliliter: {
    name: "Milliliter (mL)",
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  cubicMeter: {
    name: "Cubic Meter (m³)",
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  cubicCentimeter: {
    name: "Cubic Centimeter (cm³)",
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  gallon: {
    name: "Gallon (gal)",
    toBase: (v) => v * 3.78541,
    fromBase: (v) => v / 3.78541,
  },
  quart: {
    name: "Quart (qt)",
    toBase: (v) => v * 0.946353,
    fromBase: (v) => v / 0.946353,
  },
  pint: {
    name: "Pint (pt)",
    toBase: (v) => v * 0.473176,
    fromBase: (v) => v / 0.473176,
  },
  cup: {
    name: "Cup (cup)",
    toBase: (v) => v * 0.236588,
    fromBase: (v) => v / 0.236588,
  },
  fluidOunce: {
    name: "Fluid Ounce (fl oz)",
    toBase: (v) => v * 0.0295735,
    fromBase: (v) => v / 0.0295735,
  },
};

const unitCategories = {
  length: lengthUnits,
  temperature: temperatureUnits,
  weight: weightUnits,
  area: areaUnits,
  volume: volumeUnits,
};

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<TabType>("length");
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(lengthUnits)[0]);
  const [results, setResults] = useState<Record<string, number>>({});

  const currentUnits = unitCategories[activeTab];

  const handleConvert = (value: string, from: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !value) {
      setResults({});
      return;
    }

    const baseValue = currentUnits[from].toBase(numValue);
    const converted: Record<string, number> = {};

    Object.keys(currentUnits).forEach((unitKey) => {
      if (unitKey !== from) {
        converted[unitKey] = currentUnits[unitKey].fromBase(baseValue);
      }
    });

    setResults(converted);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const firstUnit = Object.keys(unitCategories[tab])[0];
    setFromUnit(firstUnit);
    setInputValue("");
    setResults({});
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleConvert(value, fromUnit);
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    handleConvert(inputValue, unit);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000) {
      return num.toExponential(6);
    }
    return num.toFixed(8).replace(/\.?0+$/, "");
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "length", label: "Length" },
    { key: "temperature", label: "Temperature" },
    { key: "weight", label: "Weight" },
    { key: "area", label: "Area" },
    { key: "volume", label: "Volume" },
  ];

  return (
    <ContentLayout title="Unit Converter">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "px-6 py-2.5 rounded-t-lg font-medium transition-all duration-200",
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">From:</label>
            <div className="flex gap-4">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter value"
                className="flex-1 text-lg py-6"
              />
              <select
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-base font-medium focus:outline-none focus:border-black"
              >
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="text-lg font-semibold">Converted Values:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(results).map(([unitKey, value]) => (
                  <div
                    key={unitKey}
                    className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        {currentUnits[unitKey].name}
                      </span>
                      <span className="text-lg font-bold text-black">
                        {formatNumber(value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {Object.keys(results).length === 0 && inputValue && (
            <div className="text-center py-8 text-gray-500">
              Enter a value to see conversions
            </div>
          )}

          {!inputValue && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">
                Enter a value above to convert between different units
              </p>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
