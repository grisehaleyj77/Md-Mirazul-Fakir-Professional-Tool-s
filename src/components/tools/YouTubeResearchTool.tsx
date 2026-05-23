import React, { useState } from 'react';
import { 
  Compass, 
  Lightbulb, 
  DollarSign, 
  Tv, 
  Copy, 
  Check, 
  TrendingUp, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const YouTubeResearchTool = () => {
  const [topic, setTopic] = useState('');
  const [targetDuration, setTargetDuration] = useState('10-15 mins');
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleResearchLocal = () => {
    if (!topic.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
      const cleanWords = topic.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 3);
      const mainKeyword = cleanWords[0] || "Topic";

      const localOutline = {
        nicheDemographics: "18-34 years old digital creators, tech enthusiasts, and casual viewers interested in practical knowledge.",
        thumbnailConcept: {
          scenery: `High-contrast setup with a neon split background (deep blue and bright magenta) containing a human face showing surprise on the right.`,
          textOverlay: `NEVER DO THIS!`,
          tip: "Place text overlay on left side. Maintain bright facial colors in image thumbnail."
        },
        monetizationAvenues: [
          `Affiliate promotion of SaaS subscriptions or related technical gear mentioned at 4:32.`,
          `Custom digital worksheets, checklists, or Notion boards related to ${mainKeyword} linked in top comment.`,
          `Direct sponsorship partnerships with tech-focused brands interested in ${cleanTopic}.`
        ],
        videoStructure: [
          { phase: "The Hook (0:00 - 1:15)", goal: `Introduce a common mistake when dealing with ${cleanTopic}. Hook the viewer immediately without long intros.` },
          { phase: "The Problem (1:15 - 3:30)", goal: `Explain why people struggle with ${mainKeyword} and set up the reward parameters.` },
          { phase: "Core Tutorial Walkthrough (3:30 - 9:00)", goal: `Provide 3 clear, actionable steps using practical screen recordings or detailed slides.` },
          { phase: "Pro Hack / Tip (9:00 - 10:45)", goal: `Share an expert secret that separates beginners from seasoned veterans in this space.` },
          { phase: "Outro & CTA (10:45 - End)", goal: `Directly point viewers to the next video or recommended resources panel.` }
        ]
      };

      setOutline(localOutline);
      setLoading(false);
    }, 600);
  };

  const copyResults = () => {
    if (!outline) return;
    const text = `Research Outline for: ${topic}\n\nThumbnail Concept: ${outline.thumbnailConcept.scenery}\nText overlay: ${outline.thumbnailConcept.textOverlay}\n\nMonetization:\n${outline.monetizationAvenues.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32" id="youtube-research-root">
       
       {/* Brand Header */}
       <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-red-650 rounded-2xl text-white bg-red-650/10 text-red-600">
             <Compass size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight font-sans">YOUTUBE <span className="text-red-500">RESEARCHER</span></h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">100% Offline Content Architect & Strategy Tool</p>
           </div>
         </div>
       </div>

       {/* Topic planner input block */}
       <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Video Concept</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Master Figma autolayout, productivity routine"
                  className="w-full bg-slate-50 dark:bg-slate-850 p-4 border rounded-xl font-semibold outline-none text-sm text-slate-800 dark:text-slate-100"
                />
             </div>
             
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Design Target length</label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 p-4 border rounded-xl font-semibold outline-none text-sm text-slate-605 dark:text-slate-350"
                >
                   <option value="5-8 mins">Brief (5-8 minutes)</option>
                   <option value="10-15 mins">Standard (10-15 minutes)</option>
                   <option value="20-30 mins">Deep-dive (20-30 minutes)</option>
                </select>
             </div>
          </div>

          <button 
            onClick={handleResearchLocal}
            disabled={loading || !topic.trim()}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-xl shadow-red-200 dark:shadow-none cursor-pointer disabled:opacity-50"
          >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <TrendingUp size={16} />}
             {loading ? "Calculating strategy vectors..." : "Compile Research Package"}
          </button>
       </div>

       {/* Results mapping */}
       <AnimatePresence>
          {outline && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
               {/* Left column: Thumbnail & stats */}
               <div className="space-y-6 md:col-span-1">
                  
                  {/* Thumbnail concept */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-820 space-y-4">
                     <div className="flex items-center gap-2 text-rose-500">
                        <Monitor size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-wider">Thumbnail Art Direction</h4>
                     </div>
                     <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">
                       <strong>Visual: </strong> {outline.thumbnailConcept.scenery}
                     </p>
                     <div className="p-3 bg-rose-500/5 border border-dashed rounded-lg">
                       <p className="text-[10px] font-mono font-bold uppercase text-rose-600">Text: "{outline.thumbnailConcept.textOverlay}"</p>
                     </div>
                  </div>

                  {/* Monetization possibilities */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-820 space-y-4">
                     <div className="flex items-center gap-2 text-emerald-500">
                        <DollarSign size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-wider">Monetization Avenues</h4>
                     </div>
                     <div className="space-y-2">
                        {outline.monetizationAvenues.map((av: string, idx: number) => (
                          <div key={idx} className="p-2.5 bg-emerald-500/5 rounded-lg border text-[10px] font-semibold text-slate-655 leading-relaxed">
                            {av}
                          </div>
                        ))}
                     </div>
                  </div>

               </div>

               {/* Right column: Outlines */}
               <div className="md:col-span-2 bg-slate-900 text-white rounded-[32px] p-8 space-y-6 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                     <div className="flex items-center gap-2 text-red-400">
                        <Tv size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-red-400">TIMED SCRIPT OUTLINE</h3>
                     </div>
                     
                     <button
                       onClick={copyResults}
                       className="p-3.5 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-350 cursor-pointer"
                     >
                       {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                     </button>
                  </div>

                  <div className="space-y-5">
                     {outline.videoStructure.map((step: any, idx: number) => (
                       <div key={idx} className="space-y-1 relative pl-6 border-l-2 border-white/10 pb-2">
                          <div className="absolute -left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-red-505 bg-red-500 border-4 border-slate-900" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{step.phase}</h4>
                          <p className="text-sm font-medium leading-relaxed text-slate-100">{step.goal}</p>
                       </div>
                     ))}
                  </div>
               </div>

            </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
};
