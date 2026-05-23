import React, { useState, useRef } from 'react';
import { 
  FileImage, 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  MoveUp, 
  MoveDown,
  Settings,
  X,
  FilePlus,
  Loader2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Type,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { createWorker } from 'tesseract.js';

interface ImageData {
  id: string;
  file: File;
  preview: string;
  extractedText?: string;
  isProcessing?: boolean;
}

export const ImageToWordTool = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState("my_scanned_documents");
  const [embedImages, setEmbedImages] = useState(true);
  const [fontSize, setFontSize] = useState<10 | 11 | 12 | 14>(11);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (files: File[]) => {
    const validImages = files.filter(f => f.type.startsWith('image/'));
    const newImages: ImageData[] = validImages.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(i => i.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const reorderImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;
    setImages(newImages);
  };

  const extractTextForImage = async (imgId: string) => {
    const img = images.find(i => i.id === imgId);
    if (!img) return;

    setImages(prev => prev.map(i => i.id === imgId ? { ...i, isProcessing: true } : i));

    try {
      const worker = await createWorker('eng+ben', 1);
      const { data: { text } } = await worker.recognize(img.file);
      setImages(prev => prev.map(i => i.id === imgId ? { ...i, extractedText: text || "No text found.", isProcessing: false } : i));
      await worker.terminate();
    } catch (error) {
      console.error('Extraction failed:', error);
      setImages(prev => prev.map(i => i.id === imgId ? { ...i, isProcessing: false, extractedText: 'Error extracting text offline.' } : i));
    }
  };

  const extractAll = async () => {
    for (const img of images) {
      if (!img.extractedText && !img.isProcessing) {
        await extractTextForImage(img.id);
      }
    }
  };

  const generateWordDoc = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const children: any[] = [];
      
      // Document Title/Header
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: filename.replace(/_/g, ' ').toUpperCase(),
            bold: true,
            size: fontSize * 2 + 8,
          })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));

      for (let index = 0; index < images.length; index++) {
        const item = images[index];
        
        // Page sub-heading
        children.push(new Paragraph({
          children: [
            new TextRun({
              text: `Page ${index + 1}: Scanned Image Layout`,
              bold: true,
              size: fontSize * 2,
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }));

        // Embed Image
        if (embedImages) {
          const arrayBuffer = await item.file.arrayBuffer();
          children.push(new Paragraph({
            children: [
              new ImageRun({
                data: arrayBuffer,
                transformation: {
                  width: 500,
                  height: 380,
                },
              } as any),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }));
        }

        // Add Text Run
        const textToPut = item.extractedText || "[No transcribed text for this page]";
        const lines = textToPut.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            children.push(new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: fontSize * 2,
                })
              ],
              spacing: { after: 120 }
            }));
          }
        });

        // Add a page divider unless it is the last item
        if (index < images.length - 1) {
          children.push(new Paragraph({
            children: [
              new TextRun({
                text: "_________________________________________________________________________________",
                color: "E2E8F0"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 }
          }));
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children,
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${filename || 'my_scanned_document'}.docx`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to compile document:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyText = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32" id="img-to-word-suite-root">
      
      {/* Brand Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <FilePlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">BATCH IMAGE TO <span className="text-indigo-600">WORD</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Multi-Page Offline OCR DOCX Compiler</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Configuration & Pipeline list */}
        <div className="lg:col-span-2 space-y-6">
           <div 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
             className={`p-16 border-2 border-dashed rounded-[40px] text-center cursor-pointer transition-all ${isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 hover:border-indigo-400 bg-white dark:bg-slate-900'}`}
           >
              <FileImage size={48} className="text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Drag and drop scanned images</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 uppercase">Supports multiple files (PNG, JPG, WEBP)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelection} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
           </div>

           {/* Batch Files Queue */}
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">BATCH QUEUE ({images.length})</h3>
                 {images.length > 0 && (
                   <button 
                     onClick={extractAll}
                     className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer"
                   >
                     Transcribe All Queue Items
                   </button>
                 )}
              </div>

              {images.length === 0 ? (
                <div className="py-12 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-dashed text-center text-xs font-semibold text-slate-400">
                   No scan files added. Add files above to build your document queue.
                </div>
              ) : (
                <div className="space-y-3">
                   {images.map((item, index) => (
                     <div 
                       key={item.id}
                       className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between"
                     >
                        <div className="flex gap-4 items-center flex-1">
                           <img src={item.preview} className="w-20 h-20 object-cover rounded-xl border" alt="preview" />
                           <div className="space-y-1 select-none flex-1">
                              <h4 className="text-xs font-black text-slate-800 dark:text-white">Page {index + 1}: {item.file.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{(item.file.size / 1024).toFixed(1)} KB</p>
                              
                              <div className="flex items-center gap-1.5 pt-1">
                                 <button 
                                   onClick={() => reorderImage(index, 'up')}
                                   className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-lg"
                                 >
                                    <MoveUp size={12} />
                                 </button>
                                 <button 
                                   onClick={() => reorderImage(index, 'down')}
                                   className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-lg"
                                 >
                                    <MoveDown size={12} />
                                 </button>
                              </div>
                           </div>
                        </div>

                        {/* OCR text display box */}
                        <div className="flex flex-col gap-2 flex-1">
                           <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl min-h-[90px] border">
                              {item.isProcessing ? (
                                <div className="text-[10px] text-indigo-500 font-black flex items-center gap-2 animate-pulse uppercase">
                                   <RefreshCw className="animate-spin w-3.5 h-3.5" />
                                   Transcribing Layout...
                                </div>
                              ) : item.extractedText ? (
                                <textarea 
                                  value={item.extractedText}
                                  onChange={(e) => {
                                    const updated = e.target.value;
                                    setImages(prev => prev.map(im => im.id === item.id ? { ...im, extractedText: updated } : im));
                                  }}
                                  className="w-full h-16 bg-transparent border-none outline-none resize-none text-[11px] font-medium leading-relaxed dark:text-slate-300"
                                />
                              ) : (
                                <div className="text-[10px] text-slate-400 font-bold italic">
                                   Text remains untranscribed. Click transcribe to extract.
                                </div>
                              )}
                           </div>
                        </div>

                        <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                           {!item.extractedText && !item.isProcessing && (
                             <button
                               onClick={() => extractTextForImage(item.id)}
                               className="px-4 py-2 bg-slate-900 border text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                             >
                                Transcribe Page
                             </button>
                           )}
                           {item.extractedText && (
                             <button
                               onClick={() => copyText(item.extractedText!, item.id)}
                               className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:text-indigo-600 transition-colors cursor-pointer border"
                             >
                               {copied === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                             </button>
                           )}
                           <button 
                             onClick={() => removeImage(item.id)}
                             className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-rose-50 cursor-pointer border"
                           >
                              <X size={14} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

        </div>

        {/* Right Side Settings & Main compile button */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                 <Settings size={18} className="text-indigo-600" />
                 <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Document Compiler Specifications</h3>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doc File name</label>
                    <input 
                      type="text" 
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="e.g. notes_draft"
                      className="w-full bg-slate-50 dark:bg-slate-800 border p-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Font Size (pt)</label>
                    <div className="grid grid-cols-4 gap-2">
                       {([10, 11, 12, 14] as const).map((sz) => (
                         <button
                           key={sz}
                           onClick={() => setFontSize(sz)}
                           className={`py-2 rounded-lg text-xs font-black border-2 transition-all cursor-pointer ${fontSize === sz ? 'bg-indigo-50 border-indigo-500/20 text-indigo-605 font-black' : 'bg-transparent text-slate-500'}`}
                         >
                           {sz}pt
                         </button>
                       ))}
                    </div>
                 </div>

                 <button
                   onClick={() => setEmbedImages(!embedImages)}
                   className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer w-full ${embedImages ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 text-indigo-700' : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-755 text-slate-400'}`}
                 >
                    <span className="text-xs font-bold">Include original image layouts</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${embedImages ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'}`}>
                       {embedImages && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                 </button>

                 <div className="pt-2">
                    <button 
                      onClick={generateWordDoc}
                      disabled={images.length === 0 || isGenerating}
                      className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                      {isGenerating ? 'Compiling Word DocX...' : 'Compile Document Package'}
                    </button>
                 </div>
              </div>
           </div>

           <AnimatePresence>
             {isSuccess && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 shadow-md"
               >
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-black uppercase tracking-wide">SUCCESS: DOCX generated successfully</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
