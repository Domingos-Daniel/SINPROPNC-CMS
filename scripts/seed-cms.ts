import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedCMS() {
  try {
    console.log('🌱 Starting CMS seed...')

    // Delete existing data
    console.log('Cleaning existing data...')
    await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('quick_services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('principles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('competencies').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('contact_info').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Seed hero slides
    console.log('Seeding hero slides...')
    await supabase.from('hero_slides').insert([
      {
        title: 'Unidos, somos mais fortes!',
        subtitle: 'O SINPROPNC é a voz dos Tripulantes de Cabine da Aviação Civil de Angola.',
        button_text: 'Saber mais',
        button_link: '/sobre-nos',
        display_order: 0,
        is_active: true,
      },
      {
        title: 'A sua defesa é nossa missão',
        subtitle: 'Representamos e protegemos os direitos de todos os Tripulantes de Cabine.',
        button_text: 'Saber mais',
        button_link: '/sobre-nos',
        display_order: 1,
        is_active: true,
      },
      {
        title: 'Juntos somos invencíveis',
        subtitle: 'Beneficie de proteção laboral, apoio jurídico e defesa dos seus direitos.',
        button_text: 'Aderir Agora',
        button_link: '/juntar',
        display_order: 2,
        is_active: true,
      },
    ])

    // Seed quick services
    console.log('Seeding quick services...')
    await supabase.from('quick_services').insert([
      {
        label: 'Jurídico',
        icon_name: 'Scale',
        link: '/servicos#juridico',
        display_order: 0,
        is_active: true,
      },
      {
        label: 'Acordos Colectivos',
        icon_name: 'FileText',
        link: '/servicos#acordos',
        display_order: 1,
        is_active: true,
      },
      {
        label: 'Atendimento',
        icon_name: 'Users',
        link: '/servicos#atendimento',
        display_order: 2,
        is_active: true,
      },
      {
        label: 'Leis e Documentos',
        icon_name: 'BookOpen',
        link: '/servicos#docs',
        display_order: 3,
        is_active: true,
      },
      {
        label: 'Denúncia',
        icon_name: 'AlertTriangle',
        link: '/contacto#denuncia',
        display_order: 4,
        is_active: true,
      },
      {
        label: 'Emergência 24h',
        icon_name: 'Phone',
        link: 'tel:+244923436908',
        display_order: 5,
        is_active: true,
      },
    ])

    // Seed principles
    console.log('Seeding principles...')
    await supabase.from('principles').insert([
      {
        title: 'Sindicalismo Democrático',
        description: 'Eleição periódica por escrutínio secreto dos órgãos estatutários.',
        icon_name: 'Users',
        display_order: 0,
        is_active: true,
      },
      {
        title: 'Estatutos e Regulamentos',
        description: 'Rege-se por estatutos aprovados democraticamente.',
        icon_name: 'Scale',
        display_order: 1,
        is_active: true,
      },
      {
        title: 'Defesa dos Interesses',
        description: 'Promove os interesses individuais e colectivos dos associados.',
        icon_name: 'Heart',
        display_order: 2,
        is_active: true,
      },
      {
        title: 'Participação Activa',
        description: 'Promove a participação de todos na actividade sindical.',
        icon_name: 'Users2',
        display_order: 3,
        is_active: true,
      },
    ])

    // Seed main competencies
    console.log('Seeding main competencies...')
    await supabase.from('competencies').insert([
      {
        title: 'Negociação Colectiva',
        description: 'Negociar e celebrar Instrumentos de Regulamentação Colectiva de Trabalho.',
        icon_name: 'FileText',
        category: 'main',
        display_order: 0,
        is_active: true,
      },
      {
        title: 'Legislação do Trabalho',
        description: 'Participar na elaboração da Legislação do Trabalho.',
        icon_name: 'BookOpen',
        category: 'main',
        display_order: 1,
        is_active: true,
      },
      {
        title: 'Fiscalização',
        description: 'Fiscalizar a aplicação das Leis de Trabalho.',
        icon_name: 'Shield',
        category: 'main',
        display_order: 2,
        is_active: true,
      },
    ])

    // Seed secondary competencies
    console.log('Seeding secondary competencies...')
    await supabase.from('competencies').insert([
      {
        title: 'Unidade Sindical',
        description: 'Defender a unidade e solidariedade entre todos os Associados.',
        icon_name: 'Users2',
        category: 'secondary',
        display_order: 0,
        is_active: true,
      },
      {
        title: 'Divulgação',
        description: 'Divulgar princípios e actividades do movimento sindical.',
        icon_name: 'Megaphone',
        category: 'secondary',
        display_order: 1,
        is_active: true,
      },
      {
        title: 'Segurança Social',
        description: 'Participar na gestão de instituições de segurança social.',
        icon_name: 'Shield',
        category: 'secondary',
        display_order: 2,
        is_active: true,
      },
      {
        title: 'Defesa de Direitos',
        description: 'Promover acções conducentes à conquista das justas reivindicações.',
        icon_name: 'Heart',
        category: 'secondary',
        display_order: 3,
        is_active: true,
      },
      {
        title: 'Apoio Jurídico',
        description: 'Prestar apoio e assistência jurídica gratuita aos Associados.',
        icon_name: 'Scale',
        category: 'secondary',
        display_order: 4,
        is_active: true,
      },
      {
        title: 'Cooperação Internacional',
        description: 'Filiar-se em organizações sindicais nacionais ou internacionais.',
        icon_name: 'Users',
        category: 'secondary',
        display_order: 5,
        is_active: true,
      },
    ])

    // Seed contact info
    console.log('Seeding contact info...')
    await supabase.from('contact_info').insert([
      {
        label: 'Telefone',
        value: '+244 923 436 908',
        icon: 'phone',
        is_active: true,
        display_order: 0,
      },
      {
        label: 'Email',
        value: 'sinpropnc@gmail.com',
        icon: 'mail',
        is_active: true,
        display_order: 1,
      },
      {
        label: 'Localização',
        value: 'Luanda, Angola',
        icon: 'mapPin',
        is_active: true,
        display_order: 2,
      },
      {
        label: 'Horário',
        value: 'Seg - Sex: 08h - 17h',
        icon: 'clock',
        is_active: true,
        display_order: 3,
      },
    ])

    // Seed menu items
    console.log('Seeding menu items...')
    await supabase.from('menu_items').insert([
      { label: 'Início', href: '/', is_active: true, display_order: 0 },
      { label: 'Sobre Nós', href: '/sobre-nos', is_active: true, display_order: 1 },
      { label: 'O Que Fazemos', href: '/o-que-fazemos', is_active: true, display_order: 2 },
      { label: 'A Profissão', href: '/a-profissao', is_active: true, display_order: 3 },
      { label: 'Serviços', href: '/servicos', is_active: true, display_order: 4 },
      { label: 'Parceiros', href: '/parceiros', is_active: true, display_order: 5 },
      { label: 'Notícias', href: '/noticias', is_active: true, display_order: 6 },
      { label: 'Contacto', href: '/contacto', is_active: true, display_order: 7 },
    ])

    // Seed FAQs
    console.log('Seeding FAQs...')
    await supabase.from('faqs').insert([
      {
        question: 'Como me filio ao SINPROPNC?',
        answer: 'Contacte-nos através do email ou telefone para mais informações sobre o processo de filiação e seus benefícios.',
        is_active: true,
        display_order: 0,
      },
      {
        question: 'Qual é o horário de atendimento?',
        answer: 'Atendimento de segunda a sexta, das 08h às 17h. Emergência disponível 24h para associados.',
        is_active: true,
        display_order: 1,
      },
      {
        question: 'Como acesso minha área de associado?',
        answer: 'Use o botão "ÁREA DO ASSOCIADO" no topo da página para aceder aos seus dados, documentos e benefícios.',
        is_active: true,
        display_order: 2,
      },
      {
        question: 'Como faço uma denúncia anónima?',
        answer: 'Contacte-nos confidencialmente através do email ou ligue para o número de emergência 24h.',
        is_active: true,
        display_order: 3,
      },
    ])

    console.log('✅ CMS seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding CMS:', error)
    process.exit(1)
  }
}

seedCMS()
