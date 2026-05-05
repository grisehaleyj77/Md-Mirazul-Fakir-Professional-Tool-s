import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, Settings2, Languages, User, SlidersHorizontal, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      // Filter unique voices and sort by name
      const sortedVoices = [...availableVoices].sort((a, b) => a.name.localeCompare(b.name));
      setVoices(sortedVoices);
      
      // Default to first English or system voice
      const defaultVoice = sortedVoices.find(v => v.lang.startsWith('en')) || sortedVoices[0];
      if (defaultVoice) setSelectedVoice(defaultVoice.name);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWord('');
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        setCurrentWord(word);
      }
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handlePause = () => {
    synth.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWord('');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Volume2 className="w-8 h-8 text-indigo-600" />
          Text to Speech AI
        </h2>
        <p className="text-neutral-500 text-lg">
          Listen to your text with natural-sounding professional voices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-80 p-8 rounded-[2.5rem] bg-white border-2 border-neutral-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none shadow-sm text-lg leading-relaxed placeholder:text-neutral-300 font-medium"
            />
            {currentWord && isPlaying && (
              <div className="absolute bottom-6 left-8 right-8">
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold shadow-lg animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Speaking: {currentWord}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isPlaying ? (
              <button
                onClick={handleSpeak}
                disabled={!text.trim()}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white font-black text-xl rounded-[2rem] hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                <Play className="w-6 h-6 fill-current" />
                {isPaused ? 'Resume Speech' : 'Play Speech'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-amber-500 text-white font-black text-xl rounded-[2rem] hover:bg-amber-600 transition-all shadow-xl shadow-amber-200 active:scale-95"
              >
                <Pause className="w-6 h-6 fill-current" />
                Pause
              </button>
            )}
            
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="w-20 h-20 flex items-center justify-center bg-neutral-900 text-white rounded-[2rem] hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-xl shadow-neutral-200 active:scale-95"
            >
              <Square className="w-8 h-8 fill-current" />
            </button>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          <div className="bg-neutral-50 rounded-[2.5rem] p-8 border border-neutral-100 space-y-8">
            <div className="flex items-center gap-2 text-sm font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-4">
              <Settings2 className="w-4 h-4" />
              Voice Settings
            </div>

            {/* Voice Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                <User className="w-4 h-4 text-indigo-500" />
                Select Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-neutral-800 appearance-none cursor-pointer"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter italic">
                {voices.length} available voices found on your system
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-8 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    Speed (Rate)
                  </label>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                    <Volume2 className="w-4 h-4 text-indigo-500" />
                    Pitch
                  </label>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{pitch}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex gap-2 p-4 bg-white rounded-2xl border border-neutral-100">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-neutral-400 leading-tight uppercase italic">
                  Voice distinctiveness depends on your operating system's installed speech packs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
