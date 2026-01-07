import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { DsaProvider } from "./context/DsaContext";
import { CareerProvider } from "./context/CareerContext";
import AppRouter from "./app/router";
import LoadingScreen from "./components/common/LoadingScreen";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <AppRouter />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <DsaProvider>
          <CareerProvider>
            <AppContent />
          </CareerProvider>
        </DsaProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
