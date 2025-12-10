import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const Benefits = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const benefits = [
    "Gestão centralizada e intuitiva",
    "Melhor organização interna",
    "Comunicação clara entre líderes",
    "Indicadores confiáveis para decisões",
    "Engajamento da igreja",
    "Transparência total",
  ];

  return (
    <section id="beneficios" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-[#1e3a5f]" ref={ref}>
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
        <div className={`max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
            Benefícios
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            Transforme a gestão da sua igreja com ferramentas que realmente fazem a diferença
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-700 group ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-base text-white font-medium">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
