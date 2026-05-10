import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM' // Rachel - stable multilingual voice

router.post('/synthesize', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'text required' })

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )

    if (!elevenRes.ok) {
      const err = await elevenRes.text()
      return res.status(502).json({ error: 'ElevenLabs error', detail: err })
    }

    const audioBuffer = await elevenRes.arrayBuffer()
    res.set('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(audioBuffer))
  } catch (err) {
    next(err)
  }
})

// STT: receive base64 audio, forward to ElevenLabs Scribe, return transcript
router.post('/transcribe', requireAuth, async (req, res, next) => {
  try {
    const { audio, mimeType = 'audio/webm' } = req.body
    if (!audio) return res.status(400).json({ error: 'audio required' })

    const audioBuffer = Buffer.from(audio, 'base64')
    // Strip codec params — use base mime type for filename extension matching
    const baseMime = mimeType.split(';')[0].trim()
    const ext = baseMime.split('/')[1] || 'webm'

    // Must use File (not Blob) — ElevenLabs requires a named file in multipart
    const file = new File([audioBuffer], `recording.${ext}`, { type: baseMime })
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model_id', 'scribe_v1')

    // Do NOT set Content-Type — fetch sets it automatically with correct boundary
    const elevenRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
      body: formData,
    })

    if (!elevenRes.ok) {
      const err = await elevenRes.text()
      console.error('ElevenLabs STT error:', elevenRes.status, err)
      return res.status(502).json({ error: 'Transcription failed', detail: err })
    }

    const data = await elevenRes.json()
    res.json({ text: data.text ?? '', language_code: data.language_code ?? null })
  } catch (err) {
    next(err)
  }
})

export default router
