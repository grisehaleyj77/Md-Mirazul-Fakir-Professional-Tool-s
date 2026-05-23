import express from "express";
import path from "path";
import cors from "cors";
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(cors());
app.use(express.json());

  app.post("/api/social-audit", async (req, res) => {
    const { platform, username } = req.body;
    if (!platform || !username) {
      return res.status(400).json({ error: "Platform and Username are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from environment');
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment." });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Fetch and analyze the social media statistics for the ${platform} account: ${username}. 
        Return a detailed JSON object containing:
        - followers (number)
        - totalViews (number or estimated string)
        - engagementRate (percentage string)
        - grade (A+, A, B, etc.)
        - estimatedMonthlyEarnings (range string)
        - recentGrowth (array of 7 objects with {date, count})
        - topContentSummary (brief string)
        - viralPotential (0-100)
        
        Ensure the data is as accurate as current web knowledge allows. if specific numbers are private, provide high-quality estimates based on publicly available metadata.`,
        config: {
          systemInstruction: "You are a professional social media analyst. provide the most likely figures based on publicly available metadata and common patterns for channels of this size. Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              followers: { type: Type.STRING },
              totalViews: { type: Type.STRING },
              engagementRate: { type: Type.STRING },
              grade: { type: Type.STRING },
              estimatedMonthlyEarnings: { type: Type.STRING },
              recentGrowth: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    count: { type: Type.NUMBER }
                  }
                }
              },
              topContentSummary: { type: Type.STRING },
              viralPotential: { type: Type.NUMBER }
            }
          }
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Social Audit error:', error);
      // Propagate the specific error message to help diagnostics
      const errorMessage = error.message || "Failed to perform audit.";
      res.status(500).json({ error: `AI Audit failed: ${errorMessage}. Please check if the channel is public.` });
    }
  });

  app.post("/api/shorten", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.shorturl) {
        res.json({ shortUrl: data.shorturl });
      } else {
        res.status(500).json({ error: data.errormessage || "Failed to shorten URL" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/youtube-transcript", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      res.json({ transcript });
    } catch (error: any) {
      console.error('Transcript fetch error:', error);
      res.status(500).json({ error: error.message || "Failed to fetch transcript. Ensure the video exists and has captions enabled." });
    }
  });

  app.post("/api/grammar-check", async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Analyze the following text for grammar, spelling, and style errors. Provide the original text, the corrected text, and a list of specific errors found with explanations.
        
        Text: "${text}"`,
        config: {
          systemInstruction: "You are an expert English proofreader. Analyze text for errors. Return ONLY a JSON object containing 'original', 'corrected', and an array 'errors' where each error has 'type' (grammar, spelling, style), 'original', 'fix', and 'explanation'.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              corrected: { type: Type.STRING },
              errors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    original: { type: Type.STRING },
                    fix: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  }
                }
              },
              overallFeedback: { type: Type.STRING }
            }
          }
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Grammar check error:', error);
      res.status(500).json({ error: "AI analysis failed. Please try again later." });
    }
  });

  app.post("/api/rewrite", async (req, res) => {
    const { text, tone, intensity, audience, excludeWords, mode } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const audienceStr = audience ? `for ${audience} audience` : "";
      const avoidStr = excludeWords ? `strictly avoiding the following words: ${excludeWords}` : "";
      const toneModeStr = tone ? `rewritten in a ${tone} tone` : "rewritten";
      const intensityStr = intensity ? `using ${intensity} level of rewriting intensity (where 'word' means local substitutions, 'sentence' means sentence structures rewritten, and 'full' means complete content reorganization)` : "";
      const rewriteModeStr = mode && mode !== 'rewrite' ? `Applying action: ${mode} the text (e.g. summarize, expand, simplify, shorten)` : "";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Please rewrite, restructure, or format the following article/text:
        
        Text to process:
        "${text}"
        
        Requirements:
        1. It must be ${toneModeStr} ${audienceStr}.
        2. ${intensityStr}
        3. ${avoidStr}
        4. ${rewriteModeStr}
        
        Provide the processed result along with analytical parameters as requested in the schema. Check grammar and polish style to be flawless.`,
        config: {
          systemInstruction: "You are a professional editor and copywriter. Analyze the original text and rebuild it of the highest-caliber according to instructions. Produce 2 alternative stylistic variations inside 'alternatives'. Provide accurate word count checks (under wordCount.before and wordCount.after). Return ONLY a JSON object matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              rewritten: { type: Type.STRING },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: { type: Type.STRING },
                    text: { type: Type.STRING }
                  }
                }
              },
              readability: {
                type: Type.OBJECT,
                properties: {
                  before: { type: Type.STRING },
                  after: { type: Type.STRING }
                }
              },
              wordCount: {
                type: Type.OBJECT,
                properties: {
                  before: { type: Type.NUMBER },
                  after: { type: Type.NUMBER }
                }
              },
              uniquenessEstimation: { type: Type.NUMBER },
              toneAnalysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  }
                }
              },
              improvementsApplied: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["original", "rewritten", "alternatives", "readability", "wordCount", "uniquenessEstimation", "toneAnalysis", "improvementsApplied"]
          }
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Article rewriter error:', error);
      res.status(500).json({ error: "Rewriting analysis failed. Please try again later." });
    }
  });

  app.post("/api/text-to-hashtags", async (req, res) => {
    const { text, platform, count, style } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const platformStr = platform || "Instagram";
      const countNum = count || 30;
      const formattingStyle = style || "CamelCase"; // lowercase, CamelCase, etc.

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Process the following text to generate optimized social media hashtags.
        
        Text to convert:
        "${text}"
        
        Requirements:
        1. Tailored specifically for the ${platformStr} platform.
        2. Deliver up to ${countNum} hashtags sorted into thematic categories.
        3. Make sure all hashtags are styled with "${formattingStyle}" formatting (e.g. CamelCase like #SunsetBeach or lowercase like #sunsetbeach).
        4. Exclude symbols, punctuation, and spaces from inside the tags. Make sure each starts with exactly one '#'.`,
        config: {
          systemInstruction: "You are an expert social media and SEO engine. Extract and generate contextual hashtags from text. Return a JSON structure representing categories: 'broad' (high-volume generic tags), 'core' (direct representations of keywords in the text), 'niche' (highly relevant specific search phrases), and 'trending' (high growth community terms). Also include a 'recommendedLayout' string showing a professional layout (text + spacer + hashtags block). Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              broad: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              core: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              niche: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              trending: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedLayout: { type: Type.STRING },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  primaryCategory: { type: Type.STRING },
                  optimalCountWarning: { type: Type.STRING },
                  sentimentTag: { type: Type.STRING }
                }
              }
            },
            required: ["broad", "core", "niche", "trending", "recommendedLayout"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Text to Hashtags error:', error);
      res.status(500).json({ error: "AI hashtag processing failed. Please try again." });
    }
  });

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export { app };
