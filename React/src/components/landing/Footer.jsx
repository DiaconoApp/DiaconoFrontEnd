const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0f2744] py-16">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Logo e Descrição */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <img src="/logo.png" alt="Diácono Logo" className="h-6 w-auto object-contain" />
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">
                A plataforma que organiza sua igreja com clareza, excelência e propósito.
              </p>
            </div>

            {/* Links Úteis */}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#sobre" className="text-white/70 hover:text-white transition-colors text-sm">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#funcionalidades" className="text-white/70 hover:text-white transition-colors text-sm">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Suporte
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/60 text-center text-xs">
              © 2025 Diácono. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
