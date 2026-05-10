import React, { useState } from 'react';
import { FileCode, Download, Loader2, Plus, X, ArrowUp, ArrowDown, File, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';

export const PDFMerge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
    setResultPdfUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResultPdfUrl(null);
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
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
    } catch (error) {
      console.error('Merge failed:', error);
      alert('PDF Merge failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--ink)]">
              <FileCode className="w-5 h-5 text-orange-500" />
              Merge PDF Documents
           </h3>
           <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Add PDF
              <input type="file" accept=".pdf" multiple className="hidden" onChange={handleFileChange} />
           </label>
        </div>

        {files.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center bg-[var(--bg)]/20">
             <File className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
             <p className="text-slate-400 text-sm">No PDFs added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
             {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[var(--bg)]/50 p-4 rounded-xl border border-[var(--glass-border)] group">
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-orange-100 dark:bg-orange-500/10 text-orange-500">{idx + 1}</div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-[var(--ink)]">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveFile(idx, 'up')} disabled={idx === 0} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg disabled:opacity-30 text-slate-400"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveFile(idx, 'down')} disabled={idx === files.length - 1} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg disabled:opacity-30 text-slate-400"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => removeFile(idx)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg"><X className="w-4 h-4" /></button>
                   </div>
                </div>
             ))}
          </div>
        )}

        {files.length >= 2 && !resultPdfUrl && (
          <button onClick={mergePdfs} disabled={isProcessing} className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileCode className="w-5 h-5" />}
            Merge {files.length} PDFs
          </button>
        )}
      </div>

      <AnimatePresence>
        {resultPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--glass)] rounded-3xl p-8 border border-[var(--glass-border)] text-center">
             <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
             <h3 className="text-xl font-bold mb-2">Success!</h3>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <a href={resultPdfUrl} download="merged.pdf" className="bg-slate-900 dark:bg-blue-600 text-white py-4 px-12 rounded-xl font-bold flex items-center gap-2"><Download className="w-5 h-5" />Download</a>
                <button onClick={() => { setFiles([]); setResultPdfUrl(null); }} className="bg-[var(--bg)] border border-[var(--glass-border)] py-4 px-12 rounded-xl font-bold">Start New</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
