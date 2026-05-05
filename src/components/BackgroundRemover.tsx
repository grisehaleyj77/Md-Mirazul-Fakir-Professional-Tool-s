import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Download, Wand2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { removeBackground } from '@imgly/background-removal';
import Tooltip from './Tooltip';

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResultUrl(null);
    setProgress(0);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // removeBackground can take a lot of configurations, but default is usually fine.
      // It returns a Blob.
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          const p = Math.round((current / total) * 100);
          setProgress(p);
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to remove background. Please try a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `no-bg-${file?.name || 'image.png'}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Wand2 className="w-8 h-8 text-fuchsia-600" />
          Background Remover
        </h2>
        <p className="text-neutral-500 text-lg">
          AI-powered background removal directly in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              isDragging
                ? 'border-fuchsia-500 bg-fuchsia-50/50 scale-[0.98]'
                : 'border-neutral-200 bg-white hover:border-fuchsia-400 hover:bg-neutral-50'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            
            <div className="w-20 h-20 bg-fuchsia-100 text-fuchsia-600 rounded-[2rem] flex items-center justify-center mb-2 shadow-lg shadow-fuchsia-100/50">
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-neutral-800">
                Drop your image here
              </p>
              <p className="text-neutral-500 mt-2 font-medium">
                Supports JPG, PNG, and WebP
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original / Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">Original</h3>
                <button 
                  onClick={reset}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-square bg-neutral-100 rounded-[2rem] overflow-hidden border border-neutral-100 flex items-center justify-center relative group">
                <img src={previewUrl!} alt="Original" className="w-full h-full object-contain" />
              </div>
              {!resultUrl && (
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-4 bg-fuchsia-600 text-white font-black text-lg rounded-2xl hover:bg-fuchsia-700 disabled:opacity-50 transition-all shadow-xl shadow-fuchsia-200 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Removing Background... {progress > 0 && `${progress}%`}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Remove Background
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Result */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">Result</h3>
                {resultUrl && (
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 uppercase tracking-widest"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    New Image
                  </button>
                )}
              </div>
              <div className="aspect-square bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-neutral-200 rounded-[2rem] overflow-hidden border border-neutral-100 flex items-center justify-center relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                      <Wand2 className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <div className="w-48 h-2 bg-neutral-300 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-fuchsia-600"
                      />
                    </div>
                  </div>
                ) : resultUrl ? (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={resultUrl} 
                    alt="Result" 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className="text-neutral-400 text-sm font-medium flex flex-col items-center gap-2 opacity-50">
                    <ImageIcon className="w-12 h-12" />
                    Waiting for processing...
                  </div>
                )}
              </div>
              {resultUrl && (
                <button
                  onClick={downloadResult}
                  className="w-full py-4 bg-neutral-900 text-white font-black text-lg rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <ImageIcon className="w-5 h-5 text-fuchsia-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-fuchsia-900">Privacy Guaranteed</p>
          <p className="text-xs text-fuchsia-700 leading-relaxed">
            All image processing happens locally on your device. Your photos are never uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
