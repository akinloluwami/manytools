import { useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { Download, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

export const Route = createFileRoute("/image-cropper")({
  component: RouteComponent,
});

function RouteComponent() {
  const presets = [
    {
      name: "Square",
      crop: {
        unit: "%" as const,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      },
    },
    {
      name: "Landscape",
      crop: {
        unit: "%" as const,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      },
    },
    {
      name: "Portrait",
      crop: {
        unit: "%" as const,
        x: 0,
        y: 0,
        width: 50,
        height: 100,
      },
    },
    {
      name: "Twitter Banner",
      crop: {
        unit: "px" as const,
        x: 0,
        y: 0,
        width: 1500,
        height: 500,
      },
    },
    {
      name: "Instagram Post",
      crop: {
        unit: "px" as const,
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
      },
    },
    {
      name: "Instagram Story",
      crop: {
        unit: "px" as const,
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
      },
    },
  ];
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setCroppedImage(null);
        setCrop({ unit: "%", x: 0, y: 0, width: 50, height: 50 });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    },
  });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgRef(e.currentTarget);
  };

  const getCroppedImg = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imgRef) return reject("Image not loaded");

      const canvas = document.createElement("canvas");
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;
      canvas.width = (crop.width || 0) * scaleX;
      canvas.height = (crop.height || 0) * scaleY;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No canvas context");

      ctx.drawImage(
        imgRef,
        (crop.x || 0) * scaleX,
        (crop.y || 0) * scaleY,
        (crop.width || 0) * scaleX,
        (crop.height || 0) * scaleY,
        0,
        0,
        (crop.width || 0) * scaleX,
        (crop.height || 0) * scaleY
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  };

  const cropImage = async () => {
    try {
      const cropped = await getCroppedImg();
      setCroppedImage(cropped);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };

  const downloadImage = () => {
    if (!croppedImage) return;

    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = "cropped-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ContentLayout title="Image Cropper">
      <div className="flex gap-20">
        <div className="w-[80%]">
          {!image && (
            <>
              <div className="w-full">
                <div
                  {...getRootProps()}
                  className="w-full border border-purple-500 border-dotted h-[70vh] rounded-2xl bg-purple-50 flex items-center justify-center cursor-pointer relative"
                >
                  {image && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                      className="absolute top-4 right-4"
                    >
                      <X size={20} />
                    </button>
                  )}
                  <input {...getInputProps()} />
                  {loading ? (
                    <Loader2
                      className="animate-spin text-purple-500"
                      size={40}
                    />
                  ) : image ? (
                    <img
                      src={image}
                      alt="Uploaded Preview"
                      className="max-h-full max-w-full rounded-2xl"
                    />
                  ) : (
                    <p className="text-gray-500 text-xl text-center">
                      Drop an image here or click to upload
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {image && !croppedImage && (
            <div className="w-full overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                keepSelection
                className="rounded"
              >
                <img
                  src={image}
                  alt="Upload"
                  className="w-full"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}
          {croppedImage && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={croppedImage}
                alt="Cropped"
                className="rounded shadow max-w-[800px] w-full"
              />
            </div>
          )}
        </div>
        <div className="w-[30%]">
          <div className="">
            <p>Presets</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  onClick={() => setCrop(preset.crop)}
                  className="size-20 text-xs text-center !bg-purple-100 !text-purple-500 border !border-purple-500 border-dotted hover:!bg-purple-200 flex items-center justify-center"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {image && !croppedImage && (
            <Button onClick={cropImage} className="w-full mt-2">
              Crop
            </Button>
          )}
          {croppedImage && (
            <Button onClick={downloadImage} className="w-full mt-4">
              Download
            </Button>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
