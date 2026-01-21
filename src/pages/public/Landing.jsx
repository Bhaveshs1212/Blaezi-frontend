import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="max-w-[1120px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Animated Blaezi Logo */}
          <div className="relative overflow-hidden">
            <h1 
              className="text-2xl font-semibold tracking-tight text-[#6366F1] relative"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out]">B</span>
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.1s] opacity-0 [animation-fill-mode:forwards]">l</span>
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">a</span>
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards]">e</span>
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">z</span>
              <span className="inline-block animate-[fadeInUp_0.6s_ease-out_0.5s] opacity-0 [animation-fill-mode:forwards]">i</span>
            </h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[980px] mx-auto text-center">
          {/* Headline with gradient animation */}
          <h2 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-[#6366F1] to-gray-900 bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease-out]"
            style={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundSize: '200% auto',
              animation: 'fadeInUp 0.8s ease-out, gradientShift 3s ease-in-out infinite'
            }}
          >
            Master your craft.
            <br />
            Track your journey.
          </h2>

          {/* Subheading */}
          <p 
            className="text-base sm:text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-8 sm:mb-12 max-w-[720px] mx-auto animate-[fadeInUp_0.8s_ease-out_0.3s] opacity-0 px-4"
            style={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              animationFillMode: 'forwards'
            }}
          >
            A comprehensive platform to track your progress, manage projects, and plan your career with clarity and focus.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-20 animate-[fadeInUp_0.8s_ease-out_0.6s] opacity-0 px-4" style={{ animationFillMode: 'forwards' }}>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#6366F1] text-white text-sm sm:text-base font-semibold rounded-full hover:bg-[#5558E3] transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Get started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 sm:px-8 py-3 sm:py-4 text-[#6366F1] text-sm sm:text-base font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Log in
            </button>
          </div>

          {/* Hero Visual - Subtle accent line */}
          <div className="relative h-[1px] w-full max-w-[320px] sm:max-w-[480px] mx-auto bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-[1120px] mx-auto">
          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h3 
              className="text-xs sm:text-sm uppercase tracking-wider text-[#6366F1] font-bold mb-3 sm:mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything you need
            </h3>
            <h4 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight px-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything you need to succeed
            </h4>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "DSA Practice",
                description: "Track problems, measure progress, and build consistency with intelligent tracking."
              },
              {
                title: "Project Management",
                description: "Monitor your projects, set milestones, and maintain momentum on what matters."
              },
              {
                title: "Career Planning",
                description: "Prepare for interviews, plan your growth, and stay aligned with your goals."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-gray-100">
                  <h5 
                    className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {feature.title}
                  </h5>
                  <p 
                    className="text-sm sm:text-base text-gray-600 font-light leading-relaxed"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[880px] mx-auto text-center">
          <h3 
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6 sm:mb-8 px-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Designed for focus.
            <br />
            Built for growth.
          </h3>
          <p 
            className="text-base sm:text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-[680px] mx-auto px-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Blaezi helps you see what matters most, eliminate distractions, and make steady progress toward your goals.
          </p>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: "DSA", label: "Problems tracked" },
              { value: "Projects", label: "Organized" },
              { value: "Career", label: "Goals managed" },
              { value: "Analytics", label: "Insights provided" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-2xl sm:text-3xl font-bold text-[#6366F1] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs sm:text-sm text-gray-600 font-light"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#6366F1]">
        <div className="max-w-[880px] mx-auto text-center">
          <h3 
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4 sm:mb-6 px-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ready to begin?
          </h3>
          <p 
            className="text-base sm:text-lg md:text-xl text-white/80 font-light leading-relaxed mb-8 sm:mb-12 px-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Start tracking your progress today.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-[#6366F1] text-sm sm:text-base font-semibold rounded-full hover:bg-gray-50 transition-all duration-300"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p 
              className="text-xl sm:text-2xl font-semibold text-[#6366F1]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Blaezi
            </p>
            <p 
              className="text-xs sm:text-sm text-gray-500 text-center"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              © 2026 Blaezi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
