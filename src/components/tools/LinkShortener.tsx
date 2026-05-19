import React, { useState } from 'react';
import { Link2, Copy, ExternalLink, Trash2, Globe, Loader2, Check, Sparkles, ArrowRight, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LinkShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!url.trim()) return;
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setUrl('');
    setShortUrl('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
            <Link2 size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Swift Link Condenser</h2>
            <p className="text-xs text-slate-500">Transform long URLs into elegant, shareable snippets</p>
          </div>
        </div>
        
        {url && (
          <button
            onClick={clear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Destination URL</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
                    <Globe size={18} />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-link-to-shorten"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:outline-none focus:border-violet-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleShorten}
                disabled={isProcessing || !url.trim()}
                className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-violet-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-violet-600/20"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isProcessing ? 'Processing...' : 'Shorten Link'}
              </button>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 font-bold text-center italic"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2">
              <MousePointerClick size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytics Ready</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Every link generated through our engine is optimized for high-speed redirection. We use the is.gd industrial infrastructure to ensure 99.9% uptime for your shortened assets.
            </p>
          </div>
        </div>

        {/* Preview area */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden h-full flex flex-col justify-between min-h-[400px]">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Link2 size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <ExternalLink size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Your Short Link</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ready for distribution</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-lg break-all text-violet-400 min-h-[120px] flex items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  {shortUrl ? (
                    <motion.span
                      key="short-url"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer hover:underline"
                      onClick={() => window.open(shortUrl, '_blank')}
                    >
                      {shortUrl}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      className="italic text-sm"
                    >
                      Your shortened URL will appear here...
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative z-10 space-y-4 pt-8">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  disabled={!shortUrl}
                  className={`py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${copied ? 'bg-violet-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] disabled:opacity-30'}`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                
                <button
                  onClick={() => window.open(shortUrl, '_blank')}
                  disabled={!shortUrl}
                  className="py-4 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <ExternalLink size={18} />
                  Open
                </button>
              </div>
              
              <div className="flex items-center gap-3 px-2">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Preview</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              <div className="flex justify-center">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global CDN Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
