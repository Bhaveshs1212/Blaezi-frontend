export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Blaezi Logo with Animation */}
        <div className="mb-8">
          <h1 
            className="text-6xl font-bold text-[#6366F1] animate-pulse"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Blaezi
          </h1>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <p 
          className="mt-6 text-gray-500 font-light animate-pulse"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Loading your workspace...
        </p>
      </div>
    </div>
  );
}
