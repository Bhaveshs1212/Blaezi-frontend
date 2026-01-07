import ComingSoon from "../../components/common/ComingSoon";

export default function Analytics() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Analytics
        </h1>
        <p className="text-lg text-gray-500 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Track long-term trends across DSA practice, project momentum, and career preparation
        </p>
      </header>

      <div className="rounded-3xl bg-gray-50 border border-gray-100 p-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Coming Soon
        </h2>
        <p className="text-base text-gray-600 font-light max-w-lg mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Detailed analytics and insights are under development. Stay tuned for comprehensive tracking and visualization features.
        </p>
      </div>
    </div>
  );
}
