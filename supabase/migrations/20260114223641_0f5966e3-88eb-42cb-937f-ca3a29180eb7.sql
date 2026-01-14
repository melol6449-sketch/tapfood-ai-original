-- Enable Supabase Realtime for orders table (required for postgres_changes subscriptions)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN
    -- table already in publication
    NULL;
END $$;