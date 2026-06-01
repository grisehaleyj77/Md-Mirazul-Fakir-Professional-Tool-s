import React, { useState, useEffect, useRef } from 'react';
import { 
  Fingerprint, 
  ShieldAlert, 
  Activity, 
  Download, 
  RefreshCw, 
  Layout, 
  Cpu, 
  CheckCircle, 
  FileText, 
  Sliders, 
  Key, 
  Info, 
  Sparkles, 
  Lock, 
  Unlock, 
  Zap, 
  Target, 
  Maximize2,
  Trash2,
  Bookmark,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined standard matching systems
interface BiometricLog {
  id: string;
  timestamp: string;
  patternType: 'Whorl' | 'Loop' | 'Arch' | 'Double Loop';
  matchScore: number;
  ridgeDensity: number; // lines per cm
  securityToken: string;
  status: 'AUTHORIZED' | 'REJECTED' | 'CALIBRATED';
}

const PATTERNS_DB = [
  { id: 'whorl', name: 'Whorl (Concentric Rings)', matchProb: 98.4, rarity: 'Common (30-35%)', desc: 'Circular ridges spiral around a central point, forming two deltas. Historically linked with robust sensory stability and focus control systems.' },
  { id: 'loop', name: 'Radial/Ulnar Loop (Flowing)', matchProb: 99.1, rarity: 'Most Common (60-65%)', desc: 'Ridges enter from one side, curve back, and exit towards the same side. Shows high adaptability and swift multi-thread navigation.' },
  { id: 'arch', name: 'Tented Arch (Mountain)', matchProb: 97.2, rarity: 'Rare (5%)', desc: 'Ridges flow from left to right rising to an acute summit. Displays immense analytical resolve and physical motor precision traits.' },
  { id: 'double_loop', name: 'Composite / Double Loop', matchProb: 95.8, rarity: 'Very Rare (2%)', desc: 'Double loops twist together forming an S-shape core. Suggests dual-cognitive process flows and deep lateral problem solving.' }
];

export const FingerprintScanner = () => {
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS_DB[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannerState, setScannerState] = useState<'idle' | 'scanning' | 'analyzing' | 'success' | 'fail'>('idle');
  
  // Custom design parameters
  const [glowColor, setGlowColor] = useState('#10b981'); // Emerald green, Cyan, Rose red, Violet
  const [ridgeWidth, setRidgeWidth] = useState(3);
  const [noiseLevel, setNoiseLevel] = useState(20);
  const [showMinutiae, setShowMinutiae] = useState(true);

  // Diagnostic readouts
  const [detectedMinutiae, setDetectedMinutiae] = useState<{ x: number, y: number, type: 'bifurcation' | 'ridge-end' | 'core' }[]>([]);
  const [cryptoKey, setCryptoKey] = useState('');
  const [analysisLogs, setAnalysisLogs] = useState<BiometricLog[]>([]);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Populate dynamic minutiae points on pattern switch
  useEffect(() => {
    generateMockMinutiae();
  }, [selectedPattern]);

  // Redraw biometric schema when items modify
  useEffect(() => {
    drawFingerprintCanvas();
  }, [selectedPattern, glowColor, ridgeWidth, noiseLevel, showMinutiae, scanProgress, scannerState]);

  // Load audit history logs on mount
  useEffect(() => {
    const logs = localStorage.getItem('biometric_fingerprint_logs');
    if (logs) {
      try {
        setAnalysisLogs(JSON.parse(logs));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
  }, []);

  const generateMockMinutiae = () => {
    // Distribute 8-14 biometric details randomly near center of fingerprint core
    const count = 8 + Math.floor(Math.random() * 6);
    const types: ('bifurcation' | 'ridge-end' | 'core')[] = ['bifurcation', 'ridge-end', 'core'];
    const points = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 85; // Focused around the center core
      return {
        x: 180 + Math.cos(angle) * radius,
        y: 180 + Math.sin(angle) * radius,
        type: types[Math.floor(Math.random() * types.length)]
      };
    });
    setDetectedMinutiae(points);
  };

  const drawFingerprintCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard high definition dimensions
    canvas.width = 360;
    canvas.height = 360;

    // Premium dark cyber space backdrop
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = ridgeWidth;
    ctx.lineCap = 'round';

    // Soft neon overlay shadow
    ctx.shadowBlur = 4;
    ctx.shadowColor = glowColor;

    // Draw customized fingerprint loops based on chosen type
    if (selectedPattern.id === 'whorl') {
      // Concentric circles spiraling outwards
      for (let r = 20; r < 140; r += 12) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2 * 0.95); // leave small gap as real fingerprint
        ctx.stroke();
      }
    } else if (selectedPattern.id === 'loop') {
      // Loop shapes flowing to the right
      for (let r = 15; r < 140; r += 12) {
        ctx.beginPath();
        // Core looping curve apex
        ctx.arc(cx - r * 0.3, cy, r, -Math.PI * 0.75, Math.PI * 0.75);
        // Extended tail lines running out
        ctx.lineTo(cx + 150, cy + r * 1.1);
        ctx.stroke();
      }
    } else if (selectedPattern.id === 'arch') {
      // Sharp tented mountain ridges rising up
      for (let r = 15; r < 140; r += 12) {
        ctx.beginPath();
        ctx.moveTo(cx - 150, cy + r * 0.8);
        // Curve to steep peak
        ctx.quadraticCurveTo(cx, cy - r * 1.5, cx + 150, cy + r * 0.8);
        ctx.stroke();
      }
    } else if (selectedPattern.id === 'double_loop') {
      // Intertwining parallel systems forming an S shape core
      for (let r = 15; r < 140; r += 14) {
        ctx.beginPath();
        ctx.arc(cx - 20, cy - 20, r, -Math.PI * 0.5, Math.PI * 0.83);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + 20, cy + 20, r, Math.PI * 0.5, -Math.PI * 0.83);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Noise/Degradation filter overlays
    if (noiseLevel > 0) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(15,23,42,0.8)'; // Background cuts matching noise level
      for (let i = 0; i < noiseLevel; i++) {
        const randY = 40 + Math.random() * (canvas.height - 80);
        ctx.beginPath();
        ctx.moveTo(30, randY);
        ctx.lineTo(canvas.width - 30, randY + (Math.random() * 15 - 7.5));
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Render minutiae analysis points if toggled active
    if (showMinutiae && detectedMinutiae.length > 0) {
      detectedMinutiae.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.type === 'bifurcation' ? '#f43f5e' : (p.type === 'core' ? '#3b82f6' : '#eab308');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Biometric radar-box ring around dots
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    // 3. Scan line simulation overlays when scanning
    if (isScanning && scanProgress > 0) {
      const scanY = (scanProgress / 100) * canvas.height;
      
      ctx.save();
      // Glowing green/blue laser line
      const grad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 3);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.45)');
      grad.addColorStop(1, '#10b981');

      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 12, canvas.width, 14);

      // Bright bottom strip edge
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handleStartScan = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isScanning || scannerState === 'analyzing') return;

    setIsScanning(true);
    setScanProgress(0);
    setScannerState('scanning');

    // Smooth scan sweep speed controls
    progressIntervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current!);
          triggerAnalysisPhase();
          return 100;
        }
        return prev + 2.5; // increments
      });
    }, 55);
  };

  const handleCancelScan = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setIsScanning(false);
    setScanProgress(0);
    if (scannerState === 'scanning') {
      setScannerState('idle');
    }
  };

  const triggerAnalysisPhase = () => {
    setIsScanning(false);
    setScannerState('analyzing');

    // Simulate cryptographic calculation vectors
    setTimeout(() => {
      const simulatedSuccess = Math.random() > 0.08; // High baseline success probability
      if (simulatedSuccess) {
        setScannerState('success');
        
        // Generate cryptographic hash signature
        const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const token = `BIO_AES_256#${hex.toUpperCase().substring(0, 18)}`;
        setCryptoKey(token);

        // Add history log securely
        const newLog: BiometricLog = {
          id: Math.random().toString(36).substring(2, 8),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          patternType: selectedPattern.id === 'whorl' ? 'Whorl' : (selectedPattern.id === 'loop' ? 'Loop' : (selectedPattern.id === 'arch' ? 'Arch' : 'Double Loop')),
          matchScore: Number((95 + Math.random() * 4.9).toFixed(2)),
          ridgeDensity: 14 + Math.floor(Math.random() * 5),
          securityToken: token,
          status: 'AUTHORIZED'
        };

        const updated = [newLog, ...analysisLogs].slice(0, 8);
        setAnalysisLogs(updated);
        localStorage.setItem('biometric_fingerprint_logs', JSON.stringify(updated));
      } else {
        setScannerState('fail');
      }
    }, 1800);
  };

  const handleResetScanner = () => {
    setScannerState('idle');
    setScanProgress(0);
    setCryptoKey('');
    generateMockMinutiae();
  };

  const clearHistory = () => {
    setAnalysisLogs([]);
    localStorage.removeItem('biometric_fingerprint_logs');
  };

  const downloadSignatureGraphic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `Fingerprint_${selectedPattern.id}_Biometric.${glowColor === '#ffffff' ? 'jpg' : 'png'}`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="fingerprint-scan-diagnostics-app">
      
      {/* Dynamic Elegant cyber header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-emerald-500/15 via-blue-500/5 to-purple-500/10 p-6 rounded-3xl border border-emerald-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-emerald-600 animate-pulse" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Biometric Fingerprint Scanner & Key Synthesizer
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Simulate high-fidelity military fingerprint scans and mapping sequences. Adjust unique core ridges, display minutiae bifurcation endpoints, compute cryptographic AES compatibility tokens, and download transparent bio vector graphics.
          </p>
        </div>

        {scannerState !== 'idle' && (
          <button
            type="button"
            onClick={handleResetScanner}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Scan Plate
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Section: Design Tuning Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Preset templates selector */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-600" />
              1. Choose Biometric Ridge Preset
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PATTERNS_DB.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => setSelectedPattern(pat)}
                  className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                    selectedPattern.id === pat.id 
                      ? 'border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-800 tracking-tight">{pat.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono font-bold">Rarity: {pat.rarity}</p>
                </button>
              ))}
            </div>

            {/* Selected description card display */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-sans">
              <p className="font-extrabold text-slate-800 mb-0.5">{selectedPattern.name} Characteristics:</p>
              <p>{selectedPattern.desc}</p>
            </div>
          </div>

          {/* Style customize options */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              2. Adjust Bio-Scan Parameters
            </h3>

            {/* Neon Glow Color Picker */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase block">Terminal Laser Display Glow</label>
              <div className="flex flex-wrap gap-2 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                {([
                  { color: '#10b981', label: 'Tactical Emerald' },
                  { color: '#06b6d4', label: 'Cyber Cyan' },
                  { color: '#8b5cf6', label: 'Violet Spectrum' },
                  { color: '#ec4899', label: 'Laser Pink' },
                  { color: '#ffffff', label: 'Quartz White' }
                ]).map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    title={item.label}
                    onClick={() => setGlowColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-7 h-7 rounded-full border border-slate-300 transition-all ${
                      glowColor === item.color 
                        ? 'ring-2 ring-emerald-500 ring-offset-2 scale-110 shadow-sm' 
                        : 'hover:scale-105 active:scale-95'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Stroke density and width adjustment parameters */}
            <div className="grid grid-cols-2 gap-3.5 pt-1.5 pb-2">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center justify-between">
                  <span>Ridge Width</span>
                  <span className="font-mono text-[11px] font-bold">{ridgeWidth}px</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="0.5"
                  value={ridgeWidth} 
                  onChange={(e) => setRidgeWidth(Number(e.target.value))}
                  className="w-full h-1 mt-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center justify-between">
                  <span>Simulated Noise</span>
                  <span className="font-mono text-[11px] font-bold">{noiseLevel} lines</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="5"
                  value={noiseLevel} 
                  onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  className="w-full h-1 mt-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>
            </div>

            {/* Minutiae switch toggle */}
            <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-slate-700">Display Minutiae Core Nodes</p>
                <p className="text-[10px] text-slate-400">Highlights bifurcation points & termination deltas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showMinutiae} 
                  onChange={(e) => setShowMinutiae(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Diagnostic specifications panel */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Biometric Calibration Data
            </h3>

            <div className="space-y-3 font-sans text-xs text-slate-600 leading-relaxed">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-500">Matching Probability Standard</span>
                <span className="font-mono font-extrabold text-slate-800">{selectedPattern.matchProb}% Accuracy</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-500">Minutiae Endpoints Intercepted</span>
                <span className="font-mono font-extrabold text-emerald-600">{detectedMinutiae.length} nodes</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-500">Recommended Clearance Category</span>
                <span className="font-mono font-extrabold text-emerald-600">AES-X-256 GEN</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Section: Bio scan canvas plate diagnostic system */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          {/* Center interactive plate */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
            
            {/* Real-time status banner */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-extrabold tracking-tight">
                <Target className="w-4 h-4 text-slate-300" />
                BIOMETRIC SENSOR ARRAY CALIBRATION
              </span>

              <div className="flex gap-2.5">
                {scannerState === 'scanning' && (
                  <span className="bg-amber-100 text-amber-700 font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-wide animate-pulse">
                    Scanning: {scanProgress.toFixed(0)}%
                  </span>
                )}
                {scannerState === 'analyzing' && (
                  <span className="bg-blue-100 text-blue-700 font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-wide animate-pulse">
                    Securing Hash...
                  </span>
                )}
                {scannerState === 'success' && (
                  <span className="bg-emerald-100 text-emerald-700 font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Authorized
                  </span>
                )}
                {scannerState === 'fail' && (
                  <span className="bg-rose-100 text-rose-700 font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-wide">
                    Rejected Match
                  </span>
                )}
              </div>
            </div>

            {/* Display Plate box framing */}
            <div className="w-full relative bg-slate-950 p-6 rounded-3xl border border-slate-850 aspect-[16/10] flex items-center justify-center">
              
              <div className="absolute top-4 left-4 z-10 flex gap-1.5 opacity-35 hover:opacity-100 transition duration-300">
                <span className="bg-black/80 text-white/90 font-mono text-[9px] font-bold rounded-lg px-2 py-1">
                  DIMENSIONS: 360 x 360 PX
                </span>
                <span className="bg-black/80 text-white/90 font-mono text-[9px] font-bold rounded-lg px-2.5 py-1">
                  ID: {selectedPattern.id.toUpperCase()}
                </span>
              </div>

              {/* Real canvas viewport */}
              <div className="w-full h-full max-h-[85%] max-w-[85%] flex items-center justify-center relative">
                <canvas
                  id="biometric-fingerprint-core-canvas"
                  ref={canvasRef}
                  className="rounded-2xl border border-white/10 shadow-2xl max-w-full max-h-full object-contain block bg-[#0f172a]"
                />
              </div>

              {/* Glowing ring scanner plate alignment guides */}
              {scannerState === 'idle' && (
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-500/15 rounded-3xl" />
              )}
            </div>

            {/* Hold and scan interaction row controls */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
              
              {/* Dynamic Scanning Button standard layout */}
              {scannerState === 'idle' ? (
                <button
                  type="button"
                  onMouseDown={handleStartScan}
                  onTouchStart={handleStartScan}
                  className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Fingerprint className="w-4 h-4 animate-pulse" />
                  CLICK & HOLD SCAN PLATE
                </button>
              ) : scannerState === 'scanning' ? (
                <button
                  type="button"
                  onMouseUp={handleCancelScan}
                  onTouchEnd={handleCancelScan}
                  onMouseLeave={handleCancelScan}
                  className="py-4 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  SWEEPING... RELEASE TO ABORT
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetScanner}
                  className="py-4 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  RE-CALIBRATE SCAN PLATE
                </button>
              )}

              {/* Transparency Graphic Export */}
              <button
                type="button"
                onClick={downloadSignatureGraphic}
                className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Download Bio graphic (PNG)
              </button>
            </div>

            {/* Cryptographic token generator display results */}
            <AnimatePresence>
              {cryptoKey && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-slate-50 p-4.5 rounded-2xl border border-slate-150 mt-5 space-y-2.5 text-xs text-slate-600 flex flex-col justify-start"
                >
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Biometric SHA-256 Key Calibrated Successfully!
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                    <Key className="w-4 h-4 text-slate-400 shrink-0" />
                    <code className="text-[10px] font-mono select-all text-slate-800 break-all flex-1 font-bold">{cryptoKey}</code>
                    
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(cryptoKey);
                        alert('Biometric AES security key copied directly to OS clipboard!');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 transition text-[9px] font-black text-slate-700 rounded-lg shrink-0"
                    >
                      Copy Token
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info panel tips description list */}
            <div className="w-full mt-5 flex gap-2.5 items-start bg-emerald-50/40 p-4 rounded-2xl border border-emerald-50">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] text-slate-500">
                <p className="font-bold text-slate-800 font-sans">Biotech Scanning Instructions:</p>
                <ul className="list-disc pl-3.5 space-y-1 leading-relaxed">
                  <li><strong>Active Scanner Calibration:</strong> Click and hold the Scan Plate button. Real-time ultrasonic mapping parameters will activate, sweeping up and down on the canvas viewport.</li>
                  <li><strong>Minutiae Point Capture:</strong> Blue highlights represent biometric cores, red markers represent bifurcations, and yellow dots signify ridge endings. Useful for mapping security logs.</li>
                  <li><strong>AES Cryptographic Hash:</strong> Authorizing successfully computes signature key hashes suited for credentials lock simulations within other programs.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Audit scanner histories log database list */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-600" />
                Sensors Calibration History Log
              </h3>

              {analysisLogs.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Archive
                </button>
              )}
            </div>

            {analysisLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto stroke-[1.25]" />
                <p className="text-xs font-bold font-sans">No sensors diagnostic logs logged.</p>
                <p className="text-[10px] px-4 leading-relaxed">Completed bio-sensor diagnostic credentials automatically log inside the application's secure runtime state.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                {analysisLogs.map((item) => (
                  <div key={item.id} className="border border-slate-100 p-3.5 rounded-2xl bg-slate-50/60 flex items-center justify-between gap-3 text-xs leading-none">
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <p className="font-extrabold text-slate-800 font-sans">Pattern Core: {item.patternType} ({item.matchScore}% Confidence)</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>Ridge count: {item.ridgeDensity} lines/cm</span>
                        <span>•</span>
                        <span>Calibrated Stamp: {item.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right text-[10.5px] font-mono leading-tight space-y-1">
                      <code className="bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded font-black text-[9px]">{item.securityToken.substring(0, 11)}...</code>
                      <p className="text-emerald-700 font-extrabold">STATUS: {item.status}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
