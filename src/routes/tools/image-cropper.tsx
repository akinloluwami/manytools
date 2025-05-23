import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/image-cropper")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const cropImage = async () => {
    if (!image || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(cropped);
  };

  return (
    <ContentLayout title="Image Cropper">
      <div className="flex flex-col items-center gap-4">
        {!image && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:rounded file:border file:border-gray-300 file:px-4 file:py-2 file:text-sm"
          />
        )}

        {image && !croppedImage && (
          <div className="relative w-[300px] h-[300px] bg-black">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {image && !croppedImage && (
          <Button onClick={cropImage} className="mt-4">
            Crop
          </Button>
        )}

        {croppedImage && (
          <div className="mt-4">
            <img
              src={croppedImage}
              alt="Cropped"
              className="rounded shadow max-w-[300px] max-h-[300px]"
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
