import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Play, Pause, RotateCcw, Download, Settings2, Loader2, Music } from 'lucide-react';

export const TTSAI = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && selectedVoiceIndex >= v.length) {
        setSelectedVoiceIndex(0);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices[selectedVoiceIndex];
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--ink)]">
                    <Mic className="w-5 h-5 text-purple-500" />
                    Text to Voice
                 </h3>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[var(--line)] px-2 py-1 rounded">AI Powered</span>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full h-80 bg-[var(--bg)]/50 border border-transparent rounded-2xl p-6 focus:bg-[var(--bg)] focus:border-purple-200 outline-none transition-all text-lg resize-none text-[var(--ink)]"
              />

              <div className="flex gap-4 mt-6">
                 <button
                   onClick={isPlaying ? stop : speak}
                   className={`flex-1 ${isPlaying ? 'bg-red-500' : 'bg-purple-600'} text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/20`}
                 >
                   {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                   {isPlaying ? 'Stop Playing' : 'Start Reading'}
                 </button>
                 <button
                   onClick={() => setText('')}
                   className="p-4 bg-[var(--bg)] border border-[var(--glass-border)] text-slate-400 rounded-xl hover:bg-[var(--line)] transition-all"
                 >
                   <RotateCcw className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Settings2 className="w-5 h-5 text-gray-400" />
                 Voice Settings
              </h3>

              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Select Voice</label>
                    <select 
                      value={selectedVoiceIndex} 
                      onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {voices.map((v, i) => (
                        <option key={`${v.name}-${v.lang}-${i}`} value={i}>{v.name} ({v.lang})</option>
                      ))}
                    </select>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <label className="block text-xs font-bold text-gray-400 uppercase">Pitch</label>
                       <span className="text-xs font-mono text-purple-500 font-bold">{pitch}</span>
                    </div>
                    <input 
                       type="range" min={0.5} max={2} step={0.1} value={pitch} 
                       onChange={(e) => setPitch(Number(e.target.value))}
                       className="w-full accent-purple-500"
                    />
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <label className="block text-xs font-bold text-gray-400 uppercase">Speed</label>
                       <span className="text-xs font-mono text-purple-500 font-bold">{rate}</span>
                    </div>
                    <input 
                       type="range" min={0.5} max={2} step={0.1} value={rate} 
                       onChange={(e) => setRate(Number(e.target.value))}
                       className="w-full accent-purple-500"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-purple-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <Music className="w-10 h-10 mb-4 opacity-50 transition-transform group-hover:scale-110" />
                 <h4 className="font-bold mb-2">Save as MP3?</h4>
                 <p className="text-purple-300 text-xs leading-relaxed mb-6">Recording functionality is coming soon for high-quality audio downloads.</p>
                 <button disabled className="w-full bg-white/10 backdrop-blur-md text-white py-3 rounded-xl text-xs font-bold opacity-50 cursor-not-allowed">
                    Download Audio
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2" />
           </div>
        </div>
      </div>
    </div>
  );
};
