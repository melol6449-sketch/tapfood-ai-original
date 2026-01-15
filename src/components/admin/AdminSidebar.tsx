import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  MessageCircle,
  Settings,
  LogOut,
  ChefHat,
} from "lucide-react";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ClipboardList, label: "Pedidos", path: "/admin/pedidos" },
  { icon: UtensilsCrossed, label: "Cardápio", path: "/admin/cardapio" },
  { icon: Settings, label: "Configurações", path: "/admin/configuracoes" },
];

export function AdminSidebar() {
  const location = useLocation();
  const { settings } = useRestaurantSettings();

  const handleOpenWhatsApp = () => {
    // Opens WhatsApp app directly without starting a conversation
    window.open("whatsapp://", "_self");
  };

  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">
              TapFood AI
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
          {/* WhatsApp button - opens app directly */}
          <li>
            <button
              onClick={handleOpenWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </NavLink>
      </div>
    </aside>
  );
}
