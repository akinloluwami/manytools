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
              ManyTools{" "}
              <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500 text-xs">
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.route}
              className="p-6 border relative border-purple-500/30 hover:bg-purple-50/50  hover:border-purple-500 transition-colors rounded-lg flex items-center justify-between flex-col gap-4"
            >
              <tool.icon size={40} iconStyle="LineDuotone" />
              <p className="text-gray-600 text-center font-semibold text-sm">
                {tool.title}
              </p>
              {/* {tool.wip && <Badge>Coming Soon</Badge>} */}
            </Link>
          ))}

          <button className="p-6 border bg-purple-500/10 border-purple-500 rounded-lg flex items-center justify-between flex-col cursor-pointer gap-4">
            <SolarIconSet.WidgetAdd color="#C26BFF" size={40} />
            <p className="text-purple-500 font-semibold text-sm">
              Request New Tool
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
