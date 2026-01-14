import { useState } from "react";
import { Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PizzaFlavorDialog } from "./PizzaFlavorDialog";
import { useCart } from "@/contexts/CartContext";
import type { MenuProduct } from "@/hooks/useCustomerMenu";
import { toast } from "sonner";

interface PizzaCardProps {
  categoryName: string;
  categoryIcon?: string;
  flavors: MenuProduct[];
  priceMethod: 'highest' | 'average';
}

export function PizzaCard({ 
  categoryName, 
  categoryIcon, 
  flavors,
  priceMethod 
}: PizzaCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addItem } = useCart();

  const availableFlavors = flavors.filter((f) => f.available);
  const minPrice = Math.min(...availableFlavors.map((f) => f.price));
  const maxPrice = Math.max(...availableFlavors.map((f) => f.price));

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleConfirm = (selectedFlavors: MenuProduct[], calculatedPrice: number) => {
    const flavorNames = selectedFlavors.map((f) => f.name).join(" + ");
    const cartId = `pizza-${selectedFlavors.map((f) => f.id).sort().join("-")}`;
    
    addItem({
      id: cartId,
      name: `Pizza ${selectedFlavors.length > 1 ? `${selectedFlavors.length} Sabores` : ''}: ${flavorNames}`,
      price: calculatedPrice,
      image: selectedFlavors[0]?.image || undefined,
    });
    
    toast.success("Pizza adicionada ao carrinho!");
  };

  if (availableFlavors.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up group">
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary overflow-hidden flex items-center justify-center">
          <Pizza className="w-20 h-20 text-primary/60" />
        </div>
        
        <div className="p-4">
          <h3 className="font-display font-bold text-foreground text-lg mb-1">
            Monte sua Pizza
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            Escolha até 3 sabores da nossa seleção de {availableFlavors.length} opções
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">A partir de</span>
              <span className="text-xl font-bold text-primary ml-2">
                {formatPrice(minPrice)}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="gap-1"
            >
              <Pizza className="w-4 h-4" />
              Montar
            </Button>
          </div>
        </div>
      </div>

      <PizzaFlavorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        flavors={availableFlavors}
        priceMethod={priceMethod}
        onConfirm={handleConfirm}
        categoryIcon={categoryIcon}
      />
    </>
  );
}