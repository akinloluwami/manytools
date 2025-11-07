import { useState, useRef, type BaseSyntheticEvent } from "react";
import { Trash, Image as ImageIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import ContentLayout from "@/components/shared/content-layout";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import {
  FileDropZone,
  RangeSlider,
  DownloadButton,
  StatCard,
  LoadingSpinner,
  EmptyState,
} from "@/components/shared";

export const Route = createFileRoute("/(tools)/image-compressor")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Image Compressor - ManyTools",
      },
    ],
  }),
});

function RouteComponent() {
  const [image, setImage] = useState<string>(null!);
  const [compressedImage, setCompressedImage] = useState<string>(null!);
  const [compressedSize, setCompressedSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    const MAX_FILE_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please select an image smaller than 200MB.");
      return;
    }

    setOriginalSize(file.size);
    setUploadLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event?.target?.result) return alert("An Error Occurred");
      setImage(event.target.result as string);
      setCompressedImage(null!);
      setUploadLoading(false);
    };
    reader.onerror = () => {
      alert("Failed to read file. The image might be too large or corrupted.");
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCompression = () => {
    if (!image) return;

    setLoading(true);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          alert("Your browser does not support this feature.");
          setLoading(false);
          return;
        }

        const maxWidth = 1920;
        const maxHeight = 1080;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        const MAX_CANVAS_DIMENSION = 5000;
        if (width > MAX_CANVAS_DIMENSION || height > MAX_CANVAS_DIMENSION) {
          const scale = Math.min(
            MAX_CANVAS_DIMENSION / width,
            MAX_CANVAS_DIMENSION / height,
          );
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataURL = canvas.toDataURL("image/jpeg", quality / 100);
        setCompressedImage(compressedDataURL);

        const base64str = compressedDataURL.split(",")[1];
        const byteSize = window.atob(base64str).length;
        setCompressedSize(byteSize);
      } catch (error) {
        console.error("Compression failed:", error);
        alert(
          "Failed to compress the image. The image might be too large to process in the browser.",
        );
      } finally {
        setLoading(false);
      }
    };
    posthog.capture("image_compressor");

    img.onerror = () => {
      alert(
        "Failed to load the image. The image might be corrupted or too large.",
      );
      setLoading(false);
    };

    img.src = image;
  };

  const downloadCompressedImage = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed-image-${quality}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetCompressor = () => {
    setImage(null!);
    setCompressedImage(null!);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const calculateSavings = () => {
    if (!originalSize || !compressedSize) return "0%";
    const savings = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);
    return savings + "%";
  };

  return (
    <ContentLayout title="Image Compressor">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upload Section */}
        <div className="w-full lg:w-1/2">
          {!image ? (
            <FileDropZone
              onFileSelect={handleFileSelect}
              accept={{ "image/*": [] }}
              maxSize={200 * 1024 * 1024}
              loading={uploadLoading}
              height="h-[500px]"
              className="h-[500px]"
            />
          ) : (
            <div className="border-2 border-gray-300 rounded-xl p-8">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-lg">Original Image</p>
                <button
                  onClick={resetCompressor}
                  className="text-red-600 flex items-center gap-2 text-sm hover:bg-red-50 py-2 px-3 rounded-lg transition-colors font-medium"
                >
                  <Trash size={16} /> Remove
                </button>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <img
                  src={image}
                  alt="Original"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    Original Size
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatSize(originalSize)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compression Section */}
        <div className="w-full lg:w-1/2">
          {image && (
            <div className="space-y-6">
              {/* Settings Card */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <p className="font-semibold text-lg mb-5">
                  Compression Settings
                </p>
                <div className="space-y-4">
                  <RangeSlider
                    label="Quality"
                    value={quality}
                    onChange={setQuality}
                    min={1}
                    max={100}
                    valueUnit="%"
                    showMarkers={true}
                    markers={["Lower quality", "Balanced", "Higher quality"]}
                  />
                  <Button
                    onClick={handleCompression}
                    disabled={loading}
                    className="w-full py-3 text-base font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" message="Compressing..." />
                    ) : (
                      <>Compress Image</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading && !compressedImage && (
                <div className="border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center bg-white shadow-sm">
                  <LoadingSpinner
                    size="lg"
                    message="Compressing your image..."
                    submessage="This may take a moment"
                  />
                </div>
              )}

              {/* Compressed Result */}
              {compressedImage && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <p className="font-semibold text-lg">Compressed Image</p>
                    <DownloadButton onClick={downloadCompressedImage} size="sm">
                      Download
                    </DownloadButton>
                  </div>
                  <div className="p-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img
                        src={compressedImage}
                        alt="Compressed"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <StatCard
                        label="Original"
                        value={formatSize(originalSize)}
                        variant="default"
                        size="sm"
                      />
                      <StatCard
                        label="Compressed"
                        value={formatSize(compressedSize)}
                        variant="default"
                        size="sm"
                      />
                      <StatCard
                        label="Saved"
                        value={calculateSavings()}
                        variant="success"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!image && !uploadLoading && (
            <EmptyState
              icon={<ImageIcon size={64} className="opacity-30" />}
              title="Upload an image to get started"
              description="Compress your images with adjustable quality"
              className="h-[500px]"
              size="lg"
            />
          )}

          {/* Upload Loading State */}
          {!image && uploadLoading && (
            <div className="h-[500px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-8 bg-gray-50/30">
              <LoadingSpinner
                size="xl"
                message="Loading your image..."
                submessage="Please wait"
              />
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
