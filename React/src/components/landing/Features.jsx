import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const Features = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
 
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const features = [
    {
      icon: "calendario",
      title: "Calendário",
      description: "Organize eventos, cultos e atividades com facilidade",
      comingSoon: false,
    },
    {
      icon: "iconeGrupo",
      title: "Membros",
      description: "Cadastro completo e histórico de cada membro",
      comingSoon: false,
    },
    {
      icon: "iconeTerra",
      title: "Ministérios",
      description: "Estruture e acompanhe todos os ministérios",
      comingSoon: false,
    },
    {
      icon: "iconeDash",
      title: "Dashboard",
      description: "Indicadores e relatórios em tempo real",
      comingSoon: false,
    },
    {
      icon: "iconeEscala",
      title: "Escalas",
      description: "Gerencie equipes e voluntários de forma automatizada",
      comingSoon: true,
    },
    {
      icon: "iconeFinanceiro",
      title: "Financeiro",
      description: "Controle de dízimos, ofertas e despesas",
      comingSoon: true,
    },
  ];

  return (
    <section id="funcionalidades" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-diacono-blue-400" ref={ref}>
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
            Principais
            <br />
            Funcionalidades
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-6 sm:p-8 bg-white/95 backdrop-blur border-none shadow-sm hover:shadow-lg transition-all duration-700 hover:-translate-y-1 rounded-xl group relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {feature.comingSoon && (
                <div className="absolute top-3 right-3">
                  <div className="bg-gradient-to-br from-diacono-blue-200 to-diacono-blue-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    Em breve
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-diacono-blue-400/5 rounded-xl">
                  <img 
                    src={`/${feature.icon}.svg`} 
                    alt={feature.title} 
                    className="w-8 h-8" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(45%) saturate(3258%) hue-rotate(200deg) brightness(94%) contrast(95%)' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-diacono-blue-400">
                  {feature.title}
                </h3>
                <p className="text-sm text-diacono-blue-300/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
