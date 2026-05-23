import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Loader2, 
  Copy, 
  Check, 
  MessageSquare, 
  Target,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendRecord {
  category: 'Tech' | 'Fashion' | 'Finance' | 'Lifestyle' | 'Personal Development';
  hashtag: string;
  reachEstimate: string;
  momentum: 'Explosive' | 'High' | 'Steady';
  hooks: string[];
  suggestedCaption: string;
}

const CONSTANT_SOCIAL_TRENDS: Record<string, TrendRecord[]> = {
  'Instagram': [
    {
      category: 'Lifestyle',
      hashtag: '#QuietLuxuryVibes',
      reachEstimate: '2.4M views/day',
      momentum: 'Explosive',
      hooks: ['How to style quiet luxury without breaking the bank.', 'This one aesthetic hack changes everything.'],
      suggestedCaption: 'Chasing timeless textures and spacious negative spaces. ✨ Here is my quick guide to styling clean lines on an elegant budget. Let me know your favorite layout in the comments!'
    },
    {
      category: 'Personal Development',
      hashtag: '#MorningRoutineHack',
      reachEstimate: '1.8M views/day',
      momentum: 'High',
      hooks: ['Why your 5 AM morning outline is actually making you tired.', 'Try this simple 3-step kinetic morning framework.'],
      suggestedCaption: 'Stop overcomplicating productivity. Save this post to remember to focus on clarity and clean visual alignment instead of high-stakes routines. ☕️'
    }
  ],
  'TikTok / Reels': [
    {
      category: 'Tech',
      hashtag: '#NoAICoding',
      reachEstimate: '4.1M views/day',
      momentum: 'Explosive',
      hooks: ['How I built a full-stack local web app in 10 minutes from scratch.', 'Stop relying on AI models - do this instead.'],
      suggestedCaption: 'Building real offline algorithms is the true super power of any junior developer. 💻 Here is the exact directory layout I use to compile client-side scripts. #programming #developer #offlinecoding'
    },
    {
      category: 'Fashion',
      hashtag: '#ThriftCoreTransformation',
      reachEstimate: '2.9M views/day',
      momentum: 'High',
      hooks: ['I styled this $5 thrift dress with classic display typography textures.', 'DIY wardrobe transformations you can try this weekend.'],
      suggestedCaption: 'Flipping discarded outfits and breathing life back into forgotten silhouettes. Read my full posing tips below! 🧵👗'
    }
  ],
  'LinkedIn': [
    {
      category: 'Finance',
      hashtag: '#BootstrappedSaaS',
      reachEstimate: '450K impressions/day',
      momentum: 'Steady',
      hooks: ['Why raising $5M venture funding is the worst mistake a founder can make.', 'The raw math behind building a cash-flow positive indie project.'],
      suggestedCaption: 'The era of low-interest hype is over. True architectural craftsmanship means building robust offline systems that pay for themselves on Day 1. Agree?'
    },
    {
      category: 'Personal Development',
      hashtag: '#DigitalClutterAudit',
      reachEstimate: '380K impressions/day',
      momentum: 'High',
      hooks: ['How deleting 25 workspace folders doubled my executive focus.', 'The clean workspace protocol that saved my career.'],
      suggestedCaption: 'We talk about physical cleaning, but virtual hygiene is just as critical. Deleting telemetry loops, unused templates, and stale dependencies keeps your core mind clear. 💡'
    }
  ],
  'X / Twitter': [
    {
      category: 'Tech',
      hashtag: '#TypeScriptSolidity',
      reachEstimate: '1.1M posts/day',
      momentum: 'Steady',
      hooks: ['Stop writing javascript like it is still 2015.', 'The complete type safety checklist for production launches.'],
      suggestedCaption: 'A strict type compiler prevents 99% of run-time failures. Take the time to outline your types before writing single-line executions. 🧵👇'
    }
  ]
};

