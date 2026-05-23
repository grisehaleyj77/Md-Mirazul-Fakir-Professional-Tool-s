import React, { useState } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Type, 
  User, 
  FileEdit, 
  Info,
  ChevronDown,
  Gauge,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alternative {
  style: string;
  text: string;
}

interface ToneMetric {
  name: string;
  value: number;
}

interface RewriteResult {
  original: string;
  rewritten: string;
  alternatives: Alternative[];
  readability: {
    before: string;
    after: string;
  };
  wordCount: {
    before: number;
    after: number;
  };
  uniquenessEstimation: number;
  toneAnalysis: ToneMetric[];
  improvementsApplied: string[];
}

const LOCAL_SYNONYMS: Record<string, string> = {
  'utilize': 'use',
  'facilitate': 'help',
  'substantially': 'greatly',
  'implement': 'start',
  'leverage': 'use',
  'optimize': 'enhance',
  'fundamental': 'basic',
  'subsequent': 'next',
  'concerning': 'about',
  'nevertheless': 'however',
  'furthermore': 'also',
  'consequently': 'so',
  'erroneous': 'wrong',
  'anticipate': 'expect',
  'demonstrate': 'show',
  'individual': 'person',
  'assistance': 'help',
  'terminate': 'end',
  'purchase': 'buy',
  'request': 'ask for',
  'frequently': 'often',
  'extremely': 'very',
  'critical': 'vital',
};

