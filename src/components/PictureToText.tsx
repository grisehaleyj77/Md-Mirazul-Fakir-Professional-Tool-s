import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Upload, X, Copy, Check, Type, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function PictureToText() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedText('');
      setProgress(0);
    } else {
      alert('Please select a valid image file');
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

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        },
      });
      
      const { data: { text } } = await worker.recognize(image);
      setExtractedText(text);
      await worker.terminate();
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to extract text from image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(null);
    setPreviewUrl(null);
    setExtractedText('');
    setProgress(0);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <Type className="w-8 h-8 text-indigo-600" />
          Picture to Text (OCR)
        </h2>
        <p className="text-neutral-500 text-lg">
          Extract text from images using high-performance optical character recognition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {!image ? (
            <div
              className={`relative w-full aspect-video border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-neutral-300 bg-white hover:border-indigo-400 hover:bg-neutral-50'
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
                  e.target.value = '';
                }}
              />
              
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                <Upload className="w-8 h-8" />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-800">
                  Drag & drop image here
                </p>
                <p className="text-neutral-500 mt-1 text-sm">
                  Supports PNG, JPG, WEBP
                </p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
              >
                Select Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-200 group bg-neutral-100">
                <img
                  src={previewUrl!}
                  alt="Selected"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 right-4">
                  <Tooltip content="Remove and Reset">
                    <button
                      onClick={reset}
                      className="p-2 bg-white/80 hover:bg-red-500 hover:text-white text-neutral-600 rounded-full backdrop-blur-sm transition-all shadow-md"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                 <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing... {progress}%
                    </>
                  ) : (
                    <>
                      <Type className="w-5 h-5" />
                      Extract Text
                    </>
                  )}
                </button>
                
                {isProcessing && (
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
              Extracted Text
            </h3>
            <Tooltip content="Copy text">
              <button
                onClick={copyToClipboard}
                disabled={!extractedText}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-indigo-600 hover:bg-indigo-50 disabled:text-neutral-400 disabled:hover:bg-transparent'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
            </Tooltip>
          </div>
          
          <div className="relative min-h-[320px] w-full bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {extractedText ? (
                <motion.textarea
                  key="result"
                  readOnly
                  value={extractedText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex-1 bg-transparent resize-none focus:outline-none text-neutral-700 leading-relaxed font-mono text-sm"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-neutral-300"
                >
                  <Type className="w-12 h-12 opacity-20" />
                  <p className="text-lg font-medium italic">
                    {isProcessing ? 'Reading image...' : 'Extracted text will appear here'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
