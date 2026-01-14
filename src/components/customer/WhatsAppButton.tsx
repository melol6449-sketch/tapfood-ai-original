import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurant } from "@/data/mockData";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido no ${restaurant.name}!`
    );
    window.open(
      `https://wa.me/${restaurant.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Button
        variant="whatsapp"
        size="xl"
        onClick={handleWhatsAppClick}
        className="gap-3 rounded-full px-8"
      >
        <MessageCircle className="w-6 h-6" />
        Pedir pelo WhatsApp
      </Button>
    </div>
  );
}
