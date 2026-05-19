import React, { useState } from 'react';
import { Binary, Clipboard, Check, Trash2, ArrowLeftRight, AlertCircle, Wand2, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processText = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }

      if (mode === 'encode') {
        setOutput(btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })));
      } else {
        setOutput(decodeURIComponent(Array.prototype.map.call(atob(input), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      }
      setError(null);
    } catch (e) {
      setError('Invalid input for Base64 ' + mode);
      setOutput('');
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
    setError(null);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    handleClear();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Binary size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Base64 Converter</h2>
            <p className="text-xs text-slate-500">Encode and decode text to Base64 format</p>
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
        {/* Left Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
              {mode === 'encode' ? <Type size={14} /> : <Binary size={14} />}
              {mode === 'encode' ? 'Raw Text' : 'Base64 String'}
            </label>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            onBlur={processText}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
            className="w-full h-[300px] p-6 bg-white border-2 border-slate-100 rounded-3xl font-mono text-sm focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-sm"
          />
          <button
            onClick={processText}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            {mode === 'encode' ? 'Encode to Base64' : 'Decode to Text'}
          </button>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
              {mode === 'encode' ? <Binary size={14} /> : <Type size={14} />}
              Result
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            )}
          </div>
          
          <div className="relative h-[300px]">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 p-6 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Conversion Failed</h3>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                </motion.div>
              ) : output ? (
                <motion.textarea
                  key="output"
                  readOnly
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  value={output}
                  className="w-full h-full p-6 bg-emerald-50/50 text-emerald-900 border-2 border-emerald-100 rounded-3xl font-mono text-sm focus:outline-none resize-none"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Wand2 size={36} strokeWidth={1.5} className="animate-pulse" />
                  <p className="text-sm font-semibold italic text-slate-400">Result will appear here...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Binary size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">Developer Note</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Base64 is an encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
