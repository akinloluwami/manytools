import { Input } from "@/components/modified-ui/input";
import { Badge } from "@/components/ui/badge";
import tools from "@/tools";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as SolarIconSet from "solar-icon-set";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <header className="flex sticky top-0 left-0 justify-between items-center gap-4 p-3 py-4 bg-white/60 backdrop-blur-md border-b border-purple-500/20 z-10">
        <div className="">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-800">
              Toolbaze{" "}
              <span className="px-2 py-1 rounded-full bg-black/10 text-black/70 border border-black text-xs">
                v0.1
              </span>{" "}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600 text-xs font-semibold">
              A growing collection of essential design, development, and
              everyday tools — all in one place.
            </p>
            <div className=""></div>
          </div>
        </div>
        <div className="">
          <div className="md:block hidden">
            <Input
              placeholder="Search Tools..."
              leftIcon={<SolarIconSet.Magnifer />}
            />
          </div>
        </div>
      </header>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
          {tools.map((tool, index) =>
            tool.wip ? (
              <div
                key={index}
                className="p-6 border relative border-black/30 bg-black/5 opacity-75 cursor-not-allowed rounded-lg flex items-center lg:justify-between lg:flex-col gap-4"
              >
                <tool.icon size={40} iconStyle="LineDuotone" />
                <p className="text-gray-600 text-center font-semibold text-sm">
                  {tool.title}
                </p>
                <Badge className="absolute top-2 right-2">Coming Soon</Badge>
              </div>
            ) : (
              <Link
                key={index}
                to={tool.route}
                className="p-6 border relative border-black/30 hover:bg-black/5  hover:border-black/20 transition-colors rounded-lg flex items-center lg:justify-between lg:flex-col gap-4"
              >
                <tool.icon size={40} iconStyle="LineDuotone" />
                <p className="text-gray-600 text-center font-semibold lg:text-sm text-base">
                  {tool.title}
                </p>
              </Link>
            ),
          )}

          <button className="p-6 border hover:bg-black/5 border-black/30 rounded-lg flex items-center justify-between flex-col cursor-pointer gap-4">
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
