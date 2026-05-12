import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  Facebook, 
  Instagram, 
  TrendingUp, 
  Zap, 
  Search, 
  BarChart3, 
  Video, 
  Hash, 
  Globe, 
  Loader2, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  Music
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Platform = 'YouTube' | 'Facebook' | 'Instagram' | 'TikTok';

interface TrendingData {
  topics: string[];
  videoIdeas: { title: string; hook: string; style: string }[];
  hashtags: string[];
  summary: string;
}

export const SocialMediaTrendingTool = () => {
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [region, setRegion] = useState<'Global' | 'Bangladesh'>('Global');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendingData | null>(null);
  const [copied, setCopied] = useState(false);

  const PLATFORMS = [
    { id: 'YouTube', icon: Youtube, color: 'text-red-600', border: 'border-red-500/20', bg: 'bg-red-500/10' },
    { id: 'TikTok', icon: Music, color: 'text-slate-900 dark:text-cyan-400', border: 'border-slate-500/20', bg: 'bg-slate-500/10' },
    { id: 'Facebook', icon: Facebook, color: 'text-blue-600', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
    { id: 'Instagram', icon: Instagram, color: 'text-pink-600', border: 'border-pink-500/20', bg: 'bg-pink-500/10' },
  ] as const;

  const fetchTrending = async () => {
    if (!process.env.GEMINI_API_KEY) return;
    setLoading(true);
    setData(null);

    const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    try {
      const prompt = `Current Date: ${currentDate}. Focus Platform: ${platform}. Region: ${region}.
      Task: Perform a real-time "Live Grounding" search using Google Search to identify the top trending topics, viral video trends, and seasonal content spikes happening right NOW on ${platform} specifically in ${region === 'Bangladesh' ? 'Bangladesh' : 'the entire Global market'}.
      
      Return a JSON object with exactly this structure:
      {
        "topics": ["topic 1", "topic 2", "topic 3"],
        "videoIdeas": [
          {"title": "Creative Title 1", "hook": "Engaging hook strategy", "style": "Short-form/Vlog/etc"},
          {"title": "Creative Title 2", "hook": "Engaging hook strategy", "style": "Short-form/Vlog/etc"}
        ],
        "hashtags": ["#tag1", "#tag2", "#tag3"],
        "summary": "A 1-2 sentence overview of the current vibe on the platform."
      }
      ONLY return the JSON object, no other text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });

      const result = JSON.parse(response.text || "{}");
      setData(result);
    } catch (error) {
      console.error("Live trending fetch failed:", error);
      alert("Failed to fetch live trends. Please check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [platform, region]);

  const copyAll = () => {
    if (!data) return;
    const text = `Live Trends for ${platform} (${region}):\n\nTopics: ${data.topics.join(', ')}\n\nVideo Ideas:\n${data.videoIdeas.map(v => `- ${v.title} (${v.style})`).join('\n')}\n\nHashtags: ${data.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIndividual = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-red-600/20">
           <Radio className="w-3 h-3 animate-pulse" />
           Live Trending Data
        </div>
        <h2 className="text-4xl font-black italic tracking-tight uppercase leading-tight">Trending Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">3.0</span></h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Automated Algorithm Intelligence</p>
      </div>

      {/* Region Switcher */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex gap-1">
          {(['Global', 'Bangladesh'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === r ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Switcher */}
      <div className="flex justify-center gap-3">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-[32px] transition-all min-w-[100px] border-2 ${platform === p.id ? `${p.border} ${p.bg} shadow-xl scale-110` : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
          >
            <p.icon className={`w-8 h-8 ${p.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{p.id}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="lg:col-span-3 h-96 flex flex-col items-center justify-center space-y-6"
            >
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-100 dark:border-white/5 rounded-full" />
                  <div className="absolute top-0 w-24 h-24 border-4 border-t-red-600 border-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Globe className="w-8 h-8 text-slate-200 dark:text-white/20 animate-pulse" />
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Analyzing {region} Trends</p>
                  <p className="text-[10px] font-bold text-slate-300">Synchronizing with {platform}, TikTok & Google Search...</p>
               </div>
            </motion.div>
          ) : data && (
            <>
              {/* Left Column: Topics & Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                 <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Flame className="w-20 h-20" />
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                       <BarChart3 className="w-4 h-4 text-blue-600" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Pulse</h3>
                    </div>
                    <div className="relative group/summary">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-8 pr-12">
                         "{data.summary}"
                      </p>
                      <button 
                        onClick={() => copyIndividual(data.summary, 'summary')}
                        className="absolute top-0 right-0 p-2 opacity-0 group-hover/summary:opacity-100 bg-slate-100 dark:bg-white/10 rounded-lg transition-all"
                      >
                         {copiedId === 'summary' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>
                    <div className="space-y-3">
                       {data.topics.map((topic, i) => (
                         <div key={i} className="relative group/item">
                           <button 
                              onClick={() => copyIndividual(topic, `topic-${i}`)}
                              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-xs font-black uppercase tracking-tight text-left">{topic}</span>
                              </div>
                              {copiedId === `topic-${i}` ? <Check className="w-3 h-3 text-green-500 shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover/item:opacity-100 shrink-0" />}
                           </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                    <div className="flex items-center gap-2 mb-6">
                       <Hash className="w-4 h-4 text-pink-400" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Peak Hashtags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                       {data.hashtags.map((tag, i) => (
                         <button 
                          key={i} 
                          onClick={() => copyIndividual(tag, `tag-${i}`)}
                          className={`hover:text-white transition-colors flex items-center gap-1 ${copiedId === `tag-${i}` ? 'text-green-400' : ''}`}
                         >
                           {tag}
                           {copiedId === `tag-${i}` && <Check className="w-2 h-2" />}
                         </button>
                       ))}
                    </div>
                 </div>
              </motion.div>

              {/* Middle & Right Column: Video Strategy */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 space-y-6"
              >
                 <div className="flex items-center justify-between px-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Automatic Video Blueprints</h3>
                    <button 
                      onClick={copyAll}
                      className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied Hub' : 'Copy Full Intelligence'}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.videoIdeas.map((idea, i) => (
                      <div key={i} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-8 rounded-[48px] shadow-sm flex flex-col space-y-6 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
                         <div className="flex items-start justify-between">
                            <div className={`p-4 rounded-3xl ${platform === 'YouTube' ? 'bg-red-500/10 text-red-600' : platform === 'Facebook' ? 'bg-blue-500/10 text-blue-600' : platform === 'Instagram' ? 'bg-pink-500/10 text-pink-600' : 'bg-slate-500/10 text-slate-600'}`}>
                               <Video className="w-6 h-6" />
                            </div>
                            <div className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                               {idea.style}
                            </div>
                         </div>
                         
                         <div className="space-y-4 flex-1">
                            <button 
                              onClick={() => copyIndividual(idea.title, `idea-title-${i}`)}
                              className="text-left w-full group/title"
                            >
                              <h4 className="text-xl font-black italic tracking-tight leading-tight group-hover/title:text-blue-600 transition-colors">
                                 {idea.title}
                                 {copiedId === `idea-title-${i}` && <Check className="inline-block ml-2 w-4 h-4 text-green-500" />}
                              </h4>
                            </button>
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                  <Zap className="w-3 h-3 text-amber-500" />
                                  The Hook Strategy
                               </p>
                               <button 
                                onClick={() => copyIndividual(idea.hook, `idea-hook-${i}`)}
                                className="text-left w-full block group/hook"
                               >
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic group-hover/hook:text-blue-500 transition-colors">
                                   "{idea.hook}"
                                   {copiedId === `idea-hook-${i}` && <Check className="inline-block ml-2 w-3 h-3 text-green-500" />}
                                </p>
                               </button>
                            </div>
                         </div>

                         <button 
                          onClick={() => copyIndividual(`Video Idea: ${idea.title}\nHook: ${idea.hook}\nStyle: ${idea.style}`, `idea-full-${i}`)}
                          className={`w-full h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest ${copiedId === `idea-full-${i}` ? 'bg-green-500 text-white' : 'group-hover:bg-slate-900 group-hover:text-white'}`}
                         >
                            {copiedId === `idea-full-${i}` ? (
                              <>
                                <Check className="w-3 h-3" />
                                Strategy Copied
                              </>
                            ) : (
                              <>
                                Copy Strategy
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </>
                            )}
                         </button>
                      </div>
                    ))}
                 </div>

                 {/* Engagement Tip */}
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[48px] text-white flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-white/20 p-6 rounded-[32px] backdrop-blur-xl">
                       <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="space-y-2 flex-1 text-center md:text-left">
                       <h5 className="text-lg font-black italic">Algorithm Alpha Tip</h5>
                       <p className="text-sm font-bold text-blue-50 leading-relaxed capitalize">
                          Current ${platform} retention data suggests that videos starting with a "Problem Highlight" in the first 3 seconds are seeing a 40% higher average view duration this week.
                       </p>
                    </div>
                    <button 
                      onClick={fetchTrending}
                      className="h-14 w-14 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                    >
                       <RotateCcw className="w-6 h-6" />
                    </button>
                 </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-8 py-8 opacity-20 pointer-events-none">
         <Globe className="w-12 h-12" />
         <TrendingUp className="w-12 h-12" />
         <Zap className="w-12 h-12" />
         <Radio className="w-12 h-12" />
         <BarChart3 className="w-12 h-12" />
      </div>
    </div>
  );
};
