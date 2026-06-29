-- Seed professional defaults only when tables are empty.

insert into public.menu_items (label, href, is_active, display_order)
select * from (values
  ('Início', '/', true, 0),
  ('Sobre Nós', '/sobre-nos', true, 1),
  ('O Que Fazemos', '/o-que-fazemos', true, 2),
  ('A Profissão', '/a-profissao', true, 3),
  ('Serviços', '/servicos', true, 4),
  ('Parceiros', '/parceiros', true, 5),
  ('Notícias', '/noticias', true, 6),
  ('Contacto', '/contacto', true, 7)
) as seed(label, href, is_active, display_order)
where not exists (select 1 from public.menu_items);

insert into public.contact_info (label, value, icon, is_active, display_order)
select * from (values
  ('Telefone', '+244 923 436 908', 'phone', true, 0),
  ('Email', 'sinpropnc@gmail.com', 'mail', true, 1),
  ('Localização', 'Luanda, Angola', 'mapPin', true, 2),
  ('Horário', 'Seg - Sex: 08h - 17h', 'clock', true, 3)
) as seed(label, value, icon, is_active, display_order)
where not exists (select 1 from public.contact_info);

insert into public.hero_slides (title, subtitle, button_text, button_link, display_order, is_active)
select * from (values
  ('Unidos, somos mais fortes!', 'O SINPROPNC é a voz dos Tripulantes de Cabine da Aviação Civil de Angola.', 'Saber mais', '/sobre-nos', 0, true),
  ('A sua defesa é nossa missão', 'Representamos e protegemos os direitos de todos os Tripulantes de Cabine.', 'Conhecer serviços', '/servicos', 1, true),
  ('Juntos somos invencíveis', 'Beneficie de proteção laboral, apoio jurídico e defesa dos seus direitos.', 'Aderir Agora', '/juntar', 2, true)
) as seed(title, subtitle, button_text, button_link, display_order, is_active)
where not exists (select 1 from public.hero_slides);

insert into public.quick_services (label, icon_name, link, display_order, is_active)
select * from (values
  ('Jurídico', 'Scale', '/servicos#juridico', 0, true),
  ('Acordos Colectivos', 'FileText', '/servicos#acordos', 1, true),
  ('Atendimento', 'Users', '/servicos#atendimento', 2, true),
  ('Leis e Documentos', 'BookOpen', '/servicos#docs', 3, true),
  ('Denúncia', 'AlertTriangle', '/contacto#denuncia', 4, true),
  ('Emergência 24h', 'Phone', 'tel:+244923436908', 5, true)
) as seed(label, icon_name, link, display_order, is_active)
where not exists (select 1 from public.quick_services);

insert into public.principles (title, description, icon_name, display_order, is_active)
select * from (values
  ('Sindicalismo Democrático', 'Eleição periódica por escrutínio secreto dos órgãos estatutários.', 'Users', 0, true),
  ('Estatutos e Regulamentos', 'Rege-se por estatutos aprovados democraticamente.', 'Scale', 1, true),
  ('Defesa dos Interesses', 'Promove os interesses individuais e colectivos dos associados.', 'Heart', 2, true),
  ('Participação Activa', 'Promove a participação de todos na actividade sindical.', 'Users2', 3, true)
) as seed(title, description, icon_name, display_order, is_active)
where not exists (select 1 from public.principles);

