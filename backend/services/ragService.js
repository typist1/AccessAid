import { embed } from './qwen.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'

export async function getRelevantChunks(query) {
  const queryEmbedding = await embed(query)

  const { data, error } = await supabaseAdmin.rpc('match_embeddings', {
    query_embedding: queryEmbedding,
    match_count: 5,
  })

  if (error) throw error
  return data.map(row => row.content_chunk).join('\n\n')
}
