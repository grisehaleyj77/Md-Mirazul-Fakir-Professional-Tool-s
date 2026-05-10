import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Download, 
  Type, 
  Square, 
  Trash2, 
  Undo, 
  RotateCcw,
  Pencil,
  Eraser,
  EyeOff,
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as fabric from 'fabric';

export const ScreenshotEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [activeColor, setActiveColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8fafc'
      });
      fabricCanvas.current = canvas;
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      const img = await fabric.FabricImage.fromURL(data);
      
      if (fabricCanvas.current && fabricCanvas.current.width && fabricCanvas.current.height && img.width && img.height) {
        fabricCanvas.current.clear();
        
        // Scale image to fit canvas
        const canvasWidth = fabricCanvas.current.width;
        const canvasHeight = fabricCanvas.current.height;
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        
        img.scale(scale);
        img.set({
          left: (canvasWidth - img.width * scale) / 2,
          top: (canvasHeight - img.height * scale) / 2,
          selectable: false
        });

        fabricCanvas.current.add(img);
        fabricCanvas.current.sendObjectToBack(img);
        setImageLoaded(true);
        fabricCanvas.current.renderAll();
      }
    };
    reader.readAsDataURL(file);
  };

  const setTool = (tool: string) => {
    setActiveTool(tool);
    if (!fabricCanvas.current) return;

    fabricCanvas.current.isDrawingMode = tool === 'pencil';
    
    if (tool === 'pencil') {
      fabricCanvas.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas.current);
      fabricCanvas.current.freeDrawingBrush.color = activeColor;
      fabricCanvas.current.freeDrawingBrush.width = brushSize;
    }
  };

  const addText = () => {
    if (!fabricCanvas.current) return;
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fontSize: 24,
      fill: activeColor,
      fontWeight: 'bold'
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
    setActiveTool('select');
  };

  const addRect = () => {
    if (!fabricCanvas.current) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 4,
      width: 150,
      height: 100,
      rx: 8,
      ry: 8
    });
    fabricCanvas.current.add(rect);
    fabricCanvas.current.setActiveObject(rect);
    setActiveTool('select');
  };

  const blurSelection = () => {
    if (!fabricCanvas.current) return;
    const rect = new fabric.Rect({
      left: 120,
      top: 120,
      fill: 'rgba(255,255,255,0.8)',
      width: 150,
      height: 100,
      selectable: true,
    });
    // fabric.js filters are complex for a simple rect, we'll use a "whiteout" style for sensitive data
    // in a real app we'd apply a blur filter to the cropped area of the background image
    fabricCanvas.current.add(rect);
    fabricCanvas.current.setActiveObject(rect);
    setActiveTool('select');
  };

  const deleteSelected = () => {
    if (!fabricCanvas.current) return;
    const activeObjects = fabricCanvas.current.getActiveObjects();
    fabricCanvas.current.discardActiveObject();
    activeObjects.forEach((obj) => {
      fabricCanvas.current?.remove(obj);
    });
    fabricCanvas.current.renderAll();
  };

  const clearAll = () => {
    if (confirm('Clear everything?')) {
      if (fabricCanvas.current) {
        fabricCanvas.current.clear();
        fabricCanvas.current.backgroundColor = '#f8fafc';
        fabricCanvas.current.renderAll();
      }
      setImageLoaded(false);
    }
  };

  const downloadImage = () => {
    if (!fabricCanvas.current) return;
    const dataURL = fabricCanvas.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    const link = document.createElement('a');
    link.download = `screenshot-edit-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black italic">Screenshot Editor</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Annotate and redact your images</p>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        {/* Editor Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'select', icon: RotateCcw, label: 'Select' },
              { id: 'pencil', icon: Pencil, label: 'Draw' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setTool(tool.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === tool.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/10 text-slate-400'}`}
              >
                <tool.icon className="w-5 h-5" />
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
            <button onClick={addText} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 text-slate-400 flex items-center justify-center active:scale-90"><Type className="w-5 h-5" /></button>
            <button onClick={addRect} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 text-slate-400 flex items-center justify-center active:scale-90"><Square className="w-5 h-5" /></button>
            <button onClick={blurSelection} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/10 text-slate-400 flex items-center justify-center active:scale-90"><EyeOff className="w-5 h-5" /></button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={deleteSelected} className="w-10 h-10 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 flex items-center justify-center active:scale-90"><Trash2 className="w-5 h-5" /></button>
            <button onClick={clearAll} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 dark:bg-white/10 flex items-center justify-center active:scale-90"><RotateCcw className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Color & Size */}
        <div className="p-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            {['#2563eb', '#dc2626', '#16a34a', '#000000', '#ffffff'].map((color) => (
              <button
                key={color}
                onClick={() => {
                  setActiveColor(color);
                  if (fabricCanvas.current?.freeDrawingBrush) {
                    fabricCanvas.current.freeDrawingBrush.color = color;
                  }
                }}
                className={`w-6 h-6 rounded-full border-2 ${activeColor === color ? 'border-blue-600 scale-125' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex-1 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-slate-400">Size</span>
             <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize} 
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setBrushSize(size);
                if (fabricCanvas.current?.freeDrawingBrush) {
                  fabricCanvas.current.freeDrawingBrush.width = size;
                }
              }}
              className="flex-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-blue-600"
             />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-4 relative flex justify-center bg-slate-100/50 dark:bg-black/20 min-h-[400px]">
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10">
              <label className="cursor-pointer group">
                <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-3xl flex items-center justify-center shadow-sm group-active:scale-90 transition-all border-2 border-dashed border-slate-200 dark:border-white/20">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              <div className="text-center">
                <p className="text-sm font-black italic">Upload Screenshot</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PNG, JPG, HEIC admitted</p>
              </div>
            </div>
          )}
          <div className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white dark:bg-white/5">
          <button 
            disabled={!imageLoaded}
            onClick={downloadImage}
            className={`w-full h-16 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 ${imageLoaded ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400 dark:bg-white/5 cursor-not-allowed'}`}
          >
            <Download className="w-5 h-5" />
            Download Edited Version
          </button>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-[28px] border border-blue-100 dark:border-blue-500/10 flex items-start gap-4">
        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
          <Palette className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600">Pro Editing Tip</h4>
          <p className="text-xs font-bold text-slate-500 leading-relaxed">Use the <span className="text-slate-900 dark:text-white">EyeOff</span> tool to hide confidential names or IDs before sharing screenshots.</p>
        </div>
      </div>
    </div>
  );
};
