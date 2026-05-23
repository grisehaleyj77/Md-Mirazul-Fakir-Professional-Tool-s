import React, { useState, useRef, useEffect } from 'react';
import { 
  Youtube, 
  Download, 
  Upload, 
  RefreshCw, 
  User, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Sliders, 
  FlipHorizontal,
  Info,
  QrCode,
  Tag,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Presets and Types
type CardTheme = 'classic' | 'cyberpunk' | 'gold_creator' | 'minimal' | 'stardust_dark';
type SubTier = 'silver' | 'gold' | 'diamond' | 'none';

interface CreatorInfo {
  channelName: string;
  handle: string;
  ownerName: string;
  joinedYear: string;
  category: string;
  subscriberCount: string;
  videoCount: string;
  viewsCount: string;
  subTier: SubTier;
  hasVerifiedCheck: boolean;
  isNFCEnabled: boolean;
  customHex: string;
}

export const YouTubeIDCardMaker = () => {
  const [info, setInfo] = useState<CreatorInfo>({
    channelName: 'Mirazul Workspace',
    handle: '@mirazul_creations',
    ownerName: 'Mirazul Islam',
    joinedYear: '2024',
    category: 'Science & Technology',
    subscriberCount: '1.25M',
    videoCount: '482',
    viewsCount: '142M',
    subTier: 'gold',
    hasVerifiedCheck: true,
    isNFCEnabled: true,
    customHex: '#ff0000'
  });

  const [theme, setTheme] = useState<CardTheme>('classic');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  // Auto redraw canvases on state or theme changes
  useEffect(() => {
    drawFrontCard();
    drawBackCard();
  }, [info, theme, avatarUrl]);

  // Load avatar image source
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-load default logo
  const drawYoutubeLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, height: number) => {
    const width = height * 1.4;
    // Draw rounded play button rectangle
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.roundRect(x, y - height/2, width, height, height * 0.25);
    ctx.fill();

    // Draw white triangular play icon
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + width * 0.38, y - height * 0.25);
    ctx.lineTo(x + width * 0.68, y);
    ctx.lineTo(x + width * 0.38, y + height * 0.25);
    ctx.closePath();
    ctx.fill();
  };

  // Draw dynamic barcode
  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, code: string) => {
    ctx.save();
    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.globalAlpha = 0.85;

    // Generate pseudo barcode bars
    let currX = x;
    const barCount = 38;
    const minBarWidth = 1.5;
    
    for (let i = 0; i < barCount; i++) {
      const isSpace = (i * 3 + code.charCodeAt(i % code.length)) % 5 === 0;
      const barW = minBarWidth + ((i * 7 + code.charCodeAt(i % code.length)) % 3);
      if (!isSpace && currX + barW < x + width) {
        ctx.fillRect(currX, y, barW, height);
      }
      currX += barW + 1.5;
    }
    
    // Add text label
    ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#a1a1aa';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`ID-YT-${code.toUpperCase()}`, x + width / 2, y + height + 10);
    ctx.restore();
  };

  // Draw Card Front to invisible High-DPI canvas
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 1200 x 760 (Dual density)
    ctx.clearRect(0, 0, 1200, 760);
    ctx.save();

    // Apply Background theme rendering
    applyThemeBackground(ctx, 1200, 760);

    // Decorative Circuit overlay or lines for Gamer/Cyberpunk template
    if (theme === 'cyberpunk') {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 40); ctx.lineTo(1160, 40); ctx.lineTo(1160, 720); ctx.lineTo(40, 720); ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(35, 35, 10, 10);
      ctx.fillRect(1155, 35, 10, 10);
      ctx.fillRect(35, 715, 10, 10);
      ctx.fillRect(1155, 715, 10, 10);
    } else if (theme === 'gold_creator') {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 700);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 1120, 680);
    } else if (theme === 'classic') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
      ctx.beginPath();
      ctx.arc(1000, 380, 400, 0, Math.PI * 2);
      ctx.fill();
    }

    // DRAW HEADER
    // YouTube Logo (left aligned)
    drawYoutubeLogo(ctx, 70, 75, 45);
    
    // Header brand texts
    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '900 italic 30px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('YOUTUBE', 145, 87);

    // Card subtitle type
    ctx.fillStyle = theme === 'gold_creator' ? '#f59e0b' : theme === 'cyberpunk' ? '#d946ef' : theme === 'minimal' ? '#ef4444' : '#ef4444';
    ctx.font = '900 13px "JetBrains Mono", monospace';
    ctx.fillText('CREATOR PASS // PORT ID', 285, 84);

    // Draw NFC Logo if enabled
    if (info.isNFCEnabled) {
      drawNFCBadge(ctx, 1110, 50);
    }

    // AVATAR FRAME (Left portion)
    const avX = 70;
    const avY = 160;
    const avW = 220;
    const avH = 260;

    // Draw Border frame for avatar
    ctx.fillStyle = theme === 'minimal' ? '#e5e7eb' : 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = theme === 'gold_creator' ? '#d97706' : theme === 'cyberpunk' ? '#06b6d4' : theme === 'minimal' ? '#111827' : '#ffffff';
    ctx.lineWidth = theme === 'minimal' ? 4 : 3;
    
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, 20);
    ctx.fill();
    ctx.stroke();

    // Clip & draw Avatar image inside frame
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avX + 4, avY + 4, avW - 8, avH - 8, 16);
    ctx.clip();

    if (avatarUrl) {
      // Draw User Avatar
      const img = new Image();
      img.src = avatarUrl;
      // Wait to verify if loaded properly during canvas cycle
      if (img.complete) {
        ctx.drawImage(img, avX + 4, avY + 4, avW - 8, avH - 8);
      } else {
        img.onload = () => {
          drawFrontCard(); // re-trigger compile when image assets resolve async
        };
      }
    } else {
      // Custom default avatar icon
      ctx.fillStyle = theme === 'minimal' ? '#9ca3af' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(avX, avY, avW, avH);
      
      // Face indicator
      ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#a1a1aa';
      ctx.beginPath();
      ctx.arc(avX + avW/2, avY + avH * 0.4, 40, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(avX + avW/2, avY + avH * 1.05, 80, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // DETAILED INFO LABELS (Right portion)
    const infX = 330;
    
    // Channel Title Name
    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '900 italic 42px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(info.channelName.toUpperCase(), infX, 220);

    // Channel Handle
    ctx.fillStyle = theme === 'gold_creator' ? '#f59e0b' : theme === 'cyberpunk' ? '#06b6d4' : theme === 'minimal' ? '#4b5563' : '#ef4444';
    ctx.font = '800 24px "JetBrains Mono", monospace';
    ctx.fillText(`${info.handle}`, infX, 260);

    // Verified check badge next to Handle name
    if (info.hasVerifiedCheck) {
      const textWidth = ctx.measureText(`${info.handle}`).width;
      drawCheckmarkBadge(ctx, infX + textWidth + 15, 243);
    }

    // Grid details
    // Row 1: Creator Name & Channel Category
    ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#9ca3af';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('CREATOR OWNER / BRAND CAPTAIN', infX, 310);
    ctx.fillText('CONTENT CATEGORY', infX + 400, 310);

    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '900 22px "Inter", sans-serif';
    ctx.fillText(info.ownerName, infX, 340);
    ctx.fillText(info.category, infX + 400, 340);

    // Row 2: Subs Tier Title & Member since
    ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#9ca3af';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('SUBSCRIBER MILESTONE', infX, 395);
    ctx.fillText('MEMBER YEAR', infX + 400, 395);

    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '900 22px "Inter", sans-serif';
    ctx.fillText(`${info.subscriberCount} SUBSCRIBERS`, infX, 425);
    ctx.fillText(`CLASS OF ${info.joinedYear}`, infX + 400, 425);

    // Dynamic Specialization Milestone tag badge
    drawTagBadge(ctx, infX, 470, info.subTier);

    // SIDE BARCODE & SERIAL NUMBER
    drawBarcode(ctx, avX, 480, avW, 55, info.joinedYear + info.channelName.length);

    // Official watermark/signature style footer
    ctx.fillStyle = theme === 'minimal' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    ctx.font = '900 220px "Inter", sans-serif';
    ctx.fillText('YT', 860, 660);

    // Official stamp label
    ctx.fillStyle = theme === 'gold_creator' ? 'rgba(217, 119, 6, 0.3)' : theme === 'cyberpunk' ? 'rgba(217, 70, 239, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.strokeStyle = theme === 'gold_creator' ? '#d97706' : theme === 'cyberpunk' ? '#d946ef' : '#ef4444';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(infX, 580, 260, 45);
    ctx.fillText('SECURITY STATUS: AUTHORIZED', infX + 15, 608);

    ctx.restore();
  };

  // Draw Card Back to invisible High-DPI canvas
  const drawBackCard = () => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: 1200 x 760 (Dual density)
    ctx.clearRect(0, 0, 1200, 760);
    ctx.save();

    // Background Theme
    applyThemeBackground(ctx, 1200, 760);

    // Black Magnetic security strip
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 70, 1200, 130);

    // Hologram security chip style graphic
    ctx.fillStyle = 'linear-gradient(135deg, #a5f3fc, #c084fc, #f472b6, #818cf8)';
    const gradHolo = ctx.createLinearGradient(70, 250, 190, 350);
    gradHolo.addColorStop(0, '#a5f3fc');
    gradHolo.addColorStop(0.3, '#c084fc');
    gradHolo.addColorStop(0.7, '#f472b6');
    gradHolo.addColorStop(1, '#818cf8');
    ctx.fillStyle = gradHolo;
    ctx.beginPath();
    ctx.roundRect(70, 250, 120, 100, 12);
    ctx.fill();

    // Circuit styling lines on hologram
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(85, 260, 90, 80);
    ctx.beginPath();
    ctx.moveTo(110, 260); ctx.lineTo(110, 340);
    ctx.moveTo(150, 260); ctx.lineTo(150, 340);
    ctx.moveTo(85, 290); ctx.lineTo(175, 290);
    ctx.moveTo(85, 310); ctx.lineTo(175, 310);
    ctx.stroke();

    // Details columns
    const dX = 260;
    
    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '800 italic 28px "Inter", sans-serif';
    ctx.fillText('OFFICIAL DIGITAL PLATFORM IDENTIFICATION', dX, 270);

    // Core Metrics on Back
    ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#a1a1aa';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('TOTAL PUBLISHED VIDEOS', dX, 335);
    ctx.fillText('ESTIMATED VIEWS IN FLUX', dX + 320, 335);

    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = '900 italic 30px "Inter", sans-serif';
    ctx.fillText(`${info.videoCount} VIDEOS`, dX, 375);
    ctx.fillText(`${info.viewsCount} VIEWS`, dX + 320, 375);

    // Commemorative Terms
    ctx.fillStyle = theme === 'minimal' ? '#6b7280' : '#d1d5db';
    ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'left';
    
    const terms = [
      'This smart ID card is an unofficial commemorative merchandise honoring your channel milestone achievement.',
      'Designed exclusively for the creator named on the front of this access pass.',
      'Subject to full community guidelines of content creator ecosystems.',
      'Features built-in proximity NFC and QR link matching credentials.'
    ];

    let tY = 445;
    terms.forEach(term => {
      ctx.beginPath();
      ctx.arc(dX + 5, tY - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'gold_creator' ? '#f59e0b' : '#ef4444';
      ctx.fill();

      ctx.fillStyle = theme === 'minimal' ? '#4b5563' : '#a1a1aa';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillText(term, dX + 20, tY);
      tY += 24;
    });

    // CUSTOM CHANNEL QR CODE (Right corner)
    drawQRCodePlaceholder(ctx, 940, 240, 190);

    // Footer signature block
    ctx.fillStyle = theme === 'minimal' ? '#e5e7eb' : 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(dX, 570, 600, 110);
    
    ctx.fillStyle = theme === 'minimal' ? '#374151' : '#d1d5db';
    ctx.font = 'italic bold 13px "JetBrains Mono", monospace';
    ctx.fillText(`YOUTUBE VERIFIED SYSTEM ARCHITECT // ${info.handle.toUpperCase()}`, dX + 20, 595);

    // Decorative Signature Line
    ctx.strokeStyle = theme === 'gold_creator' ? '#d97706' : '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(dX + 20, 640);
    ctx.bezierCurveTo(dX + 100, 610, dX + 200, 650, dX + 300, 620);
    ctx.stroke();

    ctx.restore();
  };

  // Helper background compiler
  const applyThemeBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    switch (theme) {
      case 'cyberpunk': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1136');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        break;
      }
      case 'gold_creator': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#111827');
        grad.addColorStop(0.5, '#030712');
        grad.addColorStop(1, '#0b0f19');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        break;
      }
      case 'minimal': {
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, w, h);
        break;
      }
      case 'stardust_dark': {
        const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w/1.2);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        
        // draw subtle stardust stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const x = (i * 37) % w;
          const y = (i * 61) % h;
          const size = ((i % 3) + 1) * 0.5;
          ctx.globalAlpha = (i % 5 + 2) / 10;
          ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1.0;
        break;
      }
      case 'classic':
      default: {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f0f0f');
        grad.addColorStop(0.7, '#1f1313');
        grad.addColorStop(1, '#130404');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        break;
      }
    }
  };

  // Helper NFC Icon
  const drawNFCBadge = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.strokeStyle = theme === 'minimal' ? '#ef4444' : '#FF0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y + 20, 15, -Math.PI/4, Math.PI/4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 5, y + 20, 22, -Math.PI/4, Math.PI/4);
    ctx.stroke();

    ctx.fillStyle = theme === 'minimal' ? '#111827' : '#FFFFFF';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NFC', x, y + 22);
    ctx.restore();
  };

  // Helper checkmark badge
  const drawCheckmarkBadge = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.fillStyle = theme === 'gold_creator' ? '#f59e0b' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Check lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 1, y + 3);
    ctx.lineTo(x + 5, y - 4);
    ctx.stroke();
    ctx.restore();
  };

  // Tag Badge Sub tier
  const drawTagBadge = (ctx: CanvasRenderingContext2D, x: number, y: number, tier: SubTier) => {
    ctx.save();
    let text = 'STANDARD CREATOR';
    let gradient = ctx.createLinearGradient(x, y, x + 240, y);

    if (tier === 'silver') {
      text = 'SILVER PLAY MEMBER';
      gradient.addColorStop(0, '#9ca3af');
      gradient.addColorStop(1, '#4b5563');
    } else if (tier === 'gold') {
      text = 'GOLD PLAY ELITE';
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(1, '#d97706');
    } else if (tier === 'diamond') {
      text = 'DIAMOND ROYAL CREATOR';
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(0.5, '#6366f1');
      gradient.addColorStop(1, '#a855f7');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#b91c1c');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, 260, 40, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 italic 13px "Inter", sans-serif';
    ctx.fillText(text, x + 15, y + 25);
    ctx.restore();
  };

  // Mock QR Drawer on physical canvas back
  const drawQRCodePlaceholder = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    // Border wrap
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - 10, y - 10, size + 20, size + 20);

    ctx.fillStyle = '#000000';
    ctx.strokeRect(x, y, size, size);

    // 3 Corner Anchors
    const anchorSize = size * 0.25;
    ctx.fillRect(x, y, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 4, y + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + 8, anchorSize - 16, anchorSize - 16);

    ctx.fillRect(x + size - anchorSize, y, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + size - anchorSize + 4, y + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + size - anchorSize + 8, y + 8, anchorSize - 16, anchorSize - 16);

    ctx.fillRect(x, y + size - anchorSize, anchorSize, anchorSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 4, y + size - anchorSize + 4, anchorSize - 8, anchorSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + size - anchorSize + 8, anchorSize - 16, anchorSize - 16);

    // Random QR noise simulation
    ctx.fillStyle = '#000000';
    const numDots = 24;
    const dotW = size / numDots;
    
    for (let col = 0; col < numDots; col++) {
      for (let row = 0; row < numDots; row++) {
        // Skip corner anchor coordinates
        const isAnchor = (col < 7 && row < 7) || (col > numDots - 8 && row < 7) || (col < 7 && row > numDots - 8);
        if (!isAnchor) {
          const charSum = info.channelName.charCodeAt(col % info.channelName.length) + info.handle.charCodeAt(row % info.handle.length);
          if ((col * row + charSum) % 3 === 0) {
            ctx.fillRect(x + col * dotW, y + row * dotW, dotW + 0.5, dotW + 0.5);
          }
        }
      }
    }

    // Mini Youtube play mark inside center of QR code
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + size/2 - 12, y + size/2 - 10, 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x + size/2 - 3, y + size/2 - 5);
    ctx.lineTo(x + size/2 + 4, y + size/2);
    ctx.lineTo(x + size/2 - 3, y + size/2 + 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Download high-resolution front/back PNG maps
  const downloadCardImage = (face: 'front' | 'back') => {
    setIsGenerating(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `YouTube_ID_${face}_${info.channelName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="yt-id-workspace">
      
      {/* Intro info section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-red-500/10 to-indigo-500/10 p-6 rounded-3xl border border-red-500/15">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Youtube className="w-7 h-7 text-red-600 fill-current animate-pulse" />
            YouTube Creator ID Card Maker
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Design dynamic highly official badges containing subscriber count, category styles, barcode codes, custom signatures, profile avatars and NFC tags.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-black shadow-sm flex items-center gap-2 transition duration-250 capitalize"
          >
            <FlipHorizontal className="w-4 h-4 text-indigo-500" />
            Flip Preview Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Template selection */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              1. Choose Badge Aesthetics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {(['classic', 'stardust_dark', 'cyberpunk', 'gold_creator', 'minimal'] as CardTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  type="button"
                  className={`px-3 py-3 rounded-2xl border text-left transition-all ${
                    theme === t 
                    ? 'border-red-500 bg-red-50/20 shadow-sm scale-[0.98]' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <p className="font-extrabold text-xs capitalize text-slate-800">
                    {t.replace('_', ' ')}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${
                      t === 'classic' ? 'bg-red-600' :
                      t === 'stardust_dark' ? 'bg-slate-750 border border-slate-500' :
                      t === 'cyberpunk' ? 'bg-cyan-500' :
                      t === 'gold_creator' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    <span className="text-[9px] font-bold text-slate-400 capitalize">
                      {t === 'classic' ? 'Metallic Red' : t === 'stardust_dark' ? 'Stellar Dark' : t === 'cyberpunk' ? 'Gamer Neon' : t === 'gold_creator' ? 'Elite Brass' : 'Clean Stark'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Avatar upload */}
            <div className="pt-2">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Profile Avatar Icon</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleAvatarUpload} 
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
                    >
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      Upload Avatar
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(null)}
                        className="px-2.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Supports square PNG/JPG references up to 5MB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Creator Stats config */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-500" />
              2. Channel Metadata Attributes
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Channel Name</label>
                <input 
                  type="text" 
                  value={info.channelName} 
                  maxLength={24}
                  onChange={(e) => setInfo({...info, channelName: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 font-extrabold focus:bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 duration-200" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Handle Name</label>
                <input 
                  type="text" 
                  value={info.handle} 
                  onChange={(e) => setInfo({...info, handle: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 font-extrabold focus:bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 duration-200" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Captain / Owner Name</label>
                <input 
                  type="text" 
                  value={info.ownerName} 
                  maxLength={20}
                  onChange={(e) => setInfo({...info, ownerName: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 font-extrabold focus:bg-white duration-200" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Channel Topic</label>
                <select 
                  value={info.category} 
                  onChange={(e) => setInfo({...info, category: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50/50 rounded-xl text-slate-800 font-extrabold focus:bg-white"
                >
                  <option value="Science & Technology">Science & Tech</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Music & Art">Music & Art</option>
                  <option value="Education & Tutorial">Education & Tutorials</option>
                  <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
                  <option value="Business & Finance">Business & Finance</option>
                </select>
              </div>
            </div>

            {/* Sub Stats Preset selectors */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase block">Subscriber Presets & Play Buttons</label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                {([
                  { tier: 'none', label: 'Starter', count: '940+', check: false },
                  { tier: 'silver', label: '100K+', count: '100K+', check: true },
                  { tier: 'gold', label: '1M+', count: '1.25M', check: true },
                  { tier: 'diamond', label: '10M+', count: '12.4M', check: true }
                ] as const).map((preset) => (
                  <button
                    key={preset.tier}
                    type="button"
                    onClick={() => setInfo({
                      ...info, 
                      subTier: preset.tier, 
                      subscriberCount: preset.count,
                      hasVerifiedCheck: preset.check
                    })}
                    className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition ${
                      info.subTier === preset.tier 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Subs Count</label>
                <input 
                  type="text" 
                  value={info.subscriberCount} 
                  onChange={(e) => setInfo({...info, subscriberCount: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50 rounded-xl text-slate-800 font-bold" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Videos</label>
                <input 
                  type="text" 
                  value={info.videoCount} 
                  onChange={(e) => setInfo({...info, videoCount: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50 rounded-xl text-slate-800 font-bold" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Views Limit</label>
                <input 
                  type="text" 
                  value={info.viewsCount} 
                  onChange={(e) => setInfo({...info, viewsCount: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50 rounded-xl text-slate-800 font-bold" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Class Join Year</label>
                <input 
                  type="text" 
                  value={info.joinedYear} 
                  onChange={(e) => setInfo({...info, joinedYear: e.target.value})}
                  className="w-full p-2.5 text-xs border border-slate-200 bg-slate-50 rounded-xl text-slate-800 font-bold" 
                />
              </div>

              <div className="flex flex-col justify-end space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">NFC Hologram</label>
                <button
                  type="button"
                  onClick={() => setInfo({...info, isNFCEnabled: !info.isNFCEnabled})}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold transition duration-200 px-3 ${
                    info.isNFCEnabled 
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {info.isNFCEnabled ? 'Proximity Chip On' : 'No Chip Seal'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Canvas & Card previews */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Physical preview shell */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-slate-100 rounded-3xl p-4 md:p-8 min-h-[440px]">
            <div className="perspective-1000 w-full max-w-[600px] aspect-[1.58/1]">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="preserve-3d w-full h-full relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                
                {/* FRONT SIDE PREVIEW */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-2xl border ${
                    theme === 'minimal' ? 'border-gray-250 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasFrontRef} 
                    width={1200} 
                    height={760} 
                    className="w-full h-full pointer-events-none"
                  />
                  
                  {/* Subtle glass shimmer layer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

                {/* BACK SIDE PREVIEW */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-2xl border rotate-y-180 ${
                    theme === 'minimal' ? 'border-gray-250 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasBackRef} 
                    width={1200} 
                    height={760} 
                    className="w-full h-full pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/12 pointer-events-none" />
                </div>

              </motion.div>
            </div>

            <p className="text-[11px] text-slate-400 font-extrabold uppercase mt-6 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              Click card above to flip and configure details on front or back.
            </p>
          </div>

          {/* Download & Export blocks */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              3. Compile & Export Smart ID Card
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => downloadCardImage('front')}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-red-700 active:scale-[0.98] shadow-lg shadow-red-600/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD FRONT SIDE (HD PNG)
              </button>

              <button
                type="button"
                onClick={() => downloadCardImage('back')}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-slate-900 active:scale-[0.98] shadow-lg shadow-slate-800/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD BACK SIDE (HD PNG)
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100/60 rounded-2xl flex items-start gap-3 text-xs text-amber-800 leading-relaxed font-bold">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Aesthetic Pro-Tip:</strong> Set the Subscriber preset level above <strong>1M+</strong> to get the glittering gold creator metallic frame and custom checkmark crest highlights instantly.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
