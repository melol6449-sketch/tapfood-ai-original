import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pizza, UtensilsCrossed, Plus, X } from "lucide-react";
import type { MenuCategory } from "@/hooks/useMenuData";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: MenuCategory | null;
  onSave: (data: { 
    name: string; 
    icon: string; 
    is_pizza_category?: boolean;
    pizza_sizes?: string[];
    pizza_price_method?: 'highest' | 'average';
  }) => Promise<void>;
}

const EMOJI_OPTIONS = ["🍔", "🍕", "🥗", "🍟", "🥤", "🍰", "🍝", "🌮", "🍜", "🍣", "🍿", "🍩"];

export const CategoryDialog = ({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) => {
  const [categoryType, setCategoryType] = useState<'outros' | 'pizzas'>('outros');
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");
  const [loading, setLoading] = useState(false);
  
  // Pizza-specific state
  const [pizzaSizes, setPizzaSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [pizzaPriceMethod, setPizzaPriceMethod] = useState<'highest' | 'average'>('highest');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setCategoryType(category.is_pizza_category ? 'pizzas' : 'outros');
      setPizzaSizes(category.pizza_sizes || []);
      setPizzaPriceMethod(category.pizza_price_method || 'highest');
    } else {
      setName("");
      setIcon("🍽️");
      setCategoryType('outros');
      setPizzaSizes([]);
      setNewSize("");
      setPizzaPriceMethod('highest');
    }
  }, [category, open]);

  const handleAddSize = () => {
    if (newSize.trim() && !pizzaSizes.includes(newSize.trim())) {
      setPizzaSizes([...pizzaSizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setPizzaSizes(pizzaSizes.filter(s => s !== size));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const data: {
        name: string;
        icon: string;
        is_pizza_category?: boolean;
        pizza_sizes?: string[];
        pizza_price_method?: 'highest' | 'average';
      } = { 
        name: name.trim(), 
        icon: categoryType === 'pizzas' ? '🍕' : icon,
        is_pizza_category: categoryType === 'pizzas',
      };

      if (categoryType === 'pizzas') {
        data.pizza_sizes = pizzaSizes;
        data.pizza_price_method = pizzaPriceMethod;
      }

      await onSave(data);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Category Type Selection - Only show for new categories */}
            {!isEditing && (
              <div className="grid gap-2">
                <Label>Tipo de Categoria</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryType('outros')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      categoryType === 'outros'
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <UtensilsCrossed className="w-8 h-8 text-primary" />
                    <span className="font-medium">Outros</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Lanches, bebidas, porções, etc.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryType('pizzas')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      categoryType === 'pizzas'
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Pizza className="w-8 h-8 text-primary" />
                    <span className="font-medium">Pizzas</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Categoria especial para pizzas
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Show type indicator for editing */}
            {isEditing && category?.is_pizza_category && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Pizza className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Categoria de Pizzas</span>
              </div>
            )}

            {/* Category Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da categoria</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={categoryType === 'pizzas' ? "Ex: Pizzas Tradicionais" : "Ex: Hambúrgueres"}
                autoFocus
              />
            </div>

            {/* Icon Selection - Only for non-pizza categories */}
            {categoryType === 'outros' && (
              <div className="grid gap-2">
                <Label>Ícone</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        icon === emoji
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pizza-specific fields */}
            {(categoryType === 'pizzas' || (isEditing && category?.is_pizza_category)) && (
              <>
                {/* Pizza Sizes */}
                <div className="grid gap-2">
                  <Label>Tamanhos de Pizza</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Ex: Grande"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddSize}
                      disabled={!newSize.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {pizzaSizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pizzaSizes.map((size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Adicione os tamanhos disponíveis para as pizzas desta categoria
                  </p>
                </div>

                {/* Pizza Price Calculation Method */}
                <div className="grid gap-2">
                  <Label>Cálculo de Preço (Múltiplos Sabores)</Label>
                  <RadioGroup 
                    value={pizzaPriceMethod} 
                    onValueChange={(value) => setPizzaPriceMethod(value as 'highest' | 'average')}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="highest" id="highest" />
                      <Label htmlFor="highest" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Maior preço</p>
                        <p className="text-xs text-muted-foreground">
                          Cobra o valor do sabor mais caro selecionado
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Média de preços</p>
                        <p className="text-xs text-muted-foreground">
                          Cobra a média dos valores dos sabores selecionados
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
