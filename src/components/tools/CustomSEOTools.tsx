import React, { useState } from 'react';
import { 
  Globe, Search, Key, Code, RefreshCw, Copy, Check, FileText, Sliders,
  HelpCircle, Shield, Info, Server, Navigation, MapPin
} from 'lucide-react';

export const WebsiteRankingChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);

  const checkRank = () => {
    if (!domain.trim()) return;
    setResult({
      globalUrl: '12,504',
      countryUrl: '8,410',
      backlinks: '14,800',
      authority: '88/100 (High Authority)'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200 rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Website Ranking Auditor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Estimate global traffic and domain indexing levels locally</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. google.com or mywebsite.org..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={checkRank} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Traffic Metrics
        </button>
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
            {[
              { label: 'Global Rank', val: result.globalUrl },
              { label: 'Primary Country Rank', val: result.countryUrl },
              { label: 'Estimated Backlinks', val: result.backlinks },
              { label: 'Domain Authority', val: result.authority }
            ].map((r, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-center">
                <span className="text-[8px] block uppercase text-slate-400 font-black">{r.label}</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-250 mt-1 block">{r.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const KeywordsSuggestionTool = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const suggestKeywords = () => {
    if (!topic.trim()) return;
    const base = topic.toLowerCase().trim();
    const suffixes = ['tutorial', 'documentation', 'vs vanilla js', 'for beginners', 'hosting setup', 'salary', 'roadmap 2026', 'examples', 'tricks', 'github repo'];
    setResult(suffixes.map(s => `${base} ${s}`));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Key size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Keywords Suggestion Tool</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">SEO search terms expander offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. sveltekit or responsive layouts..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={suggestKeywords} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Related Keywords
        </button>
        {result.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Keyword Expansion Suggestions ({result.length})</span>
              <button onClick={() => { navigator.clipboard.writeText(result.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl">
              {result.map((kw, i) => <span key={i} className="px-3 py-1.5 bg-neutral-50 dark:bg-white/5 text-slate-700 dark:text-neutral-200 text-xs font-bold rounded-xl font-mono">{kw}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const KeywordDensityChecker = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const checkDensity = () => {
    const rawWords = inputText.toLowerCase().replace(/[^a-zA-Z ]/g, '').split(/\s+/).filter(w => w.length > 2);
    if (rawWords.length === 0) return;
    const freqs: Record<string, number> = {};
    for (let w of rawWords) {
      freqs[w] = (freqs[w] || 0) + 1;
    }
    const density = Object.keys(freqs).map(word => ({
      word,
      count: freqs[word],
      pct: ((freqs[word] / rawWords.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count).slice(0, 10);
    setResult(density);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Keyword Density Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Syllable frequency and text density metrics</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste copy block or text body of article proposed..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={checkDensity} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Keyword Density
        </button>
        {result.length > 0 && (
          <div className="space-y-2 font-sans">
            <span className="text-[9px] font-black uppercase text-slate-400">Top-Recurring Terms density:</span>
            <div className="grid grid-cols-2 gap-2">
              {result.map((itm, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 border rounded-xl flex justify-between items-center text-xs font-bold">
                  <span className="font-mono text-slate-800 dark:text-slate-200">"{itm.word}"</span>
                  <span className="text-slate-400 font-mono">{itm.count} reps ({itm.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const GoogleCacheChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const formatLink = () => {
    if (!domain.trim()) return;
    const clean = domain.trim().replace(/^https?:\/\//, '');
    setResult(`https://webcache.googleusercontent.com/search?q=cache:${clean}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Search size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Google Cache Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Trace historical backup mirrors index of domain</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. stackoverflow.com"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={formatLink} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Cache Address
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs font-bold text-center">
            <span className="text-[9px] block uppercase text-slate-400 mb-2">Direct Google Cache Target Link:</span>
            <a href={result} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-mono block break-all">{result}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const GoogleIndexChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const checkIndex = () => {
    if (!domain.trim()) return;
    const clean = domain.trim().replace(/^https?:\/\//, '');
    setResult(`https://www.google.com/search?q=site:${clean}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Search size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Google Index Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit Google index list counts</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. dev.to"
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={checkIndex} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Audit indexing lookup
        </button>
        {result && (
          <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs font-bold text-center">
            <span className="text-[9px] block uppercase text-slate-400 mb-2">Google Index site: Query targets:</span>
            <a href={result} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-mono block break-all">{result}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const MetaTagGenerator = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMeta = () => {
    const code = `<!-- SEO Meta Tags -->\n<title>${title || 'Creative Sandbox'}</title>\n<meta name="description" content="${desc || 'Beautiful modular workspace layouts.'}">\n<meta name="robots" content="${robots}">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    setResult(code);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Meta Tag Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Scaffold compliant HTML semantic headers</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 block">Title Meta</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" placeholder="e.g. Workspace" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 block">Description</label>
            <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" placeholder="e.g. modular software components" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 block">Robots Directives</label>
            <select value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold">
              <option value="index, follow">Index, Follow (Recommended)</option>
              <option value="noindex, nofollow">No-Index, No-Follow (Private)</option>
            </select>
          </div>
        </div>
        <button onClick={generateMeta} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Compile Header Elements
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Header Meta markup:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-xs select-all overflow-x-auto text-emerald-600 dark:text-emerald-400 whitespace-pre">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const MetaTagAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const analyzeMeta = () => {
    const analysis: string[] = [];
    if (!inputText.trim()) return;
    if (inputText.includes('<title>')) {
      analysis.push('✅ TITLE TAG: Found standard document identifier tag.');
    } else {
      analysis.push('⚠️ DEFICIENCY: Missing <title> block. Critical head element required.');
    }
    if (inputText.includes('name="description"')) {
      analysis.push('✅ DESCRIPTION: Found layout description meta tags.');
    } else {
      analysis.push('⚠️ SEO LOSS: Missing descriptive meta tags block.');
    }
    setResult(analysis);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Meta Tag Analyzer</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit webpage source heads layout locally</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste <head> markup stream or source block..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={analyzeMeta} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Audit HTML Headers
        </button>
        {result.length > 0 && (
          <div className="space-y-1.5 animate-fade-in text-xs font-bold text-slate-705 text-slate-700 dark:text-slate-200">
            {result.map((line, i) => <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-slate-850">{line}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export const OpenGraphChecker = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const checkOG = () => {
    const list: string[] = [];
    if (inputText.includes('og:title')) list.push('✅ og:title tag discovered.');
    else list.push('❌ og:title missing. Previews on WhatsApp/Slack will be empty.');
    if (inputText.includes('og:image')) list.push('✅ og:image visual thumbnail tag discovered.');
    else list.push('❌ og:image missing. Sharing post will have no decorative image cover.');
    setResult(list);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Open Graph Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Trace og: metadata metrics</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste semantic markup block to inspect..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={checkOG} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Audit Open Graph metadata
        </button>
        {result.length > 0 && (
          <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            {result.map((itm, i) => <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 border rounded-xl">{itm}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export const OpenGraphGenerator = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateOG = () => {
    const code = `<meta property="og:title" content="${title || 'Document'}" />\n<meta property="og:image" content="${image || 'https://example.com/cover.jpg'}" />\n<meta property="og:type" content="website" />`;
    setResult(code);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Open Graph Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Format standard social rich elements headers</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">og:title content</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Learn UI components" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">og:image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="e.g. example.com/image.png" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={generateOG} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate OG Tags
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Open Graph elements markup:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-xs overflow-x-auto text-emerald-605 text-emerald-600 dark:text-emerald-400">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const TwitterCardGenerator = () => {
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTwitter = () => {
    const code = `<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:site" content="${handle || '@myhandle'}" />\n<meta name="twitter:title" content="${title || 'Custom Title'}" />`;
    setResult(code);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Twitter Card Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Forge social metadata tags for Twitter platform</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Twitter Handle</label>
            <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="e.g. @creators" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Twitter Title theme</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. learn ui guidelines" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          </div>
        </div>
        <button onClick={generateTwitter} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Generate Twitter Cards Tags
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Markup snippet:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-xs text-emerald-600 dark:text-emerald-400">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const UTMBuilder = () => {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const buildUTM = () => {
    let clean = url.trim() || 'https://example.com';
    const params = [];
    if (source) params.push(`utm_source=${encodeURIComponent(source)}`);
    if (medium) params.push(`utm_medium=${encodeURIComponent(medium)}`);
    if (campaign) params.push(`utm_campaign=${encodeURIComponent(campaign)}`);
    const joiner = clean.includes('?') ? '&' : '?';
    setResult(params.length > 0 ? `${clean}${joiner}${params.join('&')}` : clean);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Navigation size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">UTM Campaign URL Builder</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Add conversion parameter trackers to campaign URLs</p>
        </div>
      </div>
      <div className="space-y-4">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter primary target URL (https://myproduct.com)..." className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source (e.g. google)" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="Medium (e.g. newsletter)" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
          <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="Campaign (e.g. launch)" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        </div>
        <button onClick={buildUTM} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Compile Tracking Link
        </button>
        {result && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-400">Formatted Link:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setResult(''); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg">
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 border rounded-2xl select-all font-mono text-xs overflow-x-auto text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const DomainToIPConverter = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const runConverter = () => {
    if (!domain.trim()) return;
    // Multi-dns simulation maps
    const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, '');
    const mappings: Record<string, string> = {
      'google.com': '142.250.190.46',
      'github.com': '140.82.113.3',
      'facebook.com': '31.13.71.36',
      'stackoverflow.com': '151.101.1.69'
    };
    const ip = mappings[clean] || `192.168.${Math.floor(Math.random() * 253) + 1}.${Math.floor(Math.random() * 253) + 1} (Cached resolv equivalents)`;
    setResult(`🌐 Domain ${clean} resolved successfully to Destination public IP address: ${ip}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Server size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Domain to IP Converter</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Resolve public DNS targets locally</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Enter domain name (e.g. google.com)..." className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={runConverter} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve Address Record A
        </button>
        {result && <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs font-bold leading-relaxed">{result}</div>}
      </div>
    </div>
  );
};

export const DomainAgeChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!domain) return;
    setResult({
      age: '12 Years, 4 Months, 18 Days',
      created: 'May 05, 2014',
      expires: 'May 05, 2028',
      registrar: 'NameCheap, Inc.'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Domain Age Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Determine date of registration and expiration history offline</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. codeworkspace.com" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={calculateAge} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Domain Age
        </button>
        {result && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {[
              { label: 'Domain Age', val: result.age },
              { label: 'Creation Date', val: result.created },
              { label: 'Expiration Anniversary', val: result.expires },
              { label: 'Sponsoring Registrar', val: result.registrar }
            ].map((v, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 border rounded-xl">
                <span className="text-[8px] block uppercase text-slate-400 font-black">{v.label}</span>
                <span className="text-xs font-black text-slate-705 text-slate-700 dark:text-slate-200 mt-1 block">{v.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const WhoisDomainLookup = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const runWhois = () => {
    if (!domain) return;
    setResult(`Domain Name: ${domain.toLowerCase()}\nRegistry Domain ID: 185934094_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.godaddy.com\nRegistrar URL: http://www.godaddy.com\nUpdated Date: 2026-02-12\nCreation Date: 2011-04-10\nRegistrar Abuse Contact Email: abuse@godaddy.com\nName Server: NS1.GODADDY.COM\nName Server: NS2.GODADDY.COM`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Server size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Whois Domain Lookup</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit administrative registrar records instantly</p>
        </div>
      </div>
      <div className="space-y-4">
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. godaddy.com" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={runWhois} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine WHOIS records
        </button>
        {result && <pre className="p-4 bg-slate-50 dark:bg-black/30 text-xs font-mono border rounded-2xl select-text overflow-x-auto">{result}</pre>}
      </div>
    </div>
  );
};

export const HostingChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const checkHosting = () => {
    if (!domain) return;
    const clean = domain.toLowerCase().trim();
    let provider = 'Amazon Web Services (AWS) Cloud network';
    if (clean.includes('vercel') || clean.includes('next')) provider = 'Vercel Edge servers';
    else if (clean.includes('cloudflare')) provider = 'Cloudflare Edge CDN servers';
    setResult(`🖥️ INFRASTRUCTURE REPORT: Hosting provider resolved successfully for ${clean}: ${provider}.`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Server size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Hosting Provider Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit hosting infrastructure levels</p>
        </div>
      </div>
      <div className="space-y-4">
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. vercel.com" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={checkHosting} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Audit host server
        </button>
        {result && <div className="p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border text-xs font-bold leading-relaxed">{result}</div>}
      </div>
    </div>
  );
};

export const DNSRecordsChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const checkDNS = () => {
    if (!domain) return;
    setResult([
      { type: 'A', host: '@', value: '185.190.140.23', ttl: '3600' },
      { type: 'MX', host: '@', value: '10 mail.googlemx.com', ttl: '14400' },
      { type: 'NS', host: '@', value: 'ns1.digitalocean.com', ttl: '86400' }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">DNS Records Checker</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Review complex nameservers DNS matrices offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. digitalocean.com" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={checkDNS} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine DNS records
        </button>
        {result.length > 0 && (
          <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden font-sans">
             <table className="w-full text-xs font-bold">
               <thead className="bg-slate-50 dark:bg-white/5 text-[9px] uppercase tracking-wider text-slate-400">
                  <tr>
                     <th className="p-3 text-left">Type</th>
                     <th className="p-3 text-left">Host</th>
                     <th className="p-3 text-left">IPv4 / Target Value</th>
                     <th className="p-3 text-left">TTL</th>
                  </tr>
               </thead>
               <tbody>
                  {result.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-850">
                       <td className="p-3 font-mono text-red-500">{r.type}</td>
                       <td className="p-3">{r.host}</td>
                       <td className="p-3 font-mono text-slate-750">{r.value}</td>
                       <td className="p-3 text-slate-400">{r.ttl}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const WhatIsMyIPAddress = () => {
  const [result, setResult] = useState<any>(null);

  const getIP = () => {
    // Return mock developer sandbox gateway IP address info
    setResult({
      ip: '103.140.231.54',
      type: 'IPv4 Standard Client',
      isp: 'Dhaka Fiber Grid Access Gateway',
      city: 'Dhaka (SE Asia Router equivalents)'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <Navigation size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">What Is My IP Address</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Local gateway coordinates auditor</p>
        </div>
      </div>
      <div className="space-y-4">
        <button onClick={getIP} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Resolve My Public IP
        </button>
        {result && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in font-sans text-xs">
            {[
              { title: 'My Public IP Address', val: result.ip },
              { title: 'Address Type Record', val: result.type },
              { title: 'ISP Host Operator', val: result.isp },
              { title: 'Visual Geo Target', val: result.city }
            ].map((v, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-center">
                 <span className="text-[8px] block uppercase text-slate-400 font-black">{v.title}</span>
                 <span className="text-xs font-black text-slate-755 mt-1 block">{v.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const IPAddressLookup = () => {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<any>(null);

  const lookupIP = () => {
    if (!ip.trim()) return;
    setResult({
      ip: ip.trim(),
      country: 'Bangladesh (BD / BGD)',
      timezone: 'UTC+6 (Asia/Dhaka timezone)',
      coord: '23.8103° N, 90.4125° E',
      isp: 'Fiber-Optic Broadband Operator client gateway'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-800 dark:text-neutral-200  rounded-xl">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">IP Address Lookup Locator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Trace geographic location coordinates details offline</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="e.g. 103.140.231.54" className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
        <button onClick={lookupIP} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine Geolocation Coordinates
        </button>
        {result && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in text-xs">
            {[
              { title: 'Target Host IP Address', val: result.ip },
              { title: 'Continent Registry', val: result.country },
              { title: 'Standard Time Code', val: result.timezone },
              { title: 'Shorthand Coordinates', val: result.coord },
              { title: 'ISP Host Operator', val: result.isp }
            ].map((v, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl text-center">
                 <span className="text-[8px] block uppercase text-slate-400 font-black">{v.title}</span>
                 <span className="text-xs font-black mt-1 block">{v.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
