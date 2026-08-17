CREATE POLICY "authenticated read books bucket" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'books');
CREATE POLICY "admin insert books bucket" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin update books bucket" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin delete books bucket" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));