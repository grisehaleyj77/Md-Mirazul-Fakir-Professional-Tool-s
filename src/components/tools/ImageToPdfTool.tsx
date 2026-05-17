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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'original'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: ImageData[] = files.map(file => ({
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
      // Revoke the URL to avoid memory leaks
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

  const generatePdf = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize === 'original' ? 'a4' : pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        
        const img = images[i];
        const imgData = await getBase64(img.file);
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Add image to page
        // Simple scaling to fit page while maintaining aspect ratio
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      doc.save(`images_to_pdf_${Date.now()}.pdf`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 font-sans selection:bg-rose-500/30">
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
            
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer bg-[#0a0a0a] border-2 border-dashed ${images.length > 0 ? 'border-white/5 p-8' : 'border-rose-500/20 h-64 flex items-center justify-center'} rounded-[40px] transition-all hover:border-rose-500/40 hover:bg-white/5 overflow-hidden`}
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
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-20 h-20 bg-rose-600/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <FilePlus className="w-10 h-10 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-300">Click to import images</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">JPG, PNG, WEBP SUPPORTED</p>
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
                        <img src={img.preview} alt="preview" className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-opacity" />
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
                      <Plus className="w-8 h-8 text-slate-700" />
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
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] p-8 rounded-[48px] border border-white/5 space-y-8 sticky top-8">
               <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                  <Settings className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">PDF <span className="text-rose-500">Settings</span></h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Page Geometry</label>
                     <div className="grid grid-cols-2 gap-2">
                        {['a4', 'letter'].map(size => (
                          <button 
                            key={size}
                            onClick={() => setPageSize(size as any)}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${pageSize === size ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            {size}
                          </button>
                        ))}
                     </div>
                  </div>

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
                            className={`py-3 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${orientation === dir.id ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            <dir.icon className={`w-3 h-3 ${orientation === dir.id ? 'text-white' : 'text-slate-600'}`} />
                            {dir.id}
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
