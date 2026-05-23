import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Play, Pause, RotateCcw, Settings2, Loader2, Music, Sparkles } from 'lucide-react';

export const TTSAI = () => {
  const [text, setText] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoiceName) {
          // Default to an English voice if available, otherwise first
          const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceName]);

  const speakText = () => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Stop currently running synthesis
    window.speechSynthesis.cancel();

    setIsSynthesizing(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    const activeVoice = voices.find(v => v.name === selectedVoiceName);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsSynthesizing(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsSynthesizing(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8" id="voice-converter-root">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--ink)]">
                <Mic className="w-5 h-5 text-purple-500" />
                Text to Voice Speech Synthesizer
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[var(--line)] px-2 py-1 rounded">Offline Native Engine</span>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to high-fidelity spoken audio..."
              className="w-full h-80 bg-[var(--bg)]/50 border border-transparent rounded-2xl p-6 focus:bg-[var(--bg)] focus:border-purple-200 outline-none transition-all text-lg resize-none text-[var(--ink)]"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={speakText}
                disabled={isSynthesizing || !text}
                className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                {isSynthesizing ? 'Preparing Voice...' : 'Convert & Speak Text'}
              </button>
              {isPlaying && (
                <button
                  onClick={stopSpeaking}
                  className="p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 animate-pulse"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => { setText(''); stopSpeaking(); }}
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
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Language & Accent Voice</label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-xs text-indigo-600 font-bold focus:outline-none"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase">Pitch tone modifier</label>
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
                  <label className="block text-xs font-bold text-gray-400 uppercase">Speech Speed rate</label>
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
              <h4 className="font-bold mb-2">Instant Playback</h4>
              <p className="text-purple-300 text-xs leading-relaxed">
                Uses your browser's highly-optimized offline Speech Synthesis engine for flawless and unlimited real-time dictation.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};
