import React, { useState, useRef } from 'react';
import { LockOpen, FileDown, Upload, X, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function PdfUnlock() {
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

  const unlockPdf = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      const response = await fetch('/api/unlock-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unlock output error' }));
        throw new Error(errorData.error);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unlocked-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      
      setFile(null);
      setPassword('');
      alert('PDF successfully unlocked!');
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      alert('Failed to unlock PDF. Please check if the password is correct.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <LockOpen className="w-8 h-8 text-green-600" />
          PDF Password Remover
        </h2>
        <p className="text-neutral-500 text-lg">
          Decrypt and remove password protection from your PDF documents.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              isDragging
                ? 'border-green-500 bg-green-50/50 scale-[0.98]'
                : 'border-neutral-200 bg-white hover:border-green-400 hover:bg-neutral-50'
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
            
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-2 shadow-lg shadow-green-100/50">
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-bold text-neutral-800">
                Drop your locked PDF
              </p>
              <p className="text-neutral-500 mt-2 font-medium">
                We'll help you remove the password instantly
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-8 py-3 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 active:scale-95"
            >
              Select File
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Locked Document
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key="unlock-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative bg-white border border-neutral-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm active:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                    <LockOpen className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-800 truncate text-lg">{file.name}</p>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • ENCRYPTED FILE
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
                  Current Password
                </label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password"
                  className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-lg"
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
                We need this password one last time to remove the encryption Forever.
              </p>
            </div>
            
            <div className="flex justify-center mt-8 px-4">
              <button
                onClick={unlockPdf}
                disabled={isProcessing || !password}
                className="w-full max-w-sm flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white font-black text-lg rounded-[2rem] hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-green-200 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <LockOpen className="w-6 h-6" />
                    Unlock & Download
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
