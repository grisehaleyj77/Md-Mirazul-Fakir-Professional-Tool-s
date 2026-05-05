import React, { useState, useRef } from 'react';
import { FileDown, Upload, X, Download, RotateCw, Trash2, ArrowLeft, Layers, Save, MoveVertical, FileSignature } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPage {
  id: string;
  originalIndex: number;
  rotation: number;
  thumbnail: string;
}

export default function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.pdf')) {
      alert('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const loadedPages: PdfPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          loadedPages.push({
            id: `page-${i}-${Date.now()}`,
            originalIndex: i - 1,
            rotation: 0,
            thumbnail: canvas.toDataURL(),
          });
        }
      }
      setPages(loadedPages);
    } catch (error) {
      console.error('PDF load error:', error);
      alert('Failed to load PDF. Ensure it is not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const rotatePage = (id: string) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) {
      alert('PDF must have at least one page.');
      return;
    }
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const savePdf = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const originalArrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(originalArrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const pageInfo of pages) {
        const [copiedPage] = await newPdf.copyPages(originalPdf, [pageInfo.originalIndex]);
        const currentRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees(currentRotation + pageInfo.rotation));
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF save error:', error);
      alert('Failed to process PDF changes.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
          <FileSignature className="w-10 h-10 text-indigo-600" />
          PDF Page Editor
        </h2>
        <p className="text-neutral-500 text-lg font-medium">
          Rotate, reorder, or delete pages with professional precision.
        </p>
      </div>

      {!file ? (
        <div
          className={`w-full border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]'
              : 'border-neutral-200 bg-white hover:border-indigo-400 hover:bg-neutral-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-indigo-100/50">
            <Layers className="w-12 h-12" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black text-neutral-800 tracking-tight">Drop PDF here to manage pages</p>
            <p className="text-neutral-500 font-medium italic">Advanced page manipulation engine</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-neutral-900 text-white font-black text-lg rounded-[2rem] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95"
          >
            Select PDF
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[2rem] border border-neutral-100 shadow-sm sticky top-4 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={reset}
                className="p-3 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <p className="text-sm font-black text-neutral-900 line-clamp-1">{file.name}</p>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">{pages.length} Pages Loaded</p>
              </div>
            </div>
            <button
              onClick={savePdf}
              disabled={isProcessing}
              className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Apply & Save
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12">
              <Reorder.Group 
                axis="y" 
                values={pages} 
                onReorder={setPages}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {pages.map((page, index) => (
                  <Reorder.Item 
                    key={page.id} 
                    value={page}
                    className="relative group bg-white border-2 border-neutral-100 rounded-[2rem] p-4 cursor-grab active:cursor-grabbing hover:border-indigo-200 transition-all shadow-sm"
                  >
                    <div className="absolute top-4 left-4 bg-neutral-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-10 shadow-lg">
                      {index + 1}
                    </div>
                    
                    <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => rotatePage(page.id)}
                        className="p-2 bg-white text-neutral-600 rounded-xl shadow-xl border border-neutral-100 hover:text-indigo-600"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deletePage(page.id)}
                        className="p-2 bg-white text-neutral-600 rounded-xl shadow-xl border border-neutral-100 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="aspect-[3/4] bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center relative">
                      <img 
                        src={page.thumbnail} 
                        alt={`Page ${index + 1}`}
                        className="max-w-full max-h-full shadow-lg transition-transform duration-300"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-neutral-400 font-bold uppercase tracking-widest text-[9px]">
                        <span>Drag Handle</span>
                        <MoveVertical className="w-4 h-4" />
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 rounded-[2.5rem] p-8 flex items-start gap-6 text-white">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
          <RotateCw className="w-7 h-7 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-black">Visual Page Manipulation</p>
          <p className="text-sm text-neutral-400 leading-relaxed font-medium">
            Take full control of your PDF structure. Our tool allows you to visually rearrange pages, rotate misaligned scans, and remove unwanted content. All processing is 100% private and happens <strong>within your browser</strong> using high-performance Web Workers.
          </p>
        </div>
      </div>
    </div>
  );
}
