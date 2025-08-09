/*
  # Seed Categories and Initial Data

  1. Categories
    - Main business categories for Cozumel
    - Subcategories for detailed classification

  2. Initial Setup
    - Essential categories for marketplace
    - Proper hierarchy structure
*/

-- Insert main categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1),
('Actividades', 'activities', 'Tours, buceo y actividades acuáticas', '🏊‍♂️', '#06b6d4', 2),
('Bares y Vida Nocturna', 'bars-nightlife', 'Bares, discotecas y entretenimiento nocturno', '🍹', '#8b5cf6', 3),
('Compras', 'shopping', 'Tiendas, souvenirs y artesanías', '🛍️', '#ec4899', 4),
('Hoteles y Hospedaje', 'accommodation', 'Hoteles, resorts y alojamiento', '🏨', '#10b981', 5),
('Transporte', 'transportation', 'Taxis, tours y servicios de transporte', '🚗', '#f97316', 6),
('Servicios', 'services', 'Servicios profesionales y personales', '⚙️', '#6b7280', 7),
('Salud y Belleza', 'health-beauty', 'Spas, salones y servicios de bienestar', '💆‍♀️', '#f472b6', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert restaurant subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index)
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  main.id,
  subcategory.order_index
FROM (VALUES
  ('Comida Mexicana', 'mexican-food', 'Cocina tradicional mexicana', 1),
  ('Mariscos', 'seafood', 'Restaurantes de mariscos frescos', 2),
  ('Comida Internacional', 'international-food', 'Cocina internacional', 3),
  ('Comida Rápida', 'fast-food', 'Comida rápida y casual', 4),
  ('Cafeterías', 'cafes', 'Cafés y panaderías', 5)
) AS subcategory(name, slug, description, order_index)
JOIN categories main ON main.slug = 'restaurants'
ON CONFLICT (slug) DO NOTHING;

-- Insert activity subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index)
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  main.id,
  subcategory.order_index
FROM (VALUES
  ('Buceo', 'diving', 'Buceo y snorkel', 1),
  ('Tours en Barco', 'boat-tours', 'Excursiones marítimas', 2),
  ('Pesca Deportiva', 'fishing', 'Pesca deportiva y tours', 3),
  ('Parques Temáticos', 'theme-parks', 'Parques y atracciones', 4),
  ('Deportes Acuáticos', 'water-sports', 'Kayak, paddleboard, etc.', 5)
) AS subcategory(name, slug, description, order_index)
JOIN categories main ON main.slug = 'activities'
ON CONFLICT (slug) DO NOTHING;