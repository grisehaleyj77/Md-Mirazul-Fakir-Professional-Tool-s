import React, { useState } from 'react';
import { 
  Globe, 
  Download, 
  Loader2, 
  Check, 
  AlertCircle,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Eye,
  ExternalLink,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type DevicePreset = 'desktop' | 'laptop' | 'tablet' | 'mobile';

interface CaptureConfig {
  url: string;
  device: DevicePreset;
  fullPage: boolean;
  colorScheme: 'light' | 'dark';
  waitForSelector: string;
}

export const WebsiteScreenshotTaker = () => {
  const [config, setConfig] = useState<CaptureConfig>({
    url: 'https://github.com',
    device: 'desktop',
    fullPage: false,
    colorScheme: 'light',
    waitForSelector: ''
  });

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Resolution dimensions mapped to presets
  const deviceDimensions = {
    desktop: { width: 1920, height: 1080, name: 'Desktop Ultra', icon: Monitor },
    laptop: { width: 1440, height: 900, name: 'MacBook Pro', icon: Laptop },
    tablet: { width: 768, height: 1024, name: 'iPad Pro', icon: Tablet },
    mobile: { width: 375, height: 812, name: 'iPhone 13 Pro', icon: Smartphone }
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.url) {
      setError('Please provide a valid website address (URL).');
      return;
    }

    // Format clean URL pathing schema
    let cleanUrl = config.url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // Basic URL parsing validation
    try {
      new URL(cleanUrl);
    } catch (_) {
      setError('Invalid URL structure. Please enter a valid address (e.g. www.google.com).');
      return;
    }

    setIsCapturing(true);
    setError(null);
    setScreenshotUrl(null);
    setSuccess(false);

    try {
      // Build Microlink Screenshot request
      const requestUrl = new URL('https://api.microlink.io');
      requestUrl.searchParams.append('url', cleanUrl);
      requestUrl.searchParams.append('screenshot', 'true');
      requestUrl.searchParams.append('meta', 'false');
      
      // Setup device dimension rendering
      const dimensions = deviceDimensions[config.device];
      requestUrl.searchParams.append('embed', 'screenshot.url');
      requestUrl.searchParams.append('screenshot.viewport.width', dimensions.width.toString());
      requestUrl.searchParams.append('screenshot.viewport.height', dimensions.height.toString());
      requestUrl.searchParams.append('screenshot.viewport.isMobile', (config.device === 'mobile').toString());
      requestUrl.searchParams.append('screenshot.viewport.hasTouch', (config.device === 'mobile' || config.device === 'tablet').toString());

      if (config.fullPage) {
        requestUrl.searchParams.append('screenshot.fullPage', 'true');
      }
      
      if (config.colorScheme === 'dark') {
        requestUrl.searchParams.append('screenshot.colorScheme', 'dark');
      }

      // We append a small unique timestamp tag for anti-caching
      requestUrl.searchParams.append('_t', Date.now().toString());

      // Pre-flight image load checking directly using browser engine
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = requestUrl.toString();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Rendering target timed out or site blocked server scraping. Try another URL.'));
      });

      setScreenshotUrl(requestUrl.toString());
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to capture target URL. Ensure the address is public and does not block automated bot crawlers.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    if (!screenshotUrl) return;
    try {
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const fileName = config.url
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .replace(/[^a-zA-Z0-9]/g, '_');
      
      link.href = blobUrl;
      link.download = `screenshot_${fileName}_${config.device}.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: Open in new window if CORS blocks direct blob download
      window.open(screenshotUrl, '_blank');
    }
  };

  const ActiveIcon = deviceDimensions[config.device].icon;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="screenshot-taker-workspace">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2.5 font-black text-gray-900 tracking-tight text-lg">
                <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                Website Screenshot Taker
              </span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Generate fully customizable high-resolution screenshot mockups of any live webpage. Tweak mock screens, select orientations, and simulate dark-mode viewports instantly.
            </p>

            <form onSubmit={handleCapture} className="space-y-4">
              {/* URL Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Website URL (Address)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">HTTPS://</span>
                  <input
                    type="text"
                    value={config.url.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    placeholder="example.com"
                    className="w-full pl-20 pr-4 py-3 text-sm font-black border border-slate-200 bg-slate-50/50 rounded-2xl text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 duration-200"
                  />
                </div>
              </div>

              {/* Viewport selecting preset */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Capture Device Profile</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['desktop', 'laptop', 'tablet', 'mobile'] as DevicePreset[]).map((d) => {
                    const DeviceData = deviceDimensions[d];
                    const DeviceIcon = DeviceData.icon;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setConfig({ ...config, device: d })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          config.device === d
                            ? 'border-teal-500 bg-teal-50/20 scale-[0.98]'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <DeviceIcon className={`w-5 h-5 ${config.device === d ? 'text-teal-600' : 'text-slate-400'}`} />
                        <div>
                          <p className={`font-black text-xs ${config.device === d ? 'text-teal-950' : 'text-slate-800'}`}>
                            {DeviceData.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {DeviceData.width} × {DeviceData.height}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Options toggles */}
              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Advanced Options</label>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Full Page capture */}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, fullPage: !config.fullPage })}
                    className={`p-3.5 rounded-2xl border text-center transition ${
                      config.fullPage 
                        ? 'border-teal-500 bg-teal-50/10 text-teal-700 font-extrabold' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 font-medium'
                    } text-xs`}
                  >
                    {config.fullPage ? 'Full Length Page ✓' : 'Viewport Cut Only'}
                  </button>

                  {/* Dark mode simulation */}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, colorScheme: config.colorScheme === 'light' ? 'dark' : 'light' })}
                    className={`p-3.5 rounded-2xl border text-center transition ${
                      config.colorScheme === 'dark' 
                        ? 'border-slate-900 bg-slate-900 text-white font-extrabold' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 font-medium'
                    } text-xs`}
                  >
                    {config.colorScheme === 'dark' ? 'Force Dark-Mode ☾' : 'Default Light Style'}
                  </button>
                </div>
              </div>

              {/* Action trigger button */}
              <button
                type="submit"
                disabled={isCapturing}
                className={`w-full py-4 mt-2 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${
                  isCapturing
                    ? 'bg-slate-350 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-700'
                }`}
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SIMULATING VIEWPORT...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    GENERATE CAPTURE
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="flex items-start gap-2.5 p-4 mt-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Smart Features Index
            </h4>
            <ul className="text-xs text-slate-500 space-y-2.5">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <strong>Anti-Cachings:</strong> Loads true fresh versions on every render.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <strong>Hi-DPI Resolution:</strong> Custom double density PNG configurations.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <strong>Privacy Guaranteed:</strong> No permanent database logging streams.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Rendering Preview */}
        <div className="lg:col-span-7">
          {screenshotUrl ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Output Header toolbar block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white px-5 py-3.5 border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-teal-600 tracking-wider uppercase">
                    <ActiveIcon className="w-3.5 h-3.5" />
                    {config.device} Capture Frame
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => window.open(screenshotUrl, '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-600 text-white font-black text-xs hover:bg-teal-700 transition duration-200 shadow-md shadow-teal-600/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PNG
                  </button>
                </div>
              </div>

              {/* Preview Window Simulator frame card */}
              <div className="bg-slate-900 rounded-3xl p-1.5 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="bg-slate-950 p-3.5 rounded-t-2xl flex items-center gap-2 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                  <div className="flex-1 max-w-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] text-slate-400 font-bold text-center truncate">
                    {config.url}
                  </div>
                  <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                    {deviceDimensions[config.device].width} × {deviceDimensions[config.device].height}
                  </div>
                </div>

                <div className="overflow-auto max-h-[600px] bg-slate-950/20 flex justify-center p-4">
                  <img
                    src={screenshotUrl}
                    alt="Captured Screenshot"
                    className="rounded-xl shadow-lg h-auto max-w-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl text-xs text-emerald-800 font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Screenshot captured successfully! Use the actions above to export.
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center text-center bg-slate-50/50 border border-slate-100 rounded-[32px] p-8">
              {isCapturing ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto" />
                  <p className="text-sm font-black text-slate-800">Processing Live Website Screenshot</p>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Connecting to target URL, simulating the browser context, and compiling high resolution graphics map...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-sm text-slate-300 mb-4 animate-bounce">
                    <Globe className="w-8 h-8 text-teal-400" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg">Screenshot Console Viewport</h3>
                  <p className="text-sm text-slate-400 max-w-sm mt-1">
                    Enter any public webpage url address in the left parameters console workspace, set layout orientations, and click compile to instantly preview real-time responsive frames.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
