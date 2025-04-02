import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  PlusIcon,
  X,
  Loader2Icon,
  ChevronDown,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "motion/react";
// @ts-ignore
import ColorThief from "colorthief";
import Modal from "@/components/modal";
import { convertHexColorCode } from "@/utils/convert-hex-color-code";
import { getLuminosity } from "@/utils/get-luminosity";
import { Tooltip } from "react-tooltip";

export const Route = createFileRoute("/image-palette-generator")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [fullPalette, setFullPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const extractColors = useCallback(
    (src: string) => {
      if (loading) return;

      setLoading(true);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 10) as [
            number,
            number,
            number,
          ][];
          const hexColors = palette.map(
            ([r, g, b]) =>
              `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
          );
          setFullPalette(hexColors);
          setColors(hexColors.slice(0, 6));
        } catch (err) {
          console.error("Failed to extract palette:", err);
          setFullPalette([]);
          setColors([]);
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        console.error("Image failed to load.");
        setLoading(false);
      };
    },
    [loading]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        extractColors(result);
      };
      reader.readAsDataURL(file);
    },
    [extractColors]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const addNewColor = () => {
    if (colors.length < fullPalette.length) {
      setColors((prev) => [...prev, fullPalette[prev.length]]);
    }
  };

  const convertedColor = useMemo(() => {
    if (!isModalOpen || !selectedColor) return null;
    if (!/^#[0-9A-Fa-f]{6}$/.test(selectedColor)) return null;

    return convertHexColorCode(selectedColor);
  }, [isModalOpen, selectedColor]);

  const textColor =
    getLuminosity(selectedColor || "") > 0.5 ? "black" : "white";

  return (
    <>
      <Modal
        isOpen={isModalOpen && !!selectedColor}
        onClose={() => setIsModalOpen(false)}
        title="Detailed view"
      >
        <Tooltip id="tooltip" />

        <div className="space-y-4">
          {convertedColor &&
            Object.entries(convertedColor).map(([key, value]) => (
              <div
                key={key}
                className="w-full h-12 rounded-lg flex items-center justify-between px-4 uppercase"
                style={{ backgroundColor: selectedColor!, color: textColor }}
                data-tooltip-id="tooltip"
                data-tooltip-content="Copy"
              >
                <p>{key}</p>
                <p>{value}</p>
              </div>
            ))}
        </div>
      </Modal>
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
                  setFullPalette([]);
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
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-l-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={colors.length === 0}
                >
                  Export palette
                </button>
                <button
                  className="bg-purple-500 text-white px-2 py-2 rounded-r-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={colors.length === 0}
                >
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
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedColor(color);
                    }}
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
