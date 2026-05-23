import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Zap, 
  Info, 
  Settings2, 
  Keyboard
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SoundPattern {
  name: string;
  notes: number[]; // Frequencies
  color: string;
}

const SOUND_PATTERNS: Record<string, SoundPattern[]> = {
  'Electronic Synth': [
    { name: 'Power Chord', notes: [261.63, 329.63, 392.00, 523.25], color: 'from-blue-500 to-cyan-500' }, // C4, E4, G4, C5
    { name: 'Night Drive Pentatonic', notes: [293.66, 349.23, 392.00, 440.00, 523.25], color: 'from-indigo-500 to-purple-500' }, // D4, F4, G4, A4, C5
    { name: 'Future Bass Hook', notes: [329.63, 440.00, 493.88, 587.33, 659.25], color: 'from-pink-500 to-rose-500' }, // E4, A4, B4, D5, E5
  ],
  'Lo-Fi Chords': [
    { name: 'Cosmic Drift Minor9', notes: [220.00, 261.63, 329.63, 392.00, 493.88], color: 'from-amber-400 to-orange-500' }, // A3, C4, E4, G4, B4
    { name: 'Chill Out Solitude', notes: [261.63, 311.13, 392.00, 466.16], color: 'from-teal-400 to-emerald-500' }, // C4, Eb4, G4, Bb4
    { name: 'Warm Sunset Major7', notes: [349.23, 440.00, 523.25, 587.33], color: 'from-yellow-400 to-pink-500' }, // F4, A4, C5, D5
  ]
};

export const MusicStudioPro = () => {
  const [synthType, setSynthType] = useState<'sawtooth' | 'sine' | 'triangle' | 'square'>('triangle');
  const [bpm, setBpm] = useState(120);
  const [genre, setGenre] = useState('Electronic Synth');
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusText, setStatusText] = useState('Workspace Ready');
  const [selectedNotes, setSelectedNotes] = useState<number[]>([261.63, 329.63, 392.00]); // Default C-major

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const sequencerIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopBeats();
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSingleTone = (frequency: number) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = synthType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth volume envelope to prevent clicking
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.error('Tone synthesis failed:', e);
    }
  };

  const startBeats = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      setIsPlaying(true);
      setStatusText('Looping Sequencer Active');

      let step = 0;
      const stepDuration = 60 / bpm / 2; // Eighth notes

      sequencerIntervalRef.current = setInterval(() => {
        if (!ctx) return;
        
        // Dynamic pitch rotation based on step index for melodic sequences
        const frequencyToPlay = selectedNotes[step % selectedNotes.length];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = synthType;
        osc.frequency.setValueAtTime(frequencyToPlay, ctx.currentTime);

        // Fun arpeggio effects: higher steps produce brief pitch offsets
        if (step % 4 === 2) {
          osc.frequency.setValueAtTime(frequencyToPlay * 1.5, ctx.currentTime + 0.1);
        }

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + stepDuration - 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + stepDuration);

        step++;
      }, stepDuration * 1000);

    } catch (e) {
      console.error('Audio synthesizer launch aborted:', e);
      setStatusText('Engine Error');
    }
  };

  const stopBeats = () => {
    if (sequencerIntervalRef.current) {
      clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
    setIsPlaying(false);
    setStatusText('Workspace Ready');
  };

  const toggleSequencer = () => {
    if (isPlaying) {
      stopBeats();
    } else {
      startBeats();
    }
  };

  const selectPattern = (pattern: SoundPattern) => {
    setSelectedNotes(pattern.notes);
    setStatusText(`Loaded ${pattern.name}`);
    // Play full chord preview once
    pattern.notes.forEach(freq => playSingleTone(freq));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32" id="music-studio-root">
      
      {/* Brand Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-200 dark:shadow-none">
            <Music size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">OFFLINE AUDIO <span className="text-rose-600">PRESETS</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Native Web Audio Synth & Beat Sequencer</p>
          </div>
        </div>

        <button 
          onClick={stopBeats}
          className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-rose-600 transition-colors cursor-pointer"
        >
          Reset Engine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Synth Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 space-y-6">
           <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-rose-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Oscillator Engine</h3>
           </div>

           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Waveform Profile</label>
                 <div className="grid grid-cols-2 gap-2">
                    {(['triangle', 'sine', 'sawtooth', 'square'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSynthType(w)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${synthType === w ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-500/20' : 'bg-transparent border-slate-50 dark:border-slate-800 text-slate-500'}`}
                      >
                        {w}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo Speed (BPM)</label>
                    <span className="text-[11px] font-mono font-black text-rose-500">{bpm}</span>
                 </div>
                 <input 
                   type="range" min={60} max={200} step={5} value={bpm} 
                   onChange={(e) => {
                     setBpm(Number(e.target.value));
                     if (isPlaying) {
                       // Restart playing with new BPM
                       stopBeats();
                       setTimeout(startBeats, 100);
                     }
                   }}
                   className="w-full accent-rose-500"
                 />
              </div>

              <div className="space-y-2 pt-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synthesis Genre</label>
                 <select 
                   value={genre} 
                   onChange={(e) => setGenre(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-850 p-3.5 border-none rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 focus:outline-none"
                 >
                   <option value="Electronic Synth">Electronic Synth</option>
                   <option value="Lo-Fi Chords">Lo-Fi Acoustic / Chill</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Melodic Sequences / Theme presets */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Keyboard size={18} className="text-rose-500" />
                 <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Acoustic Presets</h3>
              </div>
              <span className="text-[8px] font-black bg-rose-50 text-rose-600 dark:bg-rose-950/20 px-2.5 py-1 rounded uppercase tracking-widest">Click to trigger chord</span>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SOUND_PATTERNS[genre]?.map((pat) => (
                <button
                  key={pat.name}
                  onClick={() => selectPattern(pat)}
                  className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border border-transparent hover:border-rose-500/10 rounded-2xl cursor-pointer text-left transition-all active:scale-95 group"
                >
                   <div className="flex items-center justify-between mb-3">
                      <Music className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">{pat.notes.length} notes</span>
                   </div>
                   <h4 className="text-xs font-black text-slate-800 dark:text-white group-hover:text-rose-600 tracking-tight">{pat.name}</h4>
                </button>
              ))}
           </div>

           {/* Audio controls trigger */}
           <div className="bg-slate-900 dark:bg-rose-950/10 rounded-[24px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
              <div className="flex items-center gap-3">
                 <div className={`p-2.5 rounded-xl ${isPlaying ? 'bg-rose-600 animate-spin text-white' : 'bg-white/10 text-slate-300'}`}>
                   <Zap size={16} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">AUDIO SEQUENCER LOOP</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">{statusText}</p>
                 </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <button 
                   onClick={toggleSequencer}
                   className={`w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${isPlaying ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg'}`}
                 >
                   {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                   {isPlaying ? 'PAUSE LOOP' : 'START SEQUENCE'}
                 </button>
              </div>
           </div>

           <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex gap-3 text-[10px] font-medium text-slate-500 leading-relaxed border border-slate-100 dark:border-slate-800">
              <Info size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p>
                 Synthesis occurs fully locally using the HTML5 <span className="font-bold text-slate-700 dark:text-slate-300">Web Audio API</span>. Click the chord triggers to preview notes, choose your custom waveform, and press "START SEQUENCE" to hear the loop!
              </p>
           </div>

        </div>

      </div>

    </div>
  );
};
