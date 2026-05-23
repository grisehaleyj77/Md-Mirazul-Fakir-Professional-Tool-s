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
  Maximize2,
  Sparkles,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

interface ImageData {
  id: string;
  file: File;
  preview: string;
}

export const ImageToPdfTool = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [layoutMode, setLayoutMode] = useState<'fit' | 'fill' | 'stretch'>('fit');
  const [marginSize, setMarginSize] = useState<'none' | 'thin' | 'wide'>('none');
  const [filename, setFilename] = useState("my_scanned_document");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newImages: ImageData[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
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

  const getImageDims = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = url;
    });
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        
        const img = images[i];
        const imgData = await getBase64(img.file);
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const dims = await getImageDims(img.preview);
        
        let margin = 0;
        if (marginSize === 'thin') margin = 5;
        if (marginSize === 'wide') margin = 15;

        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);

        let finalWidth = availableWidth;
        let finalHeight = availableHeight;
        let x = margin;
        let y = margin;

        if (dims.width > 0 && dims.height > 0) {
          const imgRatio = dims.width / dims.height;
          const pageRatio = availableWidth / availableHeight;

          if (layoutMode === 'fit') {
            if (imgRatio > pageRatio) {
              finalWidth = availableWidth;
              finalHeight = availableWidth / imgRatio;
              y = margin + (availableHeight - finalHeight) / 2;
            } else {
              finalHeight = availableHeight;
              finalWidth = availableHeight * imgRatio;
              x = margin + (availableWidth - finalWidth) / 2;
            }
          } else if (layoutMode === 'fill') {
            if (imgRatio > pageRatio) {
              finalHeight = availableHeight;
              finalWidth = availableHeight * imgRatio;
              x = margin + (availableWidth - finalWidth) / 2;
            } else {
              finalWidth = availableWidth;
              finalHeight = availableWidth / imgRatio;
              y = margin + (availableHeight - finalHeight) / 2;
            }
          } else {
            finalWidth = availableWidth;
            finalHeight = availableHeight;
            x = margin;
            y = margin;
          }
        }

        doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');
      }

      const saveName = filename.trim() ? filename.trim().replace(/[^a-zA-Z0-9_\-]/g, "_") : "document";
      doc.save(`${saveName}.pdf`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-rose-500/30" id="pic-to-pdf-tool-root">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                <FileImage className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Visual Document Studio</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Picture <span className="text-rose-500">to PDF</span>
            </h1>
          </div>
          
          {images.length > 0 && (
            <div className="flex items-center gap-4 bg-[#0a0a0a] p-3 rounded-2xl border border-white/5">
              <div className="px-4 py-2 bg-rose-600/10 border border-rose-500/20 rounded-xl">
                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{images.length} IMAGES SELECTED</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upload Area / Sandbox */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer bg-[#0a0a0a] border-2 border-dashed rounded-[40px] transition-all overflow-hidden ${
                isDragging 
                  ? 'border-rose-500 bg-rose-950/10 scale-[1.01]' 
                  : images.length > 0 
                    ? 'border-white/5 p-8' 
                    : 'border-rose-500/20 h-64 flex items-center justify-center'
              }`}
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
                <div className="text-center space-y-4 relative z-10 pointer-events-none">
                  <div className="w-20 h-20 bg-rose-600/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <FilePlus className="w-10 h-10 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-300">Drag & Drop or Click to Import</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">JPG, PNG, WEBP, GIF SUPPORTED</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {images.map((img, index) => (
                     <motion.div 
                        key={img.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group/card aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-white/10"
                     >
                        <img src={img.preview} alt="preview" className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                           <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover/card:opacity-100 transition-opacity">
                           <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveImage(index, 'up'); }}
                                disabled={index === 0}
                                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-30 backdrop-blur-md"
                              >
                                 <MoveUp className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveImage(index, 'down'); }}
                                disabled={index === images.length - 1}
                                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-30 backdrop-blur-md"
                              >
                                 <MoveDown className="w-3 h-3" />
                              </button>
                           </div>
                           <span className="text-[10px] font-black text-white px-2 py-1 bg-rose-600 rounded-lg shadow-lg">#{index + 1}</span>
                        </div>
                     </motion.div>
                   ))}
                   <div 
                    className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center hover:bg-white/5 transition-colors"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                   >
                      <Plus className="w-8 h-8 text-slate-705" />
                   </div>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                       <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                       <p className="text-sm font-black uppercase text-white italic tracking-tighter">Ready for compilation</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized for web delivery</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setImages([])}
                  className="px-6 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                 >
                    Clear All
                 </button>
              </div>
            )}
          </div>

          {/* Settings & Action */}
          <div className="space-y-8" id="pic-to-pdf-settings-section">
            <div className="bg-[#0a0a0a] p-8 rounded-[48px] border border-white/5 space-y-8 sticky top-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <Settings className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">PDF <span className="text-rose-500">Settings</span></h3>
               </div>

               <div className="space-y-6">
                  {/* Filename Input */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-505 ml-2 flex items-center gap-1.5 text-slate-400">
                        <Type className="h-3.5 w-3.5 text-rose-500" />
                        Output Filename
                     </label>
                     <input
                       type="text"
                       value={filename}
                       onChange={(e) => setFilename(e.target.value)}
                       placeholder="Enter PDF filename"
                       className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold font-mono outline-none text-white focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/40"
                     />
                  </div>

                  {/* Page Geometry */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Page Size</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['a4', 'letter', 'legal'].map(size => (
                          <button 
                            key={size}
                            onClick={() => setPageSize(size as any)}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${pageSize === size ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            {size}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Orientation */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Orientation</label>
                     <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'portrait', icon: MoveDown },
                          { id: 'landscape', icon: ArrowRight }
                        ].map(dir => (
                          <button 
                            key={dir.id}
                            onClick={() => setOrientation(dir.id as any)}
                            className={`py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${orientation === dir.id ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            <dir.icon className={`w-3 h-3 ${orientation === dir.id ? 'text-white' : 'text-slate-600'}`} />
                            {dir.id}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Layout mode (Fitting aspect ratio) */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-1">
                        <Maximize2 className="h-3 w-3 text-rose-500" />
                        Fitting Layout
                     </label>
                     <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'fit', label: 'Fit Page' },
                          { id: 'fill', label: 'Fill / Bleed' },
                          { id: 'stretch', label: 'Stretch' }
                        ].map(mode => (
                          <button 
                            key={mode.id}
                            onClick={() => setLayoutMode(mode.id as any)}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${layoutMode === mode.id ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                            title={mode.label}
                          >
                            {mode.label}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Margins */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Margins</label>
                     <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'none', label: 'None' },
                          { id: 'thin', label: 'Thin (5mm)' },
                          { id: 'wide', label: 'Wide (15mm)' }
                        ].map(margin => (
                          <button 
                            key={margin.id}
                            onClick={() => setMarginSize(margin.id as any)}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${marginSize === margin.id ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                            title={margin.label}
                          >
                            {margin.id}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <button 
                onClick={generatePdf}
                disabled={images.length === 0 || isGenerating}
                className="w-full h-20 bg-rose-600 hover:bg-rose-500 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-rose-600/20 disabled:opacity-30 disabled:grayscale group active:scale-95"
               >
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                       Compile PDF
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
                  <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                     <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic underline decoration-rose-500/50">Performance Logic</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed font-mono">CLIENT-SIDE PROCESSING ACTIVE. NO DATA IS PERSISTED ON EXTERNAL SERVERS. PRIVACY ENFORCED.</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
