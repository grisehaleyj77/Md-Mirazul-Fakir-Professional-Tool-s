import React, { useState, useRef, useEffect } from 'react';
import { 
  CreditCard,
  Download, 
  Upload, 
  User, 
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  FlipHorizontal,
  Info,
  Sparkles,
  Layers,
  Sliders,
  Award,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

type CardStyle = 'minimalist' | 'corporate' | 'creative' | 'organic' | 'luxury';

interface CardInfo {
  fullName: string;
  jobTitle: string;
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  accentColor: string;
  secondaryColor: string;
  qrContent: string;
  showQR: boolean;
}

export const VisitingCardMaker = () => {
  const [info, setInfo] = useState<CardInfo>({
    fullName: 'Mirazul Islam',
    jobTitle: 'Lead Software Architect',
    companyName: 'Mirazul Workspace',
    tagline: 'Crafting Next-Gen Digital Ecosystems',
    email: 'hello@mirazul.com',
    phone: '+880 1700-000000',
    website: 'https://mirazul.dev',
    address: 'Studio 4, Level 9, Workspace Block, Dhaka',
    accentColor: '#6366f1', // Indigo
    secondaryColor: '#0f172a', // Dark Slate
    qrContent: 'https://mirazul.dev',
    showQR: true
  });

  const [cardStyle, setCardStyle] = useState<CardStyle>('creative');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  // Redraw whenever inputs/styles change
  useEffect(() => {
    drawFrontCard();
    drawBackCard();
  }, [info, cardStyle, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Modern clean background drawing based on template style selection
  const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, isBack: boolean) => {
    ctx.save();
    
    switch (cardStyle) {
      case 'minimalist':
        // High-contrast clean studio offwhite
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);
        
        // Soft elegant sidebar accent
        ctx.fillStyle = info.accentColor;
        ctx.fillRect(0, 0, 15, h);
        break;

      case 'corporate': {
        // Formal corporate layout with diagonal split
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, info.secondaryColor);
        gradient.addColorStop(1, '#1e293b');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (isBack) {
          ctx.rect(0, 0, w, h);
        } else {
          ctx.moveTo(w * 0.55, 0);
          ctx.lineTo(w, 0);
          ctx.lineTo(w, h);
          ctx.lineTo(w * 0.40, h);
          ctx.closePath();
        }
        ctx.fill();

        // Elegant separator band
        if (!isBack) {
          ctx.strokeStyle = info.accentColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(w * 0.55, 0);
          ctx.lineTo(w * 0.40, h);
          ctx.stroke();
        }
        break;
      }

      case 'organic': {
        // Natural soft warm organic colors (Sand background)
        ctx.fillStyle = '#faf7f2';
        ctx.fillRect(0, 0, w, h);

        // Warm foliage/arch style curves or abstract warm blobs
        ctx.fillStyle = 'rgba(217, 119, 6, 0.04)'; // Soft warm amber
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.2, 300, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(20, 83, 45, 0.03)'; // Soft warm green
        ctx.beginPath();
        ctx.arc(w * 0.2, h * 0.9, 250, 0, Math.PI * 2);
        ctx.fill();

        // Left boundary
        ctx.fillStyle = info.accentColor;
        ctx.beginPath();
        ctx.roundRect(40, 40, 8, h - 80, 4);
        ctx.fill();
        break;
      }

      case 'luxury': {
        // Dark velvet rich golden colors
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.5, '#121824');
        bgGrad.addColorStop(1, '#05070c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Golden geometric frame bounds
        ctx.strokeStyle = info.accentColor; // Golden or customized accent
        ctx.lineWidth = 2.5;
        ctx.strokeRect(30, 30, w - 60, h - 60);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 40, w - 80, h - 80);

        // Glowing organic nodes representation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.beginPath();
        ctx.arc(w/2, h/2, 280, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'creative':
      default: {
        // High-tech dark coding vibe with neon mesh overlays
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0b0f19');
        grad.addColorStop(1, '#1b122c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Mesh design elements
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 80) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + 150, h);
          ctx.stroke();
        }

        // Ambient fluid glow blob
        const glowRad = ctx.createRadialGradient(w * 0.8, h * 0.8, 50, w * 0.8, h * 0.8, 350);
        glowRad.addColorStop(0, `${info.accentColor}22`);
        glowRad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowRad;
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.8, 350, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  };

  // QR Code simulator builder
  const drawQRCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    
    // Smooth white background with card matching border radius
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 10, size + 20, size + 20, 12);
    ctx.fill();

    // Outermost framing bounds
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    const anchorSize = Math.floor(size * 0.25);
    // Draw three standardized barcode scanner anchoring boxes
    // Top-Left Anchor
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 4, y + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + 8, anchorSize - 16, anchorSize - 16);

    // Top-Right Anchor
    ctx.fillRect(x + size - anchorSize, y, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + size - anchorSize + 4, y + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + size - anchorSize + 8, y + 8, anchorSize - 16, anchorSize - 16);

    // Bottom-Left Anchor
    ctx.fillRect(x, y + size - anchorSize, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 4, y + size - anchorSize + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + size - anchorSize + 8, anchorSize - 16, anchorSize - 16);

    // Random noise nodes matching QR specs
    ctx.fillStyle = '#000000';
    const cols = 22;
    const pixelWidth = size / cols;
    const textSignature = info.qrContent || info.website;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < cols; r++) {
        // Skip corners holding scanning orientation anchors
        const isAnchor = (c < 7 && r < 7) || (c > cols - 8 && r < 7) || (c < 7 && r > cols - 8);
        if (!isAnchor) {
          const score = textSignature.charCodeAt((c + r) % textSignature.length);
          if ((c * r + score) % 2.5 === 0) {
            ctx.fillRect(x + c * pixelWidth, y + r * pixelWidth, pixelWidth + 0.5, pixelWidth + 0.5);
          }
        }
      }
    }

    ctx.restore();
  };

  // Helper corporate logo draw
  const drawDefaultLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = cardStyle === 'minimalist' || cardStyle === 'organic' ? info.accentColor : '#ffffff';
    
    // Abstract neat architectural geometric triangles representing workspace/office brand
    ctx.beginPath();
    ctx.moveTo(x + size/2, y);
    ctx.lineTo(x + size, y + size * 0.85);
    ctx.lineTo(x, y + size * 0.85);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = cardStyle === 'luxury' ? '#ffffff' : info.secondaryColor;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size * 0.58, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // DRAW FRONT CARD
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard high resolution 3.5x2 Aspect Ratio (1050 x 600)
    ctx.clearRect(0, 0, 1050, 600);
    ctx.save();

    // Render themed background elements
    drawBackground(ctx, 1050, 600, false);

    const isLightText = cardStyle === 'creative' || cardStyle === 'luxury';
    const isCorp = cardStyle === 'corporate';

    // 1. COMPANY NAME & LOGO
    const logoX = 75;
    const logoY = 70;
    const logoSize = 60;

    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      if (img.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, 12);
        ctx.clip();
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      } else {
        img.onload = () => {
          drawFrontCard(); // reload when uploaded resources resolve
        };
      }
    } else {
      drawDefaultLogo(ctx, logoX, logoY, logoSize);
    }

    // Company Text branding title
    ctx.fillStyle = isLightText ? '#ffffff' : isCorp ? '#1e293b' : '#0f172a';
    ctx.font = '900 32px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(info.companyName.toUpperCase(), logoX + 80, logoY + 30);

    // Company slogan subtitle 
    ctx.fillStyle = isLightText ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)';
    ctx.font = '700 italic 14px "Inter", sans-serif';
    ctx.fillText(info.tagline, logoX + 80, logoY + 54);

    // 2. CREATOR PRIMARY METADATA
    const infoX = isCorp ? 75 : 75;
    const infoY = 240;

    // Full Name display text
    ctx.fillStyle = isLightText ? '#ffffff' : '#0f172a';
    ctx.font = '900 italic 44px "Inter", sans-serif';
    ctx.fillText(info.fullName, infoX, infoY + 20);

    // Job Title text
    ctx.fillStyle = info.accentColor;
    ctx.font = '800 21px "JetBrains Mono", monospace';
    ctx.fillText(info.jobTitle.toUpperCase(), infoX, infoY + 58);

    // Simple structural separating line under title block
    ctx.strokeStyle = isLightText ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(infoX, infoY + 85);
    ctx.lineTo(isCorp ? 520 : 660, infoY + 85);
    ctx.stroke();

    // 3. CONTACT FIELD LOGIC
    let detailsY = infoY + 125;
    ctx.font = 'bold 16px "Inter", sans-serif';

    // Helper items builder
    const drawInfoItem = (label: string, value: string, iconType: string) => {
      ctx.fillStyle = isLightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.5)';
      ctx.font = '900 12px "JetBrains Mono", monospace';
      ctx.fillText(label.toUpperCase(), infoX, detailsY);

      ctx.fillStyle = isLightText ? '#f8fafc' : '#1e293b';
      ctx.font = '700 17px "Inter", sans-serif';
      ctx.fillText(value, infoX, detailsY + 22);
      
      detailsY += 58;
    };

    // Draw left details list items
    if (info.phone) drawInfoItem('Contact Phone', info.phone, 'phone');
    if (info.email) drawInfoItem('Email Address', info.email, 'email');

    // 4. SECONDARY INFO (Right block details)
    const rightX = isCorp ? 580 : 540;
    let rightY = infoY + 125;

    const drawInfoItemRight = (label: string, value: string) => {
      ctx.fillStyle = (isLightText && !isCorp) ? 'rgba(255, 255, 255, 0.5)' : isCorp ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.5)';
      ctx.font = '900 12px "JetBrains Mono", monospace';
      ctx.fillText(label.toUpperCase(), rightX, rightY);

      ctx.fillStyle = (isLightText && !isCorp) ? '#f8fafc' : isCorp ? '#ffffff' : '#1e293b';
      ctx.font = '700 17px "Inter", sans-serif';
      ctx.fillText(value, rightX, rightY + 22);
      
      rightY += 58;
    };

    if (info.website) drawInfoItemRight('Corporate Desk', info.website.replace(/^(https?:\/\/)?(www\.)?/, ''));
    if (info.address) {
      // Handle potential long addresses
      const displayAddr = info.address.length > 32 ? info.address.substring(0, 32) + '...' : info.address;
      drawInfoItemRight('Operating HQ', displayAddr);
    }

    // 5. FRONT QR CODE STENCIL
    if (info.showQR) {
      const qrScale = 140;
      const qrX = 1050 - qrScale - 75;
      const qrY = 70;
      drawQRCode(ctx, qrX, qrY, qrScale);
    }

    ctx.restore();
  };

  // DRAW BACK CARD
  const drawBackCard = () => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 1050, 600);
    ctx.save();

    // Render back side themed background elements
    drawBackground(ctx, 1050, 600, true);

    const isLightText = cardStyle === 'creative' || cardStyle === 'luxury' || cardStyle === 'corporate';

    // Center layout of logo and company name for the flip face side
    const cenX = 525;
    const cenY = 250;
    const lSize = 100;

    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      if (img.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cenX - lSize/2, cenY - lSize/2, lSize, lSize, 20);
        ctx.clip();
        ctx.drawImage(img, cenX - lSize/2, cenY - lSize/2, lSize, lSize);
        ctx.restore();
      } else {
        img.onload = () => {
          drawBackCard(); // trigger sync resolution reload
        };
      }
    } else {
      drawDefaultLogo(ctx, cenX - lSize/2, cenY - lSize/2, lSize);
    }

    // Company Brand Name Headline
    ctx.fillStyle = isLightText ? '#ffffff' : '#0f172a';
    ctx.font = '900 italic 44px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.companyName.toUpperCase(), cenX, cenY + lSize/2 + 65);

    // Subtitle tagline Slogan bounds
    ctx.fillStyle = isLightText ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)';
    ctx.font = '700 italic 18px "Inter", sans-serif';
    ctx.fillText(info.tagline, cenX, cenY + lSize/2 + 95);

    // Decorative technology grid/lines matching modern styles
    if (cardStyle === 'creative') {
      ctx.strokeStyle = info.accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cenX - 120, cenY + lSize/2 + 130);
      ctx.lineTo(cenX + 120, cenY + lSize/2 + 130);
      ctx.stroke();
    } else if (cardStyle === 'luxury') {
      ctx.strokeStyle = info.accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cenX - 250, cenY);
      ctx.lineTo(cenX - lSize/2 - 40, cenY);
      ctx.moveTo(cenX + lSize/2 + 40, cenY);
      ctx.lineTo(cenX + 250, cenY);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Download export triggers
  const downloadCardPNG = (face: 'front' | 'back') => {
    setIsExporting(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsExporting(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `VisitingCard_${face}_${info.fullName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export Business/Visiting card png dataset.', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="visiting-card-maker-root">
      
      {/* Intro info header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-6 rounded-3xl border border-indigo-500/15">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600 animate-pulse" />
            Visiting Card Maker Pro
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Design premium corporate & creative visiting cards. Choose exquisite aesthetic styles, compile custom barcodes/QRs, and output high-res print-ready maps instantly.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            id="flip-preview-card-btn"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-black shadow-sm flex items-center gap-2 transition duration-200 capitalize"
          >
            <FlipHorizontal className="w-4 h-4 text-violet-500" />
            Flip Preview Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Style Template Presets */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              1. Choose Core Style Preset
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
              {([
                { id: 'creative', name: 'Creative Techno', desc: 'Dark Neon Grid', border: '#8b5cf6', defaultAccent: '#a78bfa', defaultSec: '#0b0f19' },
                { id: 'corporate', name: 'Classic Corporate', desc: 'Sleek Corporate Split', border: '#3b82f6', defaultAccent: '#3b82f6', defaultSec: '#0f172a' },
                { id: 'minimalist', name: 'Neo Minimal', desc: 'Clean Modern Studio', border: '#111827', defaultAccent: '#111827', defaultSec: '#e2e8f0' },
                { id: 'organic', name: 'Warm Terracotta', desc: 'Earthy Sand Blooms', border: '#b45309', defaultAccent: '#2d6a4f', defaultSec: '#faf7f2' },
                { id: 'luxury', name: 'Gold Luxury', desc: 'Midnight Majestic Royal', border: '#f59e0b', defaultAccent: '#fbbf24', defaultSec: '#090d16' }
              ] as const).map((style) => (
                <button
                  key={style.id}
                  type="button"
                  id={`style-btn-${style.id}`}
                  onClick={() => {
                    setCardStyle(style.id as CardStyle);
                    setInfo({
                      ...info,
                      accentColor: style.defaultAccent,
                      secondaryColor: style.defaultSec
                    });
                  }}
                  className={`px-3.5 py-3 rounded-2xl border text-left transition ${
                    cardStyle === style.id 
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-sm scale-[0.98]' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-800 tracking-tight">
                    {style.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {style.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Accent Color Configs */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Accent Palette</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="accent-color-picker"
                    value={info.accentColor} 
                    onChange={(e) => setInfo({ ...info, accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    id="accent-color-hex"
                    value={info.accentColor} 
                    onChange={(e) => setInfo({ ...info, accentColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-1.5 border border-slate-200 rounded-lg text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Theme base</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="sec-color-picker"
                    value={info.secondaryColor} 
                    onChange={(e) => setInfo({ ...info, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    id="sec-color-hex"
                    value={info.secondaryColor} 
                    onChange={(e) => setInfo({ ...info, secondaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-1.5 border border-slate-200 rounded-lg text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Logo upload block */}
            <div className="pt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Corporate Brand Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" id="uploaded-logo-preview" className="w-full h-full object-cover" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input 
                    type="file" 
                    id="brand-logo-file"
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="upload-logo-custom-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition"
                    >
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      Upload Logo Image
                    </button>
                    {logoUrl && (
                      <button
                        type="button"
                        id="reset-logo-btn"
                        onClick={() => setLogoUrl(null)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        title="Delete Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Loads customized PNG/JPG files.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Contact Information */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              2. Credentials Profile
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="full-name-input">Owner Full Name</label>
                <input 
                  type="text" 
                  id="full-name-input"
                  value={info.fullName} 
                  maxLength={24}
                  onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 duration-150" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="job-title-input">Professional Role</label>
                <input 
                  type="text" 
                  id="job-title-input"
                  value={info.jobTitle} 
                  maxLength={26}
                  onChange={(e) => setInfo({ ...info, jobTitle: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:ring-1 focus:ring-indigo-500 duration-150" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="company-name-input">Company Brand Name</label>
                <input 
                  type="text" 
                  id="company-name-input"
                  value={info.companyName} 
                  maxLength={24}
                  onChange={(e) => setInfo({ ...info, companyName: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white duration-150" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="tagline-input">Brand Slogan / Tagline</label>
                <input 
                  type="text" 
                  id="tagline-input"
                  value={info.tagline} 
                  maxLength={40}
                  onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white duration-150" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="contact-phone-input">Phone Contact</label>
                <input 
                  type="text" 
                  id="contact-phone-input"
                  value={info.phone} 
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white dialog-input" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="email-input">Official Email</label>
                <input 
                  type="email" 
                  id="email-input"
                  value={info.email} 
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white dialog-input" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="website-input">Website Address</label>
                <input 
                  type="text" 
                  id="website-input"
                  value={info.website} 
                  onChange={(e) => setInfo({ ...info, website: e.target.value, qrContent: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white dialog-input" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase" htmlFor="address-input">Corporate HQ Location / Lab</label>
                <input 
                  type="text" 
                  id="address-input"
                  value={info.address} 
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white dialog-input" 
                />
              </div>
            </div>

            {/* QR setup toggle */}
            <div className="pt-2 border-t border-slate-150 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-800">Dynamic Corporate QR</p>
                <p className="text-[10px] text-slate-400">Includes scanner routing directly to portfolio or vCard.</p>
              </div>
              <button
                type="button"
                id="toggle-qr-badge"
                onClick={() => setInfo({ ...info, showQR: !info.showQR })}
                className={`py-2 px-4 rounded-xl text-xs font-black transition ${
                  info.showQR 
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/15' 
                  : 'bg-slate-105 text-slate-500 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {info.showQR ? 'Link QR On' : 'Link QR Off'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Preview & Compilation Block */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Frame Showcase */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-slate-100 rounded-[32px] p-4 md:p-8 min-h-[440px]">
            <div className="perspective-1000 w-full max-w-[620px] aspect-[1.75/1]">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="preserve-3d w-full h-full relative cursor-pointer"
                id="interactive-presentation-card-shell"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                
                {/* FRONT PREVIEW CONTAINER */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-2xl border ${
                    cardStyle === 'minimalist' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasFrontRef} 
                    width={1050} 
                    height={600} 
                    className="w-full h-full pointer-events-none"
                    id="canvas-visit-card-front"
                  />
                  {/* Subtle luxury screen glow filter overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

                {/* BACK PREVIEW CONTAINER */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-2xl border rotate-y-180 ${
                    cardStyle === 'minimalist' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasBackRef} 
                    width={1050} 
                    height={600} 
                    className="w-full h-full pointer-events-none"
                    id="canvas-visit-card-back"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

              </motion.div>
            </div>

            <p className="text-[11px] text-slate-400 font-extrabold uppercase mt-6 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              Click Card bounds to trigger flipping transition and view back of the card.
            </p>
          </div>

          {/* Compile and Download Block */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              3. Compile and Export High-Resolution Assets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                id="download-front-side-btn"
                onClick={() => downloadCardPNG('front')}
                disabled={isExporting}
                className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-600/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD FRONT FILE (HD PNG)
              </button>

              <button
                type="button"
                id="download-back-side-btn"
                onClick={() => downloadCardPNG('back')}
                disabled={isExporting}
                className="py-3 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-slate-900 active:scale-[0.98] shadow-lg shadow-slate-800/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD BACK FILE (HD PNG)
              </button>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-100/60 rounded-2xl flex items-start gap-3 text-xs text-indigo-800 leading-relaxed font-bold">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Print Industry Tip:</strong> The downloaded images are produced at full 1050 × 600 resolution. This mirrors the exact <strong>3.5" x 2"</strong> card frame aspect ratios perfectly suited for physical printshops.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
