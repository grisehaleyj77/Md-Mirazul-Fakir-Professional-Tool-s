import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Download, Maximize2, RefreshCw, Trash2, Link, Lock, Unlock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageResizer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalDims, setOriginalDims] = useState({ width: 0, height: 0 });
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(event.target?.result as string);
          setDimensions({ width: img.width, height: img.height });
          setOriginalDims({ width: img.width, height: img.height });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDimensionChange = (type: 'width' | 'height', value: number) => {
    if (lockAspectRatio) {
      const ratio = originalDims.width / originalDims.height;
      if (type === 'width') {
        setDimensions({ width: value, height: Math.round(value / ratio) });
      } else {
        setDimensions({ height: value, width: Math.round(value * ratio) });
      }
    } else {
      setDimensions(prev => ({ ...prev, [type]: value }));
    }
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx?.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      const link = document.createElement('a');
      link.download = `resized-image-${dimensions.width}x${dimensions.height}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsProcessing(false);
    };
    img.src = image;
  };

  const reset = () => {
    setImage(null);
    setDimensions({ width: 0, height: 0 });
    setOriginalDims({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
            <Maximize2 size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Precision Image Resizer</h2>
            <p className="text-xs text-slate-500">Fast, client-side image scaling with aspect control</p>
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
              onClick={handleDownload}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {isProcessing ? 'Processing...' : 'Download Resized'}
            </button>
          </div>
        )}
      </div>

      {!image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <ImageIcon size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Drop an image here</h3>
            <p className="text-sm text-slate-500 font-medium">PNG, JPG, WEBP • Max 10MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10">
            Select Original File
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview Panel */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={image}
                alt="Preview"
                className="max-w-full max-h-[500px] rounded-xl shadow-2xl transition-all"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-center gap-6 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Maximize2 size={12} /> Original: {originalDims.width}px × {originalDims.height}px</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={12} /> Format: PNG</span>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dimensions</label>
                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`p-2 rounded-lg transition-all ${lockAspectRatio ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}
                    title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                  >
                    {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 ml-1">Width (px)</span>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 ml-1">Height (px)</span>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-2 border-t border-slate-50 pt-6">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: 'Full HD', w: 1920, h: 1080 },
                    { l: 'Square', w: 1080, h: 1080 },
                    { l: 'HD', w: 1280, h: 720 },
                    { l: 'Portrait', w: 1080, h: 1350 }
                  ].map((preset) => (
                    <button
                      key={preset.l}
                      onClick={() => {
                        setLockAspectRatio(false);
                        setDimensions({ width: preset.w, height: preset.h });
                      }}
                      className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all"
                    >
                      {preset.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Link size={16} className="text-rose-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">Local Processing</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Your image never leaves your browser. Resizing is performed on your device's hardware for maximum privacy and speed.
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
