import React, { useState, useRef, useEffect } from 'react';
import { 
  Facebook, 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Maximize2, 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Eye, 
  RefreshCw, 
  Type, 
  Palette, 
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Official Facebook standard dimensions
interface PhotoTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  safeZoneNote?: string;
  category: 'Profile & Cover' | 'Posts & Content' | 'Groups & Events' | 'Meta Ads';
}

const FB_TEMPLATES: PhotoTemplate[] = [
  { 
    id: 'profile', 
    name: 'Facebook Profile Picture', 
    width: 720, 
    height: 720, 
    aspectRatio: '1:1', 
    description: 'Perfect square format. Displayed as a circle on Facebook profiles, posts, and feeds.',
    safeZoneNote: 'Recommendation: Keep critical details centered because the outer corners will be cropped into a circle.',
    category: 'Profile & Cover'
  },
  { 
    id: 'cover_personal', 
    name: 'Personal Profile Cover Photo', 
    width: 1702, 
    height: 630, 
    aspectRatio: 'approx 2.7:1', 
    description: 'Displayed at 851x315 px (Desktops) and 640x360 px (Smartphones).',
    safeZoneNote: 'Mobile Safe Zone: Keep your main content within the center 1000px width. Left/right edges get cropped on phones.',
    category: 'Profile & Cover'
  },
  { 
    id: 'cover_page', 
    name: 'Business Page Cover Photo', 
    width: 1640, 
    height: 624, 
    aspectRatio: '2.63:1', 
    description: 'Official recommendation for business fan pages and brand layout systems.',
    safeZoneNote: 'Mobile Cutoff: 90px on left/right is desktop-only. Keep essential text centered.',
    category: 'Profile & Cover'
  },
  { 
    id: 'group_cover', 
    name: 'Group Cover Photo', 
    width: 1640, 
    height: 856, 
    aspectRatio: '1.91:1', 
    description: 'Perfect for community pages. Crops differently depending on smartphone sizes.',
    safeZoneNote: 'Safe Zone: Top and bottom margins (approx 96px) may crop when viewed on mobile screens.',
    category: 'Groups & Events'
  },
  { 
    id: 'event_cover', 
    name: 'Event Cover Banner', 
    width: 1920, 
    height: 1005, 
    aspectRatio: 'approx 16:9', 
    description: 'Appears on Facebook event schedules, calendar lists, and guest invitation cards.',
    safeZoneNote: 'Pro Tip: Keep details within central boundaries for elegant responsiveness.',
    category: 'Groups & Events'
  },
  { 
    id: 'post_square', 
    name: 'Square Feed Post', 
    width: 1200, 
    height: 1200, 
    aspectRatio: '1:1', 
    description: 'Optimal size for standard news feed updates, link details, and shared image cards.',
    category: 'Posts & Content'
  },
  { 
    id: 'post_shared', 
    name: 'Landscape Shared Image', 
    width: 1200, 
    height: 630, 
    aspectRatio: '1.91:1', 
    description: 'Perfect for standard organic feed link previews and external sharing metadata.',
    category: 'Posts & Content'
  },
  { 
    id: 'story_reels', 
    name: 'Stories & Reels Vertical', 
    width: 1080, 
    height: 1920, 
    aspectRatio: '9:16', 
    description: 'Full-screen immersive layout for Facebook / Messenger Stories and video Reels.',
    safeZoneNote: 'Top/Bottom Cut: Keep important elements 15% (approx 250px) away from top and bottom to avoid icon overlays.',
    category: 'Posts & Content'
  },
  { 
    id: 'ad_feed', 
    name: 'Meta Carousel / Feed Ad', 
    width: 1080, 
    height: 1080, 
    aspectRatio: '1:1', 
    description: 'Compulsory standard specs for sponsored ads, carousels, and Instagram integrations.',
    category: 'Meta Ads'
  },
  { 
    id: 'ad_messenger', 
    name: 'Messenger Home Banner Ad', 
    width: 1200, 
    height: 628, 
    aspectRatio: '1.91:1', 
    description: 'Sponsor marketing ads placed straight inside the personal Messenger inbox chat rows.',
    category: 'Meta Ads'
  }
];

