import React, { useState } from 'react';
import { 
  Type, AlignLeft, RefreshCw, Copy, Check, Sparkles, Sliders, Shuffle, 
  Trash2, ArrowRight, HelpCircle, ListOrdered, ClipboardList, Scissors, FileText, Split, ArrowDownAZ
} from 'lucide-react';
import { motion } from 'framer-motion';

// Robust local dictionary for Random Word Generator
const SAMPLE_WORDS = {
  nouns: ['development', 'workspace', 'harmony', 'synergy', 'efficiency', 'creative', 'protocol', 'builder', 'design', 'pixel', 'container', 'structure', 'balance', 'craftsmanship', 'element'],
  verbs: ['compile', 'innovate', 'optimize', 'synthesize', 'explore', 'align', 'balance', 'render', 'decode', 'transform', 'scrub', 'format', 'minify', 'generate', 'construct'],
  adjectives: ['elegant', 'minimal', 'offline', 'robust', 'privacy', 'pristine', 'responsive', 'seamless', 'secure', 'granular', 'flexible', 'modular', 'efficient', 'custom', 'vibrant'],
  tech: ['algorithm', 'compiler', 'database', 'syntax', 'hexadecimal', 'binary', 'encryption', 'payload', 'buffer', 'vector', 'component', 'interface', 'variable', 'function', 'class']
};

