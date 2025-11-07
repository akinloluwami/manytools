# Shared Components Documentation

This directory contains reusable components that provide a unified design language across all tools in ManyTools.

## Components Overview

### 1. CopyButton

A versatile copy-to-clipboard button with visual feedback.

**Props:**

- `textToCopy` (string, required): Text to copy to clipboard
- `variant` ("default" | "icon" | "minimal"): Button style variant
- `size` ("sm" | "md" | "lg"): Button size
- `showLabel` (boolean): Whether to show "Copy/Copied" text
- `disabled` (boolean): Disable the button
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { CopyButton } from "@/components/shared";

<CopyButton textToCopy="#FF5733" variant="default" size="md" />
<CopyButton textToCopy="some-text" variant="icon" showLabel={false} />
```

---

### 2. FileDropZone

A unified file upload component with drag-and-drop support.

**Props:**

- `onFileSelect` (function, required): Callback when file is selected
- `accept` (object): File types to accept (default: images)
- `maxSize` (number): Maximum file size in bytes
- `loading` (boolean): Show loading state
- `preview` (string): Preview URL to display
- `onRemove` (function): Callback for remove button
- `showRemoveButton` (boolean): Show/hide remove button
- `height` (string): Container height
- `disabled` (boolean): Disable the dropzone
- `multiple` (boolean): Allow multiple files

**Usage:**

```tsx
import { FileDropZone } from "@/components/shared";

<FileDropZone
  onFileSelect={(file) => handleFile(file)}
  accept={{ "image/*": [] }}
  maxSize={200 * 1024 * 1024}
  preview={imageUrl}
  onRemove={() => setImageUrl(null)}
  height="h-[500px]"
/>;
```

---

### 3. StatCard

Display statistics and metrics in a consistent format.

**Props:**

- `label` (string, required): Stat label
- `value` (string | number, required): Stat value
- `variant` ("default" | "success" | "info" | "warning"): Color variant
- `size` ("sm" | "md" | "lg"): Card size
- `icon` (ReactNode): Optional icon
- `vertical` (boolean): Vertical layout
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { StatCard } from "@/components/shared";

<StatCard label="Words" value={1234} variant="default" size="md" />
<StatCard label="Saved" value="45%" variant="success" size="lg" vertical />
```

---

### 4. RangeSlider

A customizable range slider with labels and markers.

**Props:**

- `value` (number, required): Current value
- `onChange` (function, required): Value change callback
- `min` (number): Minimum value
- `max` (number): Maximum value
- `step` (number): Step increment
- `label` (string): Slider label
- `showValue` (boolean): Show value display
- `valueUnit` (string): Unit to display with value
- `showMarkers` (boolean): Show marker labels
- `markers` (string[]): Custom marker labels
- `disabled` (boolean): Disable the slider

**Usage:**

```tsx
import { RangeSlider } from "@/components/shared";

<RangeSlider
  value={quality}
  onChange={setQuality}
  min={1}
  max={100}
  label="Quality"
  showValue
  valueUnit="%"
  showMarkers
  markers={["Low", "Medium", "High"]}
/>;
```

---

### 5. Select

A styled dropdown select component.

**Props:**

- `options` (array, required): Array of `{value, label}` objects
- `placeholder` (string): Placeholder text
- `label` (string): Select label
- Plus all standard HTML select attributes

**Usage:**

```tsx
import { Select } from "@/components/shared";

<Select
  options={[
    { value: "paragraphs", label: "Paragraphs" },
    { value: "sentences", label: "Sentences" },
    { value: "words", label: "Words" },
  ]}
  value={type}
  onChange={(e) => setType(e.target.value)}
  label="Type"
/>;
```

---

### 6. LoadingSpinner

A consistent loading indicator component.

**Props:**

- `size` ("sm" | "md" | "lg" | "xl"): Spinner size
- `message` (string): Loading message
- `submessage` (string): Additional message
- `fullScreen` (boolean): Overlay entire screen
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { LoadingSpinner } from "@/components/shared";

<LoadingSpinner size="lg" message="Processing..." submessage="Please wait" />
<LoadingSpinner fullScreen size="xl" message="Loading..." />
```

---

### 7. ColorCard

Display color information with copy functionality.

**Props:**

- `color` (string, required): Hex color code
- `index` (number): Color index for labeling
- `onClick` (function): Click handler for details
- `showCopyButton` (boolean): Show copy button
- `size` ("sm" | "md" | "lg"): Card size
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { ColorCard } from "@/components/shared";

<ColorCard
  color="#FF5733"
  index={0}
  onClick={() => showColorDetails("#FF5733")}
  showCopyButton
  size="md"
/>;
```

---

### 8. DownloadButton

A consistent download button component.

**Props:**

- `onClick` (function, required): Download handler
- `fileName` (string): File name to display
- `variant` ("default" | "outline"): Button variant
- `size` ("sm" | "md" | "lg"): Button size
- `disabled` (boolean): Disable the button
- `children` (ReactNode): Custom button content
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { DownloadButton } from "@/components/shared";

<DownloadButton onClick={downloadFile} fileName="image.jpg" />
<DownloadButton onClick={downloadFile} variant="outline" size="lg">
  Download All
