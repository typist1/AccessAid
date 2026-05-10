import { useState, useEffect } from 'react'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Sidebar from '../../components/layout/Sidebar'
import DocumentUploader from '../../components/documents/DocumentUploader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function Documents() {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [docs, setDocs] = useState([])
  const [showUploader, setShowUploader] = useState(false)

  useEffect(() => { fetchDocs() }, [])

  async function fetchDocs() {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
    setDocs(data ?? [])
  }

  async function handleDeleteDoc(doc) {
    if (!window.confirm(`Delete "${doc.file_name || 'this document'}"? Extracted facts will remain in your profile.`)) return

    if (doc.file_url) {
      await supabase.storage.from('documents').remove([doc.file_url])
    }
    await supabase.from('documents').delete().eq('id', doc.id)
    toast('Document deleted', 'success')
    await fetchDocs()
  }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Upload documents to auto-fill your applications.</p>
          </div>
          <button
            onClick={() => setShowUploader(v => !v)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {showUploader ? 'Cancel' : '+ Upload Document'}
          </button>
        </div>

        {showUploader && (
          <Card>
            <DocumentUploader onDone={() => { setShowUploader(false); fetchDocs() }} />
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {docs.length === 0 && !showUploader && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📄</p>
              <p>No documents yet. Upload one to auto-fill your applications.</p>
            </div>
          )}
          {docs.map(doc => (
            <Card key={doc.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">{doc.file_name || 'Document'}</p>
                <p className="text-xs text-gray-500">
                  {doc.document_type?.replace(/_/g, ' ')} · {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
                {doc.fields_extracted > 0 && (
                  <p className="text-xs text-green-600 mt-0.5">{doc.fields_extracted} fields extracted</p>
                )}
                {doc.file_url === null && (
                  <p className="text-xs text-gray-400 mt-0.5">Original file deleted (privacy)</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  doc.extraction_status === 'completed' ? 'strong' :
                  doc.extraction_status === 'failed' ? 'unlikely' : 'possible'
                }>
                  {doc.extraction_status}
                </Badge>
                <button
                  onClick={() => handleDeleteDoc(doc)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Sidebar>
  )
}
