import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-indigo-100/40 via-slate-50 to-purple-100/40">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          {/* Content surface */}
          <div className="min-h-full bg-slate-50/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