</DownloadButton>
```

---

### 9. InfoCard

A flexible card container for content.

**Props:**

- `title` (string): Card title
- `children` (ReactNode, required): Card content
- `variant` ("default" | "bordered" | "elevated"): Card style
- `padding` ("sm" | "md" | "lg"): Card padding
- `actions` (ReactNode): Action buttons in header
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { InfoCard } from "@/components/shared";

<InfoCard
  title="Settings"
  variant="elevated"
  padding="lg"
  actions={<Button>Save</Button>}
>
  <p>Card content here</p>
</InfoCard>;
```

---

### 10. EmptyState

Display empty states with consistent styling.

**Props:**

- `icon` (ReactNode): Empty state icon
- `title` (string, required): Empty state title
- `description` (string): Additional description
- `action` (ReactNode): Call-to-action button
- `size` ("sm" | "md" | "lg"): Component size
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { EmptyState } from "@/components/shared";
import { Image } from "lucide-react";

<EmptyState
  icon={<Image />}
  title="No images uploaded"
  description="Upload an image to get started"
  action={<Button>Upload Image</Button>}
  size="md"
/>;
```

---

### 11. ImagePreviewCard

Display image previews with consistent styling.

**Props:**

- `src` (string, required): Image source URL
- `alt` (string): Image alt text
- `title` (string): Preview title
- `subtitle` (string): Preview subtitle
- `onRemove` (function): Remove handler
- `actions` (ReactNode): Additional action buttons
- `imageClassName` (string): Image-specific classes
- `className` (string): Container classes

**Usage:**

```tsx
import { ImagePreviewCard } from "@/components/shared";

<ImagePreviewCard
  src={imageUrl}
  title="Original Image"
  subtitle="2.4 MB"
  onRemove={() => clearImage()}
  actions={<Button>Edit</Button>}
/>;
```

---

### 12. NumberInput

A styled number input with label and units.

**Props:**

- `label` (string): Input label
- `unit` (string): Unit to display (e.g., "MB", "px")
- `helperText` (string): Helper text below input
- `error` (string): Error message
- Plus all standard HTML input attributes

**Usage:**

```tsx
import { NumberInput } from "@/components/shared";

<NumberInput
  label="Number of UUIDs"
  value={count}
  onChange={(e) => setCount(e.target.value)}
  min={1}
  max={1000}
  unit="items"
  helperText="Choose between 1 and 1000"
/>;
```

---

### 13. ActionBar

A container for action buttons, can be sticky or floating.

**Props:**

- `children` (ReactNode, required): Action buttons
- `variant` ("default" | "sticky" | "floating"): Bar style
- `position` ("top" | "bottom"): Bar position
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { ActionBar } from "@/components/shared";

<ActionBar variant="sticky" position="bottom">
  <Button>Cancel</Button>
  <Button>Save</Button>
</ActionBar>;
```

---

### 14. PresetSelector

A grid of preset buttons for quick selections.

**Props:**

- `presets` (array, required): Array of `{label, value, icon?}` objects
- `selected` (any, required): Currently selected value
- `onSelect` (function, required): Selection handler
- `title` (string): Selector title
- `columns` (1 | 2 | 3 | 4): Grid columns
- `className` (string): Additional CSS classes

**Usage:**

```tsx
import { PresetSelector } from "@/components/shared";

<PresetSelector
  title="Aspect Ratios"
  presets={[
    { label: "Square", value: 1 },
    { label: "Landscape", value: 16 / 9 },
    { label: "Portrait", value: 9 / 16 },
  ]}
  selected={aspectRatio}
  onSelect={setAspectRatio}
  columns={2}
/>;
```

---

## Design Principles

All components follow these principles:

1. **Consistency**: Unified styling and behavior across all tools
2. **Accessibility**: Proper ARIA labels and keyboard navigation
3. **Responsive**: Works on all screen sizes
4. **Customizable**: Accept className props for custom styling
5. **Type-Safe**: Full TypeScript support with proper types
6. **Performance**: Optimized with React best practices

## Usage Guidelines

### Import Pattern

```tsx
// Import individual components
import { CopyButton, FileDropZone, StatCard } from "@/components/shared";

// Or import from specific files
import { CopyButton } from "@/components/shared/copy-button";
```

### Styling

All components accept a `className` prop for custom styling. Use Tailwind classes:

```tsx
<CopyButton textToCopy="example" className="mt-4 w-full" />
```

### Theming

Components use consistent color tokens:

- Primary: Black (`bg-black`, `text-black`)
- Success: Green (`bg-green-*`)
- Error: Red (`bg-red-*`)
- Info: Blue (`bg-blue-*`)
- Neutral: Gray (`bg-gray-*`)

## Examples

See individual tool implementations for real-world usage examples:

- `image-compressor.tsx` - FileDropZone, RangeSlider, StatCard
- `uuid-generator.tsx` - CopyButton, NumberInput
- `text-case-converter.tsx` - CopyButton variants
- `color-picker.tsx` - ColorCard
- `lorem-ipsum.tsx` - CopyButton, Select

## Contributing

When creating new components:

1. Follow the existing pattern and structure
2. Include full TypeScript types
3. Add documentation to this README
4. Export from `index.tsx`
5. Test across different tools
