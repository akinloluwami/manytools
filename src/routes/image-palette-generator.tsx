import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  PlusIcon,
  X,
  Loader2Icon,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "motion/react";
//@ts-ignore
import ColorThief from "colorthief";

export const Route = createFileRoute("/image-palette-generator")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [fullPalette, setFullPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        extractColors(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (src: string) => {
    setLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 10);
      const hexColors = palette.map(
        ([r, g, b]: number[]) =>
          `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
      );
      setFullPalette(hexColors);
      setColors(hexColors.slice(0, 6));
      setLoading(false);
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const addNewColor = () => {
    if (colors.length < fullPalette.length) {
      setColors([...colors, fullPalette[colors.length]]);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-6">
          <Link to="/">
            <ArrowLeftIcon size={20} />
          </Link>
          <p className="text-2xl font-bold text-gray-800">
            Image Palette Generator
          </p>
        </div>
      </div>
      <div className="mt-20 flex gap-x-10">
        <div className="w-[60%]">
          <div
            {...getRootProps()}
            className="w-full border border-purple-500 border-dotted h-[70vh] rounded-2xl bg-purple-50 flex items-center justify-center cursor-pointer relative"
          >
            {image && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setColors([]);
                }}
                className="absolute top-4 right-4"
              >
                <X size={20} />
              </button>
            )}
            <input {...getInputProps()} />
            {loading ? (
              <Loader2Icon className="animate-spin text-purple-500" size={40} />
            ) : image ? (
              <img
                src={image}
                alt="Uploaded Preview"
                className="max-h-full max-w-full rounded-2xl"
              />
            ) : (
              <p className="text-gray-500 text-2xl">
                Drop an image here or click to upload
              </p>
            )}
          </div>
        </div>
        <div className="w-[40%]">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-800">Palette</p>
              <div className="flex gap-x-[1px]">
                <button className="bg-purple-500 text-white px-4 py-2 rounded-l-lg cursor-pointer">
                  Export palette
                </button>
                <button className="bg-purple-500 text-white px-2 py-2 rounded-r-lg cursor-pointer">
                  <ChevronDown />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <AnimatePresence>
                {colors.map((color) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-between px-4"
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-gray-800">{color}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!!image && (
                <button
                  className="text-sm text-purple-500 flex items-center gap-x-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={addNewColor}
                  disabled={
                    colors.length >= fullPalette.length || loading || !image
                  }
                >
                  <PlusIcon size={16} /> Add Color
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
