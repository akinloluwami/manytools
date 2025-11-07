/**
 * Component Usage Examples
 *
 * This file demonstrates how to use the shared components in various scenarios
 */

import { useState } from "react";
import {
  CopyButton,
  FileDropZone,
  StatCard,
  RangeSlider,
  Select,
  LoadingSpinner,
  ColorCard,
  DownloadButton,
  InfoCard,
  EmptyState,
  ImagePreviewCard,
  NumberInput,
  ActionBar,
  PresetSelector,
} from "@/components/shared";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Example 1: Image Tool Pattern
export function ImageToolExample() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex gap-6">
      {/* Upload Section */}
      <div className="w-1/2">
        <FileDropZone
          onFileSelect={handleFileSelect}
          preview={image}
          onRemove={() => setImage(null)}
          loading={loading}
          height="h-[500px]"
        />
      </div>

      {/* Settings Section */}
      <div className="w-1/2">
        {image ? (
          <InfoCard title="Settings" variant="elevated">
            <RangeSlider
              value={quality}
              onChange={setQuality}
              min={1}
              max={100}
              label="Quality"
              showValue
              valueUnit="%"
              showMarkers
            />
            <Button className="w-full mt-4">Process Image</Button>
          </InfoCard>
        ) : (
          <EmptyState
            icon={<ImageIcon />}
            title="No image uploaded"
            description="Upload an image to get started"
          />
        )}
      </div>
    </div>
  );
}

// Example 2: Color Tool Pattern
export function ColorToolExample() {
  const [colors, setColors] = useState(["#FF5733", "#33FF57", "#3357FF"]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <InfoCard
        title="Color Palette"
        actions={<DownloadButton onClick={() => {}} />}
      >
        {colors.map((color, index) => (
          <ColorCard
            key={color}
            color={color}
            index={index}
            onClick={() => setSelectedColor(color)}
            showCopyButton
            size="md"
            className="mb-3"
          />
        ))}
      </InfoCard>
    </div>
  );
}

// Example 3: Text Tool Pattern
export function TextToolExample() {
  const [text, setText] = useState("");
  const [type, setType] = useState("paragraphs");

  const stats = {
    words: 150,
    characters: 850,
    sentences: 12,
    paragraphs: 3,
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[500px] border border-gray-300 rounded-lg p-4"
          placeholder="Enter text..."
        />
      </div>

      <div className="w-1/3 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Words" value={stats.words} size="sm" vertical />
          <StatCard
            label="Characters"
            value={stats.characters}
            size="sm"
            vertical
          />
          <StatCard
            label="Sentences"
            value={stats.sentences}
            size="sm"
            vertical
          />
          <StatCard
            label="Paragraphs"
            value={stats.paragraphs}
            size="sm"
            vertical
          />
        </div>

        <Select
          options={[
            { value: "paragraphs", label: "Paragraphs" },
            { value: "sentences", label: "Sentences" },
            { value: "words", label: "Words" },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value)}
          label="Type"
        />

        <CopyButton textToCopy={text} className="w-full" size="lg" />
      </div>
    </div>
  );
}

// Example 4: Generator Tool Pattern
export function GeneratorToolExample() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    setItems(Array.from({ length: count }, (_, i) => `Item ${i + 1}`));
  };

  return (
    <div className="space-y-6">
      <InfoCard title="Generator Settings" variant="bordered">
        <NumberInput
          label="Number of Items"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
          max={100}
          helperText="Choose between 1 and 100"
        />
        <Button onClick={generate} className="w-full mt-4">
          Generate
        </Button>
      </InfoCard>

      {items.length > 0 && (
        <InfoCard
          title="Generated Items"
          actions={
            <DownloadButton onClick={() => {}} variant="outline" size="sm" />
          }
        >
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-mono">{item}</span>
                <CopyButton
                  textToCopy={item}
                  variant="icon"
                  size="sm"
                  showLabel={false}
                />
              </div>
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  );
}

// Example 5: Preset-based Tool Pattern
export function PresetToolExample() {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [image, setImage] = useState<string | null>(null);

  const presets = [
    { label: "Square", value: 1 },
    { label: "Landscape", value: 16 / 9 },
    { label: "Portrait", value: 9 / 16 },
    { label: "Twitter", value: 3 / 1 },
  ];

  return (
    <div className="space-y-6">
      <FileDropZone
        onFileSelect={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => setImage(e.target?.result as string);
          reader.readAsDataURL(file);
        }}
        preview={image}
        onRemove={() => setImage(null)}
      />

      {image && (
        <PresetSelector
          title="Aspect Ratio Presets"
          presets={presets}
          selected={aspectRatio}
          onSelect={setAspectRatio}
          columns={2}
        />
      )}
    </div>
  );
}

// Example 6: Loading States
export function LoadingStatesExample() {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  return (
    <div className="space-y-6">
      <Button onClick={() => setLoading(true)}>Show Loading</Button>

      {loading && (
        <LoadingSpinner
          size="lg"
          message="Processing your request..."
          submessage="This may take a moment"
        />
      )}

      <Button onClick={() => setProcessing(true)}>Show Full Screen</Button>

      {processing && (
        <LoadingSpinner fullScreen size="xl" message="Processing..." />
      )}
    </div>
  );
}

// Example 7: Action Bar
export function ActionBarExample() {
  return (
    <div className="relative h-screen">
      <div className="p-8">
        <h1>Content here</h1>
      </div>

      <ActionBar variant="sticky" position="bottom">
        <Button className="!bg-white !text-black border border-black">
          Cancel
        </Button>
        <Button>Save Changes</Button>
        <CopyButton textToCopy="example" variant="minimal" />
      </ActionBar>
    </div>
  );
}

// Example 8: Complete Tool Layout
export function CompleteToolExample() {
  const [file, setFile] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ quality: 80, size: 100 });

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <FileDropZone
            onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => setFile(e.target?.result as string);
              reader.readAsDataURL(f);
            }}
            preview={file}
            onRemove={() => setFile(null)}
          />

          {file && (
            <div className="mt-4">
              <StatCard
                label="Original Size"
                value="2.4 MB"
                variant="info"
                size="md"
              />
            </div>
          )}
        </div>

        {/* Settings & Output Section */}
        <div className="space-y-4">
          {file ? (
            <>
              <InfoCard title="Settings" variant="elevated">
                <RangeSlider
                  value={settings.quality}
                  onChange={(quality) => setSettings({ ...settings, quality })}
                  label="Quality"
                  showValue
                  valueUnit="%"
                  showMarkers
                  className="mb-4"
                />
                <NumberInput
                  label="Max Size"
                  value={settings.size}
                  onChange={(e) =>
                    setSettings({ ...settings, size: Number(e.target.value) })
                  }
                  unit="MB"
                />
                <Button className="w-full mt-4">Process</Button>
              </InfoCard>

              {processed && (
                <InfoCard
                  title="Result"
                  actions={<DownloadButton onClick={() => {}} size="sm" />}
                >
                  <div className="grid grid-cols-3 gap-3">
                    <StatCard
                      label="Original"
                      value="2.4 MB"
                      size="sm"
                      vertical
                    />
                    <StatCard
                      label="Compressed"
                      value="0.8 MB"
                      size="sm"
                      vertical
                    />
                    <StatCard
                      label="Saved"
                      value="66%"
                      variant="success"
                      size="sm"
                      vertical
                    />
                  </div>
                </InfoCard>
              )}
            </>
          ) : (
            <EmptyState
              icon={<ImageIcon />}
              title="Upload a file to get started"
              description="Select or drag a file to begin processing"
            />
          )}
        </div>
      </div>
    </div>
  );
}
