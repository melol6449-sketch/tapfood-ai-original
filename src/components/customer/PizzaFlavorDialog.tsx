import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MenuProduct } from "@/hooks/useCustomerMenu";

interface PizzaFlavorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flavors: MenuProduct[];
  priceMethod: 'highest' | 'average';
  onConfirm: (selectedFlavors: MenuProduct[], calculatedPrice: number) => void;
  categoryIcon?: string;
}

export function PizzaFlavorDialog({
  open,
  onOpenChange,
  flavors,
  priceMethod,
  onConfirm,
  categoryIcon,
}: PizzaFlavorDialogProps) {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const toggleFlavor = (flavorId: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavorId)) {
        return prev.filter((id) => id !== flavorId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, flavorId];
    });
  };

  const selectedFlavorObjects = useMemo(() => {
    return flavors.filter((f) => selectedFlavors.includes(f.id));
  }, [flavors, selectedFlavors]);

  const calculatedPrice = useMemo(() => {
    if (selectedFlavorObjects.length === 0) return 0;
    
    const prices = selectedFlavorObjects.map((f) => f.price);
    
    if (priceMethod === 'highest') {
      return Math.max(...prices);
    } else {
      return prices.reduce((sum, p) => sum + p, 0) / prices.length;
    }
  }, [selectedFlavorObjects, priceMethod]);

  const handleConfirm = () => {
    if (selectedFlavorObjects.length > 0) {
      onConfirm(selectedFlavorObjects, calculatedPrice);
      setSelectedFlavors([]);
      onOpenChange(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedFlavors([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcon || "🍕"}</span>
            Monte sua Pizza
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione até 3 sabores. O preço será calculado pelo{" "}
            <span className="font-medium text-foreground">
              {priceMethod === 'highest' ? 'maior valor' : 'valor médio'}
            </span>{" "}
            dos sabores escolhidos.
          </p>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {flavors.map((flavor) => {
                const isSelected = selectedFlavors.includes(flavor.id);
                const isDisabled = !isSelected && selectedFlavors.length >= 3;
                
                return (
                  <label
                    key={flavor.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : isDisabled
                        ? "border-border opacity-50 cursor-not-allowed"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={() => toggleFlavor(flavor.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {flavor.name}
                      </p>
                      {flavor.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {flavor.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-primary shrink-0">
                      {formatPrice(flavor.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </ScrollArea>

          {selectedFlavors.length > 0 && (
            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedFlavors.length} sabor(es) selecionado(s)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFlavorObjects.map((f) => f.name).join(" + ")}
                  </p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(calculatedPrice)}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedFlavors.length === 0}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}