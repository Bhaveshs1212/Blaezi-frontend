import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        <Topbar />

      <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-8 py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
