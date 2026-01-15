-- Remove produtos duplicados, mantendo apenas o mais recente de cada nome+categoria
DELETE FROM menu_products
WHERE id NOT IN (
  SELECT DISTINCT ON (category_id, LOWER(TRIM(name))) id
  FROM menu_products
  ORDER BY category_id, LOWER(TRIM(name)), updated_at DESC
);