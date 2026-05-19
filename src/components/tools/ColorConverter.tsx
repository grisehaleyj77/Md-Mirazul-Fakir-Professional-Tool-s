import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, RefreshCw, Hash, Droplets, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ColorConverter = () => {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let newColor = '#';
    for (let i = 0; i < 6; i++) {
      newColor += letters[Math.floor(Math.random() * 16)];
    }
    setColor(newColor);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
            <Palette size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Visual Color Smith</h2>
            <p className="text-xs text-slate-500">Pick, convert and copy web-standard colors</p>
          </div>
        </div>
        <button
          onClick={getRandomColor}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-all shadow-md active:scale-95"
        >
          <RefreshCw size={18} />
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Picker & Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div 
              className="w-full h-40 rounded-2xl shadow-inner border border-slate-100 transition-colors duration-300 flex items-center justify-center relative group"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <span className={`font-mono font-bold text-lg px-4 py-2 rounded-xl backdrop-blur-md shadow-lg ${hsl && hsl.l > 60 ? 'text-black bg-white/40' : 'text-white bg-black/20'}`}>
                {color.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hex Color</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={color.replace('#', '')}
                      onChange={(e) => {
                        const val = e.target.value.substring(0, 6);
                        if (/^[0-9A-Fa-f]*$/.test(val)) {
                          setColor('#' + val);
                        }
                      }}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RGB */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Droplets size={18} className="text-blue-500" />
                  RGB
                </div>
                {rgb && (
                  <button
                    onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                    className={`p-2 rounded-lg transition-all ${copied === 'rgb' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-50 text-slate-400'}`}
                  >
                    {copied === 'rgb' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['r', 'g', 'b'].map((key) => (
                  <div key={key} className="bg-slate-50 p-3 rounded-xl text-center">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">{key}</span>
                    <span className="font-mono text-sm font-bold text-slate-700">{rgb ? rgb[key as keyof typeof rgb] : '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HSL */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Sliders size={18} className="text-purple-500" />
                  HSL
                </div>
                {hsl && (
                  <button
                    onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                    className={`p-2 rounded-lg transition-all ${copied === 'hsl' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-50 text-slate-400'}`}
                  >
                    {copied === 'hsl' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: 'h', l: 'hue' },
                  { k: 's', l: 'sat', u: '%' },
                  { k: 'l', l: 'light', u: '%' }
                ].map((item) => (
                  <div key={item.k} className="bg-slate-50 p-3 rounded-xl text-center">
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">{item.l}</span>
                    <span className="font-mono text-sm font-bold text-slate-700">
                      {hsl ? hsl[item.k as keyof typeof hsl] : '-'}{item.u || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CSS Snippet */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Tailwind / CSS Helper</h3>
            <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs overflow-x-auto space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-pink-400">background-color: <span className="text-white">{color}</span>;</span>
                <button onClick={() => handleCopy(`background-color: ${color};`, 'css1')} className="text-slate-500 hover:text-white transition-colors">
                  {copied === 'css1' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-400">className="<span className="text-white">bg-[{color}]</span>"</span>
                <button onClick={() => handleCopy(`bg-[${color}]`, 'css2')} className="text-slate-500 hover:text-white transition-colors">
                  {copied === 'css2' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
