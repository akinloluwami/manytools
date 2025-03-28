import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/image-palette-generator")({
  component: RouteComponent,
});

function RouteComponent() {
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
          <div className="w-full border border-purple-500 border-dotted h-[70vh] rounded-2xl bg-purple-50 flex items-center justify-center cursor-pointer">
            <p className="text-gray-500 text-2xl">
              Drop an image here or click to upload
            </p>
          </div>
        </div>
        <div className="w-[40%]"></div>
      </div>
    </>
  );
}
