-- Create storage bucket for restaurant logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true);

-- Create policies for logo uploads
CREATE POLICY "Logo images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Anyone can upload logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Anyone can update logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos');

CREATE POLICY "Anyone can delete logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos');