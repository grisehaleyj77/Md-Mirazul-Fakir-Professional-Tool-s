import React, { useState, useRef, useEffect } from 'react';
import { 
  Contact, 
  Download, 
  Upload, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  FlipHorizontal,
  Info,
  Layers,
  Award,
  Trash2,
  Chrome,
  Briefcase,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

type BadgeType = 'Googler' | 'Intern' | 'Contractor' | 'Realist' | 'Visitor';
type ThemeStyle = 'classic_google' | 'material_dark' | 'deepmind_tech' | 'cloud_minimal';

interface GooglerInfo {
  fullName: string;
  jobTitle: string;
  department: string;
  badgeType: BadgeType;
  officeLocation: string;
  employeeId: string;
  bloodGroup: string;
  joiningDate: string;
  email: string;
  phone: string;
  accentColor: string;
  customHex: string;
  qrContent: string;
}

export const GoogleIDCardMaker = () => {
  const [info, setInfo] = useState<GooglerInfo>({
    fullName: 'Larry Page',
    jobTitle: 'Principal Software Dev',
    department: 'Google Search & Assistant',
    badgeType: 'Googler',
    officeLocation: 'Mountain View, CA',
    employeeId: 'GOOG-1998-0904',
    bloodGroup: 'O+',
    joiningDate: '2026-05-23',
    email: 'larry@google.com',
    phone: '+1 (650) 253-0000',
    accentColor: '#34a853', // Google Green
    customHex: '#4285f4', // Google Blue
    qrContent: 'Googler Larry Page | Mountain View Campus'
  });

  const [theme, setTheme] = useState<ThemeStyle>('classic_google');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawFrontCard();
    drawBackCard();
  }, [info, theme, avatarUrl, signatureUrl]);

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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSignatureUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawGoogleGLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    // Complex Google "G" logo rendering using canvas arcs
    ctx.translate(x, y);
    ctx.scale(r / 20, r / 20);

    // Blue block
    ctx.fillStyle = '#4285f4';
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI / 4, 0);
    ctx.lineTo(19, 2);
    ctx.lineTo(19, -3);
    ctx.arc(0, 0, 20, -0.6, -Math.PI / 4);
    ctx.closePath();
    ctx.fill();

    // Red block
    ctx.fillStyle = '#ea4335';
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI, -Math.PI / 4);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Yellow block
    ctx.fillStyle = '#fbbc05';
    ctx.beginPath();
    ctx.arc(0, 0, 20, Math.PI / 2, Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Green block
    ctx.fillStyle = '#34a853';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI / 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // White cutoff inner circle
    ctx.fillStyle = theme === 'material_dark' ? '#121214' : '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // G horizontal bar
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(0, -3, 19, 6);

    ctx.restore();
  };

  const drawGoogleMultiColorStrip = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    const part = width / 4;
    
    // Google Blue
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(x, y, part, height);
    
    // Google Red
    ctx.fillStyle = '#ea4335';
    ctx.fillRect(x + part, y, part, height);
    
    // Google Yellow
    ctx.fillStyle = '#fbbc05';
    ctx.fillRect(x + part * 2, y, part, height);
    
    // Google Green
    ctx.fillStyle = '#34a853';
    ctx.fillRect(x + part * 3, y, part, height);

    ctx.restore();
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, code: string) => {
    ctx.save();
    ctx.fillStyle = theme === 'material_dark' ? '#000000' : '#FFFFFF';
    ctx.globalAlpha = 0.95;

    let currX = x;
    const barCount = 48;
    const minBarWidth = 1.5;

    for (let i = 0; i < barCount; i++) {
      const isSpace = (i * 9 + code.charCodeAt(i % code.length)) % 6 === 0;
      const barW = minBarWidth + ((i * 4 + code.charCodeAt(i % code.length)) % 3);
      if (!isSpace && currX + barW < x + width) {
        ctx.fillStyle = theme === 'material_dark' ? '#ffffff' : '#0f172a';
        ctx.fillRect(currX, y, barW, height);
      }
      currX += barW + 1.8;
    }

    ctx.fillStyle = theme === 'material_dark' ? '#9ca3af' : '#475569';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${code.toUpperCase()}`, x + width / 2, y + height + 15);
    ctx.restore();
  };

  const drawQRCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 12);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.strokeRect(x, y, size, size);

    const anchorSize = Math.floor(size * 0.25);
    const drawAnchor = (ax: number, ay: number) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ax, ay, anchorSize, anchorSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ax + 3, ay + 3, anchorSize - 6, anchorSize - 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ax + 6, ay + 6, anchorSize - 12, anchorSize - 12);
    };

    drawAnchor(x, y); 
    drawAnchor(x + size - anchorSize, y); 
    drawAnchor(x, y + size - anchorSize); 

    ctx.fillStyle = '#0f172a';
    const numRows = 22;
    const pixelSize = size / numRows;
    const payload = info.qrContent || info.employeeId;

    for (let c = 0; c < numRows; c++) {
      for (let r = 0; r < numRows; r++) {
        const isAnchor = (c < 7 && r < 7) || (c > numRows - 8 && r < 7) || (c < 7 && r > numRows - 8);
        if (!isAnchor) {
          const charCode = payload.charCodeAt((c * 4 + r * 5) % payload.length);
          if ((c * r + charCode) % 3 === 0) {
            ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize + 0.5, pixelSize + 0.5);
          }
        }
      }
    }

    ctx.restore();
  };

  const applyThemeBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, isBack: boolean) => {
    switch (theme) {
      case 'material_dark': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#121214');
        grad.addColorStop(0.5, '#1e1e24');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Tech grid subtle dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let ix = 0; ix < w; ix += 35) {
          for (let iy = 0; iy < h; iy += 35) {
            ctx.beginPath();
            ctx.arc(ix, iy, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }
      case 'deepmind_tech': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#020014');
        grad.addColorStop(0.6, '#080c34');
        grad.addColorStop(1, '#020210');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Geometric brain/AI mesh lines
        ctx.strokeStyle = 'rgba(66, 133, 244, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < w; i += 70) {
          ctx.moveTo(i, 0); ctx.lineTo(w - i, h);
          ctx.moveTo(0, i); ctx.lineTo(w, h - i);
        }
        ctx.stroke();
        break;
      }
      case 'cloud_minimal': {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // Soft cloud atmospheric circles
        ctx.fillStyle = 'rgba(66, 133, 244, 0.03)';
        ctx.beginPath();
        ctx.arc(w * 0.2, h * 0.3, 400, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(52, 168, 83, 0.02)';
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.8, 300, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'classic_google':
      default: {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        // Standard gray framing bottom card arcs
        ctx.fillStyle = 'rgba(241, 243, 244, 0.45)';
        ctx.beginPath();
        ctx.arc(w / 2, h + 200, 450, Math.PI, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  };

  const drawHeaderBlock = (ctx: CanvasRenderingContext2D, w: number, isBack: boolean) => {
    const isDark = theme === 'material_dark' || theme === 'deepmind_tech';

    // 1. Badge Type top lanyard/header strip
    let lanyardColor = '#34a853'; // default Googler green
    if (info.badgeType === 'Intern') lanyardColor = '#4285f4'; // red/blue
    if (info.badgeType === 'Contractor') lanyardColor = '#fbbc05'; // yellow
    if (info.badgeType === 'Realist') lanyardColor = '#34a853';
    if (info.badgeType === 'Visitor') lanyardColor = '#ea4335'; // red

    ctx.fillStyle = lanyardColor;
    ctx.fillRect(0, 0, w, 24);

    // Multi color G stripe
    drawGoogleMultiColorStrip(ctx, 0, 24, w, 6);

    // Google Logo Name representation
    const logoX = 75;
    const logoY = 85;

    // Colorful Google text
    ctx.font = '900 32px "Inter", sans-serif';
    ctx.textAlign = 'left';

    const renderColoredLogo = (lx: number, ly: number) => {
      const letters = [
        { char: 'G', col: '#4285f4' },
        { char: 'o', col: '#ea4335' },
        { char: 'o', col: '#fbbc05' },
        { char: 'g', col: '#4285f4' },
        { char: 'l', col: '#34a853' },
        { char: 'e', col: '#ea4335' }
      ];
      let offset = 0;
      letters.forEach(item => {
        ctx.fillStyle = item.col;
        ctx.fillText(item.char, lx + offset, ly);
        offset += ctx.measureText(item.char).width + 0.5;
      });

      // Special logo suffix
      if (theme === 'deepmind_tech') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '700 italic 16px "JetBrains Mono", monospace';
        ctx.fillText(' DEEPMIND', lx + offset + 10, ly - 4);
      }
    };

    renderColoredLogo(logoX, logoY + 15);

    // Dynamic right side Campus badge seal
    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = '900 italic 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('MOUNTAIN VIEW HQ', w - 75, logoY);

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.4)';
    ctx.font = '700 9px monospace';
    ctx.fillText('AUTHORIZED ADMISSION', w - 75, logoY + 15);

    // Divider
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(40, 150, w - 80, 2);
  };

  // Draw FRONT ID Card
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 960;
    const h = 1480;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Custom Background configuration 
    applyThemeBackground(ctx, w, h, false);

    // Header segment
    drawHeaderBlock(ctx, w, false);

    const isDark = theme === 'material_dark' || theme === 'deepmind_tech';

    // Massive vertical badge type identifier banner on bottom corner representation
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.03)';
    ctx.font = '900 130px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.badgeType.toUpperCase(), w / 2, 450);

    // PORTRAIT COVER PHOTO FRAME
    const avW = 340;
    const avH = 410;
    const avX = (w - avW) / 2;
    const avY = 230;

    // Badge Type color bounding outline
    let badgeColor = '#34a853';
    if (info.badgeType === 'Intern') badgeColor = '#4285f4';
    if (info.badgeType === 'Contractor') badgeColor = '#fbbc05';
    if (info.badgeType === 'Visitor') badgeColor = '#ea4335';

    ctx.fillStyle = isDark ? '#1a1a24' : '#f8fafc';
    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, 24);
    ctx.fill();
    ctx.stroke();

    // Clip & draw face image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avX + 4, avY + 4, avW - 8, avH - 8, 20);
    ctx.clip();

    if (avatarUrl) {
      const img = new Image();
      img.src = avatarUrl;
      if (img.complete) {
        ctx.drawImage(img, avX + 4, avY + 4, avW - 8, avH - 8);
      } else {
        img.onload = () => {
          drawFrontCard();
        };
      }
    } else {
      ctx.fillStyle = isDark ? '#2e2e38' : '#e2e8f0';
      ctx.fillRect(avX, avY, avW, avH);

      ctx.fillStyle = isDark ? '#4b5563' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(w / 2, avY + 160, 65, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w / 2, avY + avH + 50, 160, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Google G Logo overlay badge on the corner of the photo of employee
    drawGoogleGLogo(ctx, avX + avW - 35, avY + avH - 35, 26);

    // USER CREDENTIALS BLOCK
    // Full Name
    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = '900 italic 50px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.fullName, w / 2, 715);

    // Job Title
    ctx.fillStyle = badgeColor;
    ctx.font = '800 23px "JetBrains Mono", monospace';
    ctx.fillText(info.jobTitle.toUpperCase(), w / 2, 765);

    // Fine security horizontal line
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 850, w - 200, 1);

    // SECONDARY FIELD METADATA LIST (Google Specs)
    const colLeft = 140;
    const colRight = 520;
    const baseGridY = 900;

    const drawMetaField = (mx: number, my: number, label: string, val: string) => {
      ctx.fillStyle = isDark ? '#9ca3af' : '#475569';
      ctx.font = '900 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label.toUpperCase(), mx, my);

      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = '900 24px "Inter", sans-serif';
      ctx.fillText(val, mx, my + 30);
    };

    drawMetaField(colLeft, baseGridY, 'DEPARTMENT / LAB', info.department);
    drawMetaField(colLeft, baseGridY + 110, 'OFFICE CAM CAMPUS', info.officeLocation);
    drawMetaField(colLeft, baseGridY + 220, 'TELEPHONE DIAL', info.phone);

    drawMetaField(colRight, baseGridY, 'EMPLOYEE ID FORMAT', info.employeeId);
    drawMetaField(colRight, baseGridY + 110, 'REGISTRATION ANNIVERSARY', info.joiningDate);
    drawMetaField(colRight, baseGridY + 220, 'BLOOD GP TYPE', info.bloodGroup || 'N/A');

    // NFC Security chip passive representation
    ctx.strokeStyle = '#f59e0b'; // Gold contact outline
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.beginPath();
    const chipX = 720;
    const chipY = 60;
    ctx.roundRect(chipX, chipY, 45, 40, 8);
    ctx.fill();
    ctx.stroke();

    // Signature Box line details
    const sigX = 140;
    const sigY = 1220;
    ctx.fillStyle = isDark ? '#9ca3af' : '#475569';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('AUTHORIZED SPECIAL SIGNATURE', sigX, sigY + 100);

    if (signatureUrl) {
      const sigImg = new Image();
      sigImg.src = signatureUrl;
      if (sigImg.complete) {
        ctx.drawImage(sigImg, sigX, sigY, 200, 75);
      } else {
        sigImg.onload = () => {
          drawFrontCard();
        };
      }
    } else {
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(sigX, sigY, 200, 75);
      ctx.setLineDash([]);
      
      ctx.fillStyle = isDark ? '#4b5563' : '#a1a1aa';
      ctx.font = 'italic 12px "Inter", sans-serif';
      ctx.fillText('Googler Signature', sigX + 38, sigY + 45);
    }

    // Google Corporate admitting Seal Stamper
    const sealX = 660;
    const sealY = 1220;
    ctx.fillStyle = 'rgba(66, 133, 244, 0.08)';
    ctx.strokeStyle = '#4285f4';
    ctx.beginPath();
    ctx.arc(sealX + 50, sealY + 40, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4285f4';
    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GOOGLE CORP', sealX + 50, sealY + 32);
    ctx.fillText('SECURED ACCESS', sealX + 50, sealY + 48);

    ctx.restore();
  };

  // Draw BACK ID Card
  const drawBackCard = () => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 960;
    const h = 1480;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    applyThemeBackground(ctx, w, h, true);

    // Header segment
    drawHeaderBlock(ctx, w, true);

    const isDark = theme === 'material_dark' || theme === 'deepmind_tech';

    // Top Magnetic high density swipe block stripe
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 160, w, 160);

    // Back Guideline rules
    const rX = 80;
    let rY = 400;

    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = '900 italic 30px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('GOOGLE SECURITY CAMPUS CODES', rX, rY);

    const principles = [
      'This credential card is strictly non-transferable and remains physical property of Google LLC.',
      'Possessor agrees to follow and respect official Google Community Codes and campus safety rules.',
      'Must be wore, visible and verified while present on the Mountain View or local regional campuses.',
      'If found, please drop into standard postal network or return to regional Google Reception desk.',
      'Contains built-in passive smart contact loop chips mapping credential profiles.',
      'Visitor badges are only authorized for direct supervised zone allocations.'
    ];

    rY += 60;
    ctx.font = 'bold 15px "Inter", sans-serif';
    principles.forEach(p => {
      // bullet colorful icon G points
      ctx.beginPath();
      ctx.arc(rX + 8, rY - 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4285f4'; // Blue points
      ctx.fill();

      ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
      ctx.fillText(p, rX + 30, rY);
      rY += 45;
    });

    // Barcode details
    drawBarcode(ctx, rX, h - 450, w - rX * 2, 90, info.employeeId + 'GOOG');

    // QR Code
    const qScale = 190;
    const qX = (w - qScale) / 2;
    drawQRCode(ctx, qX, h - 280, qScale);

    ctx.restore();
  };

  const downloadCardPNG = (face: 'front' | 'back') => {
    setIsGenerating(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `Googler_ID_${face}_${info.fullName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="google-id-card-maker-root">
      
      {/* Informational intro header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10 p-6 rounded-3xl border border-red-500/15">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Chrome className="w-7 h-7 text-blue-600 animate-spin-slow" />
            Google ID Card & Badge Maker
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Model professional Googler identity badges, milestone passes, and visitor authority cards offline. Upload portraits, customize signature marks, and compile high-resolution assets.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-black shadow-sm flex items-center gap-2 transition duration-200"
          >
            <FlipHorizontal className="w-4 h-4 text-google-green" />
            Flip Preview Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Presets & Design */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              1. Customize Design & Security
            </h3>

            {/* Badge type presets */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Authorization level</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {(['Googler', 'Intern', 'Contractor', 'Visitor'] as BadgeType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInfo({ ...info, badgeType: type })}
                    className={`px-3 py-2 rounded-xl text-xs font-black border transition ${
                      info.badgeType === type 
                        ? 'border-blue-500 bg-blue-50/20 text-blue-800'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetics theme layouts */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Core Style Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'classic_google', name: 'Classic Googly' },
                  { id: 'material_dark', name: 'Material Dark' },
                  { id: 'deepmind_tech', name: 'DeepMind Intelligence' },
                  { id: 'cloud_minimal', name: 'Google Cloud Stark' }
                ] as const).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as ThemeStyle)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      theme === t.id 
                        ? 'border-blue-500 bg-blue-50/10 font-black' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-extrabold text-xs text-slate-800 tracking-tight">{t.name}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Preset Theme</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar and Sign upload forms */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              {/* Photo upload row */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Passport Portrait</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Portrait" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={avatarInputRef} 
                      className="hidden" 
                      onChange={handleAvatarUpload} 
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[11px] hover:bg-slate-800 transition"
                      >
                        Upload Photo
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl(null)}
                          className="px-2 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Upload row */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Signature" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">Sign</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={signatureInputRef} 
                      className="hidden" 
                      onChange={handleSignatureUpload} 
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => signatureInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[11px] hover:bg-slate-800 transition"
                      >
                        Upload Signature
                      </button>
                      {signatureUrl && (
                        <button
                          type="button"
                          onClick={() => setSignatureUrl(null)}
                          className="px-2 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Googler Details registry form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              2. Badge registry details
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Employee Full Name</label>
                <input 
                  type="text" 
                  value={info.fullName} 
                  maxLength={22}
                  onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Job Role / Designation</label>
                <input 
                  type="text" 
                  value={info.jobTitle} 
                  maxLength={26}
                  onChange={(e) => setInfo({ ...info, jobTitle: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Department / Lab</label>
                <input 
                  type="text" 
                  value={info.department} 
                  maxLength={34}
                  onChange={(e) => setInfo({ ...info, department: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Office Location Campaign</label>
                <input 
                  type="text" 
                  value={info.officeLocation} 
                  maxLength={24}
                  onChange={(e) => setInfo({ ...info, officeLocation: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Blood Group</label>
                <input 
                  type="text" 
                  value={info.bloodGroup} 
                  maxLength={4}
                  onChange={(e) => setInfo({ ...info, bloodGroup: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl text-center" 
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Employee ID Format</label>
                <input 
                  type="text" 
                  value={info.employeeId} 
                  maxLength={18}
                  onChange={(e) => setInfo({ ...info, employeeId: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Joining Date</label>
                <input 
                  type="text" 
                  value={info.joiningDate} 
                  onChange={(e) => setInfo({ ...info, joiningDate: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-semibold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Support Email</label>
                <input 
                  type="text" 
                  value={info.email} 
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-semibold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card physical outer frame showcase */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-slate-100 rounded-[32px] p-4 md:p-8 min-h-[520px]">
            <div className="perspective-1000 w-full max-w-[380px] aspect-[1/1.54]">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="preserve-3d w-full h-full relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                
                {/* FRONT PREVIEW CONTAINER */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-[24px] border ${
                    theme === 'cloud_minimal' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasFrontRef} 
                    width={960} 
                    height={1480} 
                    className="w-full h-full pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

                {/* BACK PREVIEW CONTAINER */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-[24px] border rotate-y-180 ${
                    theme === 'cloud_minimal' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasBackRef} 
                    width={960} 
                    height={1480} 
                    className="w-full h-full pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

              </motion.div>
            </div>

            <p className="text-[11px] text-slate-400 font-extrabold uppercase mt-6 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              Click the badge layout above to flip and configure rules or back assets.
            </p>
          </div>

          {/* Export compiled asset packages */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              3. Compile & Export High Resolution ID png maps
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => downloadCardPNG('front')}
                disabled={isGenerating}
                className="py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD FRONT ID (HD PNG)
              </button>

              <button
                type="button"
                onClick={() => downloadCardPNG('back')}
                disabled={isGenerating}
                className="py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-slate-900 active:scale-[0.98] shadow-lg shadow-slate-800/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD BACK ID (HD PNG)
              </button>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100/60 rounded-2xl flex items-start gap-3 text-xs text-emerald-800 leading-relaxed font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Physical Print Specs:</strong> Instantly output at full High-DPI orientation (960 × 1480). This perfectly aligns with global <strong>2.13" x 3.37"</strong> CR80 standardized credit card dimension requirements.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
