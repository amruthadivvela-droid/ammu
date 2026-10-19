const { Client } = require('pg');

async function migrate() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  console.log("Connecting to PostgreSQL database...");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✓ Connected to PostgreSQL via direct connection!");

    const ddl = `
      -- Enable UUID extension
      create extension if not exists "uuid-ossp";
      create extension if not exists "pgcrypto";

      -- 1. Contact Enquiries Table (V11.0 Specification)
      create table if not exists public.contact_enquiries (
        id uuid primary key default gen_random_uuid(),
        idempotency_key text unique,
        visitor_name text not null,
        visitor_email text,
        requirements text not null,
        visiting_card_storage_key text,
        visiting_card_url text,
        owner_email_status text default 'pending',
        visitor_email_status text default 'pending',
        owner_resend_message_id text,
        visitor_resend_message_id text,
        whatsapp_handoff_status text default 'prepared',
        retry_count integer default 0,
        last_error_code text,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );

      -- Add missing columns if table already existed
      alter table public.contact_enquiries add column if not exists idempotency_key text unique;
      alter table public.contact_enquiries add column if not exists visiting_card_storage_key text;
      alter table public.contact_enquiries add column if not exists visiting_card_url text;
      alter table public.contact_enquiries add column if not exists owner_email_status text default 'pending';
      alter table public.contact_enquiries add column if not exists visitor_email_status text default 'pending';
      alter table public.contact_enquiries add column if not exists owner_resend_message_id text;
      alter table public.contact_enquiries add column if not exists visitor_resend_message_id text;
      alter table public.contact_enquiries add column if not exists whatsapp_handoff_status text default 'prepared';
      alter table public.contact_enquiries add column if not exists retry_count integer default 0;
      alter table public.contact_enquiries add column if not exists last_error_code text;

      -- 2. Content tables
      create table if not exists public.portfolio_content (
        id uuid primary key default gen_random_uuid(),
        section_key text unique not null,
        title text not null,
        subtitle text,
        body_text text,
        metadata jsonb default '{}'::jsonb,
        is_published boolean default true,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
      );

      create table if not exists public.portfolio_skills (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        category text not null,
        description text,
        icon_identifier text not null default 'code',
        display_order integer default 0,
        is_visible boolean default true,
        is_published boolean default true,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
      );

      create table if not exists public.portfolio_projects (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        slug text unique not null,
        short_desc text not null,
        detailed_desc text,
        category text not null default 'frontend',
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

      -- Enable RLS
      alter table public.contact_enquiries enable row level security;
      alter table public.portfolio_content enable row level security;
      alter table public.portfolio_skills enable row level security;
      alter table public.portfolio_projects enable row level security;

      -- Allow anonymous inserts for enquiries
      drop policy if exists "Public can submit contact enquiries" on public.contact_enquiries;
      create policy "Public can submit contact enquiries" on public.contact_enquiries
        for insert with check (length(trim(visitor_name)) > 0);

      -- Public read for published content
      drop policy if exists "Public can read published content" on public.portfolio_content;
      create policy "Public can read published content" on public.portfolio_content
        for select using (is_published = true);

      drop policy if exists "Public can read published skills" on public.portfolio_skills;
      create policy "Public can read published skills" on public.portfolio_skills
        for select using (is_published = true and is_visible = true);

      drop policy if exists "Public can read published projects" on public.portfolio_projects;
      create policy "Public can read published projects" on public.portfolio_projects
        for select using (is_published = true);
    `;

    await client.query(ddl);
    console.log("✓ All Supabase tables & RLS policies successfully created and verified!");

    const res = await client.query("select table_name from information_schema.tables where table_schema = 'public';");
    console.log("Current public tables:", res.rows.map(r => r.table_name));

    await client.end();
  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  }
}

migrate();
