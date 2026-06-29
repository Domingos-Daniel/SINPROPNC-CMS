-- Professional CMS hardening and synchronization layer.
-- Safe to run more than once where possible.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and is_active = true
  );
$$;

create or replace function public.admin_role()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce((
    select role
    from public.admin_users
    where id = auth.uid()
      and is_active = true
    limit 1
  ), 'none');
$$;

alter table public.admin_users add column if not exists full_name text;
alter table public.admin_users add column if not exists last_seen_at timestamptz;
alter table public.admin_users alter column role set default 'editor';
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_users_role_check'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users add constraint admin_users_role_check
      check (role in ('super_admin', 'admin', 'editor'))
      not valid;
  end if;
end $$;

insert into public.admin_users (id, email, role, is_active, created_at, updated_at)
select id, email, 'super_admin', true, now(), now()
from auth.users
where email in ('maxuser@sinpropnc.ao', 'domingoscahandadaniel@gmail.com')
on conflict (id) do update
set email = excluded.email,
    role = case when public.admin_users.role is null then 'super_admin' else public.admin_users.role end,
    is_active = true,
    updated_at = now();

alter table public.pages add column if not exists seo_title text;
alter table public.pages add column if not exists meta_description text;
alter table public.pages add column if not exists header_image_url text;
alter table public.pages add column if not exists status text default 'published';
alter table public.pages add column if not exists published_at timestamptz;
update public.pages set status = case when is_published then 'published' else 'draft' end where status is null;
update public.pages set published_at = created_at where published_at is null and is_published = true;

alter table public.sections add column if not exists is_active boolean default true;
alter table public.sections add column if not exists title text;

alter table public.posts add column if not exists seo_title text;
alter table public.posts add column if not exists meta_description text;
alter table public.posts add column if not exists category text default 'Geral';
alter table public.posts add column if not exists tags text[] default '{}';
alter table public.posts add column if not exists author_name text;
alter table public.posts add column if not exists status text default 'draft';
update public.posts set status = case when is_published then 'published' else 'draft' end where status is null;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  source text default 'website',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  status text not null default 'active',
  source text default 'website',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  kind text not null default 'image',
  alt_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']::text[]
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into public.settings (setting_key, setting_value)
values
  ('site_name', '{"value":"SINPROPNC"}'::jsonb),
  ('site_tagline', '{"value":"Sindicato Provincial do Pessoal Navegante de Cabine"}'::jsonb),
  ('site_description', '{"value":"Sindicato Provincial do Pessoal Navegante de Cabine da Aviação Civil de Angola."}'::jsonb),
  ('site_footer', '{"value":"Sindicato Provincial do Pessoal Navegante de Cabine da Aviação Civil de Angola"}'::jsonb),
  ('primary_color', '{"value":"#1d4ed8"}'::jsonb),
  ('secondary_color', '{"value":"#16a34a"}'::jsonb),
  ('social_facebook', '{"value":""}'::jsonb),
  ('social_twitter', '{"value":""}'::jsonb),
  ('social_linkedin', '{"value":""}'::jsonb),
  ('home_about_title', '{"value":"Sobre o SINPROPNC"}'::jsonb),
  ('home_about_body', '{"value":"O SINPROPNC é a associação sindical representativa dos trabalhadores que exercem a actividade profissional de Tripulante de Cabine em empresas com sede, base ou representação em território nacional. Representa também ex-Tripulantes na situação de Pré-Reformados e Reformados."}'::jsonb),
  ('home_mission_title', '{"value":"A Nossa Missão"}'::jsonb),
  ('home_mission_body', '{"value":"Ser um Sindicato livre e determinado na defesa dos trabalhadores, independentemente da sua categoria profissional ou da sua empresa."}'::jsonb),
  ('home_cta_title', '{"value":"Junte-se a Nós"}'::jsonb),
  ('home_cta_body', '{"value":"Se é Tripulante de Cabine, o SINPROPNC é a sua organização. Juntos somos mais fortes na defesa dos seus direitos."}'::jsonb)
on conflict (setting_key) do nothing;

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

drop trigger if exists site_assets_set_updated_at on public.site_assets;
create trigger site_assets_set_updated_at
before update on public.site_assets
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.contact_info enable row level security;
alter table public.menu_items enable row level security;
alter table public.faqs enable row level security;
alter table public.hero_slides enable row level security;
alter table public.quick_services enable row level security;
alter table public.competencies enable row level security;
alter table public.principles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.audit_logs enable row level security;
alter table public.site_assets enable row level security;

drop policy if exists "admin_users_select_admin" on public.admin_users;
drop policy if exists "admin_users_manage_super_admin" on public.admin_users;
create policy "admin_users_select_admin" on public.admin_users
  for select using (public.is_admin());
create policy "admin_users_manage_super_admin" on public.admin_users
  for all using (public.admin_role() = 'super_admin')
  with check (public.admin_role() = 'super_admin');

drop policy if exists "contact_info_select_public" on public.contact_info;
drop policy if exists "contact_info_all_admin" on public.contact_info;
create policy "contact_info_select_public" on public.contact_info
  for select using (is_active = true or public.is_admin());
create policy "contact_info_all_admin" on public.contact_info
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_items_select_public" on public.menu_items;
drop policy if exists "menu_items_all_admin" on public.menu_items;
create policy "menu_items_select_public" on public.menu_items
  for select using (is_active = true or public.is_admin());
