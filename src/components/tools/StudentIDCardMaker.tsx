import React, { useState, useRef, useEffect } from 'react';
import { 
  Contact, 
  Download, 
  Upload, 
  User, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  FlipHorizontal,
  Info,
  Layers,
  Award,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

type CardTheme = 'classic_academic' | 'modern_tech' | 'cyber_academy' | 'minimal_campus' | 'royal_scholar';

interface StudentInfo {
  studentName: string;
  studentId: string;
  department: string;
  session: string;
  bloodGroup: string;
  phone: string;
  email: string;
  dob: string;
  emergencyContact: string;
  instituteName: string;
  instituteAddress: string;
  accentColor: string;
  secondaryColor: string;
  isNFCEnabled: boolean;
  qrContent: string;
}

export const StudentIDCardMaker = () => {
  const [info, setInfo] = useState<StudentInfo>({
    studentName: '',
    studentId: '',
    department: '',
    session: '',
    bloodGroup: '',
    phone: '',
    email: '',
    dob: '',
    emergencyContact: '',
    instituteName: '',
    instituteAddress: '',
    accentColor: '#1d4ed8', // Royal Blue
    secondaryColor: '#0f172a', // Navy/Dark Slate
    isNFCEnabled: true,
    qrContent: ''
  });

  const [theme, setTheme] = useState<CardTheme>('classic_academic');
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

  const drawAcademicCapIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, height: number) => {
    ctx.save();
    ctx.fillStyle = theme === 'minimal_campus' ? info.accentColor : '#FFFFFF';
    
    const w = height * 1.5;
    // Draw top diamond rhombus of the cap
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + height * 0.35);
    ctx.lineTo(x + w / 2, y + height * 0.7);
    ctx.lineTo(x, y + height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Draw cap bottom support band
    ctx.fillStyle = theme === 'minimal_campus' ? info.secondaryColor : 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25, y + height * 0.525);
    ctx.quadraticCurveTo(x + w / 2, y + height * 0.8, x + w * 0.75, y + height * 0.525);
    ctx.lineTo(x + w * 0.75, y + height * 0.78);
    ctx.quadraticCurveTo(x + w / 2, y + height * 1.05, x + w * 0.25, y + height * 0.78);
    ctx.closePath();
    ctx.fill();

    // Tassel ornament hanging off the cap
    ctx.strokeStyle = '#f59e0b'; // Gold
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + height * 0.35);
    ctx.lineTo(x + w * 0.15, y + height * 0.55);
    ctx.lineTo(x + w * 0.15, y + height * 0.85);
    ctx.stroke();

    ctx.restore();
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, code: string) => {
    ctx.save();
    ctx.fillStyle = theme === 'minimal_campus' ? '#111827' : '#FFFFFF';
    ctx.globalAlpha = 0.9;

    let currX = x;
    const barCount = 42;
    const minBarWidth = 1.5;

    for (let i = 0; i < barCount; i++) {
      const isSpace = (i * 7 + code.charCodeAt(i % code.length)) % 5 === 0;
      const barW = minBarWidth + ((i * 3 + code.charCodeAt(i % code.length)) % 3);
      if (!isSpace && currX + barW < x + width) {
        ctx.fillRect(currX, y, barW, height);
      }
      currX += barW + 1.8;
    }

    ctx.fillStyle = theme === 'minimal_campus' ? '#4b5563' : '#e2e8f0';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${code.toUpperCase()}`, x + width / 2, y + height + 11);
    ctx.restore();
  };

  const drawQRCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 12);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.strokeRect(x, y, size, size);

    const anchorSize = Math.floor(size * 0.25);
    // Draw QR anchoring positions
    const drawAnchor = (ax: number, ay: number) => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(ax, ay, anchorSize, anchorSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ax + 3, ay + 3, anchorSize - 6, anchorSize - 6);
      ctx.fillStyle = '#111827';
      ctx.fillRect(ax + 6, ay + 6, anchorSize - 12, anchorSize - 12);
    };

    drawAnchor(x, y); // Top Left
    drawAnchor(x + size - anchorSize, y); // Top Right
    drawAnchor(x, y + size - anchorSize); // Bottom Left

    // Render matrix bits
    ctx.fillStyle = '#111827';
    const numRows = 20;
    const pixelSize = size / numRows;
    const payload = info.qrContent || info.studentId;

    for (let c = 0; c < numRows; c++) {
      for (let r = 0; r < numRows; r++) {
        const isAnchor = (c < 7 && r < 7) || (c > numRows - 8 && r < 7) || (c < 7 && r > numRows - 8);
        if (!isAnchor) {
          const charCode = payload.charCodeAt((c * 5 + r * 3) % payload.length);
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
      case 'modern_tech': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Tech grid lines overlay
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 60) {
          ctx.beginPath();
          ctx.moveTo(i, 0); ctx.lineTo(i, h);
          ctx.moveTo(0, i); ctx.lineTo(w, i);
          ctx.stroke();
        }
        break;
      }
      case 'cyber_academy': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#050508');
        grad.addColorStop(0.7, '#110620');
        grad.addColorStop(1, '#020005');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Cyber aesthetic accents
        ctx.fillStyle = info.accentColor;
        ctx.fillRect(0, 0, 10, h);
        ctx.fillRect(w - 10, 0, 10, h);
        break;
      }
      case 'minimal_campus': {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);
        
        ctx.fillStyle = info.accentColor;
        ctx.fillRect(0, 0, w, 16);
        break;
      }
      case 'royal_scholar': {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#052e16'); // Forest dark green
        grad.addColorStop(0.5, '#021e0f');
        grad.addColorStop(1, '#011208');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Filigree border style stripes
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(25, 25, w - 50, h - 50);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(32, 32, w - 64, h - 64);
        break;
      }
      case 'classic_academic':
      default: {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1e3a8a'); // Classic Navy Deep Blue
        grad.addColorStop(0.6, '#0f172a');
        grad.addColorStop(1, '#030712');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Elegant geometric diagonal header block stripe
        if (!isBack) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(w * 0.7, 0);
          ctx.lineTo(w * 0.45, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
    }
  };

  const drawHeaderBlock = (ctx: CanvasRenderingContext2D, w: number, isBack: boolean) => {
    const isMinimal = theme === 'minimal_campus';
    const isRoyal = theme === 'royal_scholar';

    // Header Logo/Symbol
    const capHeight = 40;
    const capX = 50;
    const capY = 55;
    drawAcademicCapIcon(ctx, capX, capY, capHeight);

    // Institute Title
    ctx.fillStyle = isMinimal ? '#0f172a' : isRoyal ? '#fbbf24' : '#FFFFFF';
    ctx.font = '900 italic 25px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(info.instituteName.toUpperCase(), capX + 75, capY + 15);

    // Address
    ctx.fillStyle = isMinimal ? '#4b5563' : 'rgba(255, 255, 255, 0.65)';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillText(info.instituteAddress.toUpperCase(), capX + 75, capY + 34);

    // Dynamic Top border seal banner
    ctx.fillStyle = isMinimal ? '#e2e8f0' : 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(40, 125, w - 80, 2);
  };

  // Draw FRONT ID Card
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Aspect: Vertical ID Card orientation, 480 × 740 high-density 2x canvas (960 x 1480 dimensions)
    const w = 960;
    const h = 1480;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Custom Background configuration 
    applyThemeBackground(ctx, w, h, false);

    // Header segment
    drawHeaderBlock(ctx, w, false);

    // Main status band banner title
    ctx.fillStyle = theme === 'minimal_campus' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    ctx.font = '900 150px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STUDENT', w / 2, 450);

    const isMinimal = theme === 'minimal_campus';

    // AVATAR FRAME
    const avW = 320;
    const avH = 380;
    const avX = (w - avW) / 2;
    const avY = 220;

    // Draw background boundary behind avatar 
    ctx.fillStyle = isMinimal ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = theme === 'royal_scholar' ? '#f59e0b' : info.accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, 24);
    ctx.fill();
    ctx.stroke();

    // Clip & draw Avatar portrait image inside frame bounds
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
      ctx.fillStyle = isMinimal ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(avX, avY, avW, avH);

      ctx.fillStyle = isMinimal ? '#64748b' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(w / 2, avY + 150, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w / 2, avY + avH + 40, 150, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Dynamic Blood group icon highlight on avatar right corner
    if (info.bloodGroup) {
      const bX = avX + avW - 35;
      const bY = avY + avH - 35;
      ctx.fillStyle = '#ef4444'; // Red for blood label
      ctx.beginPath();
      ctx.arc(bX, bY, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(info.bloodGroup, bX, bY + 6);
    }

    // STUDENT NAME
    ctx.fillStyle = isMinimal ? '#0f172a' : '#FFFFFF';
    ctx.font = '900 46px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.studentName.toUpperCase(), w / 2, 690);

    // STUDENT ID TAG LABEL
    ctx.fillStyle = theme === 'royal_scholar' ? '#fbbf24' : info.accentColor;
    ctx.font = '800 italic 21px "JetBrains Mono", monospace';
    ctx.fillText(`ID CODE: ${info.studentId}`, w / 2, 735);

    // INFORMATION LABELS GRID
    const gridY = 820;
    const colLeft = 140;
    const colRight = 520;

    const drawGridItem = (gx: number, gy: number, label: string, val: string) => {
      ctx.fillStyle = isMinimal ? '#64748b' : '#94a3b8';
      ctx.font = '900 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label.toUpperCase(), gx, gy);

      ctx.fillStyle = isMinimal ? '#0f172a' : '#FFFFFF';
      ctx.font = '900 24px "Inter", sans-serif';
      ctx.fillText(val, gx, gy + 32);
    };

    drawGridItem(colLeft, gridY, 'DEPARTMENT / MAJOR', info.department);
    drawGridItem(colLeft, gridY + 110, 'ACADEMIC SESSION', info.session);
    drawGridItem(colLeft, gridY + 220, 'TELEPHONE', info.phone);

    drawGridItem(colRight, gridY, 'DATE OF BIRTH', info.dob);
    drawGridItem(colRight, gridY + 110, 'OFFICIAL EMAIL', info.email);
    drawGridItem(colRight, gridY + 220, 'EMERGENCY TRUNK', info.emergencyContact);

    // Divider line above signatures block
    ctx.strokeStyle = isMinimal ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 1180, w - 200, 1);

    // SIGNATURE SPACE (Left Corner)
    const sigX = 140;
    const sigY = 1240;
    ctx.fillStyle = isMinimal ? '#64748b' : '#94a3b8';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('HOLDER SIGNATURE', sigX, sigY + 95);

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
      ctx.strokeStyle = isMinimal ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(sigX, sigY, 200, 75);
      ctx.setLineDash([]);
      
      // Abstract sign placeholder guide line
      ctx.fillStyle = isMinimal ? '#cbd5e1' : '#475569';
      ctx.font = 'italic 12px "Inter", sans-serif';
      ctx.fillText('Upload signature image', sigX + 22, sigY + 45);
    }

    // SECURITY SEAL STAMP STENCIL
    const sealX = 660;
    const sealY = 1250;
    ctx.fillStyle = theme === 'royal_scholar' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(29, 78, 216, 0.1)';
    ctx.strokeStyle = theme === 'royal_scholar' ? '#d97706' : '#1d4ed8';
    
    // Circle seal bounds
    ctx.beginPath();
    ctx.arc(sealX + 50, sealY + 35, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = theme === 'royal_scholar' ? '#f59e0b' : '#1d4ed8';
    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', sealX + 50, sealY + 28);
    ctx.fillText('CAMPUS SEC', sealX + 50, sealY + 45);

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

    // Theme Background
    applyThemeBackground(ctx, w, h, true);

    // Header segment
    drawHeaderBlock(ctx, w, true);

    const isMinimal = theme === 'minimal_campus';

    // Black Security Magnetic stripes block
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 160, w, 160);

    // Guidelines rules lists
    const rX = 80;
    let rY = 400;

    ctx.fillStyle = isMinimal ? '#0f172a' : '#FFFFFF';
    ctx.font = '900 italic 30px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('OFFICIAL CAMPUS GUIDELINES', rX, rY);

    const principles = [
      'This Identification card is strictly non-transferable and remains physical property of the issuer.',
      'Possessor agrees to comply with all campus community codes, rules, and student handbook regulations code.',
      'Must be worn or exhibited at all times while present in university library labs and secure tech centers.',
      'If found, please drop into the nearest campus postal mailbox or return to Registrar Central Office.',
      'Built-in secure proximity encrypted passive dynamic vCard linking chip.'
    ];

    rY += 60;
    ctx.font = 'bold 15px "Inter", sans-serif';
    principles.forEach(p => {
      // bullet icon circle
      ctx.beginPath();
      ctx.arc(rX + 8, rY - 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'royal_scholar' ? '#f59e0b' : info.accentColor;
      ctx.fill();

      ctx.fillStyle = isMinimal ? '#475569' : theme === 'royal_scholar' ? '#fbbf24' : '#cbd5e1';
      ctx.fillText(p, rX + 30, rY);
      rY += 45;
    });

    // BARCODE RENDER (Lower section background representation)
    drawBarcode(ctx, rX, h - 450, w - rX * 2, 100, info.studentId + info.session.substring(0, 4));

    // QR CODE ROUTER STAMP
    const qScale = 200;
    const qX = (w - qScale) / 2;
    drawQRCode(ctx, qX, h - 280, qScale);

    ctx.restore();
  };

  // HD Export compile cycle
  const downloadSmartID = (face: 'front' | 'back') => {
    setIsGenerating(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `Academic_ID_${face}_${info.studentName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="student-id-workspace-root">
      
      {/* Intro block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 p-6 rounded-3xl border border-blue-500/15">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-blue-600 animate-pulse" />
            Smart Student ID Card Maker
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Configure premium student identity cards with custom blood groups, academic session guidelines, custom signatures, official barcode systems, and high-DPI output targets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-black shadow-sm flex items-center gap-2 transition duration-200"
          >
            <FlipHorizontal className="w-4 h-4 text-emerald-500" />
            Flip Preview Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column options panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Style options templates */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              1. Academy Card Themes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {([
                { id: 'classic_academic', name: 'Navy Academic', color: 'bg-blue-900', secondary: '#1e3a8a' },
                { id: 'modern_tech', name: 'Digital Tech', color: 'bg-indigo-950', secondary: '#1e1b4b' },
                { id: 'cyber_academy', name: 'Neon Cyber', color: 'bg-purple-950', secondary: '#110620' },
                { id: 'royal_scholar', name: 'Royal Ivy', color: 'bg-emerald-950', secondary: '#052e16' },
                { id: 'minimal_campus', name: 'Paper Stark', color: 'bg-slate-200', secondary: '#f8fafc' },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as CardTheme);
                    setInfo({
                      ...info,
                      accentColor: t.id === 'royal_scholar' ? '#f59e0b' : t.id === 'minimal_campus' ? '#0f172a' : '#1d4ed8'
                    });
                  }}
                  type="button"
                  className={`px-3 py-3 rounded-2xl border text-left transition-all ${
                    theme === t.id 
                    ? 'border-blue-500 bg-blue-50/20 shadow-sm scale-[0.98]' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-800 tracking-tight">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${t.color} border border-white/20`} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Preset</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Accent Color custom configuration */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Accent Palette Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={info.accentColor} 
                    onChange={(e) => setInfo({ ...info, accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input 
                    type="text" 
                    value={info.accentColor} 
                    onChange={(e) => setInfo({ ...info, accentColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold p-1.5 border border-slate-200 rounded-lg text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Avatar & Signature file inputs */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              {/* Avatar input file upload row */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Portal Portrait</label>
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
                        Upload Portrait
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Holder Signature image</label>
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

          {/* Section 2: Personal Registry attributes */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              2. Student Registry Fields
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Student Full Name</label>
                <input 
                  type="text" 
                  value={info.studentName} 
                  maxLength={22}
                  onChange={(e) => setInfo({ ...info, studentName: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Student ID Code</label>
                <input 
                  type="text" 
                  value={info.studentId} 
                  maxLength={16}
                  onChange={(e) => setInfo({ ...info, studentId: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Department / Major</label>
                <input 
                  type="text" 
                  value={info.department} 
                  maxLength={34}
                  onChange={(e) => setInfo({ ...info, department: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Academic Session</label>
                <input 
                  type="text" 
                  value={info.session} 
                  maxLength={14}
                  onChange={(e) => setInfo({ ...info, session: e.target.value })}
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
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">DOB (Date of birth)</label>
                <input 
                  type="text" 
                  value={info.dob} 
                  onChange={(e) => setInfo({ ...info, dob: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Primary Telephone</label>
                <input 
                  type="text" 
                  value={info.phone} 
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-semibold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Official Email</label>
                <input 
                  type="text" 
                  value={info.email} 
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-semibold border border-slate-200 bg-slate-50 rounded-xl" 
                />
              </div>
            </div>

            {/* University configurations */}
            <div className="pt-2 border-t border-slate-100 space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Institute Name</label>
                  <input 
                    type="text" 
                    value={info.instituteName} 
                    onChange={(e) => setInfo({ ...info, instituteName: e.target.value })}
                    className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Emergency Contact</label>
                  <input 
                    type="text" 
                    value={info.emergencyContact} 
                    onChange={(e) => setInfo({ ...info, emergencyContact: e.target.value })}
                    className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Institute Campus Address</label>
                <input 
                  type="text" 
                  value={info.instituteAddress} 
                  onChange={(e) => setInfo({ ...info, instituteAddress: e.target.value })}
                  className="w-full p-2.5 text-xs text-slate-800 font-bold border border-slate-200 bg-slate-50 rounded-xl" 
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
                    theme === 'minimal_campus' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
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
                    theme === 'minimal_campus' ? 'border-gray-200 shadow-lg' : 'border-neutral-800 shadow-2xl'
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
              Click Card preview stack above to flip and configure rules or back assets.
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
                onClick={() => downloadSmartID('front')}
                disabled={isGenerating}
                className="py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/10"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD FRONT ID (HD PNG)
              </button>

              <button
                type="button"
                onClick={() => downloadSmartID('back')}
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
                <strong>Print Precision Specs:</strong> Instantly output at full High-DPI orientation (960 × 1480). This perfectly aligns with global <strong>2.13" x 3.37"</strong> CR80 standardized credit card dimension requirements.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
