import supabaseAdmin from '../lib/supabaseAdmin.js'

export async function cleanupExpiredDocuments() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: expiredDocs } = await supabaseAdmin
    .from('documents')
    .select('id, file_url, user_id')
    .lt('uploaded_at', cutoff)
    .not('file_url', 'is', null)

  if (!expiredDocs?.length) {
    console.log('Cleanup: no expired documents found')
    return
  }

  for (const doc of expiredDocs) {
    try {
      const { error: storageErr } = await supabaseAdmin.storage
        .from('documents')
        .remove([doc.file_url])

      if (storageErr) {
        console.error(`Cleanup: storage delete failed for doc ${doc.id}:`, storageErr.message)
      }

      await supabaseAdmin.from('documents')
        .update({ file_url: null, file_deleted_at: new Date().toISOString() })
        .eq('id', doc.id)
    } catch (err) {
      console.error(`Cleanup: failed for doc ${doc.id}:`, err.message)
    }
  }

  console.log(`Cleanup: processed ${expiredDocs.length} expired documents`)
}
