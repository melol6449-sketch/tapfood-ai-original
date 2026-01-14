import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RestaurantSettings {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  is_open: boolean;
  opening_hours: Record<string, { open: string; close: string } | null>;
  payment_methods: string[];
  pizza_price_method: 'highest' | 'average';
  pix_key: string | null;
  pix_key_type: string | null;
  created_at: string;
  updated_at: string;
}

export const useRestaurantSettings = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      setSettings({
        ...data,
        opening_hours: data.opening_hours as Record<string, { open: string; close: string } | null>,
        pizza_price_method: (data.pizza_price_method || 'highest') as 'highest' | 'average',
      } as RestaurantSettings);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (data: Partial<RestaurantSettings>) => {
    if (!settings) return;

    try {
      const { data: updated, error } = await supabase
        .from("restaurant_settings")
        .update(data)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings({
        ...updated,
        opening_hours: updated.opening_hours as Record<string, { open: string; close: string } | null>,
        pizza_price_method: (updated.pizza_price_method || 'highest') as 'highest' | 'average',
      } as RestaurantSettings);
      toast({ title: "Configurações salvas!" });
      return updated;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    settings,
    loading,
    refetch: fetchSettings,
    updateSettings,
  };
};
