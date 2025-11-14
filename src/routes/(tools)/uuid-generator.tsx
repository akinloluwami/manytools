import ContentLayout from "@/components/shared/content-layout";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, NumberInput, DownloadButton } from "@/components/shared";

export const Route = createFileRoute("/(tools)/uuid-generator")({
  component: RouteComponent,
});

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function RouteComponent() {
  const [currentUuid, setCurrentUuid] = useState<string>(generateUUID());
  const [downloadCount, setDownloadCount] = useState<number>(10);
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);

  const generateNewUUID = () => {
    setCurrentUuid(generateUUID());
  };

  const generateBulkUUIDs = () => {
    const uuids = Array.from({ length: downloadCount }, () => generateUUID());
    setBulkUuids(uuids);
  };

  const downloadBulkUUIDs = () => {
    if (bulkUuids.length === 0) return;

    const content = bulkUuids.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${bulkUuids.length}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatVariations = (uuid: string) => {
    return {
      standard: uuid,
      uppercase: uuid.toUpperCase(),
      noDashes: uuid.replace(/-/g, ""),
      braces: `{${uuid}}`,
      urn: `urn:uuid:${uuid}`,
    };
  };

  return (
    <ContentLayout title="UUID Generator">
      <div className="space-y-6">
        {/* Generation Controls */}
        <div className="flex gap-4 items-center">
          <Button onClick={generateNewUUID} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Generate New UUID
          </Button>
        </div>

        {/* Current UUID with Variations */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Current UUID</h3>
          <div className="space-y-3">
            {Object.entries(formatVariations(currentUuid)).map(
              ([format, value]) => (
                <div
                  key={format}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 capitalize mb-1">
                      {format === "noDashes" ? "No Dashes" : format}
                    </p>
                    <p className="font-mono text-sm">{value}</p>
                  </div>
                  <CopyButton
                    textToCopy={value}
                    variant="icon"
                    showLabel={false}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* Bulk Generation */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Generation</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
            <NumberInput
              label="Number of UUIDs"
              value={downloadCount}
              onChange={(e) =>
                setDownloadCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              min={1}
              max={1000}
              className="w-full sm:w-32"
            />
            <Button
              onClick={generateBulkUUIDs}
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <RefreshCw size={16} />
              Generate
            </Button>
          </div>

          {bulkUuids.length > 0 && (
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="space-y-2">
                  {bulkUuids.map((uuid, index) => (
                    <div
                      key={`${uuid}-${index}`}
                      className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-mono text-xs sm:text-sm flex-1 truncate">
                        {uuid}
                      </p>
                      <CopyButton
                        textToCopy={uuid}
                        variant="icon"
                        showLabel={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <DownloadButton
                  onClick={downloadBulkUUIDs}
                  className="justify-center"
                >
                  Download {bulkUuids.length} UUIDs
                </DownloadButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
