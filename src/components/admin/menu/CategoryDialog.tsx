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
import type { MenuCategory } from "@/hooks/useMenuData";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: MenuCategory | null;
  onSave: (data: { name: string; icon: string }) => Promise<void>;
}

const EMOJI_OPTIONS = ["🍔", "🍕", "🥗", "🍟", "🥤", "🍰", "🍝", "🌮", "🍜", "🍣", "🍿", "🍩"];

export const CategoryDialog = ({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
    } else {
      setName("");
      setIcon("🍽️");
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({ name: name.trim(), icon });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da categoria</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Hambúrgueres"
                autoFocus
              />
            </div>
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
