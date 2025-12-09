import { Crown, Shield, Heart, Wallet, Settings, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Audience = () => {
  const { ref, isVisible } = useScrollAnimation();
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
    <section id="publico" className="py-20 md:py-28 relative overflow-hidden bg-white" ref={ref}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold">
            Para quem é o Diácono?
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Uma solução completa para todos os envolvidos na gestão da igreja
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {profiles.map((profile, index) => (
            <Card
              key={index}
              className={`p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-700 hover:-translate-y-1 rounded-2xl group ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
              style={{ transitionDelay: `${index * 130}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/5 rounded-xl">
                  <profile.icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {profile.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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
