import React, { useState } from 'react';
import { Languages, ArrowRight, Volume2, Copy, Check, RotateCcw, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OFFLINE_DICTIONARY: Record<string, Record<string, string>> = {
  // English key maps
  'hello': { bn: 'হ্যালো (Hello)', de: 'Hallo' },
  'how are you': { bn: 'আপনি কেমন আছেন? (Kemon achen?)', de: 'Wie geht es Ihnen?' },
  'welcome': { bn: 'স্বাগতম (Shagotom)', de: 'Willkommen' },
  'good morning': { bn: 'শুভ সকাল (Shuvo shokal)', de: 'Guten Morgen' },
  'good night': { bn: 'শুভ রাত্রি (Shuvo ratri)', de: 'Gute Nacht' },
  'thank you': { bn: 'ধন্যবাদ (Dhonnobad)', de: 'Danke' },
  'please': { bn: 'দয়া করে (Doya kore)', de: 'Bitte' },
  'sorry': { bn: 'দুঃখিত (Dukkhito)', de: 'Es tut mir leid / Entschuldigung' },
  'yes': { bn: 'হ্যাঁ (Hae)', de: 'Ja' },
  'no': { bn: 'না (Na)', de: 'Nein' },
  'goodbye': { bn: 'বিদায় (Biday)', de: 'Auf Wiedersehen' },
  'i love you': { bn: 'আমি তোমাকে ভালোবাসি (Ami tomake bhalobashi)', de: 'Ich liebe dich' },
  'friend': { bn: 'বন্ধু (Bondhu)', de: 'Freund' },
  'family': { bn: 'পরিবার (Poribar)', de: 'Familie' },
  'water': { bn: 'পানি (Pani)', de: 'Wasser' },
  'food': { bn: 'খাবার (Khabar)', de: 'Essen' },
  'book': { bn: 'বই (Boi)', de: 'Buch' },
  'school': { bn: 'বিদ্যালয় (Biddaloy)', de: 'Schule' },
  'work': { bn: 'কাজ (Kaj)', de: 'Arbeit' },
  'world': { bn: 'পৃথিবী (Prithibi)', de: 'Welt' },
  'beautiful': { bn: 'সুন্দর (Sundor)', de: 'Schön' },
  'happy': { bn: 'সুখী (Shukhi)', de: 'Glücklich' },
  'success': { bn: 'সাফল্য (Safollo)', de: 'Erfolg' },
  'time': { bn: 'সময় (Shomoy)', de: 'Zeit' },
  'knowledge': { bn: 'জ্ঞান (Gyan)', de: 'Wissen' },
  'freedom': { bn: 'স্বাধীনতা (Shadhinota)', de: 'Freiheit' },
  'peace': { bn: 'শান্তি (Shanti)', de: 'Frieden' },
  'love': { bn: 'ভালোবাসা (Bhalobasha)', de: 'Liebe' },
  'life': { bn: 'জীবন (Jibon)', de: 'Leben' },
};

const OFFLINE_CATEGORIES = [
  {
    name: "Common Greetings",
    items: [
      { en: "Hello", bn: "হ্যালো (Hello)", de: "Hallo" },
      { en: "How are you?", bn: "আপনি কেমন আছেন? (Kemon achen?)", de: "Wie geht es Ihnen?" },
      { en: "Good morning", bn: "শুভ সকাল (Shuvo shokal)", de: "Guten Morgen" },
      { en: "Good night", bn: "শুভ রাত্রি (Shuvo ratri)", de: "Gute Nacht" },
      { en: "Goodbye", bn: "বিদায় (Biday)", de: "Auf Wiedersehen" },
    ]
  },
  {
    name: "Social Phrases",
    items: [
      { en: "Thank you", bn: "ধন্যবাদ (Dhonnobad)", de: "Danke" },
      { en: "Please", bn: "দয়া করে (Doya kore)", de: "Bitte" },
      { en: "Excuse me", bn: "মাফ করবেন (Maf korben)", de: "Entschuldigung" },
      { en: "Can you help me?", bn: "আপনি কি আমাকে সাহায্য করতে পারেন? (Sahajjo?)", de: "Können Sie mir helfen?" },
      { en: "Nice to meet you", bn: "আপনার সাথে দেখা করে ভালো লাগলো (Dekha kore bhalo laglo)", de: "Schön, Sie kennenzulernen" },
    ]
  },
  {
    name: "Work & Tech Vocab",
    items: [
      { en: "Work", bn: "কাজ (Kaj)", de: "Arbeit" },
      { en: "Computer", bn: "কম্পিউটার (Computer)", de: "Computer" },
      { en: "Information", bn: "তথ্য (Tottho)", de: "Information" },
      { en: "Success", bn: "সাফল্য (Safollo)", de: "Erfolg" },
      { en: "Office", bn: "কার্যালয় (Karjaloy)", de: "Büro" },
    ]
  }
];

export const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState<'en' | 'bn' | 'de'>('en');
  const [targetLang, setTargetLang] = useState<'en' | 'bn' | 'de'>('bn');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const translateOffline = () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);

    setTimeout(() => {
      const cleanInput = sourceText.toLowerCase().trim().replace(/[?.!,;]/g, '');
      
      // 1. Check exact dict match
      if (sourceLang === 'en' && OFFLINE_DICTIONARY[cleanInput]) {
        const transRecord = OFFLINE_DICTIONARY[cleanInput];
        if (targetLang === 'bn') {
          setTargetText(transRecord.bn);
          setIsTranslating(false);
          return;
        } else if (targetLang === 'de') {
          setTargetText(transRecord.de);
          setIsTranslating(false);
          return;
        } else {
          setTargetText(sourceText);
          setIsTranslating(false);
          return;
        }
      }

      // 2. Perform fallback word-by-word converter
      const words = sourceText.split(/(\s+)/);
      const outputParts = words.map(part => {
        const cleanWord = part.toLowerCase().replace(/[?.!,;]/g, '').trim();
        if (!cleanWord) return part; // Maintain space or separator

        // Map English to target language
        if (sourceLang === 'en' && OFFLINE_DICTIONARY[cleanWord]) {
          const dictVal = OFFLINE_DICTIONARY[cleanWord];
          const matchedTrans = targetLang === 'bn' ? dictVal.bn : dictVal.de;
          
          // Maintain capitalization
          const isCapital = part[0] === part[0].toUpperCase();
          return isCapital ? matchedTrans.charAt(0).toUpperCase() + matchedTrans.slice(1) : matchedTrans;
        }

        // Return word unchanged with brackets fallback notice
        return part;
      });

      let finalResult = outputParts.join('');

      // Add a helpful fallback notice if the input is complex and does not have exact matches
      const hasAnyMatch = words.some(w => OFFLINE_DICTIONARY[w.toLowerCase().trim()]);
      if (!hasAnyMatch && sourceText.split(/\s+/).length > 2) {
        finalResult = finalResult + `\n\n[Linguistic Note: This sentence was parsed offline. Registering common vocab offsets. Try using simpler terms like 'Hello', 'Water', 'Thank you', 'Beautiful', 'School' for exact matches.]`;
      }

      setTargetText(finalResult);
      setIsTranslating(false);
    }, 500);
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang as any);
    setTargetLang(tempLang as any);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakTranslation = () => {
    if (!targetText || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Convert target mapping codes to engine speech lang tags
    const langMap = { en: 'en-US', bn: 'bn-BD', de: 'de-DE' };
    const cleanSpeechText = targetText.replace(/\[.*\]/g, ''); // strip linguistic notes
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = langMap[targetLang] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8" id="translator-suite-root">
      
      {/* Brand Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-teal-600 rounded-2xl text-white">
          <Languages size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">OFFLINE <span className="text-teal-600">TRANSLATOR</span></h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Multi-lingual Phrasebook & Vocabulary Converter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Work Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
            
            {/* Language Selection Bar */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as any)}
                className="bg-transparent text-sm font-black text-slate-700 dark:text-slate-300 outline-none select-none px-3 cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="bn">Bengali (BD)</option>
                <option value="de">German (DE)</option>
              </select>

              <button 
                onClick={swapLanguages}
                className="p-2.5 bg-white dark:bg-slate-700 rounded-xl hover:scale-110 active:scale-95 transition-all text-slate-500 hover:text-teal-600 shadow-sm cursor-pointer"
              >
                <ArrowRight size={16} />
              </button>

              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as any)}
                className="bg-transparent text-sm font-black text-slate-700 dark:text-slate-300 outline-none select-none px-3 cursor-pointer"
              >
                <option value="bn">Bengali (BD)</option>
                <option value="en">English (US)</option>
                <option value="de">German (DE)</option>
              </select>
            </div>

            {/* Source & Target Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div className="space-y-2">
                 <textarea 
                   value={sourceText}
                   onChange={(e) => setSourceText(e.target.value)}
                   placeholder={`Type words or phrases to convert... (e.g., Hello, Water, Work, Thank you, goodbye)`}
                   className="w-full h-72 bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-5 border-2 border-transparent focus:border-teal-500/20 outline-none transition-all text-base font-semibold resize-none text-slate-800 dark:text-slate-100"
                 />
               </div>

               <div className="space-y-2 relative">
                 <div className="w-full h-72 bg-teal-500/5 rounded-3xl p-5 border border-teal-500/10 text-base font-semibold overflow-y-auto overflow-x-hidden text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                   {targetText || <span className="text-slate-400 italic font-medium">Converted translation will appear here...</span>}
                 </div>

                 {targetText && (
                   <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button 
                        onClick={speakTranslation}
                        className="p-3 bg-white dark:bg-slate-800 text-slate-500 hover:text-teal-600 rounded-2xl shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                      >
                         <Volume2 size={16} />
                      </button>
                      <button 
                        onClick={copyToClipboard}
                        className="p-3 bg-white dark:bg-slate-800 text-slate-500 hover:text-teal-600 rounded-2xl shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                      >
                         {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                   </div>
                 )}
               </div>

            </div>

            {/* Action Button */}
            <button 
              onClick={translateOffline}
              disabled={isTranslating || !sourceText.trim()}
              className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTranslating ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
              {isTranslating ? "Retrieving Phrase mappings..." : "Translate Phrase"}
            </button>

          </div>
        </div>

        {/* Categories Phrasebook Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
             <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-teal-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Offline Phrasebook Library</h3>
             </div>

             <div className="space-y-6 max-h-[460px] overflow-y-auto pr-1">
                {OFFLINE_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                     <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{cat.name}</p>
                     
                     <div className="space-y-2">
                       {cat.items.map((item, itemIdx) => (
                         <div 
                           key={itemIdx}
                           onClick={() => { setSourceText(item.en); setSourceLang('en'); }}
                           className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/20 border border-transparent hover:border-teal-500/10 transition-all cursor-pointer text-left"
                         >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{item.en}</span>
                              <span className="text-[9px] font-mono text-slate-400">Click to load</span>
                            </div>
                            <div className="flex gap-4 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-500 font-medium">
                               <span>bn: <strong className="text-slate-600 dark:text-slate-400">{item.bn}</strong></span>
                               <span>de: <strong className="text-slate-600 dark:text-slate-400">{item.de}</strong></span>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>

    </div>
  );
};
