import { GoogleGenAI } from "@google/genai";

// Standardize API key access for local, Netlify, and other deployments
// Vite uses import.meta.env, while process.env might be used in some environments
export const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || (process.env.GEMINI_API_KEY as string) || "";

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
