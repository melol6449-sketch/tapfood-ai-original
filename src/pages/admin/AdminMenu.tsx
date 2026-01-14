import { useState } from "react";
import {
  categories as initialCategories,
  products as initialProducts,
  type Category,
  type Product,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Search,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Settings2,
} from "lucide-react";

const AdminMenu = () => {
  const [categories] = useState<Category[]>(initialCategories);
  const [products] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.map((c) => c.id)
  );

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      products.some(
        (p) =>
          p.categoryId === cat.id &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(
      (p) =>
        p.categoryId === categoryId &&
        (searchTerm === "" ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          Gestor de cardápio
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <select className="h-10 pl-10 pr-4 rounded-l-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Categorias</option>
                <option>Produtos</option>
              </select>
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-l-none border-l-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button>
              <Plus className="w-4 h-4" />
              Nova categoria
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Ações
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver cardápio
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar categoria
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings2 className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredCategories.map((category, index) => {
            const categoryProducts = getProductsByCategory(category.id);
            const isOpen = openCategories.includes(category.id);
            const isPromo = index === 2; // For demo, third category is promo

            return (
              <div
                key={category.id}
                className="bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
              >
                {/* Promo Banner */}
                {isPromo && (
                  <div className="bg-amber-500 text-white text-center py-1 text-sm font-medium">
                    promo
                  </div>
                )}

                {/* Category Header */}
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Drag Handle */}
                    <button className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-5 h-5" />
                    </button>

                    {/* Category Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <h2 className="font-display text-lg font-bold text-foreground">
                          {category.name}
                        </h2>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500 text-white text-xs font-medium rounded">
                        Itens principais
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Ações categoria
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Ocultar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {/* Products List */}
                      {categoryProducts.length > 0 && (
                        <div className="divide-y divide-border">
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              className="p-4 pl-14 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                            >
                              <button className="cursor-grab text-muted-foreground hover:text-foreground">
                                <GripVertical className="w-4 h-4" />
                              </button>

                              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
                                {category.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-foreground">
                                    {product.name}
                                  </h3>
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
                                  <DropdownMenuItem>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
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
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Item Button */}
                      <div className="p-4 pl-14">
                        <button className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
                          <Plus className="w-5 h-5" />
                          Adicionar Item
                        </button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="bg-card rounded-xl p-8 text-center shadow-md">
              <p className="text-muted-foreground">
                Nenhuma categoria encontrada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
