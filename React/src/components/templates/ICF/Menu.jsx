import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  Church,
  LayoutDashboard,
  Settings,
  Menu as MenuIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '../../../services/login';
import { formatarCargo, transformationName } from '../../../utils/Utils';
import { usePermission } from "../../../hooks/usePermission";

const navItems = [
  { key: "eventos", name: 'Calendário', path: '/eventos', icon: Calendar },
  { key: "escalas", name: 'Escalas', path: '/escalas', icon: Clock },
  { key: "membros", name: 'Membros', path: '/membros', icon: Users },
  { key: "ministerios", name: 'Ministérios', path: '/ministerios', icon: Church },
{ key: "dashboards", name: 'Dashboards', path: '/dashboard', icon: LayoutDashboard }
];

export function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = usePermission();

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nome") || "";
    setNome(nomeSalvo);

    const cargoSalvo = localStorage.getItem("cargo") || "";
    setCargo(cargoSalvo);
  }, []);

  return (
    <div className="min-h-screen bg-icf-primary-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen bg-icf-primary-400 text-white transition-all duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        sidebarCollapsed ? "w-16" : "w-56"
      )}>
        {/* Header with logo and collapse button */}
        <div className={cn(
          "flex items-center justify-between border-b border-icf-primary-300/30 h-16",
          sidebarCollapsed ? "px-3" : "px-5"
        )}>
          <div className="flex items-center">
            {sidebarCollapsed ? (
              <img src="/LogotipoICF.png" alt="ICF" className="w-10 h-10 object-contain" />
            ) : (
              <img src="/logoICF.png" alt="Igreja Cristã da Família" className="h-10 object-contain" />
            )}
          </div>
          
          {/* Collapse button in header */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-icf-primary-200 hover:text-white hover:bg-icf-primary-300/50 transition-colors ml-auto",
              sidebarCollapsed && "mx-auto"
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            if (item.key && !can(item.key)) return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1",
                  isActive
                    ? "bg-icf-primary-300/40 text-white"
                    : "text-icf-primary-200 hover:bg-icf-primary-300/20 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-icf-primary-300/30 py-4">
          <NavLink
            to="/configuracoes"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1",
              isActive
                ? "bg-icf-primary-300/40 text-white"
                : "text-icf-primary-200 hover:bg-icf-primary-300/20 hover:text-white"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Configurações</span>
            )}
          </NavLink>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-icf-primary-200 hover:bg-icf-primary-300/20 hover:text-white transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Sair</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-icf-primary-400 text-white h-16 flex items-center px-4 lg:px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-icf-primary-300/50 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <NavLink to="/perfil" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{transformationName(nome) || 'Pastor Roberto'}</p>
                <p className="text-xs text-icf-primary-200">{formatarCargo(cargo) || 'Administrador'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-icf-primary-300/50 flex items-center justify-center border-2 border-icf-primary-300/50">
                <User className="w-5 h-5 text-white" />
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-icf-primary-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 