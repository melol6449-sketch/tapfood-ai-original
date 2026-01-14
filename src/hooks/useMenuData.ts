import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  position: number;
  is_visible: boolean;
  is_promo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuProduct {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  position: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export const useMenuData = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("position"),
        supabase.from("menu_products").select("*").order("position"),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category CRUD
  const createCategory = async (data: { name: string; icon: string }) => {
    try {
      const maxPosition = Math.max(...categories.map((c) => c.position), -1);
      const { data: newCategory, error } = await supabase
        .from("menu_categories")
        .insert({ ...data, position: maxPosition + 1 })
        .select()
        .single();

      if (error) throw error;
      setCategories((prev) => [...prev, newCategory]);
      toast({ title: "Categoria criada com sucesso!" });
      return newCategory;
    } catch (error: any) {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<MenuCategory>) => {
    try {
      const { data: updated, error } = await supabase
        .from("menu_categories")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      toast({ title: "Categoria atualizada!" });
      return updated;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setProducts((prev) => prev.filter((p) => p.category_id !== id));
      toast({ title: "Categoria excluída!" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Product CRUD
  const createProduct = async (data: {
    category_id: string;
    name: string;
    description?: string;
    price: number;
  }) => {
    try {
      const categoryProducts = products.filter(
        (p) => p.category_id === data.category_id
      );
      const maxPosition = Math.max(...categoryProducts.map((p) => p.position), -1);

      const { data: newProduct, error } = await supabase
        .from("menu_products")
        .insert({ ...data, position: maxPosition + 1 })
        .select()
        .single();

      if (error) throw error;
      setProducts((prev) => [...prev, newProduct]);
      toast({ title: "Produto criado com sucesso!" });
      return newProduct;
    } catch (error: any) {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<MenuProduct>) => {
    try {
      const { data: updated, error } = await supabase
        .from("menu_products")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast({ title: "Produto atualizado!" });
      return updated;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Produto excluído!" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Reorder products
  const reorderProducts = async (
    categoryId: string,
    productIds: string[]
  ) => {
    try {
      // Optimistic update
      const updatedProducts = products.map((p) => {
        if (p.category_id === categoryId) {
          const newPosition = productIds.indexOf(p.id);
          return { ...p, position: newPosition };
        }
        return p;
      });
      setProducts(updatedProducts);

      // Update in database
      const updates = productIds.map((id, index) =>
        supabase.from("menu_products").update({ position: index }).eq("id", id)
      );
      await Promise.all(updates);
    } catch (error: any) {
      toast({
        title: "Erro ao reordenar produtos",
        description: error.message,
        variant: "destructive",
      });
      fetchData(); // Rollback on error
    }
  };

  return {
    categories,
    products,
    loading,
    refetch: fetchData,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  };
};
