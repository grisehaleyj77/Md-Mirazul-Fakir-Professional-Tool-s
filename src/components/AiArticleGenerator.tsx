import React, { useState } from 'react';
import { Sparkles, PenTool, Send, Copy, Check, RefreshCcw, Layout, Type, Palette, MessageSquareText, History as HistoryIcon, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface ArticleHistory {
  id: string;
  topic: string;
  content: string;
  date: string;
}

export default function AiArticleGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [type, setType] = useState('Blog Post');
  const [length, setLength] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ArticleHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const tones = ['Professional', 'Casual', 'Informative', 'Persuasive', 'Creative', 'Technical'];
  const types = ['Blog Post', 'News Article', 'Educational Guide', 'Product Review', 'Narrative Story'];
  const lengths = ['Short (~300 words)', 'Medium (~600 words)', 'Long (~1000 words)'];

  const generateArticle = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedArticle('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Write a ${tone.toLowerCase()} ${type.toLowerCase()} about "${topic}". 
                      The target length should be ${length}. 
                      Use a clean, engaging structure with a title and subheadings if necessary. 
                      Format the output in a clean layout without markdown if possible (just plain text with clear line breaks).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional article writer and SEO specialist. Create high-quality, original content that is engaging and informative.",
          temperature: 0.7,
        },
      });

      const result = response.text || '';
      setGeneratedArticle(result);
      
      const newEntry: ArticleHistory = {
        id: Date.now().toString(),
        topic: topic,
        content: result,
        date: new Date().toLocaleString(),
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 20));
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate article. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArticle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadArticle = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedArticle], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.slice(0, 20).replace(/\s/g, '_')}_article.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
            <PenTool className="w-10 h-10 text-brand-500" />
            AI Article Generator
          </h2>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-2xl transition-all ${showHistory ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white border border-neutral-100 text-neutral-400 hover:text-neutral-600 shadow-sm'}`}
          >
            <HistoryIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-neutral-500 text-lg font-medium">
          Create high-quality, professional articles in seconds using advanced AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">
                Article Topic / Keyword
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What should the article be about?"
                className="w-full h-32 px-5 py-4 bg-neutral-50 border-2 border-transparent focus:border-brand-500 rounded-3xl outline-none font-bold text-sm transition-all resize-none placeholder:font-normal"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">
                  <Palette className="w-3 h-3" /> Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-neutral-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                >
                  {tones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">
                  <Layout className="w-3 h-3" /> Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-5 py-3.5 bg-neutral-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                >
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">
                  <Type className="w-3 h-3" /> Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-5 py-3.5 bg-neutral-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                >
                  {lengths.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={generateArticle}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-4 bg-brand-500 text-white font-black text-xl rounded-3xl hover:bg-brand-600 disabled:opacity-50 transition-all shadow-xl shadow-brand-100 flex items-center justify-center gap-3 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Write
                </>
              )}
            </button>
          </div>
          
          <div className="bg-neutral-50 rounded-[2rem] p-6 border border-neutral-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-brand-500">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-neutral-900 uppercase tracking-wide">SEO Optimized</p>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Our AI naturally integrates keywords while maintaining readability and value for your readers.
              </p>
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border-2 border-neutral-100 rounded-[3rem] p-8 min-h-[600px] shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-6">
                  <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                    <HistoryIcon className="w-6 h-6 text-neutral-400" />
                    Previous Articles
                  </h3>
                  <button 
                    onClick={() => setHistory([])}
                    className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 opacity-20">
                      <HistoryIcon className="w-16 h-16 mb-4" />
                      <p className="font-black uppercase tracking-widest text-sm">No history yet</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 group hover:border-brand-500 transition-all cursor-pointer"
                        onClick={() => {
                          setGeneratedArticle(item.content);
                          setTopic(item.topic);
                          setShowHistory(false);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-neutral-800 line-clamp-1">{item.topic}</h4>
                          <span className="text-[10px] font-black text-neutral-400 uppercase">{item.date}</span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{item.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-neutral-100 rounded-[3rem] p-4 md:p-8 min-h-[600px] shadow-sm relative flex flex-col"
              >
                {!generatedArticle && !isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                    <div className="w-24 h-24 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Ready to Write</h3>
                      <p className="text-neutral-500 max-w-sm mx-auto font-medium">Enter a topic and watch as our AI crafts a professional article for you.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-neutral-50 z-10">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-amber-400 animate-bounce' : 'bg-green-500'}`} />
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                          {isGenerating ? 'Writer is thinking...' : 'Article Ready'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={copyToClipboard}
                          disabled={isGenerating}
                          className="p-3 bg-neutral-50 text-neutral-600 rounded-2xl hover:bg-neutral-100 transition-all"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={downloadArticle}
                          disabled={isGenerating}
                          className="p-3 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 transition-all"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 whitespace-pre-wrap font-medium text-neutral-800 leading-relaxed p-4 text-lg">
                      {isGenerating ? (
                        <div className="space-y-4 animate-pulse">
                          <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                          <div className="h-4 bg-neutral-100 rounded w-full"></div>
                          <div className="h-4 bg-neutral-100 rounded w-5/6"></div>
                          <div className="h-4 bg-neutral-100 rounded w-full"></div>
                          <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
                        </div>
                      ) : (
                        generatedArticle
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
