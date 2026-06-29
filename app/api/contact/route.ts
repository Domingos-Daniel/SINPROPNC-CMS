import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim()
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const name = clean(formData.get('name'))
  const email = clean(formData.get('email'))
  const phone = clean(formData.get('phone'))
  const subject = clean(formData.get('subject'))
  const message = clean(formData.get('message'))

  if (!name || !email || !subject || !message) {
    return NextResponse.redirect(new URL('/contacto?status=missing-fields', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    phone: phone || null,
    subject,
    message,
    source: 'website',
  })

  if (error) {
    console.error('Contact form error:', error)
    return NextResponse.redirect(new URL('/contacto?status=error', request.url))
  }

  return NextResponse.redirect(new URL('/contacto?status=sent', request.url))
}
