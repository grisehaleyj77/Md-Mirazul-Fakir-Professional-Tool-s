import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Camera, FileDown, X, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

interface CapturedImage {
  id: string;
  dataUrl: string;
}

export default function ScanToPdf() {
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera. Please ensure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        setImages(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          dataUrl
        }]);
      }
    }
  };

  const removeImage = (idToRemove: string) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const img = new Image();
        img.src = image.dataUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgRatio = img.width / img.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        if (imgRatio > pdfRatio) {
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalWidth = pdfHeight * imgRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, finalWidth, finalHeight);
      }
      
      pdf.save('scanned-document.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          Scan to PDF
        </h2>
        <p className="text-neutral-500 text-lg">
          Use your device's camera to scan documents and convert them into a PDF.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Camera Section */}
        <div className="w-full bg-neutral-900 rounded-3xl overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center">
          {!isCameraActive ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8" />
              </div>
              <p className="text-neutral-300 mb-4">Camera is currently inactive</p>
              <button
                onClick={startCamera}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Start Camera
              </button>
              {cameraError && (
                <p className="text-red-400 mt-4 text-sm">{cameraError}</p>
              )}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full max-h-[60vh] object-contain bg-black"
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-neutral-800/80 text-white font-medium rounded-2xl hover:bg-neutral-700/80 backdrop-blur-sm transition-colors"
                >
                  Stop
                </button>
                <button
                  onClick={captureImage}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-neutral-900 font-bold rounded-2xl hover:bg-neutral-100 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Scanned Pages ({images.length})
              </h3>
              
              <button
                onClick={() => setImages([])}
                className="text-sm text-neutral-500 hover:text-red-500 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200 group bg-neutral-100"
                  >
                    <img
                      src={img.dataUrl}
                      alt={`Scanned page ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                      {index + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Tooltip content="Remove page">
                        <button
                          onClick={() => removeImage(img.id)}
                          className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={generatePDF}
                disabled={isGenerating || images.length === 0}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
