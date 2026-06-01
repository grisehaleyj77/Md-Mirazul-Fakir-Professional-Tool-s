import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// Lazy initialize Gemini client to avoid crashes if the key isn't set yet on startup,
// and to dynamically pick up the key if it gets updated in settings.
let _aiInstance: GoogleGenAI | null = null;
function getAi() {
  const currentKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!currentKey) {
    throw new Error("Gemini API key is not configured in the application environment.");
  }
  if (!_aiInstance) {
    _aiInstance = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return _aiInstance;
}

// Proxied 'ai' handler for server-side endpoints
const ai: any = new Proxy({}, {
  get(target, prop) {
    try {
      const client = getAi();
      const val = (client as any)[prop];
      if (typeof val === 'function') {
        return val.bind(client);
      }
      return val;
    } catch (err: any) {
      return new Proxy({}, {
        get(_, subProp) {
          if (typeof subProp === 'string') {
            return (...args: any[]) => {
              throw new Error("Gemini API key is not configured in the application environment. Please configure your key in Settings.");
            };
          }
          return undefined;
        }
      });
    }
  }
});

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Secure proxy endpoint for any direct client-side Gemini requests
app.post("/api/gemini/generate-proxy", async (req, res) => {
  try {
    const params = req.body;
    const response = await ai.models.generateContent(params);
    res.json({
      text: response.text,
      candidates: response.candidates
    });
  } catch (err: any) {
    console.error("Gemini Proxy Error:", err);
    res.status(500).json({ error: err.message || "Gemini execution failed" });
  }
});

