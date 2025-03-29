import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "motion/react";

export const Route = createFileRoute("/image-palette-generator")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const [mockColors, setMockColors] = useState([
    "#4b146f",
    "#f4c2c2",
    "#f4a261",
    "#e9c46a",
    "#2a9d8f",
  ]);

  const generateColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  const addNewColor = () => {
    setMockColors([...mockColors, generateColor()]);
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
                }}
                className="absolute top-4 right-4"
              >
                <X size={20} />
              </button>
            )}
            <input {...getInputProps()} />
            {image ? (
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
              <button
                className="text-sm text-purple-500 flex items-center gap-x-1 cursor-pointer"
                onClick={addNewColor}
              >
                <PlusIcon size={16} /> Add Color
              </button>
            </div>
            <div className="flex flex-col gap-y-4">
              <AnimatePresence>
                {mockColors.map((color) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
