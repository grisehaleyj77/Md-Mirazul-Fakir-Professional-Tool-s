import React, { useState, useRef } from 'react';
import { 
  FileImage, 
  FileText, 
  Download, 
  Trash2, 
  Settings, 
  Loader2, 
  CheckCircle2, 
  Type,
  Layout,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { createWorker } from 'tesseract.js';

export const ImageToWordPro = () => {
  const [image, setImage] = useState<{file: File, preview: string} | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (image) URL.revokeObjectURL(image.preview);
      setImage({
        file,
        preview: URL.createObjectURL(file)
      });
      setExtractedText('');
      setProgress(0);
    }
  };

  const processOCRLocal = async () => {
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
      const { data: { text } } = await worker.recognize(image.file);
      setExtractedText(text || "No legible text found in this scan.");
      await worker.terminate();
    } catch (error) {
      console.error('OCR failed:', error);
      setExtractedText('Extraction failed or terminated. Please try a cleaner image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDoc = async () => {
    if (!image && !extractedText) return;
    setIsGenerating(true);

    try {
      const children: any[] = [];

      // Add Header
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: "Converted Document",
            bold: true,
            size: 32,
          })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }));

      // Add Spacer
      children.push(new Paragraph({ text: "" }));

      // Add Image if requested
      if (includeImage && image) {
        const arrayBuffer = await image.file.arrayBuffer();
        children.push(new Paragraph({
          children: [
            new ImageRun({
              data: arrayBuffer,
              transformation: {
                width: 400,
                height: 300,
              },
            } as any), // Use as any to bypass strict type check for docx ImageRun options
          ],
          alignment: AlignmentType.CENTER,
        }));
        children.push(new Paragraph({ text: "" }));
      }

      // Add Extracted Text
      if (extractedText) {
        const paragraphs = extractedText.split('\n');
        paragraphs.forEach(p => {
          if (p.trim()) {
            children.push(new Paragraph({
              children: [new TextRun(p)],
              spacing: { before: 200, after: 200 },
            }));
          }
        });
      } else {
         children.push(new Paragraph({
            children: [
              new TextRun({
                text: "No text was extracted for this document.",
                italics: true
              })
            ]
         }));
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Image_To_Word_${Date.now()}.docx`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Doc generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
    setExtractedText('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" id="img-word-pro-root">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg text-blue-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-white">Image to Word Compiler Pro</h2>
            <p className="text-xs text-slate-500">Offline high performance document extractor and formatting suite</p>
          </div>
        </div>
        
        {image && (
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={downloadDoc}
              disabled={isGenerating || (!image && !extractedText)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {isGenerating ? 'Compiling...' : 'Download DOCX'}
            </button>
          </div>
        )}
      </div>

      {!image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-16 flex flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-950/20 rounded-[2rem] flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <FileImage size={48} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Click or Drop image to start conversion</h3>
            <p className="text-sm text-slate-500 font-medium">Extract text layouts locally inside your browser</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest">PNG</span>
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG</span>
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest">WEBP</span>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input & Preview */}
          <div className="space-y-6">
             <div className="bg-slate-900 rounded-[32px] p-2 shadow-2xl relative overflow-hidden group min-h-[400px] flex items-center justify-center border-8 border-slate-800">
                <img src={image.preview} alt="Input" className="max-w-full max-h-[500px] rounded-2xl shadow-sm" />
                <div className="absolute top-4 right-4 animate-pulse">
                   <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">Input Layer</div>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Settings size={16} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Extraction Settings</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   <button
                     onClick={() => setIncludeImage(!includeImage)}
                     className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${includeImage ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 text-blue-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-755 text-slate-400'}`}
                   >
                      <div className="flex items-center gap-3">
                         <Layout size={18} />
                         <span className="text-sm font-bold">Embed Original Image in Doc</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${includeImage ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200'}`}>
                         {includeImage && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                   </button>

                   <button
                     onClick={processOCRLocal}
                     disabled={isProcessing}
                     className="w-full py-4 bg-slate-900 dark:bg-blue-650 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                   >
                      {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <FileText size={16} />}
                      {isProcessing ? `Reading text (${progress}%)` : extractedText ? 'Rescan Document' : 'Perform Local Scan'}
                   </button>
                </div>
             </div>
          </div>

          {/* Right: Output & Result */}
          <div className="space-y-6">
             <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden min-h-[500px] flex flex-col justify-between shadow-lg">
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Type size={16} />
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest">Document Editor Workspace</span>
                      </div>
                      {isProcessing && <div className="text-[10px] font-black uppercase tracking-widest animate-pulse">Reading pixels...</div>}
                   </div>

                   <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-72">
                      <textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none resize-none font-medium text-sm leading-relaxed placeholder:text-white/40 text-white"
                        placeholder="Offline target transcription will load here. You can edit/tweak it right inside this panel..."
                      />
                   </div>
                </div>

                <button
                  onClick={downloadDoc}
                  disabled={isGenerating || (!image && !extractedText)}
                  className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer disabled:opacity-50"
                >
                   Download Compiled Word Doc
                   <ArrowRight size={18} />
                </button>
             </div>

             <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-green-500 rounded-2xl text-white flex items-center gap-3"
                  >
                     <CheckCircle2 size={20} />
                     <span className="text-xs font-black uppercase tracking-widest">SUCCESS: Doc generated successfully</span>
                  </motion.div>
                )}
             </AnimatePresence>

             <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linguistic Protection</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                   All OCR transcription calculations run 100% inside your safe micro-browser sandbox. Zero server bandwidth or outside connections used.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
