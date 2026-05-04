import React, { useState, useEffect } from 'react';
import { toWords } from 'number-to-words';
import { Copy, Check, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function NumberToWords() {
  const [numberInput, setNumberInput] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numberInput.trim()) {
      setWords('');
      setError(null);
      return;
    }

    try {
      // Remove commas for parsing
      const cleanInput = numberInput.replace(/,/g, '');
      const num = parseInt(cleanInput, 10);
      
      if (isNaN(num)) {
        setError('Please enter a valid number');
        setWords('');
      } else if (num > 9007199254740991 || num < -9007199254740991) {
        setError('Number is too large (max 9,007,199,254,740,991)');
        setWords('');
      } else {
        setError(null);
        setWords(toWords(num));
      }
    } catch (e) {
      setError('Invalid number format');
      setWords('');
    }
  }, [numberInput]);

  const handleCopy = async () => {
    if (!words) return;
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyNumber = async () => {
    if (!numberInput) return;
    try {
      await navigator.clipboard.writeText(numberInput);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } catch (err) {
      console.error('Failed to copy number: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          Convert any number to English words
        </h2>
        <p className="text-neutral-500 text-lg">
          Type a number below to instantly see its English word representation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <label htmlFor="number-input" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
            <Hash className="w-4 h-4 text-neutral-400" />
            Enter Number
          </label>
          <div className="relative">
            <input
              id="number-input"
              type="text"
              inputMode="numeric"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-2xl pl-5 pr-14 py-4 text-2xl font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-neutral-300"
              placeholder="e.g. 1,234,567"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Tooltip content="Copy number">
                <button
                  onClick={handleCopyNumber}
                  disabled={!numberInput}
                  className="p-2 text-neutral-400 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-neutral-400 transition-colors rounded-xl hover:bg-neutral-100"
                >
                  {copiedNumber ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </Tooltip>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm font-medium px-1"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">
              Word Representation
            </label>
            <Tooltip content="Copy result">
              <button
                onClick={handleCopy}
                disabled={!words}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-md hover:bg-indigo-50 disabled:hover:bg-transparent"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </Tooltip>
          </div>
          
          <div className="relative min-h-[160px] w-full bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-start overflow-hidden">
            <AnimatePresence mode="wait">
              {words ? (
                <motion.div
                  key="words"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl md:text-3xl font-medium text-neutral-800 leading-tight capitalize"
                >
                  {words}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-300 text-xl font-medium italic flex items-center justify-center w-full h-full absolute inset-0"
                >
                  Result will appear here...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
