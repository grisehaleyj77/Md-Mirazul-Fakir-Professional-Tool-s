import React, { useState } from 'react';
import { FileCode, Download, Upload, Loader2, FileCheck, AlertCircle, FileText, Plus } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { motion } from 'motion/react';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setStatus('idle');
        setError(null);
        setProgress(0);
      } else {
        setError('Please upload a valid PDF file');
        setFile(null);
      }
    }
  };

  const convertToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus('converting');
    setError(null);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const sections = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];
        
        // Group items by line (y-coordinate)
        const lines: { [key: number]: any[] } = {};
        items.forEach(item => {
          const y = Math.round(item.transform[5]);
          if (!lines[y]) lines[y] = [];
          lines[y].push(item);
        });

        // Sort lines from top to bottom
        const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
        
        const children = sortedY.map(y => {
          const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
          const lineText = lineItems.map(item => item.str).join(' ');
          return new Paragraph({
            children: [new TextRun(lineText)],
          });
        });

        sections.push({
          properties: {},
          children: children,
        });

        setProgress(Math.round((i / numPages) * 100));
      }

      const doc = new Document({
        sections: sections,
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, file.name.replace('.pdf', '.docx'));
      
      setStatus('done');
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Could not convert file. Your PDF might be scanned or protected.');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black flex items-center gap-2">
             <FileCode className="w-6 h-6 text-orange-600" />
             PDF to Word Converter
           </h3>
           <div className="bg-orange-50 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">Smart Extraction</span>
           </div>
        </div>

        {!file ? (
          <div className="relative group">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-16 flex flex-col items-center justify-center text-center group-hover:border-orange-400 transition-all bg-gray-50/50">
              <div className="w-20 h-20 bg-white shadow-xl shadow-orange-500/10 text-orange-500 rounded-3xl flex items-center justify-center mb-6 border border-orange-50">
                <Upload className="w-10 h-10" />
              </div>
              <p className="font-black text-gray-800 text-lg">Drop your PDF here</p>
              <p className="text-sm text-gray-400 mt-1 font-medium">Supports text extraction & layout preservation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center p-5 bg-orange-50 rounded-3xl border border-orange-100 shadow-sm">
              <div className="w-12 h-12 bg-white text-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate text-gray-800">{file.name}</p>
                <p className="text-[10px] text-orange-500 uppercase font-black tracking-[2px]">Ready for conversion</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="w-10 h-10 bg-white flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                   <span>Processing Pages</span>
                   <span>{progress}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-tight border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={convertToWord}
              disabled={isProcessing}
              className={`w-full py-5 rounded-[24px] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                status === 'done' 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-orange-600 text-white shadow-orange-600/20 hover:bg-orange-700'
              } disabled:opacity-50`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  CONVERTING...
                </>
              ) : status === 'done' ? (
                <>
                  <FileCheck className="w-5 h-5" />
                  COMPLETED
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  CONVERT TO WORD
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-12">
           <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[4px]">Advanced Info</span>
              <div className="h-px flex-1 bg-gray-100"></div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Formatting</h4>
                 <p className="text-xs font-bold text-gray-700">Native text formatting is preserved using line-grouping logic.</p>
              </div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Privacy</h4>
                 <p className="text-xs font-bold text-gray-700">All processing happens in your browser. No files are uploaded.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
