import OpenAI from 'openai'

const qwen = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

export async function chat(messages, model = 'qwen-plus') {
  const res = await qwen.chat.completions.create({ model, messages })
  return res.choices[0].message.content
}

export async function embed(text) {
  const res = await qwen.embeddings.create({
    model: 'text-embedding-v3',
    input: text,
  })
  return res.data[0].embedding
}
