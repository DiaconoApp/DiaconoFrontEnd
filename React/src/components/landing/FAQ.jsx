import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const FAQ = () => {
  const { ref, isVisible } = useScrollAnimation();
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
      question: "Posso importar dados de outros sistemas?",
      answer: "Sim! Nossa equipe auxilia na migração de dados de planilhas e outros sistemas de gestão.",
    },
    {
      question: "Há suporte técnico disponível?",
      answer: "Sim! Oferecemos suporte técnico por e-mail, chat e telefone em horário comercial.",
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Trabalhamos com planos mensais ou anuais flexíveis, de acordo com o tamanho da sua igreja.",
    },
  ];

  return (
    <section id="faq" className="relative overflow-hidden py-20 md:py-28 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center space-y-4 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold">
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
