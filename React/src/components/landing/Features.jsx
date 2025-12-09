import { Calendar, Users, UserCircle, Wallet, BarChart3, ClipboardList, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Features = () => {
  const { ref, isVisible } = useScrollAnimation();
  const features = [
    {
      icon: Calendar,
      title: "Calendário",
      description: "Organize eventos, cultos e atividades com facilidade",
    },
    {
      icon: Users,
      title: "Escalas",
      description: "Gerencie equipes e voluntários de forma automatizada",
    },
    {
      icon: UserCircle,
      title: "Membros",
      description: "Cadastro completo e histórico de cada membro",
    },
    {
      icon: Layers,
      title: "Ministérios",
      description: "Estruture e acompanhe todos os ministérios",
    },
    {
      icon: Wallet,
      title: "Financeiro",
      description: "Controle de dízimos, ofertas e despesas",
    },
    {
      icon: ClipboardList,
      title: "Dashboard",
      description: "Indicadores e relatórios em tempo real",
    },
  ];

  return (
    <section id="funcionalidades" className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-[#1e3a5f]" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`p-6 sm:p-8 bg-white/95 backdrop-blur border-none shadow-sm hover:shadow-lg transition-all duration-700 hover:-translate-y-1 rounded-xl group ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/5 rounded-xl">
                  <feature.icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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
