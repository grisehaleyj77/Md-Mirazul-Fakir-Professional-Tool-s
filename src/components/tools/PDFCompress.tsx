import React, { useState } from 'react';
import { Download, Loader2, Plus, X, File, Zap, Settings, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';

export const PDFCompress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'small' | 'standard' | 'high'>('standard');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(newFiles.slice(0, 1));
    setResultPdfUrl(null);
  };

  const removeFile = () => {
    setFiles([]);
    setResultPdfUrl(null);
  };

  const compressPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const compressedPdf = await PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      if (compressionLevel === 'small') {
        compressedPdf.setTitle('');
      }

      const compressedPdfBytes = await compressedPdf.save({ useObjectStreams: compressionLevel !== 'high' });
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('PDF Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--ink)]">
              <Zap className="w-5 h-5 text-blue-500" />
              Compress PDF
           </h3>
           <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Select PDF
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
           </label>
        </div>

        {files.length > 0 && (
          <div className="mb-8 p-6 bg-[var(--bg)]/50 rounded-2xl border border-[var(--glass-border)]">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Compression Settings</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['small', 'standard', 'high'] as const).map((level) => (
                <button key={level} onClick={() => setCompressionLevel(level)} className={`p-4 rounded-xl border text-center transition-all ${compressionLevel === level ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-[var(--glass-border)] text-slate-500'}`}>
                  <p className="text-xs font-black uppercase mb-1">{level}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center bg-[var(--bg)]/20">
             <File className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
             <p className="text-slate-400 text-sm">No PDF selected.</p>
          </div>
        ) : (
          <div className="space-y-2">
             {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[var(--bg)]/50 p-4 rounded-xl border border-[var(--glass-border)] group">
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-blue-100 dark:bg-blue-500/10 text-blue-500">{idx + 1}</div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-[var(--ink)]">{file.name}</p>
                   </div>
                   <button onClick={removeFile} className="p-2 text-red-500"><X className="w-4 h-4" /></button>
                </div>
             ))}
          </div>
        )}

        {files.length > 0 && !resultPdfUrl && (
          <button onClick={compressPdf} disabled={isProcessing} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            Compress PDF
          </button>
        )}
      </div>

      <AnimatePresence>
        {resultPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--glass)] rounded-3xl p-8 border border-[var(--glass-border)] text-center">
             <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
             <h3 className="text-xl font-bold mb-2">Success!</h3>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <a href={resultPdfUrl} download="compressed.pdf" className="bg-slate-900 dark:bg-blue-600 text-white py-4 px-12 rounded-xl font-bold flex items-center gap-2"><Download className="w-5 h-5" />Download</a>
                <button onClick={() => { setFiles([]); setResultPdfUrl(null); }} className="bg-[var(--bg)] border border-[var(--glass-border)] py-4 px-12 rounded-xl font-bold">Start New</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
