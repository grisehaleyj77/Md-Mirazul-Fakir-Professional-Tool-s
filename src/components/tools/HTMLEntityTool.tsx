import React, { useState } from 'react';
import { Globe, Clipboard, Check, Trash2, ArrowLeftRight, Wand2, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HTMLEntityTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const processHTML = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      const div = document.createElement('div');
      div.textContent = input;
      setOutput(div.innerHTML);
    } else {
      const div = document.createElement('div');
      div.innerHTML = input;
      setOutput(div.textContent || '');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const toggleMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">HTML Entity Smith</h2>
            <p className="text-xs text-slate-500">Encode and decode HTML entities safely</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-all shadow-md"
          >
            <ArrowLeftRight size={18} />
            {mode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
              {mode === 'encode' ? <Code size={14} /> : <Wand2 size={14} />}
              {mode === 'encode' ? 'Normal Text' : 'Encoded HTML'}
            </label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={processHTML}
            placeholder={mode === 'encode' ? 'Enter text to encode (e.g. <div>)...' : 'Paste encoded HTML (e.g. &lt;div&gt;)...'}
            className="w-full h-[300px] p-6 bg-white border-2 border-slate-100 rounded-3xl font-mono text-sm focus:outline-none focus:border-amber-500/30 transition-all resize-none shadow-sm"
          />
          <button
            onClick={processHTML}
            className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-[0.98]"
          >
            {mode === 'encode' ? 'Encode to Entities' : 'Decode to Text'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
              {mode === 'encode' ? <Wand2 size={14} /> : <Code size={14} />}
              Result
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            )}
          </div>
          
          <div className="relative h-[300px]">
            <AnimatePresence mode="wait">
              {output ? (
                <motion.textarea
                  key="output"
                  readOnly
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  value={output}
                  className="w-full h-full p-6 bg-amber-50/50 text-amber-900 border-2 border-amber-100 rounded-3xl font-mono text-sm focus:outline-none resize-none"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-4">
                  <div className="p-4 bg-white rounded-full shadow-sm">
                    <Globe size={36} strokeWidth={1.5} className="text-amber-200" />
                  </div>
                  <p className="text-sm font-semibold italic text-slate-400">Result will appear here...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Code size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">HTML Security</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Encoding special characters into HTML entities prevents cross-site scripting (XSS) and ensures characters like &lt; and &gt; are displayed correctly in browsers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
