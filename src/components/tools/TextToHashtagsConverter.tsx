import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  RefreshCw, 
  Settings, 
  Sliders, 
  SlidersHorizontal,
  Instagram, 
  Twitter, 
  Linkedin, 
  TrendingUp, 
  Type, 
  ListPlus, 
  Flame, 
  AlertCircle,
  CopyCheck,
  CheckCircle,
  Scissors,
  CheckSquare,
  Sparkle,
  Plus,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Common English Stop Words for filter extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 'could',
  "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's",
  'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm",
  "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't",
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't",
  'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't",
  'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why',
  "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours',
  'yourself', 'yourselves', 'but', 'will', 'just', 'like', 'get', 'has', 'had', 'one'
]);

interface DynamicHashtag {
  tag: string;
  category: 'broad' | 'core' | 'niche' | 'trending' | 'extracted' | 'custom';
}

export function TextToHashtagsConverter() {
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [casingStyle, setCasingStyle] = useState<'CamelCase' | 'lowercase' | 'UPPERCASE' | 'snake_case'>('CamelCase');
  const [minWordLength, setMinWordLength] = useState(4);
  const [filterStopWords, setFilterStopWords] = useState(true);
  const [stripNumbers, setStripNumbers] = useState(false);
  
  // Custom prefix/suffix
  const [tagPrefix, setTagPrefix] = useState('');
  const [tagSuffix, setTagSuffix] = useState('');

  const [hashtags, setHashtags] = useState<DynamicHashtag[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Recommendations for each platform
  const PLATFORM_LIMITS: { [key: string]: { optimal: number, max: number, icon: any, color: string } } = {
    'Instagram': { optimal: 15, max: 30, icon: Instagram, color: 'text-pink-500' },
    'TikTok': { optimal: 4, max: 8, icon: Flame, color: 'text-rose-500' },
    'YouTube Shorts': { optimal: 3, max: 10, icon: TrendingUp, color: 'text-red-500' },
    'LinkedIn': { optimal: 3, max: 5, icon: Linkedin, color: 'text-blue-500' },
    'X (Twitter)': { optimal: 2, max: 4, icon: Twitter, color: 'text-sky-400' }
  };

  const activeLimit = PLATFORM_LIMITS[platform] || { optimal: 10, max: 30 };

  // Helper formatting function
  const formatHashtagText = (word: string, style: 'CamelCase' | 'lowercase' | 'UPPERCASE' | 'snake_case') => {
    // Strip everything not word/number
    let clean = word.replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '');
    if (!clean) return '';

    // Remove any leading hashes or underscores first
    clean = clean.replace(/^#+/, '');

    let result = '';
    switch (style) {
      case 'lowercase':
        result = clean.toLowerCase();
        break;
      case 'UPPERCASE':
        result = clean.toUpperCase();
        break;
      case 'snake_case':
        // split CamelCase words first to introduce underscore if useful
        result = clean
          .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
          .toLowerCase();
        break;
      case 'CamelCase':
      default:
        // Capitalize first letter, keep rest as is
        result = clean.charAt(0).toUpperCase() + clean.slice(1);
        break;
    }

    // Apply custom prefix and suffix if any
    let finalTag = result;
    if (tagPrefix) {
      finalTag = tagPrefix.trim() + finalTag;
    }
    if (tagSuffix) {
      finalTag = finalTag + tagSuffix.trim();
    }

    // Make sure it starts with exactly one #
    return finalTag.startsWith('#') ? finalTag : `#${finalTag}`;
  };

  // 1. Offline rule-based extractor
  const handleExtractRuleBased = () => {
    if (!inputText.trim()) {
      setErrorMsg('Please write some text to parse.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      // Clean paragraphs into simple arrays of tokens
      const words = inputText
        .split(/[\s,.\/#!$%\^&\*;:{}=\-_`~()?" Bangladesh]+/g)
        .map(w => w.trim())
        .filter(w => w.length > 0);

      const uniqueTags = new Set<string>();
      const processedTags: DynamicHashtag[] = [];

      words.forEach(word => {
        const lowerWord = word.toLowerCase();
        
        // Apply Filters: word length
        if (word.length < minWordLength) return;
        
        // Apply Filters: stop words
        if (filterStopWords && STOP_WORDS.has(lowerWord)) return;
        
        // Apply Filters: strip numbers
        if (stripNumbers && /^\d+$/.test(word)) return;

        const formatted = formatHashtagText(word, casingStyle);
        if (formatted && formatted !== '#' && !uniqueTags.has(formatted.toLowerCase())) {
          uniqueTags.add(formatted.toLowerCase());
          processedTags.push({
            tag: formatted,
            category: 'extracted'
          });
        }
      });

      // Also support generating a whole sentence tag as bonus option
      if (words.length > 1 && uniqueTags.size > 0) {
        const fullShortPhrase = words.slice(0, 5).join('');
        const formattedPhrase = formatHashtagText(fullShortPhrase, casingStyle);
        if (formattedPhrase && formattedPhrase !== '#') {
          processedTags.unshift({
            tag: formattedPhrase,
            category: 'core'
          });
        }
      }

      setHashtags(processedTags.slice(0, activeLimit.max));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing text extraction.');
    } finally {
      setLoading(false);
    }
  };

  // 2. AI Smart Suggest API Route Call
  const handleExtractAISmart = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please add post text to generate contextual representations.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/text-to-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          platform: platform,
          count: activeLimit.max,
          style: casingStyle
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Server rejected request');
      }

      const data = await response.json();
      const allTags: DynamicHashtag[] = [];

      // Map API key values into categories
      const categories: ('broad' | 'core' | 'niche' | 'trending')[] = ['broad', 'core', 'niche', 'trending'];
      
      categories.forEach(cat => {
        if (Array.isArray(data[cat])) {
          data[cat].forEach((item: string) => {
            const formatted = item.startsWith('#') ? item : `#${item}`;
            allTags.push({
              tag: formatted,
              category: cat
            });
          });
        }
      });

      // Filter duplicates
      const uniques = new Map<string, DynamicHashtag>();
      allTags.forEach(t => uniques.set(t.tag.toLowerCase(), t));

      setHashtags(Array.from(uniques.values()));
    } catch (err: any) {
      setErrorMsg(`AI extraction failed: ${err.message}. Falling back to Rule-based extraction!`);
      // Fallback
      handleExtractRuleBased();
    } finally {
      setLoading(false);
    }
  };

  // Add manually defined tag
  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;

    let cleanWord = customTagInput.trim();
    if (!cleanWord.startsWith('#')) {
      cleanWord = `#${cleanWord}`;
    }

    // Apply casings
    const formatted = formatHashtagText(cleanWord, casingStyle);

    if (formatted && formatted !== '#') {
      const alreadyHave = hashtags.some(h => h.tag.toLowerCase() === formatted.toLowerCase());
      if (!alreadyHave) {
        setHashtags([...hashtags, {
          tag: formatted,
          category: 'custom'
        }]);
      }
      setCustomTagInput('');
    }
  };

  // Quick preset loader
  const loadDemoText = (index: number) => {
    const demos = [
      "I built a new workspace web application that lets people merge, compress, and edit PDF files online. Super easy and offline-first!",
      "Had a wonderful weekend at Cox's Bazar beach. The sunset was vibrant red and gold with waves crashing. Delicious sea fish dinner with friends!",
      "Just finished reading 'Atomic Habits' by James Clear. Highly recommend implementing daily tiny atomic actions to skyrocket productivity limits."
    ];
    setInputText(demos[index]);
  };

  const handleCopyAll = async () => {
    if (hashtags.length === 0) return;
    const block = hashtags.map(h => h.tag).join(' ');
    try {
      await navigator.clipboard.writeText(block);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (_) {}
  };

  const handleCopyLayout = async () => {
    if (hashtags.length === 0) return;
    const tagsBlock = hashtags.map(h => h.tag).join(' ');
    const layout = `${inputText}\n\n.\n.\n${tagsBlock}`;
    try {
      await navigator.clipboard.writeText(layout);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (_) {}
  };

  const handleDownloadAsTxt = () => {
    if (hashtags.length === 0) return;
    const textData = `PLATFORM: ${platform}\nGEN STYLE: ${casingStyle}\n\nHASHTAGS:\n${hashtags.map(h => h.tag).join(' ')}\n\nRAW INPUT:\n${inputText}`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hashtags_${platform.toLowerCase().replace(' ', '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setHashtags(hashtags.filter(h => h.tag !== tagToDelete));
  };

  const handleClearAll = () => {
    setInputText('');
    setHashtags([]);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30" id="text-hashtags-root">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Social Optimization Tools</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Hash className="w-10 h-10 text-cyan-400 stroke-[2.5]" />
              Text to Hashtag Converter
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Turn normal sentences, captions, and paragraphs into trending, high-converting social media hashtags automatically. Supports high-speed offline rule configurations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => loadDemoText(0)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-cyan-400 rounded-xl border border-white/5 transition-all"
            >
              Demo: Tech
            </button>
            <button
              onClick={() => loadDemoText(1)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-pink-400 rounded-xl border border-white/5 transition-all"
            >
              Demo: Travel
            </button>
          </div>
        </div>

        {/* Core Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Inputs & Rules Configure Panel */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Input Box */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Type className="h-4 w-4 text-cyan-400" />
                  Your Caption / Content Text
                </span>
                
                {inputText && (
                  <button 
                    onClick={handleClearAll}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors tooltip rounded-xl hover:bg-white/5"
                    title="Clear Input & Outputs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your copy, write your thoughts, or describe your sunset photograph here..."
                className="w-full h-40 bg-transparent border-0 resize-none font-sans text-sm leading-relaxed text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-0"
              />

              {/* Quick Case Format Selection */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Format Case:</span>
                  {(['CamelCase', 'lowercase', 'UPPERCASE', 'snake_case'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setCasingStyle(style)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all ${casingStyle === style ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-white/2 hover:bg-white/5 text-slate-400 border border-transparent'}`}
                    >
                      {style === 'CamelCase' && '#NewArrival'}
                      {style === 'lowercase' && '#newarrival'}
                      {style === 'UPPERCASE' && '#NEWARRIVAL'}
                      {style === 'snake_case' && '#new_arrival'}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Length: {inputText.length} chars
                </div>
              </div>
            </div>

            {/* Platform Selection Panels */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest pb-2 border-b border-white/5">
                <Sliders className="w-4 h-4 text-purple-400" />
                Select Platform Targets
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.keys(PLATFORM_LIMITS).map((pName) => {
                  const item = PLATFORM_LIMITS[pName];
                  const Icon = item.icon;
                  const isSelect = platform === pName;
                  return (
                    <button
                      key={pName}
                      type="button"
                      onClick={() => setPlatform(pName)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${isSelect ? 'bg-white/[0.03] border-cyan-500/40 shadow-lg' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}
                    >
                      <Icon className={`w-6 h-6 ${item.color}`} />
                      <div>
                        <span className="text-[10px] font-bold text-slate-200 block">{pName}</span>
                        <span className="text-[9px] font-black text-slate-500 font-mono uppercase">Max: {item.max}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Limits and optimization prompt box */}
              <div className="bg-cyan-500/5 rounded-2xl p-4 border border-cyan-500/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide">Platform Recommendation ({platform})</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Studies suggest using <strong className="text-cyan-405 font-black">{activeLimit.optimal} hashtags</strong> is optimal for {platform} algorithm rankings. Maximum limit permitted is {activeLimit.max} before getting flagged.
                  </p>
                </div>
              </div>
            </div>

            {/* Offline Text Parsing Engine Filters */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest pb-2 border-b border-white/5">
                <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
                Rule-Based Offline Extraction Filters
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Length slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 font-mono">
                    <span>Min Word Length</span>
                    <span className="text-cyan-400">{minWordLength} chars</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={minWordLength}
                    onChange={(e) => setMinWordLength(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[9px] text-slate-600 block leading-tight">Ignore shorter words inside original paragraph.</span>
                </div>

                {/* Filter Stop Words Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Filter Stop Words</span>
                    <span className="text-[8px] text-slate-600 block">Ignore particles 'the', 'is', 'for'</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterStopWords(!filterStopWords)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      filterStopWords ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        filterStopWords ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Strip numbers toggle */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Ignore Numbers</span>
                    <span className="text-[8px] text-slate-600 block">Remove standalone digit tags</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStripNumbers(!stripNumbers)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      stripNumbers ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        stripNumbers ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* Extra Custom Appended Prefix / Suffix Option */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5 font-mono">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Inject Extra Prefix</label>
                  <input
                    type="text"
                    value={tagPrefix}
                    onChange={(e) => setTagPrefix(e.target.value)}
                    placeholder="e.g. travel"
                    className="w-full text-xs bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Inject Extra Suffix</label>
                  <input
                    type="text"
                    value={tagSuffix}
                    onChange={(e) => setTagSuffix(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full text-xs bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Core Extraction Activation Area */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Trigger Offline Extraction Button */}
              <button
                onClick={handleExtractRuleBased}
                disabled={loading || !inputText.trim()}
                className="h-16 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-900 active:scale-95 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
              >
                <Scissors className="w-4 h-4 text-slate-900" />
                Convert to Hashtags (Offline Extract)
              </button>

            </div>

          </div>

          {/* RIGHT: Results playground panel */}
          <div className="space-y-8" id="hashtags-output-workspace">
            
            {/* Realtime compilation results and parameters */}
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 space-y-6 sticky top-8">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-600/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Active Tags</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Live social media block</p>
                  </div>
                </div>

                {/* Count badge */}
                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-400 font-mono">{hashtags.length}</span>
                  <span className="text-[10px] text-slate-600 font-mono block">/{activeLimit.max} limit</span>
                </div>
              </div>

              {/* Error messages if any */}
              {errorMsg && (
                <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Custom manual tag creation input form */}
              <form onSubmit={handleAddCustomTag} className="flex gap-2 font-mono">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder="Insert custom hashtag..."
                  className="flex-1 text-xs bg-white/[0.02] border border-white/5 rounded-2xl px-4 h-11 text-slate-200 focus:outline-none focus:border-cyan-400 placeholder-slate-700"
                />
                <button
                  type="submit"
                  className="px-4 bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/5 rounded-2xl flex items-center justify-center transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Dynamic tag listing grid */}
              {hashtags.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Categorized Pills Grid */}
                  <div className="flex flex-wrap gap-1.5 max-h-80 overflow-y-auto pr-1 pb-2">
                    {hashtags.map((ht, idx) => {
                      // Determine tag border/background accents based on category
                      let catColor = "border-slate-800 text-slate-400 bg-white/[0.01]";
                      if (ht.category === 'core' || ht.category === 'extracted') {
                        catColor = "border-cyan-500/20 text-cyan-400 bg-cyan-500/[0.03]";
                      } else if (ht.category === 'trending') {
                        catColor = "border-pink-500/20 text-pink-400 bg-pink-500/[0.03]";
                      } else if (ht.category === 'broad') {
                        catColor = "border-purple-500/20 text-purple-400 bg-purple-500/[0.03]";
                      } else if (ht.category === 'custom') {
                        catColor = "border-amber-500/20 text-amber-400 bg-amber-500/[0.03]";
                      }

                      return (
                        <div 
                          key={ht.tag + idx}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono group transition-all hover:border-slate-500 ${catColor}`}
                        >
                          <span className="select-all">{ht.tag}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteTag(ht.tag)}
                            className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Character check panel */}
                  {hashtags.length > activeLimit.optimal && (
                    <div className="text-[10px] text-yellow-500/80 bg-yellow-500/5 px-4 py-2.5 rounded-xl border border-yellow-500/10 flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Tag count ({hashtags.length}) exceeds the recommended optimal target ({activeLimit.optimal}) for maximum algorithm feed distribution.</span>
                    </div>
                  )}

                  {/* Output controls layout buttons */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    
                    {/* Copy All Hashtags */}
                    <button
                      onClick={handleCopyAll}
                      className="w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-black uppercase tracking-widest text-[#22d3ee] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                      {copiedAll ? (
                        <>
                          <CopyCheck className="w-4 h-4 text-emerald-400" />
                          Copied Tags Block!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Hashtags Block
                        </>
                      )}
                    </button>

                    {/* Copy Caption + Tags Layout */}
                    <button
                      onClick={handleCopyLayout}
                      className="w-full py-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-[#22d3ee]/20 text-xs font-black uppercase tracking-widest text-slate-300 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Copy Complete Post Layout
                    </button>

                    {/* Download TXT output */}
                    <button
                      onClick={handleDownloadAsTxt}
                      className="w-full py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download text manifest
                    </button>

                  </div>

                </div>
              ) : (
                <div className="h-60 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-slate-600">
                  <Flame className="w-10 h-10 mb-2 text-cyan-500/20 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Playground empty</span>
                  <p className="text-[10px] mt-1 text-slate-700 leading-relaxed max-w-[200px]">
                    Enter or draft your caption on the left panel, and click Extract or AI Smart Suggest tags to generate hashtags!
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
