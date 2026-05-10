-- User profile (one per auth user)
create table if not exists user_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  age integer,
  state text,
  employment_status text,
  income text,
  household_size integer,
  citizenship_status text,
  has_children boolean default false,
  children_count integer default 0,
  disability_status text,
  student_status text,
  language_preference text default 'en',
  delete_docs_after_extraction boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Programs (16 seeded, can have user-added)
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description_en text,
  eligibility_rules jsonb default '{}',
  required_documents text[] default '{}',
  application_url text,
  deadline text,
  states_available text[] default '{all}',
  is_user_added boolean default false,
  created_at timestamptz default now()
);

-- User program matches
create table if not exists user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references programs(id) on delete cascade,
  eligibility_score text check (eligibility_score in ('strong', 'possible', 'unlikely')),
  status text default 'matched' check (status in ('matched', 'in_progress', 'submitted', 'approved', 'denied')),
  missing_docs text[] default '{}',
  notes text,
  added_at timestamptz default now(),
  unique (user_id, program_id)
);

-- Documents (files, temp storage)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text,
  extraction_status text default 'pending' check (extraction_status in ('pending', 'completed', 'failed')),
  fields_extracted integer default 0,
  extracted_text text,
  file_url text,
  file_name text,
  uploaded_at timestamptz default now(),
  file_deleted_at timestamptz
);

-- User facts (autofill knowledge base)
create table if not exists user_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  field_key text not null,
  field_value text,
  source text,
  updated_at timestamptz default now(),
  unique (user_id, field_key)
);

-- Embeddings for RAG
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  source_type text,
  source_id uuid,
  content_chunk text,
  created_at timestamptz default now(),
  unique (source_type, source_id)
);