create policy "menu_items_all_admin" on public.menu_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "faqs_select_public" on public.faqs;
drop policy if exists "faqs_all_admin" on public.faqs;
create policy "faqs_select_public" on public.faqs
  for select using (is_active = true or public.is_admin());
create policy "faqs_all_admin" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "hero_slides_select_public" on public.hero_slides;
drop policy if exists "hero_slides_all_admin" on public.hero_slides;
create policy "hero_slides_select_public" on public.hero_slides
  for select using (is_active = true or public.is_admin());
create policy "hero_slides_all_admin" on public.hero_slides
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "quick_services_select_public" on public.quick_services;
drop policy if exists "quick_services_all_admin" on public.quick_services;
create policy "quick_services_select_public" on public.quick_services
  for select using (is_active = true or public.is_admin());
create policy "quick_services_all_admin" on public.quick_services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "competencies_select_public" on public.competencies;
drop policy if exists "competencies_all_admin" on public.competencies;
create policy "competencies_select_public" on public.competencies
  for select using (is_active = true or public.is_admin());
create policy "competencies_all_admin" on public.competencies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "principles_select_public" on public.principles;
drop policy if exists "principles_all_admin" on public.principles;
create policy "principles_select_public" on public.principles
  for select using (is_active = true or public.is_admin());
create policy "principles_all_admin" on public.principles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "posts_select_public" on public.posts;
drop policy if exists "posts_select_admin" on public.posts;
drop policy if exists "posts_insert_admin" on public.posts;
drop policy if exists "posts_update_admin" on public.posts;
drop policy if exists "posts_delete_admin" on public.posts;
create policy "posts_select_public" on public.posts
  for select using (is_published = true or public.is_admin());
create policy "posts_insert_admin" on public.posts
  for insert with check (public.is_admin());
create policy "posts_update_admin" on public.posts
  for update using (public.is_admin()) with check (public.is_admin());
create policy "posts_delete_admin" on public.posts
  for delete using (public.is_admin());

drop policy if exists "pages_select_public" on public.pages;
drop policy if exists "pages_select_admin" on public.pages;
drop policy if exists "pages_insert_admin" on public.pages;
drop policy if exists "pages_update_admin" on public.pages;
drop policy if exists "pages_delete_admin" on public.pages;
create policy "pages_select_public" on public.pages
  for select using (is_published = true or public.is_admin());
create policy "pages_insert_admin" on public.pages
  for insert with check (public.is_admin());
create policy "pages_update_admin" on public.pages
  for update using (public.is_admin()) with check (public.is_admin());
create policy "pages_delete_admin" on public.pages
  for delete using (public.is_admin());

drop policy if exists "sections_select_public" on public.sections;
drop policy if exists "sections_all_admin" on public.sections;
create policy "sections_select_public" on public.sections
  for select using (is_active = true or public.is_admin());
create policy "sections_all_admin" on public.sections
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_select_public" on public.settings;
drop policy if exists "settings_select_admin" on public.settings;
drop policy if exists "settings_insert_admin" on public.settings;
drop policy if exists "settings_update_admin" on public.settings;
create policy "settings_select_public" on public.settings
  for select using (true);
create policy "settings_insert_admin" on public.settings
  for insert with check (public.is_admin());
create policy "settings_update_admin" on public.settings
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_messages_insert_public" on public.contact_messages;
drop policy if exists "contact_messages_select_admin" on public.contact_messages;
drop policy if exists "contact_messages_update_admin" on public.contact_messages;
create policy "contact_messages_insert_public" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_select_admin" on public.contact_messages
  for select using (public.is_admin());
create policy "contact_messages_update_admin" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "newsletter_insert_public" on public.newsletter_subscribers;
drop policy if exists "newsletter_select_admin" on public.newsletter_subscribers;
drop policy if exists "newsletter_update_admin" on public.newsletter_subscribers;
create policy "newsletter_insert_public" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_select_admin" on public.newsletter_subscribers
  for select using (public.is_admin());
create policy "newsletter_update_admin" on public.newsletter_subscribers
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "audit_logs_select_admin" on public.audit_logs;
drop policy if exists "audit_logs_insert_admin" on public.audit_logs;
create policy "audit_logs_select_admin" on public.audit_logs
  for select using (public.is_admin());
create policy "audit_logs_insert_admin" on public.audit_logs
  for insert with check (public.is_admin());

drop policy if exists "site_assets_select_public" on public.site_assets;
drop policy if exists "site_assets_all_admin" on public.site_assets;
create policy "site_assets_select_public" on public.site_assets
  for select using (true);
create policy "site_assets_all_admin" on public.site_assets
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cms_media_select_public" on storage.objects;
drop policy if exists "cms_media_insert_admin" on storage.objects;
drop policy if exists "cms_media_update_admin" on storage.objects;
drop policy if exists "cms_media_delete_admin" on storage.objects;
create policy "cms_media_select_public" on storage.objects
  for select using (bucket_id = 'cms-media');
create policy "cms_media_insert_admin" on storage.objects
  for insert with check (bucket_id = 'cms-media' and public.is_admin());
create policy "cms_media_update_admin" on storage.objects
  for update using (bucket_id = 'cms-media' and public.is_admin())
  with check (bucket_id = 'cms-media' and public.is_admin());
create policy "cms_media_delete_admin" on storage.objects
  for delete using (bucket_id = 'cms-media' and public.is_admin());
