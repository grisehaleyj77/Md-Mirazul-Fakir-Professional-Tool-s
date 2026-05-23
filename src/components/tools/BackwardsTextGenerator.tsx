import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Type, 
  Sparkles,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BackwardsTextGenerator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Settings/Modes
  const [reverseCharacters, setReverseCharacters] = useState(true);
  const [reverseWords, setReverseWords] = useState(false);
  const [reverseEachWord, setReverseEachWord] = useState(false);
  const [upsideDown, setUpsideDown] = useState(false);

  // Upside down character mapping map
  const flipMap: { [key: string]: string } = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 
    'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 
    's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I', 
    'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 
    'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
    '.': '˙', ',': "'", '\'': ',', '"': '„', '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', 
    ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾', ';': '⸵'
  };

  const processText = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = inputText;

    // Apply specific combinations
    if (reverseEachWord) {
      // Reverse each word separately but keep order
      result = result
        .split(/\s+/)
        .map(word => word.split('').reverse().join(''))
        .join(' ');
    } else if (reverseWords && !reverseCharacters) {
      // Reverse word order but keep letters matching
      result = result.split(/\s+/).reverse().join(' ');
    } else if (reverseCharacters && !reverseWords) {
      // Reverse all characters completely
      result = result.split('').reverse().join('');
    } else if (reverseCharacters && reverseWords) {
      // Reverse both: equivalent to reversing characters, then reversing words (which is reversing characters in each word)
      result = result.split(/\s+/).reverse().map(word => word.split('').reverse().join('')).join(' ');
    }

    // Upside Down flipping
    if (upsideDown) {
      const flippedChars = result.split('').map(char => {
        return flipMap[char] || char;
      });
      // Standard upside down is also usually read right-to-left
      result = flippedChars.reverse().join('');
    }

    setOutputText(result);
  };

  useEffect(() => {
    processText();
  }, [inputText, reverseCharacters, reverseWords, reverseEachWord, upsideDown]);

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
    link.download = `reversed_text_${Date.now()}.txt`;
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
    setInputText("The quick brown fox jumps over the lazy dog!");
  };

  // Word statistics calculation
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const lineCount = inputText.split('\n').filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30" id="backwards-text-tool-root">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Typography Tools</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ArrowLeftRight className="w-10 h-10 text-blue-500 stroke-[2.5]" />
              Backwards Text Generator
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Instantly reverse, flip, or invert text characters and word structures. Perfect for creative headings, encryption, encoding, or fun social posts.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={loadExample}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-[#3b82f6] rounded-2xl border border-blue-500/20 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              Load Demo Text
            </button>
          </div>
        </div>

        {/* Workspace Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input / Output area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Input area */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-500" />
                  Your Input Text
                </span>
                
                {inputText && (
                  <button 
                    onClick={handleClear}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors tooltip rounded-xl hover:bg-white/5"
                    title="Clear document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-48 bg-transparent border-0 resize-none font-mono text-sm leading-relaxed text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-0"
              />

              {/* Live Statistics */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                <div>Characters: <span className="text-blue-500">{charCount}</span></div>
                <div>Words: <span className="text-blue-500">{wordCount}</span></div>
                <div>Lines: <span className="text-blue-500">{lineCount}</span></div>
              </div>
            </div>

            {/* Output area */}
            <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 md:p-8 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Generated Result
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
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="p-2.5 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title="Download Text File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {outputText ? (
                <div className="w-full min-h-36 max-h-64 overflow-y-auto bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-mono text-sm leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-all">
                  {outputText}
                </div>
              ) : (
                <div className="w-full h-36 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-650 font-mono text-xs text-center p-8">
                  <Shuffle className="w-8 h-8 mb-2 opacity-30 animate-pulse text-blue-500" />
                  <p className="uppercase tracking-widest font-black text-[10px] text-slate-600">Awaiting your transcription</p>
                  <p className="text-[10px] mt-1 text-slate-700">Type or paste into input to generate outputs</p>
                </div>
              )}
            </div>

          </div>

          {/* Quick Transformation Settings Panel */}
          <div className="space-y-8" id="backwards-text-settings-section">
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 space-y-8 sticky top-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-200 font-sans">Options Panel</h3>
                  <p className="text-[10px] text-slate-500 font-sans tracking-wide">Configure text orientations</p>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Switch: Reverse Characters */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Reverse Characters</span>
                    <span className="text-[10px] text-slate-505 block font-mono">"hello" → "olleh"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReverseCharacters(!reverseCharacters);
                      if (reverseEachWord) setReverseEachWord(false);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      reverseCharacters ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        reverseCharacters ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch: Reverse Word Order */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Reverse Word Order</span>
                    <span className="text-[10px] text-slate-505 block font-mono">"one two" → "two one"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReverseWords(!reverseWords);
                      if (reverseEachWord) setReverseEachWord(false);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      reverseWords ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        reverseWords ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch: Reverse Letters inside each word */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Reverse Within Words</span>
                    <span className="text-[10px] text-slate-505 block font-mono">"one two" → "eno owt"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReverseEachWord(!reverseEachWord);
                      setReverseCharacters(false);
                      setReverseWords(false);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      reverseEachWord ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        reverseEachWord ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch: Upside Down Text */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Upside Down (Flip)</span>
                    <span className="text-[10px] text-slate-505 block font-mono">"hello" → "oʅʅǝɥ"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpsideDown(!upsideDown)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      upsideDown ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        upsideDown ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* Instant Transformations Row */}
              <div className="rounded-3xl p-5 border border-white/5 bg-white/[0.01] space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#555] block">Quick Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setReverseCharacters(true);
                      setReverseWords(false);
                      setReverseEachWord(false);
                      setUpsideDown(false);
                    }}
                    className="py-2.5 px-3 bg-[#0c0c0c] hover:bg-white/5 text-[10px] font-black uppercase tracking-wider rounded-xl text-slate-400 transition-colors border border-white/5"
                  >
                    Simple reverse
                  </button>
                  <button
                    onClick={() => {
                      setReverseCharacters(false);
                      setReverseWords(false);
                      setReverseEachWord(false);
                      setUpsideDown(true);
                    }}
                    className="py-2.5 px-3 bg-[#0c0c0c] hover:bg-white/5 text-[10px] font-black uppercase tracking-wider rounded-xl text-slate-400 transition-colors border border-white/5"
                  >
                    Pure Flipped
                  </button>
                  <button
                    onClick={() => {
                      setReverseCharacters(false);
                      setReverseWords(true);
                      setReverseEachWord(false);
                      setUpsideDown(false);
                    }}
                    className="py-2.5 px-3 bg-[#0c0c0c] hover:bg-white/5 text-[10px] font-black uppercase tracking-wider rounded-xl text-slate-400 transition-colors border border-white/5"
                  >
                    Reverse words
                  </button>
                  <button
                    onClick={() => {
                      setReverseCharacters(true);
                      setReverseWords(false);
                      setReverseEachWord(false);
                      setUpsideDown(true);
                    }}
                    className="py-2.5 px-3 bg-[#0c0c0c] hover:bg-white/5 text-[10px] font-black uppercase tracking-wider rounded-xl text-slate-400 transition-colors border border-white/5"
                  >
                    Reverse & Flip
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
