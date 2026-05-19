import React, { useState } from 'react';
import { 
  Youtube, 
  Copy, 
  Trash2, 
  Loader2, 
  Check, 
  ExternalLink, 
  FileText, 
  Download, 
  FileJson,
  Clock,
  LayoutList,
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export const YouTubeTranscript = () => {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFetch = async () => {
    if (!url.trim()) return;
    setIsProcessing(true);
    setError('');
    setTranscript([]);
    
    try {
      const response = await fetch('/api/youtube-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        setError(data.error || 'Failed to fetch transcript');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h > 0 ? h : null,
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const fullText = transcript.map(t => t.text).join(' ');
  
  const filteredTranscript = transcript.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    if (!transcript.length) return;
    const textToCopy = showTimestamps 
      ? transcript.map(t => `[${formatTime(t.offset)}] ${t.text}`).join('\n')
      : fullText;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const text = showTimestamps 
      ? transcript.map(t => `[${formatTime(t.offset)}] ${t.text}`).join('\n')
      : fullText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `youtube_transcript_${Date.now()}.txt`;
    link.click();
  };

  const clear = () => {
    setUrl('');
    setTranscript([]);
    setError('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <Youtube size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">YouTube Transcript Pro</h2>
            <p className="text-xs text-slate-500">Fast extraction with precise timestamps</p>
          </div>
        </div>
        
        {transcript.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-100 mx-2" />
            <button
              onClick={downloadText}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all text-sm"
            >
              <Download size={16} />
              Export .TXT
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Video link</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                    <ExternalLink size={18} />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:outline-none focus:border-red-500/20 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleFetch}
                disabled={isProcessing || !url.trim()}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-600/20"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isProcessing ? 'Mining Data...' : 'Extract Transcript'}
              </button>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 rounded-xl border border-red-100 text-[11px] text-red-600 font-bold leading-relaxed"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {transcript.length > 0 && (
              <div className="pt-6 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Mode</span>
                   <button 
                     onClick={() => setShowTimestamps(!showTimestamps)}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${showTimestamps ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}
                   >
                     {showTimestamps ? 'With Timestamps' : 'Plain Text'}
                   </button>
                </div>

                <div className="space-y-4 pt-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search inside transcript..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-red-200 transition-all"
                      />
                   </div>
                </div>

                <button
                  onClick={handleCopy}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied to Clipboard' : 'Copy Full Text'}
                </button>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Youtube size={80} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                   <FileJson size={14} className="text-red-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tech Specs</span>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</span>
                      <span className="text-[10px] text-green-400 font-black">99.8%</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Mode</span>
                      <span className="text-[10px] text-red-400 font-black">Direct Stream</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
           <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-8 flex-1 flex flex-col">
              {!transcript.length && !isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20">
                   <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200 flex items-center justify-center text-slate-300">
                      <LayoutList size={40} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-800">Transcript Engine Offline</h3>
                      <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                         Paste a YouTube URL to extract every word spoken, categorized by timing data.
                      </p>
                   </div>
                </div>
              ) : isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-6">
                   <div className="relative">
                      <div className="w-16 h-16 border-4 border-red-100 rounded-full animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Loader2 className="animate-spin text-red-500" size={32} />
                      </div>
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-widest animate-pulse">Scanning Video Data</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Retrieving Captions...</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">Live Digest</div>
                         <span className="text-xs font-bold text-slate-400 italic">Found {filteredTranscript.length} interaction points</span>
                      </div>
                   </div>

                   <div className="space-y-1 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide">
                      {filteredTranscript.map((item, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.01 }}
                          key={index}
                          className="group flex items-start gap-6 p-4 hover:bg-white hover:rounded-2xl transition-all border-b border-slate-100 last:border-0"
                        >
                           {showTimestamps && (
                             <div className="flex items-center gap-2 pt-1">
                                <Clock size={12} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                                <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-red-500 transition-colors w-12">{formatTime(item.offset)}</span>
                             </div>
                           )}
                           <p className="text-sm font-medium text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                              {item.text}
                           </p>
                        </motion.div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           <div className="mt-6 p-4 bg-red-50/50 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm text-red-600 font-black text-[10px]">PRO</div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                 <span className="text-slate-800 font-black uppercase tracking-widest mr-1">Hint:</span> 
                 You can search specific keywords using the control panel. Large videos may take up to 5 seconds to fully index.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
