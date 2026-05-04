-- Create hero_slides table for carousel management
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  button_text text DEFAULT 'Saber mais',
  button_link text DEFAULT '/sobre-nos',
  gradient_from text DEFAULT '#0052B4',
  gradient_to text DEFAULT '#003A7A',
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create quick_services table for quick access buttons
CREATE TABLE IF NOT EXISTS quick_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon_name text NOT NULL,
  link text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create competencies table
CREATE TABLE IF NOT EXISTS competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  category text DEFAULT 'other',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create principles table
CREATE TABLE IF NOT EXISTS principles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE principles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read
CREATE POLICY "hero_slides_select_public" ON hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "quick_services_select_public" ON quick_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "competencies_select_public" ON competencies
  FOR SELECT USING (is_active = true);

CREATE POLICY "principles_select_public" ON principles
  FOR SELECT USING (is_active = true);

-- Create admin policies (optional, for later admin panel)
CREATE POLICY "hero_slides_all_admin" ON hero_slides
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "quick_services_all_admin" ON quick_services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "competencies_all_admin" ON competencies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "principles_all_admin" ON principles
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for hero carousel
INSERT INTO hero_slides (title, subtitle, button_text, button_link, display_order) VALUES
  (
    'Unidos, somos mais fortes!',
    'O SINPROPNC é a voz dos Tripulantes de Cabine da Aviação Civil de Angola.',
    'Saber mais',
    '/sobre-nos',
    0
  ),
  (
    'A sua defesa é nossa missão',
    'Representamos e protegemos os direitos de todos os Tripulantes de Cabine.',
    'Saber mais',
    '/sobre-nos',
    1
  ),
  (
    'Juntos somos invencíveis',
    'Beneficie de proteção laboral, apoio jurídico e defesa dos seus direitos.',
    'Aderir Agora',
    '/juntar',
    2
  );

-- Insert sample data for quick services
INSERT INTO quick_services (label, icon_name, link, display_order) VALUES
  ('Jurídico', 'Scale', '/servicos#juridico', 0),
  ('Acordos Colectivos', 'FileText', '/servicos#acordos', 1),
  ('Atendimento', 'Users', '/servicos#atendimento', 2),
  ('Leis e Documentos', 'BookOpen', '/servicos#docs', 3),
  ('Denúncia', 'AlertTriangle', '/contacto#denuncia', 4),
  ('Emergência 24h', 'Phone', 'tel:+244923436908', 5);

-- Insert sample data for principles
INSERT INTO principles (title, description, icon_name, display_order) VALUES
  (
    'Sindicalismo Democrático',
    'Eleição periódica por escrutínio secreto dos órgãos estatutários.',
    'Users',
    0
  ),
  (
    'Estatutos e Regulamentos',
    'Rege-se por estatutos aprovados democraticamente.',
    'Scale',
    1
  ),
  (
    'Defesa dos Interesses',
    'Promove os interesses individuais e colectivos dos associados.',
    'Heart',
    2
  ),
  (
    'Participação Activa',
    'Promove a participação de todos na actividade sindical.',
    'Users2',
    3
  );

-- Insert sample data for competencies (main section)
INSERT INTO competencies (title, description, icon_name, category, display_order) VALUES
  (
    'Negociação Colectiva',
    'Negociar e celebrar Instrumentos de Regulamentação Colectiva de Trabalho.',
    'FileText',
    'main',
    0
  ),
  (
    'Legislação do Trabalho',
    'Participar na elaboração da Legislação do Trabalho.',
    'BookOpen',
    'main',
    1
  ),
  (
    'Fiscalização',
    'Fiscalizar a aplicação das Leis de Trabalho.',
    'Shield',
    'main',
    2
  );

-- Insert sample data for competencies (secondary section)
INSERT INTO competencies (title, description, icon_name, category, display_order) VALUES
  (
    'Unidade Sindical',
    'Defender a unidade e solidariedade entre todos os Associados.',
    'Users2',
    'secondary',
    0
  ),
  (
    'Divulgação',
    'Divulgar princípios e actividades do movimento sindical.',
    'Megaphone',
    'secondary',
    1
  ),
  (
    'Segurança Social',
    'Participar na gestão de instituições de segurança social.',
    'Shield',
    'secondary',
    2
  ),
  (
    'Defesa de Direitos',
    'Promover acções conducentes à conquista das justas reivindicações.',
    'Heart',
    'secondary',
    3
  ),
  (
    'Apoio Jurídico',
    'Prestar apoio e assistência jurídica gratuita aos Associados.',
    'Scale',
    'secondary',
    4
  ),
  (
    'Cooperação Internacional',
    'Filiar-se em organizações sindicais nacionais ou internacionais.',
    'Users',
    'secondary',
    5
  );
