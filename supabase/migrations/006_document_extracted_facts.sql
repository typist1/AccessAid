alter table if exists documents
add column if not exists extracted_facts jsonb default '{}'::jsonb;
