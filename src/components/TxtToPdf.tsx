import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, FileDown, Upload, X, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function TxtToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.toLowerCase().endsWith('.txt')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid .txt file');
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

  const convertToPdf = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const text = await file.text();
      const doc = new jsPDF();
      
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);
      
      const lines = doc.splitTextToSize(text, contentWidth);
      
      let y = margin;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.setFontSize(11);
      
      for (let i = 0; i < lines.length; i++) {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(lines[i], margin, y);
        y += lineHeight;
      }
      
      doc.save(file.name.replace(/\.[^/.]+$/, "") + '.pdf');
    } catch (error) {
      console.error('Error converting TXT to PDF:', error);
      alert('Failed to convert file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          TXT to PDF Converter
        </h2>
        <p className="text-neutral-500 text-lg">
          Upload a plain text (.txt) file to convert it into a professional PDF document.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Dropzone */}
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
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
              accept=".txt"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
                e.target.value = '';
              }}
            />
            
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <FileType className="w-8 h-8" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-neutral-800">
                Drag & drop a .txt file here
              </p>
              <p className="text-neutral-500 mt-1">
                or click to browse from your device
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
              Select TXT File
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Selected File
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileType className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{file.name}</p>
                    <p className="text-sm text-neutral-500">
                      {(file.size / 1024).toFixed(2)} KB
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
            
            <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={convertToPdf}
                disabled={isConverting}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isConverting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Converting to PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Download PDF
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
