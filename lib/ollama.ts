export const MODEL = "llama3.1:8b"
const OLLAMA_URL = "http://localhost:11434"

export async function ollamaGenerate(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, options: { num_predict: 4096 } }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Ollama ${res.status}: ${body}`)
  }
  const data = (await res.json()) as { response: string }
  return data.response
}
