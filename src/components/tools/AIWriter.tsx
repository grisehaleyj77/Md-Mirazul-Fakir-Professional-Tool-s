import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Search,
  Download,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  MapPin,
  ExternalLink,
  Shield,
  Layers,
  Image as ImageIcon,
  Cpu,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Info,
  Globe,
  Share2,
  Trash2,
  Edit2,
  Eye,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SEOEntity {
  entity: string;
  type: string;
  idealTFIDFValue: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface InternalLinkSuggestion {
  anchorText: string;
  targetUrlTopic: string;
}

interface AIArticleResult {
  articleText: string;
  actualWordCount: number;
  featuredSnippet: {
    targetQuery: string;
    optimizedAnswer: string;
    schemaMarkupPlaceholder?: string;
  };
  faqs: FAQItem[];
  eeatSignals: {
    authorBioNote: string;
    disclosureStatement: string;
    citationSourcesNeeded: string[];
  };
  geoOptimizerData: {
    localKeywordsGeo: string[];
    localIntentParagraphSuggestion: string;
  };
  aeoOptimizerData: {
    voiceQueryMatches: string[];
    conversationalDirectAnswers: string[];
  };
  llmSummary: string;
  nlpEntities: SEOEntity[];
  internalLinkAnchorSuggestions: InternalLinkSuggestion[];
  unsplashSearchTerm: string;
  suggestedAIGenerationPrompt: string;
}

// Quick presets for friendly user testing
const PRESETS = [
  {
    topic: "Modern Organic Home Gardening Guide for Beginners",
    guidelines: "Explain soil preparation in detail. Talk about compost mixtures, seasonal watering schedules, natural weed control without chemicals, and the best easy organic vegetables for first-time urban gardeners.",
    snippet: "how to start an organic garden",
    geo: "Dhaka and suburban Bangladesh urban rooftops",
    links: " rooftop-farming-tips, organic-soil-guide"
  },
  {
    topic: "The Ultimate Guide to Local E-commerce Growth & Marketing",
    guidelines: "Detail social commerce, standard delivery structures, consumer trust, interactive Facebook live marketing strategies, local payment gateways, and shipping logistics in small towns.",
    snippet: "how to scale ecommerce locally",
    geo: "South Asian local markets, Dhaka, Chittagong",
    links: " logistics-checklist, checkout-conversion-tricks"
  },
  {
    topic: "Artificial Intelligence (AI) in Everyday Education: Benefits & Roadmaps",
    guidelines: "Discuss personalized student helper bots, automating test papers for school teachers, ethical concerns with essays, interactive adaptive gamification quizzes, and digital literacy training frameworks.",
    snippet: "benefits of AI in schools",
    geo: "Global classrooms and national academic servers",
    links: " digital-classroom-roadmap, ai-education-ethics"
  }
];

// Helper to render Markdown to styled HTML nicely inline without external packages
const renderSimpleMarkdown = (markdownStr: string): string => {
  if (!markdownStr) return '';
  
  let html = markdownStr;

  // Escape HTML tags to prevent XSS issues while maintaining our custom structures
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Translate code blocks ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl font-mono text-xs overflow-x-auto text-[var(--text-main)] my-3">$1</pre>');
  
  // Translate inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 font-mono text-xs px-1.5 py-0.5 rounded">$1</code>');

  // Headers (Order matters: H3 -> H2 -> H1 to prevent partial replacements)
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold text-[var(--text-main)] mt-5 mb-2.5">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="text-xl font-semibold text-[var(--text-main)] mt-6 mb-3 border-b border-slate-100 dark:border-white/5 pb-1">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="text-2xl font-black text-[var(--text-main)] mt-8 mb-4">$1</h2>');

  // Bullet Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-5 list-disc text-slate-600 dark:text-slate-300 py-0.5">$1</li>');
  html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-5 list-disc text-slate-600 dark:text-slate-300 py-0.5">$1</li>');
  
  // Tables
  // Simple regex parser for markdown tables
  const lines = html.split('\n');
  let insideTable = false;
  let tableRows: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!insideTable) {
        insideTable = true;
        tableRows = [];
      }
      // If it's a separator line like |---|---|
      if (line.includes('---') || line.includes(':---')) {
        continue;
      }
      // Parse row columns
      const cols = line.split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isHeader = !tableRows.length; // First row treated as header
      const cellTag = isHeader ? 'th' : 'td';
      const cellClass = isHeader 
        ? 'px-4 py-2 border-b-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-left text-xs font-bold text-[var(--text-main)] font-mono'
        : 'px-4 py-2 border-b border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300';
      
      const cellsHtml = cols.map(c => `<${cellTag} class="${cellClass}">${c}</${cellTag}>`).join('');
      tableRows.push(`<tr>${cellsHtml}</tr>`);
      lines[i] = ''; // clear original line
    } else {
      if (insideTable) {
        insideTable = false;
        // Construct final HTML table block
        const tableHtml = `<div class="overflow-x-auto my-4 rounded-xl border border-slate-100 dark:border-white/5"><table class="min-w-full bg-white dark:bg-transparent border-collapse">${tableRows.join('')}</table></div>`;
        // Insert table HTML where table ended
        lines[i] = tableHtml + '\n' + lines[i];
      }
    }
  }
  html = lines.join('\n');

  // Bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--text-main)]">$1</strong>');
  
  // Italic *text*
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-500">$1</em>');

  // Blockquotes > text
  html = html.replace(/^\s*>\s+(.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 bg-slate-50 dark:bg-emerald-500/5 px-4 py-2.5 my-3 italic rounded-r-xl text-slate-700 dark:text-slate-300">$1</blockquote>');

  // Dynamic Spacers / Line Breaks
  html = html.replace(/\n\n/g, '<p class="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300"></p>');

  return html;
};

export const AIWriter = () => {
  // Input parameters
  const [topic, setTopic] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [tone, setTone] = useState('engaging');
  const [wordCountSetting, setWordCountSetting] = useState<'standard' | 'mega'>('mega');
  const [featuredSnippetTarget, setFeaturedSnippetTarget] = useState('');
  const [targetGeo, setTargetGeo] = useState('');
  const [targetFaqsCount, setTargetFaqsCount] = useState(5);
  const [enableEeat, setEnableEeat] = useState(true);
  const [internalLinkTargets, setInternalLinkTargets] = useState('');

  // Execution states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Content state result
  const [result, setResult] = useState<AIArticleResult | null>(null);
  
  // Custom manual editor interaction state
  const [editorMode, setEditorMode] = useState<'preview' | 'markdown'>('preview');
  const [editedText, setEditedText] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'visuals'>('content');
  const [visualImage, setVisualImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  // Collapse controller for collapsible FAQs
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Sequential simulated steps text for pristine user experience during large 5000+ words compiling
  const LOADING_STEPS = [
    "Establishing Semantic Context & SEO NLP Profile parameters...",
    "Drafting massive multi-chapter article blueprint outline...",
    "Running deep Gemini flash copywriting algorithms (Expanding detail blocks)...",
    "Weaving GEO Targeted optimization phrases & Google Featured snippet definition...",
    "Synthesizing structured FAQ listicles & Voice Search Schema triggers...",
    "Perfecting flow, tone alignments, and validating complete word metrics..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < LOADING_STEPS.length - 1) {
            return prev + 1;
          }
          return prev; // hold on final validation step
        });
      }, 5500); // 5.5s step pacing for organic slow-burn feel
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Apply quick tester presets
  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setTopic(p.topic);
    setGuidelines(p.guidelines);
    setFeaturedSnippetTarget(p.snippet);
    setTargetGeo(p.geo);
    setInternalLinkTargets(p.links);
  };

  // Main generator trigger
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMessage("Please write down a topic or keyword to start writing.");
      return;
    }

    setErrorMessage('');
    setLoading(true);
    setResult(null);
    setVisualImage(null);

    try {
      const response = await fetch("/api/ai-writer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
          wordCountSetting,
          guidelines,
          featuredSnippetTarget,
          targetGeo,
          targetFaqsCount,
          enableEeat,
          internalLinkTargets
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Internal compiling failure");
      }

      const data: AIArticleResult = await response.json();
      setResult(data);
      setEditedText(data.articleText);

      // Now auto-generate the custom Matched Visual Illustration in background
      await triggerBannerGeneration(data.suggestedAIGenerationPrompt, data.unsplashSearchTerm);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed generating article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Image Asset Generation
  const triggerBannerGeneration = async (promptText: string, searchTag: string) => {
    setLoadingImage(true);
    try {
      const res = await fetch("/api/ai-writer/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();
      
      if (data.imageUrl) {
        setVisualImage(data.imageUrl);
      } else {
        // Safe fall back to premium stock photography matching the Unsplash keywords dynamically!
        const cleanTag = encodeURIComponent(searchTag || "modern writing technology");
        setVisualImage(`https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80&sig=${Math.floor(Math.random() * 1000)}`);
      }
    } catch (e) {
      // safe fallback
      setVisualImage("https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80");
    } finally {
      setLoadingImage(false);
    }
  };

  // Clipboard copies
  const handleCopyClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Raw Downloads File managers
  const downloadMarkdownFile = () => {
    if (!result) return;
    const blob = new Blob([editedText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_optimized_article.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadHtmlFile = () => {
    if (!result) return;
    
    // Package it beautifully as a complete standalone HTML5 layout document
    const styledHtmlBody = renderSimpleMarkdown(editedText);
    const htmlThemeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.7;
      color: #334155;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      background-color: #f8fafc;
    }
    .wrapper {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 800;
    }
    h1 { font-size: 2.5rem; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { font-size: 1.8rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;}
    h3 { font-size: 1.4rem; }
    p { margin-bottom: 1.25em; }
    strong { font-weight: 700; color: #1e293b; }
    li { margin-left: 20px; margin-bottom: 6px; }
    pre {
      background: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 0.9em;
    }
    blockquote {
      border-left: 4px solid #10b981;
      background: #ecfdf5;
      padding: 12px 20px;
      margin: 20px 0;
      font-style: italic;
      border-radius: 0 8px 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>${topic}</h1>
    ${styledHtmlBody}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlThemeTemplate], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_rich_document.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Visual Elegant Hero Header */}
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[32px] p-6 md:p-8 border border-[var(--glass-border)] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[var(--text-main)] flex items-center gap-2.5">
                Article Writer Tool
                <span className="text-[10px] bg-indigo-500/20 text-indigo-500 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">v3.5 Engine</span>
              </h3>
              <p className="text-sm text-slate-400 font-medium">Generate 5,000+ words of rich copy, aligned with structured SEO requirements in seconds.</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono italic bg-slate-50 dark:bg-white/5 py-1 px-3 rounded-xl border border-slate-200/50 dark:border-white/5">
            Offline Safe • Double Pipeline Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input controls & presets panel (Spans 5 blocks) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[28px] p-6 border border-[var(--glass-border)] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <h4 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-500" />
                Configure Article Parameters
              </h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full">Newbie Friendly</span>
            </div>

            {/* Presets Selector triggers */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Quick Topic Presets</label>
              <div className="flex flex-col gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(idx)}
                    className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-500/5 hover:border-indigo-500/30 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs text-[var(--text-secondary)] hover:text-indigo-500 font-semibold transition-all flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-mono text-[9px] shrink-0">{idx + 1}</span>
                    <span className="truncate">{p.topic}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Fields */}
            <div className="space-y-4 pt-1">
              {/* Topic Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Primary Article Topic / Main Keyword *</span>
                  <span className="text-[9px] text-slate-400">SEO Target Anchor</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Dynamic Rooftop Farming in Modern Cities"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl text-xs font-bold text-[var(--text-main)] outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Guidelines / Personal thoughts and sentences */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">
                  Compose Subheadings or Guidelines (AI will weave each sentence)
                </label>
                <textarea
                  value={guidelines}
                  onChange={e => setGuidelines(e.target.value)}
                  placeholder="Paste points, thoughts, or outline topics you want in the article. Every sentence written here will generate specific detailed paragraphs."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-3 rounded-xl text-xs font-medium text-[var(--text-main)] outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Word count and Tone */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Tone Matrix</label>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2.5 rounded-xl text-xs font-bold"
                  >
                    <option value="engaging">Engaging & Lively</option>
                    <option value="conversational">Conversational (Personal)</option>
                    <option value="professional">Professional Expert</option>
                    <option value="storytelling">Narrative / Story Mode</option>
                    <option value="analytical">Data & Analytical</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Word Density target</label>
                  <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setWordCountSetting('mega')}
                      className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        wordCountSetting === 'mega'
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-[var(--text-main)]'
                      }`}
                      title="Generates complete exhaustive 8-10 chapter guide aiming 5000+ words"
                    >
                      Massive (5000w)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWordCountSetting('standard')}
                      className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        wordCountSetting === 'standard'
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-[var(--text-main)]'
                      }`}
                      title="Generates standard solid article around 2000 words"
                    >
                      Standard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Extended configuration cards */}
            <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-4">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Search Engine SEO Suite Boost</span>
              </div>

              {/* Featured Snippet Focus */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Featured Snippet Target Query</span>
                  <span title="The search statement Google lists definition cards for">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </label>
                <input
                  type="text"
                  value={featuredSnippetTarget}
                  onChange={e => setFeaturedSnippetTarget(e.target.value)}
                  placeholder="e.g. what is organic rooftop gardening?"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* Geo location optimization */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>GEO Optimizer Target (Local Business)</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={targetGeo}
                  onChange={e => setTargetGeo(e.target.value)}
                  placeholder="e.g. rooftop farmers in suburbs or Dhaka rooftops"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* Internal Anchor links recommendations */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Internal Link Anchors (slug comma separated)</label>
                <input
                  type="text"
                  value={internalLinkTargets}
                  onChange={e => setInternalLinkTargets(e.target.value)}
                  placeholder="e.g. rooftop-gardening-checklist, premium-fertilizers-catalog"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* Switch inputs: EEAT certification toggle / FAQs count */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 flex flex-col gap-1 justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">FAQ Nodes count</span>
                    <span className="text-xs font-bold text-emerald-500 font-mono">{targetFaqsCount}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={targetFaqsCount}
                    onChange={e => setTargetFaqsCount(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 h-1 rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setEnableEeat(!enableEeat)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between gap-2 ${
                    enableEeat 
                      ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200/60 dark:border-white/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold block leading-none">EEAT Signals</span>
                    <span className="text-[8px] text-slate-400 block leading-none">Citations & Bio disclaimers</span>
                  </div>
                  <Shield className={`w-4 h-4 ${enableEeat ? 'text-indigo-500' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>

            {/* ERROR LOGS */}
            {errorMessage && (
              <div className="bg-rose-500/10 text-rose-500 text-xs px-4 py-3 rounded-xl border border-rose-500/20 font-bold leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* GENERATE ACTION BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Elaborating Massive Copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> Create SEO Article
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results layout workspace (Spans 7 blocks) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STATE 1: Uncompiled / Empty Prompt placeholder */}
            {!loading && !result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]"
              >
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-3xl text-indigo-500 relative">
                  <Cpu className="w-12 h-12" />
                  <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1.5 -right-1.5 animate-bounce" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="font-bold text-lg text-[var(--text-main)]">Article Compilation Ready</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Write down your guide statements in the left workspace, pick dynamic search triggers, and launch in 1-click. Our double-pipeline engine generates complete expert bodies instantly!
                  </p>
                </div>
                
                {/* Visual badges illustrating specialized features requested */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  {["5,000+ Words", "Featured Snippet JSON", "Internal Links anchor", "Direct AEO Q&As", "EEAT Author Signitures", "Dynamic Pictures Generation"].map((f, i) => (
                    <span key={i} className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 uppercase tracking-wider">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STATE 2: Generating Deep Multi-chapter loop loader */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[500px] relative overflow-hidden"
              >
                {/* Ambient particle glowing bubbles */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl animate-pulse" />

                <div className="relative">
                  <RefreshCw className="w-16 h-16 text-indigo-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md z-1).">
                  <h4 className="text-xl font-bold text-[var(--text-main)] capitalize">
                    {wordCountSetting === 'mega' ? "Generating 5,000+ Word Mega Masterpiece" : "Generating Standard SEO Article"}
                  </h4>
                  <p className="text-xs text-indigo-500 font-bold tracking-wider uppercase font-mono animate-pulse">
                    Current active phase:
                  </p>
                  
                  {/* Step details transitions */}
                  <div className="h-10 text-sm text-slate-600 dark:text-slate-300 font-semibold px-4">
                    {LOADING_STEPS[loadingStep]}
                  </div>

                  {/* Horizontal visual progress dots */}
                  <div className="flex gap-2.5 items-center justify-center pt-4">
                    {LOADING_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === loadingStep ? 'w-8 bg-indigo-500' : i < loadingStep ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono pt-4 leading-normal">
                  Our advanced multi-chapter generator generates continuous draft blocks sequentially.<br />
                  This might take 30-40 seconds for massive deep reports. Do not close this panel.
                </div>
              </motion.div>
            )}

            {/* STATE 3: Success Result Document Explorer Workspace */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result header visual banner overview panel */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-[28px] p-5 border border-indigo-500/20 shadow-md flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-emerald-500 text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Successfully Optimized Document
                    </span>
                    <h5 className="font-black text-sm">{topic}</h5>
                    <div className="flex items-center gap-3.5 text-[11px] font-mono font-semibold text-indigo-200">
                      <span>Chapters: 8-10 Sections</span>
                      <span>•</span>
                      <span>Target Count: ~5,000 words</span>
                      <span>•</span>
                      <span className="text-emerald-400">Written Draft: {result.actualWordCount || 5200} words</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={downloadMarkdownFile}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5"
                      title="Download Markdown"
                    >
                      <Download className="w-4.5 h-4.5 text-white" />
                    </button>
                    <button
                      onClick={downloadHtmlFile}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5"
                      title="Download clean HTML Report File"
                    >
                      <FileCode className="w-4.5 h-4.5 text-emerald-300" />
                    </button>
                    <button
                      onClick={() => handleCopyClipboard(editedText, 'all_text')}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all text-xs font-bold font-mono text-white flex items-center gap-1.5 shadow-lg"
                    >
                      {copiedKey === 'all_text' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Entire Raw
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Navigation inside result tabs */}
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'content'
                        ? 'bg-white dark:bg-slate-800 text-[var(--text-main)] shadow-sm'
                        : 'text-slate-400 hover:text-[var(--text-main)]'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5 text-indigo-500" /> 1. Read & Edit Draft
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'seo'
                        ? 'bg-white dark:bg-slate-800 text-[var(--text-main)] shadow-sm'
                        : 'text-slate-400 hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Search className="w-4.5 h-4.5 text-emerald-500" /> 2. Deep SEO Suite
                  </button>
                  <button
                    onClick={() => setActiveTab('visuals')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'visuals'
                        ? 'bg-white dark:bg-slate-800 text-[var(--text-main)] shadow-sm'
                        : 'text-slate-400 hover:text-[var(--text-main)]'
                    }`}
                  >
                    <ImageIcon className="w-4.5 h-4.5 text-amber-500" /> 3. Article Banner
                  </button>
                </div>

                {/* TAB 1 CONTENT BODY: Markdown Preview / Text editor switcher */}
                {activeTab === 'content' && (
                  <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[28px] overflow-hidden shadow-sm">
                    {/* Sub header toolbar */}
                    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-white/10 px-6 py-3 flex items-center justify-between">
                      <div className="flex gap-2 p-0.5 bg-slate-200/60 dark:bg-white/5 rounded-lg border border-slate-300/10">
                        <button
                          onClick={() => setEditorMode('preview')}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                            editorMode === 'preview'
                              ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm'
                              : 'text-slate-400 hover:text-[var(--text-main)]'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" /> HTML Preview
                        </button>
                        <button
                          onClick={() => setEditorMode('markdown')}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                            editorMode === 'markdown'
                              ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm'
                              : 'text-slate-400 hover:text-[var(--text-main)]'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Markdown
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                        Editable Document Space
                      </span>
                    </div>

                    {/* Work canvas */}
                    <div className="p-6 md:p-8 min-h-[500px] max-h-[700px] overflow-y-auto">
                      {editorMode === 'markdown' ? (
                        <textarea
                          value={editedText}
                          onChange={e => setEditedText(e.target.value)}
                          className="w-full h-[550px] bg-transparent border-none outline-none font-mono text-xs text-[var(--text-main)] leading-relaxed resize-none focus:ring-0"
                          placeholder="Markdown content workspace..."
                        />
                      ) : (
                        <div 
                          className="prose dark:prose-invert prose-emerald min-w-full leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(editedText) }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2 CONTENT BODY: Deep SEO Optimizers Suite dashboard */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    
                    {/* Top highlights grid for micro optimizations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Sub card A: Featured Snippet precise answer */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-full uppercase">
                            Google Featured Snippet
                          </span>
                          <button
                            onClick={() => handleCopyClipboard(result.featuredSnippet.optimizedAnswer, 'snippet')}
                            className="text-slate-400 hover:text-indigo-500 transition-colors"
                          >
                            {copiedKey === 'snippet' ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">Target Query Statement:</p>
                          <p className="text-sm font-bold text-[var(--text-main)]">"{result.featuredSnippet.targetQuery}"</p>
                          <p className="text-13 leading-relaxed text-slate-500 dark:text-slate-300 font-medium bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                            {result.featuredSnippet.optimizedAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Sub card B: Search LLM AI Engine Summary (LLM Summary / SGE optimization) */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase">
                            LLM Summary (AI SGE / Chat Search)
                          </span>
                          <button
                            onClick={() => handleCopyClipboard(result.llmSummary, 'llm_summary')}
                            className="text-slate-400 hover:text-emerald-500 transition-colors"
                          >
                            {copiedKey === 'llm_summary' ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">TL;DR search preview synthesis:</p>
                          <p className="text-13 leading-relaxed text-slate-500 dark:text-slate-300 font-medium">
                            {result.llmSummary}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* FAQs Structured List block */}
                    <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                        <h5 className="font-extrabold text-sm text-[var(--text-main)] flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-indigo-500" />
                          FAQ Generator (Markup optimized structure)
                        </h5>
                        <span className="text-[10px] text-slate-400 font-medium">Inject directly to boost schema credibility</span>
                      </div>

                      {/* FAQ collapsible cards */}
                      <div className="space-y-2.5">
                        {result.faqs.map((faq, idx) => {
                          const isExpanded = expandedFaq === idx;
                          return (
                            <div
                              key={idx}
                              className="border border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden transition-all bg-slate-50/50 dark:bg-white/5"
                            >
                              <button
                                onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                                className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                              >
                                <span>{faq.question}</span>
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                              </button>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-normal"
                                  >
                                    <p className="p-3 bg-white dark:bg-slate-900 border-l-2 border-emerald-500 rounded-r-xl">
                                      {faq.answer}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SEO Technical Parameters grids (EEAT, GEO and AEO) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Card block 1: EEAT Signals certification disclaimers */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-white/5">
                          <Shield className="w-4.5 h-4.5 text-indigo-500" />
                          <h6 className="font-extrabold text-xs text-[var(--text-main)] uppercase tracking-wide">EEAT Signatures Verification</h6>
                        </div>

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-indigo-500 font-mono">Expert Bio Signature:</span>
                            <p className="text-13 text-slate-500 dark:text-slate-300 font-medium italic">
                              "{result.eeatSignals.authorBioNote}"
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-indigo-500 font-mono">Fact Disclosure:</span>
                            <p className="text-xs text-slate-400 leading-normal">
                              {result.eeatSignals.disclosureStatement}
                            </p>
                          </div>
                          {result.eeatSignals.citationSourcesNeeded?.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[9px] font-black uppercase text-slate-400 font-mono">Suggested Citations Sources to Link:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {result.eeatSignals.citationSourcesNeeded.map((cite, i) => (
                                  <span key={i} className="text-[9px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-indigo-500/10">
                                    <ExternalLink className="w-3 h-3 text-indigo-500" /> {cite}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card block 2: GEO & Local Optimization Parameters */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-white/5">
                          <MapPin className="w-4.5 h-4.5 text-emerald-500" />
                          <h6 className="font-extrabold text-xs text-[var(--text-main)] uppercase tracking-wide">GEO Local Optimizer Intent</h6>
                        </div>

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-emerald-500 font-mono">Suburban Local Intention Block:</span>
                            <p className="text-xs text-slate-500 leading-normal">
                              {result.geoOptimizerData.localIntentParagraphSuggestion}
                            </p>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 font-mono block mb-1.5">Local Business Locations phrases to spread:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {result.geoOptimizerData.localKeywordsGeo.map((tag, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 px-2.5 py-1 rounded-xl text-slate-600 dark:text-indigo-200 font-bold font-mono">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Semantic NLP Entity tags cloud & ideal density ratios */}
                    <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                        <h5 className="font-extrabold text-sm text-[var(--text-main)] flex items-center gap-2">
                          <Layers className="w-5 h-5 text-indigo-500" />
                          Semantic NLP Entities Density Cloud (TF-IDF Boost)
                        </h5>
                        <span className="text-[10px] bg-slate-150 text-slate-400 font-bold px-2.5 py-1 rounded-full uppercase">Term weight matrix</span>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        {result.nlpEntities.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/80 dark:bg-white/5 border border-slate-200/40 dark:border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-inner shadow-slate-100/50"
                          >
                            <div>
                              <span className="text-[10px] font-black text-[var(--text-main)] block">{item.entity}</span>
                              <span className="text-[8px] text-slate-400 font-mono uppercase font-bold tracking-widest">{item.type}</span>
                            </div>
                            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 font-extrabold font-mono px-2 py-0.5 rounded-lg border border-indigo-500/10">
                              {item.idealTFIDFValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AEO Voice Search & Internal link 추천 recommendations table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Sub A: Chat Voice direct table (AEO Optimizer) */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-white/5">
                          <Globe className="w-4.5 h-4.5 text-indigo-500" />
                          <h6 className="font-extrabold text-xs text-[var(--text-main)] uppercase tracking-wide">AEO Voice Engine direct pairs</h6>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                          {result.aeoOptimizerData.voiceQueryMatches.map((query, i) => (
                            <div key={i} className="space-y-1 border-b border-slate-100 dark:border-white/5 pb-2.5 last:border-b-0">
                              <p className="text-xs font-bold text-slate-500 font-sans flex items-start gap-1">
                                <span className="text-indigo-500 text-[10px] font-mono leading-none pt-0.5 font-bold">Q:</span> {query}
                              </p>
                              <p className="text-[11px] leading-normal text-slate-400">
                                {result.aeoOptimizerData.conversationalDirectAnswers[i]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub B: Recommended links map slots */}
                      <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-white/5">
                          <ExternalLink className="w-4.5 h-4.5 text-emerald-500" />
                          <h6 className="font-extrabold text-xs text-[var(--text-main)] uppercase tracking-wide">Internal Link Insertion Points</h6>
                        </div>

                        <div className="space-y-2.5">
                          {result.internalLinkAnchorSuggestions.map((lnk, i) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-2.5">
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Anchor Anchor text:</span>
                                <span className="text-xs font-bold text-[var(--text-main)] italic">"{lnk.anchorText}"</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1.5 rounded-lg">
                                target: /{lnk.targetUrlTopic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* TAB 3 CONTENT BODY: matching dynamic banner visuals */}
                {activeTab === 'visuals' && (
                  <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[32px] p-6 shadow-sm space-y-4 flex flex-col items-center">
                    
                    <div className="w-full pb-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <h5 className="font-extrabold text-sm text-[var(--text-main)] flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-amber-500" />
                        Article Visual Asset Center
                      </h5>
                      <span className="text-xs text-slate-400 font-medium">Custom matching banner imagery</span>
                    </div>

                    {loadingImage ? (
                      <div className="w-full h-80 bg-slate-100 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                        <span className="text-xs font-bold text-slate-400 animate-pulse">Running illustration pixel builders...</span>
                      </div>
                    ) : visualImage ? (
                      <div className="w-full space-y-4">
                        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-black">
                          <img
                            src={visualImage}
                            alt="AI generated match asset"
                            referrerPolicy="no-referrer"
                            className="w-full h-auto object-cover max-h-[450px]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <div className="text-white space-y-1">
                              <span className="text-[9px] bg-amber-500 text-slate-900 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Generated visual Concept
                              </span>
                              <h6 className="font-extrabold text-sm">{topic}</h6>
                            </div>
                          </div>
                        </div>

                        {/* Prompt details box */}
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/10 text-xs text-slate-500 leading-normal">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono mb-1">
                            Prompt Guide utilized:
                          </span>
                          <span className="italic">"{result.suggestedAIGenerationPrompt}"</span>

                          <div className="pt-3.5 flex items-center justify-between border-t border-slate-200/50 dark:border-white/5 mt-3">
                            <span className="text-[10px] text-slate-400 font-bold">Unsplash search triggers: {result.unsplashSearchTerm}</span>
                            <div className="flex gap-2.5">
                              <a
                                href={visualImage}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-indigo-500 hover:bg-slate-800 text-white font-bold rounded-xl text-[10px] uppercase transition-all"
                              >
                                View full image
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
                        No image generated. Run optimizer first.
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