export const FacebookPhotoSizeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoTemplate>(FB_TEMPLATES[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Dynamic Transform Parameters
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [bgColor, setBgColor] = useState('#f8fafc'); // Default off-white filling outer spaces
  
  // Custom Overlays
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [showCircleCrop, setShowCircleCrop] = useState(true); // Helper preview circle for profile pics
  
  // Text Overlay Option
  const [addText, setAddText] = useState(false);
  const [userText, setUserText] = useState('Meta Brand');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(36);
  const [textYOffset, setTextYOffset] = useState(0); // Control vertical text placement

  // UI Interactive States
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Redraw canvas whenever layout parameters change
  useEffect(() => {
    drawCanvas();
  }, [selectedTemplate, imageSrc, zoom, rotation, offsetX, offsetY, bgColor, showSafeZone, showCircleCrop, addText, userText, textColor, textSize, textYOffset]);

  // Adjust zoom to fit the canvas proportionally on template switch
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
  }, [selectedTemplate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            imageRef.current = img;
            setImageSrc(event.target?.result as string);
          };
          img.src = event.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI resolution target matching the Facebook specs
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;

    // Clear Canvas with Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Draw uploaded image with real-time translation and rotaion matrix
    if (imageSrc && imageRef.current) {
      ctx.save();
      
      // Moving pivot point to center of canvas for perfect rotation / zoom transforms
      ctx.translate(cx + offsetX, cy + offsetY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Proportionally render the image centered on workspace
      const img = imageRef.current;
      const imgAspect = img.width / img.height;
      const templateAspect = selectedTemplate.width / selectedTemplate.height;

      let drawW = selectedTemplate.width;
      let drawH = selectedTemplate.height;

      if (imgAspect > templateAspect) {
        // Picture is broader than target template shape, fit height
        drawH = selectedTemplate.height;
        drawW = selectedTemplate.height * imgAspect;
      } else {
        // Picture is taller, fit width
        drawW = selectedTemplate.width;
        drawH = selectedTemplate.width / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // Draw standard professional backdrop template layout lines if no photo uploaded
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]);
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Icon layout details
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 32px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NO IMAGE UPLOADED', cx, cy - 20);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 20px "Inter", sans-serif';
      ctx.fillText(`Target Dimensions: ${selectedTemplate.width} x ${selectedTemplate.height} PX`, cx, cy + 25);
      ctx.restore();
    }

    // 2. Draw standard typography text watermark layer
    if (addText && userText.trim() !== '') {
      ctx.save();
      ctx.fillStyle = textColor;
      ctx.font = `bold ${textSize}px "Inter", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow layer to prevent backdrop bleeding
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;

      ctx.fillText(userText.trim(), cx, cy + (canvas.height / 3.2) + textYOffset);
      ctx.restore();
    }

    // 3. Render Profile Circle Crop Guide Indicator directly on screen (Not exported logic unless downloading preview)
    if (selectedTemplate.id === 'profile' && showCircleCrop) {
      ctx.save();
      ctx.strokeStyle = '#1877f2';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cx, cy) - 8, 0, Math.PI * 2);
      ctx.stroke();

      // Slightly darken outer bounds outside circle to represent Facebook crop borders
      ctx.strokeStyle = 'rgba(24, 119, 242, 0.35)';
      ctx.lineWidth = 200;
      ctx.beginPath();
      // Giant surrounding arc mapping cutoff corners
      ctx.arc(cx, cy, Math.min(cx, cy) + 94, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Highlight Mobile/Desktop Safe Zone indicators on screen
    if (showSafeZone && selectedTemplate.safeZoneNote) {
      ctx.save();
      ctx.strokeStyle = '#f43f5e'; // Vibrant warning rose
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';

      if (selectedTemplate.id === 'cover_personal') {
        // Cover Photo: Mobile Safe View boundary (Main centered 1000px width aspect)
        const leftLimit = (canvas.width - 1000) / 2;
        ctx.strokeRect(leftLimit, 0, 1000, canvas.height);
        ctx.fillRect(0, 0, leftLimit, canvas.height);
        ctx.fillRect(canvas.width - leftLimit, 0, leftLimit, canvas.height);

        // Safe zone alert text
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.fillText('MOBILE SAFE AREA (CENTERED 1000PX)', cx - 180, 40);
      } else if (selectedTemplate.id === 'cover_page') {
        // Business Profile: 90px horizontally crops on mobile
        ctx.strokeRect(90, 0, canvas.width - 180, canvas.height);
        ctx.fillRect(0, 0, 90, canvas.height);
        ctx.fillRect(canvas.width - 90, 0, 90, canvas.height);
      } else if (selectedTemplate.id === 'group_cover') {
        // Group Cover: Top and bottom margins get cut (roughly 96px)
        ctx.strokeRect(0, 96, canvas.width, canvas.height - 192);
        ctx.fillRect(0, 0, canvas.width, 96);
        ctx.fillRect(0, canvas.height - 96, canvas.width, 96);
      } else if (selectedTemplate.id === 'story_reels') {
        // Story indicator showing overlay zones
        ctx.strokeRect(0, 250, canvas.width, canvas.height - 500);
        ctx.fillRect(0, 0, canvas.width, 250);
        ctx.fillRect(0, canvas.height - 250, canvas.width, 250);
      }
      ctx.restore();
    }
  };

  // Canvas Dragging and position pan calculations
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    setIsDragging(true);
    // Track coordinate inputs
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageSrc) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    // Scale tracking updates according to natural container zoom sizes
    setOffsetX(dragOffsetRef.current.x + deltaX * 1.5);
    setOffsetY(dragOffsetRef.current.y + deltaY * 1.5);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const downloadProcessedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Temporary canvas backup to redraw image without helper safe-zone guidelines for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = selectedTemplate.width;
    exportCanvas.height = selectedTemplate.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    // 1. Draw backdrop clean solid layout
    expCtx.fillStyle = bgColor;
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    const cx = exportCanvas.width / 2;
    const cy = exportCanvas.height / 2;

    // 2. Render image with matching modifications
    if (imageSrc && imageRef.current) {
      expCtx.save();
      expCtx.translate(cx + offsetX, cy + offsetY);
      expCtx.rotate((rotation * Math.PI) / 180);
      expCtx.scale(zoom, zoom);

      const img = imageRef.current;
      const imgAspect = img.width / img.height;
      const templateAspect = selectedTemplate.width / selectedTemplate.height;

      let drawW = selectedTemplate.width;
      let drawH = selectedTemplate.height;

      if (imgAspect > templateAspect) {
        drawH = selectedTemplate.height;
        drawW = selectedTemplate.height * imgAspect;
      } else {
        drawW = selectedTemplate.width;
        drawH = selectedTemplate.width / imgAspect;
      }

      expCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      expCtx.restore();
    }

    // 3. Render watermark text alignment on export canvas
    if (addText && userText.trim() !== '') {
      expCtx.save();
      expCtx.fillStyle = textColor;
      expCtx.font = `bold ${textSize}px "Inter", -apple-system, sans-serif`;
      expCtx.textAlign = 'center';
      expCtx.textBaseline = 'middle';
      
      expCtx.shadowColor = 'rgba(0,0,0,0.55)';
      expCtx.shadowBlur = 8;
      expCtx.shadowOffsetX = 1.5;
      expCtx.shadowOffsetY = 1.5;

      expCtx.fillText(userText.trim(), cx, cy + (exportCanvas.height / 3.2) + textYOffset);
      expCtx.restore();
    }

    // Direct download trigger link
    try {
      const link = document.createElement('a');
      link.download = `Facebook_${selectedTemplate.id}_${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const resetModifications = () => {
    setZoom(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setBgColor('#f8fafc');
    setUserText('Meta Brand');
    setAddText(false);
  };

  const loadSampleImage = () => {
    // Generate high resolution placeholder backdrop gradient matching design guidelines
    const canvasSample = document.createElement('canvas');
    canvasSample.width = 1200;
    canvasSample.height = 1200;
    const sCtx = canvasSample.getContext('2d');
    if (sCtx) {
      const gradient = sCtx.createLinearGradient(0, 0, 1200, 1200);
      gradient.addColorStop(0, '#1e3a8a'); // Deep dark navy
      gradient.addColorStop(0.5, '#1877f2'); // Bright official Facebook Blue
      gradient.addColorStop(1, '#db2777'); // Warm magenta pink highlight
      sCtx.fillStyle = gradient;
      sCtx.fillRect(0, 0, 1200, 1200);

      // Creative sun shapes inside
      sCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      sCtx.beginPath();
      sCtx.arc(600, 600, 480, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      sCtx.beginPath();
      sCtx.arc(400, 400, 240, 0, Math.PI * 2);
      sCtx.fill();

      // Brand Title text watermark inside mockup backdrop
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 64px "Inter", sans-serif';
      sCtx.textAlign = 'center';
      sCtx.fillText('META GRAPHICS CREATIVE', 600, 560);

      sCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      sCtx.font = '400 32px "JetBrains Mono", monospace';
      sCtx.fillText('1200 X 1200 PRESETS OVERVIEW', 600, 640);

      const sImg = new Image();
      sImg.onload = () => {
        imageRef.current = sImg;
        setImageSrc(canvasSample.toDataURL('image/png'));
      };
      sImg.src = canvasSample.toDataURL('image/png');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="facebook-photo-size-generator-tool">
      
      {/* Header Banner Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-indigo-500/10 p-6 rounded-3xl border border-blue-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Facebook className="w-6 h-6 text-blue-600 fill-current" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Facebook Photo Template Generator & Resizer
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Resize, crop, and generate standard graphics for Facebook pages, groups, profiles, and sponsored ads. Select templates below, upload photos, pan/zoom intuitively on canvas, toggle mobile safe-zone guides, and download in high-resolution PNG.
          </p>
        </div>

        {imageSrc && (
          <button
            type="button"
            onClick={resetModifications}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Crop Frame
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Section 1: Template Selection Category */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              1. Choose Facebook Layout Target
            </h3>

            {/* Categorized Template Lists */}
            {([
              'Profile & Cover',
              'Posts & Content',
              'Groups & Events',
              'Meta Ads'
            ] as const).map((catName) => {
              const items = FB_TEMPLATES.filter(x => x.category === catName);
              return (
                <div key={catName} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{catName}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((temp) => (
                      <button
                        key={temp.id}
                        type="button"
                        onClick={() => setSelectedTemplate(temp)}
                        className={`p-3 rounded-2xl border text-left transition duration-200 ${
                          selectedTemplate.id === temp.id 
                            ? 'border-blue-500 bg-blue-50/25 ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <p className="font-extrabold text-xs text-slate-800 tracking-tight">{temp.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono font-bold dark:text-blue-600">{temp.width} x {temp.height} px ({temp.aspectRatio})</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Photo Upload, Zoom & Position Transforms */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              2. Upload & Adjust Picture
            </h3>

            {/* Drag & Drop Upload block */}
            <div className="space-y-3">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {!imageSrc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-3xl text-center transition flex flex-col items-center justify-center gap-2 bg-slate-50/50 group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-transform" />
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">Select Image Device</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WEBP scale assets</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={loadSampleImage}
                    className="p-8 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-3xl text-center transition flex flex-col items-center justify-center gap-2 bg-blue-50/10 hover:bg-blue-50/30 group"
                  >
                    <RefreshCw className="w-8 h-8 text-blue-500 group-hover:rotate-45 transition-transform" />
                    <div>
                      <p className="text-xs font-extrabold text-blue-700">Load Mock Graphics</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Use gorgeous gradients</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-250 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">Custom Image Loaded</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Scale/Zoom parameters active</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImageSrc(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-3 py-1.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Transform Sliders */}
            {imageSrc && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                
                {/* Scale/Zoom */}
                <div className="space-y-1.5 bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Scale Frame Zoom</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex gap-2 items-center mt-1.5">
                    <ZoomOut className="w-4 h-4 text-slate-400" />
                    <input 
                      type="range" 
                      min="0.1" 
                      max="3" 
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <ZoomIn className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Rotation Wheel Slider */}
                <div className="space-y-1.5 bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Interactive Rotation</span>
                    <span className="text-xs font-mono font-bold text-slate-705">{rotation}°</span>
                  </div>
                  <div className="flex gap-2 items-center mt-1.5">
                    <RotateCw className="w-4 h-4 text-slate-400" />
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      step="1"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Manual Panning fine tweaks (if the user does not want mouse-drag) */}
                <div className="space-y-2 bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Manual Pan Adjustments</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400">OFFSET horizontal X</label>
                      <input 
                        type="number" 
                        value={offsetX}
                        onChange={(e) => setOffsetX(Number(e.target.value))}
                        className="w-full p-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400">OFFSET vertical Y</label>
                      <input 
                        type="number" 
                        value={offsetY}
                        onChange={(e) => setOffsetY(Number(e.target.value))}
                        className="w-full p-2 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Blank space padding color */}
                <div className="flex items-center justify-between bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Padding Background</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Visible if image is smaller than bounds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {['#f8fafc', '#ffffff', '#000000', '#1877f2', '#0f172a'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBgColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full border border-slate-300 transition-transform ${
                          bgColor === color ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section 3: Watermark Text Overlay */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                3. Title & Text Watermark
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={addText} 
                  onChange={(e) => setAddText(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {addText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3.5 pt-2"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Text Line</label>
                  <input 
                    type="text" 
                    value={userText}
                    maxLength={24}
                    onChange={(e) => setUserText(e.target.value)}
                    className="w-full mt-1 p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase flex justify-between">
                      <span>Size</span>
                      <span>{textSize}px</span>
                    </label>
                    <input 
                      type="range" 
                      min="20" 
                      max="120"
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full h-1 mt-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>

                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase flex justify-between">
                      <span>Y Shift</span>
                      <span>{textYOffset}px</span>
                    </label>
                    <input 
                      type="range" 
                      min="-200" 
                      max="200"
                      value={textYOffset}
                      onChange={(e) => setTextYOffset(Number(e.target.value))}
                      className="w-full h-1 mt-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase">Text Tone</label>
                  <div className="flex gap-1.5">
                    {['#ffffff', '#000000', '#f43f5e', '#1877f2', '#eab308'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTextColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-slate-300 transition ${
                          textColor === c ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Target Canvas Preview Platform */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
            
            {/* Top Toolbar Switch */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-extrabold tracking-tight">
                <Maximize2 className="w-4 h-4 text-slate-300" />
                Target Canvas Resizer ({selectedTemplate.width} x {selectedTemplate.height} PX)
              </span>

              {/* Toggle layout guides */}
              <div className="flex gap-2">
                {selectedTemplate.id === 'profile' && (
                  <button
                    type="button"
                    onClick={() => setShowCircleCrop(!showCircleCrop)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                      showCircleCrop ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Circle Mask
                  </button>
                )}

                {selectedTemplate.safeZoneNote && (
                  <button
                    type="button"
                    onClick={() => setShowSafeZone(!showSafeZone)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                      showSafeZone ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Mobile Safe Grid
                  </button>
                )}
              </div>
            </div>

            {/* Description card / safe zone alert */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 mb-5 text-xs space-y-1.5 text-slate-600">
              <p className="font-extrabold text-slate-800 tracking-tight">{selectedTemplate.name}</p>
              <p>{selectedTemplate.description}</p>
              {selectedTemplate.safeZoneNote && (
                <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-50 mt-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p><strong>Note:</strong> {selectedTemplate.safeZoneNote}</p>
                </div>
              )}
            </div>

            {/* Simulated Live Frame Viewer */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`w-full relative bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden aspect-[16/10] flex items-center justify-center group ${
                imageSrc ? 'cursor-move touch-none' : 'select-none pointer-events-none'
              }`}
            >
              {/* Outer template constraints framing representation */}
              <div className="absolute top-4 left-4 z-10 flex gap-1.5 opacity-40 group-hover:opacity-100 transition duration-300">
                <span className="bg-black/60 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider font-mono">
                  {selectedTemplate.aspectRatio} ASPECT
                </span>
                <span className="bg-black/60 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider font-mono">
                  EXPORT TARGET: {selectedTemplate.width} x {selectedTemplate.height} PX
                </span>
              </div>

              {/* Core interactive Canvas rendering */}
              <div className="w-full h-full max-h-[88%] max-w-[94%] flex items-center justify-center relative">
                <canvas
                  id="facebook-resizer-viewport-canvas"
                  ref={canvasRef}
                  className="rounded-xl border border-white/10 shadow-xl max-w-full max-h-full object-contain block bg-[#0b1329]"
                />
              </div>

              {imageSrc && (
                <div className="absolute bottom-4 right-4 pointer-events-none bg-black/50 text-white/90 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                  <Move className="w-3.5 h-3.5" />
                  Drag / Pan image inside frame
                </div>
              )}
            </div>

            {/* Quick Action export floor */}
            <button
              type="button"
              disabled={!imageSrc}
              onClick={downloadProcessedImage}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 mt-5 transition disabled:opacity-40"
            >
              <Download className="w-4.5 h-4.5" />
              Download Facebook Template
            </button>

            {/* Pro Tips Panel details */}
            <div className="w-full mt-4 flex gap-2.5 items-start bg-blue-50/40 p-4 rounded-xl border border-blue-50">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] text-slate-500">
                <p className="font-bold text-slate-800 font-sans">Pro Resizing Instructions:</p>
                <p>Ensure critical headings, design elements, and logos reside within the mobile/desktop safe borders displayed on screen. This guarantees zero cut-offs on different screen views!</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
