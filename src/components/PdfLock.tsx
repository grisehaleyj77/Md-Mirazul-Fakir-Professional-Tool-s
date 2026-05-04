import React, { useState, useRef } from 'react';
import { Lock, FileDown, Upload, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function PdfLock() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid .pdf file');
    }
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

  const lockPdf = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      const response = await fetch('/api/lock-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Lock output error' }));
        throw new Error(errorData.error);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `locked-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('PDF successfully locked and downloaded!');
    } catch (error) {
      console.error('Error locking PDF:', error);
      alert('Failed to lock PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Lock className="w-8 h-8 text-red-600" />
          PDF Password Lock
        </h2>
        <p className="text-neutral-500 text-lg">
          Secure your document with custom password protection.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              isDragging
                ? 'border-red-500 bg-red-50/50 scale-[0.98]'
                : 'border-neutral-200 bg-white hover:border-red-400 hover:bg-neutral-50'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
                e.target.value = '';
              }}
            />
            
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mb-2 shadow-lg shadow-red-100/50">
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-neutral-800">
                Release your file here
              </p>
              <p className="text-neutral-500 mt-2 font-medium">
                Drag and drop your PDF file to encrypt it
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-8 py-3 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 active:scale-95"
            >
              Choose PDF File
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Target Document
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key="file-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative bg-white border border-neutral-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm active:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-800 truncate text-lg">{file.name}</p>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • READY TO PROTECT
                    </p>
                  </div>
                </div>
                
                <Tooltip content="Remove file">
                  <button
                    onClick={() => setFile(null)}
                    className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </Tooltip>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-4 bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-neutral-400 uppercase tracking-widest">
                  Encryption Password
                </label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a strong PDF password"
                  className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-2 border-transparent focus:border-red-500 focus:bg-white focus:outline-none transition-all font-bold text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs font-bold text-neutral-400 italic px-2">
                Make sure to remember this password. You won't be able to open the file without it.
              </p>
            </div>
            
            <div className="flex justify-center mt-8 px-4">
              <button
                onClick={lockPdf}
                disabled={isProcessing || !password}
                className="w-full max-w-sm flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white font-black text-lg rounded-[2rem] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-red-200 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" />
                    Lock & Download
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
