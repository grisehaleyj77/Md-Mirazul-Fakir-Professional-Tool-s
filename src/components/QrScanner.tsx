import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { QrCode, Copy, Check, RefreshCcw, Camera, Upload, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function QrScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scannerMode === 'camera' && !scanResult) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      const scanner = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          scanner.clear();
        },
        (error) => {
          // Silent log for common scanning noise
        }
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Scanner cleanup error", err));
        }
      };
    }
  }, [scannerMode, scanResult]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      setScanResult(decodedText);
    } catch (err) {
      alert("No QR code found in this image.");
    }
  };

  const copyToClipboard = async () => {
    if (!scanResult) return;
    try {
      await navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
          <QrCode className="w-8 h-8 text-indigo-600" />
          QR Code Scanner
        </h2>
        <p className="text-neutral-500 text-lg">
          Instantly scan and decode QR codes from your camera or image files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Scanner Section */}
        <div className="flex flex-col gap-6">
          <div className="flex bg-neutral-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => {
                setScannerMode('camera');
                setScanResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scannerMode === 'camera'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
            <button
              onClick={() => {
                setScannerMode('upload');
                setScanResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scannerMode === 'upload'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>

          <div className="relative w-full aspect-square md:aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/5 flex items-center justify-center">
            {!scanResult ? (
              <>
                <div id="reader" className="w-full h-full"></div>
                {scannerMode === 'upload' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900/40 backdrop-blur-sm">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Select Image
                    </button>
                    <p className="text-white/60 text-sm">Select an image containing a QR code</p>
                  </div>
                )}
                {/* Decorative scanning line for camera mode */}
                {scannerMode === 'camera' && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500/30 rounded-[2rem] overflow-hidden">
                    <motion.div 
                      className="w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                      animate={{ top: ['10%', '90%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ position: 'absolute' }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-white h-full w-full bg-indigo-600/10">
                 <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                    <Check className="w-10 h-10 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold mb-2">Code Scanned!</h3>
                 <p className="text-neutral-400 mb-8 max-w-xs">The QR code has been successfully decoded.</p>
                 <button
                    onClick={resetScanner}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-md active:scale-95"
                 >
                    <RefreshCcw className="w-4 h-4" />
                    Scan Another
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="flex flex-col gap-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800">Scanned Result</h3>
            {scanResult && (
              <div className="flex gap-2">
                 <Tooltip content="Copy to clipboard">
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
                      copied 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </Tooltip>
                
                {isUrl(scanResult) && (
                   <Tooltip content="Open Link">
                    <a
                      href={scanResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all px-3 py-1.5 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          <div className="relative min-h-[300px] w-full bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm overflow-hidden flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col gap-4 text-left"
                >
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 font-mono text-sm break-all text-neutral-700 leading-relaxed max-h-[400px] overflow-y-auto">
                    {scanResult}
                  </div>
                  {isUrl(scanResult) && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <ExternalLink className="w-4 h-4 text-emerald-500" />
                      <span>This content appears to be a web URL.</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 text-neutral-300"
                >
                  <div className="relative">
                    <QrCode className="w-16 h-16 opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent h-full w-full" />
                  </div>
                  <p className="text-lg font-medium italic">
                    {scannerMode === 'camera' ? 'Detecting QR code...' : 'Waiting for upload...'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
             <div className="mt-1">
                <QrCode className="w-4 h-4 text-amber-600" />
             </div>
             <div className="text-xs text-amber-800 leading-relaxed">
                <p className="font-bold mb-1">Privacy Notice</p>
                Scanning happens entirely in your browser. Your images and camera feed are never sent to our servers.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
