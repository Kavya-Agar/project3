-- Menu categories, availability flag and an id sequence for new menu items.
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(30) NOT NULL DEFAULT 'Specialty';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE products SET category = CASE
  WHEN name ILIKE '%slush%' THEN 'Slush'
  WHEN name ILIKE '%milk tea%' THEN 'Milk Tea'
  WHEN name ILIKE ANY (ARRAY['%mango%', '%strawberry%', '%passion%', '%lychee%']) THEN 'Fruit Tea'
  WHEN name ILIKE '%tea%' THEN 'Classic Tea'
  ELSE 'Specialty'
END
WHERE category = 'Specialty';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'products_product_id_seq') THEN
    EXECUTE format('CREATE SEQUENCE products_product_id_seq START %s',
                   (SELECT COALESCE(MAX(product_id), 0) + 1 FROM products));
  END IF;
END $$;
