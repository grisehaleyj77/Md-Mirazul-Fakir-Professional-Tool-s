import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Trash2, 
  Copy, 
  Clock, 
  Mic, 
  FileText, 
  Hash, 
  SpellCheck,
  RotateCcw,
  Sparkles,
  Search,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stats {
  words: number;
  chars: number;
  charsNoSpace: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

export const WordCounterTool = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<Stats>({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const calculateStats = () => {
      const trimmedText = text.trim();
      const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
      const chars = text.length;
      const charsNoSpace = text.replace(/\s/g, '').length;
      const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
      const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(Boolean).length : 0;
      
      // Based on average adult speed (200 wpm reading, 130 wpm speaking)
      const readingTime = Math.ceil(words / 200);
      const speakingTime = Math.ceil(words / 130);

      setStats({
        words,
        chars,
        charsNoSpace,
        sentences,
        paragraphs,
        readingTime,
        speakingTime
      });
    };

    calculateStats();
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => setText('');

  const actions = [
    { 
      label: 'Uppercase', 
      onClick: () => setText(text.toUpperCase()),
      icon: <Type className="w-3 h-3" /> 
    },
    { 
      label: 'Lowercase', 
      onClick: () => setText(text.toLowerCase()),
      icon: <Type className="w-3 h-3" /> 
    },
    { 
      label: 'Clean Spaces', 
      onClick: () => setText(text.replace(/\s+/g, ' ').trim()),
      icon: <Sparkles className="w-3 h-3" /> 
    },
    { 
      label: 'Remove Lines', 
      onClick: () => setText(text.replace(/\n+/g, ' ')),
      icon: <Trash2 className="w-3 h-3" /> 
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Type className="w-3 h-3" />
              Professional Text Analysis
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Word Counter Pro</h2>
            <p className="text-sm font-medium text-gray-500 max-w-sm">
              Real-time deep analysis of your text for SEO, documentation, or creative writing.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={clearText}
              className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${copied ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-900 text-white hover:bg-black'}`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <textarea
              className="w-full h-[400px] p-8 bg-white rounded-[40px] border-2 border-gray-100 focus:border-rose-200 outline-none transition-all font-medium text-gray-700 resize-none shadow-sm placeholder:text-gray-300"
              placeholder="Start typing or paste your content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="word-counter-textarea"
            />
            {/* Quick Actions Float */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="px-4 py-2 bg-gray-900/5 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-900 hover:text-white transition-all border border-transparent hover:border-gray-800"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Side */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Core Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-rose-50/50 p-4 rounded-3xl space-y-1">
                    <span className="text-[10px] font-black text-rose-600/50 uppercase">Words</span>
                    <p className="text-2xl font-black text-rose-600">{stats.words}</p>
                 </div>
                 <div className="bg-blue-50/50 p-4 rounded-3xl space-y-1">
                    <span className="text-[10px] font-black text-blue-600/50 uppercase">Characters</span>
                    <p className="text-2xl font-black text-blue-600">{stats.chars}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Structure</h3>
              <div className="space-y-3">
                {[
                  { label: 'Sentences', value: stats.sentences, icon: <Sparkles className="w-3 h-3" /> },
                  { label: 'Paragraphs', value: stats.paragraphs, icon: <FileText className="w-3 h-3" /> },
                  { label: 'No Spaces', value: stats.charsNoSpace, icon: <Hash className="w-3 h-3" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-xl group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Estimated Effort</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Reading</span>
                    </div>
                    <p className="text-sm font-black text-gray-900">{stats.readingTime} min</p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Mic className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Speaking</span>
                    </div>
                    <p className="text-sm font-black text-gray-900">{stats.speakingTime} min</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[40px] text-white space-y-4">
             <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                <Search className="w-5 h-5 text-rose-400" />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest leading-tight">Density Analysis Coming Soon</h3>
                <p className="text-[10px] font-medium opacity-50 mt-2 leading-relaxed">
                  We are working on keyword density and SEO optimization scores for your content.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
