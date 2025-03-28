import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="max-w-7xl mx-auto p-10">
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
    </div>
  );
}
