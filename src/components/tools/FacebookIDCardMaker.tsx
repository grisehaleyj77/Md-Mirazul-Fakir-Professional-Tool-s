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
  FileText,
  MapPin,
  Calendar,
  Check,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Facebook,
  Maximize2,
  Lock,
  MessageSquare,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

type BadgeType = 'Creator' | 'Developer' | 'Admin' | 'Meta Staff' | 'VIP Member' | 'Ad Account Mgr';
type ThemeStyle = 'meta_blue' | 'verified_gold' | 'threads_dark' | 'neon_metaverse';

interface FacebookInfo {
  fullName: string;
  username: string; // @username
  role: BadgeType;
  bio: string;
  joinedDate: string; // e.g., "Joined October 2012"
  profileUrl: string; // e.g., "https://facebook.com/zuck"
  phone: string;
  location: string;
  followerCount: string; // e.g. "250K Followers"
  friendCount: string; // e.g. "4.8K Friends"
  accentColor: string;
  customHex: string;
  bloodGroup: string;
}

export const FacebookIDCardMaker = () => {
  const sampleData: FacebookInfo = {
    fullName: 'Mark Zuckerberg',
    username: 'zuck',
    role: 'Creator',
    bio: 'Building the future of social connection.',
    joinedDate: 'Joined February 2004',
    profileUrl: 'https://facebook.com/zuck',
    phone: '+1 (650) 543-4800',
    location: 'Palo Alto, California',
    followerCount: '119M Followers',
    friendCount: '4.9K Friends',
    accentColor: '#1877f2', // Facebook Classic Blue
    customHex: '#2563eb',
    bloodGroup: 'A+'
  };

  const blankData: FacebookInfo = {
    fullName: '',
    username: '',
    role: 'Creator',
    bio: '',
    joinedDate: 'Joined ' + new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    profileUrl: 'https://facebook.com/',
    phone: '',
    location: '',
    followerCount: '',
    friendCount: '',
    accentColor: '#1877f2',
    customHex: '#2563eb',
    bloodGroup: 'O+'
  };

  const [info, setInfo] = useState<FacebookInfo>(sampleData);
  const [theme, setTheme] = useState<ThemeStyle>('meta_blue');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Security features, layout elements, and decorative options
  const [options, setOptions] = useState({
    profileGlow: true,             // Blue profile ring border (Facebook live status)
    verifiedBadge: true,           // Meta Verified blue badge overlay beside name
    goldEmboss: false,             // Shiny golden premium border accents
    hologramSeal: true,            // Security holographic watermark
    smartChip: true,               // EMV electronic security gold chip
    avatarBorderColor: '#1877f2',  // Interactive color of profile circle ring
    showStatusText: true,          // Showing "Active Now" indicator at top
    barcodeBack: true              // 2D QR Code + Barcode scanner on back
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  // Sync / Draw canvas updates whenever inputs change
  useEffect(() => {
    drawFrontCard();
    drawBackCard();
  }, [info, theme, avatarUrl, signatureUrl, options]);

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

  // Modern Meta/Infinity Logo Drawing Method using Cubic Bezier
  const drawMetaLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(r / 35, r / 35);

    // Dynamic color matches corresponding theme style
    let logoColor = '#1877f2'; // Official FB blue
    if (theme === 'verified_gold') logoColor = '#d97706'; // Gold/Amber
    if (theme === 'threads_dark') logoColor = '#ffffff'; // Modern minimalist white
    if (theme === 'neon_metaverse') logoColor = '#f43f5e'; // Deep pink/rose

    ctx.strokeStyle = logoColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Complex Bezier loop representing the standard Meta Logo
    ctx.moveTo(-40, 5);
    ctx.bezierCurveTo(-40, 25, -20, 25, -10, 5);
    ctx.bezierCurveTo(0, -15, 20, -15, 30, 5);
    ctx.bezierCurveTo(40, 25, 60, 25, 60, 5);
    ctx.bezierCurveTo(60, -15, 40, -15, 30, 5);
    ctx.bezierCurveTo(20, 25, 0, 25, -10, 5);
    ctx.bezierCurveTo(-20, -15, -40, -15, -40, 5);
    ctx.stroke();

    ctx.restore();
  };

  // High Precision verified badge on Canvas
  const drawVerifiedBadgeOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(r / 12, r / 12);

    // Outline star design
    ctx.fillStyle = '#1877f2'; // Classic Meta verified blue
    ctx.beginPath();
    
    // Draw 12-point starburst shape
    const points = 12;
    const outerRadius = 12;
    const innerRadius = 10;
    let angle = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const currX = Math.cos(i * angle) * radius;
      const currY = Math.sin(i * angle) * radius;
      if (i === 0) {
        ctx.moveTo(currX, currY);
      } else {
        ctx.lineTo(currX, currY);
      }
    }
    ctx.closePath();
    ctx.fill();

    // Checked mark inside
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-1, 3);
    ctx.lineTo(4, -3);
    ctx.stroke();

    ctx.restore();
  };

  // Draw simulated QR Code
  const drawQRCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    // QR Border outline Box
    ctx.fillStyle = theme === 'threads_dark' ? '#1c1c1e' : '#ffffff';
    ctx.strokeStyle = theme === 'threads_dark' ? '#3a3a3c' : '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 12);
    ctx.fill();
    ctx.stroke();

    // 2D QR Pattern Matrix generator
    ctx.fillStyle = theme === 'threads_dark' ? '#ffffff' : '#0f172a';
    const cols = 21;
    const cw = size / cols;

    // Corner Finder Patterns
    const drawFinder = (fx: number, fy: number) => {
      ctx.fillRect(fx, fy, cw * 7, cw * 7);
      ctx.fillStyle = theme === 'threads_dark' ? '#1c1c1e' : '#ffffff';
      ctx.fillRect(fx + cw, fy + cw, cw * 5, cw * 5);
      ctx.fillStyle = theme === 'threads_dark' ? '#ffffff' : '#0f172a';
      ctx.fillRect(fx + cw * 2, fy + cw * 2, cw * 3, cw * 3);
    };

    // Top-left
    drawFinder(x, y);
    // Top-right
    drawFinder(x + size - cw * 7, y);
    // Bottom-left
    drawFinder(x, y + size - cw * 7);

    // Bottom-right tiny anchor alignment
    ctx.fillRect(x + size - cw * 4, y + size - cw * 4, cw * 3, cw * 3);
    ctx.fillStyle = theme === 'threads_dark' ? '#1c1c1e' : '#ffffff';
    ctx.fillRect(x + size - cw * 3, y + size - cw * 3, cw, cw);
    ctx.fillStyle = theme === 'threads_dark' ? '#ffffff' : '#0f172a';
    ctx.fillRect(x + size - cw * 3, y + size - cw * 3, cw, cw);

    // Random noise generator seeded on username length
    const seed = info.username.length || 7;
    for (let r = 0; r < cols; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip finder targets
        const isFinder = (r < 8 && c < 8) || (r < 8 && c > cols - 9) || (r > cols - 9 && c < 8);
        if (!isFinder) {
          const fillPixel = ((r * 13 + c * 7 + seed) % 7 < 3) || ((r + c + seed) % 5 === 0);
          if (fillPixel) {
            ctx.fillRect(x + c * cw, y + r * cw, cw + 0.3, cw + 0.3);
          }
        }
      }
    }
    ctx.restore();
  };

  // Custom multi-theme color pattern maps
  const applyThemeBackground = (ctx: CanvasRenderingContext2D, w: number, h: number, isBack: boolean) => {
    ctx.save();
    
    if (theme === 'meta_blue') {
      // Elegant Corporate Facebook Blue to Ice Blue radial gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0f172a'); // Very rich slate blue dark top
      bgGrad.addColorStop(0.35, '#1e293b'); // Transitional dark blue
      bgGrad.addColorStop(0.7, '#1877f2'); // Bright glowing Facebook blue signature splash
      bgGrad.addColorStop(1, '#60a5fa'); // Vibrant sky blue highlights
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle dynamic grid wireframe overlays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 0; j < h; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }

      // Giant abstract Meta infinity loop overlay
      ctx.strokeStyle = 'rgba(24, 119, 242, 0.12)';
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.45, 250, 0, Math.PI * 2);
      ctx.stroke();

    } else if (theme === 'verified_gold') {
      // Gold & Luxury Charcoal VIP Obsidian Theme
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#000000'); // Ultimate Premium Pitch Black
      bgGrad.addColorStop(0.4, '#171717'); // Rich Charcoal metal
      bgGrad.addColorStop(0.85, '#cca24e'); // Liquid luxury gold
      bgGrad.addColorStop(1, '#f3f4f6'); // Solid white contrast
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Radial glowing golden focal points
      const goldRadial = ctx.createRadialGradient(w / 2, h * 0.4, 100, w / 2, h * 0.4, 500);
      goldRadial.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      goldRadial.addColorStop(0.7, 'rgba(0,0,0,0)');
      ctx.fillStyle = goldRadial;
      ctx.fillRect(0, 0, w, h);

      // Gold Diagonal sleek linear stripes
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.05)';
      ctx.lineWidth = 1.5;
      for (let i = -w; i < w * 2; i += 75) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h * 0.5, h);
        ctx.stroke();
      }

    } else if (theme === 'threads_dark') {
      // Seamless Minimalist Obsidian & White threads theme
      ctx.fillStyle = '#101010'; // Extreme deep pure dark UI
      ctx.fillRect(0, 0, w, h);

      // Draw concentric minimal geometric loops mimicking the Threads visual logo patterns
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 2.5;
      for (let r = 100; r < 700; r += 120) {
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.44, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Elegant single sweeping neon light trail on top edge
      const neonTrail = ctx.createLinearGradient(0, 0, w, 0);
      neonTrail.addColorStop(0, '#ff3366');
      neonTrail.addColorStop(0.5, '#ffffff');
      neonTrail.addColorStop(1, '#00ffcc');
      ctx.fillStyle = neonTrail;
      ctx.fillRect(0, 0, w, 5);

    } else if (theme === 'neon_metaverse') {
      // Dynamic Cyberpunk Retrowave Pink/Violet Meta Theme
      const bgGrad = ctx.createLinearGradient(w, 0, 0, h);
      bgGrad.addColorStop(0, '#4c1d95'); // Deep Cyber Violet
      bgGrad.addColorStop(0.5, '#701a75'); // Dark Purple Magenta
      bgGrad.addColorStop(1, '#db2777'); // Electric Magenta Pink 
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyber grid matrix curves
      ctx.strokeStyle = 'rgba(219, 39, 119, 0.1)';
      ctx.lineWidth = 2;
      for (let r = 80; r < w; r += 80) {
        ctx.beginPath();
        ctx.arc(w / 2, h + 100, r, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Interactive Gold Embossed Card Border
    if (options.goldEmboss) {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Gloss golden highlights in corners
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fillRect(10, 10, 50, 50);
      ctx.fillRect(w - 60, 10, 50, 50);
      ctx.fillRect(10, h - 60, 50, 50);
      ctx.fillRect(w - 60, h - 60, 50, 50);
    }

    ctx.restore();
  };

  // Compile Header metadata (Brand Logo, Online indicator, office detail)
  const drawCardHeader = (ctx: CanvasRenderingContext2D, w: number, isBack: boolean) => {
    ctx.save();
    
    // Top Margin Space
    const bannerY = 85;

    // BRAND BANNER TEXT
    if (!isBack) {
      // 1. Meta / Facebook brand name left column
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 45px "Inter", -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('facebook', 75, bannerY);

      // Glowing Mini Active Now Indicator right beside
      if (options.showStatusText) {
        ctx.fillStyle = '#10b981'; // Green active dot
        ctx.beginPath();
        ctx.arc(310, bannerY - 14, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.beginPath();
        ctx.arc(310, bannerY - 14, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '800 13px "Inter", sans-serif';
        ctx.fillText('ACTIVE NOW', 332, bannerY - 10);
      }
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('META PLATFORMS NETWORK', w / 2, bannerY);
    }

    // 2. Meta Logo Icon positioning top-right
    drawMetaLogo(ctx, w - 120, bannerY - 15, 42);

    // Subtle underline brand strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(75, bannerY + 40, w - 150, 2);

    ctx.restore();
  };

  // Compile & Draw FRONT of Facebook ID card
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 960;
    const h = 1480;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Draw solid custom gradient backdrop pattern
    applyThemeBackground(ctx, w, h, false);

    // 2. Draw standard FB top headers
    drawCardHeader(ctx, w, false);

    // 3. User Portrait Frame (Big elegant rounded outline block or circle card portrait)
    const pSize = 380;
    const px = (w - pSize) / 2;
    const py = 215;

    ctx.save();
    // Backdrop dark slate base for photo
    ctx.fillStyle = theme === 'threads_dark' ? '#1c1c1e' : '#1e293b';
    ctx.beginPath();
    ctx.arc(w / 2, py + pSize / 2, pSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Glow profile status ring border
    if (options.profileGlow) {
      ctx.strokeStyle = options.avatarBorderColor || '#1877f2';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(w / 2, py + pSize / 2, pSize / 2 + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing outer glow overlay
      ctx.strokeStyle = 'rgba(24, 119, 242, 0.25)';
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.arc(w / 2, py + pSize / 2, pSize / 2 + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Clip & render user profile avatar inside circular frame
    ctx.beginPath();
    ctx.arc(w / 2, py + pSize / 2, pSize / 2 - 4, 0, Math.PI * 2);
    ctx.clip();

    if (avatarUrl) {
      const img = new Image();
      img.src = avatarUrl;
      if (img.complete) {
        // Draw image scaled precisely maintaining real aspect
        const aspect = img.width / img.height;
        let drawX = px;
        let drawY = py;
        let drawW = pSize;
        let drawH = pSize;

        if (aspect > 1) {
          // Wider picture
          drawW = pSize * aspect;
          drawX = (w - drawW) / 2;
        } else if (aspect < 1) {
          // Tall picture
          drawH = pSize / aspect;
          drawY = py + (pSize - drawH) / 2;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else {
        img.onload = () => {
          drawFrontCard();
        };
      }
    } else {
      // Fancy default silhouette icon drawing
      ctx.fillStyle = theme === 'threads_dark' ? '#2c2c2e' : '#334155';
      ctx.fillRect(px, py, pSize, pSize);

      ctx.fillStyle = theme === 'threads_dark' ? '#48484a' : '#64748b';
      ctx.beginPath();
      // head
      ctx.arc(w / 2, py + pSize * 0.38, 64, 0, Math.PI * 2);
      ctx.fill();

      // shoulders
      ctx.beginPath();
      ctx.arc(w / 2, py + pSize + 40, 160, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. EMV Electronic Smart chip (on the middle left)
    if (options.smartChip) {
      // Golden EMV Chip chassis matching real credential passes
      const chipX = 90;
      const chipY = 360;
      const chipW = 100;
      const chipH = 80;

      ctx.save();
      const grad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      grad.addColorStop(0, '#eab308'); 
      grad.addColorStop(0.3, '#fef08a'); 
      grad.addColorStop(0.65, '#ca8a04'); 
      grad.addColorStop(1, '#854d0e'); 
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.roundRect(chipX, chipY, chipW, chipH, 10);
      ctx.fill();
      ctx.stroke();

      // Grid contact details
      ctx.strokeStyle = '#331b03';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(chipX + chipW * 0.35, chipY);
      ctx.lineTo(chipX + chipW * 0.35, chipY + chipH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chipX + chipW * 0.65, chipY);
      ctx.lineTo(chipX + chipW * 0.65, chipY + chipH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chipX, chipY + chipH / 2);
      ctx.lineTo(chipX + chipW, chipY + chipH / 2);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Holographic Official Seal Watermark
    if (options.hologramSeal) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w - 140, 400, 75, 0, Math.PI * 2);
      ctx.stroke();
      // Secondary transparent Meta emblem inside
      drawMetaLogo(ctx, w - 140, 400, 22);
      ctx.restore();
    }

    // 6. User Display Name & Badge / Role (Middle-Bottom Section)
    let textY = 675;

    // Display Name Header in absolute display typography
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 52px "Inter", sans-serif';
    ctx.textAlign = 'center';
    
    // Measures text width to position the Meta Verified check mark beside the name correctly
    const finalName = info.fullName.trim() || 'John Doe';
    ctx.fillText(finalName, w / 2, textY);
    
    // Draw Verified blue tick badge icon exactly beside name text width
    if (options.verifiedBadge) {
      const nameWidth = ctx.measureText(finalName).width;
      const vX = w / 2 + nameWidth / 2 + 30;
      const vY = textY - 17;
      drawVerifiedBadgeOnCanvas(ctx, vX, vY, 15);
    }
    ctx.restore();

    // Username Handle tag (@zuck)
    textY += 58;
    ctx.save();
    ctx.fillStyle = theme === 'verified_gold' ? '#f59e0b' : '#93c5fd';
    ctx.font = '700 28px "Inter", "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`@${info.username.toLowerCase() || 'username'}`, w / 2, textY);
    ctx.restore();

    // 7. Role Pill Badge (Creator, Developer, VIP etc)
    textY += 34;
    ctx.save();
    const badgetX = w / 2;
    const badgetY = textY;
    const rawRole = info.role.toUpperCase();

    // Set interactive bg pill colors based on role selection
    let roleBg = '#1877f2'; // Base blue
    if (rawRole === 'DEVELOPER') roleBg = '#10b981'; // Green emerald
    if (rawRole === 'CREATOR') roleBg = '#c084fc'; // Violet
    if (rawRole === 'META STAFF') roleBg = '#ef4444'; // Red ruby
    if (rawRole === 'VIP MEMBER') roleBg = '#eab308'; // Amber gold
    if (rawRole === 'AD ACCOUNT MGR') roleBg = '#64748b'; // Slate grey

    ctx.fillStyle = roleBg;
    ctx.beginPath();
    ctx.roundRect(badgetX - 130, badgetY, 260, 48, 12);
    ctx.fill();

    // Text inside pill badge list
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(rawRole, badgetX, badgetY + 31);
    ctx.restore();

    // 8. BENTO INFO PANEL GRID: Custom fields for Bio, Date Joined, Followers, Location
    textY += 105;
    ctx.save();

    const drawGridCell = (cx: number, cy: number, cw: number, ch: number, label: string, value: string, iconType?: 'bio'|'join'|'loc'|'followers') => {
      // Cell Background panel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cw, ch, 20);
      ctx.fill();
      ctx.stroke();

      // Write Label text
      ctx.fillStyle = theme === 'verified_gold' ? '#ca8a04' : '#60a5fa';
      ctx.font = '800 15px "Inter", sans-serif';
      ctx.fillText(label.toUpperCase(), cx + 25, cy + 34);

      // Write Value text
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 21px "Inter", sans-serif';
      
      // Let long text run within wrap box limits
      const maxW = cw - 50;
      const words = value.split(' ');
      let line = '';
      let testY = cy + 68;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxW && n > 0) {
          ctx.fillText(line, cx + 25, testY);
          line = words[n] + ' ';
          testY += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cx + 25, testY);
    };

    const blockH = 135;
    const paddingX = 75;
    const gridW = w - paddingX * 2;

    // Row A: Full width user bio block
    drawGridCell(paddingX, textY, gridW, blockH, 'Biography / Profile Moto', info.bio || 'Developing next-gen solutions.', 'bio');

    // Row B: Double column details (Joined date & followers counts)
    textY += blockH + 24;
    const colW = (gridW - 24) / 2;

    drawGridCell(paddingX, textY, colW, blockH, 'Registration Year', info.joinedDate || 'Joined October 2008', 'join');
    drawGridCell(paddingX + colW + 24, textY, colW, blockH, 'Network Audience', info.followerCount || '250K Followers', 'followers');

    // Row C: Double column metrics (Location & Identity Phone / Blood group)
    textY += blockH + 24;
    drawGridCell(paddingX, textY, colW, blockH, 'HQ Campus Location', info.location || 'Silicon Valley, CA', 'loc');
    drawGridCell(paddingX + colW + 24, textY, colW, blockH, 'Official ID Phone / Blood', `${info.phone || '+1 650-543-4800'} [${info.bloodGroup}]`, 'loc');

    ctx.restore();

    // 9. Bottom Footer Meta Brand Disclaimer label
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 12px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('META PLATFORMS INCORPORATED • SECURITY CREDENTIALS ACCESS ID PASS', w / 2, h - 55);
    ctx.restore();

    ctx.restore();
  };

  // Compile & Draw BACK of Facebook ID Card (MRZ scanner bar, custom QR & terms)
  const drawBackCard = () => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 960;
    const h = 1480;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Draw matching solid background pattern
    applyThemeBackground(ctx, w, h, true);

    // 2. Head brand header block
    drawCardHeader(ctx, w, true);

    const isWhiteTextTheme = true;

    // 3. Magnetic stripe representing secure employee keycard scan lines
    ctx.fillStyle = '#1c1c1e';
    ctx.fillRect(0, 190, w, 110);

    // Silver metallic security strip
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 300, w, 6);

    // 4. Terms and conditions / Security warning messages
    let backY = 370;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';

    const drawBullets = (title: string, bulletRows: string[]) => {
      ctx.fillStyle = theme === 'verified_gold' ? '#eab308' : '#60a5fa';
      ctx.font = '900 24px "Inter", sans-serif';
      ctx.fillText(title, 75, backY);
      backY += 45;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.font = '500 17px "Inter", sans-serif';
      
      bulletRows.forEach((row) => {
        // Bullet point icon
        ctx.fillStyle = theme === 'verified_gold' ? '#eab308' : '#1877f2';
        ctx.fillText('•', 75, backY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // Word wrapped text
        const maxW = w - 180;
        const words = row.split(' ');
        let line = '';
        let loopY = backY;

        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          if (metrics.width > maxW && n > 0) {
            ctx.fillText(line, 100, loopY);
            line = words[n] + ' ';
            loopY += 26;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 100, loopY);
        backY = loopY + 36;
      });
    };

    drawBullets('CARDHOLDER TERMS & PRIVACY', [
      'This credential card remains the property of Meta Platforms, Inc. and must be returned upon termination of network partner status.',
      'Always wear this access pass visible at all times when within authorized campus zones or corporate facilities.',
      'Corporate scans and entries are tracked automatically and logged server-side in active cloud security repositories.'
    ]);

    // Secondary bullet section
    drawBullets('META CLOUD ACCESS CONTROL', [
      'Loss or theft of this security pass must be reported immediately to the Meta Help Center or System Administrator.',
      'This badge is personal, non-transferable, and grants access to respective sandbox systems and creator hubs.'
    ]);
    ctx.restore();

    // 5. Dynamic QR Code linking to actual entered Profile URL
    backY += 20;
    const qrSize = 250;
    const qrx = (w - qrSize) / 2;
    drawQRCode(ctx, qrx, backY, qrSize);

    // 6. Signature on the Back Side
    backY += qrSize + 48;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(120, backY, w - 240, 90, 16);
    ctx.fill();
    ctx.stroke();

    // Placeholder signature label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 13px "Inter", monospace';
    ctx.fillText('AUTHORIZED ADMISSION SIGNATURE', 150, backY + 28);

    if (signatureUrl) {
      const sImg = new Image();
      sImg.src = signatureUrl;
      if (sImg.complete) {
        ctx.drawImage(sImg, w / 2 - 150, backY + 20, 300, 60);
      } else {
        sImg.onload = () => drawBackCard();
      }
    } else {
      // Registrar official dynamic signature curve representation
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 160, backY + 55);
      ctx.bezierCurveTo(w / 2 - 80, backY + 20, w / 2, backY + 80, w / 2 + 100, backY + 40);
      ctx.bezierCurveTo(w / 2 + 140, backY + 30, w / 2 + 160, backY + 60, w / 2 + 200, backY + 50);
      ctx.stroke();
    }
    ctx.restore();

    // 7. Dynamic Barcode representation with serials at the lower floor
    if (options.barcodeBack) {
      const barX = 120;
      const barY = h - 210;
      const barW = w - 240;
      const barH = 55;

      ctx.save();
      // Draw white background board backing barcode
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(barX - 10, barY - 10, barW + 20, barH + 30, 8);
      ctx.fill();

      // Paint mock thin strips
      ctx.fillStyle = '#0f172a';
      let currX = barX;
      const totalCol = 98;
      const bw = barW / totalCol;

      const hashStr = `FBID-${info.username.toUpperCase()}-${info.role.toUpperCase()}-SEC`;

      for (let i = 0; i < totalCol; i++) {
        const skipSpace = (i * 7 + hashStr.charCodeAt(i % hashStr.length)) % 5 === 0;
        const widthBlock = bw * (1 + ((i * 3 + hashStr.charCodeAt(i % hashStr.length)) % 2));
        if (!skipSpace && currX + widthBlock < barX + barW) {
          ctx.fillRect(currX, barY, widthBlock, barH);
        }
        currX += widthBlock + 1.2;
      }

      // Barcode Serial code text representation
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ID-SEC-CODE: ${info.username.toUpperCase()}-META-2026`, w / 2, barY + barH + 15);
      ctx.restore();
    }

    ctx.restore();
  };

  const downloadCardImage = (face: 'front' | 'back') => {
    setIsGenerating(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `Facebook_ID_${face}_${info.username || 'Creator'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetToSample = () => {
    setInfo(sampleData);
    setAvatarUrl(null);
    setSignatureUrl(null);
  };

  const clearForm = () => {
    setInfo(blankData);
    setAvatarUrl(null);
    setSignatureUrl(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="facebook-id-card-maker-tool">
      
      {/* Visual Header Branding segment */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-pink-500/10 p-6 rounded-3xl border border-blue-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Facebook className="w-6 h-6 text-blue-600 fill-current" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Meta Facebook ID Card Maker
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Design professional Facebook Creator profiles and Meta credential passes. Features ultra-realistic themes, blue verified badges, electronic gold chips, live profile ring glows, and downloadable front/back templates.
          </p>
        </div>

        <button 
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2 transition duration-200"
        >
          <FlipHorizontal className="w-4 h-4" />
          Flip Card Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column tools settings panels */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Section 1: Presets and themes styling */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              1. Choose Theme Preset
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {([
                { id: 'meta_blue', name: 'Official Classic Blue', desc: 'Official Facebook Blue' },
                { id: 'verified_gold', name: 'VIP Golden Edition', desc: 'Premium Luxury Gold' },
                { id: 'threads_dark', name: 'Threads Obsidian Dark', desc: 'Minimalist Threads Dark' },
                { id: 'neon_metaverse', name: 'Metaverse Neon Fusion', desc: 'Cyberpunk Purple Glow' }
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as ThemeStyle)}
                  className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                    theme === t.id 
                      ? 'border-blue-500 bg-blue-50/25 font-black scale-[0.98] shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-800 tracking-tight">{t.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Micro-indicators, badges, and filters switches */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Layout & Security Feature Switches</label>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.verifiedBadge} 
                    onChange={(e) => setOptions({...options, verifiedBadge: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Verified Blue Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.profileGlow} 
                    onChange={(e) => setOptions({...options, profileGlow: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Live Profile Ring Glow</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.smartChip} 
                    onChange={(e) => setOptions({...options, smartChip: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Gold EMV Smart Chip</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.hologramSeal} 
                    onChange={(e) => setOptions({...options, hologramSeal: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Meta Security Hologram</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.showStatusText} 
                    onChange={(e) => setOptions({...options, showStatusText: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Online Status Dot</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.goldEmboss} 
                    onChange={(e) => setOptions({...options, goldEmboss: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Glossy Golden Border</span>
                </label>
              </div>

              {/* Dynamic color selection for Live Profile Ring */}
              {options.profileGlow && (
                <div className="pt-2.5 flex items-center justify-between bg-blue-50/20 p-3 rounded-2xl border border-blue-50/50">
                  <span className="text-xs font-bold text-slate-700">Select Profile Glow Color:</span>
                  <div className="flex items-center gap-1.5">
                    {['#1877f2', '#10b981', '#f43f5e', '#eab308', '#ec4899', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setOptions({ ...options, avatarBorderColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border border-slate-300 transition-transform ${
                          options.avatarBorderColor === color ? 'scale-125 ring-2 ring-blue-500' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Upload fields */}
            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              {/* Picture upload matching exact same layout as NID */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">Profile Picture Upload</label>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-slate-200 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                        className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-[11px] hover:bg-blue-700 transition"
                      >
                        Upload Photo
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl(null)}
                          className="px-3 py-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Upload */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">Authorized Signature Upload</label>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-16 h-10 bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                    {signatureUrl ? (
                      <img src={signatureUrl} alt="Signature" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">Sign</span>
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
                        className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-[11px] hover:bg-blue-700 transition"
                      >
                        Upload Signature File
                      </button>
                      {signatureUrl && (
                        <button
                          type="button"
                          onClick={() => setSignatureUrl(null)}
                          className="px-3 py-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
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

          {/* Section 2: Cards Info Form Data */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                2. Profile Information Editor
              </h3>
              
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={resetToSample}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-800 text-[10px] font-black flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 text-[10px] font-black flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={info.fullName} 
                  maxLength={25}
                  placeholder="e.g. Mark Zuckerberg"
                  onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Username</label>
                <div className="relative mt-1">
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">@</span>
                  <input 
                    type="text" 
                    value={info.username} 
                    maxLength={17}
                    placeholder="zuck"
                    onChange={(e) => setInfo({ ...info, username: e.target.value.replace(/[^a-zA-Z0-9._]/g, '') })}
                    className="w-full p-2 pl-6 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Select Role Badge</label>
                <select
                  value={info.role}
                  onChange={(e) => setInfo({ ...info, role: e.target.value as BadgeType })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Creator">Creator (Video Content Creator)</option>
                  <option value="Developer">Developer (Meta Software Developer)</option>
                  <option value="Admin">Admin (Group & Page Admin)</option>
                  <option value="Meta Staff">Meta Staff (Official Meta Team)</option>
                  <option value="VIP Member">VIP Member (Premium VIP Member)</option>
                  <option value="Ad Account Mgr">Ad Account Mgr (Ad Account Manager)</option>
                </select>
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase font-mono">Blood Group</label>
                <input 
                  type="text" 
                  value={info.bloodGroup} 
                  maxLength={4}
                  placeholder="A+"
                  onChange={(e) => setInfo({ ...info, bloodGroup: e.target.value.toUpperCase() })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500 text-center" 
                />
              </div>
            </div>

            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Biography</label>
              <input 
                type="text" 
                value={info.bio} 
                maxLength={45}
                placeholder="e.g. Building the future of social connection."
                onChange={(e) => setInfo({ ...info, bio: e.target.value })}
                className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Joined Date</label>
                <input 
                  type="text" 
                  value={info.joinedDate} 
                  placeholder="e.g. Joined February 2004"
                  onChange={(e) => setInfo({ ...info, joinedDate: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Audience Count (Followers)</label>
                <input 
                  type="text" 
                  value={info.followerCount} 
                  placeholder="e.g. 119M Followers"
                  onChange={(e) => setInfo({ ...info, followerCount: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">HQ Campus / Location</label>
                <input 
                  type="text" 
                  value={info.location} 
                  maxLength={38}
                  placeholder="Palo Alto, California"
                  onChange={(e) => setInfo({ ...info, location: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Contact Phone</label>
                <input 
                  type="text" 
                  value={info.phone} 
                  placeholder="+1 (650) 543-4800"
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Facebook Profile Link (QR URL on Back)</label>
              <input 
                type="text" 
                value={info.profileUrl} 
                placeholder="https://facebook.com/zuck"
                onChange={(e) => setInfo({ ...info, profileUrl: e.target.value })}
                className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Right Preview Column: Smart Double Sided ID Card Visualization */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col items-center">
          
          {/* Card Frame Outer Container */}
          <div className="relative w-full max-w-[430px] rounded-[36px] bg-slate-900/5 p-6 border border-slate-200/50 shadow-2xl backdrop-blur-md flex flex-col items-center">
            
            {/* Real 3-D Perspective Container with Rotate effects */}
            <div className="w-full aspect-[1/1.54] [perspective:1200px] mb-6 relative">
              <motion.div 
                className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                
                {/* FRONT PANEL VIEW */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[28px] overflow-hidden shadow-2xl bg-slate-850">
                  <canvas 
                    ref={canvasFrontRef} 
                    width={960} 
                    height={1480} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="rounded-[28px]"
                  />
                  {/* Glass Gloss Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none rounded-[28px]" />
                </div>

                {/* BACK PANEL VIEW */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[28px] overflow-hidden shadow-2xl [transform:rotateY(180deg)] bg-slate-850">
                  <canvas 
                    ref={canvasBackRef} 
                    width={960} 
                    height={1480} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="rounded-[28px]"
                  />
                  {/* Glass Gloss Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none rounded-[28px]" />
                </div>

              </motion.div>
            </div>

            {/* Quick action buttons row */}
            <div className="w-full flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition"
              >
                <FlipHorizontal className="w-4 h-4 text-slate-600" />
                Flip Card ({isFlipped ? 'To Front' : 'To Back'})
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => downloadCardImage(isFlipped ? 'back' : 'front')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isFlipped ? 'Download Card Back' : 'Download Card Front'}
              </button>
            </div>

            {/* Micro instructional tips */}
            <div className="mt-4 flex gap-2 items-start bg-blue-50/50 p-4 rounded-2xl border border-blue-50 w-full text-[11px] text-slate-500">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Professional Printing Tips:</p>
                <p>The card preview resolves to high-definition 960x1480 pixel PNG layouts. Download both sides, print with standard PVC printer configurations, and laminate for maximum realism.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
