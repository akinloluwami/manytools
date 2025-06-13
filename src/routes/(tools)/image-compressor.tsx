import { useState, useRef, type BaseSyntheticEvent, useCallback } from "react";
import {
  Upload,
  Download,
  Trash,
  Image as ImageIcon,
  Loader2Icon,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import ContentLayout from "@/components/shared/content-layout";
import { useDropzone } from "react-dropzone";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";

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
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles) return;
    const file = acceptedFiles[0];
    if (!file) return;

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
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleFileChange = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const MAX_FILE_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please select an image smaller than 200MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
            MAX_CANVAS_DIMENSION / height
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
          "Failed to compress the image. The image might be too large to process in the browser."
        );
      } finally {
        setLoading(false);
      }
    };
    posthog.capture("image_compressor");

    img.onerror = () => {
      alert(
        "Failed to load the image. The image might be corrupted or too large."
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2">
          <div
            {...getRootProps()}
            className={`border border-dotted rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer ${!image ? "h-96" : "h-auto"} ${!image ? "hover:bg-gray-50" : ""}`}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {uploadLoading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2Icon
                  className="animate-spin text-black mb-3"
                  size={40}
                />
                <p className="text-black font-medium">Loading image...</p>
              </div>
            ) : !image ? (
              <>
                <div className="bg-purple-50 p-4 rounded-full mb-4">
                  <Upload className="text-black" size={24} />
                </div>
                <p className="font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG or WEBP (max 200MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  {...getInputProps()}
                />
              </>
            ) : (
              <div className="w-full">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">Original Image</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetCompressor();
                    }}
                    className="text-red-500 flex items-center gap-x-1 text-sm hover:bg-red-50 p-1 px-2 rounded"
                  >
                    <Trash size={16} /> Remove
                  </button>
                </div>
                <img
                  src={image}
                  alt="Original"
                  className="w-full h-auto rounded border"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Size: {formatSize(originalSize)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          {image && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-3">Compression Settings</p>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-600">
                      Quality: {quality}%
                    </label>
                    <span className="text-sm text-gray-600">
                      {quality < 30
                        ? "Lower quality"
                        : quality > 70
                          ? "Higher quality"
                          : "Balanced"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <Button onClick={handleCompression} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2Icon className="animate-spin" size={20} />
                      <span>Compressing...</span>
                    </>
                  ) : (
                    <>Compress Image</>
                  )}
                </Button>
              </div>

              {loading && !compressedImage && (
                <div className="border rounded-lg p-8 flex flex-col items-center justify-center">
                  <Loader2Icon
                    className="animate-spin text-black mb-3"
                    size={40}
                  />
                  <p className="text-black font-medium">
                    Compressing your image...
                  </p>
                </div>
              )}

              {compressedImage && (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Compressed Image</p>
                    <button
                      onClick={downloadCompressedImage}
                      className="text-black flex items-center gap-x-1 text-sm bg-black/5 hover:bg-black/10 p-1 px-2 rounded"
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full h-auto rounded border"
                  />
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Original</p>
                      <p className="font-medium">{formatSize(originalSize)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Compressed</p>
                      <p className="font-medium">
                        {formatSize(compressedSize)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <p className="text-xs text-green-500">Saved</p>
                      <p className="font-medium text-green-500">
                        {calculateSavings()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!image && !uploadLoading && (
            <div className="h-80 border rounded-lg flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
                <p>Upload an image to see compression options</p>
              </div>
            </div>
          )}

          {!image && uploadLoading && (
            <div className="h-80 border rounded-lg flex items-center justify-center p-6">
              <div className="text-center text-purple-500">
                <Loader2Icon className="animate-spin mx-auto mb-3" size={48} />
                <p>Loading your image...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
