import { GoogleGenAI } from "@google/genai"

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const MODEL = "gemini-2.0-flash"
