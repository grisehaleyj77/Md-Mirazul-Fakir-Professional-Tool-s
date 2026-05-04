import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Sparkles, Volume2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Tooltip from './Tooltip';

export default function BanglaTranslator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sourceLang, setSourceLang] = useState<'english' | 'bangla'>('english');

  const translateText = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const targetLang = sourceLang === 'english' ? 'Bangla' : 'English';
      const promptSource = sourceLang === 'english' ? 'English' : 'Bangla';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following ${promptSource} text to ${targetLang}. Provide ONLY the translated text without any explanations or additional context.\n\nText: ${inputText}`,
        config: {
          temperature: 0.2,
        }
      });

      const translated = response.text?.trim() || "Translation failed. Please try again.";
      setOutputText(translated);
    } catch (error) {
      console.error('Translation error:', error);
      alert('An error occurred during translation. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const swapLanguages = () => {
    setSourceLang(prev => prev === 'english' ? 'bangla' : 'english');
    setInputText(outputText);
    setOutputText(inputText);
  };

  const clear = () => {
    setInputText('');
    setOutputText('');
  };

  const speakText = (text: string, lang: 'en' | 'bn') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'bn-BD';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Languages className="w-8 h-8 text-indigo-600" />
          Language Translator
        </h2>
        <p className="text-neutral-500 text-lg">
          Powered by Gemini AI for contextual and accurate translations between English and Bangla.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-stretch">
        {/* Source Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              {sourceLang === 'english' ? 'English' : 'Bangla (বাংলা)'}
            </span>
            <div className="flex gap-2">
               <button 
                onClick={() => speakText(inputText, sourceLang === 'english' ? 'en' : 'bn')}
                disabled={!inputText}
                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-30"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button 
                onClick={clear}
                disabled={!inputText}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={sourceLang === 'english' ? "Type or paste English text here..." : "বাংলা টেক্সট এখানে লিখুন..."}
              className="w-full min-h-[300px] p-6 text-lg bg-white border border-neutral-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />
            {inputText && (
              <button
                onClick={translateText}
                disabled={isTranslating}
                className="absolute bottom-6 right-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTranslating ? (
                  <Sparkles className="w-5 h-5 animate-pulse" />
                ) : (
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                )}
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            )}
          </div>
        </div>

        {/* Swap Button (Mobile) */}
        <div className="lg:hidden flex justify-center py-2">
           <button 
            onClick={swapLanguages}
            className="p-4 bg-white border border-neutral-200 rounded-full shadow-md text-indigo-600 hover:bg-neutral-50 active:scale-90 transition-all"
          >
            <ArrowRightLeft className="w-6 h-6 rotate-90" />
          </button>
        </div>

        {/* Swap Button (Desktop) - Overlayed or between columns */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-[45%] -translate-x-1/2 z-10">
           <button 
            onClick={swapLanguages}
            className="p-4 bg-white border border-neutral-200 rounded-full shadow-lg text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 active:scale-90 transition-all group"
          >
            <ArrowRightLeft className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Target Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              {sourceLang === 'english' ? 'Bangla (বাংলা)' : 'English'}
            </span>
            <div className="flex gap-1">
              {outputText && (
                <>
                  <Tooltip content="Read aloud">
                    <button 
                      onClick={() => speakText(outputText, sourceLang === 'english' ? 'bn' : 'en')}
                      className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Copy output">
                    <button 
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg transition-all ${copied ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
          <div className="relative min-h-[300px] w-full bg-neutral-50/50 border border-neutral-200/60 rounded-[2rem] p-6 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {outputText ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-lg leading-relaxed text-neutral-800 break-words"
                >
                  {outputText}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center gap-4 text-neutral-300"
                >
                  <Languages className="w-12 h-12 opacity-20" />
                  <p className="font-medium italic">
                    {isTranslating ? 'Gemini is thinking...' : 'Translated text will appear here'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-indigo-900">Translation Tips</h4>
          <p className="text-sm text-indigo-700/80 leading-relaxed">
            For best results, provides full sentences rather than single words. AI handles contextual nuances and idioms much better in full sentences. You can also translate from Bangla to English by clicking the swap button.
          </p>
        </div>
      </div>
    </div>
  );
}
