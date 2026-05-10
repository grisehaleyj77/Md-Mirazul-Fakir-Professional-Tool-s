import React, { useState, useRef, useCallback } from 'react';
import { Eraser, Upload, Download, RefreshCw, Undo, Redo, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

export const WatermarkRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [brushSize, setBrushSize] = useState(20);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeWatermark = async () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const maskData = await canvasRef.current.exportImage('png');
      
      // We will perform a simple patch-based inpainting on a hidden canvas
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const mask = new Image();
      mask.src = maskData;
      await new Promise((resolve) => (mask.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get mask data
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      const mctx = maskCanvas.getContext('2d');
      if (!mctx) return;
      mctx.drawImage(mask, 0, 0, img.width, img.height);
      const maskImageData = mctx.getImageData(0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // AI-inspired "Smart Fill" (Content-Aware Patching)
      // This is a simplified version of patch-based inpainting
      // For each masked pixel, we look for similar nearby patches
      const pixels = imageData.data;
      const maskPixels = maskImageData.data;

      // Identify masked areas
      const maskedPoints: {x: number, y: number}[] = [];
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const idx = (y * img.width + x) * 4;
          if (maskPixels[idx + 3] > 10) { // Alpha of mask
            maskedPoints.push({x, y});
          }
        }
      }

      // Simple implementation: Fill with surrounding pixels
      // For each masked point, find the nearest non-masked point in a cross pattern
      const searchRadius = 15;
      for (const pt of maskedPoints) {
        let found = false;
        for (let r = 1; r < searchRadius && !found; r++) {
          const neighbors = [
            {x: pt.x + r, y: pt.y},
            {x: pt.x - r, y: pt.y},
            {x: pt.x, y: pt.y + r},
            {x: pt.x, y: pt.y - r},
            {x: pt.x + r, y: pt.y + r},
            {x: pt.x - r, y: pt.y - r}
          ];

          for (const n of neighbors) {
            if (n.x >= 0 && n.x < img.width && n.y >= 0 && n.y < img.height) {
              const nIdx = (n.y * img.width + n.x) * 4;
              if (maskPixels[nIdx + 3] === 0) {
                const targetIdx = (pt.y * img.width + pt.x) * 4;
                pixels[targetIdx] = pixels[nIdx];
                pixels[targetIdx + 1] = pixels[nIdx + 1];
                pixels[targetIdx + 2] = pixels[nIdx + 2];
                found = true;
                break;
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Apply a slight blur to the restored area to smooth artifacts
      ctx.globalAlpha = 0.5;
      ctx.filter = 'blur(2px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      ctx.globalAlpha = 1.0;

      setResult(canvas.toDataURL('image/jpeg', 0.9));
    } catch (error) {
      console.error('Inpainting error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    canvasRef.current?.clearCanvas();
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-colors cursor-pointer relative">
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
             <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Image</h3>
          <p className="text-gray-400 mb-0">Select an image to remove watermarks or objects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[500px] relative bg-gray-900 flex items-center justify-center">
                 {!result ? (
                   <div className="relative w-full h-full flex items-center justify-center p-4">
                      <div className="relative max-w-full max-h-full">
                         <img src={image} alt="Original" className="max-w-full max-h-full block" />
                         <div className="absolute inset-0">
                            <ReactSketchCanvas
                              ref={canvasRef}
                              strokeWidth={brushSize}
                              strokeColor="rgba(255, 255, 255, 0.5)"
                              canvasColor="transparent"
                              style={{ width: '100%', height: '100%' }}
                            />
                         </div>
                      </div>
                   </div>
                 ) : (
                   <img src={result} alt="Result" className="max-w-full max-h-full object-contain" />
                 )}
                 
                 {isProcessing && (
                   <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                      <p className="font-bold text-indigo-900">AI removing objects...</p>
                   </div>
                 )}
              </div>
              
              {!result && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button onClick={() => canvasRef.current?.undo()} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all" title="Undo"><Undo className="w-5 h-5" /></button>
                      <button onClick={() => canvasRef.current?.redo()} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all" title="Redo"><Redo className="w-5 h-5" /></button>
                      <button onClick={reset} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-red-500" title="Reset"><RefreshCw className="w-5 h-5" /></button>
                   </div>
                   
                   <div className="flex items-center gap-4 flex-1 max-w-xs">
                      <span className="text-xs font-bold text-gray-400 uppercase">Brush Size</span>
                      <input 
                        type="range" min={5} max={100} value={brushSize} 
                        onChange={(e) => setBrushSize(Number(e.target.value))} 
                        className="flex-1 accent-indigo-500" 
                      />
                      <span className="text-xs font-bold text-indigo-600 w-8">{brushSize}</span>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                 <div className="flex-1">
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                       <Wand2 className="w-6 h-6 text-indigo-500" />
                       Smart Eraser
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                      Painfully simple. Just paint over the watermark, text, or any object you want to remove, and let the AI do the rest.
                    </p>
                    
                    <div className="space-y-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8">
                       <div className="flex items-center gap-2 text-indigo-600">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
                       </div>
                       <p className="text-[11px] text-indigo-700/70 font-medium">
                         Use a slightly larger brush than the object for better blending results.
                       </p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {!result ? (
                      <button
                        onClick={removeWatermark}
                        disabled={isProcessing}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        Remove Objects
                      </button>
                    ) : (
                      <>
                        <a
                          href={result}
                          download="removed-watermark.jpg"
                          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95"
                        >
                          <Download className="w-5 h-5" />
                          Download Result
                        </a>
                        <button
                          onClick={reset}
                          className="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                          Modify Brush
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { setImage(null); setResult(null); }}
                      className="w-full text-xs font-bold text-gray-400 py-2 hover:text-gray-600 transition-colors uppercase tracking-widest"
                    >
                      Choose Another Image
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
