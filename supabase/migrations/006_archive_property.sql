-- Add archivada column and date fields to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS archivada BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fecha_alta TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fecha_archivada TIMESTAMPTZ;

-- Backfill fecha_alta with created_at for existing properties
UPDATE properties SET fecha_alta = created_at WHERE fecha_alta = created_at;

-- Index for filtering archived properties
CREATE INDEX IF NOT EXISTS idx_properties_archivada ON properties(archivada);

-- Update RLS policies if they exist (Supabase environments)
DO $$
BEGIN
  -- Drop and recreate public read policy for properties
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'properties' AND policyname = 'Public can read active properties'
  ) THEN
    DROP POLICY "Public can read active properties" ON properties;
    CREATE POLICY "Public can read active properties" ON properties
      FOR SELECT USING (activa = true AND archivada = false);
  END IF;

  -- Drop and recreate public read policy for property_images
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'property_images' AND policyname = 'Public can read property images'
  ) THEN
    DROP POLICY "Public can read property images" ON property_images;
    CREATE POLICY "Public can read property images" ON property_images
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM properties
          WHERE properties.id = property_images.property_id
          AND properties.activa = true
          AND properties.archivada = false
        )
      );
  END IF;
END $$;
