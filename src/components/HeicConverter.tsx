import React, { useState, useRef } from 'react';
import heic2any from 'heic2any';
import { Image as ImageIcon, Download, Upload, X, FileImage, Settings2, RefreshCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

type Format = 'image/jpeg' | 'image/png';

export default function HeicConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState<Format>('image/jpeg');
  const [quality, setQuality] = useState(0.8);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && (selectedFile.name.toLowerCase().endsWith('.heic') || selectedFile.name.toLowerCase().endsWith('.heif'))) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResultBlob(null);
      setResultUrl(null);
    } else {
      alert('Please select a valid HEIC or HEIF file.');
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

  const convertFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const result = await heic2any({
        blob: file,
        toType: format,
        quality: quality
      });

      const blob = Array.isArray(result) ? result[0] : result;
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image. The file might be corrupted or unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const extension = format === 'image/jpeg' ? 'jpg' : 'png';
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${file?.name.split('.')[0] || 'converted'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-indigo-600" />
          HEIC to JPG/PNG
        </h2>
        <p className="text-neutral-500 text-lg">
          Convert Apple's HEIC photos to widely supported formats without losing quality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          {!file ? (
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
                accept=".heic,.heif"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                <Upload className="w-8 h-8" />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-800">
                  Drag & drop HEIC file here
                </p>
                <p className="text-neutral-500 mt-1 text-sm">
                  Or click to browse your files
                </p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
              >
                Select HEIC File
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <FileImage className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-semibold text-neutral-800 truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-neutral-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                       </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="h-px bg-neutral-100 w-full" />

                 <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Settings2 className="w-4 h-4" />
                          Output Format
                       </label>
                       <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
                          <button
                            onClick={() => setFormat('image/jpeg')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              format === 'image/jpeg' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            JPG
                          </button>
                          <button
                            onClick={() => setFormat('image/png')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              format === 'image/png' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            PNG
                          </button>
                       </div>
                    </div>

                    {format === 'image/jpeg' && (
                       <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                             <label className="text-sm font-semibold text-neutral-700">Quality</label>
                             <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {Math.round(quality * 100)}%
                             </span>
                          </div>
                          <input 
                             type="range" 
                             min="0.1" 
                             max="1.0" 
                             step="0.05"
                             value={quality}
                             onChange={(e) => setQuality(parseFloat(e.target.value))}
                             className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                       </div>
                    )}
                 </div>

                 <button
                    onClick={convertFile}
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-3 mt-2"
                 >
                    {isProcessing ? (
                       <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Converting...
                       </>
                    ) : (
                       <>
                          <RefreshCcw className="w-5 h-5" />
                          Convert Now
                       </>
                    )}
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-6">
          <div className={`relative min-h-[400px] w-full bg-white border border-neutral-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col ${resultUrl ? 'p-6' : 'items-center justify-center text-center p-10'}`}>
            <AnimatePresence mode="wait">
              {resultUrl ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col h-full gap-6"
                >
                  <div className="flex-1 min-h-0 bg-neutral-100 rounded-3xl overflow-hidden relative group">
                     <img src={resultUrl} alt="Converted result" className="w-full h-full object-contain" />
                     <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Preview ({format === 'image/jpeg' ? 'JPG' : 'PNG'})</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                     <div className="flex items-center justify-between text-sm px-1">
                        <span className="text-neutral-500">Output Ready</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                           <Check className="w-4 h-4" />
                           Success
                        </span>
                     </div>
                     <button
                        onClick={downloadResult}
                        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-3"
                     >
                        <Download className="w-5 h-5" />
                        Download Converted Image
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-200 ring-8 ring-neutral-50/50">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-neutral-400 italic">
                      {isProcessing ? 'Processing your image...' : 'Your converted image will appear here'}
                    </p>
                    <p className="text-sm text-neutral-300 mt-2">Privacy focused: Conversion happens on your device</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
