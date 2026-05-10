import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Loader2, Volume2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [direction, setDirection] = useState<'en-bn' | 'bn-en'>('en-bn');
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!sourceText || !process.env.GEMINI_API_KEY) {
      if (!process.env.GEMINI_API_KEY) setTargetText('API Key missing. Please check configuration.');
      return;
    }
    setIsTranslating(true);
    try {
      const prompt = direction === 'en-bn' 
        ? `Translate the following English text to perfectly natural sounding Bengali: "${sourceText}". Just provide the translation, no explanation.`
        : `Translate the following Bengali text to perfectly natural sounding English: "${sourceText}". Just provide the translation, no explanation.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setTargetText(response.text || '');
    } catch (error) {
      console.error('Translation failed:', error);
      setTargetText('Translation error. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = direction === 'en-bn' ? 'bn-BD' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4 bg-[var(--glass)] p-2 rounded-2xl border border-[var(--glass-border)] shadow-sm">
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${direction === 'en-bn' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'}`}>
            English
          </span>
          <button 
            onClick={() => setDirection(prev => prev === 'en-bn' ? 'bn-en' : 'en-bn')}
            className="p-2 hover:bg-[var(--line)] rounded-full transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-5 h-5 text-slate-400" />
          </button>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${direction === 'bn-en' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'}`}>
            Bangla
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={direction === 'en-bn' ? "Type text in English..." : "বাংলায় লিখুন..."}
              className="w-full h-64 bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-lg resize-none text-[var(--ink)]"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => speak(sourceText)}
                className="p-3 bg-[var(--line)] hover:opacity-80 text-slate-400 rounded-2xl transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={translate}
            disabled={isTranslating || !sourceText}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isTranslating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
            Translate Now
          </button>
        </div>

        <div className="relative">
          <div className="w-full h-64 bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-sm text-lg overflow-y-auto text-[var(--ink)]">
            {isTranslating ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                <p className="text-sm">Thinking...</p>
              </div>
            ) : targetText ? (
              <p className="whitespace-pre-wrap">{targetText}</p>
            ) : (
              <p className="text-slate-300 italic">Translation will appear here...</p>
            )}
          </div>
          {targetText && (
            <div className="absolute bottom-4 right-4 flex gap-2">
               <button 
                onClick={() => speak(targetText)}
                className="p-3 bg-[var(--line)] hover:opacity-80 text-slate-400 rounded-2xl transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-[var(--line)] hover:opacity-80 text-slate-400 rounded-2xl transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
