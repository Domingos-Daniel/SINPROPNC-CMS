import { createClient } from '@/lib/supabase/server'
import { Mail, Phone, MapPin, Clock, Shield, Users, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ContactInfo {
  id: string
  label: string
  value: string
  icon: string
  is_active: boolean
  display_order: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  is_active: boolean
  display_order: number
}

async function getContactData() {
  const supabase = await createClient()
  
  const [contactRes, faqRes] = await Promise.all([
    supabase.from('contact_info').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('faqs').select('*').eq('is_active', true).order('display_order', { ascending: true }),
  ])

  return {
    contactInfo: contactRes.data || [],
    faqs: faqRes.data || [],
  }
}

function getIcon(iconName: string) {
  switch (iconName) {
    case 'phone': return Phone
    case 'mail': return Mail
    case 'mapPin': return MapPin
    case 'clock': return Clock
    default: return Phone
  }
}

function getColor(iconName: string) {
  if (iconName === 'clock') return 'green'
  return 'blue'
}

export default async function ContactoPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>
}) {
  const { contactInfo, faqs } = await getContactData()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const status = resolvedSearchParams.status

  const getContactValue = (label: string) => {
    const item = contactInfo.find(c => c.label === label)
    return item?.value
  }

  const phone = getContactValue('Telefone') || '+244 923 436 908'
  const email = getContactValue('Email') || 'sinpropnc@gmail.com'
  const location = getContactValue('Localização') || 'Luanda, Angola'

  const contactCards = contactInfo.map((card, idx) => ({
    icon: getIcon(card.icon),
    title: card.label,
    info: card.value,
    detail: idx === 0 ? 'Disponível 24 horas' : idx === 1 ? 'Responderemos em 24h' : '',
    color: getColor(card.icon),
  }))

  return (
    <div className="bg-white">
      {/* Header - Corporate Style */}
      <section className="relative bg-[linear-gradient(135deg,var(--cms-primary),#0f172a)] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Contacte-nos</h1>
            <p className="text-xl text-white/75 leading-relaxed font-light">
              Estamos aqui para ajudar e responder às suas questões. A sua voz é a nossa prioridade.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-24 bg-[var(--cms-secondary)] rounded-full" />
            <div className="h-1 w-16 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.length > 0 ? (
              contactCards.map((card, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    card.color === 'green' 
                      ? 'bg-gradient-to-br from-[var(--cms-secondary)] to-[var(--cms-secondary)]' 
                      : 'bg-gradient-to-br from-[var(--cms-primary)] to-[var(--cms-primary)]'
                  }`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{card.title}</h3>
                  <p className="text-neutral-700 font-medium">{card.info}</p>
                  {card.detail && <p className="text-sm text-neutral-500 mt-1">{card.detail}</p>}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-neutral-500">
                Configure os dados de contacto no painel de administração
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-10 border border-neutral-100 shadow-sm">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Envie-nos uma mensagem</h2>
                <p className="text-neutral-500 mb-8">Preencha o formulário e responderemos brevemente.</p>
                {status === 'sent' && (
                  <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    Mensagem enviada com sucesso. Entraremos em contacto brevemente.
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Não foi possível enviar a mensagem. Tente novamente.
                  </div>
                )}
                {status === 'missing-fields' && (
                  <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
                    Preencha todos os campos obrigatórios.
                  </div>
                )}

                <form action="/api/contact" method="POST" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--cms-primary)] focus:border-transparent transition-all"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--cms-primary)] focus:border-transparent transition-all"
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Telefone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--cms-primary)] focus:border-transparent transition-all"
                        placeholder="+244 923 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Assunto</label>
                      <select
                        name="subject"
                        required
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--cms-primary)] focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="juridico">Suporte Jurídico</option>
                        <option value="filiacao">Filiação</option>
                        <option value="servicos">Serviços</option>
                        <option value="reclamacao">Reclamação</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">Mensagem</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--cms-primary)] focus:border-transparent transition-all resize-none"
                      placeholder="Escreva a sua mensagem aqui..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--cms-primary)] hover:brightness-95 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-slate-400/25 flex items-center justify-center gap-3"
                  >
                    <span>Enviar Mensagem</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Emergency Card */}
              <div className="bg-gradient-to-br from-[var(--cms-secondary)] to-[var(--cms-secondary)] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Linha de Emergência</h3>
                    <p className="text-green-100">24 horas / 7 dias</p>
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Associados com necessidade urgente de apoio jurídico ou denúncia podem contactar-nos a qualquer hora.
                </p>
                <a 
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {phone}
                </a>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Acesso Rápido</h3>
                <div className="space-y-3">
                  <a href="/juntar" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <Users className="w-5 h-5 text-[var(--cms-primary)]" />
                    <span className="text-neutral-700 group-hover:text-[var(--cms-primary)]">Tornar-se Associado</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto group-hover:text-[var(--cms-primary)]" />
                  </a>
                  <a href="/servicos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <Shield className="w-5 h-5 text-[var(--cms-primary)]" />
                    <span className="text-neutral-700 group-hover:text-[var(--cms-primary)]">Ver Serviços</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto group-hover:text-[var(--cms-primary)]" />
                  </a>
                  <a href="/area-associado" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <Mail className="w-5 h-5 text-[var(--cms-primary)]" />
                    <span className="text-neutral-700 group-hover:text-[var(--cms-primary)]">Área do Associado</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto group-hover:text-[var(--cms-primary)]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Perguntas Frequentes</h2>
            <div className="h-1 w-24 bg-[var(--cms-secondary)] rounded-full mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.length > 0 ? (
              faqs.map((faq, idx) => (
                <div 
                  key={faq.id}
                  className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 hover:border-[var(--cms-primary)]/30 hover:bg-slate-50 transition-all duration-300 group"
                >
                  <h3 className="font-bold text-lg text-neutral-900 mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 bg-[var(--cms-primary)] rounded-lg flex items-center justify-center text-white text-sm">
                      {idx + 1}
                    </span>
                    {faq.question}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed pl-11">{faq.answer}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <h3 className="font-bold text-lg text-neutral-900 mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 bg-[var(--cms-primary)] rounded-lg flex items-center justify-center text-white text-sm">1</span>
                    Como me filio ao SINPROPNC?
                  </h3>
                  <p className="text-neutral-600 leading-relaxed pl-11">Contacte-nos através do email ou telefone para mais informações.</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <h3 className="font-bold text-lg text-neutral-900 mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 bg-[var(--cms-primary)] rounded-lg flex items-center justify-center text-white text-sm">2</span>
                    Qual é o horário de atendimento?
                  </h3>
                  <p className="text-neutral-600 leading-relaxed pl-11">Seg - Sex: 08h - 17h. Emergência 24h para associados.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
