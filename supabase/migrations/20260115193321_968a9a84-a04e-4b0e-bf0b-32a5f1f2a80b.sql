-- Fix 1: Restrict menu_products write operations to admins only
DROP POLICY IF EXISTS "Anyone can create products" ON menu_products;
DROP POLICY IF EXISTS "Anyone can update products" ON menu_products;
DROP POLICY IF EXISTS "Anyone can delete products" ON menu_products;

CREATE POLICY "Admins can manage products" 
ON menu_products FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Protect customer order data - restrict SELECT and UPDATE to admins
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;

CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Keep: "Anyone can create orders" for customers to place orders