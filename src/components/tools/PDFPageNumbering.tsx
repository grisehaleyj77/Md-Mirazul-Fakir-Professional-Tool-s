import React, { useState } from 'react';
import { Download, Loader2, Plus, File, Hash, Check, Settings, Layout } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';

export const PDFPageNumbering = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left'>('bottom-center');
  const [format, setFormat] = useState<'plain' | 'page-x' | 'page-x-y'>('page-x');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResultPdfUrl(null);
    }
  };

  const addPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;
        
        let text = '';
        if (format === 'plain') text = `${pageNum}`;
        else if (format === 'page-x') text = `Page ${pageNum}`;
        else if (format === 'page-x-y') text = `Page ${pageNum} of ${totalPages}`;

        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 20;

        let x = 0;
        let y = 0;

        // X Position
        if (position.includes('left')) x = margin;
        else if (position.includes('center')) x = (width - textWidth) / 2;
        else if (position.includes('right')) x = width - textWidth - margin;

        // Y Position
        if (position.includes('top')) y = height - margin - fontSize;
        else if (position.includes('bottom')) y = margin;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);
    } catch (error) {
      console.error('Page numbering failed:', error);
      alert('Failed to add page numbers.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[32px] p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Add Page Numbers</h3>
                <p className="text-sm text-slate-400 font-medium">Automatic PDF pagination</p>
              </div>
           </div>
           {!file && (
             <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-black cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
                <Plus className="w-4 h-4" />
                Upload PDF
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
             </label>
           )}
        </div>

        {file && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position Selection */}
              <div className="p-6 bg-[var(--bg)]/50 rounded-[24px] border border-[var(--glass-border)]">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                   <Layout className="w-4 h-4" /> Position
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => (
                    <button 
                      key={pos} 
                      onClick={() => setPosition(pos)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all ${position === pos ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-white/5 border-[var(--glass-border)] text-slate-500'}`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div className="p-6 bg-[var(--bg)]/50 rounded-[24px] border border-[var(--glass-border)]">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                   <Settings className="w-4 h-4" /> Format
                </h4>
                <div className="space-y-2">
                  {(['plain', 'page-x', 'page-x-y'] as const).map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setFormat(f)}
                      className={`w-full p-3 rounded-xl text-left px-4 text-xs font-bold border transition-all ${format === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-white/5 border-[var(--glass-border)] text-slate-500'}`}
                    >
                      {f === 'plain' ? '1, 2, 3...' : f === 'page-x' ? 'Page 1, Page 2...' : 'Page 1 of 10...'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[var(--bg)]/50 p-4 rounded-xl border border-[var(--glass-border)] group">
               <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600">PDF</div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-[var(--text-main)]">{file.name}</p>
               </div>
               <button onClick={() => setFile(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Plus className="w-5 h-5 rotate-45" /></button>
            </div>

            {!resultPdfUrl && (
              <button onClick={addPageNumbers} disabled={isProcessing} className="w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all">
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Hash className="w-6 h-6" />}
                Add Page Numbers
              </button>
            )}
          </div>
        )}

        {!file && (
          <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-[32px] text-center bg-[var(--bg)]/20">
             <File className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-4" />
             <p className="text-slate-500 font-bold">No PDF uploaded.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {resultPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--glass)] rounded-[32px] p-10 border border-[var(--glass-border)] text-center shadow-2xl">
             <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Check className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-black mb-2 BengaliFont">সফলভাবে সম্পন্ন হয়েছে!</h3>
             <p className="text-slate-400 font-medium mb-10">Your PDF with page numbers is ready for download.</p>
             
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={resultPdfUrl} download="numbered.pdf" className="bg-slate-900 text-white py-5 px-12 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95">
                   <Download className="w-5 h-5" /> Download PDF
                </a>
                <button onClick={() => { setFile(null); setResultPdfUrl(null); }} className="bg-white border border-slate-200 py-5 px-12 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                   Start New
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
