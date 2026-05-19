import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Video, 
  Download, 
  Loader2, 
  AlertCircle,
  FileAudio,
  Settings,
  Plus,
  Trash2,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const VideoToAudio = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('192k');
  const ffmpegRef = useRef(new FFmpeg());

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
      setError('FFmpeg initialization failed. Please try opening this tool in a New Tab.');
    }
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setError(null);
    }
  };

  const convertToAudio = async () => {
    if (!file || !ffmpegLoaded) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const ffmpeg = ffmpegRef.current;

    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      const inputName = 'input_video';
      const outputName = `output.${selectedFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Audio Extraction Command
      await ffmpeg.exec([
        '-i', inputName,
        '-vn', // No video
        '-acodec', selectedFormat === 'mp3' ? 'libmp3lame' : selectedFormat === 'wav' ? 'pcm_s16le' : 'aac',
        '-b:a', bitrate,
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: `audio/${selectedFormat}` }));
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.split('.')[0]}_audio.${selectedFormat}`;
      link.click();
      
    } catch (err) {
      console.error(err);
      setError('Conversion failed. The video format might not be supported or memory limit reached.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Header Hook */}
      <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 rotate-3">
                    <Music className="w-6 h-6" />
                 </div>
                 <h2 className="text-4xl font-black italic tracking-tighter uppercase">MP4 <span className="text-purple-400">to MP3</span></h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Professional Video to High-Fidelity Audio extractions</p>
           </div>
           
           {!ffmpegLoaded && (
             <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engine Booting...</p>
             </div>
           )}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 p-8 rounded-[32px] flex items-center gap-6"
        >
          <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
          <p className="text-xs font-black uppercase tracking-tight text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input & Selection */}
        <div className="lg:col-span-12">
           <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-12 rounded-[56px] shadow-sm flex flex-col items-center gap-10">
              {!file ? (
                 <div className="w-full">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      id="video-audio-upload" 
                    />
                    <label 
                      htmlFor="video-audio-upload" 
                      className="group cursor-pointer block text-center space-y-6 p-16 border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[48px] hover:border-purple-500 transition-all"
                    >
                       <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[36px] flex items-center justify-center mx-auto group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
                          <Plus className="w-10 h-10" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-lg font-black uppercase italic tracking-tighter">Select Source <span className="text-purple-600">Video</span></h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Extract crystal clear audio from any video file.<br/>Supports MP4, MOV, AVI, MKV.</p>
                       </div>
                    </label>
                 </div>
              ) : (
                 <div className="w-full space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       {/* File Card */}
                       <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
                          <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 translate-x-4 -translate-y-4">
                             <Video className="w-32 h-32" />
                          </div>
                          <div className="space-y-4 relative z-10">
                             <div className="flex items-center gap-4">
                                <FileAudio className="w-10 h-10 text-purple-400" />
                                <div>
                                   <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">Source Asset</p>
                                   <p className="text-sm font-black uppercase tracking-tight truncate w-48">{file.name}</p>
                                </div>
                             </div>
                             <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setFile(null)} 
                            className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                             Unload Asset
                          </button>
                       </div>

                       {/* Options Card */}
                       <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[40px] border border-slate-100 dark:border-white/5 space-y-10">
                          <div className="flex items-center gap-4">
                             <Settings className="w-6 h-6 text-slate-400" />
                             <h3 className="text-xs font-black uppercase tracking-widest">Extraction Profile</h3>
                          </div>

                          <div className="space-y-8">
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Export Format</label>
                                <div className="grid grid-cols-3 gap-3">
                                   {['mp3', 'wav', 'aac'].map(f => (
                                      <button 
                                        key={f}
                                        onClick={() => setSelectedFormat(f)}
                                        className={`h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                          selectedFormat === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white dark:bg-white/5 text-slate-400 hover:bg-slate-100'
                                        }`}
                                      >
                                         {f}
                                      </button>
                                   ))}
                                </div>
                             </div>

                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Audio Quality (Bitrate)</label>
                                <div className="grid grid-cols-3 gap-3">
                                   {['128k', '192k', '320k'].map(b => (
                                      <button 
                                        key={b}
                                        onClick={() => setBitrate(b)}
                                        className={`h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                          bitrate === b ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white dark:bg-white/5 text-slate-400 hover:bg-slate-100'
                                        }`}
                                      >
                                         {b}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                       <button 
                         disabled={isProcessing || !ffmpegLoaded}
                         onClick={convertToAudio}
                         className={`w-full max-w-sm h-20 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl
                            ${isProcessing || !ffmpegLoaded 
                              ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed' 
                              : 'bg-purple-600 text-white hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-purple-600/20'
                            }`}
                       >
                          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                          {isProcessing ? `Extracting ${progress}%` : 'Extract Master Audio'}
                       </button>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing happens locally on your device for maximum privacy</p>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
               <ChevronRight className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Lossless Extraction</h4>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
               Choose <span className="text-purple-600">WAV</span> for maximum quality if you intend to use the audio for further production. Use <span className="text-purple-600">320k MP3</span> for high-quality listening.
            </p>
         </div>
         <div className="bg-white dark:bg-white/5 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 space-y-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
               <Download className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Batch Ready</h4>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">
               Our engine handles large 4K files with ease. For best results with videos longer than 30 minutes, ensure your browser has at least 4GB of available RAM.
            </p>
         </div>
      </div>
    </div>
  );
};
