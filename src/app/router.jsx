import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import DsaOverview from "../pages/dsa/DsaOverview";
import DsaProblems from "../pages/dsa/DsaProblems";
import DsaTopics from "../pages/dsa/DsaTopics";
import Career from "../pages/career/Career";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/career" element={<Career />} />

            {/* DSA */}
            <Route path="/dsa" element={<DsaOverview />} />
            <Route path="/dsa/problems" element={<DsaProblems />} />
            <Route path="/dsa/topics" element={<DsaTopics />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
