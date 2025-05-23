import { createFileRoute, Link } from "@tanstack/react-router";
import * as SolarIconSet from "solar-icon-set";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const tools = [
    {
      icon: SolarIconSet.PaletteRound,
      title: "Image Palette Generator",
      route: "/image-palette-generator",
    },
    {
      icon: SolarIconSet.GalleryDownload,
      title: "Image Compressor",
      route: "/image-compressor",
    },
    {
      title: "Video Trimmer",
      route: "/video-trimmer",
      icon: SolarIconSet.VideoFrameCut2,
    },
    {
      title: "Lorem Ipsum Generator",
      route: "/lorem-ipsum",
      icon: SolarIconSet.TextFieldFocus,
    },
  ];
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-800">
          ManyTools{" "}
          <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500 text-xs">
            v0.1
          </span>{" "}
        </p>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <p className="text-gray-600 text-xs font-semibold">
          A growing collection of essential design, development, and everyday
          tools — all in one place.
        </p>
        <div className=""></div>
      </div>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.route}
              className="p-6 border border-purple-500 rounded-lg flex items-center justify-between flex-col gap-4"
            >
              <tool.icon size={40} iconStyle="LineDuotone" />
              <p className="text-gray-600 font-semibold text-sm">
                {tool.title}
              </p>
            </Link>
          ))}
          <button className="p-6 border border-purple-500 rounded-lg flex items-center justify-between flex-col cursor-pointer gap-4">
            <SolarIconSet.WidgetAdd size={40} />
            <p className="text-gray-600 font-semibold text-sm">
              Request New Tool
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
