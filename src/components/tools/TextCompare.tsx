import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  FileText, 
  Split, 
  Columns, 
  Eye, 
  Upload, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';

interface DiffPart {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab ] = useState<'side' | 'unified'>('side');
  const [compareMode, setCompareMode] = useState<'lines' | 'words'>('lines');
  
  // Settings
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // File drag states
  const [drag1, setDrag1] = useState(false);
  const [drag2, setDrag2] = useState(false);

  // Results State
  const [diffResults, setDiffResults] = useState<{
    parts: DiffPart[];
    originalLinesWithDiff: { index: number; type: 'added' | 'removed' | 'unchanged' | 'empty'; text: string; mappedIndex?: number }[];
    modifiedLinesWithDiff: { index: number; type: 'added' | 'removed' | 'unchanged' | 'empty'; text: string; mappedIndex?: number }[];
    stats: {
      added: number;
      removed: number;
      unchanged: number;
      similarity: number;
    }
  }>({
    parts: [],
    originalLinesWithDiff: [],
    modifiedLinesWithDiff: [],
    stats: { added: 0, removed: 0, unchanged: 0, similarity: 100 }
  });

  // Load sample texts
  const loadSample = () => {
    setText1(`The quick brown fox jumps over the lazy dog.
It is an classic English pangram containing each letter of the alphabet.
This line will be completely removed in the next version.
Let us examine the differences clearly.`);
    
    setText2(`The super quick brown fox leaps over the lazy dog!
It is a classic English pangram containing each letter.
This line is a brand new addition in the second version.
Let us examine the differences clearly.`);
  };

  // Helper: File reader
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, target: 1 | 2) => {
    e.preventDefault();
    if (target === 1) setDrag1(false);
    else setDrag2(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        if (target === 1) setText1(content);
        else setText2(content);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        if (target === 1) setText1(content);
        else setText2(content);
      }
    };
    reader.readAsText(file);
  };

  // Basic LCS Diff implementation (Dynamic Programming)
  const computeDiff = () => {
    const s1 = text1;
    const s2 = text2;

    if (!s1 && !s2) {
      setDiffResults({
        parts: [],
        originalLinesWithDiff: [],
        modifiedLinesWithDiff: [],
        stats: { added: 0, removed: 0, unchanged: 0, similarity: 100 }
      });
      return;
    }

    // Split based on mode
    let keys1: string[] = [];
    let keys2: string[] = [];

    if (compareMode === 'lines') {
      keys1 = s1.split('\n');
      keys2 = s2.split('\n');
    } else {
      // Split by words but preserve whitespace/delimiters conceptually or group carefully
      keys1 = s1.split(/(\s+)/).filter(Boolean);
      keys2 = s2.split(/(\s+)/).filter(Boolean);
    }

    // Prepare matching tokens based on sensitivities
    const normalize = (tok: string) => {
      let res = tok;
      if (!caseSensitive) res = res.toLowerCase();
      if (ignoreWhitespace) res = res.trim();
      return res;
    };

    const n1 = keys1.length;
    const n2 = keys2.length;

    // DP Table for LCS
    const memo = Array.from({ length: n1 + 1 }, () => typeof Uint32Array !== 'undefined' ? new Uint32Array(n2 + 1) : Array(n2 + 1).fill(0));

    for (let i = 1; i <= n1; ++i) {
      for (let j = 1; j <= n2; ++j) {
        if (normalize(keys1[i - 1]) === normalize(keys2[j - 1])) {
          memo[i][j] = memo[i - 1][j - 1] + 1;
        } else {
          memo[i][j] = Math.max(memo[i - 1][j], memo[i][j - 1]);
        }
      }
    }

    // Backtrack to find aligned parts
    const parts: DiffPart[] = [];
    let i = n1;
    let j = n2;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(keys1[i - 1]) === normalize(keys2[j - 1])) {
        parts.unshift({ type: 'unchanged', value: keys1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || memo[i][j - 1] >= memo[i - 1][j])) {
        parts.unshift({ type: 'added', value: keys2[j - 1] });
        j--;
      } else {
        parts.unshift({ type: 'removed', value: keys1[i - 1] });
        i--;
      }
    }

    // Gather aligned panels for Side-by-Side lines
    const originalLinesWithDiff: { index: number; type: 'added' | 'removed' | 'unchanged' | 'empty'; text: string; mappedIndex?: number }[] = [];
    const modifiedLinesWithDiff: { index: number; type: 'added' | 'removed' | 'unchanged' | 'empty'; text: string; mappedIndex?: number }[] = [];

    let origIdx = 1;
    let modIdx = 1;

    // For better side-by-side visualization, we align deletions and insertions where they occur
    let partIdx = 0;
    while (partIdx < parts.length) {
      const current = parts[partIdx];

      if (current.type === 'unchanged') {
        originalLinesWithDiff.push({ index: origIdx++, type: 'unchanged', text: current.value });
        modifiedLinesWithDiff.push({ index: modIdx++, type: 'unchanged', text: current.value });
        partIdx++;
      } else if (current.type === 'removed') {
        // Look ahead for matching 'added' to represent side-by-side next to each other
        originalLinesWithDiff.push({ index: origIdx++, type: 'removed', text: current.value });
        
        // Check if there is a corresponding 'added' right next or nearby to render parallel
        let foundPair = false;
        let lookAhead = partIdx + 1;
        while (lookAhead < parts.length && parts[lookAhead].type === 'removed') {
          lookAhead++;
        }
        if (lookAhead < parts.length && parts[lookAhead].type === 'added') {
          // Align them side by side
          const addedPart = parts[lookAhead];
          modifiedLinesWithDiff.push({ index: modIdx++, type: 'added', text: addedPart.value });
          // remove the lookAhead part from parts list so we don't duplicate
          parts.splice(lookAhead, 1);
          foundPair = true;
        } else {
          // If no parallel added, keep modified slot empty/padded
          modifiedLinesWithDiff.push({ index: 0, type: 'empty', text: '' });
        }
        partIdx++;
      } else if (current.type === 'added') {
        // Lone added block
        originalLinesWithDiff.push({ index: 0, type: 'empty', text: '' });
        modifiedLinesWithDiff.push({ index: modIdx++, type: 'added', text: current.value });
        partIdx++;
      }
    }

    // Stats calculations
    let totalAdded = 0;
    let totalRemoved = 0;
    let totalUnchanged = 0;

    parts.forEach(p => {
      if (p.type === 'added') totalAdded++;
      else if (p.type === 'removed') totalRemoved++;
      else if (p.type === 'unchanged') totalUnchanged++;
    });

    const totalOperations = totalAdded + totalRemoved + totalUnchanged;
    const similarity = totalOperations > 0 
      ? Math.round((totalUnchanged / totalOperations) * 100) 
      : 100;

    setDiffResults({
      parts,
      originalLinesWithDiff,
      modifiedLinesWithDiff,
      stats: {
        added: totalAdded,
        removed: totalRemoved,
        unchanged: totalUnchanged,
        similarity
      }
    });
  };

  useEffect(() => {
    computeDiff();
  }, [text1, text2, compareMode, caseSensitive, ignoreWhitespace]);

  // Handle copying complete difference details
  const handleCopyReport = async () => {
    if (diffResults.parts.length === 0) return;
    
    let report = `TEXT COMPARE REPORT:\nSimilarity: ${diffResults.stats.similarity}%\nAdded changes: ${diffResults.stats.added}\nDeleted changes: ${diffResults.stats.removed}\n\n`;
    
    diffResults.parts.forEach(p => {
      if (p.type === 'added') report += `[+] ${p.value}\n`;
      else if (p.type === 'removed') report += `[-] ${p.value}\n`;
      else report += `[ ] ${p.value}\n`;
    });

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handleClear = () => {
    setText1('');
    setText2('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-rose-500/30" id="text-compare-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5 animate-fade-in">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 block">Diff Solutions</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Split className="w-10 h-10 text-rose-500 stroke-[2.5]" id="text-compare-icon" />
              Interactive Text Compare
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Find, highlight and evaluate changes between two text versions instantly. Drag and drop text files, adjust algorithm sensitivities, and review color-coded additions or omissions in side-by-side or unified modes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={loadSample}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-rose-400 rounded-2xl border border-rose-500/20 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-rose-400" />
              Load Comparison Demo
            </button>
            {(text1 || text2) && (
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-xs font-black uppercase tracking-widest text-red-400 rounded-2xl border border-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Comparison Parameters Slider Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0a0a0a] rounded-3xl p-6 border border-white/5 text-xs font-mono">
          
          {/* Compare Type Trigger */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-500" /> Comparison Depth
            </span>
            <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setCompareMode('lines')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${compareMode === 'lines' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Line by Line
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('words')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${compareMode === 'words' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Word by Word
              </button>
            </div>
          </div>

          {/* Tab View Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Visual Layout
            </span>
            <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab('side')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'side' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Side by Side
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unified')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'unified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Unified Inline
              </button>
            </div>
          </div>

          {/* Toggle Rule: Case Sensitivity */}
          <div className="flex items-center justify-between p-3.5 bg-[#050505] rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Case Sensitive</span>
              <span className="text-[8px] text-slate-600 block">Differ Capital letters</span>
            </div>
            <button
              type="button"
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                caseSensitive ? 'bg-rose-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  caseSensitive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle Rule: Ignore trailing spacings */}
          <div className="flex items-center justify-between p-3.5 bg-[#050505] rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Trim Spaces</span>
              <span className="text-[8px] text-slate-600 block">Ignore empty ends</span>
            </div>
            <button
              type="button"
              onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                ignoreWhitespace ? 'bg-rose-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  ignoreWhitespace ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Inputs Double Panel Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Panel 1: Original Version */}
          <div 
            className={`bg-[#0a0a0a] rounded-[32px] border p-6 md:p-8 space-y-4 transition-all ${drag1 ? 'border-rose-500 bg-rose-500/[0.02]' : 'border-white/5'}`}
            onDragOver={(e) => { e.preventDefault(); setDrag1(true); }}
            onDragLeave={() => setDrag1(false)}
            onDrop={(e) => handleFileDrop(e, 1)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                Original Version (Text A)
              </span>

              {/* Upload Input File */}
              <label className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Import File</span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.html,.css,.js,.ts"
                  onChange={(e) => handleFileChange(e, 1)}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original master document configuration or source code line here..."
              className="w-full h-48 bg-transparent border-0 resize-none font-mono text-xs leading-relaxed text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-0"
            />

            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              <span>Lines: {text1.split('\n').filter(Boolean).length}</span>
              <span>Words: {text1.trim() ? text1.trim().split(/\s+/).length : 0}</span>
            </div>
          </div>

          {/* Panel 2: Modified Version */}
          <div 
            className={`bg-[#0a0a0a] rounded-[32px] border p-6 md:p-8 space-y-4 transition-all ${drag2 ? 'border-emerald-500 bg-emerald-500/[0.02]' : 'border-white/5'}`}
            onDragOver={(e) => { e.preventDefault(); setDrag2(true); }}
            onDragLeave={() => setDrag2(false)}
            onDrop={(e) => handleFileDrop(e, 2)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Modified Version (Text B)
              </span>

              {/* Upload Input File */}
              <label className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>Import File</span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.html,.css,.js,.ts"
                  onChange={(e) => handleFileChange(e, 2)}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste subsequent modified draft revision revisions here..."
              className="w-full h-48 bg-transparent border-0 resize-none font-mono text-xs leading-relaxed text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-0"
            />

            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              <span>Lines: {text2.split('\n').filter(Boolean).length}</span>
              <span>Words: {text2.trim() ? text2.trim().split(/\s+/).length : 0}</span>
            </div>
          </div>

        </div>

        {/* Diff Review Engine Panel */}
        {(text1 || text2) && (
          <div className="space-y-6" id="text-compare-output-viewport">
            
            {/* Header / Statistics */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-6">
                
                {/* Visual Radial Similarity score */}
                <div className="relative w-20 h-20 bg-white/[0.01] rounded-full border border-white/5 flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 font-mono font-bold leading-none">Similarity</span>
                  <span className="text-2xl font-black text-rose-500 font-mono leading-none mt-1">{diffResults.stats.similarity}%</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-slate-200 tracking-widest">Algorithmic Match Rate</h3>
                  <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
                    Evaluated across {diffResults.parts.filter(p => p.type !== 'unchanged').length} delta segments using optimized Longest Common Subsequence tracking rules.
                  </p>
                </div>

              </div>

              {/* Quantities metrics grid */}
              <div className="grid grid-cols-3 gap-3 text-center min-w-[280px]">
                
                <div className="p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <span className="text-lg font-black font-mono text-red-400">-{diffResults.stats.removed}</span>
                  <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider mt-0.5">Removed</span>
                </div>

                <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <span className="text-lg font-black font-mono text-emerald-400">+{diffResults.stats.added}</span>
                  <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider mt-0.5">Added</span>
                </div>

                <div className="p-3 bg-white/[0.01] rounded-2xl border border-white/5">
                  <span className="text-lg font-black font-mono text-slate-400">{diffResults.stats.unchanged}</span>
                  <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider mt-0.5">Matched</span>
                </div>

              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className={`py-3 px-5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied report!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-rose-500" /> Copy Report
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Results Output Window */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-4 md:p-8 space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Difference Feed View ({activeTab === 'side' ? 'Side-by-side' : 'Unified Inline'})
                </span>
                
                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/25 border border-red-500/40 inline-block" /> Deleted</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/25 border border-emerald-500/40 inline-block" /> Added</span>
                </div>
              </div>

              {/* View Switch rendering */}
              <div className="w-full overflow-x-auto">
                
                {activeTab === 'side' ? (
                  /* SIDE BY SIDE VIEW */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    
                    {/* Left Panel: Original Document minus edits (padded) */}
                    <div className="space-y-1 font-mono text-xs overflow-y-auto max-h-[500px] pr-2">
                      <div className="sticky top-0 bg-[#0a0a0a] pb-2 text-[10px] font-black uppercase text-slate-650 tracking-wider">
                        Original Document Lines
                      </div>
                      
                      {diffResults.originalLinesWithDiff.map((line, idx) => {
                        let rowStyles = "text-slate-400 hover:bg-white/[0.01]";
                        if (line.type === 'removed') {
                          rowStyles = "bg-red-500/10 text-red-350 border-l-2 border-red-500 py-0.5 px-1";
                        } else if (line.type === 'empty') {
                          rowStyles = "bg-white/[0.01] opacity-20 py-0.5 select-none";
                        }

                        return (
                          <div key={idx} className={`flex items-start gap-4 py-0.5 rounded ${rowStyles}`}>
                            <span className="text-[10px] text-slate-600 font-mono w-8 text-right select-none shrink-0">
                              {line.index > 0 ? line.index : ''}
                            </span>
                            <span className="whitespace-pre-wrap break-all leading-relaxed">
                              {line.type === 'empty' ? ' ' : line.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Panel: Modified Document plus additions (padded) */}
                    <div className="space-y-1 font-mono text-xs overflow-y-auto max-h-[500px] pl-2">
                      <div className="sticky top-0 bg-[#0a0a0a] pb-2 text-[10px] font-black uppercase text-slate-650 tracking-wider">
                        Modified Document Lines
                      </div>

                      {diffResults.modifiedLinesWithDiff.map((line, idx) => {
                        let rowStyles = "text-slate-400 hover:bg-white/[0.01]";
                        if (line.type === 'added') {
                          rowStyles = "bg-emerald-500/10 text-emerald-350 border-l-2 border-emerald-500 py-0.5 px-1 font-semibold";
                        } else if (line.type === 'empty') {
                          rowStyles = "bg-white/[0.01] opacity-20 py-0.5 select-none";
                        }

                        return (
                          <div key={idx} className={`flex items-start gap-4 py-0.5 rounded ${rowStyles}`}>
                            <span className="text-[10px] text-slate-600 font-mono w-8 text-right select-none shrink-0">
                              {line.index > 0 ? line.index : ''}
                            </span>
                            <span className="whitespace-pre-wrap break-all leading-relaxed">
                              {line.type === 'empty' ? ' ' : line.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ) : (
                  /* UNIFIED INLINE VIEW */
                  <div className="space-y-1 font-mono text-xs overflow-y-auto max-h-[500px] pr-2">
                    
                    {diffResults.parts.map((p, idx) => {
                      let tagAndColor = '  ';
                      let blockStyles = "text-slate-400 hover:bg-white/[0.01]";
                      
                      if (p.type === 'added') {
                        tagAndColor = '+ ';
                        blockStyles = "bg-emerald-500/10 text-emerald-350 border-l-2 border-emerald-500 py-1 px-2 font-semibold";
                      } else if (p.type === 'removed') {
                        tagAndColor = '- ';
                        blockStyles = "bg-red-500/10 text-red-350 border-l-2 border-red-500 py-1 px-2";
                      }

                      return (
                        <div key={idx} className={`flex items-start gap-3 py-1 rounded transition-colors ${blockStyles}`}>
                          <span className={`text-xs font-black select-none shrink-0 ${p.type === 'added' ? 'text-emerald-500' : p.type === 'removed' ? 'text-red-500' : 'text-slate-700'}`}>
                            {tagAndColor}
                          </span>
                          <span className="whitespace-pre-wrap break-all leading-relaxed">
                            {p.value}
                          </span>
                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
