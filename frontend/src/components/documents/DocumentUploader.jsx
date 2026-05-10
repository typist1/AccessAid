import { useState, useRef } from 'react'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import DocumentTypePicker from './DocumentTypePicker'
import ExtractionReview from './ExtractionReview'

async function fileToBase64(file) {
  if (file.type === 'application/pdf') {
    // Render first PDF page to PNG via pdfjs-dist
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 2.0 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    const dataUrl = canvas.toDataURL('image/png')
    return { fileBase64: dataUrl.split(',')[1], mimeType: 'image/png' }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const [header, b64] = reader.result.split(',')
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type
      resolve({ fileBase64: b64, mimeType })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function DocumentUploader({ onDone }) {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const fileRef = useRef()
  const [file, setFile] = useState(null)
  const [docType, setDocType] = useState('')
  const [stage, setStage] = useState('pick') // pick → uploading → extracting → review → done
  const [facts, setFacts] = useState({})
  const [documentId, setDocumentId] = useState(null)
  const [error, setError] = useState('')

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10MB'); return }
    setFile(f)
    setError('')
  }

  async function handleProcess() {
    if (!file || !docType) return
    setStage('uploading')
    setError('')

    try {
      // Upload to Supabase Storage
      const filePath = `${user.id}/${docType}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage.from('documents').upload(filePath, file)
      if (uploadErr) throw uploadErr

      const { data: doc } = await supabase.from('documents').insert({
        user_id: user.id,
        document_type: docType,
        file_name: file.name,
        file_url: filePath,
        extraction_status: 'pending',
      }).select().single()
      setDocumentId(doc.id)

      // Convert to base64 and send directly to Claude Vision — no OCR step
      setStage('extracting')
      const { fileBase64, mimeType } = await fileToBase64(file)
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/extract/facts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fileBase64, mimeType, documentType: docType, documentId: doc.id }),
      })
      if (!res.ok) throw new Error(`Extraction failed: ${res.status}`)
      const { facts: extracted } = await res.json()
      setFacts(extracted)
      setStage('review')
    } catch (e) {
      setError(e.message)
      toast(`Upload failed: ${e.message}`, 'error')
      setStage('pick')
    }
  }

  async function handleConfirm(confirmedFacts) {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/extract/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ facts: confirmedFacts, documentType: docType, documentId }),
    })
    const fieldCount = Object.keys(confirmedFacts).length
    toast(`Document processed — ${fieldCount} field${fieldCount !== 1 ? 's' : ''} saved to your profile`, 'success')
    setStage('done')
    onDone?.()
  }

  if (stage === 'review') {
    return <ExtractionReview facts={facts} onConfirm={handleConfirm} onCancel={() => setStage('pick')} />
  }

  if (stage === 'done') {
    return (
      <div className="text-center py-8">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-gray-900">Document processed successfully!</p>
        <p className="text-sm text-gray-600 mt-1">Your information has been saved to your profile.</p>
        <Button className="mt-4" onClick={() => { setStage('pick'); setFile(null); setDocType(''); setDocumentId(null) }}>Upload Another</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 space-y-1">
        <p className="font-medium">Your privacy is protected</p>
        <ul className="text-xs space-y-0.5 ml-2">
          <li>• Document encrypted during upload</li>
          <li>• Original file deleted within 24 hours</li>
          <li>• Only extracted facts are saved, never the document</li>
          <li>• We never store full Social Security numbers</li>
        </ul>
      </div>

      <DocumentTypePicker value={docType} onChange={setDocType} />

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Upload File</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          {file ? (
            <p className="text-gray-900 text-sm font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-gray-600">Click to upload or take a photo</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10MB</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {(stage === 'uploading' || stage === 'extracting') && (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <p className="text-sm text-gray-600">
            {stage === 'uploading' ? 'Uploading...' : 'Reading document with AI...'}
          </p>
        </div>
      )}

      {stage === 'pick' && (
        <Button onClick={handleProcess} disabled={!file || !docType}>
          Process Document
        </Button>
      )}
    </div>
  )
}
