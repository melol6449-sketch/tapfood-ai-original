import type { MenuProduct } from "@/hooks/useCustomerMenu";

interface ProductCardProps {
  product: MenuProduct;
  categoryIcon?: string;
}

export function ProductCard({ product, categoryIcon }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up group">
      <div className="relative h-40 bg-secondary overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-secondary to-muted">
            {categoryIcon || "🍔"}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              Indisponível
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-bold text-foreground text-lg mb-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
