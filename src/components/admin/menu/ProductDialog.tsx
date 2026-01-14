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
import { Textarea } from "@/components/ui/textarea";
import type { MenuProduct } from "@/hooks/useMenuData";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: MenuProduct | null;
  categoryId: string;
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    category_id: string;
  }) => Promise<void>;
}

export const ProductDialog = ({
  open,
  onOpenChange,
  product,
  categoryId,
  onSave,
}: ProductDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        category_id: categoryId,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setPrice(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product-name">Nome do produto</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: X-Burger Especial"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os ingredientes e detalhes do produto..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => formatCurrency(e.target.value)}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
              />
            </div>
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
