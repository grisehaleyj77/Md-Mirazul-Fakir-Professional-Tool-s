import React, { useState, useEffect } from 'react';
import { 
  Type, AlignLeft, RefreshCw, Layers, Sparkles, Copy, Check, Info, FileText, 
  HelpCircle, Shuffle, ListOrdered, ClipboardList, Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextSuiteProps {
  toolId?: string;
}

export const TextSuite = ({ toolId }: TextSuiteProps) => {
  const [activeSubTool, setActiveSubTool] = useState(toolId || 'tx-slug');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string>('');
  const [repeatCount, setRepeatCount] = useState<number>(10);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [loremCount, setLoremCount] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (toolId) {
      setActiveSubTool(toolId);
      setInputText('');
      setResult('');
    }
  }, [toolId]);

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 18. Text to Slug Generator
  const generateSlug = () => {
    const slug = inputText
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-')       // collapse whitespace and replace by -
      .replace(/-+/g, '-');       // collapse dashes
    setResult(slug);
  };

  // 19. Lorem Ipsum Generator
  const generateLorem = () => {
    const loremSample = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
      "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
      "Integer in mauris eu nibh euismod gravida. Duis ac tellus.",
      "Sed lectus. Integer euismod lacus luctus magna."
    ];

    let output = "";
    if (loremType === 'words') {
      const words = loremSample.join(" ").split(" ");
      output = words.slice(0, Math.min(loremCount, words.length)).join(" ");
    } else if (loremType === 'sentences') {
      const sentences = loremSample.join(" ").split(/[.!?]/).filter(s => s.trim());
      output = sentences.slice(0, Math.min(loremCount, sentences.length)).join(". ") + ".";
    } else {
      // Paragraphs
      const paragraphs = [];
      for (let i = 0; i < loremCount; i++) {
        paragraphs.push(loremSample.slice(0, 5).join(" "));
      }
      output = paragraphs.join("\n\n");
    }
    setResult(output);
  };

  // 20. Case Converter
  const convertCase = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'capitalized') => {
    if (!inputText) return;
    let converted = "";
    if (mode === 'upper') {
      converted = inputText.toUpperCase();
    } else if (mode === 'lower') {
      converted = inputText.toLowerCase();
    } else if (mode === 'title') {
      converted = inputText.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
    } else if (mode === 'sentence') {
      converted = inputText.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    } else if (mode === 'capitalized') {
      converted = inputText.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }
    setResult(converted);
  };

  // 21. Word Counter
  const countWords = () => {
    const charCount = inputText.length;
    const wordMatches = inputText.trim().match(/\S+/g);
    const wordCount = wordMatches ? wordMatches.length : 0;
    const lineCount = inputText ? inputText.split(/\r\n|\r|\n/).length : 0;
    const paragraphCount = inputText ? inputText.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 WPM average reading speed

    setResult(
      `Words: ${wordCount}\nCharacters: ${charCount}\nLines: ${lineCount}\nParagraphs: ${paragraphCount}\nEstimated Reading Time: ~${readingTime} Min`
    );
  };

  // 22. Remove Duplicate Lines
  const removeDuplicates = () => {
    const lines = inputText.split(/\r?\n/);
    const uniqueLines = Array.from(new Set(lines));
    setResult(uniqueLines.join("\n"));
  };

  // 23. Random Line / Name Selector
  const generateRandomLine = () => {
    const lines = inputText.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) {
      setResult("Please add individual lines of items/names to select from.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * lines.length);
    setResult(`Selected Item: ${lines[randomIndex]}`);
  };

  // 24. Text Repeater
  const repeatText = () => {
    if (!inputText) return;
    const repeated = Array(Number(repeatCount)).fill(inputText).join("\n");
    setResult(repeated);
  };

  // 25. Reverse Text Generator
  const reverseText = () => {
    const reversed = inputText.split("").reverse().join("");
    setResult(reversed);
  };

  // 26. Upside Down Text Flip Tool
  const upsideDownText = () => {
    const normalChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:\"<>?`-=[]\\;',./";
    const flippedChars = "ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎzⱯᗺƆᗡƎℲ⅁HIſKꞀWNOԀÒᴚS┴∩ΛMX⅄Z0⇂ᄅƐㄣϛ9ㄥ86¡@#$%^⅋*()‾+}{|:\"<>,`-[=]\\;',˙/";
    
    let flipped = "";
    for (let i = inputText.length - 1; i >= 0; i--) {
      const char = inputText[i];
      const index = normalChars.indexOf(char);
      if (index !== -1) {
        flipped += flippedChars[index];
      } else {
        flipped += char;
      }
    }
    setResult(flipped);
  };

  // 27. Line Counter
  const countLinesOnly = () => {
    const count = inputText ? inputText.split(/\r?\n/).length : 0;
    setResult(`Total Lines: ${count}`);
  };

  // 28. Comma Separator
  const commaSeparator = () => {
    const items = inputText.split(/\r?\n/).map(i => i.trim()).filter(i => i !== "");
    setResult(items.join(", "));
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-100 dark:border-slate-800">
        {[
          { id: 'tx-slug', label: 'Slug Generator', icon: Scissors },
          { id: 'tx-lorem', label: 'Lorem Dummy', icon: FileText },
          { id: 'tx-case', label: 'Case Swap', icon: Type },
          { id: 'tx-counter', label: 'Linguistic Counter', icon: AlignLeft },
          { id: 'tx-dup', label: 'Kill Duplicates', icon: Layers },
          { id: 'tx-random', label: 'Random Selector', icon: Shuffle },
          { id: 'tx-repeat', label: 'Multiplier Repeater', icon: ListOrdered },
          { id: 'tx-reverse', label: 'Char Reverse', icon: RefreshCw },
          { id: 'tx-flip', label: 'Upside Down', icon: Sparkles },
          { id: 'tx-lines', label: 'Row Tracker', icon: ClipboardList },
          { id: 'tx-comma', label: 'Comma Splitter', icon: ClipboardList }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              setActiveSubTool(btn.id);
              setInputText('');
              setResult('');
            }}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 ${
              activeSubTool === btn.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <btn.icon size={12} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Workspace Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-xl flex items-center justify-center">
            <Type size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white capitalize">
              {activeSubTool.replace('tx-', '').replace('-', ' ')}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Ready for text input</p>
          </div>
        </div>

        {activeSubTool === 'tx-lorem' ? (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lorem Target</label>
                    <select 
                      value={loremType}
                      onChange={(e: any) => setLoremType(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                    >
                       <option value="words">Words</option>
                       <option value="sentences">Sentences</option>
                       <option value="paragraphs">Paragraphs</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Count</label>
                    <input 
                      type="number"
                      value={loremCount}
                      onChange={(e) => setLoremCount(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                    />
                 </div>
             </div>
             <button
               onClick={generateLorem}
               className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01]"
             >
                <Sparkles size={14} />
                Generate Dummy Copy
             </button>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Input Text</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or write your text block here..."
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold resize-none"
                />
             </div>

             {activeSubTool === 'tx-repeat' && (
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multiplier Count</label>
                   <input 
                     type="number"
                     value={repeatCount}
                     aria-label="Repeat count"
                     onChange={(e) => setRepeatCount(Math.max(1, Number(e.target.value)))}
                     className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none"
                   />
                </div>
             )}

             {activeSubTool === 'tx-case' ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                   {[
                     { mode: 'upper', label: 'UPPERCASE' },
                     { mode: 'lower', label: 'lowercase' },
                     { mode: 'title', label: 'Title Case' },
                     { mode: 'sentence', label: 'Sentence' },
                     { mode: 'capitalized', label: 'Capitalized' }
                   ].map((c) => (
                     <button
                       key={c.mode}
                       onClick={() => convertCase(c.mode as any)}
                       className="p-3 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-slate-850 hover:bg-indigo-100 rounded-xl text-[9px] font-black uppercase tracking-tight text-indigo-700 dark:text-indigo-400"
                     >
                       {c.label}
                     </button>
                   ))}
                </div>
             ) : (
                <button
                  onClick={() => {
                    if (activeSubTool === 'tx-slug') generateSlug();
                    if (activeSubTool === 'tx-counter') countWords();
                    if (activeSubTool === 'tx-dup') removeDuplicates();
                    if (activeSubTool === 'tx-random') generateRandomLine();
                    if (activeSubTool === 'tx-repeat') repeatText();
                    if (activeSubTool === 'tx-reverse') reverseText();
                    if (activeSubTool === 'tx-flip') upsideDownText();
                    if (activeSubTool === 'tx-lines') countLinesOnly();
                    if (activeSubTool === 'tx-comma') commaSeparator();
                  }}
                  disabled={!inputText.trim()}
                  className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  Compute Formatting
                </button>
             )}
          </div>
        )}
      </div>

      {/* Results output */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <div className="bg-slate-900 text-white rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full" />
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Processed Result</span>
                   <button 
                     onClick={() => copyText(result)}
                     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                   >
                     {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                     {copied ? 'Copied' : 'Copy Text'}
                   </button>
                 </div>

                 <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto pr-2 bg-black/20 p-4 rounded-xl">
                    {result}
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Linguistic Helper Footer */}
      <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 flex gap-4">
        <Info size={20} className="text-indigo-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Precision Processing Rules</p>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Formatting computations are run locally inside the client thread for instant execution and 100% security privacy.
          </p>
        </div>
      </div>
    </div>
  );
};
