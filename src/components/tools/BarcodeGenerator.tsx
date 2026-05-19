import React, { useState, useRef, useEffect } from 'react';
import { Barcode as BarcodeIcon, Download, Trash2, Settings, Type, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JsBarcode from 'jsbarcode';

export const BarcodeGenerator = () => {
  const [text, setText] = useState('123456789');
  const [format, setFormat] = useState('CODE128');
  const [displayValue, setDisplayValue] = useState(true);
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(2);
  const [margin, setMargin] = useState(10);
  const [background, setBackground] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && text.trim()) {
      try {
        JsBarcode(barcodeRef.current, text, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          margin: margin,
          background: background,
          lineColor: lineColor,
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [text, format, displayValue, height, width, margin, background, lineColor]);

  const handleDownload = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `barcode-${text}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const clear = () => {
    setText('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <BarcodeIcon size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Professional Barcode Smith</h2>
            <p className="text-xs text-slate-500">Generate high-fidelity barcodes for retail and logistics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            <Download size={18} />
            Download PNG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Barcode Text</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter value..."
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                >
                  <option value="CODE128">CODE128 (Auto)</option>
                  <option value="EAN13">EAN13</option>
                  <option value="UPC">UPC</option>
                  <option value="CODE39">CODE39</option>
                  <option value="ITF14">ITF14</option>
                  <option value="MSI">MSI</option>
                  <option value="PHARMACODE">Pharmacode</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Width</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 2)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Height</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="w-5 h-5 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-500/20 transition-all"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Show Label</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Lines</label>
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-slate-50 p-1 border border-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">BG</label>
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-slate-50 p-1 border border-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-12 rounded-[32px] shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center relative overflow-hidden group">
            {/* Artistic Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <AnimatePresence mode="wait">
              {text ? (
                <motion.div
                  key="barcode-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-50 relative z-10"
                >
                  <svg ref={barcodeRef} className="mx-auto" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto">
                    <BarcodeIcon size={40} />
                  </div>
                  <p className="text-slate-400 font-medium italic">Waiting for input...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 rounded-2xl flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Settings size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Vector Clarity</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  We use an industrial-grade SVG engine to ensure every line is mathematically precise, critical for scanning reliable results.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Zap size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Quick Tip</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  CODE128 is the most versatile format. If you're unsure which one to use, keep it on Auto for maximum compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
