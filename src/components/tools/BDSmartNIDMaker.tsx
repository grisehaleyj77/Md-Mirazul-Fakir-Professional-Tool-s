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
  Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';

type ThemePreset = 'govt_standard' | 'digital_premium' | 'flag_patriot' | 'cloud_minimal';

interface NIDInfo {
  nameBangla: string;
  nameEnglish: string;
  fatherName: string;
  motherName: string;
  nidNumber: string;
  dob: string;
  bloodGroup: string;
  birthPlace: string;
  presentAddress: string;
  issueDate: string;
  gender: 'M' | 'F';
}

export const BDSmartNIDMaker = () => {
  // Sample Data matching the real card photograph exactly (MD. RUHUL AMIN)
  const sampleData: NIDInfo = {
    nameBangla: 'মোঃ রুহুল আমিন',
    nameEnglish: 'MD. RUHUL AMIN',
    fatherName: 'আককাচ আলী',
    motherName: 'মোছাঃ রাহিমা খাতুন',
    nidNumber: '326 848 3744',
    dob: '21 Jan 1985',
    bloodGroup: 'AB+',
    birthPlace: 'JHENAIDAH',
    presentAddress: 'বাসা/হোল্ডিং: ৩৬, গ্রাম/রাস্তা: রোড নং-২, ধানমন্ডি আবাসিক এলাকা, ডাকঘর: জিগাতলা - ১২০৯, ধানমন্ডি, ঢাকা দক্ষিণ সিটি কর্পোরেশন, ঢাকা',
    issueDate: '30 Nov 2015',
    gender: 'M'
  };

  // Blank state skeleton
  const blankData: NIDInfo = {
    nameBangla: '',
    nameEnglish: '',
    fatherName: '',
    motherName: '',
    nidNumber: '',
    dob: '',
    bloodGroup: '',
    birthPlace: '',
    presentAddress: '',
    issueDate: '',
    gender: 'M'
  };

  const [info, setInfo] = useState<NIDInfo>(sampleData);
  const [theme, setTheme] = useState<ThemePreset>('govt_standard');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hologram, biometric, and security features
  const [options, setOptions] = useState({
    grayscalePhoto: true,         // Authentic laser-engraved grayscale filter
    vignettePhoto: true,          // Fade raw photo edges smoothly into pattern background
    biometricChip: true,          // Metallic Smart EMV chip
    hologramSeal: true,           // Shiny holographic security seals
    backgroundWatermark: true,    // Original mint curves & red sun overlay
    officialSignature: true,      // Circular seal + Calligraphy registrar sign
    ghostPortrait: true,          // Semi-transparent secondary portrait nested inside Shapla logo
    curvedGuilloche: true         // Complex security waves pattern
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  // Pre-load default assets or fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700;800&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (err) {}
    };
  }, []);

  // Sync canvases on input changes
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

  // Clean Bangladesh Gov Seal Logo
  const drawGovernmentSeal = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    
    // Outer white background backing disc
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // 1. Solid Outer green circle
    ctx.strokeStyle = '#006a4e'; 
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r - 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Red central solar disc
    ctx.fillStyle = '#f42a41'; 
    ctx.beginPath();
    ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // 3. Golden Silhouette contour of Bangladesh map in center
    ctx.fillStyle = '#f4c430';
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 7);
    ctx.quadraticCurveTo(x - 3, y - 16, x + 3, y - 13);
    ctx.quadraticCurveTo(x + 7, y - 15, x + 9, y - 8);
    ctx.quadraticCurveTo(x + 4, y - 4, x + 10, y + 3);
    ctx.quadraticCurveTo(x + 6, y + 11, x + 3, y + 15);
    ctx.quadraticCurveTo(x - 4, y + 6, x - 7, y + 7);
    ctx.quadraticCurveTo(x - 6, y + 1, x - 10, y - 2);
    ctx.closePath();
    ctx.fill();

    // Inner ring decorative Bengali text simulation (very clean)
    ctx.fillStyle = '#006a4e';
    ctx.font = '700 3.3px "Noto Sans Bengali"';
    ctx.textAlign = 'center';
    
    // Text elements looping around outer ring inside the seal
    const textBD = "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার •";
    for (let i = 0; i < textBD.length; i++) {
      const angle = (i * 12 * Math.PI) / 180 + Math.PI;
      ctx.save();
      ctx.translate(x + Math.sin(angle) * (r - 5), y + Math.cos(angle) * (r - 5));
      ctx.rotate(-angle);
      ctx.fillText(textBD[i], 0, 0);
      ctx.restore();
    }

    ctx.restore();
  };

  // Premium EMV Metallic Smart Microchip representation
  const drawSmartMicrochip = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    
    // Golden gradient metallic chassis
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#eab308'); 
    grad.addColorStop(0.3, '#fef08a'); 
    grad.addColorStop(0.65, '#ca8a04'); 
    grad.addColorStop(1, '#854d0e'); 
    ctx.fillStyle = grad;
    
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1.8;
    
    // Rounded chip
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Draw the 6 glossy contact lanes matching original chip patterns
    ctx.fillStyle = '#fef08a';
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#451a03';

    // Horizontal split line
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    // Left grid segment
    ctx.beginPath();
    ctx.moveTo(x + w * 0.32, y);
    ctx.lineTo(x + w * 0.32, y + h);
    ctx.stroke();

    // Right grid segment
    ctx.beginPath();
    ctx.moveTo(x + w * 0.68, y);
    ctx.lineTo(x + w * 0.68, y + h);
    ctx.stroke();

    // Center micro circuit pad details
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.roundRect(x + w * 0.38, y + h * 0.22, w * 0.24, h * 0.56, 4);
    ctx.fill();
    ctx.stroke();

    // Gloss highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x + 3, y + 3);
    ctx.lineTo(x + w - 3, y + 3);
    ctx.stroke();

    ctx.restore();
  };

  // Helper: Draw stylized Purple Shapla flower emblem for holograms & back panel watermarks
  const drawPurpleShaplaSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    
    // Purple magenta line styling
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.22)';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.09)';
    ctx.lineWidth = 2;

    // Center sharp Lily petal
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.82);
    ctx.quadraticCurveTo(x + size * 0.26, y - size * 0.2, x, y + size * 0.32);
    ctx.quadraticCurveTo(x - size * 0.26, y - size * 0.2, x, y - size * 0.82);
    ctx.fill();
    ctx.stroke();

    // Wave left petal
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.1);
    ctx.quadraticCurveTo(x - size * 0.58, y - size * 0.1, x - size * 0.72, y - size * 0.44);
    ctx.quadraticCurveTo(x - size * 0.34, y - size * 0.34, x, y + size * 0.06);
    ctx.fill();
    ctx.stroke();

    // Wave right petal
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.1);
    ctx.quadraticCurveTo(x + size * 0.58, y - size * 0.1, x + size * 0.72, y - size * 0.44);
    ctx.quadraticCurveTo(x + size * 0.34, y - size * 0.34, x, y + size * 0.06);
    ctx.fill();
    ctx.stroke();

    // Outer support leaf nodes
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.16)';
    ctx.beginPath();
    ctx.arc(x, y + size * 0.24, size * 0.76, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();

    ctx.restore();
  };

  // Double card Guilloche Waves & red sun map background overlay exactly representing original card
  const applyAuthenticBackgroundPattern = (ctx: CanvasRenderingContext2D, w: number, h: number, isBack: boolean) => {
    // 1. Base light gradient mint-to-cream backdrop
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#f0faf6');  // Soft pastel mint green
    grad.addColorStop(0.5, '#fefefa'); // Light warm cream beige
    grad.addColorStop(1, '#e2f2eb');  // Soft green gradient floor
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Complex layered wave patterns
    if (options.curvedGuilloche) {
      ctx.save();
      ctx.lineWidth = 1;

      // Green Guilloche Waves
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      for (let i = -w * 0.5; i < w * 1.5; i += 46) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 150, h * 0.28, i + 320, h * 0.72, i + w * 0.5, h);
        ctx.stroke();
      }

      // Symmetrical light yellow/red counter waves
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.025)';
      for (let i = -w * 0.5; i < w * 1.5; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, h);
        ctx.bezierCurveTo(i + 180, h * 0.68, i + 360, h * 0.28, i + w * 0.5, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Central Red-Green National solar background emblem in center-right
    if (options.backgroundWatermark) {
      ctx.save();
      const sunX = w * 0.62;
      const sunY = h * 0.54;
      const sunR = 145;

      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunR);
      sunGrad.addColorStop(0, 'rgba(244, 42, 65, 0.12)'); // soft translucent red Solar disc
      sunGrad.addColorStop(0.5, 'rgba(244, 42, 65, 0.05)');
      sunGrad.addColorStop(1, 'rgba(244, 42, 65, 0)');
      
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Soft green water lily lines overlapping background center
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  // Draw Header elements directly onto pattern bg as seen in original photograph
  const drawFrontHeader = (ctx: CanvasRenderingContext2D, w: number) => {
    ctx.save();

    // 1. Bangladesh circular Gov crest on the top left
    const logoX = 90;
    const logoY = 70;
    const logoR = 36;
    drawGovernmentSeal(ctx, logoX, logoY, logoR);

    // 2. Title Text: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার" in deep green
    ctx.textAlign = 'left';
    ctx.fillStyle = '#006a4e'; // Custom Forest green matching real card text ink
    
    // Bold Bengali head font
    ctx.font = '800 23.5px "Noto Sans Bengali", sans-serif';
    ctx.fillText('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', logoX + 54, logoY - 8);

    // English subheading font
    ctx.font = '700 italic 13px "Inter", sans-serif';
    ctx.fillText("Government of the People's Republic of Bangladesh", logoX + 54, logoY + 11);

    // 3. Ribbon: Magenta/red rounded bar carrying card type NID/National ID
    const ribX = logoX + 54;
    const ribY = logoY + 22;
    const ribW = 480;
    const ribH = 34;

    ctx.fillStyle = '#cb2a40'; // True rich Crimson Red ribbon fill
    ctx.beginPath();
    ctx.roundRect(ribX, ribY, ribW, ribH, 17);
    ctx.fill();

    // White text inside ribbon
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '800 16px "Noto Sans Bengali", "Inter", sans-serif';
    ctx.fillText('জাতীয় পরিচয়পত্র / National ID Card', ribX + ribW / 2, ribY + 23);

    ctx.restore();
  };

  // Generate MRZ Lines dynamically matching standard security details
  const getMRZLines = () => {
    const rawNID = info.nidNumber.replace(/\s/g, '');
    const dobParts = info.dob.normalize().toUpperCase();
    let yy = '85';
    let mm = '01';
    let dd = '21';
    
    const months: Record<string, string> = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
      'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12',
      'জানু': '01', 'ফেব্রু': '02', 'মার্চ': '03', 'এপ্রিল': '04', 'মে': '05', 'জুন': '06',
      'জুলাই': '07', 'আগস্ট': '08', 'সেপ্টে': '09', 'অক্টো': '10', 'নভে': '11', 'ডিসে': '12'
    };
    
    const yrMatch = dobParts.match(/\d{4}/);
    if (yrMatch) {
      yy = yrMatch[0].substring(2);
    } else {
      const yrShortMatch = dobParts.match(/\d{2}/);
      if (yrShortMatch) yy = yrShortMatch[0];
    }
    
    const dayMatch = dobParts.match(/^\d{1,2}/) || dobParts.match(/\b\d{1,2}\b/);
    if (dayMatch) dd = dayMatch[0].padStart(2, '0');
    
    for (const [key, val] of Object.entries(months)) {
      if (dobParts.includes(key)) {
        mm = val;
        break;
      }
    }

    const genderChar = info.gender;
    const l1 = `I<BGD${rawNID.padEnd(9, '<')}<43<<<<<<<<<<<<<<<`.substring(0, 30);
    const l2 = `${yy}${mm}${dd}5${genderChar}221294BGD<<<<<<<<<<<<<8`.substring(0, 30);
    
    const cleanName = info.nameEnglish.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
    const nameParts = cleanName.split(/\s+/);
    let nameField = '';
    if (nameParts.length >= 2) {
      const surname = nameParts[nameParts.length - 1];
      const givenNames = nameParts.slice(0, nameParts.length - 1).join('<');
      nameField = `${surname}<<${givenNames}`;
    } else {
      nameField = cleanName;
    }
    const l3 = nameField.padEnd(30, '<').substring(0, 30);

    return [l1, l2, l3];
  };

  // Compile and Render Front Side of Bangladeshi Smart NID Card
  const drawFrontCard = () => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1050;
    const h = 600;
    ctx.clearRect(0, 0, w, h);
    
    // 1. Core security mint-cream background layout
    applyAuthenticBackgroundPattern(ctx, w, h, false);

    // 2. Draw dynamic header texts on background
    drawFrontHeader(ctx, w);

    // 3. User Portrait Photo (Left column) with rounded soft edge blend vignette!
    const picW = 240;
    const picH = 300;
    const picX = 70;
    const picY = 175;

    if (avatarUrl) {
      const img = new Image();
      img.src = avatarUrl;
      if (img.complete) {
        ctx.save();
        
        // Generate a vignette masking canvas for feathering
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = picW;
        maskCanvas.height = picH;
        const mCtx = maskCanvas.getContext('2d');
        if (mCtx) {
          // Draw grayscale corrected base image
          if (options.grayscalePhoto) {
            mCtx.filter = 'grayscale(100%) contrast(124%) brightness(98%)';
          }
          mCtx.drawImage(img, 0, 0, picW, picH);

          if (options.vignettePhoto) {
            // Apply clipping masks to fade margins transparently
            mCtx.globalCompositeOperation = 'destination-in';
            const vig = mCtx.createRadialGradient(
              picW / 2, picH / 2, Math.min(picW, picH) * 0.38,
              picW / 2, picH / 2, Math.max(picW, picH) * 0.52
            );
            vig.addColorStop(0, 'rgba(0,0,0,1)');
            vig.addColorStop(0.88, 'rgba(0,0,0,0.85)');
            vig.addColorStop(1, 'rgba(0,0,0,0)');
            mCtx.fillStyle = vig;
            mCtx.fillRect(0, 0, picW, picH);
          }
        }

        // Draw the soft masked photo on main canvas
        ctx.drawImage(maskCanvas, picX, picY);
        ctx.restore();
      } else {
        img.onload = () => drawFrontCard();
      }
    } else {
      // Default placeholder silhouette
      ctx.save();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(picX, picY, picW, picH, 32);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      // head
      ctx.arc(picX + picW / 2, picY + picH * 0.35, 48, 0, Math.PI * 2);
      ctx.fill();

      // shoulders
      ctx.beginPath();
      ctx.arc(picX + picW / 2, picY + picH + 30, 110, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Ghost Portrait + Purple Shapla holographic watermark on top right!
    if (options.ghostPortrait) {
      const ghostX = 890;
      const ghostY = 115;
      const ghostR = 48;

      // Draw purple background backing Shapla
      drawPurpleShaplaSymbol(ctx, ghostX, ghostY, ghostR);

      // Now blend a tiny B&W ghost portrait inside
      if (avatarUrl) {
        const img = new Image();
        img.src = avatarUrl;
        if (img.complete) {
          ctx.save();
          // Circular clipping mask
          ctx.beginPath();
          ctx.arc(ghostX, ghostY - 2, ghostR * 0.72, 0, Math.PI * 2);
          ctx.clip();
          
          ctx.globalAlpha = 0.32; // Low translucent ghost opacity
          ctx.filter = 'grayscale(100%) contrast(140%) brightness(105%)';
          ctx.drawImage(img, ghostX - ghostR * 0.75, ghostY - ghostR, ghostR * 1.5, ghostR * 2);
          ctx.restore();
        }
      }

      // Year/DOB text at the baseline of top right ghost photo
      ctx.save();
      ctx.fillStyle = 'rgba(100, 40, 180, 0.75)';
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillText(info.dob || '—', ghostX, ghostY + ghostR + 10);
      ctx.restore();
    }

    // 5. Signature directly on background (Below User Portrait Photo)
    const sigX = picX + 30;
    const sigY = picY + picH + 12;
    const sigW = picW - 60;
    const sigH = 50;

    if (signatureUrl) {
      const sImg = new Image();
      sImg.src = signatureUrl;
      if (sImg.complete) {
        ctx.drawImage(sImg, sigX, sigY, sigW, sigH);
      } else {
        sImg.onload = () => drawFrontCard();
      }
    } else {
      // Clean high precision digital signature
      ctx.save();
      ctx.strokeStyle = '#2563eb'; // Blue gel security pen
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sigX + 10, sigY + 34);
      ctx.bezierCurveTo(sigX + 40, sigY + 8, sigX + 70, sigY + 44, sigX + 90, sigY + 16);
      ctx.bezierCurveTo(sigX + 110, sigY + 4, sigX + 130, sigY + 38, sigX + 155, sigY + 22);
      ctx.stroke();
      ctx.restore();
    }

    // 6. EMV Microchip (Middle-right)
    if (options.biometricChip) {
      drawSmartMicrochip(ctx, 795, 260, 126, 94);
    }

    // 7. Core Records data values using clean font alignment matched to photograph
    const detailsX = 350;
    let detailsY = 195;

    const drawRowField = (labelB: string, labelE: string, value: string, textY: number) => {
      ctx.save();
      ctx.textAlign = 'left';

      // Bengali label above or left
      ctx.fillStyle = '#65a30d'; // Lime/green accent label tint exactly matches photograph
      ctx.font = 'bold 14px "Noto Sans Bengali", sans-serif';
      ctx.fillText(labelB, detailsX, textY);

      // English secondary label tag underneath
      ctx.fillStyle = '#64748b';
      ctx.font = '800 9.5px "Inter", sans-serif';
      ctx.fillText(labelE, detailsX, textY + 11);

      // Value block in charcoal matching laser text
      ctx.fillStyle = '#1e293b';
      ctx.font = '800 21px "Noto Sans Bengali", "Inter", sans-serif';
      ctx.fillText(value || '—', detailsX + 120, textY + 5);

      ctx.restore();
    };

    drawRowField('নাম', 'Name', info.nameBangla, detailsY);
    drawRowField('Name', 'English Name', info.nameEnglish.toUpperCase(), detailsY + 52);
    drawRowField('পিতা', 'Father Name', info.fatherName, detailsY + 104);
    drawRowField('মাতা', 'Mother Name', info.motherName, detailsY + 156);

    // 8. Bottom Information layout details (Date of Birth side-by-side)
    const dobY = detailsY + 215;
    ctx.save();
    ctx.textAlign = 'left';

    ctx.fillStyle = '#65a30d';
    ctx.font = 'bold 14px "Noto Sans Bengali", sans-serif';
    ctx.fillText('Date of Birth', detailsX, dobY);

    ctx.fillStyle = '#1e293b';
    ctx.font = '800 20px "Inter", sans-serif';
    ctx.fillText(info.dob || '—', detailsX + 120, dobY);
    ctx.restore();

    // 9. NID ID NO. block in spacing matching original
    const nidY = dobY + 55;
    ctx.save();
    ctx.textAlign = 'left';

    ctx.fillStyle = '#65a30d';
    ctx.font = 'bold 14px "Noto Sans Bengali", sans-serif';
    ctx.fillText('NID No.', detailsX, nidY);

    // Bold charcoal laser monospaced ID Font representation
    ctx.fillStyle = '#27272a';
    ctx.font = '900 30px "JetBrains Mono", "Inter", monospace';
    ctx.fillText(info.nidNumber || '—', detailsX + 120, nidY + 2);
    ctx.restore();
  };

  // Compile and Render Back Side of BD Smart NID Card
  const drawBackCard = () => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1050;
    const h = 600;
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Core security pattern layout
    applyAuthenticBackgroundPattern(ctx, w, h, true);

    // 2. Head Magnetic stripe tape
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(0, 20, w, 70);

    // Silver metallic stripe bottom boundary
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 90, w, 3.5);

    // 3. Left column address & administrative metadata
    const backX = 55;
    let backY = 165;

    const wrapText = (text: string, x: number, y: number, maxW: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxW && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    };

    const drawBackMetadataRow = (labelB: string, labelE: string, val: string, isFullW: boolean = false) => {
      ctx.save();
      ctx.textAlign = 'left';

      // Green label
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 15px "Noto Sans Bengali", sans-serif';
      ctx.fillText(labelB, backX, backY);

      // Value in bold
      ctx.fillStyle = '#1e293b';
      ctx.font = '800 17.5px "Noto Sans Bengali", "Inter", sans-serif';
      
      if (isFullW) {
        wrapText(val || '—', backX + 85, backY + 1.5, 520, 26);
      } else {
        ctx.fillText(val || '—', backX + 120, backY + 1.5);
      }
      ctx.restore();
    };

    drawBackMetadataRow('ঠিকানা:', 'Address', info.presentAddress, true);

    backY = 280;
    drawBackMetadataRow('জন্মস্থান:', 'Place of Birth', info.birthPlace);

    ctx.fillStyle = '#64748b';
    ctx.font = '800 9px "Inter", sans-serif';
    ctx.fillText('Place of Birth', backX, backY + 12);

    backY = 336;
    drawBackMetadataRow('রক্তের গ্রুপ:', 'Blood Group', info.bloodGroup);

    ctx.fillStyle = '#64748b';
    ctx.font = '800 9px "Inter", sans-serif';
    ctx.fillText('Blood Group', backX, backY + 12);

    // 4. Large Purple shapla symbol + ghost B&W photo on center-right back exactly like real card
    const backShaplaX = 680;
    const backShaplaY = 240;
    const backShaplaR = 64;

    drawPurpleShaplaSymbol(ctx, backShaplaX, backShaplaY, backShaplaR);

    // Ghost avatar next to shapla on back
    if (avatarUrl && options.ghostPortrait) {
      const ghostImg = new Image();
      ghostImg.src = avatarUrl;
      if (ghostImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.filter = 'grayscale(100%) contrast(110%) brightness(100%)';
        ctx.drawImage(ghostImg, 810, 160, 110, 140);
        ctx.restore();
      }
    }

    // 5. Registrar official DG seal & calligraphy sign (Under Shapla symbol)
    if (options.officialSignature) {
      const sealX = 840;
      const sealY = 345;

      ctx.save();
      // Red circular department stamp backing
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sealX, sealY - 14, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sharp calligraphy registrar signature ink
      ctx.strokeStyle = '#1e3a8a'; // dark security blue ink
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sealX - 45, sealY - 20);
      ctx.bezierCurveTo(sealX - 25, sealY - 44, sealX, sealY + 10, sealX + 25, sealY - 15);
      ctx.bezierCurveTo(sealX + 35, sealY - 25, sealX + 45, sealY - 5, sealX + 55, sealY - 12);
      ctx.stroke();

      // Official designation stamps
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 12.5px "Noto Sans Bengali", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('মহাপরিচালক', sealX, sealY + 22);

      ctx.fillStyle = '#64748b';
      ctx.font = '700 italic 9px "Inter", sans-serif';
      ctx.fillText('Director General', sealX, sealY + 32);
      ctx.restore();
    }

    // Dynamic issue date on bottom-right of back side
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 15px "Noto Sans Bengali", sans-serif';
    ctx.fillText('প্রদানের তারিখ:', w - 215, h - 225);

    ctx.fillStyle = '#1e293b';
    ctx.font = '800 16px "Inter", sans-serif';
    ctx.fillText(info.issueDate || '—', w - 110, h - 224);

    ctx.fillStyle = '#64748b';
    ctx.font = '800 9px "Inter", sans-serif';
    ctx.fillText('Issue Date', w - 215, h - 210);
    ctx.restore();

    // 6. 2D PDF417 matrix representation of barcode spanning card center width
    ctx.save();
    const barcodeX = 55;
    const barcodeY = 415;
    const barcodeW = 940;
    const barcodeH = 50;
    
    // Draw white bounding board
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(barcodeX - 10, barcodeY - 10, barcodeW + 20, barcodeH + 20, 8);
    ctx.fill();

    // Paint micro matrices
    ctx.fillStyle = '#1e293b';
    const numRows = 5;
    const numCols = 150;
    const bCellW = barcodeW / numCols;
    const bCellH = barcodeH / numRows;

    const barSeedStr = info.nidNumber || '3268483744';

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const isGuideWall = c < 4 || c > numCols - 5;
        let paintBlack = false;
        if (isGuideWall) {
          paintBlack = (c % 2 === 0);
        } else {
          const scX = (r * 15 + c) % barSeedStr.length;
          const charV = barSeedStr.charCodeAt(scX);
          paintBlack = (c + r * charV) % 3 === 0;
        }

        if (paintBlack) {
          ctx.fillRect(barcodeX + c * bCellW, barcodeY + r * bCellH, bCellW + 0.3, bCellH + 0.3);
        }
      }
    }
    ctx.restore();

    // 7. Dynamic high-fidelity 3 lines of OCR Passport/ID Card MRZ Standard Reader code at bottom!
    const mrzStartY = 505;
    
    // Draw light grey OCR strip banner
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, mrzStartY - 10, w, h - mrzStartY + 10);

    ctx.save();
    ctx.fillStyle = '#334155'; // Dark grey OCR-B/JetBrains Mono scanner font represent
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    const [line1, line2, line3] = getMRZLines();
    
    ctx.fillText(line1, 55, mrzStartY + 15);
    ctx.fillText(line2, 55, mrzStartY + 45);
    ctx.fillText(line3, 55, mrzStartY + 75);
    ctx.restore();

    ctx.restore();
  };

  const downloadNIDMap = (face: 'front' | 'back') => {
    setIsGenerating(true);
    const canvas = face === 'front' ? canvasFrontRef.current : canvasBackRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `BD_Smart_NID_${face}_${info.nidNumber.replace(/\s/g, '') || 'Holder'}.png`;
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="bangladesh-smart-nid-maker-app">
      
      {/* Dynamic Aesthetic Title Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-red-500/10 p-6 rounded-3xl border border-emerald-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Contact className="w-6 h-6 text-green-700" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Fake BD Smart NID Card Maker
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            ডিজাইন ভেরিফিকেশন, শিক্ষামূলক লেআউট মডেলিং এবং ভিজ্যুয়াল উপস্থাপনার জন্য একদম ফটো রেপ্লিকার মত বাংলাদেশী স্মার্ট জাতীয় পরিচয়পত্র (Smart NID) তৈরি করুন। এতে রয়েছে আল্ট্রা-রিয়ালিস্টিক ওয়াটারমার্ক, থ্রিডি মেটালিক চিপ, লেজার গ্রে-স্কেল ফটো ফিল্টার এবং ব্যাকসাইড বারকোড জেনারেটর।
          </p>
        </div>

        <button 
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2 transition duration-200"
        >
          <FlipHorizontal className="w-4 h-4" />
          কার্ড অল্টান (Flip Card Preview)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Parameters Forms & Configuration Panels */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Theme & Styling control widgets */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              ১. রেপ্লিকা ডিজাইন এবং অপশন (Choose Design Theme)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-2.5">
              {([
                { id: 'govt_standard', name: 'অফিসিয়াল মিন্ট গোল্ড', desc: 'Authentic Soft Mint' },
                { id: 'flag_patriot', name: 'দেশাত্মবোধক লাল-সবুজ', desc: 'National Flag Theme' },
                { id: 'digital_premium', name: 'ডিজিটাল মেরিন গ্রিড', desc: 'Secure Dark Teal' },
                { id: 'cloud_minimal', name: 'সিম্পল পেপার হোয়াইট', desc: 'Minimalist Blank Slate' }
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as ThemePreset)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    theme === t.id 
                      ? 'border-emerald-500 bg-emerald-50/20 font-black scale-[0.98]' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-800 tracking-tight">{t.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Premium realistic custom filter option switches */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">সিকিউরিটি ডিজাইন কন্ট্রোল (Realistic Controls)</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.grayscalePhoto} 
                    onChange={(e) => setOptions({...options, grayscalePhoto: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>লেজার গ্রে-স্কেল ফিল্টার</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.vignettePhoto} 
                    onChange={(e) => setOptions({...options, vignettePhoto: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>সফট ফেদার ছবি কোণ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.biometricChip} 
                    onChange={(e) => setOptions({...options, biometricChip: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>মেটালিক গোল্ড চিপ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.ghostPortrait} 
                    onChange={(e) => setOptions({...options, ghostPortrait: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>ডুয়াল ট্রান্সলুসেন্ট ফটো</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.curvedGuilloche} 
                    onChange={(e) => setOptions({...options, curvedGuilloche: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>সিকিউরিটি গিলোচ ঢেউ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={options.officialSignature} 
                    onChange={(e) => setOptions({...options, officialSignature: e.target.checked})}
                    className="rounded text-green-700 focus:ring-green-500 h-4 w-4 shadow-sm"
                  />
                  <span>অফিসিয়াল সীল-স্বাক্ষর</span>
                </label>
              </div>
            </div>

            {/* Profile uploads */}
            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              {/* Photo */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">NID Profile Photo image (পোর্ট্রেট ছবি)</label>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-12 h-14 bg-slate-200 rounded-xl border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
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
                        className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl font-bold text-[11px] hover:bg-emerald-800 transition"
                      >
                        আপলোড ছবি
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl(null)}
                          className="px-3 py-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        >
                          রিসেট
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Holder Signature (স্বাক্ষর)</label>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-16 h-10 bg-slate-200 rounded-xl border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
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
                        className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl font-bold text-[11px] hover:bg-emerald-800 transition"
                      >
                        স্বাক্ষর আপলোড
                      </button>
                      {signatureUrl && (
                        <button
                          type="button"
                          onClick={() => setSignatureUrl(null)}
                          className="px-3 py-2 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        >
                          রিসেট
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Registry Data Elements */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                ২. জাতীয় নাগরিক তথ্য ফরম (National Registry Fields)
              </h3>
              
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={resetToSample}
                  className="px-2 py-1 bg-green-50 hover:bg-green-150 rounded-lg text-green-800 text-[10px] font-black flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3 h-3" />
                  রিসেট নমুনা
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 text-[10px] font-black flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  ফর্ম মুছুন
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">নাম (বাংলা)</label>
                <input 
                  type="text" 
                  value={info.nameBangla} 
                  maxLength={34}
                  placeholder="যেমন: মোঃ রুহুল আমিন"
                  onChange={(e) => setInfo({ ...info, nameBangla: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-green-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Name (English)</label>
                <input 
                  type="text" 
                  value={info.nameEnglish} 
                  maxLength={34}
                  placeholder="e.g. MD. RUHUL AMIN"
                  onChange={(e) => setInfo({ ...info, nameEnglish: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-green-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">পিতা (Father Name)</label>
                <input 
                  type="text" 
                  value={info.fatherName} 
                  maxLength={34}
                  placeholder="যেমন: আককাচ আলী"
                  onChange={(e) => setInfo({ ...info, fatherName: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-green-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">মাতা (Mother Name)</label>
                <input 
                  type="text" 
                  value={info.motherName} 
                  maxLength={34}
                  placeholder="যেমন: মোছাঃ রাহিমা খাতুন"
                  onChange={(e) => setInfo({ ...info, motherName: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-green-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase text-center block">Blood Group</label>
                <input 
                  type="text" 
                  value={info.bloodGroup} 
                  maxLength={4}
                  placeholder="AB+"
                  onChange={(e) => setInfo({ ...info, bloodGroup: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl text-center" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100 col-span-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">জন্ম তারিখ (DOB)</label>
                <input 
                  type="text" 
                  value={info.dob} 
                  placeholder="যেমন: 21 Jan 1985"
                  onChange={(e) => setInfo({ ...info, dob: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">ID NO (স্মার্ট নম্বর - ১০ ডিজিট)</label>
                <input 
                  type="text" 
                  value={info.nidNumber} 
                  maxLength={17}
                  placeholder="যেমন: 326 848 3744"
                  onChange={(e) => setInfo({ ...info, nidNumber: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-green-500" 
                />
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">জন্মস্থান (Birth Place)</label>
                <input 
                  type="text" 
                  value={info.birthPlace} 
                  maxLength={18}
                  placeholder="যেমন: JHENAIDAH"
                  onChange={(e) => setInfo({ ...info, birthPlace: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Gender (লিঙ্গ)</label>
                <select
                  value={info.gender}
                  onChange={(e) => setInfo({ ...info, gender: e.target.value as 'M' | 'F' })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl"
                >
                  <option value="M">Male (পুরুষ)</option>
                  <option value="F">Female (মহিলা)</option>
                </select>
              </div>

              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">প্রদানের তারিখ (Issue Date)</label>
                <input 
                  type="text" 
                  value={info.issueDate} 
                  placeholder="যেমন: 30 Nov 2015"
                  onChange={(e) => setInfo({ ...info, issueDate: e.target.value })}
                  className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase">Address (সম্পূর্ণ ঠিকানা)</label>
              <textarea 
                value={info.presentAddress} 
                rows={2}
                placeholder="বাসা/হোল্ডিং: ৩৬, গ্রাম/রাস্তা: রোড নং-২, ধানমন্ডি আবাসিক এলাকা, ডাকঘর: জিজাতলা - ১২০৯"
                onChange={(e) => setInfo({ ...info, presentAddress: e.target.value })}
                className="w-full mt-1 p-2 text-xs text-slate-800 font-bold border border-slate-200 bg-white rounded-xl" 
              />
            </div>

            {/* Warning block about simulated mock cards */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-800 font-bold leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>সতর্কতা:</strong> এটি একটি সিমুলেটেড নমুনা ডিজাইন টুল যা শিক্ষামূলক, গবেষণা ও ডিজাইন ভেরিফিকেশনের জন্য ব্যবহৃত হয়। আইন অবমাননাকারী ব্যবহারের সপক্ষে এটি কোনো বাস্তব পরিচয়পত্র ইস্যু করে না।
              </span>
            </div>
          </div>

        </div>

        {/* Right Columns: Card preview and download actions */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          {/* Main card box panel */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 border border-slate-100 rounded-[32px] p-4 md:p-8 min-h-[440px]">
            <div className="perspective-1000 w-full max-w-[620px] aspect-[1.75/1]">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="preserve-3d w-full h-full relative cursor-pointer font-sans"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                
                {/* FRONT PANEL SHOWCASE */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-[20px] border ${
                    theme === 'cloud_minimal' ? 'border-gray-200 shadow-md' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasFrontRef} 
                    width={1050} 
                    height={600} 
                    className="w-full h-full pointer-events-none"
                    id="canvas-nid-front"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

                {/* BACK PANEL SHOWCASE */}
                <div 
                  className={`absolute w-full h-full backface-hidden rounded-[20px] border rotate-y-180 ${
                    theme === 'cloud_minimal' ? 'border-gray-200 shadow-md' : 'border-neutral-800 shadow-2xl'
                  } overflow-hidden`}
                >
                  <canvas 
                    ref={canvasBackRef} 
                    width={1050} 
                    height={600} 
                    className="w-full h-full pointer-events-none"
                    id="canvas-nid-back"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                </div>

              </motion.div>
            </div>

            <p className="text-[11px] text-slate-400 font-extrabold uppercase mt-6 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              কার্ডের পেছনের অংশ দেখতে কার্ডের ওপরে ক্লিক করুন (Click preview to toggle view)
            </p>
          </div>

          {/* Export tools */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              ৩. হাই-ডেফিনিশন ইমেজ ডাউনলোড করুন (Export High-Resolution Assets)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => downloadNIDMap('front')}
                disabled={isGenerating}
                className="py-3.5 px-4 bg-gradient-to-r from-emerald-700 to-green-800 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-emerald-800 active:scale-[0.98] shadow-lg shadow-green-700/10"
              >
                <Download className="w-4 h-4" />
                কার্ডের সামনের দিক ডাউনলোড (HD FRONT IMAGE)
              </button>

              <button
                type="button"
                onClick={() => downloadNIDMap('back')}
                disabled={isGenerating}
                className="py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition hover:from-slate-900 active:scale-[0.98] shadow-lg shadow-slate-800/10"
              >
                <Download className="w-4 h-4" />
                কার্ডের পেছনের দিক ডাউনলোড (HD BACK IMAGE)
              </button>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100/60 rounded-2xl flex items-start gap-3 text-xs text-emerald-800 leading-relaxed font-bold">
              <Sparkles className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
              <span>
                <strong>ডাউনলোড স্পেসিফিকেশন:</strong> কার্ডের ডাউনলোড সাইজ নিখুঁত প্রিন্টিং উপযোগী হাই-রেজোলিউশন ১০৫০ x ৬০০ পিক্সেলে তৈরি করা হয়েছে। যা বিশ্বমানের কার্ড প্রিন্টিং ডাইমেনশনে একদম পারফেক্ট।
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
