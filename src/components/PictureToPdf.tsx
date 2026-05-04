import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, FileDown, X, Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function PictureToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const newImages: ImageFile[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (idToRemove: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      // Revoke object URLs to avoid memory leaks
      const removed = prev.find((img) => img.id === idToRemove);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
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
        
        // Load image to get dimensions
        const img = new Image();
        img.src = image.previewUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgRatio = img.width / img.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        // Fit image within PDF page while maintaining aspect ratio
        if (imgRatio > pdfRatio) {
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalWidth = pdfHeight * imgRatio;
        }
        
        // Center the image
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, finalWidth, finalHeight);
      }
      
      pdf.save('converted-images.pdf');
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
          Picture to PDF Converter
        </h2>
        <p className="text-neutral-500 text-lg">
          Upload images and convert them into a single PDF document.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Dropzone */}
        <div
          className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-neutral-300 bg-white hover:border-indigo-400 hover:bg-neutral-50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              // Reset input so the same file can be selected again if needed
              e.target.value = '';
            }}
          />
          
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-800">
              Drag & drop images here
            </p>
            <p className="text-neutral-500 mt-1">
              or click to browse from your device
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
          >
            Select Images
          </button>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Selected Images ({images.length})
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
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 group bg-neutral-100"
                  >
                    <img
                      src={img.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Tooltip content="Remove image">
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
                
                <motion.button
                  layout
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all gap-2"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm font-medium">Add More</span>
                </motion.button>
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
