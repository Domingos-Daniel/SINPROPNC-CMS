-- Add image columns to hero_slides table
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS background_image_url TEXT;

-- Seed hero slides with images (you can replace URLs with your own)
INSERT INTO hero_slides (title, subtitle, button_text, button_link, display_order, is_active) VALUES
('Unidos, somos mais fortes!', 'O SINPROPNC é a voz dos Tripulantes de Cabine da Aviação Civil de Angola.', 'Saber mais', '/sobre-nos', 0, true),
('A sua defesa é nossa missão', 'Representamos e protegemos os direitos de todos os Tripulantes de Cabine.', 'Saber mais', '/sobre-nos', 1, true),
('Juntos somos invencíveis', 'Beneficie de proteção laboral, apoio jurídico e defesa dos seus direitos.', 'Aderir Agora', '/juntar', 2, true);