import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Video, 
  Scissors, 
  Plus, 
  Play, 
  Download, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Clock,
  Layout,
  Layers,
  ChevronRight,
  Info,
  Maximize2,
  Volume2,
  Settings2,
  Sparkles,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface VideoClip {
  file: File;
  previewUrl: string;
  duration: number;
  startTime: number;
  endTime: number;
  id: string;
}

export const VideoEditor = () => {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [selectedResolution, setSelectedResolution] = useState('720p');

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
      // Enhanced diagnostic message for iframe environments
      setError('FFmpeg initialization failed. This component requires SharedArrayBuffer headers (COOP/COEP). Please try opening the tool in a "New Tab" for full functionality.');
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
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        const newClip: VideoClip = {
          file,
          previewUrl: url,
          duration: video.duration,
          startTime: 0,
          endTime: video.duration,
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

  const processVideo = async () => {
    if (!ffmpegLoaded) return;
    if (clips.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const ffmpeg = ffmpegRef.current;
    
    try {
      const inputNames: string[] = [];

      for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        const inputName = `input${i}.mp4`;
        const trimmedName = `trimmed${i}.mp4`;
        inputNames.push(trimmedName);

        await ffmpeg.writeFile(inputName, await fetchFile(clip.file));

        // Pro Encoding params
        await ffmpeg.exec([
          '-ss', clip.startTime.toFixed(2),
          '-to', clip.endTime.toFixed(2),
          '-i', inputName,
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-c:a', 'aac',
          trimmedName
        ]);
      }

      let finalOutputName = 'output.mp4';

      if (inputNames.length > 1) {
        const listContent = inputNames.map(name => `file '${name}'`).join('\n');
        await ffmpeg.writeFile('concat.txt', listContent);

        await ffmpeg.exec([
          '-f', 'concat',
          '-safe', '0',
          '-i', 'concat.txt',
          '-c', 'copy',
          finalOutputName
        ]);
      } else {
        finalOutputName = inputNames[0];
      }

      const data = await ffmpeg.readFile(finalOutputName);
      const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `MMF_Studio_Pro_${Date.now()}.mp4`;
      link.click();
      
    } catch (err) {
      console.error(err);
      setError('Production build failed. Check clip formats and lengths.');
    } finally {
      setIsProcessing(false);
    }
  };

  const activeClip = clips.find(c => c.id === activeClipId);

  return (
    <div className="flex flex-col space-y-10 pb-32">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
               <Video className="w-6 h-6" />
             </div>
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">Video Studio <span className="text-blue-500 text-4xl">PRO</span></h2>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Professional Non-Linear Editor</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="hidden sm:flex items-center gap-4 px-6 py-4 bg-white/5 rounded-3xl border border-white/5">
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Project Output</p>
                 <select 
                   value={selectedResolution}
                   onChange={(e) => setSelectedResolution(e.target.value)}
                   className="bg-transparent text-xs font-black uppercase tracking-tight focus:outline-none cursor-pointer"
                 >
                    <option value="720p">HD 720p</option>
                    <option value="1080p">Full HD 1080p</option>
                    <option value="480p">SD 480p</option>
                 </select>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700" />
           </div>

           <button 
             onClick={processVideo}
             disabled={clips.length === 0 || isProcessing || !ffmpegLoaded}
             className={`h-16 px-8 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center gap-4 transition-all
              ${clips.length === 0 || isProcessing || !ffmpegLoaded
                ? 'bg-white/5 text-slate-600 cursor-not-allowed opacity-50' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/30 active:scale-95'
              }`}
           >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? `Exporting ${progress}%` : 'Export Cinema'}
           </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/30 p-8 rounded-[32px] flex items-center gap-6"
        >
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-red-500 font-black uppercase tracking-widest text-[10px]">Critical Engine Error</p>
            <p className="text-red-700 dark:text-red-300 font-bold uppercase tracking-tight text-xs">{error}</p>
          </div>
          <button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="px-6 h-12 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors"
          >
            Open in New Tab
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Source Assets & Explorer */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-white/5 p-8 rounded-[48px] border border-slate-100 dark:border-white/5 h-full space-y-8 flex flex-col">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Media Assets</h3>
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">Project Library</p>
                 </div>
                 <input 
                  type="file" 
                  multiple 
                  accept="video/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="media-add" 
                 />
                 <label htmlFor="media-add" className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                    <Plus className="w-5 h-5" />
                 </label>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                    {clips.map((clip, i) => (
                       <motion.button 
                        key={clip.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setActiveClipId(clip.id)}
                        className={`w-full p-4 rounded-3xl border flex items-center gap-4 transition-all group relative overflow-hidden
                          ${activeClipId === clip.id ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500/30' : 'bg-slate-50 dark:bg-white/5 border-transparent'}
                        `}
                       >
                          <div className="flex-shrink-0 w-16 aspect-video bg-black rounded-lg overflow-hidden border border-white/5">
                             <video src={clip.previewUrl} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                             <p className="text-[10px] font-black uppercase tracking-tight truncate w-32">{clip.file.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{clip.duration.toFixed(1)}s Runtime</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 dark:text-white/20">0{i+1}</span>
                          
                          {/* Hover Action */}
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                              onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}
                              className="p-3 bg-red-500 text-white rounded-2xl shadow-lg"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </motion.button>
                    ))}
                 </AnimatePresence>

                 {clips.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 opacity-20 space-y-4">
                       <Layers className="w-12 h-12" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-center leading-relaxed">No footage found.<br/>Drag & drop assets to begin.</p>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                 <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-500 rounded-xl">
                          <Clock className="w-4 h-4" />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Timeline Length</p>
                          <p className="text-xs font-black uppercase">
                            {clips.reduce((acc, c) => acc + (c.endTime - c.startTime), 0).toFixed(1)}s
                          </p>
                       </div>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                 </div>
              </div>
           </div>
        </div>

        {/* Playback & Advanced Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* Preview Monitor */}
           <div className="bg-slate-900 rounded-[48px] p-8 aspect-video relative group overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute inset-0 flex items-center justify-center">
                 {activeClip ? (
                    <video 
                       ref={el => videoRefs.current[activeClip.id] = el}
                       src={activeClip.previewUrl} 
                       className="h-full w-full object-contain"
                       controls
                    />
                 ) : (
                    <div className="text-center space-y-4 opacity-10">
                       <Video className="w-24 h-24 mx-auto text-white" />
                       <p className="text-xs font-black text-white uppercase tracking-[0.4em]">Monitor Offline</p>
                    </div>
                 )}
              </div>
              
              {/* Overlay HUD */}
              <div className="absolute top-8 left-8 flex items-center gap-3 pointer-events-none">
                 <div className="px-3 py-1 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest">Live</div>
                 {activeClip && <p className="text-[9px] font-bold text-white uppercase tracking-widest opacity-50 bg-black/40 px-3 py-1 rounded-full">{activeClip.file.name}</p>}
              </div>

              <div className="absolute bottom-8 right-8 flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                    <Maximize2 className="w-4 h-4" />
                 </div>
                 <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                    <Settings2 className="w-4 h-4" />
                 </div>
              </div>
           </div>

           {/* Precision Timeline Tools */}
           <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl text-blue-600">
                       <Scissors className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                       <h4 className="text-xs font-black uppercase tracking-widest">Precision Trim</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Frame-by-frame adjustments</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="px-4 h-10 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                       <p>Start: <span className="text-blue-600">{activeClip?.startTime.toFixed(2)}s</span></p>
                       <div className="w-px h-3 bg-slate-300 dark:bg-white/10" />
                       <p>End: <span className="text-blue-600">{activeClip?.endTime.toFixed(2)}s</span></p>
                    </div>
                 </div>
              </div>

              {activeClip ? (
                 <div className="space-y-10">
                    <div className="relative h-20 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden flex items-center">
                       {/* Timeline Marker visualization */}
                       {Array.from({ length: 40 }).map((_, i) => (
                          <div 
                            key={i} 
                            style={{ left: `${(i / 40) * 100}%` }}
                            className={`absolute w-px bg-slate-300 dark:bg-white/10 ${i % 5 === 0 ? 'h-4' : 'h-2'}`}
                          />
                       ))}

                       <div 
                        className="absolute bg-blue-600 h-full opacity-10 border-x border-blue-500/50"
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
                       
                       {/* Custom range thumb visualizations */}
                       <div 
                        className="absolute top-0 bottom-0 w-1.5 bg-blue-600 z-30 flex flex-col justify-center gap-1 shadow-lg"
                        style={{ left: `${(activeClip.startTime / activeClip.duration) * 100}%` }}
                       >
                          <div className="w-1 h-3 bg-white/50 mx-auto rounded-full" />
                       </div>
                       <div 
                        className="absolute top-0 bottom-0 w-1.5 bg-blue-600 z-30 flex flex-col justify-center gap-1 shadow-lg"
                        style={{ left: `${(activeClip.endTime / activeClip.duration) * 100}%` }}
                       >
                          <div className="w-1 h-3 bg-white/50 mx-auto rounded-full" />
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6 justify-center">
                       <button className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                          <Settings2 className="w-5 h-5" />
                       </button>
                       <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Slide borders to set in/out points for <span className="text-blue-600">{activeClip.file.name}</span>
                       </p>
                    </div>
                 </div>
              ) : (
                 <div className="h-40 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 text-slate-300">
                    <GripVertical className="w-8 h-8 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Select source to enable timeline</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Render Queue Panel */}
      <div className="bg-slate-900 mx-8 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/30" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white relative z-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-blue-500">
                  <Play className="w-8 h-8 fill-current" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Production <span className="text-blue-500">Pipeline</span></h3>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">All selected sequences will be merged sequentially</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               {clips.length > 0 ? (
                  <div className="flex -space-x-3">
                    {clips.slice(0, 5).map((c, i) => (
                       <div key={i} className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black overflow-hidden">
                          <video src={c.previewUrl} className="w-full h-full object-cover opacity-60" />
                       </div>
                    ))}
                    {clips.length > 5 && <div className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black">+{clips.length - 5}</div>}
                  </div>
               ) : (
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline is empty</p>
               )}
               <ChevronRight className="w-4 h-4 text-slate-700 mx-4" />
               <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Codec</p>
                  <p className="text-[11px] font-black uppercase">H.264 High Profile</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
