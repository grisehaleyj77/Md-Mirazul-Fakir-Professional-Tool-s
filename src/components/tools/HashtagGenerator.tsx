import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Search,
  MessageSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ai, GEMINI_API_KEY } from '../../lib/gemini';

export const HashtagGenerator = () => {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const PLATFORMS = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'X / Twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Threads', icon: MessageSquare, color: 'text-slate-900', bg: 'bg-slate-100' },
  ];

  const generateHashtags = async () => {
    if (!input.trim()) return;
    if (!GEMINI_API_KEY) {
      alert("API Key missing. Please check configuration.");
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate 30 highly relevant, trending, and effective hashtags for ${platform} based on this topic or description: "${input}". 
      Return ONLY the hashtags separated by spaces, no other text or numbering. 
      Ensure a mix of broad and niche hashtags for maximum reach.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "";
      const generated = text
        .split(/\s+/)
        .filter(h => h.startsWith('#'))
        .map(h => h.replace(/[,.;]$/, ''));
      
      setHashtags(generated.slice(0, 30));
    } catch (error) {
      console.error("Hashtag generation failed:", error);
      alert("AI failed to generate hashtags. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(null as any), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tight">AI Hashtag Suite</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Boost your reach with intelligent tags</p>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-sm space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Select Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.name}
                onClick={() => setPlatform(p.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${platform === p.name ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500'}`}
              >
                <p.icon className="w-4 h-4" />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Post Topic or Description</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. A sunset photo at the beach with a cinematic vibe..."
              className="w-full h-32 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-blue-500/20 resize-none placeholder:text-slate-300 transition-all"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-black text-slate-300">
               <Sparkles className="w-3 h-3" />
               AI POWERED
            </div>
          </div>
        </div>

        <button
          onClick={generateHashtags}
          disabled={loading || !input.trim()}
          className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:grayscale"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              Generate Hashtags
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {hashtags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimized Results ({hashtags.length})</h3>
               <button 
                onClick={() => copyToClipboard(hashtags.join(' '))}
                className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
               >
                 {copiedAll ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                 {copiedAll ? 'Copied' : 'Copy All'}
               </button>
            </div>

            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(tag, idx)}
                    className="group relative flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-100 dark:border-white/5 rounded-xl transition-all active:scale-90"
                  >
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 group-hover:text-blue-600">{tag}</span>
                    <AnimatePresence>
                      {copiedIndex === idx && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute -top-1 -right-1 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="bg-green-100 dark:bg-green-500/20 text-green-600 p-1.5 rounded-lg">
                      <Zap className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-tight">Est. Visibility</p>
                      <p className="text-[9px] font-bold text-slate-400">Increased by 45%</p>
                   </div>
                </div>
                <button 
                  onClick={() => { setHashtags([]); setInput(''); }}
                  className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-black italic">Pro Hashtag Strategy</h4>
          </div>
          <p className="text-xs text-slate-400 font-bold leading-relaxed">
            For maximum reach on {platform}, mix these 30 hashtags. Using a variety of high, medium, and low volume tags helps you trend faster in niche communities while staying visible in broad searches.
          </p>
          <div className="flex items-center gap-4 pt-2">
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 42}`} alt="avatar" />
                  </div>
                ))}
             </div>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Trusted by 10k+ creators</p>
          </div>
        </div>
      </div>
    </div>
  );
};
