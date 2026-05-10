import React, { useState } from 'react';
import { FileText, Upload, Loader2, Copy, Check, Search } from 'lucide-react';
import { createWorker } from 'tesseract.js';

export const OCRTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker('eng+ben', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data: { text } } = await worker.recognize(image);
      setText(text);
      await worker.terminate();
    } catch (error) {
      console.error('OCR failed:', error);
      setText('Extraction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-12 border-2 border-dashed border-[var(--glass-border)] flex flex-col items-center justify-center text-center hover:border-yellow-400 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-[var(--ink)]">Upload Image to Extract Text</h3>
          <p className="text-slate-400 mb-6 max-w-xs">Scan documents, notes, or screenshots. Supports English and Bengali.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-2xl p-6 border border-[var(--glass-border)] flex flex-col">
               <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Image Preview</p>
               <div className="flex-1 min-h-[300px] bg-[var(--bg)]/50 rounded-xl overflow-hidden flex items-center justify-center border border-[var(--glass-border)]">
                  <img src={image} alt="Source" className="w-full h-full object-contain" />
               </div>
               {!text && !isProcessing && (
                 <button
                   onClick={extractText}
                   className="w-full mt-6 bg-yellow-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
                 >
                   <Search className="w-5 h-5" />
                   Extract Text
                 </button>
               )}
               {text && !isProcessing && (
                  <button
                    onClick={() => { setImage(null); setText(''); }}
                    className="w-full mt-4 bg-[var(--bg)] border border-[var(--glass-border)] text-slate-400 py-3 rounded-xl font-bold hover:bg-[var(--line)] transition-all"
                  >
                    Select Another
                  </button>
               )}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-2xl p-6 border border-[var(--glass-border)] h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Extracted Text</p>
                   {text && (
                     <button onClick={copyToClipboard} className="p-2 hover:bg-[var(--line)] rounded-full transition-colors">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                     </button>
                   )}
                </div>
                
                <div className="flex-1 min-h-[300px] bg-[var(--bg)]/50 rounded-xl p-6 overflow-y-auto font-mono text-sm border border-[var(--glass-border)] text-[var(--ink)]">
                   {isProcessing ? (
                     <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                        <p className="text-sm font-bold text-slate-400">Processing... {progress}%</p>
                     </div>
                   ) : text ? (
                     <pre className="whitespace-pre-wrap">{text}</pre>
                   ) : (
                     <div className="text-slate-300 text-center flex flex-col items-center justify-center h-full">
                        <FileText className="w-12 h-12 mb-2 opacity-30" />
                        <p>Confidence: 0%</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
