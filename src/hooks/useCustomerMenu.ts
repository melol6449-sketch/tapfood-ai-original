import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  position: number;
  is_visible: boolean;
  is_pizza_category: boolean;
  pizza_sizes: string[];
  pizza_price_method: 'highest' | 'average';
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
  is_pizza_flavor: boolean;
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

      setCategories((categoriesRes.data || []).map((c: any) => ({
        ...c,
        pizza_sizes: Array.isArray(c.pizza_sizes) ? c.pizza_sizes : [],
        pizza_price_method: c.pizza_price_method || 'highest',
      })));
      setProducts(productsRes.data || []);
    } catch {
      // Error fetching menu data - silent fail
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
