import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroCarousel } from '@/components/HeroCarousel'
import { QuickAccessButton, MissionBox, PrincipalCard, CompetencyItem } from '@/components/Cards'
import { getIcon } from '@/lib/icons'
import { getHeroSlides, getQuickServices, getPrinciples, getCompetencies } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SINPROPNC - Sindicato do Pessoal Navegante de Cabine',
  description: 'Associação Sindical representativa dos Tripulantes de Cabine da Aviação Civil de Angola.',
}

const DEFAULT_HERO_SLIDES = [
  {
    id: '1',
    title: 'Unidos, somos mais fortes!',
    subtitle: 'O SINPROPNC é a voz dos Tripulantes de Cabine da Aviação Civil de Angola.',
    button_text: 'Saber mais',
    button_link: '/sobre-nos',
  },
  {
    id: '2',
    title: 'A sua defesa é nossa missão',
    subtitle: 'Representamos e protegemos os direitos de todos os Tripulantes de Cabine.',
    button_text: 'Conhecer serviços',
    button_link: '/servicos',
  },
]

const DEFAULT_QUICK_SERVICES = [
  { id: '1', title: 'Jurídico', icon_name: 'Scale', display_order: 1 },
  { id: '2', title: 'Acordos', icon_name: 'FileText', display_order: 2 },
  { id: '3', title: 'Atendimento', icon_name: 'Users', display_order: 3 },
  { id: '4', title: 'Documentos', icon_name: 'BookOpen', display_order: 4 },
  { id: '5', title: 'Denúncia', icon_name: 'AlertTriangle', display_order: 5 },
  { id: '6', title: 'Emergência', icon_name: 'Phone', display_order: 6 },
]

const DEFAULT_PRINCIPLES = [
  { id: '1', title: 'Sindicalismo Democrático', description: 'Eleição periódica por escrutínio secreto dos órgãos estatutários.', icon_name: 'Users', display_order: 1 },
  { id: '2', title: 'Estatutos e Regulamentos', description: 'Rege-se por estatutos aprovados democraticamente.', icon_name: 'Scale', display_order: 2 },
  { id: '3', title: 'Defesa dos Interesses', description: 'Promove os interesses individuais e colectivos dos associados.', icon_name: 'Heart', display_order: 3 },
  { id: '4', title: 'Participação Activa', description: 'Promove a participação de todos na actividade sindical.', icon_name: 'Users2', display_order: 4 },
]

const DEFAULT_COMPETENCIES = [
  { id: '1', title: 'Negociação Colectiva', description: 'Negociar e celebrar Instrumentos de Regulamentação Colectiva de Trabalho.', icon_name: 'FileText', display_order: 1 },
  { id: '2', title: 'Legislação do Trabalho', description: 'Participar na elaboração da Legislação do Trabalho.', icon_name: 'BookOpen', display_order: 2 },
  { id: '3', title: 'Fiscalização', description: 'Fiscalizar a aplicação das Leis de Trabalho.', icon_name: 'Shield', display_order: 3 },
  { id: '4', title: 'Unidade Sindical', description: 'Defender a unidade e solidariedade entre todos os Associados.', icon_name: 'Users2', display_order: 4 },
  { id: '5', title: 'Divulgação', description: 'Divulgar princípios e actividades do movimento sindical.', icon_name: 'Megaphone', display_order: 5 },
  { id: '6', title: 'Segurança Social', description: 'Participar na gestão de instituições de segurança social.', icon_name: 'Shield', display_order: 6 },
]

export default async function HomePage() {
  const [heroSlides, quickServices, principles, competencies] = await Promise.all([
    getHeroSlides(),
    getQuickServices(),
    getPrinciples(),
    getCompetencies(),
  ])

  const hero = heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES
  const services = quickServices.length > 0 ? quickServices : DEFAULT_QUICK_SERVICES
  const principlesData = principles.length > 0 ? principles : DEFAULT_PRINCIPLES
  const allCompetencies = competencies.length > 0 ? competencies : DEFAULT_COMPETENCIES

  const mainCompetencies = allCompetencies.slice(0, 3)
  const secondaryCompetencies = allCompetencies.slice(3)

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <HeroCarousel slides={hero} />

      {/* Quick Access Section */}
      {services.length > 0 && (
        <section className="bg-neutral-50 py-16 border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-12 animate-slide-up">Acesso Rápido</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service, idx) => (
                <div key={service.id} className="stagger-item" style={{ '--index': idx + 1 } as any}>
                  <QuickAccessButton
                    iconName={service.icon_name}
                    label={service.title}
                    href={`/servicos#${service.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8 animate-slide-up">Sobre o SINPROPNC</h2>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-10 border border-neutral-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                <strong className="text-blue-700">O SINPROPNC</strong> é a Associação Sindical representativa dos trabalhadores que exercem a actividade profissional de <strong>Tripulante de Cabine</strong> em empresas com sede, base ou representação em território nacional.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                O Sindicato representa os trabalhadores que exercem a profissão de Tripulante de Cabine em empresas com sede, base ou representação em território nacional, assim como os ex-Tripulantes na situação de Pré-Reformados e Reformados.
              </p>
            </div>
          </div>

          {/* Mission Box - From CMS */}
          {allCompetencies.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <MissionBox
                iconName="Target"
                title="A Nossa Missão"
                description="Ser um Sindicato livre e determinado na defesa dos trabalhadores, independentemente da sua categoria profissional ou da sua empresa."
              />
            </div>
          )}
        </div>
      </section>

      {/* Principles Section */}
      {principlesData.length > 0 && (
        <section className="bg-neutral-50 py-20 border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 animate-slide-up">Princípios do Sindicato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {principlesData.map((principle, idx) => (
                <div key={principle.id} className="stagger-item" style={{ '--index': idx + 1 } as any}>
                  <PrincipalCard
                    iconName={principle.icon_name}
                    title={principle.title}
                    description={principle.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Competencies Section */}
      {mainCompetencies.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 animate-slide-up">Competências Principais</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {mainCompetencies.map((competency, idx) => (
                <div key={competency.id} className="stagger-item" style={{ '--index': idx + 1 } as any}>
                  <PrincipalCard
                    iconName={competency.icon_name}
                    title={competency.title}
                    description={competency.description}
                  />
                </div>
              ))}
            </div>

            {secondaryCompetencies.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-neutral-900 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>Outras Competências</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {secondaryCompetencies.map((competency, idx) => (
                    <div key={competency.id} className="stagger-item" style={{ '--index': idx + 1 } as any}>
                      <CompetencyItem
                        iconName={competency.icon_name}
                        title={competency.title}
                        description={competency.description}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-20 border-t border-blue-600">
        <div className="max-w-6xl mx-auto px-6 text-center animate-slide-up">
          <h2 className="text-3xl font-bold mb-6">Junte-se a Nós</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Se é Tripulante de Cabine, o SINPROPNC é a sua organização. Juntos somos mais fortes na defesa dos seus direitos.
          </p>
          <Link
            href="/juntar"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-xl group"
          >
            Tornar-me Membro
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}