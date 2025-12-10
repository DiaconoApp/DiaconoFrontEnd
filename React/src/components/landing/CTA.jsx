import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CTA = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <section id="cta" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden bg-[#1e3a5f]" ref={ref}>
      {/* Dotted Background */}
      <div className="absolute inset-0 dotted-texture opacity-50"></div>
      
      {/* Mouse-following light effect */}
      <div 
        className="hidden md:block absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-500 ease-out opacity-20 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
          zIndex: 1
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/20 text-sm text-white mb-2">
            <span>Não perca tempo!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight px-4">
            Pronto para organizar sua igreja com excelência?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Comece agora mesmo e transforme a gestão da sua igreja
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/cadastro/etapa1')}
              className="bg-white text-[#1e3a5f] hover:bg-white/90 px-10 py-6 rounded-lg font-semibold shadow-lg text-base"
            >
              Criar conta
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-white/70 text-sm pt-2">
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Fácil</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Rápido</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Ágil</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