export const LoremIpsumGenerator = () => {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const LOREM_SAMPLE = [
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

  const handleGenerate = () => {
    let output = "";
    if (type === 'words') {
      const words = LOREM_SAMPLE.join(" ").split(" ");
      output = words.slice(0, Math.min(count, words.length)).join(" ");
    } else if (type === 'sentences') {
      const sentences = LOREM_SAMPLE.join(" ").split(/[.!?]/).filter(s => s.trim());
      output = sentences.slice(0, Math.min(count, sentences.length)).join(". ") + ".";
    } else {
      const paragraphs = [];
      for (let i = 0; i < Math.min(count, 50); i++) {
        paragraphs.push(LOREM_SAMPLE.slice(0, 5).join(" "));
      }
      output = paragraphs.join("\n\n");
    }
    setResult(output);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Lorem Ipsum Dummy Generator</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">100% Offline Generator</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generate by</label>
          <select 
            value={type} 
            onChange={(e: any) => setType(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-sans outline-none text-slate-700 dark:text-slate-200"
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
            value={count} 
            min={1}
            max={500}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
      >
        <Sparkles size={14} />
        Generate Dummy Copy
      </button>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Generated Output</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
            >
              {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export const CaseConverter = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCase = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'pascal' | 'toggle') => {
    if (!inputText) return;
    let converted = "";
    if (mode === 'upper') {
      converted = inputText.toUpperCase();
    } else if (mode === 'lower') {
      converted = inputText.toLowerCase();
    } else if (mode === 'title') {
      converted = inputText.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
    } else if (mode === 'sentence') {
      converted = inputText.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    } else if (mode === 'camel') {
      converted = inputText
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(' ')
        .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    } else if (mode === 'snake') {
      converted = inputText.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    } else if (mode === 'pascal') {
      converted = inputText
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    } else if (mode === 'toggle') {
      converted = inputText.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    }
    setResult(converted);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded-xl">
          <Type size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Case Converter Tool</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Multi-case string parser</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Input Text</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { id: 'upper', label: 'UPPERCASE' },
          { id: 'lower', label: 'lowercase' },
          { id: 'title', label: 'Title Case' },
          { id: 'sentence', label: 'Sentence' },
          { id: 'camel', label: 'camelCase' },
          { id: 'pascal', label: 'PascalCase' },
          { id: 'snake', label: 'snake_case' },
          { id: 'toggle', label: 'tOgGlE cAsE' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => convertCase(btn.id as any)}
            className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Converted Text</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
            >
              {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export const RemoveLineBreaks = () => {
  const [inputText, setInputText] = useState('');
  const [replacement, setReplacement] = useState('space');
  const [customChar, setCustomChar] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanBreaks = () => {
    let joiner = " ";
    if (replacement === 'none') joiner = "";
    else if (replacement === 'comma') joiner = ", ";
    else if (replacement === 'custom') joiner = customChar;

    const cleaned = inputText.split(/\r?\n/).map(line => line.trim()).filter(line => line !== "").join(joiner);
    setResult(cleaned);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
          <Trash2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Remove Line Breaks</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Squeeze multi-line blocks into single line</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Input Text</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste paragraphs with multiple lines..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Replace line bounds with</label>
          <select 
            value={replacement} 
            onChange={(e) => setReplacement(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="none">No separator</option>
            <option value="custom">Custom Character</option>
          </select>
        </div>

        {replacement === 'custom' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Char</label>
            <input 
              type="text" 
              value={customChar} 
              onChange={(e) => setCustomChar(e.target.value)}
              placeholder="e.g. | or -"
              className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
        )}
      </div>

      <button
        onClick={cleanBreaks}
        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
      >
        <Sliders size={14} />
        Clean and Merge lines
      </button>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Result</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
            >
              {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export const RandomWordGenerator = () => {
  const [category, setCategory] = useState<'nouns' | 'verbs' | 'adjectives' | 'tech' | 'all'>('all');
  const [count, setCount] = useState<number>(10);
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateWords = () => {
    let pool: string[] = [];
    if (category === 'all') {
      pool = [...SAMPLE_WORDS.nouns, ...SAMPLE_WORDS.verbs, ...SAMPLE_WORDS.adjectives, ...SAMPLE_WORDS.tech];
    } else {
      pool = SAMPLE_WORDS[category];
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = Array(count).fill(0).map(() => shuffled[Math.floor(Math.random() * shuffled.length)]);
    setResult(selected);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-600 rounded-xl">
          <Shuffle size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Random Word Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Get custom local random vocabulary chips</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niche / Category</label>
          <select 
            value={category} 
            onChange={(e: any) => setCategory(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="all">Mixed Pool (All Categories)</option>
            <option value="nouns">Nouns</option>
            <option value="verbs">Verbs</option>
            <option value="adjectives">Adjectives</option>
            <option value="tech">Tech Terms</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Word Count</label>
          <input 
            type="number" 
            value={count} 
            min={1}
            max={50}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      <button
        onClick={generateWords}
        className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
      >
        <Sparkles size={14} />
        Assemble Random Word List
      </button>

      {result.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Words Generated</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result.join(', '));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
            >
              {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy List'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
            {result.map((word, i) => (
              <span key={i} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-300 rounded-xl text-xs font-black font-mono">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const TextRepeater = () => {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState<number>(5);
  const [separator, setSeparator] = useState('newline');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const repeat = () => {
    if (!inputText) return;
    let sep = "";
    if (separator === 'newline') sep = "\n";
    else if (separator === 'space') sep = " ";
    else if (separator === 'comma') sep = ", ";

    const repeated = Array(repeatCount).fill(inputText).join(sep);
    setResult(repeated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
          <ListOrdered size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Text Repeater</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Local offline high-speed loops</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base sentence</label>
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text to repeat..."
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repeat Times</label>
            <input 
              type="number" 
              value={repeatCount} 
              min={1}
              max={100}
              onChange={(e) => setRepeatCount(Math.max(1, Number(e.target.value)))}
              className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Separated by</label>
            <select 
              value={separator} 
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
            >
              <option value="newline">New Line (\n)</option>
              <option value="space">Space</option>
              <option value="comma">Comma and Space (, )</option>
            </select>
          </div>
        </div>

        <button
          onClick={repeat}
          disabled={!inputText}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Sparkles size={14} />
          Repeat text
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Repeated Outcome</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
              >
                {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 max-h-[250px] overflow-y-auto whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TextSorter = () => {
  const [inputText, setInputText] = useState('');
  const [direction, setDirection] = useState<'asc' | 'desc' | 'length' | 'reverse'>('asc');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const sortLines = () => {
    const lines = inputText.split(/\r?\n/).filter(l => l.trim() !== "");
    let sorted = [...lines];

    if (direction === 'asc') {
      sorted.sort((a, b) => a.localeCompare(b));
    } else if (direction === 'desc') {
      sorted.sort((a, b) => b.localeCompare(a));
    } else if (direction === 'length') {
      sorted.sort((a, b) => a.length - b.length);
    } else if (direction === 'reverse') {
      sorted.reverse();
    }

    setResult(sorted.join("\n"));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-100 dark:bg-sky-950/40 text-sky-600 rounded-xl">
          <ArrowDownAZ size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Line Sorter Tool</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Sort list items alphabetically or by length</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paste items (one per line)</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Item C&#10;Item A&#10;Item B"
            className="w-full h-28 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200 resize-none font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sorting Criteria</label>
          <select 
            value={direction} 
            onChange={(e: any) => setDirection(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="asc">A to Z (Alphabetical)</option>
            <option value="desc">Z to A (Reverse Alphabetical)</option>
            <option value="length">Line Length (Shortest first)</option>
            <option value="reverse">Invert order strictly</option>
          </select>
        </div>

        <button
          onClick={sortLines}
          disabled={!inputText}
          className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Sliders size={14} />
          Sort Lines
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sorted output</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
              >
                {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 whitespaces-pre-wrap whitespace-pre">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommaSeparator = () => {
  const [inputText, setInputText] = useState('');
  const [action, setAction] = useState<'tocsv' | 'tolist'>('tocsv');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const runConverter = () => {
    if (action === 'tocsv') {
      const items = inputText.split(/\r?\n/).map(i => i.trim()).filter(i => i !== "");
      setResult(items.join(", "));
    } else {
      const items = inputText.split(',').map(i => i.trim()).filter(i => i !== "");
      setResult(items.join("\n"));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-teal-100 dark:bg-teal-950/40 text-teal-600 rounded-xl">
          <Split size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Comma Separator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Switch lists between lines and CSV commas</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Input list / items</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Item 1&#10;Item 2&#10;Item 3"
            className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200 resize-none font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transform Mode</label>
          <select 
            value={action} 
            onChange={(e: any) => setAction(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="tocsv">Lines to CSV Comma Separated</option>
            <option value="tolist">CSV Comma Separated to Lines</option>
          </select>
        </div>

        <button
          onClick={runConverter}
          disabled={!inputText}
          className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Sliders size={14} />
          Map CSV Formatting
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Processed Text</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
              >
                {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WordToNumberConverter = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const wordToNum = () => {
    const raw = inputText.toLowerCase().replace(/ and /g, ' ').replace(/-/g, ' ').trim();
    if (!raw) return;

    const units: Record<string, number> = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
      'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
      'seventeen': 17, 'eighteen': 18, 'nineteen': 19
    };

    const tens: Record<string, number> = {
      'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
    };

    const scales: Record<string, number> = {
      'hundred': 100, 'thousand': 1000, 'million': 1000000, 'billion': 1000000000
    };

    const words = raw.split(/\s+/);
    let total = 0;
    let current = 0;

    for (let word of words) {
      if (units[word] !== undefined) {
        current += units[word];
      } else if (tens[word] !== undefined) {
        current += tens[word];
      } else if (scales[word] !== undefined) {
        const scale = scales[word];
        if (scale === 100) {
          current *= 100;
        } else {
          total += current * scale;
          current = 0;
        }
      } else {
        // Unknown word, skip or error
      }
    }
    total += current;
    setResult(total.toString());
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
          <RefreshCw size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Word to Number Converter</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Translate English text numbers back into integers</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spelled Out English Number</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. one hundred twenty-three million"
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200"
          />
        </div>

        <button
          onClick={wordToNum}
          disabled={!inputText.trim()}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Sliders size={14} />
          Convert back to Numeric Digits
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Numeric Result</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
              >
                {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xl font-mono font-black text-indigo-650 text-indigo-600 dark:text-indigo-400">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TextToTagsConverter = () => {
  const [inputText, setInputText] = useState('');
  const [separator, setSeparator] = useState('comma');
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const convertToTags = () => {
    let rawTags: string[] = [];
    if (separator === 'comma') {
      rawTags = inputText.split(',').map(t => t.trim()).filter(t => t !== "");
    } else {
      rawTags = inputText.split(/\s+/).map(t => t.trim()).filter(t => t !== "");
    }
    setTags(rawTags);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-violet-100 dark:bg-violet-950/40 text-violet-600 rounded-xl">
          <ClipboardList size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Text to Tags Converter</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Assemble keyword list into interactive tag chips</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Input text block</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="tech, code, system, workspace"
            className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200 resize-none font-sans"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify separators by</label>
          <select 
            value={separator} 
            onChange={(e: any) => setSeparator(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="comma">Delimiter Commas (,)</option>
            <option value="space">Delimiter Spaces</option>
          </select>
        </div>

        <button
          onClick={convertToTags}
          disabled={!inputText}
          className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Sliders size={14} />
          Compile Tags
        </button>

        {tags.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interactive Tag Chips ({tags.length})</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(tags));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
                  >
                    {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                    {copied ? 'Copied' : 'Copy JSON Array'}
                  </button>
               </div>
               <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-[rgba(167,139,250,1)] text-xs font-bold rounded-xl border border-violet-100 dark:border-violet-950 flex items-center gap-1.5">
                       <span>#{tag}</span>
                       <button onClick={() => setTags(tags.filter((_, idx2) => idx2 !== idx))} className="hover:text-red-500 transition-colors uppercase font-black cursor-pointer text-[10px]">×</button>
                    </span>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const NumberToWordConverter = () => {
  const [num, setNum] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const convertNumberToWords = () => {
    const rawNum = parseInt(num);
    if (isNaN(rawNum)) return;
    if (rawNum === 0) {
      setResult('zero');
      return;
    }

    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion'];

    const helper = (n: number): string => {
      if (n < 20) return units[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
      return units[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + helper(n % 100) : '');
    };

    let words = '';
    let tempNum = rawNum;
    let i = 0;

    while (tempNum > 0) {
      if (tempNum % 1000 !== 0) {
        words = helper(tempNum % 1000) + (thousands[i] !== '' ? ' ' + thousands[i] + ' ' : '') + words;
      }
      tempNum = Math.floor(tempNum / 1000);
      i++;
    }

    setResult(words.trim());
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
          <Type size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Number to Word Converter</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Format numbers to English spelled words</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numeric input value</label>
          <input
            type="number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="e.g. 123456"
            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-slate-850 rounded-2xl outline-none text-xs font-bold text-slate-700 dark:text-slate-200"
          />
        </div>

        <button
          onClick={convertNumberToWords}
          disabled={!num}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Sliders size={14} />
          Convert to Words
        </button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Word notation outcome</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all text-slate-500 dark:text-slate-300"
              >
                {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono text-slate-700 dark:text-slate-200 uppercase">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
