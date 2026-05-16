import { Target, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const About = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => { 
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const aboutContent = [
    {
      icon: Target,
      title: "Organização",
      description: "Centralize todas as informações e processos da sua igreja em um único lugar.",
    },
    {
      icon: TrendingUp,
      title: "Transparência",
      description: "Relatórios claros e acessíveis para toda a liderança e membros.",
    },
    {
      icon: Users,
      title: "Eficiência Ministerial",
      description: "Otimize o tempo da equipe para focar no que realmente importa: pessoas.",
    },
  ];

  const benefits = aboutContent;

  return (
    <section id="sobre" className="pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28 relative overflow-hidden bg-ice-white border-none" ref={ref}>
      {/* Mouse-following light effect */}
      <div 
        className="hidden md:block absolute w-[800px] h-[800px] bg-diacono-blue-400/10 rounded-full blur-[200px] pointer-events-none transition-all duration-300 ease-out z-20"
        style={{
          left: `${mousePosition.x - 400}px`,
          top: `${mousePosition.y - 400}px`,
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-3xl mx-auto text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-diacono-blue-400 font-bold">
            O que é o Diácono?
          </h2>
          <p className="text-base md:text-lg text-diacono-blue-300/70 leading-relaxed">
            O Diácono é uma plataforma completa de gestão desenvolvida especialmente para igrejas. Com o objetivo de transformar a forma como sua igreja se organiza, comunica e serve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`p-8 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-700 hover:-translate-y-1 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-diacono-blue-400 rounded-xl">
                  <benefit.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-diacono-blue-400">
                  {benefit.title}
                </h3>
                <p className="text-sm text-diacono-blue-300/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Gradient Transition to Next Section */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, var(--color-diacono-blue-400) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 70%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 70%, black 100%)'
          }}></div>
        </div>
      </div>
    </section>
  );
};

export default About;
