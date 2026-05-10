import React, { useState, useCallback } from 'react';
import { Wand2, Download, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const config = {
        progress: (p: number) => setProgress(Math.round(p * 100)),
        publicPath: 'https://unpkg.com/@imgly/background-removal-data@1.7.0/dist/',
      };
      
      const blob = await removeBackground(image, config as any);
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (error) {
      console.error('BG Removal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-12 border-2 border-dashed border-[var(--glass-border)] flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-[var(--ink)]">Upload Photo</h3>
          <p className="text-slate-400 mb-6 max-w-xs">Supports JPG, PNG, WebP. Transparent backgrounds work best with clear subjects.</p>
          <button className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
            Select Tool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-2xl p-6 border border-[var(--glass-border)]">
            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Original</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-[var(--bg)]/50 border border-[var(--glass-border)] flex items-center justify-center">
              <img src={image} alt="Original" className="w-full h-full object-contain" />
            </div>
            {!result && !isProcessing && (
              <button
                onClick={processImage}
                className="w-full mt-6 bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                <Wand2 className="w-5 h-5" />
                Remove Background
              </button>
            )}
          </div>

          <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-2xl p-6 border border-[var(--glass-border)]">
            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Result</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-[var(--bg)]/50 border border-[var(--glass-border)] flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-sm font-bold text-slate-400">Removing Background... {progress}%</p>
                </div>
              ) : result ? (
                <img src={result} alt="Result" className="w-full h-full object-contain animate-in fade-in zoom-in duration-500" />
              ) : (
                <div className="text-slate-300 text-center p-8">
                   <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                   <p className="text-xs">Processing will appear here</p>
                </div>
              )}
            </div>
            {result && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href={result}
                  download="no-background.png"
                  className="bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-center"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
                <button
                  onClick={() => { setImage(null); setResult(null); }}
                  className="bg-[var(--bg)] border border-[var(--glass-border)] text-[var(--ink)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--line)] transition-all"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
