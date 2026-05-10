import React, { useState } from 'react';
import { Search, Volume2, Languages, Book, Copy, Check, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface WordResult {
  word: string;
  pronunciation: string;
  bengali_meaning: string;
  parts_of_speech: string;
  definitions: string[];
  synonyms: string[];
  examples: string[];
}

export const EnglishToBengaliDictionary = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<WordResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const searchWord = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as an English to Bengali Dictionary. Provide a detailed definition for the word: "${query}". 
        Return the data strictly in the following JSON format:
        {
          "word": "original english word",
          "pronunciation": "phonetic pronunciation",
          "bengali_meaning": "main bengali meaning",
          "parts_of_speech": "noun/verb/etc",
          "definitions": ["primary definition", "secondary definition"],
          "synonyms": ["synonym 1", "synonym 2"],
          "examples": ["example sentence 1", "example sentence 2"]
        }`
      });

      const text = response.text || '';
      // Extract JSON if model wraps it in code blocks
      const jsonStr = text.replace(/```json|```/gi, '').trim();
      const data = JSON.parse(jsonStr) as WordResult;
      
      setResult(data);
    } catch (err) {
      console.error("Dictionary Search Error:", err);
      setError("Could not find the word. Please try another one.");
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar Section */}
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[32px] p-8 border border-[var(--glass-border)] shadow-sm">
        <form onSubmit={searchWord} className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 group-focus-within:scale-110 transition-transform" />
          <input 
            type="text" 
            placeholder="Type an English word..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-6 pl-16 pr-32 text-xl font-bold text-[var(--text-main)] outline-none focus:border-blue-500/50 shadow-sm transition-all"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "SEARCH"}
          </button>
        </form>

        <div className="flex gap-4 mt-6">
           {['Apple', 'Galaxy', 'Integrity', 'Resilience'].map(word => (
             <button 
                key={word} 
                onClick={() => { setQuery(word); }}
                className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-full text-xs font-black text-slate-400 border border-slate-100 dark:border-white/10 hover:border-blue-500/30 transition-all uppercase tracking-tighter"
             >
                {word}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <Sparkles className="w-5 h-5 text-indigo-500 absolute top-0 right-0 animate-pulse" />
            </div>
            <p className="font-black text-[var(--text-muted)] animate-pulse uppercase tracking-[0.2em] text-xs">Consulting AI Linguist...</p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Word Header Card */}
            <div className="bg-white dark:bg-white/5 rounded-[40px] p-10 border border-[var(--glass-border)] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                 <Languages className="w-20 h-20 text-blue-600/5 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-2">
                   <h2 className="text-5xl font-black tracking-tighter text-blue-600">{result.word}</h2>
                   <button 
                      onClick={() => speak(result.word)}
                      className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-full hover:scale-110 transition-transform active:scale-95"
                   >
                      <Volume2 className="w-5 h-5" />
                   </button>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-slate-400 font-mono text-sm tracking-widest uppercase">[{result.pronunciation}]</span>
                   <span className="px-3 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded font-black text-[10px] text-indigo-600 uppercase italic">
                      {result.parts_of_speech}
                   </span>
                </div>

                <div className="mt-10 mb-8 border-l-4 border-blue-600 pl-8">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Bengali Meaning</p>
                   <h3 className="text-4xl font-black text-[var(--text-main)] BengaliFont">{result.bengali_meaning}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Definitions */}
              <div className="bg-[var(--glass)] backdrop-blur-xl rounded-[32px] p-8 border border-[var(--glass-border)]">
                 <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <Book className="w-4 h-4 text-blue-500" />
                   Definitions
                 </h4>
                 <ul className="space-y-4">
                    {result.definitions.map((def, i) => (
                      <li key={i} className="flex gap-4 group">
                         <div className="w-6 h-6 shrink-0 bg-blue-50 dark:bg-white/5 rounded flex items-center justify-center font-black text-[10px] text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {i + 1}
                         </div>
                         <p className="text-sm font-medium leading-relaxed text-[var(--text-main)]">{def}</p>
                      </li>
                    ))}
                 </ul>
              </div>

              {/* Examples */}
              <div className="bg-[var(--glass)] backdrop-blur-xl rounded-[32px] p-8 border border-[var(--glass-border)]">
                 <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <MessageCircle className="w-4 h-4 text-indigo-500" />
                   Examples
                 </h4>
                 <ul className="space-y-4">
                    {result.examples.map((ex, i) => (
                      <li key={i} className="relative pl-6">
                         <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-200 rounded-full" />
                         <p className="text-sm font-medium italic text-slate-500 dark:text-slate-400 group cursor-pointer hover:text-indigo-600 transition-colors">
                            "{ex}"
                         </p>
                      </li>
                    ))}
                 </ul>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 bg-[var(--glass)] backdrop-blur-xl rounded-[32px] p-8 border border-[var(--glass-border)]">
                  <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6">Synonyms</h4>
                  <div className="flex flex-wrap gap-2">
                     {result.synonyms.map((syn, i) => (
                       <span 
                        key={i} 
                        className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl text-xs font-bold text-[var(--text-main)] shadow-sm border border-slate-100 dark:border-white/5 hover:border-blue-500/50 cursor-default transition-all"
                       >
                         {syn}
                       </span>
                     ))}
                  </div>
               </div>

               <button 
                  onClick={() => copyToClipboard(result.bengali_meaning)}
                  className="flex flex-col items-center justify-center gap-3 bg-blue-600 text-white rounded-[32px] hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
               >
                  {copied ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                  <span className="font-black text-xs uppercase tracking-widest">{copied ? "Copied!" : "Copy Meaning"}</span>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&display=swap');
        .BengaliFont {
          font-family: 'Hind Siliguri', sans-serif;
        }
      `}</style>
    </div>
  );
};
