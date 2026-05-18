import React, { useState } from 'react';
import { Download, Loader2, Plus, File, Edit3, Check, Settings } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';

export const PDFTextEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textToAdd, setTextToAdd] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResultPdfUrl(null);
    }
  };

  const addTextToPdf = async () => {
    if (!file || !textToAdd) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        const { height } = page.getSize();
        page.drawText(textToAdd, {
          x: 50,
          y: height - 50,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
    } catch (error) {
      console.error('Editor failed:', error);
      alert('PDF Editor failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--ink)]">
              <Edit3 className="w-5 h-5 text-rose-500" />
              Add Text to PDF
           </h3>
           <label className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Upload PDF
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
           </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg)]/50 rounded-2xl border border-[var(--glass-border)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Text to Inject</h4>
              <textarea 
                value={textToAdd} 
                onChange={(e) => setTextToAdd(e.target.value)}
                placeholder="Enter text to add to the top of all pages..."
                className="w-full bg-white dark:bg-white/5 border border-[var(--glass-border)] rounded-xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-4 bg-[var(--bg)]/50 p-4 rounded-xl border border-[var(--glass-border)] group">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-rose-100 dark:bg-rose-500/10 text-rose-500">1</div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-[var(--ink)]">{file.name}</p>
               </div>
               <button onClick={() => setFile(null)} className="p-2 text-red-500"><Plus className="w-4 h-4 rotate-45" /></button>
            </div>

            {!resultPdfUrl && (
              <button onClick={addTextToPdf} disabled={isProcessing || !textToAdd} className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
                Process PDF
              </button>
            )}
          </div>
        )}

        {!file && (
          <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center bg-[var(--bg)]/20">
             <File className="w-12 h-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
             <p className="text-slate-400 text-sm">No PDF uploaded.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {resultPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--glass)] rounded-3xl p-8 border border-[var(--glass-border)] text-center">
             <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
             <h3 className="text-xl font-bold mb-2">Success!</h3>
             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <a href={resultPdfUrl} download="edited.pdf" className="bg-slate-900 dark:bg-blue-600 text-white py-4 px-12 rounded-xl font-bold flex items-center gap-2"><Download className="w-5 h-5" />Download</a>
                <button onClick={() => { setFile(null); setResultPdfUrl(null); setTextToAdd(''); }} className="bg-[var(--bg)] border border-[var(--glass-border)] py-4 px-12 rounded-xl font-bold">Start New</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
