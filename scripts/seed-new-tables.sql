-- Seed data for contact_info
INSERT INTO contact_info (label, value, icon, is_active, display_order) VALUES
('Telefone', '+244 923 436 908', 'phone', true, 0),
('Email', 'sinpropnc@gmail.com', 'mail', true, 1),
('Localização', 'Luanda, Angola', 'mapPin', true, 2),
('Horário', 'Seg - Sex: 08h - 17h', 'clock', true, 3);

-- Seed data for menu_items
INSERT INTO menu_items (label, href, is_active, display_order) VALUES
('Início', '/', true, 0),
('Sobre Nós', '/sobre-nos', true, 1),
('O Que Fazemos', '/o-que-fazemos', true, 2),
('A Profissão', '/a-profissao', true, 3),
('Serviços', '/servicos', true, 4),
('Parceiros', '/parceiros', true, 5),
('Notícias', '/noticias', true, 6),
('Contacto', '/contacto', true, 7);

-- Seed data for faqs
INSERT INTO faqs (question, answer, is_active, display_order) VALUES
('Como me filio ao SINPROPNC?', 'Contacte-nos através do email ou telefone para mais informações sobre o processo de filiação e seus benefícios.', true, 0),
('Qual é o horário de atendimento?', 'Atendimento de segunda a sexta, das 08h às 17h. Emergência disponível 24h para associados.', true, 1),
('Como acesso minha área de associado?', 'Use o botão "ÁREA DO ASSOCIADO" no topo da página para aceder aos seus dados, documentos e benefícios.', true, 2),
('Como faço uma denúncia anónima?', 'Contacte-nos confidencialmente através do email ou ligue para o número de emergência 24h.', true, 3);