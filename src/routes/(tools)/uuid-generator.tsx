import ContentLayout from "@/components/shared/content-layout";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Download } from "lucide-react";

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
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState<number>(10);
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);
  const [copiedBulkIndex, setCopiedBulkIndex] = useState<number | null>(null);

  const generateNewUUID = () => {
    setCurrentUuid(generateUUID());
  };

  const generateBulkUUIDs = () => {
    const uuids = Array.from({ length: downloadCount }, () => generateUUID());
    setBulkUuids(uuids);
  };

  const copyToClipboard = async (uuid: string, format: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyBulkUuid = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedBulkIndex(index);
      setTimeout(() => setCopiedBulkIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
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
                  <Button
                    onClick={() => copyToClipboard(value, format)}
                    className={`ml-4 p-2 transition-colors ${
                      copiedFormat === format
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bulk Generation */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Generation</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="count" className="text-sm font-medium">
                Number of UUIDs:
              </label>
              <input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={downloadCount}
                onChange={(e) =>
                  setDownloadCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
              />
            </div>
            <Button
              onClick={generateBulkUUIDs}
              className="flex items-center gap-2"
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
                      className="flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-mono text-sm flex-1">{uuid}</p>
                      <Button
                        onClick={() => copyBulkUuid(uuid, index)}
                        className={`ml-2 p-1 transition-colors ${
                          copiedBulkIndex === index
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                        title="Copy to clipboard"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={downloadBulkUUIDs}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download {bulkUuids.length} UUIDs as TXT
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
