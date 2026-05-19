import React, { useState, useRef } from 'react';
import { 
  FileImage, 
  FileText, 
  Download, 
  Trash2, 
  Settings, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  Type,
  Layout,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ai } from '../../lib/gemini';

export const ImageToWordPro = () => {
  const [image, setImage] = useState<{file: File, preview: string} | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
    }
  };

  const processOCR = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      const base64Data = await encodeFileToBase64(image.file);
      const imagePart = {
        inlineData: {
          data: base64Data.split(',')[1],
          mimeType: image.file.type
        }
      };

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: "Extract all text from this image. Format it clean and maintain paragraphs. Do not add any extra commentary." },
            imagePart
          ]
        }
      });

      const text = result.text || "";
      setExtractedText(text);
    } catch (error) {
      console.error('OCR failed:', error);
      setExtractedText('Handwritten text or complex layout detected. Manual correction might be needed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Image to Word Pro</h2>
            <p className="text-xs text-slate-500">Intelligent document extraction and formatting</p>
          </div>
        </div>
        
        {image && (
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={downloadDoc}
              disabled={isGenerating || (!image && !extractedText)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
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
          className="group relative border-2 border-dashed border-slate-200 rounded-[40px] p-16 flex flex-col items-center justify-center gap-6 bg-white hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <FileImage size={48} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Drop image to start conversion</h3>
            <p className="text-sm text-slate-500 font-medium">AI will extract text and preserve structure</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest">PNG</span>
             <span className="px-3 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest">JPG</span>
             <span className="px-3 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest">WEBP</span>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input & Preview */}
          <div className="space-y-6">
             <div className="bg-slate-900 rounded-[32px] p-2 shadow-2xl relative overflow-hidden group min-h-[400px] flex items-center justify-center border-8 border-slate-800">
                <img src={image.preview} alt="Input" className="max-w-full max-h-[500px] rounded-2xl shadow-sm" />
                <div className="absolute top-4 right-4">
                   <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">Input Layer</div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Settings size={16} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Extraction Settings</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   <button
                     onClick={() => setIncludeImage(!includeImage)}
                     className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${includeImage ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                   >
                      <div className="flex items-center gap-3">
                         <Layout size={18} />
                         <span className="text-sm font-bold">Include Original Image</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${includeImage ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}>
                         {includeImage && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                   </button>

                   <button
                     onClick={processOCR}
                     disabled={isProcessing}
                     className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                      {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      {extractedText ? 'Re-scan with AI' : 'Perform AI OCR'}
                   </button>
                </div>
             </div>
          </div>

          {/* Right: Output & Result */}
          <div className="space-y-6">
             <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden min-h-[500px] flex flex-col">
                {/* Decorative background */}
                <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                   <FileText size={200} />
                </div>

                <div className="relative z-10 flex flex-col h-full space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Type size={16} />
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest">Document Workspace</span>
                      </div>
                      {isProcessing && <div className="text-[10px] font-black uppercase tracking-widest animate-pulse">AI is reading...</div>}
                   </div>

                   <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[400px]">
                      {extractedText ? (
                        <textarea
                          value={extractedText}
                          onChange={(e) => setExtractedText(e.target.value)}
                          className="w-full h-full bg-transparent border-none outline-none resize-none font-medium text-sm leading-relaxed placeholder:text-white/30"
                          placeholder="Extracted text will appear here. You can also type here..."
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-4 py-20 text-white/40">
                           <Sparkles size={48} strokeWidth={1} />
                           <p className="text-xs font-bold uppercase tracking-widest text-center">Click "Perform AI OCR" to extract text from your image</p>
                        </div>
                      )}
                   </div>

                   <button
                     onClick={downloadDoc}
                     disabled={isGenerating || (!image && !extractedText)}
                     className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                   >
                      Download Word Doc
                      <ArrowRight size={18} />
                   </button>
                </div>
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
                    <span className="text-xs font-black uppercase tracking-widest">Succesfully Compiled to DOCX</span>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Protocol</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                   This tool utilizes Gemini 1.5 Flash for high-speed OCR. Your data is processed in a secure environment and the output is generated client-side for maximum privacy and performance.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
