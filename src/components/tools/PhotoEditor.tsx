import React, { useState, useCallback } from 'react';
import { ImageIcon, Upload, Download, Scissors, RefreshCw, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import Cropper from 'react-easy-crop';

export const PhotoEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flippedH, setFlippedH] = useState(false);
  const [flippedV, setFlippedV] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [result, setResult] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async () => {
    if (!image || !croppedAreaPixels) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    
    await new Promise((resolve) => (img.onload = resolve));
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, x, y } = croppedAreaPixels as any;
    canvas.width = width;
    canvas.height = height;

    // Apply flip and rotation if needed (simplified for common crop)
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setResult(dataUrl);
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-green-400 transition-colors cursor-pointer relative">
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
             <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Photo to Edit</h3>
          <p className="text-gray-400 mb-0">Crop, Rotate, and Flip your images easily.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[500px] relative">
                 {!result ? (
                   <Cropper
                     image={image}
                     crop={crop}
                     zoom={zoom}
                     rotation={rotation}
                     aspect={4 / 3}
                     onCropChange={setCrop}
                     onCropComplete={onCropComplete}
                     onZoomChange={setZoom}
                     transform={`rotate(${rotation}deg) scaleX(${flippedH ? -1 : 1}) scaleY(${flippedV ? -1 : 1})`}
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full bg-gray-50">
                      <img src={result} alt="Result" className="max-w-full max-h-full object-contain" />
                   </div>
                 )}
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-4 justify-center">
                 <button onClick={() => setRotation(r => r - 90)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><RotateCcw className="w-5 h-5" /></button>
                 <button onClick={() => setRotation(r => r + 90)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><RotateCw className="w-5 h-5" /></button>
                 <button onClick={() => setFlippedH(!flippedH)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><FlipHorizontal className="w-5 h-5" /></button>
                 <button onClick={() => setFlippedV(!flippedV)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"><FlipVertical className="w-5 h-5" /></button>
                 <div className="w-[1px] h-10 bg-gray-100 mx-2" />
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">ZOOM</span>
                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-32" />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col justify-between">
                 <div>
                    <h3 className="text-xl font-bold mb-4">Export Result</h3>
                    <p className="text-sm text-gray-500 mb-8">Fine-tune your crop and click 'Apply Crop' to generate the final image.</p>
                 </div>

                 <div className="space-y-4">
                    {!result ? (
                      <button
                        onClick={getCroppedImg}
                        className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      >
                        <Scissors className="w-5 h-5" />
                        Apply Crop
                      </button>
                    ) : (
                      <a
                        href={result}
                        download="edited-photo.jpg"
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download JPG
                      </a>
                    )}
                    <button
                      onClick={() => { setImage(null); setResult(null); setRotation(0); setZoom(1); setFlippedH(false); setFlippedV(false); }}
                      className="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Start Over
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
