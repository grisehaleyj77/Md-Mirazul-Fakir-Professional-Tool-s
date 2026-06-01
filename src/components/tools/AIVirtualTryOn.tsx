import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Upload, 
  Camera, 
  Download, 
  RefreshCw, 
  RotateCw, 
  Maximize, 
  Eye, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  HelpCircle,
  Shirt,
  Scissors,
  Layers,
  ArrowRight,
  User,
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';

// Preset Models (Unsplash curated high-quality portraits)
const MODEL_PRESETS = [
  {
    id: 'm1',
    name: 'Sophia',
    gender: 'female',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    fullUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm2',
    name: 'James',
    gender: 'male',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    fullUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm3',
    name: 'Chloe',
    gender: 'female',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    fullUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm4',
    name: 'Ethan',
    gender: 'male',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    fullUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
  }
];

// Curated Garments Catalog (high quality isolated PNG images from Unsplash/Picsum styled beautifully)
const GARMENT_PRESETS = [
  {
    id: 'g1',
    name: 'Black Leather Jacket',
    category: 'upper-body',
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'g2',
    name: 'Crisp Indigo Blazer',
    category: 'upper-body',
    thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'g3',
    name: 'Crimson Floral Dress',
    category: 'full-body',
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'g4',
    name: 'Traditional Emerald Saree',
    category: 'full-body',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'g5',
    name: 'Casual Ochre Hoodie',
    category: 'upper-body',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'g6',
    name: 'Premium White Polo',
    category: 'upper-body',
    thumbnail: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200',
    fullUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400'
  }
];

const STYLE_PRESETS = [
  { id: 'studio', label: 'Premium Studio Light', prompt: 'Professional studio portrait photography, soft high-contrast key lights, detailed fabrics textures and shadows' },
  { id: 'outdoor', label: 'Urban Streetwear', prompt: 'Cinematic sunny street background, analog realistic photography, warm lighting depth' },
  { id: 'editorial', label: 'Fashion Editorial', prompt: 'Minimalist editorial solid background, soft shadows, couture luxury publication magazine style' },
  { id: 'breeze', label: 'Sunset Glow', prompt: 'Outdoor golden hour sunset lighting, soft rays, detailed fabric fold contours, realistic shading' }
];

