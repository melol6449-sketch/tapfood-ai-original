import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GripVertical,
  Pencil,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import type { MenuProduct } from "@/hooks/useMenuData";

interface SortableProductItemProps {
  product: MenuProduct;
  categoryIcon: string;
  onEdit: () => void;
  onToggleAvailable: () => void;
  onDelete: () => void;
}

export const SortableProductItem = ({
  product,
  categoryIcon,
  onEdit,
  onToggleAvailable,
  onDelete,
}: SortableProductItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 pl-14 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
        isDragging ? "opacity-50 bg-muted" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
        {categoryIcon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{product.name}</h3>
          {!product.available && (
            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-medium rounded">
              Indisponível
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
      </div>

      <span className="font-bold text-primary shrink-0">
        {formatPrice(product.price)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleAvailable}>
            {product.available ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Pausar vendas
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ativar vendas
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
