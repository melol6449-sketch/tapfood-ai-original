-- Create restaurant_settings table (singleton - one row only)
CREATE TABLE public.restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Minha Lanchonete',
  logo TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  is_open BOOLEAN NOT NULL DEFAULT true,
  opening_hours JSONB NOT NULL DEFAULT '{
    "Segunda": {"open": "18:00", "close": "23:00"},
    "Terça": {"open": "18:00", "close": "23:00"},
    "Quarta": {"open": "18:00", "close": "23:00"},
    "Quinta": {"open": "18:00", "close": "23:00"},
    "Sexta": {"open": "18:00", "close": "00:00"},
    "Sábado": {"open": "18:00", "close": "00:00"},
    "Domingo": {"open": "18:00", "close": "22:00"}
  }'::jsonb,
  payment_methods TEXT[] NOT NULL DEFAULT ARRAY['Dinheiro', 'Pix', 'Cartão'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can view restaurant settings" 
ON public.restaurant_settings 
FOR SELECT 
USING (true);

-- Public write policies (temporarily, should be admin-only later)
CREATE POLICY "Anyone can update restaurant settings" 
ON public.restaurant_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert restaurant settings" 
ON public.restaurant_settings 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurant_settings_updated_at
BEFORE UPDATE ON public.restaurant_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (name, address, phone, whatsapp)
VALUES ('Burger House', 'Rua das Delícias, 123 - Centro', '(11) 99999-9999', '5511999999999');