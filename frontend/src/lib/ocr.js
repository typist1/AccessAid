import Tesseract from 'tesseract.js'

export async function extractTextFromFile(file, onProgress) {
  if (file.type === 'application/pdf') {
    return extractFromPdf(file, onProgress)
  }
  return extractFromImage(file, onProgress)
}

async function extractFromImage(file, onProgress) {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })
  return text
}

async function extractFromPdf(file, onProgress) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1) // first page only
  const viewport = page.getViewport({ scale: 2 })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise

  return extractFromImage(canvas.toDataURL(), onProgress)
}
