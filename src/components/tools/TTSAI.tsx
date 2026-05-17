import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Play, Pause, RotateCcw, Download, Settings2, Loader2, Music, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { GEMINI_API_KEY, ai } from '../../lib/gemini';

export const TTSAI = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const generateSpeech = async () => {
    if (!text || !GEMINI_API_KEY) return;
    
    setIsSynthesizing(true);
    try {
      const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say with pace ${rate} and pitch ${pitch}: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          }
        }
      });

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || "audio/mp3";

      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Speech synthesis failed:', error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `TTS_AI_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                   onClick={generateSpeech}
                   disabled={isSynthesizing || !text}
                   className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                 >
                   {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 shadow-inner" />}
                   {isSynthesizing ? 'Synthesizing...' : 'Generate AI Voice'}
                 </button>
                 {audioUrl && (
                    <button
                      onClick={() => {
                        const audio = new Audio(audioUrl);
                        audio.onplay = () => setIsPlaying(true);
                        audio.onended = () => setIsPlaying(false);
                        audio.play();
                      }}
                      className="p-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                 )}
                 <button
                   onClick={() => { setText(''); setAudioUrl(null); }}
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
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">AI Engine Output</label>
                    <div className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-sm flex items-center gap-2 text-indigo-500 font-bold">
                       <Sparkles className="w-4 h-4" />
                       Speech Pro v1.0
                    </div>
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
                 <h4 className="font-bold mb-2">Save as MP3</h4>
                 <p className="text-purple-300 text-xs leading-relaxed mb-6">High-quality professional audio ready for your workspace.</p>
                 <button 
                   onClick={handleDownload}
                   disabled={!audioUrl}
                   className="w-full bg-white/10 backdrop-blur-md text-white py-3 rounded-xl text-xs font-bold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
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
