import { ProjectProvider } from "./context/ProjectContext";
import { DsaProvider } from "./context/DsaContext";
import AppRouter from "./app/router";
import { CareerProvider } from "./context/CareerContext";
export default function App() {
  return (
  <ProjectProvider>
  <DsaProvider>
    <CareerProvider>
      <AppRouter />
    </CareerProvider>
  </DsaProvider>
</ProjectProvider>
  );
}
