import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, X, Download, Wand2, Type, Move, Layers, Eraser, Sparkles, SlidersHorizontal, Sun, Contrast, Droplets, Palette, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
  blur: number;
}

interface WatermarkState {
  text: string;
  color: string;
  opacity: number;
  size: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
}

export default function ImageWatermarkBeautifier() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    grayscale: 0,
    blur: 0,
  });
  const [watermark, setWatermark] = useState<WatermarkState>({
    text: '',
    color: '#ffffff',
    opacity: 50,
    size: 40,
    position: 'bottom-right',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'watermark'>('filters');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      sepia(${filters.sepia}%) 
      grayscale(${filters.grayscale}%) 
      blur(${filters.blur}px)
    `;

    // Draw main image
    ctx.drawImage(img, 0, 0);

    // Reset filter for watermark
    ctx.filter = 'none';

    // Draw watermark if text exists
    if (watermark.text) {
      ctx.fillStyle = watermark.color;
      ctx.globalAlpha = watermark.opacity / 100;
      const fontSize = (img.width / 1000) * watermark.size;
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      
      const metrics = ctx.measureText(watermark.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      const padding = 40;

      if (watermark.position === 'tile') {
        const stepX = textWidth + padding * 4;
        const stepY = textHeight + padding * 4;
        for (let y = 0; y < canvas.height; y += stepY) {
          for (let x = 0; x < canvas.width; x += stepX) {
            ctx.fillText(watermark.text, x, y);
          }
        }
      } else {
        let x = padding;
        let y = padding + textHeight;

        switch (watermark.position) {
          case 'center':
            x = (canvas.width - textWidth) / 2;
            y = (canvas.height + textHeight) / 2;
            break;
          case 'top-right':
            x = canvas.width - textWidth - padding;
            break;
          case 'bottom-left':
            y = canvas.height - padding;
            break;
          case 'bottom-right':
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
            break;
        }
        ctx.fillText(watermark.text, x, y);
      }
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [filters, watermark]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `enhanced-${file?.name || 'image.png'}`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setIsProcessing(false);
    }, 100);
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      grayscale: 0,
      blur: 0,
    });
  };

  const resetWatermark = () => {
    setWatermark({
      text: '',
      color: '#ffffff',
      opacity: 50,
      size: 40,
      position: 'bottom-right',
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
          <Sparkles className="w-10 h-10 text-amber-500" />
          Photo Beautifier & Watermark
        </h2>
        <p className="text-neutral-500 text-lg font-medium">
          Professional-grade photo enhancement and protection tools.
        </p>
      </div>

      {!file ? (
        <div
          className={`relative w-full border-2 border-dashed rounded-[3rem] p-20 flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/50 scale-[0.98]'
              : 'border-neutral-200 bg-white hover:border-amber-400 hover:bg-neutral-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-amber-100/50">
            <Upload className="w-12 h-12" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black text-neutral-800 tracking-tight">Drop photo to enhance</p>
            <p className="text-neutral-500 font-medium italic">High-definition processing starts locally</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-neutral-900 text-white font-black text-lg rounded-[2rem] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95"
          >
            Select Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Preview Area */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="relative aspect-auto min-h-[400px] max-h-[70vh] bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-neutral-200 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center group">
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
              <button
                onClick={() => setFile(null)}
                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur text-neutral-900 rounded-2xl shadow-xl hover:bg-white transition-all scale-0 group-hover:scale-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadImage}
                disabled={isProcessing}
                className="flex-1 py-5 bg-neutral-900 text-white font-black text-xl rounded-[2rem] hover:bg-neutral-800 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
                Export HD Image
              </button>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="xl:col-span-4 flex flex-col gap-6 bg-white border border-neutral-100 rounded-[3rem] p-8 shadow-sm">
            <div className="flex p-2 bg-neutral-50 rounded-2xl">
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'filters' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Beautifier
              </button>
              <button
                onClick={() => setActiveTab('watermark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'watermark' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Type className="w-4 h-4" />
                Watermark
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'filters' ? (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Global Filters</h3>
                    <button onClick={resetFilters} className="text-xs font-black text-amber-500 hover:text-amber-600 flex items-center gap-1">
                      <Eraser className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: 'Brightness', icon: Sun, key: 'brightness', min: 0, max: 200 },
                      { label: 'Contrast', icon: Contrast, key: 'contrast', min: 0, max: 200 },
                      { label: 'Saturation', icon: Droplets, key: 'saturation', min: 0, max: 200 },
                      { label: 'Sepia', icon: Palette, key: 'sepia', min: 0, max: 100 },
                      { label: 'Grayscale', icon: Ghost, key: 'grayscale', min: 0, max: 100 },
                      { label: 'Blur', icon: Layers, key: 'blur', min: 0, max: 20 },
                    ].map((filter) => (
                      <div key={filter.key} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="flex items-center gap-2 text-xs font-black text-neutral-600 uppercase tracking-tight">
                            <filter.icon className="w-4 h-4 text-amber-500" />
                            {filter.label}
                          </label>
                          <span className="text-[10px] font-black bg-neutral-100 px-2 py-1 rounded text-neutral-500">
                            {filters[filter.key as keyof FilterState]}
                            {filter.key === 'blur' ? 'px' : '%'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={filter.min}
                          max={filter.max}
                          value={filters[filter.key as keyof FilterState]}
                          onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: parseInt(e.target.value) }))}
                          className="w-full accent-neutral-900 h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="watermark"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Watermark Settings</h3>
                    <button onClick={resetWatermark} className="text-xs font-black text-amber-500 hover:text-amber-600 flex items-center gap-1">
                      <Eraser className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-600 uppercase">Text Content</label>
                       <input 
                         type="text"
                         value={watermark.text}
                         onChange={(e) => setWatermark(p => ({ ...p, text: e.target.value }))}
                         placeholder="Enter watermark text..."
                         className="w-full px-4 py-3 bg-neutral-50 border-2 border-transparent focus:border-amber-500 rounded-2xl outline-none font-bold text-sm transition-all"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-600 uppercase text-center block">Color</label>
                        <input 
                          type="color"
                          value={watermark.color}
                          onChange={(e) => setWatermark(p => ({ ...p, color: e.target.value }))}
                          className="w-full h-12 rounded-xl cursor-pointer p-1 bg-white border border-neutral-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-600 uppercase text-center block">Position</label>
                        <select
                          value={watermark.position}
                          onChange={(e) => setWatermark(p => ({ ...p, position: e.target.value as any }))}
                          className="w-full h-12 px-2 bg-neutral-50 rounded-xl font-bold text-xs outline-none"
                        >
                          <option value="center">Center</option>
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="tile">Tile Pattern</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="flex items-center gap-2 text-xs font-black text-neutral-600 uppercase">Opacity</label>
                          <span className="text-[10px] font-black bg-neutral-100 px-2 py-1 rounded text-neutral-500">{watermark.opacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={watermark.opacity}
                          onChange={(e) => setWatermark(p => ({ ...p, opacity: parseInt(e.target.value) }))}
                          className="w-full accent-neutral-900 h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="flex items-center gap-2 text-xs font-black text-neutral-600 uppercase">Size Scale</label>
                          <span className="text-[10px] font-black bg-neutral-100 px-2 py-1 rounded text-neutral-500">{watermark.size}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={watermark.size}
                          onChange={(e) => setWatermark(p => ({ ...p, size: parseInt(e.target.value) }))}
                          className="w-full accent-neutral-900 h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 flex items-start gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
          <Wand2 className="w-7 h-7 text-amber-500" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-black text-amber-900">HD Quality Export</p>
          <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
            Unlike many online tools that compress your files, our engine processes images at their original resolution. Your privacy is our priority: all processing happens <strong>locally in your browser</strong>, so your photos never touch our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
