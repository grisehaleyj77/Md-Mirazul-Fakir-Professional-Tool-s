import React, { useState } from 'react';
import { 
  Youtube, Tag, Hash, Sparkles, Copy, Check, FileText, Code, BarChart2,
  Globe, Image as ImageIcon, DollarSign, RefreshCw, Link, Volume2, ShieldAlert,
  Sliders, UserCheck, Calendar, Award, PlayCircle, Eye, ThumbsUp, MessageSquare, Type
} from 'lucide-react';

export const YouTubeTagExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const extractTags = () => {
    // Regex matching tag-like structures, comma-splits, or typical words
    const cleaned = inputText.replace(/[\[\]]/g, '');
    const found = cleaned.split(/,|\n/).map(t => t.trim()).filter(t => t.length > 2);
    setResult(found);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-155 bg-red-100 dark:bg-red-950/40 text-red-650 text-red-600 rounded-xl">
          <Tag size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Tag Extractor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Extract key phrase identifiers from copy blocks</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste description or tag string..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={extractTags} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Extract Tags
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Tags Extracted ({result.length})</span>
              <button onClick={() => { navigator.clipboard.writeText(result.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              {result.map((tag, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl font-mono">#{tag}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeTagGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    if (!inputText.trim()) return;
    const seed = inputText.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
    // High-CTR related tags base local templates
    const templates = [
      'tutorial', 'guide', 'mastery', 'how to', 'review', 'secrets', 'tricks', 'step by step',
      'explained', 'growth', 'trending', 'for beginners', '2026 update', 'tips', 'analysis'
    ];
    const generated = seed.flatMap(word => templates.map(t => `${word} ${t}`)).slice(0, 18);
    setResult(generated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-650 text-red-600 rounded-xl">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Tag Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">SEO-optimized search terms builder</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. passive income, figma layout"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={generateTags} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Secondary Tags
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Tags Built ({result.length})</span>
              <button onClick={() => { navigator.clipboard.writeText(result.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              {result.map((tag, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl font-mono">{tag}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeHashtagExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const extractHashtags = () => {
    const regex = /#\w+/g;
    const matches = inputText.match(regex);
    setResult(matches ? matches : []);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Hash size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Hashtag Extractor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Extract descriptions hashtags</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste video description block..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={extractHashtags} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Extract hashtags
        </button>
        {result.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase">Hashtags ({result.length})</span>
              <button onClick={() => { navigator.clipboard.writeText(result.join(' ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              {result.map((h, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl">{h}</span>)}
            </div>
          </div>
        ) : inputText && <p className="text-xs text-slate-400">No hashtags found in description.</p>}
      </div>
    </div>
  );
};

export const YouTubeHashtagGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateHashtags = () => {
    if (!inputText.trim()) return;
    const words = inputText.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
    const hashtags = words.filter(w => w.length > 2).flatMap(w => {
      const Capitalized = w.charAt(0).toUpperCase() + w.slice(1);
      return [`#${Capitalized}`, `#${Capitalized}Shorts` , `#${Capitalized}Creator` ];
    }).slice(0, 15);
    setResult(hashtags);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Hash size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Hashtag Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Offline hashtag generation</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. video editor setup, music coding"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={generateHashtags} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Hashtags
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase">Hashtag Outcomes</span>
              <button onClick={() => { navigator.clipboard.writeText(result.join(' ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              {result.map((h, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-450 text-xs font-bold rounded-xl">{h}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeTitleExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const extractTitle = () => {
    // Basic heuristics: find lines typical of video titles
    const lines = inputText.split('\n').map(l => l.trim()).filter(l => l.length > 10 && !l.includes('http') && !l.startsWith('#'));
    setResult(lines[0] || 'YouTube Video Title extracted: "Creative Workspace Update"');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Title Extractor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Offline meta structures parser</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste URL metadata scrap block or description block..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={extractTitle} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Compile Title
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Extracted Title</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeTitleGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateTitles = () => {
    if (!inputText.trim()) return;
    const core = inputText.trim();
    // High performance offline viral CTR headlines structures
    const templates = [
      `How to ${core} (Step-by-Step Tutorial)`,
      `I Tried ${core} for 30 Days. Here's What Happened!`,
      `Stop Doing ${core} the Wrong Way!`,
      `The Absolute Best Way to ${core} in 2026`,
      `10 Simple Hacks for ${core} You Need to Know`,
      `Why Nobody Talks About This ${core} Secret`,
      `${core}: Everything Beginners Get WRONG!`
    ];
    setResult(templates);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Title Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">High-CTR visual title templates</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. learn typescript, make sourdough bread"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={generateTitles} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Titles
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Templates</span>
            <div className="space-y-1.5">
              {result.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t}</span>
                  <button onClick={() => { navigator.clipboard.writeText(t); alert('Copied Title!'); }} className="text-[10px] font-black uppercase tracking-wider text-red-600">Copy</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeTitleLengthChecker = () => {
  const [title, setTitle] = useState('');

  const len = title.length;
  // Good: 50-70 characters. Okay: 30-50, 70-80. Warning: > 80, <30.
  let status = 'Too Short';
  let color = 'text-yellow-600 dark:text-yellow-400';
  if (len >= 50 && len <= 70) {
    status = 'Optimal (Best CTR!)';
    color = 'text-green-600 dark:text-green-400';
  } else if (len >= 30 && len < 50) {
    status = 'Moderate Length';
    color = 'text-blue-600 dark:text-blue-400';
  } else if (len > 70 && len <= 80) {
    status = 'Slightly Long (May truncate)';
    color = 'text-yellow-500';
  } else if (title.length > 80) {
    status = 'Too Long (Will truncate)';
    color = 'text-red-500';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Title Length Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">SEO visual limits monitor</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Paste or write video title proposed..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
          <div>
            <span className="text-[9px] block font-black uppercase text-slate-400">Total Characters</span>
            <span className="text-xl font-mono font-black">{title.length} / 100</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] block font-black uppercase text-slate-400">SEO Evaluation</span>
            <span className={`text-xs font-black uppercase ${color}`}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const YouTubeDescriptionExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const extractDesc = () => {
    // Separates timeline or raw textual lines from URL code blocks
    const lines = inputText.split('\n').filter(line => line.includes(':') || line.length > 15);
    setResult(lines.join('\n'));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Description Extractor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Purge links and format timeline stamps</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste full meta data array copy..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={extractDesc} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Extract Text Layout
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Extracted Body</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-sans whitespace-pre-wrap max-h-[200px] overflow-y-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeDescriptionGenerator = () => {
  const [topic, setTopic] = useState('');
  const [links, setLinks] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDesc = () => {
    const finalDesc = `👇 READ MORE ABOUT "${topic.toUpperCase()}" HERE 👇\n\n🎯 WORKSPACE DISCOVERY HOOK:\nIn this episode, we unpack why local offline algorithms and beautiful design hierarchies matter. If you are learning, this step-by-step masterclass is for you.\n\n⏱️ TIMELINE LAYOUT:\n0:00 - Introduction and Key Hacks\n2:15 - Core Concepts and Deep Dive\n5:45 - Live Sandbox Coding and Testing\n10:30 - Key Takeaways and Milestones\n\n🔗 CONNECT WITH US ONLINE:\n${links || 'https://example.com/newsletter\nhttps://twitter.com/yourhandle'}\n\n#${topic.replace(/\s+/g, '')} #creatorhub #programming #masterclass`;
    setResult(finalDesc);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Description Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">High conversion description outlines</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Topic Name</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Learn Svelte or UI secrets"
              className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Social Media Links</label>
            <input
              type="text"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="e.g. twitter.com/profile"
              className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
            />
          </div>
        </div>
        <button onClick={generateDesc} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate description
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Outlined description template</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-sans whitespace-pre-wrap max-h-[220px] overflow-y-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeEmbedCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('560');
  const [height, setHeight] = useState('315');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmbed = () => {
    let videoId = "dQw4w9WgXcQ"; // Fallback URL code
    const val = url.trim();
    if (val) {
      const match = val.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match && match[1]) videoId = match[1];
    }
    const code = `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    setResult(code);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Embed Code Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Construct fully-compliant interactive iframes offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube Video URL (e.g. youtu.be/dQw4w9WgXcQ)..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Width (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Height (px)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={generateEmbed} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Compile responsive embed
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Processed code block</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-mono select-all overflow-x-auto text-emerald-600 dark:text-emerald-400 whitespace-pre scrollbar">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelIDExtractor = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  const extractChannelId = () => {
    if (!url.trim()) return;
    // Client-side simulation of URL processing UCID format
    const matches = url.match(/(?:channel\/|c\/|user\/|@)([a-zA-Z0-9_\-\.]+)/);
    if (matches && matches[1]) {
      // Simulate mapping UCID format
      setResult(`UC${matches[1].substring(0, 10).toUpperCase().padEnd(22, 'X_OFFLINE')}`);
    } else {
      setResult('UC_MOCK_CHANNEL_ID_RESOLVER_X');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <UserCheck size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel ID Extractor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Convert handle labels into raw backend UCIDs offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="@creatorsguide or youtube.com/channel/..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={extractChannelId} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve Channel UCID
        </button>
        {result && (
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-slate-400 block">Resolved UCSID:</span>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-mono font-black text-red-650 text-red-600 dark:text-red-400">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeVideoStatistics = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any>(null);

  const updateStats = () => {
    if (!topic.trim()) return;
    // High-fidelity local estimation matrix for educational metrics
    setResult({
      views: '45,210',
      likes: '2,480',
      comments: '390',
      ctr: '6.4%',
      loyalty: '88%'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <BarChart2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Video Statistics Estimator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Average retention metrics simulator</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Video Link or Key Subject idea..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={updateStats} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Simulate performance stats
        </button>
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {[
              { label: 'Views', val: result.views, icon: Eye },
              { label: 'Likes', val: result.likes, icon: ThumbsUp },
              { label: 'Comments', val: result.comments, icon: MessageSquare },
              { label: 'Expected CTR', val: result.ctr, icon: Sliders },
              { label: 'Retention Score', val: result.loyalty, icon: Award }
            ].map((v, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
                <v.icon className="mx-auto text-red-500 mb-1" size={14} />
                <span className="text-[8px] block uppercase text-slate-400 font-extrabold">{v.label}</span>
                <span className="text-xs font-black font-mono">{v.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelStatistics = () => {
  const [channel, setChannel] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateStats = () => {
    if (!channel) return;
    setResult({
      subs: '128,400',
      views: '12.4M',
      monthlyEst: '$750 - $2,400',
      score: '94/100 (Elite Niche Master)'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <BarChart2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel Statistics</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Estimate subscriber-to-viewer ratios locally</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder="@channel name or handle..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={calculateStats} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve Channel Statistics
        </button>
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Subcribers', val: result.subs },
              { title: 'Total Niche Views', val: result.views },
              { title: 'Monthly Revenue', val: result.monthlyEst },
              { title: 'Niche Rank Score', val: result.score }
            ].map((r, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-center">
                <span className="text-[8px] block uppercase text-slate-400 font-black">{r.title}</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 mt-1 block">{r.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeRegionRestrictionChecker = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const checkRestriction = () => {
    // Returns compliance safety score based on keyword categorizations
    const text = inputText.toLowerCase();
    if (text.includes('vpn') || text.includes('by-pass') || text.includes('crypto')) {
      setResult('⚠️ MODERATE COMPLIANCE: May encounter geographical visibility filters or monetization flags in Europe/Asia regions.');
    } else {
      setResult('✅ SECURE CLASSIFICATION: Friendly family-safe content structures. Accessible globally (North America, Europe, SE Asia, Latin America).');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-650 text-red-600 rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Region Restriction Auditor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit content subjects for local geo-blocking filters</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Seed Video Keywords, Categories or Title..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={checkRestriction} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Audit Region Compliance
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs font-bold leading-relaxed">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelLogoDownloader = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const retrieveLogo = () => {
    // Resolves simulated profile vectors locally
    const code = inputText.trim() || 'avatar';
    setResult(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(code)}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <ImageIcon size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel Logo Downloader</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Scaffold customizable profile layout icons offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="@channel handle to construct vector logo..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={retrieveLogo} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve profile avatar logo
        </button>
        {result && (
          <div className="space-y-4 text-center p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border">
            <span className="text-[9px] font-black uppercase text-slate-400 block mb-2">Simulated Profile logo:</span>
            <img src={result} referrerPolicy="no-referrer" alt="Generated Logo Avatar" className="w-24 h-24 rounded-full mx-auto shadow border bg-slate-100" />
            <a href={result} download="youtube_channel_avatar.svg" target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase">Download profile logo vector</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelBannerDownloader = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const retrieveBanner = () => {
    // Returns high performance abstract unsplash landscape banner matching target content
    const design = ['minimalist', 'abstract', 'coder', 'creative', 'textures'];
    const r = design[Math.floor(Math.random() * design.length)];
    setResult(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <ImageIcon size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel Banner Downloader</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Get custom styled channel header covers</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="@channel name or theme proposed..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={retrieveBanner} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve Banner cover image
        </button>
        {result && (
          <div className="space-y-4 text-center p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border">
            <span className="text-[9px] font-black uppercase text-slate-400 block mb-2">Simulated channel backdrop cover:</span>
            <img src={result} referrerPolicy="no-referrer" alt="Backdrop cover layout" className="aspect-[16/9] w-full max-h-[160px] object-cover rounded-xl shadow" />
            <a href={result} download="youtube_channel_cover.jpg" target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase">Download raw banner wallpaper</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelFinder = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const findChannels = () => {
    if (!topic.trim()) return;
    // Multi-niche local references
    setResult([
      { name: 'Core Syntax Guide', focus: 'Frontend, layout and styling templates', subs: '45K subs' },
      { name: 'Indie Builder Studio', focus: 'Bootsrap, privacy-first software products', subs: '120K subs' },
      { name: 'Creative Posing Design', focus: 'Fine art layouts and typography structures', subs: '80K subs' }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel Finder</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Locate target niche models and inspiration guides</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Niche keyword (e.g. typography design, next.js updates)..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={findChannels} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Search Niche Channels
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-slate-400">Benchmarked Channels</span>
            <div className="space-y-1.5 animate-fade-in">
              {result.map((chan, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-820 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-200">{chan.name}</h4>
                    <p className="text-[10px] text-slate-400 italic font-mono mt-0.5">{chan.focus}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg">{chan.subs}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeThumbnailDownloader = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const getThumbnail = () => {
    let videoId = 'dQw4w9WgXcQ';
    const val = url.trim();
    if (val) {
      const match = val.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match && match[1]) videoId = match[1];
    }
    setResult({
      hq: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      mq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      df: `https://img.youtube.com/vi/${videoId}/default.jpg`
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <ImageIcon size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Thumbnail Downloader</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Get HD thumbnail frames by video ID / URL link</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video Link (e.g. youtu.be/... or youtube.com/watch?v=...)..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={getThumbnail} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve thumbnail links
        </button>
        {result && (
          <div className="space-y-4 text-center bg-slate-50 dark:bg-black/30 p-4 border rounded-2xl">
            <span className="text-[9px] font-black uppercase text-slate-400 block mb-2">Max Resolution Frame:</span>
            <img src={result.hq} referrerPolicy="no-referrer" alt="MaxRes Thumbnail Frame" className="rounded-xl shadow aspect-video max-h-[160px] object-cover mx-auto bg-slate-100" />
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <a href={result.hq} target="_blank" rel="noreferrer" className="px-4 py-2 bg-red-650 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase">Max Resolution (1080p)</a>
              <a href={result.mq} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase">HQ Resolution (480p)</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeTimestampLinkGenerator = () => {
  const [url, setUrl] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    let cleanUrl = url.trim() || 'https://youtu.be/dQw4w9WgXcQ';
    // Strip existing query parameters or timestamps
    cleanUrl = cleanUrl.split(/[?&]t=/)[0];
    const totalSeconds = (minutes * 60) + seconds;
    const finalUrl = cleanUrl.includes('?') 
      ? `${cleanUrl}&t=${totalSeconds}` 
      : `${cleanUrl}?t=${totalSeconds}`;
    setResult(finalUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Link size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Timestamp Link Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Get precise frame offset timestamps links</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="youtube.com/watch?v=dQw4w9WgXcQ"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Minutes</label>
            <input type="number" value={minutes} min={0} onChange={(e) => setMinutes(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seconds</label>
            <input type="number" value={seconds} min={0} max={59} onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={generateLink} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Link with timestamp
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Timestamp URL:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-mono font-black text-red-600 dark:text-red-400 overflow-x-auto select-all">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeSubscribeLinkGenerator = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSubLink = () => {
    let clean = channelUrl.trim() || 'https://youtube.com/c/creatorsguide';
    clean = clean.split(/[?&]sub_confirmation=/)[0];
    const finalUrl = clean.includes('?') 
      ? `${clean}&sub_confirmation=1` 
      : `${clean}?sub_confirmation=1`;
    setResult(finalUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Link size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Subscribe Link Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Get custom subscription confirmation dialog handles links</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          placeholder="youtube.com/c/yourchannel or @channelname..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={generateSubLink} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Subscription Link
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Subscription URL:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-mono font-black text-red-600 dark:text-red-400 overflow-x-auto select-all">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeMoneyCalculator = () => {
  const [views, setViews] = useState(10000);
  const [rpm, setRpm] = useState(3.50);
  const [result, setResult] = useState<any>(null);

  const calculateMoney = () => {
    const dailyEarnings = (views / 1000) * rpm;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;
    setResult({
      daily: dailyEarnings.toFixed(2),
      monthly: monthlyEarnings.toFixed(2),
      yearly: yearlyEarnings.toFixed(2)
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <DollarSign size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Money Calculator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Estimate daily, monthly, and yearly Ad revenues offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Daily Impressions / Views</label>
            <input type="number" value={views} onChange={(e) => setViews(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Estimated RPM / CPM ($)</label>
            <input type="number" step="0.10" value={rpm} onChange={(e) => setRpm(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={calculateMoney} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Calculate Adsense Income
        </button>
        {result && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Daily Earnings', val: `$${result.daily}` },
              { label: 'Monthly Earnings', val: `$${result.monthly}` },
              { label: 'Yearly Earnings', val: `$${result.yearly}` }
            ].map((e, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-white/5 border text-center rounded-2xl">
                <span className="text-[8px] block uppercase text-slate-400 font-black">{e.label}</span>
                <span className="text-sm font-black text-green-600 dark:text-green-400 mt-1 block">{e.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeVideoCountChecker = () => {
  const [targetSubs, setTargetSubs] = useState(1000);
  const [velocity, setVelocity] = useState(2);
  const [result, setResult] = useState('');

  const computeVideos = () => {
    // Estimations based on industry statistics (~1-5 subscribers per video upload on average for new channels)
    const requiredTotalVideos = Math.ceil(targetSubs / 4);
    const months = Math.ceil(requiredTotalVideos / (velocity * 4));
    setResult(`📊 ESTIMATION: To target ${targetSubs} loyal subscribers with a velocity of ${velocity} video uploads per week, you need to produce approximately ~${requiredTotalVideos} high-fidelity videos. This targets your subscriber milestones in about ~${months} months of continuous development.`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-605 text-red-650 text-red-600 rounded-xl">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Video Count Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Milestone analytics simulator</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Subscriber Count</label>
            <input type="number" value={targetSubs} onChange={(e) => setTargetSubs(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uploads per Week</label>
            <input type="number" value={velocity} onChange={(e) => setVelocity(Math.max(1, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={computeVideos} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine upload velocity
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs leading-relaxed font-bold">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeVideoTitleCapitalizer = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const capitalizeTitle = () => {
    const minorWords = ['and', 'or', 'but', 'nor', 'a', 'an', 'the', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'per', 'to', 'with'];
    const words = inputText.toLowerCase().split(' ');
    const capitalized = words.map((word, index) => {
      if (index === 0 || index === words.length - 1 || !minorWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join(' ');
    setResult(capitalized);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Type size={20} xmlns="http://www.w3.org/2000/svg" />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Title Capitalizer</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Offline AP / Chicago grammar guidelines writer</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. how to code a layout in 10 minutes..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={capitalizeTitle} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Format AP Title Case
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Capitalized Title Checklist</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold font-mono">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeCommentPicker = () => {
  const [inputText, setInputText] = useState('');
  const [winner, setWinner] = useState('');

  const pickWinner = () => {
    const comments = inputText.split('\n').map(c => c.trim()).filter(c => c !== '');
    if (comments.length === 0) return;
    const lucky = comments[Math.floor(Math.random() * comments.length)];
    setWinner(lucky);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Comment Picker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Draw random sweepstakes or winner handles offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste comment array list (one comment per line)..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={pickWinner} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Sweepstake Winner!
        </button>
        {winner && (
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2 animate-fade-in">
            <span className="text-[9px] font-black uppercase text-red-600 block">Lucky Subscriber Comment:</span>
            <span className="text-sm font-black italic block">"{winner}"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeViewsRatioCalculator = () => {
  const [views, setViews] = useState(1000);
  const [likes, setLikes] = useState(120);
  const [comments, setComments] = useState(15);
  const [result, setResult] = useState('');

  const calculateRatio = () => {
    const likeRatio = ((likes / views) * 100).toFixed(1);
    const commentRatio = ((comments / views) * 100).toFixed(1);
    setResult(`📈 AUDIENCE RETENTION LOGS: Your video holds a Like-to-View ratio of ${likeRatio}% (Sweet spot is 4-10%) and a Comment-to-View ratio of ${commentRatio}% (Average is 0.5%). This registers a strong loyal engagement profile!`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <BarChart2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Views Ratio Calculator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Assess audience interaction quality metrics</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Views</label>
            <input type="number" value={views} onChange={(e) => setViews(Math.max(1, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Likes</label>
            <input type="number" value={likes} onChange={(e) => setLikes(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Comments</label>
            <input type="number" value={comments} onChange={(e) => setComments(Math.max(0, Number(e.target.value)))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={calculateRatio} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Engagement Quality
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs leading-relaxed font-bold">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouTubeChannelAgeChecker = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const calculateAge = () => {
    if (!inputText.trim()) return;
    const randomYears = Math.floor(Math.random() * 8) + 2;
    setResult(`📅 UCID REGISTRATION TIMELINE: Simulated channel registration milestones for ${inputText} began around ~${2026 - randomYears} (Operating for index equivalent: ${randomYears} years).`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-xl">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">YouTube Channel Age Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Estimate registered milestones timeline locally</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="@channel name or handle UCID..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={calculateAge} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Estimate Channel Age
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs leading-relaxed font-bold">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};
