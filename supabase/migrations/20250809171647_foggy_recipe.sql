/*
  # Seed Initial Data for Cozumel Mobile Marketplace

  1. Categories
    - Create business categories hierarchy
    - Add Cozumel-specific categories

  2. Sample Data
    - Create admin user
    - Add sample businesses for testing
    - Create initial guides

  3. Configuration
    - Set up default feature locks
    - Configure initial settings
*/

-- Insert business categories
INSERT INTO categories (name, slug, description, icon, color, order_index, active) VALUES
('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1, true),
('Bares y Vida Nocturna', 'bars', 'Bares, cantinas y entretenimiento nocturno', '🍻', '#8b5cf6', 2, true),
('Actividades', 'activities', 'Tours, buceo y actividades recreativas', '🏊‍♂️', '#06b6d4', 3, true),
('Compras', 'shopping', 'Tiendas, souvenirs y artesanías', '🛍️', '#ec4899', 4, true),
('Servicios', 'services', 'Servicios profesionales y personales', '🔧', '#10b981', 5, true),
('Hoteles y Hospedaje', 'accommodation', 'Hoteles, resorts y alojamiento', '🏨', '#3b82f6', 6, true),
('Transporte', 'transportation', 'Taxis, rentadoras y transporte', '🚗', '#f97316', 7, true),
('Salud y Belleza', 'health', 'Spas, salones y servicios de salud', '💆‍♀️', '#84cc16', 8, true),
('Eventos', 'events', 'Eventos especiales y celebraciones', '🎉', '#ef4444', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for restaurants
INSERT INTO categories (name, slug, description, parent_id, order_index, active) VALUES
('Comida Mexicana', 'mexican-food', 'Restaurantes de comida tradicional mexicana', 
  (SELECT id FROM categories WHERE slug = 'restaurants'), 1, true),
('Mariscos', 'seafood', 'Restaurantes especializados en mariscos', 
  (SELECT id FROM categories WHERE slug = 'restaurants'), 2, true),
('Internacional', 'international', 'Cocina internacional y fusión', 
  (SELECT id FROM categories WHERE slug = 'restaurants'), 3, true),
('Comida Rápida', 'fast-food', 'Comida rápida y casual', 
  (SELECT id FROM categories WHERE slug = 'restaurants'), 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for activities
INSERT INTO categories (name, slug, description, parent_id, order_index, active) VALUES
('Buceo', 'diving', 'Buceo y snorkel', 
  (SELECT id FROM categories WHERE slug = 'activities'), 1, true),
('Tours', 'tours', 'Tours guiados y excursiones', 
  (SELECT id FROM categories WHERE slug = 'activities'), 2, true),
('Deportes Acuáticos', 'water-sports', 'Deportes y actividades acuáticas', 
  (SELECT id FROM categories WHERE slug = 'activities'), 3, true),
('Pesca', 'fishing', 'Pesca deportiva y tours de pesca', 
  (SELECT id FROM categories WHERE slug = 'activities'), 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Create sample admin user (this would typically be done through Supabase Auth)
-- Note: In production, admin users should be created through proper authentication flow
INSERT INTO users (id, email, role, locale) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@cozumel-marketplace.com', 'ADMIN', 'es')
ON CONFLICT (email) DO NOTHING;

-- Insert sample travel guides
INSERT INTO guides (title, slug, description, content, category, featured, published, tags) VALUES
(
  'Guía Completa de Cozumel',
  'guia-completa-cozumel',
  'Todo lo que necesitas saber para visitar Cozumel',
  '{"sections": [{"title": "Bienvenido a Cozumel", "content": "Cozumel es una isla paradisíaca..."}]}',
  'general',
  true,
  true,
  ARRAY['cozumel', 'guia', 'turismo', 'mexico']
),
(
  'Mejores Restaurantes de Cozumel',
  'mejores-restaurantes-cozumel',
  'Descubre los restaurantes más auténticos de la isla',
  '{"sections": [{"title": "Comida Local", "content": "La gastronomía de Cozumel..."}]}',
  'restaurants',
  true,
  true,
  ARRAY['restaurantes', 'comida', 'gastronomia', 'local']
),
(
  'Actividades de Buceo en Cozumel',
  'buceo-cozumel',
  'Los mejores sitios de buceo y operadores certificados',
  '{"sections": [{"title": "Arrecifes de Cozumel", "content": "Los arrecifes de coral..."}]}',
  'activities',
  true,
  true,
  ARRAY['buceo', 'snorkel', 'arrecife', 'actividades']
)
ON CONFLICT (slug) DO NOTHING;