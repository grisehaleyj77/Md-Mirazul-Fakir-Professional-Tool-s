import React, { useState } from 'react';
import { ImageIcon, Upload, Download, Loader2, RefreshCw } from 'lucide-react';
import heic2any from 'heic2any';

export const HEICConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await heic2any({
        blob: file,
        toType: format,
        quality: 0.8
      });
      
      const blobs = Array.isArray(blob) ? blob : [blob];
      const url = URL.createObjectURL(blobs[0]);
      setResult(url);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please make sure it is a valid HEIC file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:border-cyan-400 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept=".heic" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-500 mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload HEIC File</h3>
          <p className="text-gray-400 mb-6 max-w-xs">Convert iPhone .heic photos to JPG or PNG instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
              <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Source (HEIC)</p>
              <div className="flex-1 min-h-[300px] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                  <div className="text-center p-8">
                     <ImageIcon className="w-12 h-12 text-cyan-500 mx-auto mb-2" />
                     <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                     <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
              </div>
              <div className="mt-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Output Format</label>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setFormat('image/jpeg')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${format === 'image/jpeg' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-gray-100 text-gray-500'}`}
                       >
                         JPG
                       </button>
                       <button 
                         onClick={() => setFormat('image/png')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${format === 'image/png' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-gray-100 text-gray-500'}`}
                       >
                         PNG
                       </button>
                    </div>
                 </div>
                 <button
                   onClick={convert}
                   disabled={isProcessing}
                   className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                   Convert to {format === 'image/jpeg' ? 'JPG' : 'PNG'}
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
              <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Result</p>
              <div className="flex-1 min-h-[300px] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 relative">
                 {isProcessing ? (
                   <div className="flex flex-col items-center">
                     <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                     <p className="text-sm font-bold text-gray-400">Converting...</p>
                   </div>
                 ) : result ? (
                   <img src={result} alt="Converted" className="w-full h-full object-contain p-4" />
                 ) : (
                   <div className="text-center p-8 opacity-30">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-xs">Preview will appear here</p>
                   </div>
                 )}
              </div>
              {result && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                   <a
                     href={result}
                     download={`converted-${Date.now()}.${format === 'image/jpeg' ? 'jpg' : 'png'}`}
                     className="bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                   >
                     <Download className="w-5 h-5" />
                     Download
                   </a>
                   <button
                     onClick={() => { setFile(null); setResult(null); }}
                     className="bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                   >
                     Reset
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
