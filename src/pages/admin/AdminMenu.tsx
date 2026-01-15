import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMenuData, type MenuCategory, type MenuProduct } from "@/hooks/useMenuData";
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
  EyeOff,
  Eye,
  Settings2,
  Loader2,
} from "lucide-react";
import { CategoryDialog } from "@/components/admin/menu/CategoryDialog";
import { ProductDialog } from "@/components/admin/menu/ProductDialog";
import { SortableProductItem } from "@/components/admin/menu/SortableProductItem";
import { DeleteConfirmDialog } from "@/components/admin/menu/DeleteConfirmDialog";

const AdminMenu = () => {
  const {
    categories,
    products,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  } = useMenuData();

  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  
  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "category" | "product";
    id: string;
    name: string;
  } | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize open categories
  useEffect(() => {
    if (categories.length > 0 && openCategories.length === 0) {
      setOpenCategories(categories.map((c) => c.id));
    }
  }, [categories, openCategories.length]);
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
          p.category_id === cat.id &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getProductsByCategory = (categoryId: string) => {
    return products
      .filter(
        (p) =>
          p.category_id === categoryId &&
          (searchTerm === "" ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => a.position - b.position);
  };

  // Category handlers
  const handleNewCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async (data: { name: string; icon: string }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
  };

  const handleDeleteCategory = (category: MenuCategory) => {
    setItemToDelete({
      type: "category",
      id: category.id,
      name: category.name,
    });
    setDeleteDialogOpen(true);
  };

  // Product handlers
  const handleNewProduct = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  const handleEditProduct = (product: MenuProduct, categoryName: string) => {
    setSelectedCategoryId(product.category_id);
    setSelectedCategoryName(categoryName);
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async (data: {
    name: string;
    description: string;
    price: number;
    category_id: string;
    is_pizza_flavor?: boolean;
  }) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
  };

  const handleDeleteProduct = (product: MenuProduct) => {
    setItemToDelete({
      type: "product",
      id: product.id,
      name: product.name,
    });
    setDeleteDialogOpen(true);
  };

  const handleToggleAvailable = async (product: MenuProduct) => {
    await updateProduct(product.id, { available: !product.available });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "category") {
      await deleteCategory(itemToDelete.id);
    } else {
      await deleteProduct(itemToDelete.id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const categoryProducts = getProductsByCategory(categoryId);
      const oldIndex = categoryProducts.findIndex((p) => p.id === active.id);
      const newIndex = categoryProducts.findIndex((p) => p.id === over.id);
      
      const newOrder = arrayMove(categoryProducts, oldIndex, newIndex);
      reorderProducts(categoryId, newOrder.map((p) => p.id));
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <Input
                placeholder="Pesquisar categorias ou produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleNewCategory}>
              <Plus className="w-4 h-4 mr-2" />
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
          {filteredCategories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);
            const isOpen = openCategories.includes(category.id);

            return (
              <div
                key={category.id}
                className="bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
              >
                {/* Promo Banner */}
                {category.is_promo && (
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
                        <span className="text-sm text-muted-foreground">
                          ({categoryProducts.length} itens)
                        </span>
                      </div>
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
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Ocultar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCategory(category)}
                            className="text-destructive"
                          >
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
                      {/* Products List with DnD */}
                      {categoryProducts.length > 0 && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, category.id)}
                        >
                          <SortableContext
                            items={categoryProducts.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="divide-y divide-border">
                                {categoryProducts.map((product) => (
                                  <SortableProductItem
                                    key={product.id}
                                    product={product}
                                    categoryIcon={category.icon}
                                    onEdit={() => handleEditProduct(product, category.name)}
                                    onToggleAvailable={() => handleToggleAvailable(product)}
                                    onDelete={() => handleDeleteProduct(product)}
                                  />
                                ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}

                      {/* Add Item Button */}
                      <div className="p-4 pl-14">
                        <button
                          onClick={() => handleNewProduct(category.id, category.name)}
                          className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                        >
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
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Nenhuma categoria encontrada."
                  : "Nenhuma categoria criada ainda."}
              </p>
              {!searchTerm && (
                <Button onClick={handleNewCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira categoria
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={editingProduct}
        categoryId={selectedCategoryId}
        categoryName={selectedCategoryName}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Excluir ${itemToDelete?.type === "category" ? "categoria" : "produto"}`}
        description={
          itemToDelete?.type === "category"
            ? `Tem certeza que deseja excluir a categoria "${itemToDelete?.name}"? Todos os produtos dentro dela também serão excluídos.`
            : `Tem certeza que deseja excluir o produto "${itemToDelete?.name}"?`
        }
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminMenu;
