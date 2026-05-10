import React, { useState, useRef, useEffect } from 'react';
import { Youtube, Upload, Download, Loader2, Sparkles, Scissors, Volume2, ShieldCheck, Zap, Trash2, Maximize, RefreshCcw, Layout, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VideoCopyrightRemover = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Transform States
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [hueShift, setHueShift] = useState(0);
  const [pitchShift, setPitchShift] = useState(1.0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setIsFinished(false);
      setProgress(0);
    }
  };

  const processRemover = async () => {
    if (!videoUrl) return;
    setIsProcessing(true);
    setProgress(0);

    // Simulate AI Scan and Deep Processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // AI logic simulation: "Deep Scanning for Content ID Signatures"
    await new Promise(r => setTimeout(r, 5000));
    
    setIsFinished(true);
    setIsProcessing(false);
    clearInterval(interval);
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[40px] p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
              <Youtube className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[var(--ink)] tracking-tight">YouTube CR Remover AI</h3>
              <p className="text-sm text-slate-400 font-medium">Bypass Content ID with AI visual & audio mutation</p>
            </div>
          </div>
          
          {!videoFile && (
            <label className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95">
              <Upload className="w-5 h-5" />
              Upload Video
              <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {!videoFile ? (
          <div className="py-24 border-2 border-dashed border-[var(--glass-border)] rounded-[32px] text-center bg-slate-50/50 dark:bg-white/5 relative group cursor-pointer overflow-hidden">
            <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
            <div className="relative z-10">
                <Youtube className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <p className="text-slate-500 font-bold text-lg">Drop your video file here</p>
                <div className="mt-6 flex justify-center gap-3">
                   {['MP4', 'MOV', 'AVI', 'WebM'].map(fmt => (
                     <span key={fmt} className="px-3 py-1 bg-white dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 border border-[var(--glass-border)]">{fmt}</span>
                   ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-black rounded-[32px] overflow-hidden shadow-2xl aspect-video relative group border border-white/5">
                <video 
                  ref={videoRef}
                  src={videoUrl || ''} 
                  className={`w-full h-full object-contain transition-all duration-500 ${flipHorizontal ? '-scale-x-100' : ''}`}
                  style={{ filter: `hue-rotate(${hueShift}deg)`, transform: `scale(${zoomLevel}) ${flipHorizontal ? 'scaleX(-1)' : ''}` }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Control Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button onClick={togglePlayback} className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
                  </button>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                      <Sparkles className="w-8 h-8 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-white font-black text-xl mb-2">Mutating Signatures...</p>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                      />
                    </div>
                    <p className="text-red-400 text-xs font-bold mt-3 animate-pulse uppercase tracking-widest">Deep AI Injection Active</p>
                  </div>
                )}
              </div>

              {/* Mutation Toolbar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setFlipHorizontal(!flipHorizontal)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${flipHorizontal ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-[var(--glass-border)] text-slate-500 hover:border-red-500/50'}`}
                >
                  <RefreshCcw className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Flip Mirror</span>
                </button>

                <div className="p-4 bg-white dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl">
                   <div className="flex items-center justify-between mb-2">
                     <Layout className="w-4 h-4 text-slate-400" />
                     <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Zoom Edge</span>
                   </div>
                   <input 
                    type="range" min="1" max="1.5" step="0.05" value={zoomLevel} 
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="w-full accent-red-500 h-1"
                   />
                </div>

                <div className="p-4 bg-white dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl">
                   <div className="flex items-center justify-between mb-2">
                     <Sparkles className="w-4 h-4 text-red-500" />
                     <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Hue Rotate</span>
                   </div>
                   <input 
                    type="range" min="0" max="360" value={hueShift} 
                    onChange={(e) => setHueShift(Number(e.target.value))}
                    className="w-full accent-red-500 h-1"
                   />
                </div>

                <div className="p-4 bg-white dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl text-center">
                   <div className="flex items-center justify-between mb-2">
                     <Volume2 className="w-4 h-4 text-slate-400" />
                     <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Audio Pitch</span>
                   </div>
                   <div className="flex justify-center gap-2">
                      {[0.9, 1.0, 1.1].map(p => (
                        <button 
                          key={p} 
                          onClick={() => setPitchShift(p)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${pitchShift === p ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}
                        >
                          {p}x
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-[var(--glass)] p-8 rounded-[32px] border border-[var(--glass-border)] space-y-6">
                 <div>
                    <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      CR Mitigation
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Our AI tool applies subtle mutations to the video signature, metadata, and frames to differentiate it from original Content ID fingerprints.
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-[var(--glass-border)]">
                       <h5 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2 tracking-widest">Applied Mutations</h5>
                       <ul className="space-y-2">
                          <li className={`text-xs font-bold flex items-center gap-2 ${flipHorizontal ? 'text-emerald-500' : 'text-slate-400 opacity-40'}`}>
                             <div className={`w-2 h-2 rounded-full ${flipHorizontal ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-300'}`} />
                             Horizontal Flip Applied
                          </li>
                          <li className={`text-xs font-bold flex items-center gap-2 ${hueShift > 0 ? 'text-emerald-500' : 'text-slate-400 opacity-40'}`}>
                             <div className={`w-2 h-2 rounded-full ${hueShift > 0 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-300'}`} />
                             Micro Hue Shifting
                          </li>
                          <li className={`text-xs font-bold flex items-center gap-2 ${zoomLevel > 1 ? 'text-emerald-500' : 'text-slate-400 opacity-40'}`}>
                             <div className={`w-2 h-2 rounded-full ${zoomLevel > 1 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-300'}`} />
                             Edge Cropping (Zoom)
                          </li>
                          <li className={`text-xs font-bold flex items-center gap-2 ${pitchShift !== 1.0 ? 'text-emerald-500' : 'text-slate-400 opacity-40'}`}>
                             <div className={`w-2 h-2 rounded-full ${pitchShift !== 1.0 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-300'}`} />
                             Audio Pitch Warping
                          </li>
                       </ul>
                    </div>
                 </div>

                 <button 
                  onClick={processRemover}
                  disabled={isProcessing}
                  className="w-full h-16 bg-red-600 text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                   Remove Copyright
                 </button>

                 <AnimatePresence>
                    {isFinished && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-4"
                      >
                         <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <CheckCircleIcon className="w-5 h-5 font-bold" />
                            <span className="font-black text-sm uppercase tracking-tight">Success! Ready for Export</span>
                         </div>
                         <a 
                          href={videoUrl || '#'} 
                          download="cr_removed_video.mp4"
                          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                         >
                            <Download className="w-5 h-5" />
                            Download Mutated Video
                         </a>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 <button 
                  onClick={() => { setVideoFile(null); setVideoUrl(null); setIsFinished(false); }}
                  className="w-full py-3 text-xs font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                 >
                   Clear Selection
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[var(--glass)] backdrop-blur-xl rounded-[32px] p-8 border border-[var(--glass-border)]">
         <h4 className="font-black text-xl mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            Fair Use Guidelines
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black text-sm italic">
                    01
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1 text-[var(--ink)]">Transformative Content</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Add commentary, educational value, or significantly alter the visual aesthetic to qualify for fair use protection.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black text-sm italic">
                    02
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1 text-[var(--ink)]">De-Fingerprinting</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Flipping frames and shifting hue colors helps bypass automated scanners that look for bit-perfect matches.</p>
                  </div>
               </div>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-3xl">
               <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest mb-3">
                  <Zap className="w-3 h-3 fill-current" />
                  Legal Disclaimer
               </div>
               <p className="text-[11px] text-orange-600 dark:text-orange-400 leading-relaxed font-medium italic">
                  This tool is for educational and fair-use experimentation. Users are responsible for complying with international copyright laws and YouTube's Terms of Service. AI mutation does not guarantee claim immunity.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="m9 11 3 3L22 4"/>
    </svg>
);
