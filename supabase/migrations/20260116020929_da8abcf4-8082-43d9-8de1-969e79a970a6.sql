-- Add delivery settings to restaurant_settings
ALTER TABLE public.restaurant_settings 
ADD COLUMN IF NOT EXISTS base_address_lat NUMERIC,
ADD COLUMN IF NOT EXISTS base_address_lng NUMERIC,
ADD COLUMN IF NOT EXISTS delivery_zones JSONB NOT NULL DEFAULT '[]'::jsonb;

-- delivery_zones format: [{ "max_distance_km": 3, "fee": 5.00 }, { "max_distance_km": 6, "fee": 8.00 }]

COMMENT ON COLUMN public.restaurant_settings.base_address_lat IS 'Latitude do endereço base da lanchonete para cálculo de distância';
COMMENT ON COLUMN public.restaurant_settings.base_address_lng IS 'Longitude do endereço base da lanchonete para cálculo de distância';
COMMENT ON COLUMN public.restaurant_settings.delivery_zones IS 'Faixas de entrega com distância máxima em km e valor da taxa';