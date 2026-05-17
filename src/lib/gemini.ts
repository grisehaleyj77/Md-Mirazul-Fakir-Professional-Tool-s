import { GoogleGenAI } from "@google/genai";

// Standardize API key access for local, Netlify, and other deployments
// In this specific environment, process.env.GEMINI_API_KEY is the source of truth for free tier
// process.env.API_KEY is the source of truth for user-selected paid keys
export const GEMINI_API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
