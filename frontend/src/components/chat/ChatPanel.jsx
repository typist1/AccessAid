import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import supabase from '../../lib/supabase'

const MicIcon = ({ recording, transcribing }) => {
  if (transcribing) return <Spinner size={4} />
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={recording ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}

const SpeakerIcon = ({ playing }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={playing ? '#3b82f6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    {playing
      ? <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
      : <line x1="23" y1="9" x2="17" y2="15"/>}
  </svg>
)

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .trim()
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function ChatPanel({ programName, programContext }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const disclaimer = t('chat.disclaimer')
  const greeting = programName
    ? t('chat.greeting_program', { programName }) + disclaimer
    : t('chat.greeting_general') + disclaimer

  const { history, loading, sendMessage } = useChat(programContext, greeting)
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const bottomRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const currentAudioRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  // Cleanup mic stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const speakText = useCallback(async (text) => {
    if (!voiceEnabled) return
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    const cleanText = stripMarkdown(text)
    setSpeaking(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/voice/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text: cleanText }),
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      currentAudioRef.current = audio
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => setSpeaking(false)
      await audio.play()
    } catch {
      // Fallback to browser Web Speech API when ElevenLabs unavailable
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(cleanText)
        utter.onend = () => setSpeaking(false)
        utter.onerror = () => setSpeaking(false)
        window.speechSynthesis.speak(utter)
      } else {
        setSpeaking(false)
      }
    }
  }, [voiceEnabled])

  function stopSpeaking() {
    currentAudioRef.current?.pause()
    currentAudioRef.current = null
    setSpeaking(false)
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        // Stop all mic tracks
        stream.getTracks().forEach(t => t.stop())

        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' })
        chunksRef.current = []

        if (blob.size === 0) return

        setTranscribing(true)
        try {
          const base64 = await blobToBase64(blob)
          const { data: { session } } = await supabase.auth.getSession()
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/voice/transcribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ audio: base64, mimeType: mediaRecorder.mimeType || 'audio/webm' }),
          })
          const data = await res.json()
          if (!res.ok) {
            console.error('Transcription error:', data)
          } else if (data.text) {
            setInput(data.text)
          }
        } catch (err) {
          console.error('Transcription failed:', err)
        } finally {
          setTranscribing(false)
        }
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      alert(t('chat.mic_denied'))
      console.error(err)
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function handleSend(e) {
    e?.preventDefault()
    const msg = input.trim()
    if (!msg || loading || transcribing) return
    setInput('')

    const result = await sendMessage(msg)

    if (result?.navigate_to) {
      navigate(result.navigate_to)
      return
    }

    if (result?.response) {
      const speakable = result.response.replace(/\n\n_.*?_$/s, '').trim()
      speakText(speakable)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const micBusy = recording || transcribing
  const statusText = transcribing
    ? t('chat.status_transcribing')
    : recording
    ? t('chat.status_recording')
    : t('chat.status_idle')

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {programName ? t('chat.title_program', { programName }) : t('chat.title_general')}
          </p>
          <p className="text-xs text-gray-500">{statusText}</p>
        </div>
        <button
          onClick={() => { setVoiceEnabled(v => !v); if (speaking) stopSpeaking() }}
          title={voiceEnabled ? t('chat.voice_disable_title') : t('chat.voice_enable_title')}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
        >
          <SpeakerIcon playing={speaking} />
          <span>{voiceEnabled ? t('chat.voice_on') : t('chat.voice_off')}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {history.map((msg, i) => <ChatMessage key={i} {...msg} />)}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <Spinner size={4} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          rows={1}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={loading || micBusy}
          style={{ minHeight: '38px', maxHeight: '120px' }}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          disabled={loading || transcribing}
          title={recording ? t('chat.mic_stop_title') : t('chat.mic_start_title')}
          className={`flex-shrink-0 p-2 rounded-lg border transition-colors ${
            recording
              ? 'border-red-300 bg-red-50 text-red-500 animate-pulse'
              : transcribing
              ? 'border-yellow-300 bg-yellow-50 text-yellow-600'
              : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400'
          }`}
        >
          <MicIcon recording={recording} transcribing={transcribing} />
        </button>
        <Button type="submit" disabled={loading || !input.trim() || micBusy} className="px-3 flex-shrink-0">
          {t('common.send')}
        </Button>
      </form>
    </div>
  )
}
