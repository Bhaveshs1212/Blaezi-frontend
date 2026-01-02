import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Mark that user has visited landing page
    sessionStorage.setItem("visited_landing", "true");
    
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center px-6 relative overflow-hidden font-['Inter',_'SF_Pro_Display',_system-ui,_sans-serif]">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -top-48 -right-48"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl -bottom-48 -left-48"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        {/* Animated Blaezi Logo */}
        <div className="space-y-6">
          <h1 className="text-7xl md:text-9xl font-semibold text-slate-800 tracking-normal" style={{ fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif" }}>
            <span className="inline-block animate-fade-slide animation-delay-0">B</span>
            <span className="inline-block animate-fade-slide animation-delay-100">l</span>
            <span className="inline-block animate-fade-slide animation-delay-200">a</span>
            <span className="inline-block animate-fade-slide animation-delay-300">e</span>
            <span className="inline-block animate-fade-slide animation-delay-400">z</span>
            <span className="inline-block animate-fade-slide animation-delay-500">i</span>
          </h1>
          
          <div className="flex justify-center">
            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full animate-expand shadow-lg shadow-blue-500/30"></div>
          </div>
        </div>

        {/* Content that fades in after logo */}
        <div className={`space-y-8 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-xl md:text-2xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Empowering developers and students to track progress, improve skills, and achieve their goals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-white text-slate-700 text-lg font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              View Demo
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center pt-8">
            {[
              { name: "DSA Tracking", color: "from-blue-500 to-blue-600" },
              { name: "Projects", color: "from-indigo-500 to-indigo-600" },
              { name: "Career Planning", color: "from-purple-500 to-purple-600" },
              { name: "Analytics", color: "from-violet-500 to-violet-600" }
            ].map((feature, index) => (
              <span
                key={feature.name}
                className="px-5 py-2 bg-white text-slate-700 rounded-full text-sm font-medium border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in group cursor-default"
                style={{ animationDelay: `${1800 + index * 100}ms` }}
              >
                <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} mr-2`}></span>
                {feature.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Animations */}
      <style>{`
        @keyframes fade-slide {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes expand {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 8rem;
            opacity: 1;
          }
        }

        .animate-fade-slide {
          animation: fade-slide 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-expand {
          animation: expand 0.8s ease-out 0.6s forwards;
          width: 0;
          opacity: 0;
        }

        .animation-delay-0 {
          animation-delay: 0ms;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}
