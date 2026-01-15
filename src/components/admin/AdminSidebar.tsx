import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  MessageCircle,
  Settings,
  LogOut,
  ChefHat,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  Copy,
} from "lucide-react";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ClipboardList, label: "Pedidos", path: "/admin/pedidos" },
  { icon: Settings, label: "Configurações", path: "/admin/configuracoes" },
];

const cardapioSubItems = [
  { icon: ListOrdered, label: "Gestão de Cardápio", path: "/admin/cardapio" },
  { icon: Copy, label: "Clonagem de Cardápio", path: "/admin/cardapio/clonar" },
];

export function AdminSidebar() {
  const location = useLocation();
  const { settings } = useRestaurantSettings();
  const [cardapioOpen, setCardapioOpen] = useState(
    location.pathname.startsWith("/admin/cardapio")
  );

  const handleOpenWhatsApp = () => {
    if (!settings?.whatsapp) return;
    
    // Remove non-numeric characters from the phone number
    const phoneNumber = settings.whatsapp.replace(/\D/g, "");
    
    // Opens WhatsApp with the configured number (works on mobile and desktop)
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const isCardapioActive = location.pathname.startsWith("/admin/cardapio");

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

          {/* Cardápio with submenu */}
          <li>
            <Collapsible open={cardapioOpen} onOpenChange={setCardapioOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isCardapioActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-5 h-5" />
                    <span>Cardápio</span>
                  </div>
                  {cardapioOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-1">
                {cardapioSubItems.map((subItem) => {
                  const isSubActive = location.pathname === subItem.path;
                  return (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSubActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span>{subItem.label}</span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </li>

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
