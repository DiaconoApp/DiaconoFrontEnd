import { Target, Eye, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const Mission = () => {
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
    <section id="quem-somos" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-ice-white" ref={ref}>
      {/* Mouse-following light effect */}
      <div 
        className="hidden md:block absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-500 ease-out opacity-30 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(13, 39, 80, 0.15) 0%, transparent 70%)',
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
          zIndex: 1
        }}
      />
      
      {/* Gradient Transition from Previous Section */}
      <div className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, var(--color-diacono-blue-400) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 70%, transparent 100%)'
          }}></div>
        </div>
      </div>
      
      {/* Dotted Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 dotted-texture" style={{ 
          backgroundImage: 'radial-gradient(circle, var(--color-diacono-blue-400) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-diacono-blue-400 font-bold">
            Quem Somos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Missão */}
          <Card
            className={`p-8 bg-white border border-diacono-blue-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2 hover:scale-105 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-diacono-blue-400/5 rounded-xl group-hover:bg-diacono-blue-400/10 group-hover:scale-110 transition-all duration-300">
                <Target className="w-8 h-8 text-diacono-blue-400" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-diacono-blue-400">
                Missão
              </h3>
              <p className="text-sm text-diacono-blue-300/70 leading-relaxed">
                Facilitar a gestão interna de igrejas, promovendo organização, transparência e cuidado com os membros.
              </p>
            </div>
          </Card>

          {/* Visão */}
          <Card
            className={`p-8 bg-white border border-diacono-blue-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2 hover:scale-105 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-diacono-blue-400/5 rounded-xl group-hover:bg-diacono-blue-400/10 group-hover:scale-110 transition-all duration-300">
                <Eye className="w-8 h-8 text-diacono-blue-400" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-diacono-blue-400">
                Visão
              </h3>
              <p className="text-sm text-diacono-blue-300/70 leading-relaxed">
                Ser a principal plataforma de gestão para igrejas, apoiando líderes e fortalecendo comunidades.
              </p>
            </div>
          </Card>

          {/* Valores */}
          <Card
            className={`p-8 bg-white border border-diacono-blue-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2 hover:scale-105 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-diacono-blue-400/5 rounded-xl group-hover:bg-diacono-blue-400/10 group-hover:scale-110 transition-all duration-300">
                <Award className="w-8 h-8 text-diacono-blue-400" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-diacono-blue-400">
                Valores
              </h3>
              <ul className="text-sm text-diacono-blue-300/70 leading-relaxed space-y-2">
                <li>• Ética</li>
                <li>• Inovação tecnológica</li>
                <li>• Transparência</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Mission;
