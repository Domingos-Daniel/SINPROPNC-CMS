import { createClient } from '@/lib/supabase/server'

// Helper function to safely create Supabase client
async function getSafeClient() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }
    return await createClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

export async function getPages() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching pages:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching pages:', error)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return null
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching page:', error)
    }
    return data || null
  } catch (error) {
    console.error('Exception fetching page:', error)
    return null
  }
}

export async function getSectionsByPageId(pageId: string) {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching sections:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching sections:', error)
    return []
  }
}

export async function getPosts(published = true) {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    let query = supabase.from('posts').select('*')
    if (published) {
      query = query.eq('is_published', true)
    }
    const { data, error } = await query.order('published_at', { ascending: false })
    if (error) {
      console.error('Error fetching posts:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching posts:', error)
    return []
  }
}

export async function getSettings() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) {
      return {
        site_name: { value: 'SIMPROPNC' },
        site_tagline: { value: 'Content Management System' },
      }
    }
    const { data, error } = await supabase.from('settings').select('*')
    if (error) {
      console.error('Error fetching settings:', error)
      return {
        site_name: { value: 'SIMPROPNC' },
        site_tagline: { value: 'Content Management System' },
      }
    }
    const settings: Record<string, any> = {
      site_name: { value: 'SIMPROPNC' },
      site_tagline: { value: 'Content Management System' },
    }
    data?.forEach((item) => {
      settings[item.setting_key] = item.setting_value
    })
    return settings
  } catch (error) {
    console.error('Exception fetching settings:', error)
    return {
      site_name: { value: 'SIMPROPNC' },
      site_tagline: { value: 'Content Management System' },
    }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return null
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching post:', error)
    }
    return data || null
  } catch (error) {
    console.error('Exception fetching post:', error)
    return null
  }
}

export async function getContactInfo() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching contact info:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching contact info:', error)
    return []
  }
}

export async function getMenuItems() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching menu items:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching menu items:', error)
    return []
  }
}

export async function getFAQs() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching FAQs:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching FAQs:', error)
    return []
  }
}

export async function getHeroSlides() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching hero slides:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching hero slides:', error)
    return []
  }
}

export async function getQuickServices() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('quick_services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching quick services:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching quick services:', error)
    return []
  }
}

export async function getPrinciples() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('principles')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching principles:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching principles:', error)
    return []
  }
}

export async function getCompetencies() {
  try {
    const supabase = await getSafeClient()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('competencies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching competencies:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Exception fetching competencies:', error)
    return []
  }
}
