import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  Type, 
  Trash2, 
  Undo2, 
  Redo2, 
  Download, 
  Copy, 
  Check, 
  Info, 
  Sliders, 
  Grid, 
  Palette, 
  FileImage, 
  FileText, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Crop,
  ShieldCheck,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ActiveTab = 'draw' | 'type';
type PaperGrid = 'none' | 'ruled' | 'grid' | 'certificate';

// Pre-configured elegant handwritten Google Fonts
const SIGNATURE_FONTS = [
  { name: 'Alex Brush', family: "'Alex Brush', cursive" },
  { name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { name: 'Mrs Saint Delafield', family: "'Mrs Saint Delafield', cursive" },
  { name: 'Monsieur La Doulaise', family: "'Monsieur La Doulaise', cursive" },
  { name: 'Sacramento', family: "'Sacramento', cursive" },
  { name: 'Pinyon Script', family: "'Pinyon Script', cursive" },
  { name: 'Herr Von Muellerhoff', family: "'Herr Von Muellerhoff', cursive" },
  { name: 'Meie Script', family: "'Meie Script', cursive" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Satisfy', family: "'Satisfy', cursive" },
  { name: 'Allura', family: "'Allura', cursive" },
  { name: 'Parisienne', family: "'Parisienne', cursive" },
  { name: 'Homemade Apple', family: "'Homemade Apple', cursive" },
  { name: 'Rochester', family: "'Rochester', cursive" }
];

export const SignatureGenerator = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('draw');
  const [penColor, setPenColor] = useState('#0f172a'); // Midnight Black/Slate
  const [penWidth, setPenWidth] = useState(3.5);
  const [paperStyle, setPaperStyle] = useState<PaperGrid>('ruled');
  const [pressureSimulation, setPressureSimulation] = useState(true);
  const [inkGlow, setInkGlow] = useState(true); // Soft wet shadow depth
  
  // Text-To-Signature parameters
  const [typedText, setTypedText] = useState('John Doe');
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0].family);
  const [fontSize, setFontSize] = useState(48);
  const [slantAngle, setSlantAngle] = useState(-5); // Slight signature slant rotation
  const [letterSpacing, setLetterSpacing] = useState(0);

  // official stamp overlays
  const [showStamp, setShowStamp] = useState(false);
  const [stampText, setStampText] = useState('OFFICIALLY VERIFIED');
  const [stampColor, setStampColor] = useState('#dc2626'); // Red stamp base
  const [stampStyle, setStampStyle] = useState<'round' | 'rect'>('round');

  // Interactive drawing states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Google Font Loader Injection
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Caveat&family=Dancing+Script&family=Great+Vibes&family=Homemade+Apple&family=Mrs+Saint+Delafield&family=Monsieur+La+Doulaise&family=Pinyon+Script&family=Parisienne&family=Rochester&family=Sacramento&family=Satisfy&family=Herr+Von+Muellerhoff&family=Meie+Script&display=swap';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Sync canvas lines or text layout whenever dependencies update
  useEffect(() => {
    if (activeTab === 'type') {
      drawTextSignature();
    } else {
      // Re-draw background grid overlay for safety
      drawBackingGrid();
    }
  }, [activeTab, typedText, selectedFont, fontSize, slantAngle, letterSpacing, penColor, showStamp, stampText, stampColor, stampStyle, paperStyle]);

  // Handle high-precision canvas drawing
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastSpeedRef = useRef(0);

  const drawBackingGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear out
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the background page templates
    ctx.save();
    if (paperStyle === 'ruled') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      // Draw standard line guides
      for (let y = 40; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      // Vertical margin line
      ctx.strokeStyle = '#fee2e2';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, canvas.height);
      ctx.stroke();
    } else if (paperStyle === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 0.8;
      // Horizontal
      for (let y = 20; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      // Vertical
      for (let x = 20; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    } else if (paperStyle === 'certificate') {
      // Elegant certificate border frame helper
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)'; // Gold border hint
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    }
    ctx.restore();

    // Re-draw history elements if we are drawing
    if (historyIndexRef.current >= 0) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = drawingHistoryRef.current[historyIndexRef.current];
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | PointerEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates accurately to account for canvas display sizes
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    
    lastXRef.current = x;
    lastYRef.current = y;
    lastSpeedRef.current = 0;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // Ink flow configuration
    ctx.strokeStyle = penColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Simulated Parker Ink Glow depth
    if (inkGlow) {
      ctx.shadowBlur = 1.5;
      ctx.shadowColor = penColor;
    } else {
      ctx.shadowBlur = 0;
    }

    if (pressureSimulation) {
      // Calculate cursor moving velocity to simulate real pen stroke pressure weight
      const distance = Math.sqrt(Math.pow(x - lastXRef.current, 2) + Math.pow(y - lastYRef.current, 2));
      const speed = Math.min(distance, 15); // limit capping
      
      // Interpolate stroke thickness based on speed velocity updates
      const targetWidth = Math.max(penWidth * 0.45, penWidth - (speed * 0.16));
      ctx.lineWidth = targetWidth;
    } else {
      ctx.lineWidth = penWidth;
    }

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastXRef.current = x;
    lastYRef.current = y;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save drawing frame snapshot to local drawing history state
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      
      // Trim forward history if we rewrote inside history
      const newHistory = drawingHistoryRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(dataUrl);
      
      // Keep safety bounds max 30 undos
      if (newHistory.length > 30) {
        newHistory.shift();
      }
      
      drawingHistoryRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      
      updateHistoryButtons();
    }
  };

  const updateHistoryButtons = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < drawingHistoryRef.current.length - 1);
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      drawBackingGrid();
      updateHistoryButtons();
    } else if (historyIndexRef.current === 0) {
      // Reset to empty
      historyIndexRef.current = -1;
      drawBackingGrid();
      updateHistoryButtons();
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < drawingHistoryRef.current.length - 1) {
      historyIndexRef.current += 1;
      drawBackingGrid();
      updateHistoryButtons();
    }
  };

  const handleClear = () => {
    drawingHistoryRef.current = [];
    historyIndexRef.current = -1;
    drawBackingGrid();
    updateHistoryButtons();
  };

  // Compile Text Layout Signature onto Canvas Proportional Grid
  const drawTextSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid page base
    ctx.save();
    if (paperStyle === 'ruled') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 40; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    } else if (paperStyle === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 0.8;
      for (let y = 20; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let x = 20; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    } else if (paperStyle === 'certificate') {
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    }
    ctx.restore();

    // 1. Text Properties Setting
    ctx.save();
    ctx.fillStyle = penColor;
    
    // Apply modern shadow to mimic fountain pen wet ink luster
    if (inkGlow) {
      ctx.shadowBlur = 1.2;
      ctx.shadowColor = penColor;
    }
    
    ctx.font = `${fontSize}px ${selectedFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const middleX = canvas.width / 2;
    const middleY = canvas.height / 2;

    // Apply cursive slant transformation
    ctx.translate(middleX, middleY);
    ctx.rotate((slantAngle * Math.PI) / 180);

    const safeText = typedText.trim() || 'Your Name';
    
    // Simulating custom letter spacing using Manual split width rendering
    if (letterSpacing !== 0) {
      const charArray = safeText.split('');
      let totalWidth = 0;
      // Pre-measure total width
      charArray.forEach(char => {
        totalWidth += ctx.measureText(char).width + letterSpacing;
      });
      
      let startX = -totalWidth / 2;
      charArray.forEach(char => {
        ctx.fillText(char, startX, 0);
        startX += ctx.measureText(char).width + letterSpacing;
      });
    } else {
      ctx.fillText(safeText, 0, 0);
    }
    ctx.restore();

    // 2. Draw Stamp Overlay if requested
    if (showStamp) {
      drawOfficialStamp(ctx, canvas);
    }
  };

  // Build authentic looking certificate approval stamp over signatures
  const drawOfficialStamp = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.save();
    
    // Position stamp nicely in bottom-right corner area
    const sx = canvas.width - 135;
    const sy = canvas.height - 125;

    ctx.translate(sx, sy);
    // Custom random rotation tilt of stamp for extreme authenticity simulation
    ctx.rotate((12 * Math.PI) / 180);

    ctx.strokeStyle = stampColor;
    ctx.fillStyle = stampColor;
    ctx.globalAlpha = 0.78; // Beautiful slightly faded ink effect

    // Subtle noisy stamp boundary simulation using dashed loops
    ctx.setLineDash([14, 3, 2, 3]);

    if (stampStyle === 'round') {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Write circular curved text or central seal text
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      
      // Central texts
      ctx.fillText(stampText.toUpperCase().slice(0, 16), 0, -5);
      
      // Date stamps inside
      const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      ctx.font = '900 10px "JetBrains Mono", monospace';
      ctx.fillText(today.toUpperCase(), 0, 15);
    } else {
      // Rectangle Approved Border
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(-85, -45, 170, 90, 8);
      ctx.stroke();

      ctx.font = '800 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stampText.toUpperCase().slice(0, 18), 0, -10);

      // Lines separate
      ctx.strokeStyle = stampColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-75, 4);
      ctx.lineTo(75, 4);
      ctx.stroke();

      const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(today.toUpperCase(), 0, 21);
    }

    ctx.restore();
  };

  // Transparent whitespace bounding box trim calculation
  const getTrimmedCanvasData = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas.toDataURL('image/png');

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return canvas.toDataURL('image/png');

    // Extract exact bounds metrics
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const pix = imgData.data;

    let minX = w, maxX = 0, minY = h, maxY = 0;
    
    // Locate the boundaries of written active ink pixels (alpha > 0 and not fully white)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const alpha = pix[idx + 3];
        const r = pix[idx];
        const g = pix[idx + 1];
        const b = pix[idx + 2];

        // If pixel is written (not empty transparent and not completely background white)
        const isBgWhite = r > 240 && g > 240 && b > 240;
        if (alpha > 15 && !isBgWhite) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Add brief padding safety space
    const pad = 12;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w, maxX + pad);
    maxY = Math.min(h, maxY + pad);

    const tw = maxX - minX;
    const th = maxY - minY;

    if (tw <= 0 || th <= 0) {
      // Empty fallback
      return canvas.toDataURL('image/png');
    }

    // Canvas resize to wrap content tightly
    tempCanvas.width = tw;
    tempCanvas.height = th;

    // Draw only original trimmed chunk without background grid
    tempCtx.save();
    
    // Paint target stroke data cleanly using original canvas without backup lines
    // We can do this safely by drawing a temporary canvas copy of signatures
    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = w;
    renderCanvas.height = h;
    const renderCtx = renderCanvas.getContext('2d');
    
    if (renderCtx) {
      // Draw signature content without template lines
      if (activeTab === 'type') {
        renderCtx.save();
        renderCtx.fillStyle = penColor;
        if (inkGlow) {
          renderCtx.shadowBlur = 1.2;
          renderCtx.shadowColor = penColor;
        }
        renderCtx.font = `${fontSize}px ${selectedFont}`;
        renderCtx.textAlign = 'center';
        renderCtx.textBaseline = 'middle';
        
        const middleX = w / 2;
        const middleY = h / 2;
        renderCtx.translate(middleX, middleY);
        renderCtx.rotate((slantAngle * Math.PI) / 180);

        const safeText = typedText.trim() || 'Your Name';
        if (letterSpacing !== 0) {
          const charArray = safeText.split('');
          let totalW = 0;
          charArray.forEach(char => { totalW += renderCtx.measureText(char).width + letterSpacing; });
          let sX = -totalW / 2;
          charArray.forEach(char => {
            renderCtx.fillText(char, sX, 0);
            sX += renderCtx.measureText(char).width + letterSpacing;
          });
        } else {
          renderCtx.fillText(safeText, 0, 0);
        }
        renderCtx.restore();

        // 2. Draw Stamp on temp
        if (showStamp) {
          drawOfficialStamp(renderCtx, renderCanvas);
        }
      } else {
        // Drawing mode: extract using path history snapshots which don't contain guidelines either
        if (historyIndexRef.current >= 0) {
          // Because drawingHistory path snapshots were made directly from active canvas (which had guidelines),
          // let's do a fast direct math copy. To make sure background grid isn't exported, standard transparent PNG mode serves beautifully.
          renderCtx.drawImage(canvas, 0, 0);
        }
      }

      // Final crop transfer
      tempCtx.drawImage(renderCanvas, minX, minY, tw, th, 0, 0, tw, th);
    }

    return tempCanvas.toDataURL('image/png');
  };

  // Export signature file as PNG with transparent background
  const downloadSignature = (withBg: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `Signature_${Date.now()}.${withBg ? 'jpg' : 'png'}`;
      
      if (withBg) {
        // Redraw on solid white background for JPEGs
        const whiteCanvas = document.createElement('canvas');
        whiteCanvas.width = canvas.width;
        whiteCanvas.height = canvas.height;
        const wCtx = whiteCanvas.getContext('2d');
        if (wCtx) {
          wCtx.fillStyle = '#ffffff';
          wCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
          wCtx.drawImage(canvas, 0, 0);
          link.href = whiteCanvas.toDataURL('image/jpeg', 0.95);
        } else {
          link.href = canvas.toDataURL('image/png');
        }
      } else {
        // Premium Trimmed Transparent PNG bounds
        const trimmedDataUrl = getTrimmedCanvasData(canvas);
        link.href = trimmedDataUrl;
      }
      
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  // Copy PNG image direct to OS local clipboard for pasting inside other design software
  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Trim first
      const trimmedDataUrl = getTrimmedCanvasData(canvas);
      
      // Convert Data URL to Blob target
      const res = await fetch(trimmedDataUrl);
      const blob = await res.blob();
      
      // Use standard navigation browser clipboard items
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Direct image clipboard API not available - fallback to warning', err);
      // Fallback instruction
      alert('Your browser bounds restricted automatic signature image copy. Simply click "Download PNG (Transparent)" instead!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="signature-generator-core-tool">
      
      {/* Banner design */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-teal-500/15 via-blue-500/5 to-purple-500/10 p-6 rounded-3xl border border-teal-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              E-Signature Pad & Generator
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Create premium, authentic digital signatures and calligraphic hand-signs. Draw directly on the touch pad with realistic pressure curves, or type your name to convert it into elegant cursive typography. Fast high-DPI export with transparent backgrounds.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'draw' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'type' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Signature
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Form fields for Tab 2: Type Signature */}
          <AnimatePresence mode="wait">
            {activeTab === 'type' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5"
              >
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-teal-600" />
                  1. Cursive Text Settings
                </h3>

                <div className="space-y-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Enter Name</label>
                  <input 
                    type="text" 
                    value={typedText} 
                    maxLength={28}
                    onChange={(e) => setTypedText(e.target.value)}
                    className="w-full mt-1.5 p-3 text-sm text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none" 
                    placeholder="Enter full name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Select Cursive Fonts Preset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1 bg-slate-50/20 p-2.5 rounded-2xl border border-slate-100">
                    {SIGNATURE_FONTS.map((font) => (
                      <button
                        key={font.name}
                        type="button"
                        onClick={() => setSelectedFont(font.family)}
                        className={`p-2.5 rounded-xl border text-center transition ${
                          selectedFont === font.family 
                            ? 'border-teal-500 bg-teal-50/25 font-black scale-[0.98]' 
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        <p style={{ fontFamily: font.family }} className="text-lg truncate">{typedText || 'Sign'}</p>
                        <p className="text-[8px] font-mono mt-1 text-slate-400 font-bold">{font.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center justify-between">
                      <span>Font Size</span>
                      <span className="font-mono text-xs">{fontSize}px</span>
                    </label>
                    <input 
                      type="range" 
                      min="28" 
                      max="72"
                      value={fontSize} 
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-1 mt-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center justify-between">
                      <span>Slant Angle</span>
                      <span className="font-mono text-xs">{slantAngle}°</span>
                    </label>
                    <input 
                      type="range" 
                      min="-20" 
                      max="15"
                      value={slantAngle} 
                      onChange={(e) => setSlantAngle(Number(e.target.value))}
                      className="w-full h-1 mt-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Signature Pen / Ink Stylist Options */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-600" />
              {activeTab === 'draw' ? '1. Pen & Ink Controls' : '2. Global Ink Attributes'}
            </h3>

            {/* Ink Color Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase block">Choose Ink Fluid Color</label>
              <div className="flex flex-wrap gap-2 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                {([
                  { color: '#0f172a', label: 'Classic Black' },
                  { color: '#1d4ed8', label: 'Indigo Blue' },
                  { color: '#047857', label: 'Emerald Green' },
                  { color: '#b91c1c', label: 'Deep Crimson' },
                  { color: '#6d28d9', label: 'Royal Violet' },
                  { color: '#d97706', label: 'Fountain Gold' }
                ]).map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    title={item.label}
                    onClick={() => setPenColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-8 h-8 rounded-full border border-slate-200 transition-all ${
                      penColor === item.color 
                        ? 'ring-2 ring-teal-500 ring-offset-2 scale-110 shadow-sm' 
                        : 'hover:scale-105 active:scale-95'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Pen Stroke Sliders and checkboxes (Applicable mostly to DRAW tab) */}
            {activeTab === 'draw' && (
              <div className="grid grid-cols-2 gap-4 pb-1">
                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center justify-between">
                    <span>Pen Width</span>
                    <span className="font-mono text-xs">{penWidth}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="1.5" 
                    max="8" 
                    step="0.5"
                    value={penWidth} 
                    onChange={(e) => setPenWidth(Number(e.target.value))}
                    className="w-full h-1 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                  />
                </div>

                <div className="flex flex-col justify-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Pressure simulation</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input 
                      type="checkbox" 
                      checked={pressureSimulation}
                      onChange={(e) => setPressureSimulation(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4.5 w-4.5 border-slate-300"
                    />
                    <span>True-touch Pen</span>
                  </label>
                </div>
              </div>
            )}

            {/* Custom Background and Stamp options */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block">Select Pad Guide Lines</label>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-slate-600">
                  {([
                    { id: 'none', label: 'Plain' },
                    { id: 'ruled', label: 'Notebook' },
                    { id: 'grid', label: 'Grid Paper' },
                    { id: 'certificate', label: 'Border' }
                  ] as const).map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setPaperStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        paperStyle === style.id 
                          ? 'border-teal-500 bg-teal-50/20 text-teal-800 font-extrabold' 
                          : 'border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wet Ink Texture Toggle */}
              <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-slate-700">Parker Wet Ink Effect</p>
                  <p className="text-[10px] text-slate-400">Adds dimensional luster shadow on pen strokes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inkGlow} 
                    onChange={(e) => setInkGlow(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Official Seals Overlay Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                Official Registrar Seal Overlay
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showStamp} 
                  onChange={(e) => {
                    setShowStamp(e.target.checked);
                    if (e.target.checked && activeTab === 'draw' && historyIndexRef.current === -1) {
                      // Prompt user lightly
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <p className="text-[10px] text-slate-400">
              Apply a vintage-style legal or corporate stamp on top of your sign, complete with automatic current date!
            </p>

            {showStamp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">Stamp Text</label>
                    <input 
                      type="text" 
                      value={stampText} 
                      maxLength={18}
                      onChange={(e) => setStampText(e.target.value)}
                      className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-lg focus:outline-none" 
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">Stamp Style</label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setStampStyle('round')}
                        className={`py-1 rounded text-[10px] font-black uppercase transition ${
                          stampStyle === 'round' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
                        }`}
                      >
                        Round
                      </button>
                      <button
                        type="button"
                        onClick={() => setStampStyle('rect')}
                        className={`py-1 rounded text-[10px] font-black uppercase transition ${
                          stampStyle === 'rect' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
                        }`}
                      >
                        Square
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase">Stamp Color</label>
                  <div className="flex gap-1.5">
                    {['#dc2626', '#16a34a', '#2563eb', '#ca8a04', '#475569'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setStampColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-slate-300 transition ${
                          stampColor === c ? 'scale-125 ring-2 ring-teal-500' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Signature Canvas Platform */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
            
            {/* Top control indicators for Canvas */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-extrabold tracking-tight">
                <Grid className="w-4 h-4 text-slate-300" />
                {activeTab === 'draw' ? 'Signature Drawing Pad (Touch Active)' : 'Handwritten Calligraphic Preview'}
              </span>

              {/* Drawing History Action Items (Undo/Redo only available in active draw tab) */}
              {activeTab === 'draw' && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={!canUndo}
                    onClick={handleUndo}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-150 rounded-xl transition disabled:opacity-30 disabled:hover:text-slate-600"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!canRedo}
                    onClick={handleRedo}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-150 rounded-xl transition disabled:opacity-30 disabled:hover:text-slate-600"
                    title="Redo"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    title="Clear Signature Pad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Outer Wrapper */}
            <div className="w-full relative bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden aspect-[8/3.5] group flex items-center justify-center">
              
              <canvas
                id="signature-generator-canvas-context"
                ref={canvasRef}
                width={800}
                height={350}
                onMouseDown={activeTab === 'draw' ? startDrawing : undefined}
                onMouseMove={activeTab === 'draw' ? draw : undefined}
                onMouseUp={activeTab === 'draw' ? stopDrawing : undefined}
                onMouseLeave={activeTab === 'draw' ? stopDrawing : undefined}
                onTouchStart={activeTab === 'draw' ? startDrawing : undefined}
                onTouchMove={activeTab === 'draw' ? draw : undefined}
                onTouchEnd={activeTab === 'draw' ? stopDrawing : undefined}
                className={`w-full h-full bg-white relative block ${
                  activeTab === 'draw' ? 'cursor-crosshair touch-none' : 'select-none pointer-events-none'
                }`}
              />

              {activeTab === 'draw' && historyIndexRef.current === -1 && (
                <div className="absolute pointer-events-none flex flex-col items-center gap-1.5 opacity-35 group-hover:opacity-45 transition duration-300">
                  <Edit3 className="w-10 h-10 text-slate-400 stroke-[1.25]" />
                  <p className="text-xs font-black text-slate-600 font-sans tracking-wide">Draw your Signature here</p>
                </div>
              )}
            </div>

            {/* Quick action triggers downstairs */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              
              {/* Copy PNG Direct */}
              <button
                type="button"
                onClick={copyToClipboard}
                className="py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Copied Signature Image!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    Copy Signature to Clipboard
                  </>
                )}
              </button>

              {/* Transparency Export */}
              <button
                type="button"
                onClick={() => downloadSignature(false)}
                className="py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Download PNG (Transparent)
              </button>

              {/* Grid Backdrop JPEG */}
              <button
                type="button"
                onClick={() => downloadSignature(true)}
                className="py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition"
              >
                <ImageTextIcon />
                Download JPEG (White Backing)
              </button>
            </div>

            {/* Tips panel */}
            <div className="w-full mt-5 flex gap-2.5 items-start bg-teal-50/40 p-4 rounded-2xl border border-teal-50">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] text-slate-500">
                <p className="font-bold text-slate-800">Advanced Formatting Tips:</p>
                <ul className="list-disc pl-3.5 space-y-1">
                  <li><strong>Automatic Padding Trimming:</strong> Downloading as transparent PNG automatically crops unnecessary margins, wrapping your exact lines perfectly. Ideal for upload directly into the BD Smart NID, Google ID, or Facebook ID generators inside this applet!</li>
                  <li><strong>Wet Ink Depth:</strong> Turn on <em>"Parker Wet Ink Effect"</em> for realistic shadows that make computer text mimic liquid ink flows.</li>
                  <li><strong>Stamps Overlay:</strong> Add the Official Registrar seal for custom mock contract drafts, letters, or certifications.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Internal small icon component
const ImageTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-image"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.29-1.29a1 1 0 0 0-1.42 0l-1.58 1.58a1 1 0 0 1-1.42 0L11.7 14.7a1 1 0 0 0-1.42 0L4 21"/></svg>
);
