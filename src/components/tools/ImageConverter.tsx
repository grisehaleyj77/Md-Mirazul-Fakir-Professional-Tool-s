import React, { useState, useRef } from 'react';
import { ImageIcon, Download, RefreshCw, Trash2, Settings, Loader2, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export const ImageConverter = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/png');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.split('.')[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const extension = targetFormat.split('/')[1];
      const link = document.createElement('a');
      link.download = `${fileName}-converted.${extension}`;
      link.href = canvas.toDataURL(targetFormat, quality);
      link.click();
      
      setTimeout(() => setIsProcessing(false), 500);
    };
    img.src = image;
  };

  const reset = () => {
    setImage(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <RefreshCw size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Universal Image Converter</h2>
            <p className="text-xs text-slate-500">Convert between PNG, JPG, WebP, and AVIF instantly</p>
          </div>
        </div>
        
        {image && (
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {isProcessing ? 'Processing...' : 'Download Result'}
            </button>
          </div>
        )}
      </div>

      {!image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <ImageIcon size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Drop your original image</h3>
            <p className="text-sm text-slate-500 font-medium">Any format supported by your browser</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10">
            Open File
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Preview */}
          <div className="bg-slate-50 p-4 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
             <div className="text-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source Preview</span>
             </div>
             <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={image}
                alt="Source"
                className="max-h-[300px] rounded-xl shadow-2xl border-4 border-white"
             />
          </div>

          {/* Conversion Settings */}
          <div className="space-y-6 flex flex-col justify-center">
             <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings size={18} className="text-slate-400" />
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Output Configuration</label>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-400 ml-1 uppercase">Target Format</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'PNG', value: 'image/png' },
                        { label: 'JPG', value: 'image/jpeg' },
                        { label: 'WebP', value: 'image/webp' },
                        { label: 'AVIF', value: 'image/avif' }
                      ].map((fmt) => (
                        <button
                          key={fmt.value}
                          onClick={() => setTargetFormat(fmt.value as ImageFormat)}
                          className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${targetFormat === fmt.value ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {targetFormat !== 'image/png' && (
                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between items-center px-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase">Quality: <span className="text-blue-600 font-black">{Math.round(quality * 100)}%</span></p>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button
                    onClick={handleConvert}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    Convert & Download
                    <ArrowRightCircle size={20} />
                  </button>
                </div>
             </div>

             <div className="p-4 bg-blue-50/50 rounded-2xl flex items-start gap-3">
               <div className="p-1.5 bg-white rounded-lg shadow-sm font-bold text-blue-600 text-[10px]">AI</div>
               <div>
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-0.5">Privacy First</p>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                   This conversion happens locally in your browser. Your images are never uploaded to any server.
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
