import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check, Type, Palette, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function QrGenerator() {
  const [text, setText] = useState('https://google.com');
  const [qrColor, setQrColor] = useState('#4f46e5'); // indigo-600
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(300);
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrUrl('');
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: qrSize,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H'
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [text, qrColor, bgColor, qrSize]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 text-indigo-600" />
          QR Code Generator
        </h2>
        <p className="text-neutral-500 text-lg">
          Create custom, high-resolution QR codes with personalized colors and styles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Settings Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Content (URL or Text)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text to encode..."
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  QR Color
                </label>
                <div className="flex items-center gap-3 p-2 border border-neutral-200 rounded-2xl">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-sm font-mono text-neutral-500 uppercase">{qrColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <div className="w-4 h-4 border border-neutral-400 rounded-sm" />
                  Background
                </label>
                <div className="flex items-center gap-3 p-2 border border-neutral-200 rounded-2xl">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-sm font-mono text-neutral-500 uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold text-neutral-700">Size ({qrSize}px)</label>
               <input 
                  type="range" 
                  min="128" 
                  max="1024" 
                  step="64"
                  value={qrSize} 
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
               <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Small</span>
                  <span>Large</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start">
            <Share2 className="w-5 h-5 text-indigo-600 mt-0.5" />
            <p className="text-xs text-indigo-800 leading-relaxed">
              Standard QR codes can store up to 7,089 numeric characters or 4,296 alphanumeric characters. 
              The level of detail increases with the amount of data.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col gap-6 items-center">
          <div className="relative group p-8 bg-white border border-neutral-200 rounded-[2.5rem] shadow-xl ring-1 ring-black/5">
            <div className="absolute inset-0 bg-neutral-50 rounded-[2.5rem] -z-10 group-hover:scale-105 transition-transform duration-500" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={qrUrl}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 p-4 bg-white rounded-3xl shadow-inner border border-neutral-100"
              >
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" className="w-[280px] h-[280px] object-contain rounded-xl" />
                ) : (
                  <div className="w-[280px] h-[280px] flex items-center justify-center bg-neutral-50 text-neutral-300 rounded-xl animate-pulse">
                    <QrCode className="w-16 h-16" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
            <Tooltip content="Copy text content">
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-6 py-4 font-semibold rounded-2xl transition-all border shadow-sm active:scale-95 ${
                  copied 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
