import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function AdminLayout() {
  const handleOpenCustomerMenu = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      
      {/* Floating button to view customer menu */}
      <Button
        onClick={handleOpenCustomerMenu}
        className="fixed bottom-6 left-6 z-50 shadow-lg gap-2"
        size="lg"
      >
        <ExternalLink className="h-4 w-4" />
        Ver cardápio do cliente
      </Button>
    </div>
  );
}
