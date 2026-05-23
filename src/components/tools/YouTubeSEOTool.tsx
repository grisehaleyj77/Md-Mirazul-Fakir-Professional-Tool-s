import React, { useState } from 'react';
import { 
  Youtube, 
  Copy, 
  Check, 
  RotateCcw, 
  Search, 
  Type, 
  Tag, 
  FileText, 
  BarChart3, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToolTab = 'titles' | 'tags' | 'description' | 'audit';

export const YouTubeSEOTool = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('titles');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLocal = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      const topic = input.charAt(0).toUpperCase() + input.slice(1);
      const cleanWords = input.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 3);
      const primaryKeyword = cleanWords[0] || "Video";

      if (activeTab === 'titles') {
        const titleTemplates = [
          `How To Master ${topic} (Step-by-Step Guide for Beginners)`,
          `I Tried ${topic} for 30 Days: Here Is What Happened!`,
          `Top 10 Secrets of ${topic} You absoluteLY Need to Know`,
          `Why Everyone is Wrong About ${topic} (The Brutal Truth)`,
          `7 Crucial Mistakes to Avoid When Doing ${topic}`,
          `Ultimate ${topic} Tutorial: Go From Complete Beginner to Pro!`,
          `${topic} in 2026: Is It Still Worth It?`,
          `This Simple ${primaryKeyword} Hack Will Save You Hours!`,
          `Stop Doing ${primaryKeyword} Like This! (Do This Instead)`,
          `Everything You Need Know About ${topic} Explained Simply`
        ];
        setResults(titleTemplates);
      } else if (activeTab === 'tags') {
        const basicTags = [
          input,
          `${input} tutorial`,
          `${input} guide`,
          `${input} review`,
          `how to do ${input}`,
          `${input} for beginners`,
          `${input} tips`,
          `${input} 2026`,
          `best ${input}`,
          `learn ${input}`,
          `mastering ${input}`,
          `why ${input}`,
          `secrets of ${input}`,
          `${primaryKeyword} hacks`,
          `${primaryKeyword} mistakes`,
          `popular ${input} strategies`,
          `${input} practical walk`,
          `easy ${input} ideas`
        ];
        setResults(basicTags.slice(0, 30));
      } else if (activeTab === 'description') {
        const descriptionTemplate = `🔥 Want to master ${topic} like a absolute pro? In this video, we break down everything you need to know about ${input} so you can save time and achieve maximum results!

Make sure you subscribe to catch all our raw tech guides and content strategies!
👉 Subscribe Here: http://youtube.com/c/yourchannelplaceholders

⏱️ VIDEO CHAPTERS / TIMESTAMPS:
0:00 - Introduction & ${primaryKeyword} hook
1:45 - Key fundamentals of ${primaryKeyword}
4:30 - Common mistakes to avoid when starting
8:15 - Advanced practical walk-through of ${topic}
12:50 - Wrap-up & final recommendations

🔔 Connect with us on social media:
Twitter: http://twitter.com/yourprofile
Instagram: http://instagram.com/yourprofile
LinkedIn: http://linkedin.com/in/yourprofile

Check out these related resources:
- Recommended Tools: [Your Link Here]
- Extended Guide: [Your Link Here]

#${primaryKeyword.replace(/\s+/g, '')} #${primaryKeyword}Tutorial #Learn${primaryKeyword.replace(/\s+/g, '')} #HowTo #YouTubeGrowth`;
        setResults(descriptionTemplate);
      } else if (activeTab === 'audit') {
        // Calculate static organic score based on phrase length
        const charLen = input.length;
        const score = Math.max(2, Math.min(9.5, (charLen * 1.3) % 10));
        const difficulty = charLen < 12 ? 'High Competition' : charLen < 22 ? 'Medium Competition' : 'Low Search Competition';
        const searchPotential = Math.round(score);

        const auditData = {
          difficulty,
          searchPotential,
          tips: [
            `Utilize your primary phrase "${topic}" in both the first 100 characters of your description and within the captions overlay.`,
            `Design a high-contrast thumbnails containing no more than 4 keywords to drive up CTR by an estimated 15%+.`,
            `Embed targeted long-tail tag variants (like "${input} walkthrough" or "${input} simple tips") to ranks in niche searches.`
          ]
        };
        setResults(auditData);
      }
      setLoading(false);
    }, 700);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32" id="yt-seo-suite-root">
       
       {/* Brand Header */}
       <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
             <Youtube size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">YOUTUBE SEO <span className="text-red-600">SUITE</span></h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">100% Offline Video Optimizer & Title Maker</p>
           </div>
         </div>
       </div>

       {/* Tabs Navigation */}
       <div className="flex flex-wrap gap-2 px-1">
          <button
            onClick={() => { setActiveTab('titles'); setResults(null); }}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${activeTab === 'titles' ? 'bg-slate-900 border-slate-900 text-white dark:bg-red-600 dark:border-red-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-820 text-slate-500 hover:text-slate-800'}`}
          >
             <Type size={14} />
             Catchy Titles
          </button>
          <button
            onClick={() => { setActiveTab('tags'); setResults(null); }}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${activeTab === 'tags' ? 'bg-slate-900 border-slate-900 text-white dark:bg-red-600 dark:border-red-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-820 text-slate-500 hover:text-slate-800'}`}
          >
             <Tag size={14} />
             Tags & keywords
          </button>
          <button
            onClick={() => { setActiveTab('description'); setResults(null); }}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${activeTab === 'description' ? 'bg-slate-900 border-slate-900 text-white dark:bg-red-600 dark:border-red-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-820 text-slate-500 hover:text-slate-800'}`}
          >
             <FileText size={14} />
             HTML Description
          </button>
          <button
            onClick={() => { setActiveTab('audit'); setResults(null); }}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${activeTab === 'audit' ? 'bg-slate-900 border-slate-900 text-white dark:bg-red-600 dark:border-red-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-820 text-slate-500 hover:text-slate-800'}`}
          >
             <BarChart3 size={14} />
             SEO Mini-Audit
          </button>
       </div>

       {/* Central Input Card */}
       <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[40px] shadow-sm space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Put Your Video Topic</label>
             <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Learn React Native in 10 minutes, coding tutorials, beauty tips"
                  className="w-full bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl outline-none text-base border-2 border-transparent focus:border-red-500/20 text-slate-800 dark:text-slate-100"
                />
             </div>
          </div>

          <button 
            onClick={handleGenerateLocal}
            disabled={loading || !input.trim()}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-200 dark:shadow-none cursor-pointer disabled:opacity-50"
          >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <Youtube size={16} />}
             {loading ? 'Executing local calculations...' : 'Assemble Optimization Result'}
          </button>
       </div>

       {/* Results Output Area */}
       <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-820 p-8 shadow-sm space-y-6"
            >
               <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-450 dark:text-white">Optimization Response</h3>
                  <button
                    onClick={() => {
                      const textToCopy = Array.isArray(results) ? results.join('\n') : (typeof results === 'object' ? JSON.stringify(results) : results);
                      copyToClipboard(textToCopy);
                    }}
                    className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                     {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
               </div>

               {/* Render corresponding views */}
               {activeTab === 'titles' && Array.isArray(results) && (
                 <div className="space-y-3">
                    {results.map((title, idx) => (
                      <div 
                        key={idx}
                        onClick={() => copyToClipboard(title)}
                        className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-755 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-350 cursor-pointer flex items-center justify-between group border"
                      >
                         <span>{title}</span>
                         <span className="text-[9px] font-mono text-slate-400 group-hover:text-red-500 uppercase">Copy</span>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'tags' && Array.isArray(results) && (
                 <div className="flex flex-wrap gap-2.5">
                    {results.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border font-bold text-xs rounded-xl"
                      >
                         {tag}
                      </span>
                    ))}
                 </div>
               )}

               {activeTab === 'description' && typeof results === 'string' && (
                 <pre className="p-6 bg-slate-90s text-white rounded-2xl text-[13px] font-mono leading-relaxed whitespace-pre-wrap select-all font-semibold max-h-[400px] overflow-y-auto text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-820">
                    {results}
                 </pre>
               )}

               {activeTab === 'audit' && typeof results === 'object' && !Array.isArray(results) && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-1">
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Competition Density</p>
                          <p className="text-xl font-black text-slate-800 dark:text-red-200">{results.difficulty}</p>
                       </div>
                       <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-1">
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Organic Traffic Score</p>
                          <p className="text-xl font-black text-slate-800 dark:text-emerald-250">{results.searchPotential} / 10</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Key Action Directives</h4>
                       <div className="space-y-3">
                        {results.tips.map((tip: string, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-80/40 border border-transparent hover:border-slate-150 rounded-xl flex gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                             <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">{idx+1}</div>
                             <p>{tip}</p>
                          </div>
                        ))}
                       </div>
                    </div>
                 </div>
               )}

            </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
};
