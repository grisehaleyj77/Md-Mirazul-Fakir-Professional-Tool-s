import React, { useState } from 'react';
import { Languages, Copy, Check, Loader2, Volume2, Sparkles, Globe2, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Language = 'bn' | 'en' | 'de';

interface TranslationPair {
  lang: Language;
  label: string;
  text: string;
}

export const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>('bn');
  const [results, setResults] = useState<TranslationPair[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const translate = async () => {
    if (!sourceText || !process.env.GEMINI_API_KEY) return;
    
    setIsTranslating(true);
    try {
      const targets: Language[] = sourceLang === 'bn' ? ['en', 'de'] : 
                         sourceLang === 'en' ? ['bn', 'de'] : ['bn', 'en'];

      const prompt = `Translate the following text from ${getLangName(sourceLang)} to ${targets.map(getLangName).join(' and ')}.
      Text: "${sourceText}"
      
      Format your response strictly as a JSON object:
      {
        "${targets[0]}": "translation here",
        "${targets[1]}": "translation here"
      }
      Just return the JSON. No other text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const data = JSON.parse(response.text || '{}');
      
      const newResults: TranslationPair[] = targets.map(lang => ({
        lang,
        label: getLangName(lang),
        text: data[lang] || 'Translation unavailable'
      }));

      setResults(newResults);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const getLangName = (l: Language) => {
    if (l === 'bn') return 'Bengali';
    if (l === 'en') return 'English';
    return 'German';
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speak = (text: string, lang: Language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'bn') utterance.lang = 'bn-BD';
    else if (lang === 'en') utterance.lang = 'en-US';
    else if (lang === 'de') utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Source Selection */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--glass)] p-6 rounded-[32px] border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
              <Globe2 className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Translation Source</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Select input language</p>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
           {(['bn', 'en', 'de'] as Language[]).map(l => (
             <button 
              key={l}
              onClick={() => setSourceLang(l)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sourceLang === l ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-emerald-500'
              }`}
             >
               {getLangName(l)}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Card */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Languages className="w-40 h-40" />
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                 <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Source Content
                 </h4>
                 {sourceText && (
                   <button onClick={() => setSourceText('')} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                   </button>
                 )}
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={sourceLang === 'bn' ? "এখানে লিখুন..." : sourceLang === 'en' ? "Type here..." : "Hier schreiben..."}
                className="w-full h-80 bg-transparent border-none outline-none text-2xl font-bold tracking-tight resize-none custom-scrollbar text-[var(--ink)] placeholder:text-slate-200"
              />

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
                 <button 
                  onClick={() => speak(sourceText, sourceLang)}
                  className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all"
                 >
                    <Volume2 className="w-5 h-5" />
                 </button>
                 <button
                  onClick={translate}
                  disabled={isTranslating || !sourceText}
                  className="flex-1 h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isTranslating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
                    Convert Master
                 </button>
              </div>
           </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center justify-between text-slate-400 px-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Translation Matrix</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black uppercase">Live Engine Active</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                 {results.length > 0 ? (
                    results.map((res) => (
                       <motion.div 
                        key={res.lang}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-white/5 p-8 rounded-[40px] text-white shadow-2xl space-y-6 relative group flex flex-col"
                       >
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Target Language</p>
                                <h5 className="text-sm font-black italic tracking-tighter uppercase text-emerald-400">{res.label}</h5>
                             </div>
                             <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => speak(res.text, res.lang)}
                                  className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
                                >
                                   <Volume2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>

                          <div className="flex-1 bg-white/5 rounded-3xl p-6 min-h-[160px] max-h-[160px] overflow-y-auto custom-scrollbar border border-white/5">
                             <p className="text-lg font-bold leading-relaxed">{res.text}</p>
                          </div>

                          <button 
                            onClick={() => copyToClipboard(res.text, res.lang)}
                            className={`w-full h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                              copiedId === res.lang ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                            }`}
                          >
                             {copiedId === res.lang ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                             {copiedId === res.lang ? 'Copied' : 'Fast Copy'}
                          </button>
                       </motion.div>
                    ))
                 ) : (
                    <div className="md:col-span-2 h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-white/10 rounded-[48px] space-y-6 opacity-20">
                       <Globe2 className="w-16 h-16" />
                       <div className="text-center space-y-2">
                          <p className="text-sm font-black uppercase tracking-[0.4em]">Matrix Idle</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Enter content in the source monitor to begin<br/>the multi-lingual conversion process.</p>
                       </div>
                    </div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