export const SocialMediaTrendingTool = () => {
  const [platform, setPlatform] = useState('Instagram');
  const [activeTrend, setActiveTrend] = useState<TrendRecord | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const handleSelectTrend = (trend: TrendRecord) => {
    setActiveTrend(trend);
    setCopiedText(false);
  };

  const copyTrendToClipboard = () => {
    if (!activeTrend) return;
    const text = `Trend: ${activeTrend.hashtag}\nCategory: ${activeTrend.category}\nHook Options:\n- ${activeTrend.hooks.join('\n- ')}\n\nCaption Preview: ${activeTrend.suggestedCaption}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32" id="vibe-analytics-root">
       
       {/* Brand Header */}
       <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
             <TrendingUp size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">VIBE HUBS <span className="text-purple-600">TRENDS</span></h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">100% Offline Multi-Platform Hotspots Tracker</p>
           </div>
         </div>
       </div>

       {/* Platform Filter Buttons */}
       <div className="flex flex-wrap gap-2 px-1">
          {Object.keys(CONSTANT_SOCIAL_TRENDS).map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setActiveTrend(null); }}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${platform === p ? 'bg-slate-950 border-slate-950 text-white dark:bg-purple-600 dark:border-purple-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-820 text-slate-500 hover:text-slate-800'}`}
            >
              {p}
            </button>
          ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* List of active trends on select platform */}
          <div className="space-y-4">
             <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 pl-1">ACTIVE HOT TOPICS</h3>
             
             {CONSTANT_SOCIAL_TRENDS[platform]?.map((trend) => (
               <div 
                 key={trend.hashtag}
                 onClick={() => handleSelectTrend(trend)}
                 className={`p-6 bg-white dark:bg-slate-900 border rounded-3xl cursor-pointer transition-all active:scale-[0.99] hover:border-purple-500/20 text-left ${activeTrend?.hashtag === trend.hashtag ? 'border-purple-600 dark:border-purple-500 ring-4 ring-purple-500/5' : 'border-slate-100 dark:border-slate-800'}`}
               >
                  <div className="flex items-center justify-between pointer-events-none">
                     <span className="px-2.5 py-1 bg-purple-50 text-purple-600 dark:bg-purple-950/20 rounded-md text-[9px] font-black uppercase tracking-wider">
                       {trend.category}
                     </span>
                     <span className="text-[9px] font-mono text-purple-500 font-bold uppercase tracking-widest">
                       {trend.momentum} Momentum
                     </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-800 dark:text-white mt-3 shrink-0">
                     {trend.hashtag}
                  </h4>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50 dark:border-white/5 pointer-events-none text-[10px] font-semibold text-slate-400">
                     <span>Estimated Volume: {trend.reachEstimate}</span>
                     <span className="text-purple-600 dark:text-purple-400">View Strategy →</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Strategy View workspace panel */}
          <div className="space-y-6">
             {activeTrend ? (
               <div className="bg-slate-950 text-white rounded-[32px] p-8 space-y-6 relative overflow-hidden shadow-2xl">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                     <div className="flex items-center gap-2 text-purple-400">
                        <Target size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">STRATEGY WORKSPACE</h3>
                     </div>

                     <button
                       onClick={copyTrendToClipboard}
                       className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-350 cursor-pointer"
                     >
                       {copiedText ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                     </button>
                  </div>

                  {/* Viral Hooks */}
                  <div className="space-y-3">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-purple-450 text-slate-400 pl-0.5">High-CTR Opening Hooks</h4>
                     <div className="space-y-2">
                        {activeTrend.hooks.map((hook, idx) => (
                          <div key={idx} className="p-3.5 bg-white/5 rounded-xl border border-white/5 text-[13px] font-medium leading-relaxed italic text-slate-100">
                             "{hook}"
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Captions */}
                  <div className="space-y-3">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-purple-450 text-slate-400 pl-0.5">Caption Preview</h4>
                     <pre className="p-5 bg-white/5 rounded-[22px] border border-white/5 text-[12px] font-sans leading-relaxed whitespace-pre-wrap font-semibold text-slate-200">
                        {activeTrend.suggestedCaption}
                     </pre>
                  </div>

               </div>
             ) : (
               <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-12 text-center text-slate-405 dark:text-slate-400 space-y-3">
                  <Sparkles size={48} className="text-purple-500 mx-auto" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Workspace Dormant</h4>
                  <p className="text-xs font-semibold leading-relaxed max-w-[280px] mx-auto text-slate-400">Select any active hot topic card on the left to load custom high-CTR hooks and caption templates offline instantly.</p>
               </div>
             )}

             <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] text-slate-500 leading-relaxed font-semibold flex gap-3 italic border">
                <Clock size={16} className="text-purple-500 shrink-0 mt-0.5" />
                These social trend records are assembled client-side based on constant platform statistics to ensure maximum speed and offline operation.
             </div>
          </div>

       </div>

    </div>
  );
};
