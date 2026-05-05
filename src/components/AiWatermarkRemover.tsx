import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, X, Download, Wand2, Eraser, Move, Sparkles, RefreshCcw, SlidersHorizontal, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function AiWatermarkRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
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
      initCanvases(img);
    };
  };

  const initCanvases = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    // Set canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (ctx) ctx.drawImage(img, 0, 0);
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskCtx.lineJoin = 'round';
      maskCtx.lineCap = 'round';
    }
    setHasMask(false);
  };

  const getMousePos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e, maskCanvasRef.current!);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e, canvas);
    
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)'; // Rose-500 with transparency
    ctx.lineWidth = brushSize;
    
    // Smooth drawing
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    setHasMask(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath(); // Reset path
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    const ctx = maskCanvas?.getContext('2d');
    if (ctx && maskCanvas) {
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHasMask(false);
    }
  };

  // Simple Inpainting logic (Fast Marching lite)
  // This is a simplified version for demonstration, usually Telea is more complex.
  // We'll use a local patch-based filling for small masks.
  const processInpainting = async () => {
    if (!hasMask || !canvasRef.current || !maskCanvasRef.current || !imageRef.current) return;
    setIsProcessing(true);
    
    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 500));

    try {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx || !maskCtx) throw new Error('Context failed');

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      
      // Simple Inpainting: For every masked pixel, find the nearest non-masked pixel
      // This is a very basic replacement but we'll try to make it smarter by searching in a neighborhood
      const pixels = imageData.data;
      const maskPixels = maskData.data;
      const width = imageData.width;
      const height = imageData.height;

      // Create a copy to work on
      const output = new Uint8ClampedArray(pixels);

      // Identify masked areas
      const maskedIndices: number[] = [];
      for (let i = 0; i < maskPixels.length; i += 4) {
        if (maskPixels[i + 3] > 0) {
          maskedIndices.push(i);
        }
      }

      // Simple implementation of Telea-inspired inpainting (Distance-weighted average)
      // For performance, we'll limit the search neighborhood to 20px
      const radius = 10;
      
      for (const i of maskedIndices) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        let r_sum = 0, g_sum = 0, b_sum = 0, weight_sum = 0;
        let foundAny = false;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = (ny * width + nx) * 4;
              if (maskPixels[ni + 3] === 0) {
                const distSq = dx * dx + dy * dy;
                if (distSq === 0) continue;
                
                const weight = 1 / (distSq * distSq); // Inverse distance weighting
                r_sum += pixels[ni] * weight;
                g_sum += pixels[ni + 1] * weight;
                b_sum += pixels[ni + 2] * weight;
                weight_sum += weight;
                foundAny = true;
              }
            }
          }
        }

        if (foundAny) {
          output[i] = r_sum / weight_sum;
          output[i + 1] = g_sum / weight_sum;
          output[i + 2] = b_sum / weight_sum;
        }
      }

      ctx.putImageData(new ImageData(output, width, height), 0, 0);
      clearMask();
    } catch (error) {
      console.error('Inpainting error:', error);
      alert('Failed to remove watermark. Try a smaller selection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `no-watermark-${file?.name || 'image.png'}`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setHasMask(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Eraser className="w-8 h-8 text-rose-500" />
          AI Watermark Remover
        </h2>
        <p className="text-neutral-500 text-lg">
          Smart object removal. Brush over watermarks to erase them instantly.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              isDragging
                ? 'border-rose-500 bg-rose-50/50 scale-[0.98]'
                : 'border-neutral-200 bg-white hover:border-rose-400 hover:bg-neutral-50'
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
            
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[2rem] flex items-center justify-center mb-2 shadow-lg shadow-rose-100/50">
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-neutral-800">
                Drop image with watermark
              </p>
              <p className="text-neutral-500 mt-2 font-medium">
                AI will detect and fill the background
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-8 py-3 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 active:scale-95"
            >
              Choose Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Canvas Area */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative aspect-auto min-h-[400px] bg-neutral-100 rounded-[2.5rem] overflow-hidden border-2 border-neutral-100 shadow-inner flex items-center justify-center cursor-crosshair group touch-none">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain"
                />
                <canvas
                  ref={maskCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-auto"
                  style={{ touchAction: 'none' }}
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-rose-600 font-black text-xl animate-pulse">Removing Object...</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-100">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Brush Size</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="5" 
                                max="100" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="w-32 accent-rose-500 h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs font-bold text-neutral-500 w-8">{brushSize}px</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={clearMask}
                        disabled={!hasMask || isProcessing}
                        className="p-3 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all disabled:opacity-30"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={reset}
                        className="p-3 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded-2xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
              </div>
            </div>

            {/* Controls Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-neutral-900 tracking-tight">How to use</h3>
                    <p className="text-xs text-neutral-500 font-medium tracking-tight">Follow steps for best results</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 border-2 border-rose-500 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-rose-500">1</div>
                    <p className="text-sm text-neutral-600 font-medium">Brush over the watermark area completely.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 border-2 border-rose-500 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-rose-500">2</div>
                    <p className="text-sm text-neutral-600 font-medium">Click "Erase Watermark" to apply AI filling.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 border-2 border-rose-500 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-rose-500">3</div>
                    <p className="text-sm text-neutral-600 font-medium">Wait for HDR processing to finish.</p>
                  </div>
                </div>

                <button
                  onClick={processInpainting}
                  disabled={!hasMask || isProcessing}
                  className="w-full py-4 bg-rose-500 text-white font-black text-xl rounded-3xl hover:bg-rose-600 disabled:opacity-50 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-3 active:scale-95"
                >
                  <Sparkles className="w-6 h-6" />
                  Erase Watermark
                </button>

                <button
                  onClick={downloadResult}
                  disabled={isProcessing}
                  className="w-full py-4 bg-neutral-900 text-white font-black text-xl rounded-3xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 flex items-center justify-center gap-3 active:scale-95"
                >
                  <Download className="w-6 h-6" />
                  Download PNG
                </button>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-rose-500">
                  <MousePointer2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-rose-900">Precision Mode</p>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Adjust the brush size for small logos or text. For best results, brush slightly outside the watermark edges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