// High-fidelity background removal function utilizing Euclidean color matching in RGB space
const removeGarmentBackground = (img: HTMLImageElement, threshold: number): string => {
  const canvas = document.createElement('canvas');
  // Crop slightly to avoid border noises and get clean resolution
  canvas.width = img.naturalWidth || img.width || 400;
  canvas.height = img.naturalHeight || img.height || 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Auto-detect background color by sampling corner pixels
  // We sample 4 corners to find if they are near-identical background shades
  const corners = [
    { r: data[0], g: data[1], b: data[2] },
    { r: data[(canvas.width - 1) * 4], g: data[(canvas.width - 1) * 4 + 1], b: data[(canvas.width - 1) * 4 + 2] },
    { r: data[(canvas.height - 1) * canvas.width * 4], g: data[(canvas.height - 1) * canvas.width * 4 + 1], b: data[(canvas.height - 1) * canvas.width * 4 + 2] },
    { r: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4], g: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 1], b: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 2] }
  ];

  // Fallback to absolute white reference if corner colors are not robust, otherwise use the top-left corner
  const keyColor = (corners[0].r > 200 && corners[0].g > 200 && corners[0].b > 200) 
    ? { r: 255, g: 255, b: 255 }
    : corners[0];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate distance on RGB space
    const dist = Math.sqrt(
      Math.pow(r - keyColor.r, 2) +
      Math.pow(g - keyColor.g, 2) +
      Math.pow(b - keyColor.b, 2)
    );

    if (dist < threshold) {
      data[i + 3] = 0; // Transparent
    } else {
      // Soft antialiasing boundary filter
      const boundaryRatio = (dist - threshold) / 12;
      if (boundaryRatio < 1 && boundaryRatio > 0) {
        data[i + 3] = Math.min(data[i + 3], Math.round(data[i + 3] * boundaryRatio));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

export const AIVirtualTryOn = () => {
  // Mode selection: 'ai' -> Generative, 'canvas' -> Interactive manual canvas
  const [activeTab, setActiveTab] = useState<'ai' | 'canvas'>('ai');

  // Input states
  const [userPhoto, setUserPhoto] = useState<string | null>(MODEL_PRESETS[0].fullUrl);
  const [garmentPhoto, setGarmentPhoto] = useState<string | null>(GARMENT_PRESETS[0].fullUrl);
  const [garmentType, setGarmentType] = useState<string>('upper-body');
  const [stylePreset, setStylePreset] = useState<string>('studio');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Magic background erasure parameters
  const [isBgRemovalActive, setIsBgRemovalActive] = useState<boolean>(true);
  const [bgThreshold, setBgThreshold] = useState<number>(45);
  const [processedGarmentPhoto, setProcessedGarmentPhoto] = useState<string | null>(null);
  const [isProcessingGarment, setIsProcessingGarment] = useState<boolean>(false);

  // Background removal trigger effect
  useEffect(() => {
    if (!garmentPhoto) {
      setProcessedGarmentPhoto(null);
      return;
    }

    if (!isBgRemovalActive) {
      setProcessedGarmentPhoto(garmentPhoto);
      return;
    }

    setIsProcessingGarment(true);
    const img = new Image();
    if (!garmentPhoto.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = garmentPhoto;

    img.onload = () => {
      try {
        const transparentResult = removeGarmentBackground(img, bgThreshold);
        setProcessedGarmentPhoto(transparentResult);
      } catch (err) {
        console.warn("Could not access image pixel data for cutout background styling (CORS boundary block). Using original preset.", err);
        setProcessedGarmentPhoto(garmentPhoto);
      } finally {
        setIsProcessingGarment(false);
      }
    };

    img.onerror = () => {
      setProcessedGarmentPhoto(garmentPhoto);
      setIsProcessingGarment(false);
    };
  }, [garmentPhoto, isBgRemovalActive, bgThreshold]);

  // Camera integration
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // AI Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState<boolean>(false);

  // Interactive Live Canvas parameters
  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(480);
  const [position, setPosition] = useState({ x: 120, y: 160 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.85);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFlipped, setIsFlipped] = useState(false);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // AI Steaming status simulator list for high engagement loading screen
  const loadingSteps = [
    'Parsing model dimensions and proportions...',
    'Isolating background contours...',
    'Analyzing fabric specifications and fit...',
    'Deploying Gemini 2.5 Multi-Image synthesis engine...',
    'Injecting folds, seams, and clothing shading vectors...',
    'Applying light scattering and color harmony filters...',
    'Completing high-contrast virtual layout stitch...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Handling user image uploads
  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handling garment image uploads
  const handleGarmentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGarmentPhoto(event.target?.result as string);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Camera Activation
  const startCamera = async () => {
    setIsCameraActive(true);
    setGeneratedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 640 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure permissions are granted.');
      setIsCameraActive(false);
    }
  };

  // Capture Image from Webcam Feed
  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(-1, 1); // Flip horizontally for natural mirror feel
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUserPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Shut down camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Helper to create a local canvas composite of the virtual fit
  const createLocalCanvasComposite = (overrideUserPhoto?: string, overrideGarmentPhoto?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const activeUserPhoto = overrideUserPhoto || userPhoto;
      const activeGarmentPhoto = overrideGarmentPhoto || processedGarmentPhoto || garmentPhoto;

      if (!activeUserPhoto) {
        reject(new Error("Please select or upload a model photo first."));
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not initialize 2D canvas context."));
        return;
      }

      const bgImg = new Image();
      if (!activeUserPhoto.startsWith('data:')) {
        bgImg.crossOrigin = 'anonymous';
      }
      bgImg.src = activeUserPhoto;

      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, 600, 600);

        if (!activeGarmentPhoto) {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
          return;
        }

        const overlayImg = new Image();
        if (!activeGarmentPhoto.startsWith('data:')) {
          overlayImg.crossOrigin = 'anonymous';
        }
        overlayImg.src = activeGarmentPhoto;

        overlayImg.onload = () => {
          ctx.save();
          
          let targetX = 300;
          let targetY = 320;
          let targetW = 240;
          let targetH = 260;

          if (garmentType === 'lower-body') {
            targetY = 440;
            targetW = 200;
            targetH = 200;
          } else if (garmentType === 'full-body') {
            targetY = 360;
            targetW = 300;
            targetH = 430;
          } else if (garmentType === 'accessory') {
            targetY = 220;
            targetW = 120;
            targetH = 120;
          }

          ctx.translate(targetX, targetY);
          
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) opacity(0.92)`;
          
          if (isFlipped) {
            ctx.scale(-1, 1);
          }

          ctx.drawImage(overlayImg, -targetW / 2, -targetH / 2, targetW, targetH);
          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };

        overlayImg.onerror = () => {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
      };

      bgImg.onerror = () => {
        reject(new Error("Failed to load model reference image."));
      };
    });
  };

  // Trigger Gemini AI virtual try-on call
  const generateTryOn = async () => {
    if (!userPhoto) {
      setErrorMessage("Please select or upload a model / user photo first.");
      return;
    }
    setErrorMessage(null);
    setIsUsingLocalFallback(false);
    setIsGenerating(true);

    try {
      const activePreset = STYLE_PRESETS.find(s => s.id === stylePreset);
      const payload = {
        userImage: userPhoto,
        userMimeType: userPhoto.startsWith('data:') ? userPhoto.split(';')[0].split(':')[1] : 'image/jpeg',
        garmentImage: garmentPhoto,
        garmentMimeType: garmentPhoto && garmentPhoto.startsWith('data:') ? garmentPhoto.split(';')[0].split(':')[1] : 'image/jpeg',
        garmentType,
        promptPreset: activePreset ? activePreset.prompt : undefined,
        customPrompt: customPrompt
      };

      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Server processing error occurred.');
      }

      if (data.isFallback) {
        console.log("Server responded with a safe fallback payload. Rendering client canvas blend...");
        const fallbackUrl = await createLocalCanvasComposite(data.userBase64, data.garmentBase64);
        setGeneratedResult(fallbackUrl);
        setIsUsingLocalFallback(true);
      } else {
        setGeneratedResult(data.imageUrl);
      }
    } catch (err: any) {
      console.warn('AI try-on generation encountered error, auto routing to Instant Canvas Blend fallback:', err);
      try {
        const fallbackUrl = await createLocalCanvasComposite();
        setGeneratedResult(fallbackUrl);
        setIsUsingLocalFallback(true);
        setErrorMessage(null); // Clear errors because fallback resolved successfully
      } catch (fallbackErr: any) {
        console.error("Local canvas overlay fallback failed:", fallbackErr);
        setErrorMessage(err.message || 'The Gemini AI image workspace model failed to process. Ensure your API secret is active.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Mouse / Touch handlers for manual dressing room canvas dragging
  const handleInteractionStart = (clientX: number, clientY: number) => {
    if (activeTab !== 'canvas') return;
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  // Reset interactive canvas defaults
  const resetCanvasProperties = () => {
    setPosition({ x: 120, y: 160 });
    setScale(1);
    setRotation(0);
    setOpacity(0.85);
    setBrightness(100);
    setContrast(100);
    setIsFlipped(false);
  };

  // Save layered canvas results as single manual download
  const saveManualCanvasComposite = () => {
    if (!userPhoto || !garmentPhoto) return;

    // We build a hidden canvas to composite the user background + garment overlay
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = userPhoto;
    
    bgImg.onload = () => {
      // Draw background
      ctx.drawImage(bgImg, 0, 0, 600, 600);

      const overlayImg = new Image();
      const activeGarment = processedGarmentPhoto || garmentPhoto || "";
      if (!activeGarment.startsWith('data:')) {
        overlayImg.crossOrigin = 'anonymous';
      }
      overlayImg.src = activeGarment;

      overlayImg.onload = () => {
        ctx.save();
        
        // Match base transformations that coordinates are mapped inside width 400
        // Translate to layer center
        const layerWidth = 200 * scale;
        const layerHeight = 200 * scale;
        const drawX = (position.x / 400) * 600 + layerWidth / 2;
        const drawY = (position.y / 400) * 600 + layerHeight / 2;

        ctx.translate(drawX, drawY);
        ctx.rotate((rotation * Math.PI) / 180);
        if (isFlipped) {
          ctx.scale(-1, 1);
        }

        // Apply filters directly on canvas context
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) opacity(${opacity})`;

        // Draw overlay
        ctx.drawImage(overlayImg, -layerWidth / 2, -layerHeight / 2, layerWidth, layerHeight);
        ctx.restore();

        // Download result
        try {
          const finishedUrl = canvas.toDataURL('image/jpeg', 0.9);
          const downloadAnchor = document.createElement('a');
          downloadAnchor.href = finishedUrl;
          downloadAnchor.download = 'mirazul-virtual-tryon.jpeg';
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          document.body.removeChild(downloadAnchor);
        } catch (e) {
          console.error(e);
          alert("Canvas tainted due to external URL security. Please take an image screenshot or use AI Generation blending instead!");
        }
      };
    };
  };

  return (
    <div className="space-y-12">
      {/* Top Description Box */}
      <div className="bg-[var(--card-bg)] rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Enterprise Module
          </span>
          <h3 className="text-xl font-black text-[var(--text-main)]">AI Virtual Fashion Try-On</h3>
          <p className="text-sm font-medium text-[var(--text-muted)] max-w-2xl">
            Seamlessly visualize your clothing designs, boutique apparel, or catalog collections on live model presets or customized selfie uploads using dual-canvas Gemini image generation.
          </p>
        </div>
        
        {/* Toggle Workspace Channels */}
        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl flex gap-1 w-full md:w-auto">
          <button
            onClick={() => { setActiveTab('ai'); setErrorMessage(null); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Generator
          </button>
          <button
            onClick={() => { setActiveTab('canvas'); setErrorMessage(null); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'canvas'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Canvas Fitting Studio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTROL SUITE AND SELECTION (width: 5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* STEP 1: Select or Upload Model */}
          <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <span className="font-black text-sm">1</span>
                </div>
                <h4 className="text-md font-black text-[var(--text-main)]">Model & User Stance</h4>
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)]">Webcam Compatible</span>
            </div>

            {/* Model Presets */}
            <div className="grid grid-cols-4 gap-3">
              {MODEL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => { setUserPhoto(preset.fullUrl); setGeneratedResult(null); stopCamera(); }}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    userPhoto === preset.fullUrl && !isCameraActive
                      ? 'border-blue-600 scale-[1.03] shadow-md'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={preset.thumbnail} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center font-bold text-[9px] text-white tracking-widest uppercase">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Camera / Upload Action Bar */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-black text-xs transition-all ${
                  isCameraActive 
                    ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-500/10' 
                    : 'border-slate-200 hover:border-blue-500 text-[var(--text-main)] border-dashed'
                }`}
              >
                <Camera className="w-4 h-4" />
                {isCameraActive ? "Camera Active" : "Take Live Selfie"}
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUserPhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 text-[var(--text-main)] font-black text-xs transition-all">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Live Camera Interface inside left control sidebar when toggled */}
            {isCameraActive && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-3 border border-slate-100 dark:border-white/5 animate-in fade-in duration-300">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover scale-x-[-1]"
                    playsInline
                    muted
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    Live Feed
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={captureCamera}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Capture Shot
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-slate-200 dark:bg-slate-800 text-[var(--text-main)] font-black text-xs px-5 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Select/Upload Clothing Garment */}
          <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <span className="font-black text-sm">2</span>
                </div>
                <h4 className="text-md font-black text-[var(--text-main)]">Target Garment / Attire</h4>
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)]">Custom Lay Flat</span>
            </div>

            {/* Garment presets */}
            <div className="grid grid-cols-4 gap-3">
              {GARMENT_PRESETS.map((garment) => (
                <button
                  key={garment.id}
                  onClick={() => { 
                    setGarmentPhoto(garment.fullUrl); 
                    setGarmentType(garment.category);
                    setGeneratedResult(null); 
                  }}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                    garmentPhoto === garment.fullUrl
                      ? 'border-blue-600 scale-[1.03] shadow-md'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={garment.thumbnail} alt={garment.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 px-1 line-clamp-1 font-bold text-[7px] text-white tracking-widest uppercase">
                    {garment.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Upload Option for custom flat-lay clothing */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleGarmentPhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 text-[var(--text-main)] font-black text-xs transition-all">
                <Shirt className="w-4 h-4" />
                Upload Custom Garment Photo (Flat-Lay)
              </button>
            </div>

            {/* Specifications Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Garment Category</label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  className="w-full font-bold text-xs bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="upper-body">Torso / Upper Wear</option>
                  <option value="lower-body">Pants / Lower Wear</option>
                  <option value="full-body">Full-Body (Dress/Saree)</option>
                  <option value="accessory">Accessory / Frame</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Workspace Mode</label>
                <div className="w-full font-bold text-xs bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-3 py-2.5 flex items-center text-[var(--text-main)]">
                  {garmentPhoto ? "Clothing Active" : "No Garment Loaded"}
                </div>
              </div>
            </div>

            {/* Magic Background Cutout Filter interface */}
            {garmentPhoto && (
              <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    Magic Background Eraser
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isBgRemovalActive} 
                      onChange={(e) => setIsBgRemovalActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {isBgRemovalActive && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-[var(--text-muted)]">
                      <span>Cutout Threshold / Tolerance</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{bgThreshold}</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      value={bgThreshold}
                      onChange={(e) => setBgThreshold(parseInt(e.target.value))}
                      className="w-full accent-blue-600 h-1 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 font-medium leading-normal">
                      Intelligently filters out light/white background squares from custom and preset flat-lays.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: Style Preferences & Run */}
          {activeTab === 'ai' && (
            <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <span className="font-black text-sm">3</span>
                  </div>
                  <h4 className="text-md font-black text-[var(--text-main)]">AI Style Configuration</h4>
                </div>
              </div>

              {/* Style Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Style environment preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setStylePreset(preset.id)}
                      className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col justify-center gap-1 ${
                        stylePreset === preset.id
                          ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Custom Instructions text box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Secondary styling prompt overrides (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. adjust sleeve lengths, change background to a beach, add a premium necklace..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* BIG BLUE TRIGGER ACTION BUTTON */}
              <button
                onClick={generateTryOn}
                disabled={isGenerating || !userPhoto}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Try-On...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Compute AI Virtual Try-On
                  </>
                )}
              </button>
            </div>
          )}

          {/* Interactive canvas control triggers inside left bar for fit tuning */}
          {activeTab === 'canvas' && (
            <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <span className="font-black text-sm">3</span>
                  </div>
                  <h4 className="text-md font-black text-[var(--text-main)]">Canvas Fitting Controls</h4>
                </div>
                <button 
                  onClick={resetCanvasProperties}
                  className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Layout
                </button>
              </div>

              {/* Sliders for manual sizing and alignment */}
              <div className="space-y-4">
                {/* Scale Multiplier */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[var(--text-main)]">Size Scaling</span>
                    <span className="font-black text-blue-600">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Rotation angle */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[var(--text-main)]">Rotation</span>
                    <span className="font-black text-blue-600">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Layer Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[var(--text-main)]">Garment Opacity (Alpha)</span>
                    <span className="font-black text-blue-600">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Image Filters Brightness */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Brightness</span>
                      <span className="text-blue-600">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Contrast</span>
                      <span className="text-blue-600">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Utility Flipper */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFlipped(prev => !prev)}
                  className={`flex-1 py-3 border-2 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isFlipped 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-500/10'
                      : 'border-slate-100 dark:border-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  Flip Garment
                </button>

                <button
                  onClick={saveManualCanvasComposite}
                  disabled={!userPhoto || !garmentPhoto}
                  className="flex-1 bg-slate-900 dark:bg-blue-600 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Composite
                </button>
              </div>

              {/* AI Seamless Stitch Button for Canvas */}
              <div className="pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 mb-4 text-center">
                  <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed">
                    Satisfied with the composition arrangement? Trigger Gemini AI Stitch to auto-blend fabric seams and adapt lighting structures photorealistically!
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab('ai'); generateTryOn(); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Seamless Blending Stitch
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: WORKSPACE VIEWS AND PREVIEWS (width: 7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Visual Arena Card */}
          <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-[40px] p-6 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h4 className="font-black text-lg text-[var(--text-main)]">
                {activeTab === 'ai' ? "AI Virtual Atelier Screen" : "Dressing Studio Workspace"}
              </h4>
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Workspace Active
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-3xl flex items-start gap-3 border border-red-100 dark:border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black">AI Stitch Model Interruption</p>
                  <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* DISPLAY ATELIER ARENA: AI GENERATIVE TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                
                {/* Generation Loading Stage */}
                {isGenerating ? (
                  <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-900 border border-white/5 flex flex-col items-center justify-center p-12 text-center text-white relative">
                    {/* Glowing pulse rings */}
                    <div className="absolute w-56 h-56 bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />
                    
                    <div className="space-y-6 max-w-sm z-10">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 relative">
                        <Loader2 />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-black text-lg tracking-tight uppercase">Weaving Fabric Layers</h5>
                        <p className="text-xs text-slate-400 font-medium italic min-h-[36px]" key={generationStep}>
                          &ldquo;{loadingSteps[generationStep]}&rdquo;
                        </p>
                      </div>

                      {/* Loading Bar progress indicators */}
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-[3500ms]"
                          style={{ width: `${Math.min(100, ((generationStep + 1) / loadingSteps.length) * 100)}%` }}
                        />
                      </div>
                      
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Please wait. Processing multithread images takes up to 10s...
                      </p>
                    </div>
                  </div>
                ) : generatedResult ? (
                  /* AI Results Stitched Showcase */
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="relative aspect-square rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5">
                      <img 
                        src={generatedResult} 
                        alt="AI Stitched Try-On Results" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase shadow-md">
                        {isUsingLocalFallback ? "Instant Composite" : "AI Merged"}
                      </div>
                    </div>

                    {isUsingLocalFallback && (
                      <div className="p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[24px] space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                              Instant Canvas Blend Active
                            </h5>
                            <p className="text-xs font-medium text-amber-700 dark:text-slate-350 leading-relaxed">
                              Since your Gemini API key is not configured in Settings, we've instantly styled your attire onto the model preset using our secure, zero-latency canvas-blend engine!
                            </p>
                          </div>
                        </div>
                        <div className="pl-9 space-y-1.5 text-[11px] text-amber-700 dark:text-slate-300 font-semibold leading-relaxed">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[9px]">1</span>
                            <span>Get your free Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900">Google AI Studio</a>.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[9px]">2</span>
                            <span>Click the <strong>Settings &gt; Secrets</strong> button in the left sidebar top bar, and save it as <code>GEMINI_API_KEY</code>.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 space-y-1 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Original Model Base</p>
                        <p className="text-xs font-bold text-[var(--text-main)] truncate">Captured/Preset Reference Image</p>
                      </div>

                      <div className={`p-4 rounded-2xl border space-y-1 text-center ${
                        isUsingLocalFallback 
                          ? 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-500/5 border-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        <p className="text-[10px] font-black uppercase tracking-wider">
                          {isUsingLocalFallback ? "Instant Layer Blend" : "AI Sew Contour"}
                        </p>
                        <p className="text-xs font-bold truncate">
                          {isUsingLocalFallback ? "Local Browser composite" : "100% Seamless Canvas Stitch"}
                        </p>
                      </div>
                    </div>

                    {/* Download & Reset controls */}
                    <div className="flex gap-4">
                      <a 
                        href={generatedResult} 
                        download="ai-virtual-tryon-result.png"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                      >
                        <Download className="w-5 h-5" />
                        Download Merged Fit Photo
                      </a>
                      <button
                        onClick={() => setGeneratedResult(null)}
                        className="px-6 border border-slate-200 hover:border-slate-300 dark:border-white/10 text-[var(--text-main)] font-black text-sm rounded-2xl transition-all"
                      >
                        Reset Result
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Empty State / Static comparison cards */
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Left Block: Model Image */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Original Stance</label>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 dark:bg-slate-900 border-white/5 flex items-center justify-center">
                          {userPhoto ? (
                            <img src={userPhoto} alt="Model Original" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-400 text-center">
                              <User className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                              <p className="text-xs">No Stance Image</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Garment Image */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Attire Contour</label>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 dark:bg-slate-900 border-white/5 flex items-center justify-center">
                          {garmentPhoto ? (
                            <img src={garmentPhoto} alt="Selected Clothing" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-400 text-center">
                              <Shirt className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                              <p className="text-xs">No Garment Image</p>
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 bg-black/60 rounded-full px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                            {garmentType}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Centered Guide message */}
                    <div className="p-4 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-[var(--text-main)]">AI Integration Checklist & Instructions</p>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                          Click the <strong>&ldquo;Compute AI Virtual Try-On&rdquo;</strong> action. The system will dispatch both imagery files server-side to fuse them using advanced multimodal neural editing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DISPLAY ATELIER ARENA: INTERACTIVE MANUAL CANVAS TAB */}
            {activeTab === 'canvas' && (
              <div className="space-y-6">
                
                {/* Pointer drag container */}
                <div 
                  ref={containerRef}
                  className="relative w-full aspect-square bg-slate-900 dark:bg-slate-950 rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 select-none touch-none cursor-grab active:cursor-grabbing"
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleInteractionStart(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                  onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleInteractionMove(e.clientX - rect.left, e.clientY - rect.top);
                  }}
                  onMouseUp={handleInteractionEnd}
                  onMouseLeave={handleInteractionEnd}

                  onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    handleInteractionStart(touch.clientX - rect.left, touch.clientY - rect.top);
                  }}
                  onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    handleInteractionMove(touch.clientX - rect.left, touch.clientY - rect.top);
                  }}
                  onTouchEnd={handleInteractionEnd}
                >
                  
                  {/* Layer 1: Background User Portrait */}
                  {userPhoto && (
                    <img 
                      src={userPhoto} 
                      alt="User Portrait Base Layer" 
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Layer 2: Garment Overlay (Interactive Sprite Layer) */}
                  {garmentPhoto && (
                    <div
                      className="absolute z-10 select-none cursor-grab"
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: '200px',
                        height: '200px',
                        transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                        transformOrigin: 'center center',
                        opacity: opacity,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                    >
                      {/* Outline Border visual selector guide when dragging */}
                      <div className={`w-full h-full p-0.5 rounded-lg border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-transparent'}`}>
                        <img 
                          src={processedGarmentPhoto || garmentPhoto} 
                          alt="Garment Overlay Sprite Layer" 
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Manual Calibration Controls HUD Watermark overlay */}
                  <div className="absolute top-4 left-4 bg-black/60 rounded-full px-3 py-1.5 text-[8px] font-black text-slate-100 uppercase tracking-widest pointer-events-none">
                    Dressing Arena Canvas
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-2 text-[9px] text-slate-300 font-bold leading-relaxed max-w-xs pointer-events-none border border-white/5">
                    💡 Drag to reposition. Adjust scale, rotation and parameters inside sidebar sliders!
                  </div>
                </div>

                {/* Direct quick offset nudge keyboard buttons */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between gap-6">
                  <span className="text-xs font-black text-[var(--text-main)]">Dressing micro-nudges:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPosition(prev => ({ ...prev, y: prev.y - 10 }))}
                      className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border font-black text-sm hover:border-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => setPosition(prev => ({ ...prev, y: prev.y + 10 }))}
                      className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border font-black text-sm hover:border-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => setPosition(prev => ({ ...prev, x: prev.x - 10 }))}
                      className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border font-black text-sm hover:border-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => setPosition(prev => ({ ...prev, x: prev.x + 10 }))}
                      className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border font-black text-sm hover:border-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                      ▶
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Catalog styling hint card */}
          <div className="bg-[var(--card-bg)] border border-slate-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Shirt className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-black text-sm text-[var(--text-main)]">Optimal Flat-Lays Advice</h5>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                For best results on custom garments uploads, use high-resolution flat clothing photos with isolated backgrounds, high-contrast, or simple light layouts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple inline spinning loader svg component to replace dependencies
const Loader2 = () => (
  <svg 
    className="animate-spin h-8 w-8 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
