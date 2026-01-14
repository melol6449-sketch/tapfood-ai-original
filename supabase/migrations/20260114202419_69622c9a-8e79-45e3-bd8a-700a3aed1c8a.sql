-- Add pizza-related fields to menu_products
ALTER TABLE public.menu_products 
ADD COLUMN is_pizza_flavor BOOLEAN NOT NULL DEFAULT false;

-- Add pizza price calculation method to restaurant_settings
ALTER TABLE public.restaurant_settings 
ADD COLUMN pizza_price_method TEXT NOT NULL DEFAULT 'highest';