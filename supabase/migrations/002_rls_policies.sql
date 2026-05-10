-- Enable RLS on user data tables
alter table user_profile enable row level security;
alter table documents enable row level security;
alter table user_programs enable row level security;
alter table user_facts enable row level security;

-- user_profile policies
create policy "Users access own profile" on user_profile
  for all using (auth.uid() = user_id);

-- documents policies
create policy "Users access own documents" on documents
  for all using (auth.uid() = user_id);

-- user_programs policies
create policy "Users access own program matches" on user_programs
  for all using (auth.uid() = user_id);

-- user_facts policies
create policy "Users access own facts" on user_facts
  for all using (auth.uid() = user_id);

-- programs: public read (no RLS)
-- embeddings: public read (no RLS)

-- Storage: users access only their own files
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;

create policy "Users access own storage files" on storage.objects
  for all using (auth.uid()::text = (storage.foldername(name))[1]);
