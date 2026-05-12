import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Scissors, 
  Plus, 
  Play, 
  Download, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Clock,
  Mic,
  Waves,
  ChevronRight,
  Settings2,
  Volume2,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface AudioClip {
  file: File;
  previewUrl: string;
  duration: number;
  startTime: number;
  endTime: number;
  id: string;
}

export const AudioEditor = () => {
  const [clips, setClips] = useState<AudioClip[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setFfmpegLoaded(true);
    } catch (err) {
      console.error('Failed to load FFmpeg:', err);
      setError('Audio Processor failed to initialize. Try opening in a New Tab.');
    }
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => {
        const newClip: AudioClip = {
          file,
          previewUrl: url,
          duration: audio.duration,
          startTime: 0,
          endTime: audio.duration,
          id: Math.random().toString(36).substring(7),
        };
        setClips(prev => [...prev, newClip]);
        if (!activeClipId) setActiveClipId(newClip.id);
      };
    });
  };

  const removeClip = (id: string) => {
    setClips(prev => {
      const clip = prev.find(c => c.id === id);
      if (clip) URL.revokeObjectURL(clip.previewUrl);
      return prev.filter(c => c.id !== id);
    });
    if (activeClipId === id) setActiveClipId(null);
  };

  const updateTrim = (id: string, start: number, end: number) => {
    setClips(prev => prev.map(c => 
      c.id === id ? { ...c, startTime: start, endTime: end } : c
    ));
  };

  const processAudio = async () => {
    if (!ffmpegLoaded || clips.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      const inputNames: string[] = [];

      for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        const inputName = `audio_in_${i}.mp3`;
        const trimmedName = `audio_out_${i}.mp3`;
        inputNames.push(trimmedName);

        await ffmpeg.writeFile(inputName, await fetchFile(clip.file));

        // Trim and encode
        await ffmpeg.exec([
          '-ss', clip.startTime.toFixed(2),
          '-to', clip.endTime.toFixed(2),
          '-i', inputName,
          '-acodec', 'libmp3lame',
          '-b:a', '192k',
          trimmedName
        ]);
      }

      let finalOutputName = 'master_audio.mp3';

      if (inputNames.length > 1) {
        const listContent = inputNames.map(name => `file '${name}'`).join('\n');
        await ffmpeg.writeFile('concat_audio.txt', listContent);

        await ffmpeg.exec([
          '-f', 'concat',
          '-safe', '0',
          '-i', 'concat_audio.txt',
          '-c', 'copy',
          finalOutputName
        ]);
      } else {
        finalOutputName = inputNames[0];
      }

      const data = await ffmpeg.readFile(finalOutputName);
      const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'audio/mp3' }));
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Audio_Master_${Date.now()}.mp3`;
      link.click();
      
    } catch (err) {
      console.error(err);
      setError('Audio processing failed. Lengths or formats might be causing issues.');
    } finally {
      setIsProcessing(false);
    }
  };

  const activeClip = clips.find(c => c.id === activeClipId);

  return (
    <div className="space-y-10 pb-32">
      {/* Waveform Header */}
      <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="flex items-end justify-center h-full gap-1">
              {Array.from({ length: 60 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-amber-500 rounded-full animate-pulse" 
                  style={{ 
                    height: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.05}s`
                  }} 
                />
              ))}
           </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-3">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Music className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Audio Studio <span className="text-amber-500 text-5xl">PRO</span></h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 pl-1">Professional Audio Trimming & Sequence Mastering</p>
           </div>

           <button 
             onClick={processAudio}
             disabled={clips.length === 0 || isProcessing || !ffmpegLoaded}
             className={`h-16 px-10 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center gap-4 transition-all
              ${clips.length === 0 || isProcessing || !ffmpegLoaded
                ? 'bg-white/5 text-slate-600 cursor-not-allowed opacity-50' 
                : 'bg-amber-500 text-white hover:bg-amber-400 shadow-xl shadow-amber-500/30 active:scale-95'
              }`}
           >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? `Rendering ${progress}%` : 'Master Audio'}
           </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 p-8 rounded-[32px] flex items-center gap-6"
        >
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="space-y-1">
            <p className="text-red-500 font-black uppercase tracking-widest text-[10px]">Processing Warning</p>
            <p className="text-red-700 dark:text-red-300 font-bold uppercase tracking-tight text-xs">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Clip Library */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-white/5 p-8 rounded-[48px] border border-slate-100 dark:border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Project Assets</h3>
                 <input 
                  type="file" 
                  multiple 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="audio-add" 
                 />
                 <label htmlFor="audio-add" className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20">
                    <Plus className="w-5 h-5" />
                 </label>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                    {clips.map((clip, i) => (
                       <motion.button 
                        key={clip.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setActiveClipId(clip.id)}
                        className={`w-full p-5 rounded-3xl border flex items-center gap-4 transition-all group relative overflow-hidden
                          ${activeClipId === clip.id ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500/30 shadow-md' : 'bg-slate-50 dark:bg-white/5 border-transparent'}
                        `}
                       >
                          <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                             <Mic className={`w-5 h-5 ${activeClipId === clip.id ? 'text-amber-500' : 'text-slate-400'}`} />
                          </div>
                          <div className="flex-1 text-left">
                             <p className="text-[10px] font-black uppercase tracking-tight truncate w-32">{clip.file.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{clip.duration.toFixed(1)}s Runtime</p>
                          </div>
                          
                          {/* Trash Icon on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                              onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}
                              className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </motion.button>
                    ))}
                 </AnimatePresence>

                 {clips.length === 0 && (
                    <div className="py-20 text-center opacity-20 space-y-4">
                       <Waves className="w-12 h-12 mx-auto" />
                       <p className="text-[9px] font-black uppercase tracking-[0.2em]">Drop your tracks here</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Mixer & Timeline */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-900 rounded-[48px] p-10 shadow-2xl space-y-12">
              {activeClip ? (
                 <>
                    <div className="flex items-center justify-between text-white">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Editing Sequence</p>
                          <h3 className="text-xl font-black uppercase tracking-tight">{activeClip.file.name}</h3>
                       </div>
                       <audio 
                        controls 
                        src={activeClip.previewUrl} 
                        className="h-10 opacity-60 hover:opacity-100 transition-opacity"
                       />
                    </div>

                    <div className="space-y-12">
                       {/* Pro Waveform-like Range */}
                       <div className="relative h-24 bg-white/5 rounded-3xl overflow-hidden border border-white/5 flex items-center">
                          <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-20 px-8">
                             {Array.from({ length: 150 }).map((_, i) => (
                                <div key={i} className="w-0.5 bg-white rounded-full" style={{ height: `${10 + Math.random() * 80}%` }} />
                             ))}
                          </div>

                          {/* Selected Region Highlight */}
                          <div 
                            className="absolute bg-amber-500/20 h-full border-x border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                            style={{ 
                              left: `${(activeClip.startTime / activeClip.duration) * 100}%`,
                              width: `${((activeClip.endTime - activeClip.startTime) / activeClip.duration) * 100}%`
                            }}
                          />

                          <input 
                            type="range" 
                            min="0" 
                            max={activeClip.duration} 
                            step="0.01" 
                            value={activeClip.startTime} 
                            onChange={(e) => updateTrim(activeClip.id, Math.min(Number(e.target.value), activeClip.endTime - 0.1), activeClip.endTime)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                          />
                          <input 
                            type="range" 
                            min="0" 
                            max={activeClip.duration} 
                            step="0.01" 
                            value={activeClip.endTime} 
                            onChange={(e) => updateTrim(activeClip.id, activeClip.startTime, Math.max(Number(e.target.value), activeClip.startTime + 0.1))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                          />

                          {/* Thumbs */}
                          <div className="absolute top-0 bottom-0 pointer-events-none z-30" style={{ left: `${(activeClip.startTime / activeClip.duration) * 100}%` }}>
                             <div className="h-full w-0.5 bg-amber-500 relative">
                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-8 bg-amber-500 rounded-full shadow-lg flex items-center justify-center">
                                   <div className="w-0.5 h-3 bg-white/50 rounded-full" />
                                </div>
                             </div>
                          </div>
                          <div className="absolute top-0 bottom-0 pointer-events-none z-30" style={{ left: `${(activeClip.endTime / activeClip.duration) * 100}%` }}>
                             <div className="h-full w-0.5 bg-amber-500 relative">
                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-8 bg-amber-500 rounded-full shadow-lg flex items-center justify-center">
                                   <div className="w-0.5 h-3 bg-white/50 rounded-full" />
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                          <div className="flex items-center gap-8">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">In Point</p>
                                <p className="text-sm font-black text-white">{activeClip.startTime.toFixed(2)}s</p>
                             </div>
                             <div className="w-px h-6 bg-white/10" />
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Out Point</p>
                                <p className="text-sm font-black text-white">{activeClip.endTime.toFixed(2)}s</p>
                             </div>
                             <div className="w-px h-6 bg-white/10" />
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Total Duration</p>
                                <p className="text-sm font-black text-white">{(activeClip.endTime - activeClip.startTime).toFixed(2)}s</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4">
                             <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-3">
                                <Volume2 className="w-4 h-4 text-slate-500" />
                                <div className="w-24 h-1 bg-white/10 rounded-full">
                                   <div className="w-3/4 h-full bg-amber-500 rounded-full" />
                                </div>
                             </div>
                             <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors">
                                <Settings2 className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </>
              ) : (
                 <div className="py-20 text-center space-y-6 opacity-30">
                    <Waves className="w-16 h-16 mx-auto text-slate-500" />
                    <div className="space-y-2">
                       <h3 className="text-lg font-black uppercase tracking-tighter text-white">Mixing Deck Offline</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed uppercase">Select an audio asset from the project library<br/>to begin non-destructive editing.</p>
                    </div>
                 </div>
              )}
           </div>

           {/* Global Pipeline Stat */}
           <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400">
                    <Layers className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-tight">Audio Chain Status</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{clips.length} Sequences loaded for mastering</p>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 {clips.length > 0 ? (
                    <div className="flex -space-x-3">
                       {clips.slice(0, 4).map((_, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">
                             {i+1}
                          </div>
                       ))}
                       {clips.length > 4 && <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">+{clips.length - 4}</div>}
                    </div>
                 ) : (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-50">Empty Chain</p>
                 )}
                 <ChevronRight className="w-4 h-4 text-slate-300 mx-4" />
                 <div className="px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Master Clock</p>
                    <p className="text-xs font-black uppercase tracking-tight">
                       {clips.reduce((acc, c) => acc + (c.endTime - c.startTime), 0).toFixed(1)}s Total
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
