import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "react-tooltip/dist/react-tooltip.css";

export const Route = createRootRoute({
  component: () => (
    <div className="max-w-7xl mx-auto p-6">
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});