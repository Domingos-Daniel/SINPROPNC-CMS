export type SectionItem = {
  title: string
  description?: string
  icon?: string
  value?: string
  link?: string
}

export type SectionContent = {
  eyebrow?: string
  title?: string
  subtitle?: string
  content?: string
  image_url?: string
  image_alt?: string
  button_text?: string
  button_link?: string
  secondary_button_text?: string
  secondary_button_link?: string
  alignment?: 'left' | 'center'
  variant?: 'light' | 'dark' | 'brand'
  items?: SectionItem[]
}

export type SectionLayout = {
  id: string
  name: string
  description: string
  category: 'Conteúdo' | 'Institucional' | 'Conversão' | 'Dados'
  itemLabel?: string
  supportsItems?: boolean
  defaultContent: SectionContent
}

export const SECTION_LAYOUTS: SectionLayout[] = [
  {
    id: 'editorial_text',
    name: 'Texto Editorial',
    description: 'Bloco elegante para texto institucional, manifesto, história ou informação detalhada.',
    category: 'Conteúdo',
    defaultContent: {
      eyebrow: 'Institucional',
      title: 'Título da secção',
      subtitle: 'Subtítulo curto para contextualizar a leitura.',
      content: 'Escreva aqui o conteúdo principal da secção. Este layout é ideal para textos institucionais, explicações e conteúdo editorial.',
      alignment: 'left',
      variant: 'light',
    },
  },
  {
    id: 'split_feature',
    name: 'Imagem + Texto',
    description: 'Secção com imagem forte e texto de apoio para destacar uma mensagem principal.',
    category: 'Conteúdo',
    defaultContent: {
      eyebrow: 'Destaque',
      title: 'Mensagem em destaque',
      subtitle: 'Explique a ideia central com clareza.',
      content: 'Use este layout para explicar um serviço, uma iniciativa ou uma área estratégica com apoio visual.',
      image_url: '',
      image_alt: '',
      button_text: 'Saber mais',
      button_link: '/contacto',
      variant: 'light',
    },
  },
  {
    id: 'card_grid',
    name: 'Grelha de Cards',
    description: 'Cards profissionais com ícones para serviços, benefícios, áreas ou valores.',
    category: 'Institucional',
    supportsItems: true,
    itemLabel: 'Card',
    defaultContent: {
      eyebrow: 'Áreas',
      title: 'O que oferecemos',
      subtitle: 'Organize informação em blocos fáceis de consultar.',
      items: [
        { title: 'Apoio Jurídico', description: 'Orientação e acompanhamento aos associados.', icon: 'Scale' },
        { title: 'Atendimento', description: 'Canais de suporte e informação sindical.', icon: 'Users' },
        { title: 'Documentos', description: 'Acesso a legislação, acordos e comunicados.', icon: 'FileText' },
      ],
    },
  },
  {
    id: 'stats_band',
    name: 'Indicadores',
    description: 'Faixa de números, métricas ou destaques com impacto visual.',
    category: 'Dados',
    supportsItems: true,
    itemLabel: 'Indicador',
    defaultContent: {
      eyebrow: 'Impacto',
      title: 'Resultados que importam',
      subtitle: 'Use indicadores para reforçar confiança e escala institucional.',
      variant: 'brand',
      items: [
        { value: '24h', title: 'Emergência', description: 'Canal de apoio prioritário.' },
        { value: '+100', title: 'Associados', description: 'Comunidade representada.' },
        { value: '100%', title: 'Defesa', description: 'Compromisso institucional.' },
      ],
    },
  },
  {
    id: 'process_steps',
    name: 'Passos / Processo',
    description: 'Sequência numerada para explicar filiação, atendimento ou procedimentos.',
    category: 'Conteúdo',
    supportsItems: true,
    itemLabel: 'Passo',
    defaultContent: {
      eyebrow: 'Processo',
      title: 'Como funciona',
      subtitle: 'Explique uma sequência de forma clara.',
      items: [
        { title: 'Contacto', description: 'Envie a sua solicitação pelo canal adequado.' },
        { title: 'Análise', description: 'A equipa avalia a situação e recolhe informação.' },
        { title: 'Acompanhamento', description: 'Recebe orientação e suporte até à resolução.' },
      ],
    },
  },
  {
    id: 'cta_banner',
    name: 'Chamada para Ação',
    description: 'Banner final ou intermédio para levar o visitante a contactar, aderir ou consultar serviços.',
    category: 'Conversão',
    defaultContent: {
      eyebrow: 'Próximo passo',
      title: 'Precisa de apoio?',
      subtitle: 'Estamos disponíveis para orientar e defender os seus direitos.',
      button_text: 'Contactar agora',
      button_link: '/contacto',
      secondary_button_text: 'Ver serviços',
      secondary_button_link: '/servicos',
      variant: 'dark',
    },
  },
  {
    id: 'faq_list',
    name: 'Perguntas Frequentes',
    description: 'Lista de perguntas e respostas para orientar visitantes e associados.',
    category: 'Conteúdo',
    supportsItems: true,
    itemLabel: 'Pergunta',
    defaultContent: {
      eyebrow: 'FAQ',
      title: 'Perguntas frequentes',
      subtitle: 'Respostas rápidas para dúvidas comuns.',
      items: [
        { title: 'Como posso aderir?', description: 'Entre em contacto para receber orientação sobre o processo de filiação.' },
        { title: 'Existe apoio jurídico?', description: 'Sim, os associados podem solicitar apoio e acompanhamento.' },
      ],
    },
  },
  {
    id: 'principles',
    name: 'Princípios da BD',
    description: 'Renderiza automaticamente os princípios geridos no módulo Página Inicial.',
    category: 'Institucional',
    defaultContent: {
      eyebrow: 'Princípios',
      title: 'Princípios do Sindicato',
      subtitle: 'Conteúdo sincronizado com a base de dados.',
    },
  },
  {
    id: 'competencies_main',
    name: 'Competências Principais da BD',
    description: 'Renderiza automaticamente competências principais geridas no CMS.',
    category: 'Institucional',
    defaultContent: {
      eyebrow: 'Competências',
      title: 'Competências Principais',
      subtitle: 'Conteúdo sincronizado com a base de dados.',
    },
  },
  {
    id: 'competencies_secondary',
    name: 'Competências Secundárias da BD',
    description: 'Renderiza automaticamente competências secundárias geridas no CMS.',
    category: 'Institucional',
    defaultContent: {
      eyebrow: 'Competências',
      title: 'Outras Competências',
      subtitle: 'Conteúdo sincronizado com a base de dados.',
    },
  },
]

export const LEGACY_LAYOUT_MAP: Record<string, string> = {
  text: 'editorial_text',
  cards: 'card_grid',
  image_text: 'split_feature',
  competencies: 'competencies_main',
}

export function normalizeLayoutId(layoutId: string) {
  return LEGACY_LAYOUT_MAP[layoutId] || layoutId || 'editorial_text'
}

export function getSectionLayout(layoutId: string) {
  const normalized = normalizeLayoutId(layoutId)
  return SECTION_LAYOUTS.find((layout) => layout.id === normalized) || SECTION_LAYOUTS[0]
}

export function createDefaultSectionContent(layoutId: string): SectionContent {
  const layout = getSectionLayout(layoutId)
  return JSON.parse(JSON.stringify(layout.defaultContent))
}
