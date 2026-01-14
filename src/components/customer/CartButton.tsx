import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Button
        size="xl"
        onClick={onClick}
        className="gap-3 rounded-full px-8 bg-primary hover:bg-primary/90"
      >
        <ShoppingCart className="w-6 h-6" />
        Ver Carrinho ({itemCount}) • {formatPrice(total)}
      </Button>
    </div>
  );
}
