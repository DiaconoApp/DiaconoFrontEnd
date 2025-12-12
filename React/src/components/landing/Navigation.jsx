import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
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
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-primary/10 backdrop-blur-sm border-b border-white/15"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("inicio")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="p-2 rounded-xl transition-all duration-300 bg-transparent">
              <img 
                src={isScrolled ? "/logo-azul.png" : "/logoDiacono.png"}
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
                  isScrolled ? "text-primary" : "text-white/95"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-primary' : 'bg-white'}`}></span>
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className={`rounded-xl font-semibold transition-all hover:scale-105 ${
                isScrolled
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/10 hover:text-white"
              }`}
            >
              Login
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/cadastro/etapa1')}
              className={`rounded-xl font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
                isScrolled
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white text-primary hover:bg-white/90"
              }`}
            >
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${isScrolled ? 'border-slate-200/80' : 'border-white/15'}`}>
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
              <div className={`flex flex-col gap-2 pt-4 border-t ${isScrolled ? 'border-slate-200/80' : 'border-white/15'}`}>
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
                      : "bg-white text-primary hover:bg-white/90"
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