app.get("/api/debug-env", (req, res) => {
  res.json({
    keys: Object.keys(process.env).sort(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasApiKey: !!process.env.API_KEY
  });
});

  app.post("/api/social-audit", async (req, res) => {
    const { platform, username } = req.body;
    if (!platform || !username) {
      return res.status(400).json({ error: "Platform and Username are required" });
    }

    const appApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!appApiKey) {
      console.error('Gemini API key is missing from environment');
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment. Please configure your key in settings." });
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

  app.post("/api/picture-to-prompt", async (req, res) => {
    const { image, mimeType, engine, style, detailLevel } = req.body;

    if (!image) {
      return res.status(400).json({ error: "An image base64 payload is required" });
    }

    const appApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!appApiKey) {
      console.error('Gemini API key is missing from environment');
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment. Please configure your key in settings." });
    }

    try {
      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: image,
        },
      };

      const textPart = {
        text: `Analyze the provided image in detail and generate optimized generative art prompts tailored for:
        - Target Generator Engine: "${engine || 'General / Stable Diffusion'}"
        - Desired Style Influence: "${style || 'Preserve Original Style'}"
        - Prompt Detail / Complexity Level: "${detailLevel || 'Hyper-detailed Prompt'}"

        Extract and synthesize:
        1. "masterPrompt": A fully developed text prompt starting with the main subject, then adding the style, artistic medium, composition, ultra-fine details, lighting, color palette, and high-quality rendering modifiers (e.g., 8k, Octane render, volumetric atmosphere) tailored specifically for ${engine || 'Midjourney/Stable Diffusion'}.
        2. "negativePrompt": Propose a high-quality negative prompt that includes artifacts to avoid (e.g. text, watermarks, bad anatomy, blur, duplicate items).
        3. "aestheticAnalysis": Broken down into:
           - subject: description of the primary subject.
           - lighting: lighting scheme (e.g., golden hour, rim light, ambient cyberpunk neon, mood).
           - colors: array of 4-6 primary hex colors or shade descriptions observed.
           - composition: layout perspective (e.g., first-person, macro close-up, rule of thirds, dynamic angle).
           - styleAndMedium: artistic medium specified (e.g., watercolor, 3D model, DSLR photography, pixel art).
        4. "keyTags": 6-8 descriptive tag keywords about the scene.
        5. "variants": 3 distinct alternative prompt ideas representing:
           - Minimalist or Abstract representation.
           - A highly theatrical, dramatic or cyberpunk interpretation.
           - A cinematic retro analog photography portrait representation.
        6. "designSummary": An elegant, brief human-like artistic summary detailing the visual poetry and soul of the image's layout.`,
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are an elite, professional Prompt Engineer, Art Director, and Generative Art Specialist. Your task is to extract, audit, and rewrite image aesthetics into the highest-tier artificial intelligence text prompts. Ensure prompts are structured perfectly with powerful imagery and clear style modifiers. Return ONLY valid JSON matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              masterPrompt: { type: Type.STRING },
              negativePrompt: { type: Type.STRING },
              aestheticAnalysis: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  lighting: { type: Type.STRING },
                  colors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  composition: { type: Type.STRING },
                  styleAndMedium: { type: Type.STRING }
                },
                required: ["subject", "lighting", "colors", "composition", "styleAndMedium"]
              },
              keyTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              variants: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["style", "prompt", "description"]
                }
              },
              designSummary: { type: Type.STRING }
            },
            required: ["masterPrompt", "negativePrompt", "aestheticAnalysis", "keyTags", "variants", "designSummary"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Picture to Prompt API error:', error);
      res.status(500).json({ error: "AI image deconstruction failed. Please ensure your image is under 15MB and try again." });
    }
  });

  app.post("/api/generate-gmail-names", async (req, res) => {
    const { firstName, lastName, profession, stylePreset, customSuffix, useDots, numberType } = req.body;

    if (!firstName && !lastName) {
      return res.status(400).json({ error: "At least First Name or Last Name is required" });
    }

    const appApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!appApiKey) {
      console.error('Gemini API key is missing from environment');
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment. Please configure your key in settings." });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a list of professional, highly memorable, and creative Gmail address suggestions based on:
        - First Name: "${firstName || ''}"
        - Last Name: "${lastName || ''}"
        - Profession/Industry: "${profession || 'General/Personal'}"
        - Style Preset: "${stylePreset || 'Standard Professional'}"
        - Custom Suffix Keywords: "${customSuffix || ''}"
        - Separator Preference (use dots): ${useDots ? 'Yes' : 'No'}
        - Number Integration: "${numberType || 'None'}"
        
        Provide up to 10 distinct, elegant suggestions, partitioned across categories (Professional, Creative, Tech/Modern, Short/Classic, Corporate).
        Calculate scores (0-100) for professional suitability and memorability. Also list whether the combination is 'highly likely available' (isLikelyAvailable: true) or standard.`,
        config: {
          systemInstruction: `You are an expert digital identity branding consultant specializing in creating professional email handles.
          Your task is to suggest clean, high-caliber, premium Gmail structures avoiding numbers unless requested or highly strategic.
          Ensure names are easy to pronounce and remember. Return ONLY a JSON object containing 'suggestions' (an array of suggestion objects containing 'email', 'category', 'professionalScore', 'memorabilityScore', 'pronunciation', 'isLikelyAvailable', and 'explanation'), 'namingTips' (an array of objects containing 'title' and 'content' for email naming best practices), and an overall 'brandStatement'.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    email: { type: Type.STRING },
                    category: { type: Type.STRING },
                    professionalScore: { type: Type.NUMBER },
                    memorabilityScore: { type: Type.NUMBER },
                    pronunciation: { type: Type.STRING },
                    isLikelyAvailable: { type: Type.BOOLEAN },
                    explanation: { type: Type.STRING }
                  },
                  required: ["email", "category", "professionalScore", "memorabilityScore", "pronunciation", "isLikelyAvailable", "explanation"]
                }
              },
              namingTips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING }
                  },
                  required: ["title", "content"]
                }
              },
              brandStatement: { type: Type.STRING }
            },
            required: ["suggestions", "namingTips", "brandStatement"]
          }
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Gmail generator API error:', error);
      res.status(500).json({ error: "AI Gmail name compilation failed. Please try again." });
    }
  });

  // Mega AI Article Writer & SEO Engine Endpoint
  app.post("/api/ai-writer/generate", async (req, res) => {
    const { 
      topic, 
      tone, 
      wordCountSetting, 
      guidelines, 
      featuredSnippetTarget,
      targetGeo,
      targetFaqsCount,
      enableEeat,
      internalLinkTargets
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic / title is required for generating articles." });
    }

    const appApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!appApiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment." });
    }

    try {
      // Craft a strategic prompt to encourage Gemini to produce extremely deep, detailed, and comprehensive multi-chapter contents
      // to hit the massive 5000+ word density requested by the user.
      const wordPromptInstruction = wordCountSetting === 'mega' 
        ? "WRITE AN EXHAUSTIVE, MASSIVE, HYPER-DETAILED ARTICLE OF AT LEAST 5000 WORDS. Break it down into 8-10 major, deep chapters. Include multiple case studies, extensive paragraphs, structured tables, comparison logs, and expansive expert descriptions for every outline point to maximize length, richness, and depth."
        : "Write a comprehensive long-form article of approximately 2000-3000 words broken down into several deep chapters.";

      const eeatInstruction = enableEeat 
        ? "Enhance with solid EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) parameters: include a medical/professional disclaimer, author experience background statement, and verifiable expert authority source recommendations." 
        : "";

      const prompt = `Create an exceptionally deep, modern, SEO-optimized, in-depth article about this topic: "${topic}"
      
      User Guidelines/Guidelines to include:
      "${guidelines || 'No specific input. Use general high-quality topics.'}"
      
      SEO Specific Requirements:
      - Featured Snippet Target Query: "${featuredSnippetTarget || 'General lookup definition'}"
      - Local GEO Optimization Targets: "${targetGeo || 'None. Global search focus'}"
      - Internal Link Anchor Suggestions to incorporate: "${internalLinkTargets || 'None'}"
      - Target FAQs to produce: ${targetFaqsCount || 5} questions.
      
      Formatting & Scope directives:
      1. ${wordPromptInstruction}
      2. Keep it newbie-friendly, engaging and highly scannable using elegant H2, H3 headings, bold texts, list items, and summary callouts.
      3. ${eeatInstruction}
      4. Avoid boilerplate AI text. It must read like human expert-written copy.
      
      Return a solid JSON response matching the schema with all required parameters.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, world-class SEO content lead and master copywriter. Your job is to output exhaustive, extremely long (5000+ words) fully formed markdown articles mapped into pristine web structures. Fill the 'articleText' parameter with the entire written article. Ensure every field is filled in detail without placeholders. Return ONLY valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              articleText: { 
                type: Type.STRING, 
                description: "The complete, massive written article formatted elegantly in Markdown. Include 8-10 expansive chapters with comprehensive explanations, tables, and case studies." 
              },
              actualWordCount: { type: Type.NUMBER },
              featuredSnippet: {
                type: Type.OBJECT,
                properties: {
                  targetQuery: { type: Type.STRING },
                  optimizedAnswer: { type: Type.STRING, description: "Highly polished 45-60 word precise answer perfect for Google Featured Snippets." },
                  schemaMarkupPlaceholder: { type: Type.STRING, description: "Recommended Schema.org JSON-LD snippet placeholder." }
                },
                required: ["targetQuery", "optimizedAnswer"]
              },
              faqs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ["question", "answer"]
                }
              },
              eeatSignals: {
                type: Type.OBJECT,
                properties: {
                  authorBioNote: { type: Type.STRING },
                  disclosureStatement: { type: Type.STRING },
                  citationSourcesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              geoOptimizerData: {
                type: Type.OBJECT,
                properties: {
                  localKeywordsGeo: { type: Type.ARRAY, items: { type: Type.STRING } },
                  localIntentParagraphSuggestion: { type: Type.STRING }
                }
              },
              aeoOptimizerData: {
                type: Type.OBJECT,
                properties: {
                  voiceQueryMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                  conversationalDirectAnswers: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              llmSummary: { 
                type: Type.STRING, 
                description: "Short 150-word synopsis optimized for AI/LLM answer engines like Search Generative Experience." 
              },
              nlpEntities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    entity: { type: Type.STRING, description: "Proper noun or key entity name" },
                    type: { type: Type.STRING, description: "Person, Organization, Concept, Event, Location" },
                    idealTFIDFValue: { type: Type.STRING }
                  }
                }
              },
              internalLinkAnchorSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    anchorText: { type: Type.STRING },
                    targetUrlTopic: { type: Type.STRING }
                  }
                }
              },
              unsplashSearchTerm: { 
                type: Type.STRING, 
                description: "2-3 highly specific keywords that describe a pristine, descriptive Unsplash/stock photo matching this article perfectly." 
              },
              suggestedAIGenerationPrompt: { 
                type: Type.STRING, 
                description: "High-quality detailed text-to-image prompt to generate a matching illustration or banner." 
              }
            },
            required: [
              "articleText", 
              "actualWordCount", 
              "featuredSnippet", 
              "faqs", 
              "eeatSignals", 
              "geoOptimizerData", 
              "aeoOptimizerData", 
              "llmSummary", 
              "nlpEntities", 
              "internalLinkAnchorSuggestions",
              "unsplashSearchTerm",
              "suggestedAIGenerationPrompt"
            ]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error('Mega Writer Gen error:', error);
      res.status(500).json({ error: `AI content compilation failed: ${error.message || error}` });
    }
  });

  // Endpoint for Custom AI Content Image generation / match loading
  app.post("/api/ai-writer/generate-image", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "An image prompt text is required." });
    }

    try {
      // Use the gemini-2.5-flash-image model as standard for image generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `${prompt}, photorealistic, stunning illustration, detailed high definition photography concept` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let base64Img = "";
      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            base64Img = part.inlineData.data;
            break;
          }
        }
      }

      if (base64Img) {
        res.json({ imageUrl: `data:image/png;base64,${base64Img}` });
      } else {
        res.status(500).json({ error: "Failed to extract image generation data from response model." });
      }
    } catch (e: any) {
      console.warn("Gemini image generation model failed (likely due to free tier key constraint or general error):", e);
      // Fail gently: return null so client uses high-grade Unsplash/Picsum tags as requested
      res.json({ imageUrl: null, warning: "Custom generator mode requires premium API parameters. Stock asset search model applied instead!" });
    }
  });

  // Helper to fetch remote image URL or process existing data URL into base64
  async function getBase64FromUrlOrBase64(input: string): Promise<{ data: string; mimeType: string }> {
    if (input.startsWith("data:")) {
      const matches = input.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
      if (matches && matches.length === 3) {
        return {
          mimeType: matches[1],
          data: matches[2]
        };
      }
      const commaIndex = input.indexOf(",");
      if (commaIndex !== -1) {
        const mime = input.substring(5, input.indexOf(";"));
        const data = input.substring(commaIndex + 1);
        return { mimeType: mime, data };
      }
    }

    if (input.startsWith("http://") || input.startsWith("https://")) {
      try {
        console.log(`Fetching remote image URL to convert to base64: ${input}`);
        const response = await fetch(input);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get("content-type") || "image/jpeg";
        return {
          mimeType: mimeType,
          data: buffer.toString("base64")
        };
      } catch (err: any) {
        console.error(`Error loading remote image:`, err);
        throw new Error(`Failed to load preset image: ${err.message || err}`);
      }
    }

    // Default fallback (assume raw base64)
    return {
      mimeType: "image/jpeg",
      data: input.replace(/^data:image\/\w+;base64,/, "")
    };
  }

  // AI Virtual Try-On endpoint using Gemini 2.5 flash image capabilities
  app.post("/api/try-on", async (req, res) => {
    const { 
      userImage, 
      userMimeType, 
      garmentImage, 
      garmentMimeType,
      garmentType,
      promptPreset,
      customPrompt
    } = req.body;

    if (!userImage) {
      return res.status(400).json({ error: "User or model photo is required." });
    }

    // Define fallback generator helper
    const sendFallbackResponse = async (warningMsg: string) => {
      console.warn(`[TRY-ON FALLBACK] ${warningMsg}`);
      try {
        const userObj = await getBase64FromUrlOrBase64(userImage);
        let garmentObj = null;
        if (garmentImage) {
          garmentObj = await getBase64FromUrlOrBase64(garmentImage);
        }

        return res.json({
          imageUrl: null,
          isFallback: true,
          userBase64: `data:${userMimeType || userObj.mimeType || "image/jpeg"};base64,${userObj.data}`,
          garmentBase64: garmentImage && garmentObj
            ? `data:${garmentMimeType || garmentObj.mimeType || "image/jpeg"};base64,${garmentObj.data}`
            : null,
          warning: warningMsg
        });
      } catch (err: any) {
        console.error("Failed to construct backend base64 fallback:", err);
        return res.status(500).json({
          error: `AI Workspace model and local fallback both failed: ${err.message || err}`
        });
      }
    };

    const appApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!appApiKey) {
      return await sendFallbackResponse("Gemini API key is not configured in Settings.");
    }

    try {
      const parts: any[] = [];

      // Clean or download base64 strings and push to parts
      const userImageObj = await getBase64FromUrlOrBase64(userImage);
      parts.push({
        inlineData: {
          mimeType: userMimeType || userImageObj.mimeType || "image/jpeg",
          data: userImageObj.data
        }
      });

      if (garmentImage) {
        const garmentImageObj = await getBase64FromUrlOrBase64(garmentImage);
        parts.push({
          inlineData: {
            mimeType: garmentMimeType || garmentImageObj.mimeType || "image/jpeg",
            data: garmentImageObj.data
          }
        });
      }

      const categoryDesc = garmentType === "upper-body" ? "torso wear (e.g. shirt, t-shirt, jacket, hoodie, suit)"
                        : garmentType === "lower-body" ? "lower wear (e.g. pants, trousers, skirt, jeans)"
                        : garmentType === "full-body" ? "full-body outfit (e.g. dress, traditional saree, full coat, suit)"
                        : "headwear/accessory (e.g. sunglasses, cap, hat)";

      const stylePref = promptPreset || "Professional studio portrait photorealism with native lighting, realistic fabrics textures, pristine fitting and depth details";

      const textPart = `You are an elite, professional AI Virtual Try-On Stylist.
We have provided an image of a person (the first image) and a clothing garment (the second image, if provided). 
Your task is to perform an AI virtual try-on operation:
1. Identify the person in the first image, including their posture, skin tone, facial features, hair, and background.
2. Replace their current clothes in the ${categoryDesc} area with the target garment shown in the second image. If the second image is not provided, generate a beautiful, luxury style of ${categoryDesc} according to the instructions.
3. Blend the garment seamlessly onto their body. Fold the fabric, create realistic shadows, match the shading, posture, proportions, and lighting of the first scene perfectly.
4. Keep the person's face, hair, smile, hands, pose, background scenery, and non-replaced body parts EXACTLY the same. Only rewrite of clothing layers.
5. The final output must be high-definition, photorealistic, clean, and extremely high-contrast, formatted according to the style preference: "${stylePref}" ${customPrompt ? `and additional guidelines: "${customPrompt}"` : ''}.
Do NOT add any text captions, watermark, side-by-side grids, split borders, or labels in the final photo. The response MUST be a single high-quality merged try-on image.`;

      parts.push({ text: textPart });

      console.log("Calling Gemini 2.5 flash image model for Virtual Try On...");
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      let base64Result = "";
      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            base64Result = part.inlineData.data;
            break;
          }
        }
      }

      if (base64Result) {
        res.json({ imageUrl: `data:image/png;base64,${base64Result}` });
      } else {
        console.warn("Failed to extract content from Gemini API response. Falling back...");
        await sendFallbackResponse("Empty inline image response from Gemini API.");
      }
    } catch (error: any) {
      console.warn("Virtual Try-On Gemini API error. Activating automatic local composite blend:", error);
      await sendFallbackResponse(`Gemini API error: ${error.message || error}`);
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
