-- Add PIX key column to restaurant_settings
ALTER TABLE public.restaurant_settings 
ADD COLUMN IF NOT EXISTS pix_key text NULL;

-- Add PIX key type column (cpf, cnpj, email, phone, random)
ALTER TABLE public.restaurant_settings 
ADD COLUMN IF NOT EXISTS pix_key_type text NULL DEFAULT 'random';