insert into public.competencies (title, description, icon_name, category, display_order, is_active)
select * from (values
  ('Negociação Colectiva', 'Negociar e celebrar Instrumentos de Regulamentação Colectiva de Trabalho.', 'FileText', 'main', 0, true),
  ('Legislação do Trabalho', 'Participar na elaboração da Legislação do Trabalho.', 'BookOpen', 'main', 1, true),
  ('Fiscalização', 'Fiscalizar a aplicação das Leis de Trabalho.', 'Shield', 'main', 2, true),
  ('Unidade Sindical', 'Defender a unidade e solidariedade entre todos os Associados.', 'Users2', 'secondary', 3, true),
  ('Divulgação', 'Divulgar princípios e actividades do movimento sindical.', 'Megaphone', 'secondary', 4, true),
  ('Segurança Social', 'Participar na gestão de instituições de segurança social.', 'Shield', 'secondary', 5, true),
  ('Defesa de Direitos', 'Promover acções conducentes à conquista das justas reivindicações.', 'Heart', 'secondary', 6, true),
  ('Apoio Jurídico', 'Prestar apoio e assistência jurídica gratuita aos Associados.', 'Scale', 'secondary', 7, true),
  ('Cooperação Internacional', 'Filiar-se em organizações sindicais nacionais ou internacionais.', 'Users', 'secondary', 8, true)
) as seed(title, description, icon_name, category, display_order, is_active)
where not exists (select 1 from public.competencies);

insert into public.faqs (question, answer, is_active, display_order)
select * from (values
  ('Como me filio ao SINPROPNC?', 'Contacte-nos através do email ou telefone para mais informações sobre o processo de filiação e seus benefícios.', true, 0),
  ('Qual é o horário de atendimento?', 'Atendimento de segunda a sexta, das 08h às 17h. Emergência disponível 24h para associados.', true, 1),
  ('Como acesso minha área de associado?', 'Use o botão "ÁREA DO ASSOCIADO" no topo da página para aceder aos seus dados, documentos e benefícios.', true, 2),
  ('Como faço uma denúncia anónima?', 'Contacte-nos confidencialmente através do email ou ligue para o número de emergência 24h.', true, 3)
) as seed(question, answer, is_active, display_order)
where not exists (select 1 from public.faqs);

insert into public.pages (slug, title, description, is_published, status, published_at, display_order)
select slug, title, description, true, 'published', now(), display_order
from (values
  ('sobre-nos', 'Sobre Nós', 'Conheça a história, missão e princípios do SINPROPNC.', 1),
  ('o-que-fazemos', 'O Que Fazemos', 'Defesa, representação e apoio aos Tripulantes de Cabine.', 2),
  ('a-profissao', 'A Profissão', 'Informação sobre a actividade de Tripulante de Cabine.', 3),
  ('servicos', 'Serviços', 'Apoio jurídico, atendimento e serviços aos associados.', 4),
  ('parceiros', 'Parceiros', 'Entidades e relações institucionais do SINPROPNC.', 5),
  ('juntar', 'Junte-se a Nós', 'Saiba como tornar-se associado do SINPROPNC.', 6),
  ('area-associado', 'Área do Associado', 'Espaço dedicado aos associados do SINPROPNC.', 7)
) as seed(slug, title, description, display_order)
where not exists (select 1 from public.pages where pages.slug = seed.slug);

insert into public.sections (page_id, section_type, display_order, content, is_active)
select p.id, 'text', 0, jsonb_build_object(
  'title', p.title,
  'content', case p.slug
    when 'sobre-nos' then 'O SINPROPNC representa e defende os Tripulantes de Cabine da Aviação Civil de Angola, promovendo a valorização profissional, a protecção laboral e a participação activa dos associados.'
    when 'o-que-fazemos' then 'Actuamos na negociação colectiva, apoio jurídico, defesa de direitos, fiscalização do cumprimento laboral e acompanhamento institucional dos associados.'
    when 'a-profissao' then 'A profissão de Tripulante de Cabine exige responsabilidade, disciplina, formação contínua e compromisso com a segurança e o bem-estar dos passageiros.'
    when 'servicos' then 'Disponibilizamos apoio jurídico, atendimento, orientação documental, acompanhamento sindical e canais de emergência para associados.'
    when 'parceiros' then 'Trabalhamos com entidades institucionais e parceiros estratégicos para fortalecer a defesa e valorização dos nossos associados.'
    when 'juntar' then 'Entre em contacto connosco para conhecer as condições de filiação e os benefícios de ser associado do SINPROPNC.'
    else 'Área reservada para conteúdos e serviços destinados aos associados.'
  end
), true
from public.pages p
where not exists (select 1 from public.sections s where s.page_id = p.id);
