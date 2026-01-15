-- Fix 1: Secure the logos storage bucket - restrict write access to admins only

-- Drop permissive policies for logos bucket
DROP POLICY IF EXISTS "Anyone can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete logos" ON storage.objects;

-- Create admin-only policies for logos bucket
CREATE POLICY "Admins can upload logos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update logos" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete logos" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);