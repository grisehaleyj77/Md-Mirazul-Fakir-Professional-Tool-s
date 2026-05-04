import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { LockOpen, FileDown, Upload, X, ShieldCheck, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function PdfUnlock() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
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
      alert(error.message || 'Failed to unlock PDF. Ensure the password is correct.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <LockOpen className="w-8 h-8 text-indigo-500" />
          PDF Password Unlock
        </h2>
        <p className="text-neutral-500 text-lg">
          Remove password protection from a PDF document to make it easily accessible.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50/50'
                : 'border-neutral-300 bg-white hover:border-indigo-400 hover:bg-neutral-50'
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
            
            <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-2">
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-neutral-800">
                Drag & drop protected PDF here
              </p>
              <p className="text-neutral-500 mt-1">
                or click to browse from your device
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
              Select Protected PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Protected file ready for unlocking
              </h3>
            </div>
            
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                    <LockOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{file.name}</p>
                    <p className="text-sm text-neutral-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Tooltip content="Remove file">
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Tooltip>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Existing PDF Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <p className="text-xs text-neutral-400">
                Provide the password to decrypt and remove protection.
              </p>
            </div>
            
            <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={unlockPdf}
                disabled={isProcessing || !password}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Unlocking PDF...
                  </>
                ) : (
                  <>
                    <LockOpen className="w-5 h-5" />
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
