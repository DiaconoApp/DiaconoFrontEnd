import { Crown, Shield, Heart, Wallet, Settings, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const Audience = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }; 

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const profiles = [
    {
      icon: Crown,
      title: "Pastores",
      description: "Visão completa da igreja e ferramentas para liderança estratégica",
    },
    {
      icon: Shield,
      title: "Diáconos",
      description: "Gestão de membros, visitações e acompanhamento pastoral",
    },
    {
      icon: Heart,
      title: "Líderes de Ministérios",
      description: "Organize equipes, eventos e atividades do seu ministério",
    },
    {
      icon: Wallet,
      title: "Tesouraria",
      description: "Controle financeiro completo com relatórios detalhados",
    },
    {
      icon: Settings,
      title: "Equipe Administrativa",
      description: "Processos otimizados para o dia a dia da secretaria",
    },
    {
      icon: Users,
      title: "Membros",
      description: "Acesso a informações da igreja e participação ativa na comunidade",
    },
  ];

  return (
    <section id="publico" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-white" ref={ref}>
      {/* Mouse-following light effect */}
      <div 
        className="hidden md:block absolute w-[800px] h-[800px] bg-diacono-blue-400/10 rounded-full blur-[200px] pointer-events-none transition-all duration-300 ease-out z-20"
        style={{
          left: `${mousePosition.x - 400}px`,
          top: `${mousePosition.y - 400}px`,
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-diacono-blue-400 font-bold">
            Para quem é o Diácono?
          </h2>
          <p className="text-base md:text-lg text-diacono-blue-300/70 leading-relaxed">
            Uma solução completa para todos os envolvidos na gestão da igreja
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {profiles.map((profile, index) => (
            <Card
              key={index}
              className={`p-6 sm:p-8 bg-white border border-diacono-blue-100 shadow-sm hover:shadow-md transition-all duration-700 hover:-translate-y-1 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
              style={{ transitionDelay: `${index * 130}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-diacono-blue-400/5 rounded-xl">
                  <profile.icon className="w-8 h-8 text-diacono-blue-400" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-diacono-blue-400">
                  {profile.title}
                </h3>
                <p className="text-sm text-diacono-blue-300/70 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
