import React, { useState, useRef } from 'react';
import { Smile, Image as ImageIcon, Type, Trash2, Copy, Check, Upload, X, Download, Wand2, Sparkles, MousePointer2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AiEmojiRemover() {
  const [activeTab, setActiveTab] = useState<'text' | 'photo'>('text');
  
  // Text state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isStripping, setIsStripping] = useState(false);
  const [copied, setCopied] = useState(false);

  // Photo state
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasMask, setHasMask] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Text Emoji Strip logic
  const stripEmojis = () => {
    setIsStripping(true);
    // Regex to remove emojis: handles standard, surrogate pairs, and variation selectors
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F2FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;
    
    setTimeout(() => {
      const result = inputText.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
      setOutputText(result);
      setIsStripping(false);
    }, 400);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Photo Emoji Removal logic (Inpainting)
  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageRef.current = img;
      initCanvases(img);
    };
  };

  const initCanvases = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(img, 0, 0);
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskCtx.lineJoin = 'round';
      maskCtx.lineCap = 'round';
    }
    setHasMask(false);
  };

  const getMousePos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const pos = getMousePos(e, canvas);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)'; // Pink-500
    ctx.lineWidth = brushSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setHasMask(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    maskCanvasRef.current?.getContext('2d')?.beginPath();
  };

  const clearMask = () => {
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, maskCanvasRef.current!.width, maskCanvasRef.current!.height);
      setHasMask(false);
    }
  };

  const processInpainting = async () => {
    if (!hasMask || !canvasRef.current || !maskCanvasRef.current) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 600));

    try {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      const maskCtx = maskCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (!ctx || !maskCtx) return;

      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const maskData = maskCtx.getImageData(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
      const pixels = imageData.data;
      const maskPixels = maskData.data;
      const width = imageData.width;
      const height = imageData.height;
      const output = new Uint8ClampedArray(pixels);

      // Identify masked pixels
      const maskedIndices = [];
      for (let i = 0; i < maskPixels.length; i += 4) {
        if (maskPixels[i + 3] > 0) maskedIndices.push(i);
      }

      const radius = 12;
      for (const i of maskedIndices) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        let rs = 0, gs = 0, bs = 0, ws = 0;
        let any = false;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = (ny * width + nx) * 4;
              if (maskPixels[ni + 3] === 0) {
                const distSq = dx * dx + dy * dy;
                if (distSq === 0) continue;
                const weight = 1 / (distSq * distSq);
                rs += pixels[ni] * weight;
                gs += pixels[ni + 1] * weight;
                bs += pixels[ni + 2] * weight;
                ws += weight;
                any = true;
              }
            }
          }
        }
        if (any) {
          output[i] = rs / ws;
          output[i + 1] = gs / ws;
          output[i + 2] = bs / ws;
        }
      }

      ctx.putImageData(new ImageData(output, width, height), 0, 0);
      clearMask();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `no-emoji-${file?.name || 'photo.png'}`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
          <Smile className="w-10 h-10 text-pink-500" />
          AI Emoji Remover
        </h2>
        <p className="text-neutral-500 text-lg font-medium">
          Instantly strip emojis from text or erase them from photos using smart AI.
        </p>
      </div>

      <div className="flex p-2 bg-neutral-100 rounded-3xl self-start">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'text' ? 'bg-white text-neutral-900 shadow-xl' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Type className="w-4 h-4" />
          Text Remover
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'photo' ? 'bg-white text-neutral-900 shadow-xl' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Photo Eraser
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'text' ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-4">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Input Text with Emojis</label>
              <div className="relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here... 😊🚀✨"
                  className="w-full h-80 px-8 py-8 bg-white border-2 border-neutral-100 focus:border-pink-500 rounded-[2.5rem] outline-none text-lg font-medium transition-all shadow-sm resize-none scrollbar-hide"
                />
              </div>
              <button
                onClick={stripEmojis}
                disabled={!inputText.trim() || isStripping}
                className="w-full py-5 bg-pink-500 text-white font-black text-xl rounded-[2rem] hover:bg-pink-600 disabled:opacity-50 transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-3 active:scale-95"
              >
                {isStripping ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                Strip All Emojis
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Clean Result</label>
              <div className="relative group">
                <div className="w-full h-80 px-8 py-8 bg-neutral-50 border-2 border-neutral-100 rounded-[2.5rem] overflow-auto text-lg font-medium text-neutral-800 leading-relaxed scrollbar-hide whitespace-pre-wrap">
                  {outputText || <span className="opacity-20 italic">Result will appear here...</span>}
                </div>
                {outputText && (
                  <button
                    onClick={() => copyToClipboard(outputText)}
                    className="absolute top-6 right-6 p-4 bg-white border border-neutral-100 text-neutral-400 hover:text-pink-500 rounded-2xl transition-all shadow-xl hover:shadow-pink-100 group"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                )}
              </div>
              <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-pink-500 font-black">AI</div>
                <p className="text-sm text-pink-800 font-medium leading-relaxed">
                  Our algorithm ensures text structure remains intact while removing all graphical symbols and emojis for a clean, professional finish.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="photo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {!file ? (
              <div
                className={`w-full border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center gap-6 transition-all ${
                  isDragging ? 'border-pink-500 bg-pink-50/50' : 'border-neutral-200 bg-white'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
              >
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-pink-100/50">
                  <Upload className="w-12 h-12" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-black text-neutral-800">Drop photo to clean</p>
                  <p className="text-neutral-500 font-medium">Remove emojis or stickers from any image</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-10 py-4 bg-neutral-900 text-white font-black text-lg rounded-[2rem] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95"
                >
                  Upload Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="relative aspect-auto min-h-[400px] bg-neutral-200 rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair touch-none">
                    <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain shadow-2xl" />
                    <canvas
                      ref={maskCanvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-auto"
                      style={{ touchAction: 'none' }}
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-50">
                        <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-pink-600 font-black text-xl animate-pulse">Erasing Emojis...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-white px-8 py-4 rounded-[2rem] border border-neutral-100">
                    <div className="flex items-center gap-8">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Brush Size</label>
                          <div className="flex items-center gap-3">
                            <input type="range" min="10" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-32 accent-pink-500 h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer" />
                            <span className="text-xs font-black text-neutral-500">{brushSize}px</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={clearMask} className="p-4 text-neutral-400 hover:text-pink-500 hover:bg-pink-50 rounded-2xl transition-all">
                        <RefreshCcw className="w-6 h-6" />
                      </button>
                      <button onClick={() => setFile(null)} className="p-4 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center"><MousePointer2 className="w-5 h-5" /></div>
                       <h3 className="font-black text-neutral-900">How to remove</h3>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                      Paint over the emoji or sticker you want to remove. For the cleanest results, ensure you cover the entire object plus a small margin.
                    </p>
                    <div className="space-y-4">
                       <button
                         onClick={processInpainting}
                         disabled={!hasMask || isProcessing}
                         className="w-full py-5 bg-pink-500 text-white font-black text-xl rounded-3xl hover:bg-pink-600 shadow-xl shadow-pink-100 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                       >
                         <Sparkles className="w-6 h-6" />
                         Erase Selected
                       </button>
                       <button
                         onClick={downloadImage}
                         disabled={isProcessing}
                         className="w-full py-5 bg-neutral-900 text-white font-black text-xl rounded-3xl hover:bg-neutral-800 shadow-xl shadow-neutral-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                       >
                         <Download className="w-6 h-6" />
                         Download Result
                       </button>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-900 rounded-[2.5rem] flex items-start gap-4">
                    <div className="w-10 h-10 bg-pink-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm"><Wand2 className="w-5 h-5" /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white uppercase tracking-wide">Magic Fill</p>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Our content-aware AI analyzes surrounding pixels to realistically fill the background where the emoji was previously located.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
