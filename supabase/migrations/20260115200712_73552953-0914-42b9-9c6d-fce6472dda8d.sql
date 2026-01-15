-- Add pizza-specific fields to menu_categories
ALTER TABLE public.menu_categories 
ADD COLUMN is_pizza_category BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN pizza_sizes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN pizza_price_method TEXT DEFAULT 'highest';