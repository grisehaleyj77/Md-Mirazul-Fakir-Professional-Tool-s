import React, { useState, useRef, useCallback } from 'react';
import { Camera, Save, Trash2, ChevronLeft, ChevronRight, Download, Loader2, RotateCw, Image as ImageIcon, Sparkles, Plus, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

interface ScannedPage {
  id: string;
  url: string;
  brightness: number;
  contrast: number;
  grayscale: boolean;
}

export const ScanToPDF = () => {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      alert('Could not access camera. Please ensure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const url = canvas.toDataURL('image/jpeg', 0.9);
        const newPage: ScannedPage = {
          id: Math.random().toString(36).substr(2, 9),
          url,
          brightness: 100,
          contrast: 100,
          grayscale: false
        };
        setPages([...pages, newPage]);
      }
    }
  };

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
    if (selectedPageIndex !== null) setSelectedPageIndex(null);
  };

  const updatePageStyle = (id: string, updates: Partial<ScannedPage>) => {
    setPages(pages.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generatePDF = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        
        const page = pages[i];
        
        // Process image with filters using a canvas
        const img = new Image();
        img.src = page.url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = `brightness(${page.brightness}%) contrast(${page.contrast}%) ${page.grayscale ? 'grayscale(100%)' : ''}`;
          ctx.drawImage(img, 0, 0);
          const filteredUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Calculate dimensions to fit A4
          const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
          const drawWidth = img.width * ratio;
          const drawHeight = img.height * ratio;
          const x = (pdfWidth - drawWidth) / 2;
          const y = (pdfHeight - drawHeight) / 2;

          pdf.addImage(filteredUrl, 'JPEG', x, y, drawWidth, drawHeight);
        }
      }

      pdf.save(`scan_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Camera className="w-8 h-8 text-blue-600" />
            Scan to PDF
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Multi-page document scanner</p>
        </div>
        
        {pages.length > 0 && (
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save as PDF ({pages.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-4">
          {!isCameraActive ? (
            <div className="bg-white rounded-[40px] aspect-[3/4] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-blue-400 transition-all" onClick={startCamera}>
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black mb-2">Ready to Scan?</h3>
              <p className="text-gray-400 text-sm font-medium">Position your document and tap to start the camera.</p>
            </div>
          ) : (
            <div className="relative bg-black rounded-[40px] aspect-[3/4] overflow-hidden shadow-2xl">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8">
                <button 
                  onClick={stopCamera}
                  className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  onClick={capturePage}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all p-2"
                >
                  <div className="w-full h-full border-4 border-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full" />
                  </div>
                </button>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white relative">
                   <span className="text-lg font-black">{pages.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls & Pages */}
        <div className="space-y-6">
          {/* Active Page Editor */}
          {selectedPageIndex !== null && pages[selectedPageIndex] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Adjust Page {selectedPageIndex + 1}</h4>
                <button onClick={() => deletePage(pages[selectedPageIndex].id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-gray-400">
                    <span>Brightness</span>
                    <span>{pages[selectedPageIndex].brightness}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={pages[selectedPageIndex].brightness}
                    onChange={(e) => updatePageStyle(pages[selectedPageIndex].id, { brightness: parseInt(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-gray-400">
                    <span>Contrast</span>
                    <span>{pages[selectedPageIndex].contrast}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={pages[selectedPageIndex].contrast}
                    onChange={(e) => updatePageStyle(pages[selectedPageIndex].id, { contrast: parseInt(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-black uppercase text-gray-500">B&W Filter</span>
                  <button 
                    onClick={() => updatePageStyle(pages[selectedPageIndex].id, { grayscale: !pages[selectedPageIndex].grayscale })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${pages[selectedPageIndex].grayscale ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pages[selectedPageIndex].grayscale ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scanned Pages List */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pages ({pages.length})</h4>
             <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {pages.map((page, index) => (
                 <div 
                   key={page.id}
                   onClick={() => setSelectedPageIndex(index)}
                   className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedPageIndex === index ? 'border-blue-500 shadow-lg' : 'border-transparent shadow-sm'}`}
                 >
                   <img 
                      src={page.url} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-full object-cover"
                      style={{ 
                        filter: `brightness(${page.brightness}%) contrast(${page.contrast}%) ${page.grayscale ? 'grayscale(100%)' : ''}` 
                      }}
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-black text-lg">{index + 1}</span>
                   </div>
                   {selectedPageIndex === index && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                   )}
                 </div>
               ))}
               <button 
                onClick={() => {
                  if(!isCameraActive) startCamera();
                  setSelectedPageIndex(null);
                }}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-blue-200 hover:text-blue-300 transition-all bg-gray-50/30"
               >
                 <Plus className="w-6 h-6" />
                 <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Add Page</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
