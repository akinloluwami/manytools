import type { IconProps } from "node_modules/solar-icon-set/dist/types";
import type { ReactNode } from "react";
import * as SolarIconSet from "solar-icon-set";

type ToolCategory = "image" | "video" | "text" | "utility" | "dev";
export interface Tool {
  icon: React.ComponentType<IconProps> | ReactNode;
  title: ReactNode | string;
  route: string;
  category: ToolCategory;
  wip?: boolean;
}

export default [
  {
    icon: SolarIconSet.PaletteRound,
    title: "Image Palette Generator",
    route: "/tools/image-palette-generator",
    category: "image",
  },
  {
    icon: SolarIconSet.GalleryDownload,
    title: "Image Compressor",
    route: "/tools/image-compressor",
    category: "image",
  },
  {
    title: "Video Trimmer",
    route: "/tools/video-trimmer",
    icon: SolarIconSet.VideoFrameCut2,
    wip: true,
    category: "video",
  },
  {
    title: "Lorem Ipsum Generator",
    route: "/tools/lorem-ipsum",
    icon: SolarIconSet.TextFieldFocus,
    category: "video",
  },
  {
    title: "Word Counter",
    route: "/tools/word-counter",
    icon: SolarIconSet.Document,
    category: "text",
  },
  {
    title: "Image Cropper",
    route: "/tools/image-cropper",
    icon: SolarIconSet.Crop,
    category: "image",
  },
] satisfies Tool[];
