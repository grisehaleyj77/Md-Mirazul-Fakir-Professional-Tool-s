import React, { useState, useRef, useEffect } from 'react';
import { Layers, Type, Download, Image as ImageIcon, Loader2, Move, Trash2, Sliders, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { removeBackground } from '@imgly/background-removal';

interface TextLayer {
  text: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  fontFamily: string;
}

export const PictureMagicLayers = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textLayer, setTextLayer] = useState<TextLayer>({
    text: 'MAGIC',
    fontSize: 120,
    color: '#ffffff',
    x: 50,
    y: 50,
    fontFamily: 'Inter'
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'position'>('text');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        processImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setSegmentedImage(url);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to process image. Make sure it has a clear subject.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTextLayer(prev => ({ ...prev, x, y }));
    }
  };

  const fonts = ['Inter', 'Space Grotesk', 'Outfit', 'Playfair Display', 'JetBrains Mono'];

  const downloadResult = () => {
    if (!originalImage || !segmentedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgBottom = new Image();
    const imgTop = new Image();

    imgBottom.onload = () => {
      canvas.width = imgBottom.width;
      canvas.height = imgBottom.height;

      if (!ctx) return;

      // Draw bottom layer
      ctx.drawImage(imgBottom, 0, 0);

      // Draw text
      const pixelX = (textLayer.x / 100) * canvas.width;
      const pixelY = (textLayer.y / 100) * canvas.height;
      const pixelSize = (textLayer.fontSize / 1000) * canvas.width;

      ctx.font = `black ${pixelSize}px ${textLayer.fontFamily}`;
      ctx.fillStyle = textLayer.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textLayer.text, pixelX, pixelY);

      // Draw top layer
      imgTop.onload = () => {
        ctx.drawImage(imgTop, 0, 0);
        const link = document.createElement('a');
        link.download = 'magic-layers.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      imgTop.src = segmentedImage;
    };
    imgBottom.src = originalImage;
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Layers className="w-8 h-8 text-blue-600" />
                Magic Layers
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Text Behind Subject AI</p>
            </div>
            {originalImage && !isProcessing && (
              <button 
                onClick={downloadResult}
                className="bg-black text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>

          {!originalImage ? (
            <label className="block aspect-[4/3] bg-white border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-blue-400 transition-all group overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black mb-2">Select Portrait Image</h3>
              <p className="text-gray-400 text-sm font-medium">Upload a photo with a clear subject to place text behind them.</p>
            </label>
          ) : (
            <div 
              ref={containerRef}
              className="relative aspect-auto bg-gray-50 rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 cursor-move"
              onMouseMove={handleMouseMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* Layer 1: Background Image */}
              <img src={originalImage} className="w-full h-auto" alt="Original" />

              {/* Layer 2: Text */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                  left: `${textLayer.x}%`,
                  top: `${textLayer.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span 
                  style={{ 
                    fontSize: `${textLayer.fontSize}px`, 
                    color: textLayer.color,
                    fontFamily: textLayer.fontFamily,
                    fontWeight: 900,
                    whiteSpace: 'nowrap',
                    textShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                >
                  {textLayer.text}
                </span>
              </div>

              {/* Layer 3: Segmented Subject */}
              {segmentedImage && (
                <img 
                  src={segmentedImage} 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  alt="Segmented" 
                />
              )}

              {/* Loading Overlay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-black text-gray-800 mt-6 tracking-widest uppercase">Segmenting Subject...</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">AI is identifying foreground layers</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subject Indicator */}
              {segmentedImage && !isProcessing && (
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-blue-600/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-fade-in shadow-xl">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                   Subject Isolated
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl">
              {(['text', 'style', 'position'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === 'text' && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                   <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Display Text</label>
                    <input 
                      type="text" 
                      value={textLayer.text}
                      onChange={(e) => setTextLayer(prev => ({ ...prev, text: e.target.value.toUpperCase() }))}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-black text-lg outline-none focus:ring-4 focus:ring-blue-50 transition-all uppercase"
                      placeholder="ENTER TEXT"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Font Family</label>
                    <div className="grid grid-cols-1 gap-2">
                       {fonts.map(font => (
                         <button
                           key={font}
                           onClick={() => setTextLayer(prev => ({ ...prev, fontFamily: font }))}
                           className={`p-3 rounded-2xl text-left font-bold text-sm border-2 transition-all ${textLayer.fontFamily === font ? 'border-blue-500 bg-blue-50/30' : 'border-gray-50 hover:border-gray-100'}`}
                           style={{ fontFamily: font }}
                         >
                           {font}
                         </button>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'style' && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Font Size</label>
                      <span className="text-xs font-black text-blue-600">{textLayer.fontSize}px</span>
                    </div>
                    <input 
                      type="range" min="20" max="600" value={textLayer.fontSize}
                      onChange={(e) => setTextLayer(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block ml-2">Quick Colors</label>
                    <div className="grid grid-cols-5 gap-3">
                      {['#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#06b6d4'].map(c => (
                        <button
                          key={c}
                          onClick={() => setTextLayer(prev => ({ ...prev, color: c }))}
                          className={`aspect-square rounded-full border-2 transition-transform active:scale-90 ${textLayer.color === c ? 'border-blue-600 scale-110' : 'border-white shadow-sm'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'position' && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                    Tip: You can drag the text directly on the image to position it precisely.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">X Axis</label>
                       <input 
                        type="range" min="0" max="100" value={textLayer.x}
                        onChange={(e) => setTextLayer(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">Y Axis</label>
                       <input 
                        type="range" min="0" max="100" value={textLayer.y}
                        onChange={(e) => setTextLayer(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setTextLayer(prev => ({ ...prev, x: 50, y: 50 }))}
                    className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    Reset Position
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-[32px] text-white overflow-hidden relative shadow-2xl shadow-blue-600/20">
             <div className="relative z-10">
                <Sparkles className="w-5 h-5 mb-4 text-blue-200" />
                <h4 className="text-sm font-black mb-1">PRO TIP</h4>
                <p className="text-[10px] font-bold text-blue-100 leading-relaxed uppercase tracking-tighter opacity-80">
                  Best results are achieved with portraits having high contrast between the subject and background.
                </p>
             </div>
             <div className="absolute -bottom-6 -right-6 opacity-10">
                <Layers className="w-32 h-32" />
             </div>
          </div>

          <button 
            onClick={() => {
              setOriginalImage(null);
              setSegmentedImage(null);
            }}
            className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
