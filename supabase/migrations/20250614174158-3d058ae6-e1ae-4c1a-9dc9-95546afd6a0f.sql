
-- Créer un bucket pour stocker le fichier JSON du dictionnaire
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dictionary', 'dictionary', true);

-- Créer une politique pour permettre la lecture publique des fichiers
CREATE POLICY "Public read access for dictionary files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'dictionary');

-- Créer une politique pour permettre l'upload de fichiers (pour l'admin)
CREATE POLICY "Admin can upload dictionary files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'dictionary');
