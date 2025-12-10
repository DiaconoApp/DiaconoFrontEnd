import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const FAQ = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const faqs = [
    {
      question: "Como funciona o período de teste?",
      answer: "Oferecemos 30 dias gratuitos para você experimentar todas as funcionalidades da plataforma sem compromisso.",
    },
    {
      question: "É necessário instalar algum software?",
      answer: "Não! O Diácono é 100% online. Basta acessar pelo navegador de qualquer dispositivo com internet.",
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Utilizamos criptografia de ponta e servidores seguros. Seus dados são protegidos com os mais altos padrões de segurança.",
    },
    {
      question: "Há suporte técnico disponível?",
      answer: "Sim! Oferecemos suporte técnico por e-mail, chat e telefone em horário comercial.",
    },
  ];

  return (
    <section id="faq" className="pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28 relative overflow-hidden bg-ice-white border-none" ref={ref}>
      {/* Mouse-following light effect */}
      <div 
        className="hidden md:block absolute w-[600px] h-[600px] bg-primary/8 rounded-full blur-[80px] pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
          zIndex: 0
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Tire suas dúvidas sobre a plataforma
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`bg-white rounded-xl border border-gray-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-700 px-6 overflow-hidden ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
