import React, { useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Send, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const QRSuite = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: 1000,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-teal-500" />
          Generate QR Code
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter URL or Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://google.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32"
            />
          </div>
          
          <button
            onClick={generateQRCode}
            disabled={!text || isGenerating}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
            Generate QR Code
          </button>
        </div>
      </div>

      {qrCodeUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center"
        >
          <div className="bg-gray-50 p-6 rounded-2xl inline-block mb-6">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={downloadQR}
              className="flex-1 bg-teal-500 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition-all"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
            <button
              onClick={() => {
                navigator.share ? navigator.share({
                  title: 'QR Code',
                  text: 'Check out this QR Code',
                  url: qrCodeUrl
                }) : alert('Share not supported');
              }}
              className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Send className="w-5 h-5" />
              Share
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
