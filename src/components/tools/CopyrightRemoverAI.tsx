import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Download, RefreshCw, Undo, Redo, Loader2, Wand2, ShieldAlert, Scan, AlertCircle } from 'lucide-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { motion, AnimatePresence } from 'motion/react';
import { ai, GEMINI_API_KEY } from '../../lib/gemini';

export const CopyrightRemoverAI = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

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

  const processRemoval = async () => {
    if (!image) return;
    setIsProcessing(true);
    // Simulation for demo
    await new Promise(r => setTimeout(r, 2000));
    setResult(image); // In real use, we'd use the mask and inpaint
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--glass)] p-8 rounded-3xl border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center gap-3 mb-8">
           <ShieldAlert className="w-8 h-8 text-indigo-500" />
           <div>
              <h3 className="text-xl font-bold">Copyright Remover AI</h3>
              <p className="text-sm text-slate-400">Deep scan & erase marks</p>
           </div>
        </div>

        {!image ? (
          <label className="block p-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center cursor-pointer">
             <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="font-bold text-slate-500">Upload Image</p>
             <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="space-y-6">
             <div className="relative border border-[var(--glass-border)] rounded-2xl overflow-hidden bg-black">
                <img src={image} alt="Original" className="w-full max-h-[500px] object-contain opacity-50" />
                <div className="absolute inset-0">
                   <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={20}
                    strokeColor="rgba(255, 0, 0, 0.5)"
                    canvasColor="transparent"
                   />
                </div>
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                     <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                     <p className="font-bold text-white">AI Erasing Marks...</p>
                  </div>
                )}
             </div>

             <div className="flex gap-4">
                <button onClick={processRemoval} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                   <Sparkles className="w-5 h-5" /> Apply AI Magic
                </button>
                <button onClick={() => setImage(null)} className="px-8 py-4 bg-slate-100 dark:bg-white/5 rounded-xl font-bold">Cancel</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
