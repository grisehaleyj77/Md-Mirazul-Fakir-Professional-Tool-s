import React from 'react';
import { Construction } from 'lucide-react';

export const PlaceholderTool = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10">
    <Construction className="w-12 h-12 text-blue-600 mb-4" />
    <h3 className="text-xl font-bold mb-2">{name}</h3>
    <p className="text-slate-500 text-center max-w-xs">This tool is currently being optimized for the best AI experience. Coming soon!</p>
  </div>
);

export const OCRTool = () => <PlaceholderTool name="OCR Tool" />;
export const QRSuite = () => <PlaceholderTool name="QR Suite" />;
export const ImageBeautifier = () => <PlaceholderTool name="Image Beautifier" />;
export const WatermarkRemover = () => <PlaceholderTool name="Watermark Remover" />;
export const PictureMagicLayers = () => <PlaceholderTool name="Magic Layers" />;
export const Calculator = () => <PlaceholderTool name="Calculator" />;
export const HEICConverter = () => <PlaceholderTool name="HEIC Converter" />;
export const ScanToPDF = () => <PlaceholderTool name="Scan to PDF" />;
