export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      menu_categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_pizza_category: boolean
          is_promo: boolean
          is_visible: boolean
          name: string
          pizza_price_method: string | null
          pizza_sizes: Json | null
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          is_pizza_category?: boolean
          is_promo?: boolean
          is_visible?: boolean
          name: string
          pizza_price_method?: string | null
          pizza_sizes?: Json | null
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_pizza_category?: boolean
          is_promo?: boolean
          is_visible?: boolean
          name?: string
          pizza_price_method?: string | null
          pizza_sizes?: Json | null
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_products: {
        Row: {
          available: boolean
          category_id: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_pizza_flavor: boolean
          name: string
          position: number
          price: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_pizza_flavor?: boolean
          name: string
          position?: number
          price?: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_pizza_flavor?: boolean
          name?: string
          position?: number
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          payment_method: string
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id?: string
          items?: Json
          payment_method: string
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          payment_method?: string
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_settings: {
        Row: {
          address: string | null
          base_address_lat: number | null
          base_address_lng: number | null
          created_at: string
          delivery_zones: Json
          id: string
          is_open: boolean
          logo: string | null
          name: string
          opening_hours: Json
          payment_methods: string[]
          phone: string | null
          pix_key: string | null
          pix_key_type: string | null
          pizza_price_method: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          base_address_lat?: number | null
          base_address_lng?: number | null
          created_at?: string
          delivery_zones?: Json
          id?: string
          is_open?: boolean
          logo?: string | null
          name?: string
          opening_hours?: Json
          payment_methods?: string[]
          phone?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          pizza_price_method?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          base_address_lat?: number | null
          base_address_lng?: number | null
          created_at?: string
          delivery_zones?: Json
          id?: string
          is_open?: boolean
          logo?: string | null
          name?: string
          opening_hours?: Json
          payment_methods?: string[]
          phone?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          pizza_price_method?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
