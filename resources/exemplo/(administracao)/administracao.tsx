import Sidebar from "#/components/administracao/SideBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-1 bg-white flex">
      <Sidebar />
      <div className="flex-1 p-5 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
