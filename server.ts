import express from "express";
import path from "path";
import cors from "cors";
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

startServer();
