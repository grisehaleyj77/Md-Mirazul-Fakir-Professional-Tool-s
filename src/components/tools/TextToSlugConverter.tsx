import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  Settings, 
  RotateCcw,
  Sliders,
  Type, 
  FileText,
  HelpCircle,
  Hash,
  RefreshCw,
  Globe,
  Settings2
} from 'lucide-react';

export function TextToSlugConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Settings
  const [separator, setSeparator] = useState<'-' | '_' | '/' | '.' | ''>('-');
  const [casingStyle, setCasingStyle] = useState<'lowercase' | 'uppercase' | 'camelCase' | 'default'>('lowercase');
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [keepAccents, setKeepAccents] = useState(false);
  const [maxLength, setMaxLength] = useState<number>(100);
  const [multilineMode, setMultilineMode] = useState(false);

  // Simple Stop Words Set
  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
    'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
    'he', 'her', 'here', 'hers', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
    'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
    'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
    'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were',
    'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you', 'your', 'yours', 'yourself',
    'yourselves'
  ]);

  // Accent mapping helper
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const convertSingleSlug = (text: string): string => {
    let result = text;

    // Normalize accents/diacritics
    if (!keepAccents) {
      result = removeAccents(result);
    }

    // Strip numbers if configured
    if (removeNumbers) {
      result = result.replace(/[0-9]/g, '');
    }

    // Split into token words
    // Match any word/alphanumeric sequence including non-Latin characters
    let words = (result.match(/[\w\u00C0-\u017F\u0980-\u09FF]+/gi) || []) as string[];

    // Filter out stop words
    if (removeStopWords) {
      words = words.filter(word => !STOP_WORDS.has(word.toLowerCase()));
    }

    if (words.length === 0) return '';

    // Apply casing transformation on individual tokens
    let processedWords = words.map((word, index) => {
      if (casingStyle === 'lowercase') {
        return word.toLowerCase();
      } else if (casingStyle === 'uppercase') {
        return word.toUpperCase();
      } else if (casingStyle === 'camelCase') {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word; // default / match case
    });

    // Join using the separator
    let slug = processedWords.join(separator);

    // Trim length at word boundaries or exact characters limit
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      // Clean up trailing separator if any
      if (separator && slug.endsWith(separator)) {
        slug = slug.slice(0, -separator.length);
      }
    }

    return slug;
  };

  const generateSlugs = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    if (multilineMode) {
      const lines = inputText.split('\n');
      const slugs = lines.map(line => convertSingleSlug(line)).filter(Boolean);
      setOutputText(slugs.join('\n'));
    } else {
      setOutputText(convertSingleSlug(inputText));
    }
  };

  useEffect(() => {
    generateSlugs();
  }, [inputText, separator, casingStyle, removeStopWords, removeNumbers, keepAccents, maxLength, multilineMode]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `slugs_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const loadExample = () => {
    if (multilineMode) {
      setInputText(`Web Design, Development & SEO tips
How to master React in 2026!
Top 10 features of Google AI Studio`);
    } else {
      setInputText("15 Incredible Secrets of Modern CSS Grid Layout!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-cyan-500/30" id="slug-converter-root">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 block">Publication Utilities</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Link2 className="w-10 h-10 text-cyan-500 stroke-[2.5]" />
              Text to Slug Converter
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Instantly transform blog post titles, URLs, and filenames into clean, SEO-optimized URL slugs. Normalize Unicode punctuation, handles multiple case variations, accents, and custom separators.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadExample}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-[#22d3ee] rounded-2xl border border-cyan-500/20 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-cyan-400" />
              Load example Text
            </button>
          </div>
        </div>

        {/* Workspace Matrix Config */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Input Element Card */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Type className="h-4 w-4 text-cyan-400" />
                  {multilineMode ? 'List of Titles (One per line)' : 'Original Title / Header Text'}
                </span>
                
                {inputText && (
                  <button 
                    onClick={handleClear}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors tooltip rounded-xl hover:bg-white/5"
                    title="Clear text inputs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={multilineMode ? "Paste multiple post titles here, one line per item...\nHow to Learn React\nDeploying Node backend servers" : "Type or paste your header, article title, or file name here..."}
                className="w-full h-44 bg-transparent border-0 resize-none font-sans text-sm leading-relaxed text-slate-200 placeholder-slate-705 focus:outline-none focus:ring-0"
              />

              {/* Multiline Toggle footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Words detected: {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Bulk Mode (Multiline)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMultilineMode(!multilineMode);
                      handleClear();
                    }}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      multilineMode ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        multilineMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Output Segment Card */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  SEO Slug Result
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`p-2.5 rounded-xl transition-all border ${
                      copied 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Copy Url Slug"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="p-2.5 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title="Download Slugs List"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {outputText ? (
                <div className="w-full min-h-24 max-h-64 overflow-y-auto bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-mono text-sm leading-relaxed text-cyan-400 select-all whitespace-pre-wrap break-all">
                  {outputText}
                </div>
              ) : (
                <div className="w-full h-24 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-600 font-mono text-xs text-center p-4">
                  <Link2 className="w-6 h-6 mb-1 text-slate-700 animate-pulse" />
                  <p className="uppercase tracking-widest font-black text-[9px] text-slate-600">Awaiting text inputs</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Parameters panel */}
          <div className="space-y-8" id="slug-parameters-column">
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 space-y-8 sticky top-8 animate-fade-in-delayed">
              
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 bg-cyan-600/10 rounded-2xl flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Slug Preferences</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Format matching parameters</p>
                </div>
              </div>

              <div className="space-y-6">

                {/* Slug Separator */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Word Separator</span>
                  <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#050505] rounded-xl border border-white/5 font-mono">
                    {([
                      { id: '-', label: 'hyphen', char: '-' },
                      { id: '_', label: 'underscore', char: '_' },
                      { id: '/', label: 'slash', char: '/' },
                      { id: '.', label: 'dot', char: '.' },
                      { id: '', label: 'none', char: '∅' }
                    ] as const).map(sep => (
                      <button
                        key={sep.id}
                        type="button"
                        onClick={() => setSeparator(sep.id as any)}
                        className={`py-2 text-xs rounded-lg font-bold transition-all border ${separator === sep.id ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-350'}`}
                        title={sep.label}
                      >
                        {sep.char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formatting Casing styles selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Letter Case Styling</span>
                  <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/5 font-mono">
                    {([
                      { id: 'lowercase', label: 'lowercase' },
                      { id: 'uppercase', label: 'UPPERCASE' },
                      { id: 'camelCase', label: 'camelCase' },
                      { id: 'default', label: 'Original' }
                    ] as const).map(style => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setCasingStyle(style.id)}
                        className={`py-2 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all ${casingStyle === style.id ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-bold' : 'bg-transparent border-transparent text-slate-505'}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing length truncate limit */}
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <span>Limit Truncate Length</span>
                    <span className="text-cyan-455 font-bold">{maxLength} chars</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="200"
                    step="5"
                    value={maxLength}
                    onChange={(e) => setMaxLength(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[8px] text-slate-600 block leading-tight">Restrict excessive address link index sizes automatically.</span>
                </div>

                {/* Filter Stop Words Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Exclude English Stop Words</span>
                    <span className="text-[8px] text-slate-600 block">Remove "the", "a", "is", "of" etc.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemoveStopWords(!removeStopWords)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      removeStopWords ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        removeStopWords ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Strip Numbers Switch */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                  <div className="space-y-0.5 font-sans">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Omit Standalone Numbers</span>
                    <span className="text-[8px] text-slate-600 block font-mono">"React in 2026" → "react"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemoveNumbers(!removeNumbers)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      removeNumbers ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        removeNumbers ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Accent retention toggle */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                  <div className="space-y-0.5 font-sans">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Retain Accent Characters</span>
                    <span className="text-[8px] text-slate-600 block font-mono">"cliché" → "cliché" vs "cliche"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKeepAccents(!keepAccents)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      keepAccents ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        keepAccents ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* Guide/Snippet info */}
              <div className="bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-400 text-[10px]">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wide text-[10px]">Why use exact URL Slugs?</h4>
                  <p className="leading-relaxed">
                    Short, semantic slugs are parsed faster by search indexing crawlers and increase user click-through indices on search index result displays.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
