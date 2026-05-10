import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

const DISCLAIMER = '\n\n_This is informational guidance only and does not constitute legal or financial advice._'

export default function ChatPanel({ programName, programContext }) {
  const greeting = programName
    ? `I'm here to help with your **${programName}** application. Ask me anything about a field, what information you need, or whether you qualify.${DISCLAIMER}`
    : `Ask me about any benefits programs you may qualify for. I can explain eligibility, required documents, or help you navigate the application process.${DISCLAIMER}`

  const { history, loading, sendMessage } = useChat(programContext, greeting)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="font-medium text-gray-900 text-sm">
          {programName ? `Applying for ${programName}` : 'Benefits Assistant'}
        </p>
        <p className="text-xs text-gray-500">Ask anything about this program</p>
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

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()} className="px-3">
          Send
        </Button>
      </form>
    </div>
  )
}
