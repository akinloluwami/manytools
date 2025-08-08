import { createFileRoute } from "@tanstack/react-router";
import { ResizableElement } from "../../components/resizable-element";
import { CustomRange } from "@/components/custom-range";

export const Route = createFileRoute("/(tools)/video-trimmer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <CustomRange />
      <ResizableElement />
    </div>
  );
}
