import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="inicio" className="min-h-screen relative overflow-hidden bg-[#1e3a5f] flex items-center justify-center">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-white/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-60 right-20 w-[400px] h-[400px] bg-soft-blue/25 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute bottom-40 left-1/3 w-[600px] h-[600px] bg-white/15 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-soft-blue/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-white/18 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-40 left-1/2 w-[300px] h-[300px] bg-soft-blue/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-32 right-32 w-[420px] h-[420px] bg-white/22 rounded-full blur-[160px] animate-float-horizontal"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-40 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm">
                <span>Gestão eficiente para igrejas</span>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight">
                  Sua
                  <br />
                  missão,
                  <br />
                  nossa
                  <br />
                  gestão.
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-xl">
                  A plataforma que organiza sua igreja com clareza, excelência e propósito.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/cadastro/etapa1')}
                  className="bg-white text-primary hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] px-8 py-6 rounded-lg font-medium shadow-lg transition-all duration-300"
                >
                  Criar conta
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => scrollToSection("funcionalidades")}
                  className="border-2 border-white/30 bg-transparent text-white hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:border-white/50 px-8 py-6 rounded-lg font-medium transition-all duration-300"
                >
                  Conhecer funcionalidades
                </Button>
              </div>
            </div>

            {/* Right Content - Decorative Cards */}
            <div className="relative h-[500px] hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 right-0 w-80 h-96 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl border border-white/20 animate-float">
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-2">
                      <img src="/icon.png" alt="Diácono" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/30 rounded-lg w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-white/20 rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-3 bg-white/15 rounded-lg w-5/6 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="h-3 bg-white/15 rounded-lg w-4/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-72 h-80 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 transform -rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl border border-white/20 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center p-2">
                      <img src="/icon.png" alt="Diácono" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/30 rounded-lg w-4/5 animate-pulse"></div>
                      <div className="h-3 bg-white/20 rounded-lg w-3/5 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 -mb-px">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(0 0% 96%)"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
