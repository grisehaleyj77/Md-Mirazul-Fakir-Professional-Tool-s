import React, { useState } from 'react';
import { Wand2, Upload, Download, RefreshCw, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';

export const ImageBeautifier = () => {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%)`
    };
  };

  const reset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setSepia(0);
  };

  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image!;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%)`;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'beautified-image.jpg';
        link.click();
      }
    };
  };

  const Slider = ({ label, value, min, max, onChange }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-bold text-gray-400">
         <span className="uppercase">{label}</span>
         <span className="text-pink-500 font-mono">{value}</span>
      </div>
      <input 
        type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} 
        className="w-full accent-pink-500"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {!image ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-pink-400 transition-colors cursor-pointer relative">
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-4">
             <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Enhance Your Photos</h3>
          <p className="text-gray-400 mb-0">Apply professional AI-inspired filters and enhancements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                 <img src={image} alt="Preview" style={getFilterStyle()} className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-300" />
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <SlidersHorizontal className="w-5 h-5 text-pink-500" />
                       Adjustments
                    </h3>
                    <button onClick={reset} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-all"><RefreshCw className="w-4 h-4" /></button>
                 </div>

                 <div className="space-y-6">
                    <Slider label="Brightness" value={brightness} min={0} max={200} onChange={setBrightness} />
                    <Slider label="Contrast" value={contrast} min={0} max={200} onChange={setContrast} />
                    <Slider label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} />
                    <Slider label="Blur" value={blur} min={0} max={10} onChange={setBlur} />
                    <Slider label="Sepia" value={sepia} min={0} max={100} onChange={setSepia} />
                 </div>

                 <div className="pt-4 space-y-4">
                    <button
                      onClick={downloadImage}
                      className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-600/20"
                    >
                      <Download className="w-5 h-5" />
                      Save & Download
                    </button>
                    <button
                      onClick={() => setImage(null)}
                      className="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Select Different Image
                    </button>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white">
                 <h4 className="font-bold mb-2">Pro Tip</h4>
                 <p className="text-xs text-pink-100 leading-relaxed">Increasing contrast and saturation slightly makes photos look more "vibrant" and professional.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
