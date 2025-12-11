import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isOnBlueSection, setIsOnBlueSection] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
       
      // Detecta se está perto do final da página (footer)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
       
      setIsAtBottom(distanceFromBottom < 300); // 300px antes do final
      
      // Detecta se está em uma seção azul
      const blueSections = ['inicio', 'funcionalidades', 'beneficios', 'cta'];
      const scrollPosition = window.scrollY + 100;
      
      let onBlueSection = true;
      const allSections = document.querySelectorAll('section[id]');
      allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const sectionId = section.getAttribute('id');
          onBlueSection = blueSections.includes(sectionId);
        }
      });
      
      setIsOnBlueSection(onBlueSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = sectionId === 'sobre' ? 150 : 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Sobre", id: "sobre" },
    { name: "Quem Somos", id: "quem-somos" },
    { name: "Funcionalidades", id: "funcionalidades" },
    { name: "Para quem é", id: "publico" },
    { name: "Benefícios", id: "beneficios" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("inicio")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-primary/5' : 'bg-white/10'}`}>
              <img 
                src="/logoDiacono.png" 
                alt="Diácono Logo" 
                className="h-6 w-auto transition-all duration-300 group-hover:scale-110 object-contain"
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-medium transition-all hover:scale-105 relative group ${
                  isOnBlueSection ? "text-white/95" : "text-primary"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isOnBlueSection ? 'bg-white' : 'bg-primary'}`}></span>
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className={`rounded-xl font-semibold transition-all hover:scale-105 ${
                isOnBlueSection
                  ? "text-white hover:bg-white/10 hover:text-white"
                  : "text-primary hover:bg-primary/5 hover:text-white"
              }`}
            >
              Login
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/cadastro/etapa1')}
              className={`rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
                isOnBlueSection
                  ? "bg-white text-primary hover:bg-white/95"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isOnBlueSection ? "text-white" : "text-primary"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left font-medium transition-colors hover:opacity-80 ${
                    isScrolled ? "text-primary" : "text-white"
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className={`rounded-xl font-semibold w-full ${
                    isScrolled
                      ? "text-primary hover:bg-primary/10"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/cadastro/etapa1')}
                  className={`rounded-xl font-bold shadow-lg w-full ${
                    isScrolled
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white text-primary hover:bg-white/95"
                  }`}
                >
                  Cadastrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
