create extension if not exists vector;

alter table embeddings add column if not exists embedding vector(1536);

create index if not exists embeddings_embedding_idx
  on embeddings using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Function for cosine similarity search (used by ragService)
create or replace function match_embeddings(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  source_type text,
  source_id uuid,
  content_chunk text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_type,
    source_id,
    content_chunk,
    1 - (embedding <=> query_embedding) as similarity
  from embeddings
  order by embedding <=> query_embedding
  limit match_count;
$$;
