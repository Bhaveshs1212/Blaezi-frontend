import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Landing from "../pages/public/Landing";
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import DsaOverview from "../pages/dsa/DsaOverview";
import DsaProblems from "../pages/dsa/DsaProblems";
import Career from "../pages/career/Career";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/career" element={<Career />} />

          {/* DSA */}
          <Route path="/dsa" element={<DsaOverview />} />
          <Route path="/dsa/problems" element={<DsaProblems />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
