import React, { useState } from 'react';
import { 
  Youtube, 
  Search, 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  ArrowUpRight, 
  Globe, 
  Zap,
  BarChart2,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ai, GEMINI_API_KEY } from '../../lib/gemini';

type ResearchTab = 'trending' | 'keywords' | 'competitors' | 'niche';

export const YouTubeResearchTool = () => {
  const [activeTab, setActiveTab] = useState<ResearchTab>('trending');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleResearch = async () => {
    if (!input.trim() || !GEMINI_API_KEY) return;
    setLoading(true);
    setResults(null);

    const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    try {
      let prompt = `Current Date: ${currentDate}. YouTube Research Task: "${input}". 
      Use Google Search to find real-time, LIVE data. `;

      if (activeTab === 'trending') {
        prompt += `Identify the top 5 currently trending specific topics or video ideas related to this niche. Explain WHY they are trending now.`;
      } else if (activeTab === 'keywords') {
        prompt += `Find 10 high-potential, underserved keywords for this topic. Provide estimated search volume (High/Med/Low) and competition level.`;
      } else if (activeTab === 'competitors') {
        prompt += `Identify the top 3 channels currently dominating this niche. Analyze their most successful recent video strategy (e.g., specific thumbnail style, hook type, or topic).`;
      } else if (activeTab === 'niche') {
        prompt += `Analyze this niche for content gaps. What questions are people asking that aren't being answered well on YouTube right now? Provide a "Blue Ocean" strategy.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setResults(response.text || "No data found.");
    } catch (error) {
      console.error("YouTube Research error:", error);
      alert("Research failed. Please check your API configuration.");
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
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tight uppercase">YT Research Pro</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Live Data & Market Intelligence</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-2">
        {( [
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'keywords', label: 'Keywords', icon: Target },
          { id: 'competitors', label: 'Competitors', icon: Users },
          { id: 'niche', label: 'Niche Analysis', icon: Globe }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResults(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/5'}`}
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
             Investigation Subject
          </label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. AI News, Tech Reviews, Gaming Gear..."
              className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[24px] px-6 text-sm font-bold outline-none focus:ring-4 ring-red-500/10 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <div className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full text-[9px] font-black uppercase tracking-tighter animate-pulse">
                 Live Grounding
               </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleResearch}
          disabled={loading || !input.trim()}
          className="w-full h-16 bg-red-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart2 className="w-5 h-5" />}
          {loading ? 'Consulting Live Data...' : `Start ${activeTab} Research`}
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
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Market Intelligence Found</h3>
               </div>
               <button 
                onClick={() => copyToClipboard(results)}
                className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest"
               >
                 {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                 {copied ? 'Copied' : 'Copy Report'}
               </button>
            </div>

            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Zap className="w-24 h-24" />
              </div>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-bold text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {results}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-2xl flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight">Competitive Edge</p>
                    <p className="text-[9px] font-bold text-slate-400">Based on real-time YouTube search patterns</p>
                  </div>
                </div>
                <button onClick={() => setResults(null)} className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 border border-white/5 p-1 rounded-[48px] shadow-2xl">
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[44px] text-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-black italic text-lg">Strategy Guidance</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { title: 'Consistency', text: 'Upload at least 2x weekly during trend spikes.' },
                 { title: 'Engagement', text: 'Pinned comments increase reach by 12%.' },
                 { title: 'Thumbnails', text: 'High contrast red/yellow gets 20% more clicks.' },
                 { title: 'Metadata', text: 'Keywords in first 100 characters are priority.' }
               ].map((tip, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">{tip.title}</p>
                    <p className="text-[11px] font-bold text-slate-400">{tip.text}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
