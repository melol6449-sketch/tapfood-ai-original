import type { MenuCategory } from "@/hooks/useCustomerMenu";

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  loading?: boolean;
}

export function CategoryNav({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  loading 
}: CategoryNavProps) {
  if (loading) {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-border">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onCategoryChange("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-primary"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <span>🍽️</span>
          <span>Todos</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground shadow-primary"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
