-- Create menu_categories table
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🍽️',
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_promo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_products table
CREATE TABLE public.menu_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_products ENABLE ROW LEVEL SECURITY;

-- Public read policies for menu display
CREATE POLICY "Anyone can view categories" 
ON public.menu_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view products" 
ON public.menu_products 
FOR SELECT 
USING (true);

-- Public write policies (temporarily, should be admin-only later)
CREATE POLICY "Anyone can create categories" 
ON public.menu_categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update categories" 
ON public.menu_categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete categories" 
ON public.menu_categories 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can create products" 
ON public.menu_products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update products" 
ON public.menu_products 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete products" 
ON public.menu_products 
FOR DELETE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_menu_products_category ON public.menu_products(category_id);
CREATE INDEX idx_menu_categories_position ON public.menu_categories(position);
CREATE INDEX idx_menu_products_position ON public.menu_products(position);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_products_updated_at
BEFORE UPDATE ON public.menu_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();