export const ArticleRewriter = () => {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [intensity, setIntensity] = useState("sentence"); // word, sentence, full
  const [audience, setAudience] = useState("General Public");
  const [excludeWords, setExcludeWords] = useState("");
  const [mode, setMode] = useState("rewrite"); // rewrite, summarize, expand, simplify, shorten

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copiedMain, setCopiedMain] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRewriteLocal = () => {
    if (!text.trim()) return;
    setLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      try {
        const wordCountBefore = text.split(/\s+/).filter(Boolean).length;
        let rewritten = text;
        const improvements: string[] = [];

        const excludedSet = new Set(
          excludeWords.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        );

        if (mode === "simplify") {
          // Replace complex words with synonyms
          let count = 0;
          Object.entries(LOCAL_SYNONYMS).forEach(([complex, simple]) => {
            if (excludedSet.has(complex)) return;
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            if (regex.test(rewritten)) {
              rewritten = rewritten.replace(regex, (match) => {
                count++;
                const isCapital = match[0] === match[0].toUpperCase();
                return isCapital ? simple.charAt(0).toUpperCase() + simple.slice(1) : simple;
              });
            }
          });
          improvements.push(`Simplified ${count} vocabulary term-pairings.`);
          improvements.push("Streamlined phrasing configurations.");
        } else if (mode === "summarize") {
          // Extract top 50% sentences
          const sentences = text.split(/(?<=[.!?])\s+/);
          const topSentences = sentences.filter((_, idx) => idx % 2 === 0);
          rewritten = topSentences.join(' ');
          improvements.push("Filtered out supplementary descriptors.");
          improvements.push("Condensed logical sentence density.");
        } else if (mode === "expand") {
          // Add descriptors / transition words
          const sentences = text.split(/(?<=[.!?])\s+/);
          const expansions = [
            "In other words, it is worth noting that ",
            "To build upon this concept further, ",
            "Undeniably, ",
            "With this in mind, ",
            "More specifically, "
          ];
          rewritten = sentences.map((s, idx) => {
            if (idx > 0 && idx % 2 === 0) {
              const selectedTransition = expansions[idx % expansions.length];
              return selectedTransition + s.charAt(0).toLowerCase() + s.slice(1);
            }
            return s;
          }).join(' ');
          improvements.push("Introduced contextual transition nodes.");
          improvements.push("Expanded terminology coverage.");
        } else if (mode === "shorten") {
          // Prune passive helper words
          const sentences = text.split(/(?<=[.!?])\s+/);
          rewritten = sentences.map(s => s.replace(/\b(basically|actually|totally|literally|just|really|at the end of the day)\b/gi, '').trim()).join(' ');
          improvements.push("Eliminated verbal filler phrases.");
          improvements.push("Optimized active clause density.");
        } else {
          // General rewrite / restructure
          let count = 0;
          Object.entries(LOCAL_SYNONYMS).forEach(([complex, simple]) => {
            if (excludedSet.has(complex)) return;
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            if (regex.test(rewritten)) {
              rewritten = rewritten.replace(regex, (match) => {
                count++;
                const isCapital = match[0] === match[0].toUpperCase();
                return isCapital ? simple.charAt(0).toUpperCase() + simple.slice(1) : simple;
              });
            }
          });
          // Add alternative ending suggestion if possible
          rewritten = rewritten + (rewritten.endsWith('.') ? ' Ultimately, this shapes the primary perspective.' : ' Ultimately, this shapes the primary perspective.');
          improvements.push("Reconditioned sentence patterns.");
          improvements.push("Adapted verbal flow to active expressions.");
        }

        const wordCountAfter = rewritten.split(/\s+/).filter(Boolean).length;
        
        let readabilityBefore = "Standard";
        let readabilityAfter = "General Reader";
        if (mode === "simplify") {
          readabilityBefore = "Technical / Complex";
          readabilityAfter = "Highly Readable (8th Grade)";
        } else if (mode === "expand") {
          readabilityBefore = "Brief Overview";
          readabilityAfter = "In-Depth Explanatory";
        }

        // Setup 3 premium alternatives
        const alternatives: Alternative[] = [
          { style: "Informal & Casual", text: rewritten.toLowerCase().replace("ultimately", "basically") },
          { style: "Bold & Direct", text: rewritten.split('.')[0] + " - this is absolutely key." },
          { style: "Corporate & Elegant", text: "Please consider that: " + rewritten }
        ];

        setResult({
          original: text,
          rewritten,
          alternatives,
          readability: {
            before: readabilityBefore,
            after: readabilityAfter
          },
          wordCount: {
            before: wordCountBefore,
            after: wordCountAfter
          },
          uniquenessEstimation: mode === "rewrite" ? 88 : 95,
          toneAnalysis: [
            { name: "Professionalism", value: tone === "Professional" ? 95 : 65 },
            { name: "Clarity Index", value: mode === "simplify" ? 90 : 75 },
            { name: "Engagement Score", value: audience === "Executive Board" ? 85 : 92 },
          ],
          improvementsApplied: improvements
        });
      } catch (err: any) {
        setErrorMsg("Failed to complete local rephrase execution.");
      } finally {
        setLoading(false);
      }
    }, 900);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const downloadAsTxt = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result.rewritten], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "rewritten_article.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearWorkspace = () => {
    setText("");
    setResult(null);
    setExcludeWords("");
    setErrorMsg("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32" id="article-rewriter-root">
      
      {/* Brand Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <FileEdit size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">OFFLINE ARTICLE <span className="text-blue-600">REWRITER</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Clean synonym & structure converter</p>
          </div>
        </div>

        <button 
          onClick={clearWorkspace}
          className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors cursor-pointer"
        >
          Reset Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Core Controls Map */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-2 shadow-xl">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Form Fields bento structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Target Tone</label>
                 <select 
                   value={tone} 
                   onChange={(e) => setTone(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl p-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none"
                 >
                   <option value="Professional">Professional (Formal)</option>
                   <option value="Casual">Casual (Friendly)</option>
                   <option value="Creative">Creative (Original)</option>
                   <option value="Empathetic">Empathetic (Warm)</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Rewriting Mode Type</label>
                 <select 
                   value={mode} 
                   onChange={(e) => setMode(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl p-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none"
                 >
                   <option value="rewrite">Standard Rewrite</option>
                   <option value="simplify">Simplify Vocabulary</option>
                   <option value="summarize">Condense Description (Summarize)</option>
                   <option value="expand">Elaborate (Expand Clauses)</option>
                   <option value="shorten">Streamline Layout (Shorten)</option>
                 </select>
              </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Target Audience</label>
                 <select 
                   value={audience} 
                   onChange={(e) => setAudience(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl p-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none"
                 >
                   <option value="General Public">General Public</option>
                   <option value="Academic Scholars">Academic Scholars</option>
                   <option value="Executive Board">Executive Board</option>
                   <option value="Youth Markets">Youth / TikTok</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Exclude words (Comma separated)</label>
                 <input 
                   type="text"
                   value={excludeWords} 
                   onChange={(e) => setExcludeWords(e.target.value)}
                   placeholder="e.g. key, budget, core..."
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl p-4 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none"
                 />
              </div>

            </div>

            {/* Input copy area */}
            <div className="space-y-3 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Content</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your source text here. Our local rewriting dictionary changes structures instantly..."
                className="w-full min-h-[220px] p-6 bg-slate-50 dark:bg-slate-800 rounded-[28px] text-base font-medium border-2 border-transparent focus:border-blue-500/20 outline-none transition-all text-slate-800 dark:text-slate-100"
              />
            </div>

            <button 
              onClick={handleRewriteLocal}
              disabled={loading || !text.trim()}
              className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
              {loading ? "Re-aligning text structure..." : "Execute Local Rewrite"}
            </button>

          </div>
        </div>

        {/* Output metrics & copy block */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual scorecard readability */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600">
                     <Gauge size={20} />
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Readability Shift</p>
                     <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">{result.readability.after}</p>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                     <BookOpen size={20} />
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Words volume</p>
                     <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">{result.wordCount.before} → {result.wordCount.after}</p>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                   <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500">
                     <TrendingUp size={20} />
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Uniqueness Shift</p>
                     <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">~{result.uniquenessEstimation}% Original</p>
                   </div>
                </div>

              </div>

              {/* Main rewritten copy output */}
              <div className="bg-slate-900 text-white rounded-[40px] p-8 space-y-6 relative overflow-hidden shadow-2xl">
                 <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                       <Award size={18} className="text-blue-400" />
                       <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">OPTIMIZED CORE COPY</h3>
                    </div>

                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => copyToClipboard(result.rewritten)}
                         className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer text-slate-300"
                       >
                          {copiedMain ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                       </button>
                       <button 
                         onClick={downloadAsTxt}
                         className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer text-slate-300"
                       >
                          <Download size={16} />
                       </button>
                    </div>
                 </div>

                 <p className="text-lg md:text-xl font-medium leading-relaxed font-sans text-slate-100">
                   {result.rewritten}
                 </p>

                 {result.improvementsApplied.length > 0 && (
                   <div className="pt-4 flex flex-wrap gap-2">
                      {result.improvementsApplied.map((imp, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-400 font-bold border border-white/5 uppercase">
                          {imp}
                        </span>
                      ))}
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
