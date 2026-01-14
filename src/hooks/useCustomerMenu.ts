import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  position: number;
  is_visible: boolean;
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
}

export const useCustomerMenu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoriesRes, productsRes] = await Promise.all([
        supabase
          .from("menu_categories")
          .select("*")
          .eq("is_visible", true)
          .order("position"),
        supabase
          .from("menu_products")
          .select("*")
          .eq("available", true)
          .order("position"),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    categories,
    products,
    loading,
    refetch: fetchData,
  };
};
