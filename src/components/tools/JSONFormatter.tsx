import React, { useState } from 'react';
import { FileCode, Clipboard, Check, Trash2, Maximize, Minimize, AlertCircle, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <FileCode size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">JSON Formatter</h2>
            <p className="text-xs text-slate-500">Validate, format, and minify JSON data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={formatJSON}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Maximize size={18} />
            Format
          </button>
          <button
            onClick={minifyJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-all shadow-md shadow-slate-200"
          >
            <Minimize size={18} />
            Minify
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Input JSON</label>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formatted Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
          <div className="relative h-[400px]">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center text-center gap-3"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 mb-1 text-sm">Invalid JSON</h3>
                    <p className="text-xs text-red-600 font-mono break-all px-4">{error}</p>
                  </div>
                </motion.div>
              ) : output ? (
                <motion.textarea
                  key="output"
                  readOnly
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  value={output}
                  className="w-full h-full p-4 bg-slate-900 text-indigo-300 border border-slate-800 rounded-2xl font-mono text-sm focus:outline-none resize-none shadow-xl shadow-slate-200/50"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Wand2 size={32} strokeWidth={1.5} />
                  <p className="text-xs font-medium">Click "Format" to see result</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {!output && !error && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3 text-indigo-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FileCode size={18} />
          </div>
          <p className="text-sm font-medium">Tip: You can use "Minify" to remove all whitespace and reduce file size.</p>
        </div>
      )}
    </div>
  );
};
