import { useState, useEffect } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { posthog } from "@/lib/posthog";

export const Route = createFileRoute("/(tools)/image-cropper")({
  component: RouteComponent,
});

function RouteComponent() {
  const presets = [
    {
      name: "Square",
      aspectRatio: 1,
    },
    {
      name: "Landscape",
      aspectRatio: 16 / 9,
    },
    {
      name: "Portrait",
      aspectRatio: 9 / 16,
    },
    {
      name: "Twitter Banner",
      aspectRatio: 3 / 1,
    },
    {
      name: "Instagram Post",
      aspectRatio: 1,
    },
    {
      name: "Instagram Story",
      aspectRatio: 9 / 16,
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
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<
    number | undefined
  >(undefined);

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

  // Track Shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
        // Store current aspect ratio when shift is pressed
        if (crop.width && crop.height) {
          setCurrentAspectRatio(crop.width / crop.height);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [crop]);

  const applyCropPreset = (aspectRatio: number) => {
    if (!imgRef) return;

    const imageWidth = imgRef.width;
    const imageHeight = imgRef.height;
    const imageAspectRatio = imageWidth / imageHeight;

    let cropWidth: number;
    let cropHeight: number;

    if (imageAspectRatio > aspectRatio) {
      // Image is wider than the desired aspect ratio
      cropHeight = imageHeight;
      cropWidth = cropHeight * aspectRatio;
    } else {
      // Image is taller than the desired aspect ratio
      cropWidth = imageWidth;
      cropHeight = cropWidth / aspectRatio;
    }

    // Center the crop
    const x = (imageWidth - cropWidth) / 2;
    const y = (imageHeight - cropHeight) / 2;

    setCrop({
      unit: "px",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
    });
    setCurrentAspectRatio(aspectRatio);
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
        (crop.height || 0) * scaleY,
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
      posthog.capture("image_cropper");
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

  const [selectedPresent, setSelectedPresent] = useState("");

  return (
    <ContentLayout title="Image Cropper">
      <div className="flex gap-10">
        <div className="w-[70%]">
          {!image && (
            <>
              <div className="w-full">
                <div
                  {...getRootProps()}
                  className="w-full border border-black border-dotted h-[70vh] rounded-2xl bg-black/[2] flex items-center justify-center cursor-pointer relative"
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
                    <Loader2 className="animate-spin text-black" size={40} />
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
            <div className="w-full overflow-hidden max-h-[70vh] flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  setCrop(c);
                  // Update current aspect ratio as user drags
                  if (c.width && c.height && !isShiftPressed) {
                    setCurrentAspectRatio(c.width / c.height);
                  }
                }}
                keepSelection
                locked={false}
                aspect={isShiftPressed ? currentAspectRatio : undefined}
                className="rounded max-h-[70vh]"
              >
                <img
                  src={image}
                  alt="Upload"
                  className="max-h-[70vh] max-w-full object-contain"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}
          {croppedImage && (
            <div className="flex flex-col items-center gap-4 max-h-[70vh]">
              <img
                src={croppedImage}
                alt="Cropped"
                className="rounded shadow max-h-[70vh] max-w-full object-contain"
              />
            </div>
          )}
        </div>
        <div className="w-[30%] flex flex-col">
          {image && (
            <>
              <div className="">
                <p className="font-medium mb-2">Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => {
                        setSelectedPresent(preset.name);
                        applyCropPreset(preset.aspectRatio);
                      }}
                      className={`text-xs text-center border !border-black border-dotted flex items-center justify-center transition-all h-auto py-2
                        ${preset.name === selectedPresent ? "bg-black text-white" : "!bg-black/5 !text-black hover:!bg-black/10"}
                        `}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {!croppedImage && (
                <Button onClick={cropImage} className="w-full mt-4">
                  Crop Image
                </Button>
              )}
              {croppedImage && (
                <div className="flex flex-col gap-2 mt-4">
                  <Button onClick={downloadImage} className="w-full">
                    Download Image
                  </Button>
                  <Button
                    onClick={() => {
                      setCroppedImage(null);
                      setSelectedPresent("");
                      setCurrentAspectRatio(undefined);
                    }}
                    className="w-full !bg-white !text-black border border-black hover:!bg-black/5"
                  >
                    Crop Again
                  </Button>
                  <Button
                    onClick={() => {
                      setImage(null);
                      setCroppedImage(null);
                      setSelectedPresent("");
                      setCurrentAspectRatio(undefined);
                      setCrop({ unit: "%", x: 0, y: 0, width: 50, height: 50 });
                    }}
                    className="w-full !bg-white !text-black border border-black hover:!bg-black/5"
                  >
                    Upload New Image
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
