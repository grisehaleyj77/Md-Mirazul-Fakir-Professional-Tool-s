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

// Local rules-based checking dictionary
const COMMON_TYPOS: Record<string, { fix: string; type: string; explanation: string }> = {
  'recieve': { fix: 'receive', type: 'Spelling', explanation: 'The rule is "i before e except after c".' },
  'untill': { fix: 'until', type: 'Spelling', explanation: '"Until" is spelled with a single "l" at the end.' },
  'accomodate': { fix: 'accommodate', type: 'Spelling', explanation: 'Spelled with double "c" and double "m".' },
  'buisness': { fix: 'business', type: 'Spelling', explanation: 'Spelled with "u" before "s" and then "i".' },
  'goverment': { fix: 'government', type: 'Spelling', explanation: 'Remember the silent "n" before "m".' },
  'definately': { fix: 'definitely', type: 'Spelling', explanation: 'Spelled with "i" in the middle, derived from "definite".' },
  'occured': { fix: 'occurred', type: 'Spelling', explanation: 'Double the "r" when adding the past-tense suffix.' },
  'seperate': { fix: 'separate', type: 'Spelling', explanation: 'Spelled with an "a" in the second syllable: se-pa-rate.' },
  'dont': { fix: "don't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'cant': { fix: "can't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'wont': { fix: "won't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'shouldnt': { fix: "shouldn't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'wouldnt': { fix: "wouldn't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'couldnt': { fix: "couldn't", type: 'Punctuation', explanation: 'Requires an apostrophe for the contraction.' },
  'its a': { fix: "it's a", type: 'Grammar', explanation: 'Use "it\'s" (contraction of "it is") instead of the possessive "its".' },
};

const GRAMMAR_RULES = [
  {
    regex: /\bi\b/g,
    replace: 'I',
    type: 'Grammar',
    explanation: 'The personal pronoun "I" must always be capitalized.'
  },
  {
    regex: /\b(they|we|you) is\b/gi,
    replace: '$1 are',
    type: 'Subject-Verb Agreement',
    explanation: 'Plural pronouns and "you" require the plural verb "are".'
  },
  {
    regex: /\b(he|she|it) don't\b/gi,
    replace: '$1 doesn\'t',
    type: 'Subject-Verb Agreement',
    explanation: 'Third-person singular pronouns require "doesn\'t".'
  },
  {
    regex: /\b(i|they|we|you) doesn't\b/gi,
    replace: '$1 don\'t',
    type: 'Subject-Verb Agreement',
    explanation: 'Plural pronouns, "I", and "you" require "don\'t".'
  },
  {
    regex: /\bthere is many\b/gi,
    replace: 'there are many',
    type: 'Grammar',
    explanation: 'Use plural "there are" with plural count nouns like "many".'
  },
  {
    regex: / ,/g,
    replace: ',',
    type: 'Punctuation',
    explanation: 'Do not put a space before commas.'
  },
  {
    regex: / \./g,
    replace: '.',
    type: 'Punctuation',
    explanation: 'Do not put a space before periods.'
  },
  {
    regex: /\bat the end of the day\b/gi,
    replace: 'ultimately',
    type: 'Style/Cliché',
    explanation: 'Replace overused phrases with simpler, active options like "ultimately".'
  },
  {
    regex: /\babsolutely essential\b/gi,
    replace: 'essential',
    type: 'Style/Redundancy',
    explanation: '"Essential" already implies being absolute; "absolutely" is redundant.'
  },
  {
    regex: /\bvery unique\b/gi,
    replace: 'unique',
    type: 'Style/Redundancy',
    explanation: 'Something is either unique or not; "very" is redundant.'
  }
];

export const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [expandedError, setExpandedError] = useState<number | null>(null);

  const checkGrammarLocal = () => {
    if (!text.trim()) return;
    setLoading(true);

    // Simulate analysis delay
    setTimeout(() => {
      let corrected = text;
      const errorsList: GrammarError[] = [];

      // 1. Run regex rules first
      GRAMMAR_RULES.forEach(rule => {
        const matches = text.match(rule.regex);
        if (matches) {
          // Find original match representation if possible
          matches.forEach(m => {
            const fixVal = m.replace(rule.regex, rule.replace);
            const exists = errorsList.some(e => e.original.toLowerCase() === m.toLowerCase());
            if (!exists && m !== fixVal) {
              errorsList.push({
                type: rule.type,
                original: m,
                fix: fixVal,
                explanation: rule.explanation
              });
            }
          });
          corrected = corrected.replace(rule.regex, rule.replace);
        }
      });

      // 2. Scan word-by-word spelling typos
      const words = text.split(/(\s+|,|\.|\?|!|;)/);
      words.forEach((word) => {
        const cleanWord = word.toLowerCase().trim();
        if (cleanWord && COMMON_TYPOS[cleanWord]) {
          const matchDetail = COMMON_TYPOS[cleanWord];
          const exists = errorsList.some(e => e.original.toLowerCase() === word.toLowerCase());
          if (!exists) {
            errorsList.push({
              type: matchDetail.type,
              original: word,
              fix: matchDetail.fix,
              explanation: matchDetail.explanation
            });
          }
          // Perform replaced mapping maintaining title case if needed
          const isTitle = word[0] === word[0].toUpperCase() && word.length > 1 && word[1] === word[1].toLowerCase();
          const replacement = isTitle 
            ? matchDetail.fix.charAt(0).toUpperCase() + matchDetail.fix.slice(1)
            : matchDetail.fix;
          
          corrected = corrected.replace(new RegExp(`\\b${word}\\b`, 'g'), replacement);
        }
      });

      // Cleanup duplicated spacing
      corrected = corrected.replace(/ {2,}/g, ' ');

      const overallFeedback = errorsList.length > 0 
        ? `We found ${errorsList.length} possible improvement${errorsList.length === 1 ? '' : 's'}. Applying these will increase readability and clarity.`
        : "Standard structures met flawlessly. Your copy looks clean and professional!";

      setResult({
        original: text,
        corrected,
        errors: errorsList,
        overallFeedback
      });
      setExpandedError(null);
      setLoading(false);
    }, 800);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20" id="grammar-checker-root">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <SpellCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">GRAMMAR & SPELL <span className="text-indigo-600">CHECKER</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">100% Offline English Structural Validator</p>
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
                  placeholder="Paste or type your text here for offline grammar & spelling checks..."
                  className="w-full min-h-[240px] p-6 bg-slate-50/50 dark:bg-white/5 border-2 border-transparent rounded-[32px] text-lg font-medium outline-none focus:border-indigo-500/20 transition-all resize-none text-slate-800 dark:text-slate-100"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase">{text.length} Characters</span>
                </div>
              </div>

              <button
                onClick={checkGrammarLocal}
                disabled={loading || !text.trim()}
                className={`w-full py-5 rounded-[24px] flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all ${
                  loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.01] active:scale-95 cursor-pointer'
                }`}
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                {loading ? 'Validating Syntax...' : 'Analyze Grammar & Spellings'}
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
                          <h3 className="text-lg font-black tracking-tight italic">CORRECTED copy</h3>
                       </div>
                       <button 
                        onClick={() => copyToClipboard(result.corrected)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors cursor-pointer"
                       >
                          <Copy size={18} />
                       </button>
                    </div>
                    <p className="text-xl font-medium leading-relaxed opacity-100 selection:bg-emerald-400">
                      {result.corrected}
                    </p>
                    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                       <ClipboardCheck size={16} />
                       <p className="text-[11px] font-bold tracking-wide italic opacity-80">{result.overallFeedback}</p>
                    </div>
                  </div>
               </div>

               {/* Errors List */}
               <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <AlertCircle className="text-indigo-600" size={20} />
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Suggested Fixes ({result.errors.length})</h3>
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
                                  <span className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg text-[8px] font-black uppercase tracking-tighter">
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
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Perfect Grammar Alignment</p>
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
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Local Engine Specifications</p>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Syntactic validation runs entirely in the safety of your web browser layout client-side. No user text is ever transmitted or stored outside your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
