import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function chat(messages, model = 'claude-sonnet-4-6') {
  const systemMsg = messages.find(m => m.role === 'system')
  const chatMsgs = messages.filter(m => m.role !== 'system')

  const params = {
    model,
    max_tokens: 1024,
    messages: chatMsgs,
  }
  if (systemMsg) params.system = systemMsg.content

  const res = await client.messages.create(params)
  return res.content[0].text
}

// Accepts image (image/jpeg, image/png, image/webp) or PDF (application/pdf)
export async function extractFromFile(fileBase64, mimeType, prompt) {
  const contentItem = mimeType.startsWith('image/')
    ? { type: 'image', source: { type: 'base64', media_type: mimeType, data: fileBase64 } }
    : { type: 'document', source: { type: 'base64', media_type: mimeType, data: fileBase64 } }

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: [contentItem, { type: 'text', text: prompt }] }],
  })
  return res.content[0].text
}
