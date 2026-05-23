import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeResult, Html5QrcodeScannerState } from 'html5-qrcode';
import { QrCode, Camera, Upload, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerType, setScannerType] = useState<'camera' | 'file'>('camera');
  const [copied, setCopied] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scannerType === 'camera' && isScanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          supportedScanTypes: [0] // SCAN_TYPE_CAMERA
        },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear scanner. ", error);
          });
        }
      };
    }
  }, [isScanning, scannerType]);

  const onScanSuccess = (decodedText: string, result: Html5QrcodeResult) => {
    setScanResult(decodedText);
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }
  };

  const onScanFailure = (error: string) => {
    // This is called for every frame where no QR is found.
    // We suppress the console output to avoid console flooding with ZXing errors.
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanResult(null);

    const html5QrCode = new Html5Qrcode("file-reader");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      setScanResult(decodedText);
    } catch (err: any) {
      // Gracefully capture the "No MultiFormat Readers were able to detect the code" error and show a user-friendly error
      setError("No valid QR code detected in this image. Please ensure the image is clear and contains a visible QR code.");
      console.warn("Scan failed gracefully:", err);
    }
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Bar / Header replacement for tool consistency */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <QrCode className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-gray-900">QR Scanner Elite</h2>
              <p className="text-sm font-medium text-gray-500">Fast, secure QR extraction from camera or images</p>
           </div>
           
           <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
              <button 
                onClick={() => { setScannerType('camera'); setScanResult(null); setIsScanning(true); }}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scannerType === 'camera' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Camera
              </button>
              <button 
                onClick={() => { setScannerType('file'); setScanResult(null); setIsScanning(false); }}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scannerType === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Scan Image
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {scannerType === 'camera' ? (
              <div className="bg-gray-900 rounded-[32px] overflow-hidden relative min-h-[400px] border border-gray-800 shadow-2xl flex flex-col items-center justify-center p-8">
                {!isScanning ? (
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-lg">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                    <button 
                      onClick={() => setIsScanning(true)}
                      className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform active:scale-95"
                    >
                      Initialize Camera
                    </button>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Requires browser camera permission</p>
                  </div>
                ) : (
                  <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-black border border-white/5">
                    <div id="reader" className="w-full"></div>
                    <div className="p-4 bg-gray-800/50 flex justify-center">
                       <button 
                         onClick={() => setIsScanning(false)}
                         className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                       >
                         Stop Scanning
                       </button>
                    </div>
                  </div>
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-black/40 flex items-center justify-center">
                     <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" style={{ top: '50%' }}></div>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-12 text-center space-y-6 hover:border-gray-300 transition-colors">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Upload QR Image</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">Drop your QR code image here or click to browse files</p>
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Choose File
                </button>
                
                <div id="file-reader" className="hidden"></div>
                
                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs bg-red-50 p-4 rounded-xl">
                    <XCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="bg-green-500/5 p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Scan Successful</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-green-600/60">Data Decrypted</p>
                </div>
              </div>
              
              <button 
                onClick={resetScanner}
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 font-mono text-sm break-all leading-relaxed min-h-[120px] text-gray-700">
                  {scanResult}
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all group"
                  >
                     {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                     {copied ? 'Copied to Clipboard' : 'Copy Result'}
                  </button>
                  
                  {isUrl(scanResult) ? (
                    <a 
                      href={scanResult} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10"
                    >
                       <ExternalLink className="w-4 h-4" />
                       Visit Link
                    </a>
                  ) : (
                    <button 
                      disabled
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-xs tracking-widest cursor-not-allowed"
                    >
                       <AlertCircle className="w-4 h-4 opacity-50" />
                       No Link Detected
                    </button>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
