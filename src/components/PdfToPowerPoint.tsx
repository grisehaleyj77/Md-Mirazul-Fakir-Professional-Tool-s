import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pptxgen from 'pptxgenjs';
import { FileText, FileDown, Upload, X, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToPowerPoint() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
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

  const convertToPowerPoint = async () => {
    if (!file) return;
    setIsConverting(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const pres = new pptxgen();
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const slide = pres.addSlide();
        
        // Group items by roughly the same Y coordinate to form lines
        let currentY = -1;
        let currentLine = '';
        const lines: string[] = [];
        
        for (const item of textContent.items) {
          if ('str' in item) {
            // @ts-ignore
            const y = Math.round(item.transform[5]);
            if (currentY === -1) {
                currentY = y;
            }
            
            if (Math.abs(y - currentY) > 5) {
                // New line
                if (currentLine.trim()) {
                    lines.push(currentLine);
                }
                currentLine = item.str;
                currentY = y;
            } else {
                currentLine += ' ' + item.str;
            }
          }
        }
        
        if (currentLine.trim()) {
            lines.push(currentLine);
        }
        
        // Add text to slide
        if (lines.length > 0) {
          slide.addText(lines.join('\n'), {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: '90%',
            fontSize: 14,
            color: '363636',
            valign: 'top'
          });
        } else {
          slide.addText('(No text found on this page)', {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: '90%',
            fontSize: 14,
            color: '999999',
            valign: 'middle',
            align: 'center'
          });
        }
      }
      
      await pres.writeFile({ fileName: file.name.replace('.pdf', '.pptx') });
      
    } catch (error) {
      console.error('Error converting PDF to PowerPoint:', error);
      alert('Failed to convert document. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          PDF to PowerPoint Converter
        </h2>
        <p className="text-neutral-500 text-lg">
          Upload a PDF file to extract its text into a Microsoft PowerPoint (.pptx) presentation.
        </p>
        <p className="text-sm text-neutral-400 italic">
          Note: This performs basic text extraction. Complex formatting, images, and layouts will not be preserved.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
              isDragging
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-neutral-300 bg-white hover:border-amber-400 hover:bg-neutral-50'
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
            
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-8 h-8" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-neutral-800">
                Drag & drop a .pdf file here
              </p>
              <p className="text-neutral-500 mt-1">
                or click to browse from your device
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
              Select PDF File
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Selected File
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
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
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
            
            <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={convertToPowerPoint}
                disabled={isConverting}
                className="flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-2xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isConverting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Converting to PowerPoint...
                  </>
                ) : (
                  <>
                    <Presentation className="w-5 h-5" />
                    Download PowerPoint
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
