-- ==============================================================================
-- SAKURA CMS: SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- Project: Divvela Jyoti Venkata Amrutha - Sakura Developer Portfolio
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PORTFOLIO CONTENT TABLE (Section texts, greetings, hero, about, footer)
create table if not exists public.portfolio_content (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null,
  title text not null,
  subtitle text,
  body_text text,
  metadata jsonb default '{}'::jsonb,
  is_published boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PORTFOLIO SKILLS TABLE (Skills, categories, icons, ordering)
create table if not exists public.portfolio_skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null, -- 'frontend', 'languages', 'styling', 'workflow'
  description text,
  icon_identifier text not null default 'code',
  display_order integer default 0,
  is_visible boolean default true,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PORTFOLIO PROJECTS TABLE (Showcase projects, GitHub, Live Demo, Media)
create table if not exists public.portfolio_projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  short_desc text not null,
  detailed_desc text,
  category text not null default 'frontend', -- 'frontend', 'team', 'interactive'
  technologies text[] not null default '{}',
  cover_image_url text,
  gallery_images text[] default '{}',
  github_url text,
  live_demo_url text,
  is_featured boolean default false,
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PORTFOLIO MEDIA TABLE (Storage assets, portraits, resume, covers)
create table if not exists public.portfolio_media (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  file_url text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes bigint,
  dimensions text, -- e.g. '1080x1350'
  published_ref text, -- e.g. 'hero_portrait', 'real_portrait_ammu', 'resume_pdf'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PORTFOLIO ADMINS TABLE (Approved administrator identities)
create table if not exists public.portfolio_admins (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text not null default 'admin',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PORTFOLIO REVISIONS TABLE (Audit trail of changes)
create table if not exists public.portfolio_revisions (
  id uuid primary key default uuid_generate_v4(),
  table_name text not null,
  record_id uuid not null,
  changed_by text default 'admin',
  previous_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CONTACT ENQUIRIES TABLE (Inbound visitor messages, WhatsApp & Email)
create table if not exists public.contact_enquiries (
  id uuid primary key default uuid_generate_v4(),
  visitor_name text not null,
  visitor_email text,
  requirements text not null,
  preferred_channel text not null default 'whatsapp', -- 'whatsapp' or 'email'
  delivery_status text not null default 'received', -- 'received', 'sent_resend', 'failed'
  resend_email_id text,
  visiting_card_generated boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.portfolio_content enable row level security;
alter table public.portfolio_skills enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_media enable row level security;
alter table public.portfolio_admins enable row level security;
alter table public.portfolio_revisions enable row level security;
alter table public.contact_enquiries enable row level security;

-- PUBLIC READ POLICIES (Anyone can view published content)
create policy "Public can read published content" on public.portfolio_content
  for select using (is_published = true);

create policy "Public can read published skills" on public.portfolio_skills
  for select using (is_published = true and is_visible = true);

create policy "Public can read published projects" on public.portfolio_projects
  for select using (is_published = true);

create policy "Public can read published media" on public.portfolio_media
  for select using (true);

-- PUBLIC INSERT FOR ENQUIRIES (Visitors can submit contact enquiries)
create policy "Public can submit contact enquiries" on public.contact_enquiries
  for insert with check (
    length(trim(visitor_name)) > 0 and 
    length(trim(requirements)) >= 5
  );

-- ADMIN AUTH POLICIES (Only authenticated admins can manage)
create policy "Admins can manage portfolio content" on public.portfolio_content
  for all using (auth.role() = 'authenticated');

create policy "Admins can manage portfolio skills" on public.portfolio_skills
  for all using (auth.role() = 'authenticated');

create policy "Admins can manage portfolio projects" on public.portfolio_projects
  for all using (auth.role() = 'authenticated');

create policy "Admins can manage portfolio media" on public.portfolio_media
  for all using (auth.role() = 'authenticated');

create policy "Admins can manage contact enquiries" on public.contact_enquiries
  for select using (auth.role() = 'authenticated');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

insert into public.portfolio_content (section_key, title, subtitle, body_text)
values 
  ('hero', 'Frontend Developer', 'I turn ideas into thoughtful web experiences.', 'Hi, I’m Amrutha. A frontend developer with a passion for creative web experiences.'),
  ('about', 'Curious mind. Creative heart.', '01 / A LITTLE ABOUT ME', 'I’m a B.Tech student at Narasaraopeta Engineering College who loves building clean, user-friendly, responsive web interfaces. I enjoy turning creative ideas into living designs and bringing them to life with code.'),
  ('intro_greeting', 'WELCOME', 'to my world', 'Welcome to Amrutha’s creative portfolio universe.'),
  ('contact', 'What are your requirements?', 'Tell me a little about what you''d love to create.', 'Have an idea, collaboration, or project? Describe what you need and let''s connect via WhatsApp or Email.')
on conflict (section_key) do update 
set title = excluded.title, subtitle = excluded.subtitle, body_text = excluded.body_text;

insert into public.portfolio_skills (name, category, description, icon_identifier, display_order)
values 
  ('HTML5', 'frontend', 'Semantic structuring, modern accessible markup', 'code', 1),
  ('CSS3', 'frontend', 'Responsive layouts, Flexbox, Grid, transitions', 'palette', 2),
  ('JavaScript', 'frontend', 'ES6+ interactivity, dynamic DOM, async workflows', 'zap', 3),
  ('C Language', 'languages', 'Core programming fundamentals, problem solving', 'cpu', 4),
  ('UI & UX Design', 'workflow', 'Typographic rhythm, color theory, prototyping', 'sparkles', 5),
  ('Responsive Web', 'workflow', 'Fluid design across mobile, tablet, and desktop', 'layout', 6)
on conflict do nothing;

insert into public.portfolio_projects (title, slug, short_desc, detailed_desc, category, technologies, github_url, live_demo_url, is_featured, display_order)
values
  (
    'Smart Classroom Attendance System',
    'smart-classroom-attendance',
    'Designed and developed an intuitive, web-based classroom attendance interface with live status recording and clean responsive feedback.',
    'A collaborative academic team project at Narasaraopeta Engineering College. Features real-time status recording, structured roll-call workflows, and clean responsive feedback.',
    'team',
    array['HTML5', 'CSS3', 'JavaScript', 'Responsive Web'],
    'https://github.com/amruthadivvela-droid',
    null,
    true,
    1
  ),
  (
    'Prompt Tech Showcase',
    'prompt-tech',
    'A modern tech platform interface built for interactive showcase and clean user navigation.',
    'Focused on clean interface architecture, smooth micro-interactions, and modular CSS layout styling.',
    'frontend',
    array['HTML5', 'CSS3', 'JavaScript'],
    'https://github.com/amruthadivvela-droid',
    null,
    false,
    2
  ),
  (
    'Luxury Watch Experience',
    'luxury-watch',
    'An elegant product showcase page with smooth hover animations and high-fidelity aesthetics.',
    'Features refined product layout cards, responsive image staging, and interactive details.',
    'interactive',
    array['HTML5', 'CSS3', 'Animation'],
    'https://github.com/amruthadivvela-droid',
    null,
    false,
    3
  )
on conflict do nothing;
