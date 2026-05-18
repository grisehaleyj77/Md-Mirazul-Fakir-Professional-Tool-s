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
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '../../lib/gemini';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: ImageData[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      extractedText: '',
      isProcessing: false
    }));

    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const extractTextForImage = async (imgId: string) => {
    const img = images.find(i => i.id === imgId);
    if (!img || !GEMINI_API_KEY) return;

    setImages(prev => prev.map(i => i.id === imgId ? { ...i, isProcessing: true } : i));

    try {
      const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      // Use flash for better speed
      const model = 'gemini-3-flash-preview';
      
      const base64Data = await getBase64(img.file);
      const imagePart = {
        inlineData: {
          data: base64Data.split(',')[1],
          mimeType: img.file.type
        }
      };

      const result = await genAI.models.generateContent({
        model: model,
        contents: {
          parts: [
            { text: "Extract all text from this image exactly as it appears. Maintain the formatting, lists, and structure as much as possible. Do not add any conversational text. Only return the extracted content." },
            imagePart
          ]
        }
      });

      const text = result.text || "";
      setImages(prev => prev.map(i => i.id === imgId ? { ...i, extractedText: text, isProcessing: false } : i));
    } catch (error) {
      console.error('Extraction failed:', error);
      setImages(prev => prev.map(i => i.id === imgId ? { ...i, isProcessing: false, extractedText: 'Error extracting text.' } : i));
    }
  };

  const extractAll = async () => {
    const toProcess = images.filter(img => !img.extractedText && !img.isProcessing);
    for (const img of toProcess) {
      await extractTextForImage(img.id);
    }
  };

  const generateWordDoc = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const sections = [];
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const children: any[] = [];

        // Heading for each image/page
        children.push(new Paragraph({
          text: `Page ${i + 1}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        }));

        // The text content
        if (img.extractedText) {
          const lines = img.extractedText.split('\n');
          lines.forEach(line => {
            children.push(new Paragraph({
              children: [new TextRun(line)],
              spacing: { after: 120 }
            }));
          });
        } else {
          children.push(new Paragraph({
            children: [new TextRun({ text: "[No text extracted for this image]", italics: true })],
            spacing: { after: 200 }
          }));
        }

        sections.push({
          properties: {},
          children: children
        });
      }

      const doc = new Document({
        sections: sections
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Picture_to_Word_${Date.now()}.docx`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Word Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Intelligent Doc Suite</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Picture <span className="text-blue-500">to Word</span>
            </h1>
          </div>
          
          {images.length > 0 && (
            <div className="flex items-center gap-4 bg-[#0a0a0a] p-3 rounded-2xl border border-white/5">
              <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{images.length} FILES QUEUED</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upload Area */}
            <div 
              onClick={() => { if(images.length === 0) fileInputRef.current?.click(); }}
              className={`relative group ${images.length === 0 ? 'cursor-pointer h-64 border-blue-500/20' : 'p-0 border-transparent'} bg-[#0a0a0a] border-2 border-dashed rounded-[40px] transition-all overflow-hidden`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple 
                accept="image/*" 
                className="hidden" 
              />
              
              {images.length === 0 ? (
                <div className="text-center space-y-4 relative z-10 w-full flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <FilePlus className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-300">Import Visual Data</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">JPG, PNG, WEBP • AI OCR ENABLED</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   {images.map((img, index) => (
                     <motion.div 
                        key={img.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0c0c0c] border border-white/5 rounded-[32px] overflow-hidden flex flex-col md:flex-row"
                     >
                        {/* Image Preview Block */}
                        <div className="w-full md:w-64 h-64 md:h-auto relative bg-black shrink-0">
                           <img src={img.preview} alt="preview" className="w-full h-full object-contain opacity-80" />
                           <div className="absolute top-4 left-4">
                              <span className="text-[10px] font-black text-white px-3 py-1.5 bg-blue-600 rounded-lg shadow-lg">#{index + 1}</span>
                           </div>
                           <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveImage(index, 'up'); }}
                                disabled={index === 0}
                                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-30 backdrop-blur-md"
                              >
                                 <MoveUp className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveImage(index, 'down'); }}
                                disabled={index === images.length - 1}
                                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-30 backdrop-blur-md"
                              >
                                 <MoveDown className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                className="p-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                           </div>
                        </div>

                        {/* Content Block */}
                        <div className="flex-1 p-6 flex flex-col">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                 <Sparkles className="w-4 h-4 text-blue-400" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Transcription</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 {img.extractedText && (
                                   <button 
                                    onClick={() => copyText(img.extractedText!, img.id)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
                                   >
                                      {copied === img.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                   </button>
                                 )}
                                 <button 
                                  onClick={() => extractTextForImage(img.id)}
                                  disabled={img.isProcessing}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                 >
                                    {img.isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                    {img.extractedText ? 'Re-scan' : 'Scan Image'}
                                 </button>
                              </div>
                           </div>

                           <div className="flex-1 bg-black/50 rounded-2xl p-4 border border-white/5 min-h-[120px] max-h-[250px] overflow-y-auto">
                              {img.isProcessing ? (
                                <div className="h-full flex flex-col items-center justify-center gap-3 py-8">
                                   <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI is reading the visual data...</p>
                                </div>
                              ) : img.extractedText ? (
                                <p className="text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">{img.extractedText}</p>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-2 opacity-20">
                                   <FileText className="w-8 h-8" />
                                   <p className="text-[9px] font-black uppercase tracking-widest">No data extracted yet</p>
                                </div>
                              )}
                           </div>
                        </div>
                     </motion.div>
                   ))}
                   
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-blue-500/20 transition-all group"
                   >
                      <Plus className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-300">Append more images</span>
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] p-8 rounded-[48px] border border-white/5 space-y-8 sticky top-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">Export <span className="text-blue-500">Batch</span></h3>
               </div>

               <div className="space-y-4">
                  <button 
                    onClick={extractAll}
                    disabled={images.length === 0 || images.every(i => i.extractedText) || images.some(i => i.isProcessing)}
                    className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2 border border-white/10"
                  >
                     <Sparkles className="w-4 h-4 text-blue-500" />
                     Scan All Images
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="bg-blue-600/5 rounded-3xl p-6 border border-blue-500/10 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Output Format</p>
                     <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                              <FileText className="w-7 h-7" />
                           </div>
                           <span className="text-[9px] font-black text-blue-500">DOCX</span>
                        </div>
                     </div>
                  </div>
               </div>

               <button 
                onClick={generateWordDoc}
                disabled={images.length === 0 || isGenerating}
                className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/20 disabled:opacity-30 disabled:grayscale group active:scale-95"
               >
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                       Save as Word
                       <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
               </button>

               <AnimatePresence>
                 {isSuccess && (
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500"
                   >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Document compiled successfully</span>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="pt-6 border-t border-white/5">
                  <div className="bg-white/5 p-4 rounded-2xl space-y-2 text-center">
                     <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic underline decoration-blue-500/50">Developer Protocol</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed font-mono">POWERED BY GEMINI 3 FLASH FOR HIGH-PRECISION OCR & STRUCTURAL MAPPING.</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
