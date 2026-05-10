import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Sidebar from '../../components/layout/Sidebar'
import DocumentUploader from '../../components/documents/DocumentUploader'
import ExtractionReview from '../../components/documents/ExtractionReview'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'

function getFileKind(doc) {
  const name = (doc.file_name || doc.file_url || '').toLowerCase()
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return 'image'
  if (/\.pdf$/i.test(name)) return 'pdf'
  return 'other'
}

export default function Documents() {
  const { t } = useTranslation()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [docs, setDocs] = useState([])
  const [showUploader, setShowUploader] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [reviewDoc, setReviewDoc] = useState(null)
  const [reviewFacts, setReviewFacts] = useState({})
  const [reviewLoading, setReviewLoading] = useState(false)

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
    if (!window.confirm(t('documents.delete_confirm', { name: doc.file_name || t('documents.document_fallback') }))) return

    if (doc.file_url) {
      await supabase.storage.from('documents').remove([doc.file_url])
    }
    await supabase.from('documents').delete().eq('id', doc.id)
    toast('Document deleted', 'success')
    await fetchDocs()
  }

  async function handleViewDoc(doc) {
    if (!doc.file_url) return
    setPreviewDoc(doc)
    setPreviewLoading(true)
    setPreviewUrl('')

    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_url, 60 * 15)

    if (error || !data?.signedUrl) {
      toast(t('documents.preview_error'), 'error')
      setPreviewDoc(null)
      setPreviewLoading(false)
      return
    }

    setPreviewUrl(data.signedUrl)
    setPreviewLoading(false)
  }

  async function handleReviewDoc(doc) {
    setReviewDoc(doc)
    setReviewLoading(true)

    const savedFacts = doc.extracted_facts && typeof doc.extracted_facts === 'object'
      ? doc.extracted_facts
      : {}

    if (Object.keys(savedFacts).length > 0) {
      setReviewFacts(savedFacts)
      setReviewLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('user_facts')
      .select('field_key, field_value')
      .eq('user_id', user.id)
      .eq('source', doc.document_type)

    if (error) {
      toast(t('documents.review_error'), 'error')
      setReviewDoc(null)
      setReviewLoading(false)
      return
    }

    const fallbackFacts = Object.fromEntries((data ?? []).map(item => [item.field_key, item.field_value]))
    setReviewFacts(fallbackFacts)
    setReviewLoading(false)
  }

  async function handleSaveReviewedFacts(confirmedFacts) {
    if (!reviewDoc) return

    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/extract/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        facts: confirmedFacts,
        documentType: reviewDoc.document_type,
        documentId: reviewDoc.id,
      }),
    })

    if (!res.ok) {
      toast(t('documents.review_save_error'), 'error')
      return
    }

    toast(t('documents.review_saved'), 'success')
    setReviewDoc(null)
    await fetchDocs()
  }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('documents.title')}</h1>
            <p className="text-gray-600 mt-1">{t('documents.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowUploader(v => !v)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {showUploader ? t('documents.cancel_btn') : t('documents.upload_btn')}
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
              <p>{t('documents.empty')}</p>
            </div>
          )}
          {docs.map(doc => (
            <Card key={doc.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">{doc.file_name || t('documents.document_fallback')}</p>
                <p className="text-xs text-gray-500">
                  {doc.document_type?.replace(/_/g, ' ')} · {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
                {doc.fields_extracted > 0 && (
                  <p className="text-xs text-green-600 mt-0.5">{t('documents.fields_extracted', { count: doc.fields_extracted })}</p>
                )}
                {doc.file_url === null && (
                  <p className="text-xs text-gray-400 mt-0.5">{t('documents.privacy_note')}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  doc.extraction_status === 'completed' ? 'strong' :
                  doc.extraction_status === 'failed' ? 'unlikely' : 'possible'
                }>
                  {doc.extraction_status}
                </Badge>
                {doc.file_url && (
                  <button
                    onClick={() => handleViewDoc(doc)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {t('documents.view_file_btn')}
                  </button>
                )}
                <button
                  onClick={() => handleReviewDoc(doc)}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  {t('documents.review_output_btn')}
                </button>
                <button
                  onClick={() => handleDeleteDoc(doc)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {t('documents.delete_btn')}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(previewDoc)}
        onClose={() => { setPreviewDoc(null); setPreviewUrl('') }}
        title={previewDoc?.file_name || t('documents.document_fallback')}
        panelClassName="max-w-5xl"
      >
        {previewLoading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {!previewLoading && previewDoc && previewUrl && (
          <div className="flex flex-col gap-4">
            {getFileKind(previewDoc) === 'image' && (
              <img
                src={previewUrl}
                alt={previewDoc.file_name || t('documents.document_fallback')}
                className="max-h-[75vh] w-full rounded-lg object-contain bg-stone-50"
              />
            )}
            {getFileKind(previewDoc) === 'pdf' && (
              <iframe
                src={previewUrl}
                title={previewDoc.file_name || t('documents.document_fallback')}
                className="h-[75vh] w-full rounded-lg border border-gray-200"
              />
            )}
            {getFileKind(previewDoc) === 'other' && (
              <div className="rounded-lg bg-stone-50 p-6 text-sm text-gray-600">
                {t('documents.preview_unavailable')}
              </div>
            )}
            <div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {t('documents.open_new_tab')}
              </a>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(reviewDoc)}
        onClose={() => setReviewDoc(null)}
        title={t('documents.review_modal_title')}
      >
        {reviewLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <ExtractionReview
            facts={reviewFacts}
            onConfirm={handleSaveReviewedFacts}
            onCancel={() => setReviewDoc(null)}
          />
        )}
      </Modal>
    </Sidebar>
  )
}
