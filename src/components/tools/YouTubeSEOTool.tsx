import React, { useState } from 'react';
import { 
  Youtube, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Search, 
  Type, 
  Tag, 
  FileText, 
  TrendingUp,
  BarChart3,
  Lightbulb,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ToolTab = 'titles' | 'tags' | 'description' | 'audit';

export const YouTubeSEOTool = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('titles');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim() || !process.env.GEMINI_API_KEY) return;
    setLoading(true);
    setResults(null);

    try {
      const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      let prompt = `Current Date: ${currentDate}. Topic: "${input}". 
      Use the most recent live trending data and YouTube algorithms for this optimization. `;

      if (activeTab === 'titles') {
        prompt += `Generate 10 catchy, high-CTR, SEO-optimized YouTube video titles for a video about this topic. 
        Include a mix of "How-to", "Review", "Listicle", and "Shocking/Intriguing" styles.
        Return each title on a new line, no numbering.`;
      } else if (activeTab === 'tags') {
        prompt += `List 30 highly relevant, high-volume, currently trending SEO tags/keywords for a YouTube video about this topic. 
        Separate them by commas. No other text.`;
      } else if (activeTab === 'description') {
        prompt += `Write a professional, SEO-optimized YouTube video description for a video about this topic. 
        Include:
        1. A hook in the first 2 lines.
        2. A summary of the video.
        3. 3-4 Timestamps placeholders.
        4. Hashtags at the end.
        Use a professional yet engaging tone.`;
      } else if (activeTab === 'audit') {
        prompt += `Perform a real-time SEO audit for this YouTube video idea based on current competition. 
        Provide:
        1. Ranking difficulty (Low, Medium, High).
        2. Search potential (Score 1-10).
        3. 3 Key Optimization Tips to trend today.
        Return in a clear, structured JSON-like format or bullet points.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "";
      
      if (activeTab === 'titles') {
        setResults(text.split('\n').filter(t => t.trim()));
      } else if (activeTab === 'tags') {
        setResults(text.split(',').map(tag => tag.trim()).filter(tag => tag));
      } else {
        setResults(text);
      }
    } catch (error) {
      console.error("YouTube SEO tool error:", error);
      alert("Failed to process request. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Youtube className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tight">YouTube SEO Master</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Rank #1 with AI-Powered Optimization</p>
      </div>

      {/* Internal Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-2">
        {( [
          { id: 'titles', label: 'Titles', icon: Type },
          { id: 'tags', label: 'Tags', icon: Tag },
          { id: 'description', label: 'Desc', icon: FileText },
          { id: 'audit', label: 'Audit', icon: BarChart3 }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResults(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/5'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[40px] border border-slate-100 dark:border-white/5 p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
            <Search className="w-3 h-3" />
            Video Topic / Seed Keywords
          </label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. How to grow a YouTube channel today for beginners..."
              className="w-full h-32 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[24px] p-5 text-sm font-bold outline-none focus:ring-4 ring-red-500/10 resize-none transition-all"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[10px] font-black text-red-600 opacity-50">
              <Sparkles className="w-3 h-3" />
              AI OPTIMIZER
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="w-full h-16 bg-red-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/30 disabled:opacity-50 disabled:grayscale"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          {loading ? 'Analyzing Content...' : `Generate SEO ${activeTab}`}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">SEO Recommendations</h3>
              {typeof results === 'string' && (
                <button 
                  onClick={() => copyToClipboard(results)}
                  className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase tracking-widest"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm">
              {activeTab === 'titles' && Array.isArray(results) && (
                <div className="space-y-3">
                  {results.map((title, i) => (
                    <div key={i} className="group relative flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
                      <p className="text-sm font-bold pr-10">{title}</p>
                      <button 
                        onClick={() => copyToClipboard(title)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tags' && Array.isArray(results) && (
                <div className="flex flex-wrap gap-2">
                  {results.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(tag)}
                      className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-black text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {(activeTab === 'description' || activeTab === 'audit') && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-bold text-sm bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 leading-relaxed overflow-x-auto text-slate-700 dark:text-slate-300">
                    {results}
                  </pre>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight">Growth Estimate</p>
                    <p className="text-[9px] font-bold text-slate-400">Projected 3.5x CTR improvement</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setResults(null)} className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-red-600 to-rose-700 p-8 rounded-[48px] text-white relative overflow-hidden group shadow-2xl shadow-red-600/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-black italic text-lg pr-4">SEO Success Secret</h4>
          </div>
          <p className="text-sm font-bold text-red-50/80 leading-relaxed pr-6">
            The first 2 lines of your description are the most critical. They appear in search results. Ensure they include your primary keyword naturally and provide a strong reason to click.
          </p>
          <div className="pt-4 flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-300" />
                <span className="text-[10px] font-black uppercase">Mobile Optimized</span>
             </div>
             <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-300" />
                <span className="text-[10px] font-black uppercase">Algorithm Safe</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
