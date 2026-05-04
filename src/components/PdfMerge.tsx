import React, { useState, useRef } from 'react';
import { FileUp, FileDown, Upload, X, FileStack, ArrowUpDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument } from 'pdf-lib';
import Tooltip from './Tooltip';

interface QueuedFile {
  id: string;
  file: File;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList) => {
    const newFiles: QueuedFile[] = Array.from(selectedFiles)
      .filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
      .map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f
      }));
    
    setFiles(prev => [...prev, ...newFiles]);
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newFiles.length) {
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const queuedFile of files) {
        const fileBytes = await queuedFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-document-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Failed to merge PDFs. Please ensure all files are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <FileStack className="w-8 h-8 text-brand-500" />
          Merge PDF Files
        </h2>
        <p className="text-neutral-500 text-lg">
          Combine multiple PDF documents into a single professional file.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div
          className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50'
              : 'border-neutral-300 bg-white hover:border-brand-400 hover:bg-neutral-50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
              e.target.value = '';
            }}
          />
          
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-2">
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-800">
              Drag & drop multiple PDF files here
            </p>
            <p className="text-neutral-500 mt-1">
              or click to browse from your device
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
          >
            Select PDF Files
          </button>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-brand-500" />
                Files to Merge ({files.length})
              </h3>
              <button 
                onClick={() => setFiles([])}
                className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {files.map((queuedFile, index) => (
                  <motion.div
                    key={queuedFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    className="relative bg-white border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-sm group hover:border-brand-200 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-xs font-black">{index + 1}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-800 truncate">{queuedFile.file.name}</p>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">
                          {(queuedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          disabled={index === 0}
                          onClick={() => moveFile(index, 'up')}
                          className="p-1 text-neutral-400 hover:text-brand-500 disabled:opacity-30"
                        >
                          <ArrowUpDown className="w-4 h-4 rotate-180" />
                        </button>
                        <button 
                          disabled={index === files.length - 1}
                          onClick={() => moveFile(index, 'down')}
                          className="p-1 text-neutral-400 hover:text-brand-500 disabled:opacity-30"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <Tooltip content="Remove file">
                        <button
                          onClick={() => removeFile(queuedFile.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 font-medium italic">
                Drag files to reorder them before merging.
              </p>
              
              <button
                onClick={mergePdfs}
                disabled={isProcessing || files.length < 2}
                className="flex items-center gap-2 px-8 py-4 bg-brand-500 text-white font-bold rounded-2xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Merging...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Merge & Download
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
