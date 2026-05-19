import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Type, 
  SpellCheck,
  Languages,
  ArrowRight,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GrammarError {
  type: string;
  original: string;
  fix: string;
  explanation: string;
}

interface GrammarResult {
  original: string;
  corrected: string;
  errors: GrammarError[];
  overallFeedback: string;
}

export const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [expandedError, setExpandedError] = useState<number | null>(null);

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Grammar check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <SpellCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">AI GRAMMAR <span className="text-indigo-600">PRO</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Real-time linguistic analysis</p>
          </div>
        </div>

        <button 
          onClick={() => { setText(""); setResult(null); }}
          className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
        >
          Clear Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Input Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-2 shadow-xl">
           <div className="p-6 space-y-4">
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here for deep analysis..."
                  className="w-full min-h-[240px] p-6 bg-slate-50/50 dark:bg-white/5 border-2 border-transparent rounded-[32px] text-lg font-medium outline-none focus:border-indigo-500/20 transition-all resize-none"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase">{text.length} Characters</span>
                </div>
              </div>

              <button
                onClick={checkGrammar}
                disabled={loading || !text.trim()}
                className={`w-full py-5 rounded-[24px] flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all ${
                  loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.01] active:scale-95'
                }`}
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                {loading ? 'Analyzing Morphology...' : 'Perform Analysis'}
              </button>
           </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               {/* Corrected Text Card */}
               <div className="bg-emerald-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-200 dark:shadow-none">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[80px] rounded-full" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Languages size={20} />
                          <h3 className="text-lg font-black tracking-tight italic">ENHANCED VERSION</h3>
                       </div>
                       <button 
                        onClick={() => copyToClipboard(result.corrected)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                       >
                          <Copy size={18} />
                       </button>
                    </div>
                    <p className="text-xl font-medium leading-relaxed opacity-100 selection:bg-emerald-400">
                      {result.corrected}
                    </p>
                    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                       <ClipboardCheck size={16} />
                       <p className="text-[11px] font-bold tracking-wide italic opacity-80">{result.overallFeedback || "High-quality correction applied."}</p>
                    </div>
                  </div>
               </div>

               {/* Errors List */}
               <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <AlertCircle className="text-indigo-600" size={20} />
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Detected Inconsistencies ({result.errors.length})</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.errors.map((err, idx) => (
                      <motion.div 
                        key={idx}
                        className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer ${
                          expandedError === idx 
                          ? 'bg-slate-50 dark:bg-white/5 border-indigo-500/20' 
                          : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700'
                        }`}
                        onClick={() => setExpandedError(expandedError === idx ? null : idx)}
                      >
                         <div className="flex items-start justify-between gap-4">
                            <div className="space-y-4 flex-1">
                               <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-rose-50 text-rose-500 rounded-lg text-[8px] font-black uppercase tracking-tighter">
                                     {err.type}
                                  </span>
                               </div>
                               <div className="flex items-center gap-3">
                                  <span className="text-sm font-black text-rose-400 line-through decoration-2">{err.original}</span>
                                  <ArrowRight size={14} className="text-slate-300" />
                                  <span className="text-sm font-black text-emerald-500">{err.fix}</span>
                                </div>
                                
                                {expandedError === idx && (
                                  <motion.p 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2 border-t border-slate-100 dark:border-white/5"
                                  >
                                    {err.explanation}
                                  </motion.p>
                                )}
                            </div>
                            {expandedError === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                         </div>
                      </motion.div>
                    ))}

                    {result.errors.length === 0 && (
                      <div className="md:col-span-2 py-12 flex flex-col items-center justify-center gap-4 opacity-50 bg-slate-50 dark:bg-white/5 rounded-[32px]">
                         <CheckCircle2 size={48} className="text-emerald-500" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Perfect Linguistic Sync</p>
                      </div>
                    )}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Footer */}
        <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 flex gap-4">
          <Info size={20} className="text-indigo-600 shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Analysis Protocol</p>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Our AI engine performs syntactic parsing, morphology checks, and stylistic validation against production-standard English.
              Changes are suggested based on clarity, tone, and conventional grammar rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
