import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  RotateCw, 
  Maximize2, 
  Upload, 
  Download, 
  Undo, 
  Check, 
  Eye, 
  Info, 
  Shirt, 
  Layers, 
  Type, 
  Palette, 
  HelpCircle, 
  RefreshCw, 
  ShoppingBag, 
  Cpu, 
  Flame, 
  Crown, 
  Smile, 
  MapPin, 
  Coffee, 
  Dumbbell, 
  Code2, 
  Music, 
  Heart, 
  Globe, 
  Trees, 
  Zap, 
  AlertTriangle,
  FileText,
  Bookmark,
  ChevronRight,
  ChevronDown,
  Percent,
  TrendingUp,
  Sliders,
  Scale,
  Copy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions ---
interface DesignLayer {
  id: string;
  type: 'text' | 'graphic' | 'upload' | 'logo';
  content: string; // text value, or Lucide Icon name, or image URL
  x: number; // percentage from left margin of print area (0 to 100)
  y: number; // percentage from top margin of print area (0 to 100)
  scale: number; // multiplier, e.g., 1.0
  rotation: number; // degree, e.g., 0
  color: string; // hex color for text/graphics
  fontFamily?: string;
  fontSize?: number;
  letterSpacing?: number; // active text track
  fontWeight?: string;
  italic?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  opacity?: number;
}

interface SloganIdea {
  slogan: string;
  vietText?: string;
  explanation: string;
  stylePreset: {
    fontFamily: string;
    fontWeight: string;
    color: string;
    letterSpacing: number;
  };
}

const FABRIC_COLORS = [
  { name: 'Cream Ivory', value: '#F4F2EE', textDark: true },
  { name: 'Pitch Obsidian', value: '#151719', textDark: false },
  { name: 'Heather Charcoal', value: '#374151', textDark: false },
  { name: 'Burgundy Crimson', value: '#6B1D2F', textDark: false },
  { name: 'Evergreen Forest', value: '#224229', textDark: false },
  { name: 'Mustard Sunset', value: '#E29724', textDark: true },
  { name: 'Royal Tide', value: '#1E3A8A', textDark: false },
  { name: 'Teal Lagoon', value: '#0D9488', textDark: false },
  { name: 'Coral Rose', value: '#E11D48', textDark: false },
  { name: 'Soft Lilac', value: '#DDD6FE', textDark: true },
];

const FONTS = [
  { name: 'Bold Impact', value: 'Impact, Haettenschweiler, sans-serif' },
  { name: 'Vintage Georgia', value: 'Georgia, serif' },
  { name: 'Modern Tech Mono', value: '"JetBrains Mono", SFMono-Regular, Courier, monospace' },
  { name: 'Minimalist Inter', value: '"Inter", sans-serif' },
  { name: 'Display Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Elegant Serif Header', value: '"Playfair Display", Times, serif' },
];

// Map string keys to Lucide SVG Icons to support rendering library graphics dynamically on shirt
const DECAL_ICONS: Record<string, React.ComponentType<any>> = {
  Flame,
  Crown,
  Smile,
  MapPin,
  Coffee,
  Dumbbell,
  Code2,
  Music,
  Heart,
  Globe,
  Trees,
  Zap,
  Sparkles,
  Shirt,
  Cpu
};

// Customizable high-fidelity vector logos to satisfy the brand logo intent
const PRESET_LOGOS: Record<string, (color: string) => React.ReactNode> = {
  'Tech Varsity': (color) => (
    <svg viewBox="0 0 100 100" className="w-[64px] h-[64px] mx-auto opacity-95" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 15 L 80 15 L 80 50 Q 80 80 50 93 Q 20 80 20 50 Z" />
      <text x="50" y="45" textAnchor="middle" fill={color} fontSize="20" fontWeight="900" fontFamily='"Space Grotesk", sans-serif'>BD</text>
      <text x="50" y="65" textAnchor="middle" fill={color} fontSize="9.5" fontWeight="bold" fontFamily='"JetBrains Mono", monospace'>DEV LAB</text>
    </svg>
  ),
  'Retro Emblem': (color) => (
    <svg viewBox="0 0 100 100" className="w-[64px] h-[64px] mx-auto opacity-95" fill="none" stroke={color} strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" strokeDasharray="3,3" />
      <circle cx="50" cy="50" r="36" />
      <polygon points="50,22 54,35 68,35 58,42 61,54 50,47 39,54 42,42 32,35 46,35" fill={color} />
      <text x="50" y="78" textAnchor="middle" fill={color} fontSize="8.5" fontWeight="bold" fontFamily='"Space Grotesk", sans-serif'>PREMIUM MFG</text>
    </svg>
  ),
  'Rickshaw Vibe': (color) => (
    <svg viewBox="0 0 100 100" className="w-[64px] h-[64px] mx-auto opacity-95" fill="none" stroke={color} strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="68" r="11" />
      <circle cx="70" cy="68" r="11" />
      <path d="M 30 68 L 42 45 L 70 68 M 42 45 L 62 45 L 70 68" />
      <path d="M 62 45 L 65 32 L 75 32" strokeWidth="2" />
      <path d="M 22 35 C 32 15, 58 15, 68 35" strokeWidth="1.5" strokeDasharray="2,2" />
      <text x="50" y="93" textAnchor="middle" fill={color} fontSize="10" fontWeight="900" fontFamily='"Space Grotesk", sans-serif'>DHAKA</text>
    </svg>
  ),
  'Bengal Tiger': (color) => (
    <svg viewBox="0 0 100 100" className="w-[64px] h-[64px] mx-auto opacity-95" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M 15 15 L 85 15 L 85 85 L 15 85 Z" fill="none" stroke={color} strokeWidth="3.5" />
      <path d="M 30 35 L 45 42 L 55 42 L 70 35 L 65 48 L 75 52 L 60 56 L 50 50 L 40 56 L 25 52 L 35 48 Z" />
      <path d="M 35 62 Q 50 78 65 62 L 60 72 L 50 68 L 40 72 Z" />
      <text x="50" y="81" textAnchor="middle" fill={color} fontSize="9" fontWeight="900" fontFamily='"JetBrains Mono", monospace'>ROYALS</text>
    </svg>
  ),
  'Urban Athletic': (color) => (
    <svg viewBox="0 0 100 100" className="w-[64px] h-[64px] mx-auto opacity-95" fill="none" stroke={color} strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 85,30 85,72 50,92 15,72 15,30" />
      <path d="M 25 50 L 75 50" strokeWidth="4" />
      <text x="50" y="38" textAnchor="middle" fill={color} fontSize="15" fontWeight="900" fontFamily='"Space Grotesk", sans-serif'>ATHL</text>
      <text x="50" y="73" textAnchor="middle" fill={color} fontSize="15" fontWeight="900" fontFamily='"Space Grotesk", sans-serif'>DEPT</text>
    </svg>
  )
};

export const TShirtDesignTool = () => {
  // --- Apparel State ---
  const [apparelType, setApparelType] = useState<'crewneck' | 'vneck' | 'hoodie' | 'longsleeve' | 'tank'>('crewneck');
  const [apparelColor, setApparelColor] = useState<string>('#F4F2EE');
  const [apparelView, setApparelView] = useState<'front' | 'back'>('front');
  const [fabricTexture, setFabricTexture] = useState<'cotton' | 'fleece' | 'mesh'>('cotton');
  const [fabricFit, setFabricFit] = useState<'regular' | 'slim' | 'oversized'>('oversized');
  const [fabricWeight, setFabricWeight] = useState<number>(240); // GSM
  const [printType, setPrintType] = useState<'dtg' | 'screen' | 'embroidery'>('screen');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [orderQuantity, setOrderQuantity] = useState<number>(5);

  // --- Design Multi-Layer States (Separate Front and Back to avoid element overlapping!) ---
  const [frontLayers, setFrontLayers] = useState<DesignLayer[]>([
    {
      id: 'init-text',
      type: 'text',
      content: 'CRAFTED WITH AI',
      x: 50,
      y: 45,
      scale: 1.1,
      rotation: 0,
      color: '#151719',
      fontFamily: 'Impact, Haettenschweiler, sans-serif',
      fontSize: 24,
      letterSpacing: 2,
      fontWeight: 'bold',
      opacity: 1
    },
    {
      id: 'init-graphic',
      type: 'graphic',
      content: 'Crown',
      x: 50,
      y: 28,
      scale: 1.2,
      rotation: 0,
      color: '#E29724',
      opacity: 0.95
    }
  ]);

  const [backLayers, setBackLayers] = useState<DesignLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // --- AI Co-Pilot States ---
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImgCount, setGeneratedImgCount] = useState<number>(0);
  
  const [sloganCategory, setSloganCategory] = useState<string>('Software Developer');
  const [isGeneratingSlogans, setIsGeneratingSlogans] = useState<boolean>(false);
  const [suggestedSlogans, setSuggestedSlogans] = useState<SloganIdea[]>([
    {
      slogan: 'NO BUGS, ONLY FEATURES',
      explanation: 'Funny classic statement mock for software tech communities in Dhaka.',
      stylePreset: { fontFamily: '"JetBrains Mono", CSS', fontWeight: 'bold', color: '#151719', letterSpacing: 1 }
    },
    {
      slogan: 'CAFFEINE & CODE ☕💻',
      explanation: 'A slogan celebrating late-night deployment warriors in Bangladesh.',
      stylePreset: { fontFamily: 'Impact, sans-serif', fontWeight: 'bold', color: '#6B1D2F', letterSpacing: 2 }
    }
  ]);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'apparel' | 'add-text' | 'add-artwork' | 'ai-copilot'>('apparel');
  const [textInput, setTextInput] = useState<string>('Dhaka City');
  const [textFont, setTextFont] = useState<string>('Impact, Haettenschweiler, sans-serif');
  const [textColor, setTextColor] = useState<string>('#151719');
  const [textLetterSpacing, setTextLetterSpacing] = useState<number>(1);
  const [textItalic, setTextItalic] = useState<boolean>(false);

  // --- Canvas Interaction State references ---
  const canvasRef = useRef<HTMLDivElement>(null);
  const interactionState = useRef<{
    isDragging: boolean;
    isScaling: boolean;
    isRotating: boolean;
    startX: number;
    startY: number;
    initialLayerX: number;
    initialLayerY: number;
    initialScale: number;
    initialRotation: number;
  }>({
    isDragging: false,
    isScaling: false,
    isRotating: false,
    startX: 0,
    startY: 0,
    initialLayerX: 50,
    initialLayerY: 50,
    initialScale: 1.0,
    initialRotation: 0,
  });

  // --- Modals ---
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [orderSummaryModal, setOrderSummaryModal] = useState<boolean>(false);
  const [mockOrderID, setMockOrderID] = useState<string>('');

  // Fetch current layers depending on front or back view
  const currentLayers = apparelView === 'front' ? frontLayers : backLayers;
  const setCurrentLayers = apparelView === 'front' ? setFrontLayers : setBackLayers;

  const getSelectedLayer = (): DesignLayer | undefined => {
    return currentLayers.find(layer => layer.id === selectedLayerId);
  };

  // --- Layer Mutator Functions ---
  const updateSelectedLayerProps = (updatedProps: Partial<DesignLayer>) => {
    if (!selectedLayerId) return;
    setCurrentLayers(prev => prev.map(layer => {
      if (layer.id === selectedLayerId) {
        return { ...layer, ...updatedProps };
      }
      return layer;
    }));
  };

  const handleAddTextLayer = () => {
    if (!textInput.trim()) return;
    const newLayer: DesignLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: textInput,
      x: 50,
      y: 40 + (currentLayers.length * 4) % 30, // cascade offset slightly
      scale: 1,
      rotation: 0,
      color: textColor,
      fontFamily: textFont,
      fontSize: 22,
      letterSpacing: textLetterSpacing,
      fontWeight: 'bold',
      italic: textItalic,
      opacity: 1
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAddGraphicLayer = (iconName: string) => {
    const newLayer: DesignLayer = {
      id: `graphic-${Date.now()}`,
      type: 'graphic',
      content: iconName,
      x: 50,
      y: 40 + (currentLayers.length * 4) % 30,
      scale: 1.1,
      rotation: 0,
      color: clothingIsDark() ? '#F4F2EE' : '#151719',
      opacity: 1
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAddLogoLayer = (logoName: string) => {
    const newLayer: DesignLayer = {
      id: `logo-${Date.now()}`,
      type: 'logo',
      content: logoName,
      x: 50,
      y: 45,
      scale: 1.2,
      rotation: 0,
      color: clothingIsDark() ? '#F4F2EE' : '#151719',
      opacity: 1
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleDuplicateLayer = (layer: DesignLayer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newLayer: DesignLayer = {
      ...layer,
      id: `${layer.type}-dup-${Date.now()}`,
      x: Math.min(92, layer.x + 6),
      y: Math.min(92, layer.y + 6)
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentLayers(prev => prev.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleLayerOrderMove = (direction: 'front' | 'back') => {
    if (!selectedLayerId) return;
    const index = currentLayers.findIndex(l => l.id === selectedLayerId);
    if (index === -1) return;
    
    const element = currentLayers[index];
    const newLayers = currentLayers.filter(l => l.id !== selectedLayerId);
    
    if (direction === 'front') {
      // Bring to front (last in rendering array)
      setCurrentLayers([...newLayers, element]);
    } else {
      // Send to back (first in rendering array)
      setCurrentLayers([element, ...newLayers]);
    }
  };

  // --- Drag, Rotate and Scale Handling via standard Mouse/Touch Event capture on Print Canvas ---
  const handlePrintAreaMouseDown = (e: React.MouseEvent) => {
    // If clicking raw print canvas area but not a layer, unselect
    if (e.target === e.currentTarget) {
      setSelectedLayerId(null);
    }
  };

  const startLayerInteraction = (
    e: React.MouseEvent | React.TouchEvent, 
    layerId: string, 
    mode: 'drag' | 'scale' | 'rotate'
  ) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
    
    const layer = currentLayers.find(l => l.id === layerId);
    if (!layer || !canvasRef.current) return;

    // Normalize touch or mouse position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    interactionState.current = {
      isDragging: mode === 'drag',
      isScaling: mode === 'scale',
      isRotating: mode === 'rotate',
      startX: clientX,
      startY: clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialScale: layer.scale,
      initialRotation: layer.rotation
    };

    // Bind event listeners globally so drag stays responsive when drifting outside bounds
    if ('touches' in e) {
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });
      window.addEventListener('touchend', stopGlobalInteraction);
    } else {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', stopGlobalInteraction);
    }
  };

  const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
    if (!selectedLayerId || !canvasRef.current) return;
    const layer = currentLayers.find(l => l.id === selectedLayerId);
    if (!layer) return;

    // Prevent default scrolling on mobile when actively dragging components inside the canvas
    if (e.cancelable) e.preventDefault();

    const state = interactionState.current;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - state.startX;
    const deltaY = clientY - state.startY;

    const canvasBounds = canvasRef.current.getBoundingClientRect();

    if (canvasBounds.width === 0 || canvasBounds.height === 0) return;

    if (state.isDragging) {
      // Convert pixel movement into relative grid percentage
      const deltaPercentX = (deltaX / canvasBounds.width) * 100;
      const deltaPercentY = (deltaY / canvasBounds.height) * 100;
      
      const newX = Math.round(Math.max(0, Math.min(100, state.initialLayerX + deltaPercentX)));
      const newY = Math.round(Math.max(0, Math.min(100, state.initialLayerY + deltaPercentY)));
      
      updateSelectedLayerProps({ x: newX, y: newY });
    } else if (state.isScaling) {
      // Measure distance delta from starting gesture point
      const scaleFactor = 1 + deltaX / 120;
      const newScale = Number(Math.max(0.4, Math.min(3.5, state.initialScale * scaleFactor)).toFixed(2));
      updateSelectedLayerProps({ scale: newScale });
    } else if (state.isRotating) {
      // Handle simplified mouse swipe rotation
      const rotationFactor = deltaX / 2;
      const newRotation = Math.round((state.initialRotation + rotationFactor) % 360);
      updateSelectedLayerProps({ rotation: newRotation });
    }
  };

  const stopGlobalInteraction = () => {
    interactionState.current.isDragging = false;
    interactionState.current.isScaling = false;
    interactionState.current.isRotating = false;
    
    window.removeEventListener('mousemove', handleGlobalMove);
    window.removeEventListener('mouseup', stopGlobalInteraction);
    window.removeEventListener('touchmove', handleGlobalMove);
    window.removeEventListener('touchend', stopGlobalInteraction);
  };

  // Helper utility to check if the background t-shirt color is dark
  const clothingIsDark = (): boolean => {
    const selectedObj = FABRIC_COLORS.find(c => c.value === apparelColor);
    return selectedObj ? !selectedObj.textDark : false;
  };

  // --- Upload Custom decal asset ---
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          const newLayer: DesignLayer = {
            id: `upload-${Date.now()}`,
            type: 'upload',
            content: base64Url,
            x: 50,
            y: 50,
            scale: 1.0,
            rotation: 0,
            color: '#ffffff',
            opacity: 1
          };
          setCurrentLayers(prev => [...prev, newLayer]);
          setSelectedLayerId(newLayer.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- AI Model Generation (Gemini Image Call) ---
  const triggerAiDecalGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch('/api/ai-writer/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `art vector decal silhouette graphic transparent logo overlay of: ${aiPrompt}` })
      });

      if (!response.ok) throw new Error('Generation Server Busy');
      const data = await response.json();

      if (data.imageUrl) {
        // Automatically inject as a new image overlay layer onto the active canvas view
        const newLayer: DesignLayer = {
          id: `ai-decal-${Date.now()}`,
          type: 'upload', // render using base64 image block
          content: data.imageUrl,
          x: 50,
          y: 45,
          scale: 1.3,
          rotation: 0,
          color: '#ffffff',
          opacity: 1
        };
        setCurrentLayers(prev => [...prev, newLayer]);
        setSelectedLayerId(newLayer.id);
        setGeneratedImgCount(prev => prev + 1);
        setAiPrompt('');
      } else if (data.warning) {
        alert("Generative API warning: " + data.warning + ". Applying customized fallback artistic layout.");
        applyMockImageDecal();
      } else {
        throw new Error("Invalid response keys.");
      }
    } catch (err) {
      console.warn("Generating via Gemini failed, falling back to beautiful curated graphic:", err);
      applyMockImageDecal();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Fallback beautiful graphic generator in case API limits occur
  const applyMockImageDecal = () => {
    const fallbackSubjects = [
      'https://picsum.photos/seed/cybercat/300/300',
      'https://picsum.photos/seed/vintagegear/300/300',
      'https://picsum.photos/seed/futuristicbike/300/300',
      'https://picsum.photos/seed/bengalleopard/300/300'
    ];
    const chosenUrl = fallbackSubjects[Math.floor(Math.random() * fallbackSubjects.length)];
    
    const newLayer: DesignLayer = {
      id: `ai-mock-decal-${Date.now()}`,
      type: 'upload',
      content: chosenUrl,
      x: 50,
      y: 45,
      scale: 1.2,
      rotation: 0,
      color: '#ffffff',
      opacity: 0.95
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // --- AI Copilot: Slogan Ideas Generator (using secure proxy) ---
  const triggerSloganGeneration = async () => {
    setIsGeneratingSlogans(true);
    try {
      const promptText = `Generate exactly 4 funny, witty, or culturally deep t-shirt slogan ideas about the theme "${sloganCategory}" specifically targeted for university students, youth, or professionals living in Dhaka, Bangladesh (incorporate small elements of Bengali-English fusion or local inside jokes if appropriate).
      
      Return a clean, valid stringified JSON array of elements. Each element must strictly have these fields:
      - "slogan": The actual tagline text (written in uppercase English). Keep it under 26 characters.
      - "explanation": Why it is funny or trending in Bangladesh today.
      - "stylePreset": An object with: "fontFamily" (must be one of: "Bold Impact" or "Modern Tech Mono" or "Vintage Georgia"), "fontWeight" (must be "bold"), "color" (hex string like "#6B1D2F", "#1E3A8A"), "letterSpacing" (integer from 0 to 4).
      
      Return ONLY valid raw JSON array containing exactly 4 objects. Do not wrap in backticks or markdown words.`;

      const response = await fetch('/api/gemini/generate-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.5-flash',
          contents: promptText,
          config: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error("Proxy error");
      const data = await response.json();
      
      const parsedText = data.text ? data.text.trim() : '';
      const ideasObj: SloganIdea[] = JSON.parse(parsedText);
      if (Array.isArray(ideasObj) && ideasObj.length > 0) {
        setSuggestedSlogans(ideasObj);
      } else {
        throw new Error("Malformed arrays");
      }
    } catch (err) {
      console.warn("Slogan query failed. Using premium local presets.", err);
      // fallback custom list dynamically
      setSuggestedSlogans([
        {
          slogan: "DHAKA SLOW MOTION 🚍🚦",
          explanation: "Witty slogan about Dhaka's traffic jams made in high-density streetwear format.",
          stylePreset: { fontFamily: 'Impact, sans-serif', fontWeight: 'bold', color: '#151719', letterSpacing: 1 }
        },
        {
          slogan: "STACK OVERFLOW IS MY SHIELD",
          explanation: "Geek culture slogan for local developers fighting daily debugging errors.",
          stylePreset: { fontFamily: '"JetBrains Mono", CSS', fontWeight: 'bold', color: '#224229', letterSpacing: 2 }
        },
        {
          slogan: "CHILL BRO, ACCORDING TO SYSTEM",
          explanation: "Popular youth slang expressing calm state of mind in any daily hassle.",
          stylePreset: { fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#6B1D2F', letterSpacing: 1 }
        }
      ]);
    } finally {
      setIsGeneratingSlogans(false);
    }
  };

  // Apply slogan to shirt as interactive text layers
  const applySloganToShirt = (sloganText: string, style?: SloganIdea['stylePreset']) => {
    const fontValue = style ? 
      (style.fontFamily === 'Bold Impact' ? 'Impact, sans-serif' : 
       style.fontFamily === 'Modern Tech Mono' ? '"JetBrains Mono", monospace' : 'Georgia, serif') 
      : 'Impact, sans-serif';

    const newLayer: DesignLayer = {
      id: `slogan-${Date.now()}`,
      type: 'text',
      content: sloganText,
      x: 50,
      y: 40 + (currentLayers.length * 4) % 35,
      scale: 1.0,
      rotation: 0,
      color: style?.color || '#151719',
      fontFamily: fontValue,
      fontSize: 22,
      letterSpacing: style?.letterSpacing ?? 1,
      fontWeight: 'bold',
      opacity: 1
    };
    setCurrentLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // --- Calculations for specs, pricing and ordering ---
  const calculateSinglePrice = (): number => {
    let base = 390; // base BDT for basic shirt
    if (apparelType === 'hoodie') base = 850;
    if (apparelType === 'longsleeve') base = 480;
    if (apparelType === 'tank') base = 350;

    // Added weights of cotton
    if (fabricWeight > 180) base += 100; // ultra heavyweight combed cotton
    
    // Fitting and stitching
    if (fabricFit === 'oversized') base += 50;
    
    // Printing overheads per print view & layer quantities
    const totalSelectedLayers = frontLayers.length + backLayers.length;
    base += totalSelectedLayers * 80;

    if (printType === 'embroidery') base += 150; // premium thread embroidery setup costs

    return base;
  };

  const getSubtotalPrice = (): number => {
    const single = calculateSinglePrice();
    const sub = single * orderQuantity;
    
    // Volume discount
    if (orderQuantity >= 100) return Math.round(sub * 0.75); // 25% bulk corporate discount
    if (orderQuantity >= 25) return Math.round(sub * 0.82); // 18% team discount
    if (orderQuantity >= 10) return Math.round(sub * 0.90); // 10% discount
    return sub;
  };

  // --- Export configurations as JSON or dynamic sheet ---
  const handleExportSpecification = () => {
    const specData = {
      apparelInfo: {
        type: apparelType,
        color: apparelColor,
        texture: fabricTexture,
        fit: fabricFit,
        weight: `${fabricWeight} GSM`,
        printType: printType,
        selectedSize: selectedSize
      },
      frontDesignLayers: frontLayers,
      backDesignLayers: backLayers,
      production: {
        orderQuantity: orderQuantity,
        quotedPriceBdt: getSubtotalPrice(),
        quotedPerPieceBdt: Math.round(getSubtotalPrice() / orderQuantity)
      },
      exportedAt: new Date().toISOString(),
      manufacturingVerified: true
    };

    const blob = new Blob([JSON.stringify(specData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mirazul_Tools_TShirt_Spec_${apparelType}_${selectedSize}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Placement validation order
  const handlePlaceOrder = () => {
    const orderId = `BD-TSHIRT-${Math.floor(100000 + Math.random() * 900000)}`;
    setMockOrderID(orderId);
    setOrderSummaryModal(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 px-4 md:px-0" id="tshirt-studio-root">
      
      {/* Title & Brand Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-600 rounded-3xl text-white shadow-xl shadow-violet-500/20 shrink-0">
              <Shirt size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">AI T-Shirt Design Studio Pro</h1>
                <span className="px-2.5 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-black tracking-wider uppercase">
                  Interactive Builder + AI Décals
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Custom Premium Apparel Creator with Real-time 2D Canvas & Gemini Copywriting Assistant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setShowSizeChart(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-black uppercase tracking-wider border border-slate-100 dark:border-slate-800/80 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Info size={14} />
              Size Guide Chart
            </button>
            <button
              onClick={handleExportSpecification}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-black uppercase tracking-wider border border-slate-100 dark:border-slate-800/80 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Download size={14} />
              Export Spec Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 5 COLS - Interactive SVG T-Shirt Canvas & View switcher */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative">
            
            {/* View and Shading Toggle */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 dark:border-slate-850">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Eye size={12} /> Live Preview Screen
              </span>
              
              {/* Front / Back Toggle Buttons */}
              <div className="bg-slate-100 dark:bg-slate-850 p-1 rounded-xl flex">
                <button
                  type="button"
                  onClick={() => { setApparelView('front'); setSelectedLayerId(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    apparelView === 'front' 
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => { setApparelView('back'); setSelectedLayerId(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    apparelView === 'back' 
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Back View
                </button>
              </div>
            </div>

            {/* Custom Interactive Canvas Frame containing the massive visual SVG */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-850 overflow-hidden border border-slate-100 dark:border-slate-800/80 flex items-center justify-center p-4">
              
              {/* Overlay Grid lines for precision editing */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.12] pointer-events-none"></div>

              {/* Dynamic SVG Drawing representing Front and Back profiles of the t-shirt */}
              <div className="w-full max-w-[340px] h-full relative transition-transform duration-500">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-xl transition-all duration-300"
                  style={{ filter: `drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.15))` }}
                >
                  {/* Subtle shadows behind the shirt body */}
                  <path
                    d="M10,25 C15,15 85,15 90,25 C88,40 85,55 83,85 C65,86 35,86 17,85 C15,55 12,40 10,25 Z"
                    fill="black"
                    opacity="0.06"
                  />

                  {/* MAIN T-SHIRT PATH SHAPE */}
                  <g>
                    {apparelType === 'tank' ? (
                      // Tank top custom SVG
                      <path
                        d="M 28 15 C 32 15, 34 22, 34 26 C 34 32, 28 36, 28 42 C 28 55, 25 72, 21 88 C 40 89, 60 89, 79 88 C 75 72, 72 55, 72 42 C 72 36, 66 32, 66 26 C 66 22, 68 15, 72 15 C 65 14, 58 17, 50 17 C 42 17, 35 14, 28 15 Z"
                        fill={apparelColor}
                        stroke="#e2e8f0"
                        strokeWidth="0.3"
                        className="transition-colors duration-300"
                      />
                    ) : apparelType === 'hoodie' ? (
                      // Hoodie outline SVG with pockets and hood drawing
                      <g>
                        <path
                          d="M 12 36 C 18 31, 26 28, 30 25 C 33 13, 40 6, 50 6 C 60 6, 67 13, 70 25 C 74 28, 82 31, 88 36 L 81 50 L 76 46 L 78 86 C 61 87, 39 87, 22 86 L 24 46 L 19 50 Z"
                          fill={apparelColor}
                          stroke="#e2e8f0"
                          strokeWidth="0.3"
                          className="transition-colors duration-300"
                        />
                        {/* Hood interior shade */}
                        <path
                          d="M 33 24 C 33 14, 40 10, 50 10 C 60 10, 67 14, 67 24 C 62 27, 38 27, 33 24 Z"
                          fill="#1e293b"
                          opacity="0.12"
                        />
                        {/* Front Kangaroo pocket */}
                        <path
                          d="M 32 82 L 40 65 L 60 65 L 68 82 Z"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="0.4"
                          opacity="0.75"
                        />
                      </g>
                    ) : apparelType === 'longsleeve' ? (
                      // Long sleeve outline shape
                      <path
                        d="M 10 75 L 14,28 C 18,24 24,20 30,18 C 36,10 64,10 70,18 C 76,20 82,24 86,28 L 90,75 L 85,76 L 80,36 L 82,86 C 63,87, 37,87, 18,86 L 20,36 L 15,76 Z"
                        fill={apparelColor}
                        stroke="#e2e8f0"
                        strokeWidth="0.3"
                        className="transition-colors duration-300"
                      />
                    ) : (
                      // Default Crewneck and V-neck shape
                      <path
                        d="M 10 32 C 16 30, 24 26, 28 22 C 32 12, 68 12, 72 22 C 76 26, 84 30, 90 32 L 83 45 L 75 41 L 77 86 C 59 87, 41 87, 23 86 L 25 41 L 17 45 Z"
                        fill={apparelColor}
                        stroke="#e2e8f0"
                        strokeWidth="0.3"
                        className="transition-colors duration-300"
                      />
                    )}

                    {/* V-neck collar overlay cutout */}
                    {apparelType === 'vneck' && (
                      <path
                        d="M 40 18 L 50 28 L 60 18 C 55 20, 45 20, 40 18 Z"
                        fill={clothingIsDark() ? '#ffffff' : '#000000'}
                        opacity="0.1"
                      />
                    )}

                    {/* Highly realistic premium fabric creases & body folds */}
                    <path
                      d="M 22 41 C 30 46, 38 48, 44 58"
                      fill="none"
                      stroke={clothingIsDark() ? '#ffffff' : '#000000'}
                      strokeWidth="0.5"
                      opacity="0.05"
                    />
                    <path
                      d="M 78 41 C 70 46, 62 48, 56 58"
                      fill="none"
                      stroke={clothingIsDark() ? '#ffffff' : '#000000'}
                      strokeWidth="0.5"
                      opacity="0.05"
                    />
                    <path
                      d="M 26 65 C 38 68, 62 68, 74 65"
                      fill="none"
                      stroke={clothingIsDark() ? '#ffffff' : '#000000'}
                      strokeWidth="0.4"
                      opacity="0.04"
                    />
                    <path
                      d="M 17 45 L 21 43 M 83 45 L 79 43"
                      stroke={clothingIsDark() ? '#ffffff' : '#000000'}
                      strokeWidth="0.3"
                      opacity="0.1"
                    />

                    {/* Seams detailing line */}
                    <path
                      d="M 23 81 C 41 82.5, 59 82.5, 77 81"
                      fill="none"
                      stroke={clothingIsDark() ? '#ffffff' : '#000000'}
                      strokeWidth="0.25"
                      opacity="0.15"
                      strokeDasharray="0.8,0.8"
                    />
                  </g>

                  {/* TEXTURE SIMULATION BLENDS */}
                  {fabricTexture === 'mesh' && (
                    // dotted athletic texture
                    <path
                      d="M 10 35 C 15 10, 85 10, 90 35 L 82 86 C 50 87, 50 87, 18 86 Z"
                      fill="url(#mesh-pattern)"
                      opacity="0.2"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  )}
                  {fabricTexture === 'fleece' && (
                    // soft grain brush texture
                    <path
                      d="M 10 35 C 15 10, 85 10, 90 35 L 82 86 C 50 87, 50 87, 18 86 Z"
                      fill="url(#fleece-pattern)"
                      opacity="0.22"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  )}

                  {/* DECORATIVE LIGHT SHADING PATTERN FOR COTTON DEPTH */}
                  <path
                    d="M 10 32 C 16 30, 24 26, 28 22 C 32 12, 68 12, 72 22"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.8"
                    opacity="0.18"
                  />
                  <path
                    d="M 75 41 L 77 86 C 59 87, 41 87, 23 86 L 25 41"
                    fill="none"
                    stroke="black"
                    strokeWidth="0.4"
                    opacity="0.08"
                  />
                  
                  {/* Define SVG patterns inside definitions */}
                  <defs>
                    <pattern id="mesh-pattern" x="0" y="0" width="3px" height="3px" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="0.5" fill="#a1a1aa" opacity="0.45" />
                    </pattern>
                    <pattern id="fleece-pattern" x="0" y="0" width="5px" height="5px" patternUnits="userSpaceOnUse">
                      <rect width="2" height="2" fill="#71717a" opacity="0.15" />
                      <rect x="2" y="2" width="1.5" height="1.5" fill="#e4e4e7" opacity="0.12" />
                    </pattern>
                  </defs>
                </svg>

                {/* --- CLIENT PRINT CANVAS OVERLAY REGION --- */}
                {/* Outlines the dashed chest frame boundary where design layers are absolutely mapped */}
                <div 
                  ref={canvasRef}
                  onMouseDown={handlePrintAreaMouseDown}
                  className={`absolute top-[28%] left-[23%] w-[54%] h-[48%] border-2 rounded-xl transition-all flex items-center justify-center pointer-events-auto ${
                    selectedLayerId 
                      ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
                      : 'border-dashed border-slate-350/40 hover:border-violet-500/25'
                  }`}
                  style={{
                    // adjust slightly for hoodies down pocket constraints or tank neck depths
                    top: apparelType === 'hoodie' ? '24%' : apparelType === 'tank' ? '30%' : '26%',
                    height: apparelType === 'hoodie' ? '38%' : '48%'
                  }}
                >
                  {/* Subtle watermarked hint when canvas is completely pristine and empty */}
                  {currentLayers.length === 0 && (
                    <div className="text-center p-3 text-slate-300 dark:text-slate-600 select-none cursor-default">
                      <Plus className="mx-auto text-slate-300/60 mb-1" size={18} />
                      <p className="text-[9px] font-black tracking-wider uppercase">Active Print Area</p>
                      <p className="text-[8px] mt-0.5 opacity-80">(Add text or artwork)</p>
                    </div>
                  )}

                  {/* Absolute positioning mapping of multiple active layers */}
                  {currentLayers.map((layer) => {
                    const isSelected = selectedLayerId === layer.id;
                    const IconComponent = layer.type === 'graphic' ? DECAL_ICONS[layer.content] : null;

                    return (
                      <div
                        key={layer.id}
                        onMouseDown={(e) => startLayerInteraction(e, layer.id, 'drag')}
                        onTouchStart={(e) => startLayerInteraction(e, layer.id, 'drag')}
                        className={`absolute select-none cursor-move transition-shadow ${
                          isSelected ? 'ring-2 ring-emerald-500 z-30' : 'hover:ring-1 hover:ring-slate-300 z-10'
                        }`}
                        style={{
                          left: `${layer.x}%`,
                          top: `${layer.y}%`,
                          transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                          opacity: layer.opacity ?? 1,
                        }}
                      >
                        {/* Selected Layer Outline details & resize anchors */}
                        {isSelected && (
                          <div className="absolute -inset-2 border border-dashed border-emerald-500 pointer-events-none rounded">
                            
                            {/* Rotation Anchor top anchor handle */}
                            <div
                              onMouseDown={(e) => startLayerInteraction(e, layer.id, 'rotate')}
                              onTouchStart={(e) => startLayerInteraction(e, layer.id, 'rotate')}
                              className="absolute -top-6 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-alias shadow-md pointer-events-auto"
                              title="Rotate element"
                            >
                              <RotateCw size={8} />
                            </div>

                            {/* Trash button top right corner */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteLayer(layer.id, e)}
                              className="absolute -top-3 -right-3 w-4.5 h-4.5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-md pointer-events-auto border-none"
                              title="Delete layer"
                            >
                              <Trash2 size={8} />
                            </button>

                            {/* Scaling Resize Anchor bottom right corner */}
                            <div
                              onMouseDown={(e) => startLayerInteraction(e, layer.id, 'scale')}
                              onTouchStart={(e) => startLayerInteraction(e, layer.id, 'scale')}
                              className="absolute -bottom-2 -right-2 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-se-resize shadow-md pointer-events-auto"
                              title="Scale size"
                            >
                              <Maximize2 size={8} />
                            </div>
                          </div>
                        )}

                        {/* Rendering layer based on element type types */}
                        {layer.type === 'text' ? (
                          <span
                            className="block whitespace-nowrap leading-none select-none select-none tracking-tight"
                            style={{
                              fontFamily: layer.fontFamily || 'sans-serif',
                              color: layer.color,
                              fontSize: `${layer.fontSize || 20}px`,
                              letterSpacing: `${layer.letterSpacing || 0}px`,
                              fontWeight: layer.fontWeight || 'normal',
                              fontStyle: layer.italic ? 'italic' : 'normal',
                              textShadow: clothingIsDark() 
                                ? '0 1px 3px rgba(255,255,255,0.08)' 
                                : '0 1px 3px rgba(0,0,0,0.15)'
                            }}
                          >
                            {layer.content}
                          </span>
                        ) : layer.type === 'graphic' && IconComponent ? (
                          <div style={{ color: layer.color }}>
                            <IconComponent size={28} style={{ display: 'block' }} />
                          </div>
                        ) : layer.type === 'logo' && PRESET_LOGOS[layer.content] ? (
                          <div style={{ color: layer.color }} className="flex justify-center items-center">
                            {PRESET_LOGOS[layer.content](layer.color)}
                          </div>
                        ) : layer.type === 'upload' ? (
                          <img
                            src={layer.content}
                            alt="Custom Decal Layer"
                            referrerPolicy="no-referrer"
                            className="max-w-[70px] max-h-[70px] object-contain block select-none pointer-events-none rounded"
                          />
                        ) : null}

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Reset view guide tag on bottom right corner representing the rotation */}
              <div className="absolute bottom-3 left-3 bg-white/70 dark:bg-slate-900/70 py-1 px-2.5 rounded-lg text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Sliders size={10} />
                Drag elements directly to position
              </div>
            </div>

            {/* Active Layer Professional Editor (Tactile D-Pad & Control properties) */}
            {selectedLayerId && getSelectedLayer() && (() => {
              const layer = getSelectedLayer()!;
              return (
                <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-900 rounded-[24px] border border-slate-150 dark:border-slate-800 space-y-4 animate-fade-in relative z-20 shadow-sm text-slate-800 dark:text-white">
                  
                  {/* Header info bar */}
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 rounded-full bg-violet-600 text-white font-black text-[9px] uppercase tracking-wider">
                        {layer.type} layer
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        Active Style Controls
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLayerId(null)}
                      className="text-[9.5px] font-black text-slate-400 hover:text-red-500 uppercase cursor-pointer"
                    >
                      Deselect
                    </button>
                  </div>

                  {/* Real-time Content Text Editor (Only if text type) */}
                  {layer.type === 'text' && (
                    <div className="space-y-1.5">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Modify Text value</span>
                      <input
                        type="text"
                        value={layer.content}
                        onChange={(e) => updateSelectedLayerProps({ content: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-800 dark:text-white dark:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        placeholder="Edit text..."
                      />
                    </div>
                  )}

                  {/* Core Properties Row: Nudge Pad VS Scaling/Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    
                    {/* LEFT COLUMN: PRECISION POSITIONING D-PAD (5 cols) */}
                    <div className="sm:col-span-12 md:col-span-5 flex flex-col items-center p-3 bg-white dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-xl">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block text-center">
                        Precision Nudge D-Pad
                      </span>
                      
                      {/* Interactive D-pad UI */}
                      <div className="grid grid-cols-3 gap-1.5 w-24 h-24 relative">
                        {/* Empty Top-Left Spacer */}
                        <div></div>
                        
                        {/* UP Button */}
                        <button
                          type="button"
                          onClick={() => updateSelectedLayerProps({ y: Math.max(0, layer.y - 1) })}
                          title="Nudge Up"
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-violet-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <ArrowUp size={14} />
                        </button>
                        
                        {/* Empty Top-Right Spacer */}
                        <div></div>
                        
                        {/* LEFT Button */}
                        <button
                          type="button"
                          onClick={() => updateSelectedLayerProps({ x: Math.max(0, layer.x - 1) })}
                          title="Nudge Left"
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-violet-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        
                        {/* CENTER Reset Button */}
                        <button
                          type="button"
                          onClick={() => updateSelectedLayerProps({ x: 50, y: 50 })}
                          title="Center Layer"
                          className="w-8 h-8 rounded-lg bg-violet-650 hover:bg-violet-600 dark:bg-violet-700 text-white flex items-center justify-center cursor-pointer font-black text-[9px] active:scale-95 transition-all"
                        >
                          MID
                        </button>
                        
                        {/* RIGHT Button */}
                        <button
                          type="button"
                          onClick={() => updateSelectedLayerProps({ x: Math.min(100, layer.x + 1) })}
                          title="Nudge Right"
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-violet-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <ArrowRight size={14} />
                        </button>
                        
                        {/* Empty Bottom-Left Spacer */}
                        <div></div>
                        
                        {/* DOWN Button */}
                        <button
                          type="button"
                          onClick={() => updateSelectedLayerProps({ y: Math.min(100, layer.y + 1) })}
                          title="Nudge Down"
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-violet-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                        >
                          <ArrowDown size={14} />
                        </button>
                        
                        {/* Empty Bottom-Right Spacer */}
                        <div></div>
                      </div>

                      <div className="text-[8.5px] font-mono mt-2 text-center text-slate-550 dark:text-slate-400">
                        X: <span className="font-bold text-slate-750 dark:text-slate-300">{layer.x}%</span> | Y: <span className="font-bold text-slate-750 dark:text-slate-300">{layer.y}%</span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: DETAILED STYLE SLIDERS / COLORS (7 cols) */}
                    <div className="sm:col-span-12 md:col-span-7 space-y-3">
                      
                      {/* Opacity slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>Layer Opacity</span>
                          <span>{Math.round((layer.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={0.10}
                          max={1.0}
                          step={0.05}
                          value={layer.opacity ?? 1}
                          onChange={(e) => updateSelectedLayerProps({ opacity: Number(e.target.value) })}
                          className="w-full accent-violet-600 h-1 cursor-pointer"
                        />
                      </div>

                      {/* Dimension Scale slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>Layer Scale</span>
                          <span>{layer.scale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.3}
                          max={3.0}
                          step={0.1}
                          value={layer.scale}
                          onChange={(e) => updateSelectedLayerProps({ scale: Number(e.target.value) })}
                          className="w-full accent-violet-600 h-1 cursor-pointer"
                        />
                      </div>

                      {/* Rotation Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>Rotation Degrees</span>
                          <span>{layer.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          step={5}
                          value={layer.rotation}
                          onChange={(e) => updateSelectedLayerProps({ rotation: Number(e.target.value) })}
                          className="w-full accent-violet-600 h-1 cursor-pointer"
                        />
                      </div>

                      {/* Quick Hex picker if text/graphic/logo */}
                      {(layer.type === 'text' || layer.type === 'graphic' || layer.type === 'logo') && (
                        <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800 pt-2 flex-wrap gap-1">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Accent Shade Color</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={layer.color}
                              onChange={(e) => updateSelectedLayerProps({ color: e.target.value })}
                              className="w-7 h-7 rounded-md cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent p-0.5"
                            />
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">{layer.color}</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Core Action buttons and layer positioning */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleLayerOrderMove('front')}
                      className="px-2.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase text-slate-600 dark:text-slate-350 cursor-pointer text-center"
                    >
                      To Front
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLayerOrderMove('back')}
                      className="px-2.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase text-slate-600 dark:text-slate-350 cursor-pointer text-center"
                    >
                      To Back
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDuplicateLayer(layer, e)}
                      className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl text-[9px] font-black uppercase cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Copy size={10} />
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteLayer(layer.id, e)}
                      className="px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-[9px] font-black uppercase cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </div>

                </div>
              );
            })()}

          </div>

          {/* Pricing Quick Spec list */}
          <div className="bg-slate-950 dark:bg-slate-900 rounded-[32px] p-6 text-white border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-[10px] font-black tracking-widest uppercase text-emerald-400 flex items-center gap-1.5">
              <ShoppingBag size={14} /> Production Quote estimates (BD Local)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Price per Unit</span>
                <p className="text-xl font-black text-emerald-400 font-mono">
                  ৳{calculateSinglePrice()}
                </p>
                <span className="text-[8px] text-slate-500 font-medium block">All customizations included</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Quoted Subtotal</span>
                <p className="text-xl font-black text-emerald-300 font-mono">
                  ৳{getSubtotalPrice()}
                </p>
                {orderQuantity >= 10 ? (
                  <span className="text-[8px] text-emerald-400 font-bold block bg-emerald-950/40 p-1 rounded inline-flex items-center gap-0.5">
                    <Percent size={8} /> Volume discount applied
                  </span>
                ) : (
                  <span className="text-[8px] text-slate-500 font-medium block">Order 10+ for batch discount</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[10px] space-y-0.5 font-semibold text-slate-400">
                <p>Fit: <span className="text-white capitalize">{fabricFit}</span> ({fabricWeight} GSM)</p>
                <p>Stitching: <span className="text-white capitalize">{printType} print</span></p>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/15 cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                Place Custom Order
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 7 COLS - Core designer workspace & AI Copilots */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main workspace navigation tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-2 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveWorkspaceTab('apparel')}
              className={`flex-1 min-w-[110px] px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeWorkspaceTab === 'apparel'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-slate-450 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              👕 Apparel Specs
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('add-text')}
              className={`flex-1 min-w-[110px] px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeWorkspaceTab === 'add-text'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              ✍ Add Text
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('add-artwork')}
              className={`flex-1 min-w-[110px] px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeWorkspaceTab === 'add-artwork'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              🎨 Clipart & Upload
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('ai-copilot')}
              className={`flex-1 min-w-[110px] px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-gradient-to-r ${
                activeWorkspaceTab === 'ai-copilot'
                  ? 'from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-slate-505 text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-violet-500/20'
              }`}
            >
              ⚡ AI Creative Copilot
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* TAB 1: Apparel specifications */}
            {activeWorkspaceTab === 'apparel' && (
              <motion.div
                key="tab-apparel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                    Apparel Spec & Textile Details
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Select basic templates, fabric weights, styling fits and stitch methods.
                  </p>
                </div>

                {/* Apparel templates row */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 text-slate-400 block">
                    1. Choose Apparel Template
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'crewneck', name: 'Crewneck Tee' },
                      { id: 'vneck', name: 'V-Neck S-Fit' },
                      { id: 'hoodie', name: 'Urban Hoodie' },
                      { id: 'longsleeve', name: 'Long Sleeve' },
                      { id: 'tank', name: 'Athletic Tank' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setApparelType(item.id as any)}
                        type="button"
                        className={`p-3 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                          apparelType === item.id 
                            ? 'bg-violet-600 border-violet-600 text-white' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-350 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textile Base Preset colors */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      2. Select Fabric Shade color
                    </span>
                    <span className="text-[10px] font-mono font-bold text-violet-600 bg-violet-50 dark:bg-violet-900/45 dark:text-violet-400 px-2 py-0.5 rounded">
                      {FABRIC_COLORS.find(c => c.value === apparelColor)?.name || 'Custom hex'} ({apparelColor})
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-50 dark:border-slate-850 pb-5">
                    {FABRIC_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setApparelColor(color.value)}
                        className={`w-10 h-10 rounded-xl relative transition-transform cursor-pointer border hover:scale-105 ${
                          apparelColor === color.value 
                            ? 'ring-4 ring-violet-500 ring-offset-2 scale-105' 
                            : 'border-slate-200/50'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {apparelColor === color.value && (
                          <Check size={16} className={`absolute inset-0 m-auto ${color.textDark ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom Picker placeholder */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-[10px] text-slate-400 font-bold">Custom:</span>
                      <input
                        type="color"
                        value={apparelColor}
                        onChange={(e) => setApparelColor(e.target.value)}
                        className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0.5 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Textile weights, GSM, types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Textile weave and blend */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      3. Material Weave texture
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cotton', name: 'Combed Cotton' },
                        { id: 'fleece', name: 'Soft Fleece' },
                        { id: 'mesh', name: 'Poly Mesh' },
                      ].map((mw) => (
                        <button
                          key={mw.id}
                          onClick={() => setFabricTexture(mw.id as any)}
                          type="button"
                          className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                            fabricTexture === mw.id 
                              ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-700 dark:border-slate-700' 
                              : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-150'
                          }`}
                        >
                          {mw.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cut Fit preset */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      4. Silhouette Fit Style
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'regular', name: 'Regular Fit' },
                        { id: 'slim', name: 'Slim Fit' },
                        { id: 'oversized', name: 'Oversized' },
                      ].map((fit) => (
                        <button
                          key={fit.id}
                          onClick={() => setFabricFit(fit.id as any)}
                          type="button"
                          className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                            fabricFit === fit.id 
                              ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-700 dark:border-slate-700' 
                              : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-150'
                          }`}
                        >
                          {fit.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Fabric Weight Slider and Printing options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-50 dark:border-slate-850">
                  
                  {/* Slider configuration */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        5. GSM Thickness
                      </span>
                      <span className="text-violet-600">{fabricWeight} GSM</span>
                    </div>
                    <input
                      type="range"
                      min={150}
                      max={280}
                      step={10}
                      value={fabricWeight}
                      onChange={(e) => setFabricWeight(Number(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-400">
                      <span>Light summer (150 GSM)</span>
                      <span>Regular (180)</span>
                      <span>Premium Heavyweight (280)</span>
                    </div>
                  </div>

                  {/* Printing/Stitch method */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      6. Print & Stitch technology
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'screen', name: 'Screen Print' },
                        { id: 'dtg', name: 'Direct-to-Gar' },
                        { id: 'embroidery', name: 'Embroidery' },
                      ].map((tech) => (
                        <button
                          key={tech.id}
                          onClick={() => setPrintType(tech.id as any)}
                          type="button"
                          className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                            printType === tech.id 
                              ? 'bg-violet-600 border-violet-600 text-white' 
                              : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-150'
                          }`}
                        >
                          {tech.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sizing Selector & Quantities counter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-50 dark:border-slate-100/10">
                  
                  {/* Sizing row selection */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">
                      7. Standard Sizing
                    </span>
                    <div className="flex gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          type="button"
                          className={`w-10 h-10 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center ${
                            selectedSize === sz 
                              ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10' 
                              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-350 border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity row adjustments */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      8. Quantity Counter
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-xl text-lg font-black text-slate-650 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 py-2 border border-slate-200 rounded-xl text-center text-sm font-black text-slate-800 dark:text-white dark:bg-slate-850"
                      />
                      <button
                        onClick={() => setOrderQuantity(prev => prev + 1)}
                        className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-xl text-lg font-black text-slate-650 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 2: Text Layer creation panel */}
            {activeWorkspaceTab === 'add-text' && (
              <motion.div
                key="tab-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                    Add Typography Elements
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Inject high-fidelity texts, slogan taglines, adjustments, and customized styles.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Write Text Overlay content
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. DHAKA RIOT, STACK OVERFLOW..."
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500 text-slate-700 dark:text-white dark:bg-slate-850"
                    />
                    <button
                      onClick={handleAddTextLayer}
                      className="px-5 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Layer
                    </button>
                  </div>
                </div>

                {/* Font selections */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Style preset options: Font Family
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {FONTS.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setTextFont(f.value)}
                        className={`p-3 border rounded-xl text-[10.5px] text-left transition-all cursor-pointer truncate ${
                          textFont === f.value 
                            ? 'bg-violet-50 dark:bg-violet-900/40 border-violet-500 text-violet-700 dark:text-violet-400 font-bold' 
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                        }`}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Text styling params inside grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  
                  {/* Slider for spacing */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-450 text-slate-400 uppercase tracking-widest">Letter Spacing</span>
                      <span>{textLetterSpacing}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={1}
                      value={textLetterSpacing}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTextLetterSpacing(val);
                        updateSelectedLayerProps({ letterSpacing: val });
                      }}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>

                  {/* Standard Text Color Picker */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Text Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTextColor(val);
                          updateSelectedLayerProps({ color: val });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border hover:scale-105"
                      />
                      <span className="text-[10px] font-mono font-bold">{textColor}</span>
                    </div>
                  </div>

                  {/* Toggle italic status */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Font Slanted Italic</span>
                    <button
                      onClick={() => {
                        const val = !textItalic;
                        setTextItalic(val);
                        updateSelectedLayerProps({ italic: val });
                      }}
                      className={`px-4 py-2 border rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        textItalic 
                          ? 'bg-violet-100 border-violet-500 text-violet-700' 
                          : 'bg-white text-slate-505 text-slate-500'
                      }`}
                    >
                      / Italic Format
                    </button>
                  </div>

                </div>

                {/* Slider controls for high accessibility coordinates editing of currently selected element */}
                {getSelectedLayer() && getSelectedLayer()?.type === 'text' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase">
                      <Sliders size={12} />
                      Precision Slider Coordinates Adjuster
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Horizontal Position (X)</span>
                          <span>{getSelectedLayer()?.x}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={getSelectedLayer()?.x || 50}
                          onChange={(e) => updateSelectedLayerProps({ x: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Vertical Position (Y)</span>
                          <span>{getSelectedLayer()?.y}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={getSelectedLayer()?.y || 50}
                          onChange={(e) => updateSelectedLayerProps({ y: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Font Size Scaling</span>
                          <span>{getSelectedLayer()?.scale}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.4}
                          max={3.0}
                          step={0.1}
                          value={getSelectedLayer()?.scale || 1.0}
                          onChange={(e) => updateSelectedLayerProps({ scale: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Rotation Degrees</span>
                          <span>{getSelectedLayer()?.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={getSelectedLayer()?.rotation || 0}
                          onChange={(e) => updateSelectedLayerProps({ rotation: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* TAB 3: Curated templates / clipart overlays & custom upload */}
            {activeWorkspaceTab === 'add-artwork' && (
              <motion.div
                key="tab-artwork"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                    Clipart Gallery & Custom Logbook Uploads
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Select a premium visual emblem or drag and drop your own PNG sticker transparency file.
                  </p>
                </div>

                {/* Pre-designed icons group */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    1. Direct Curated Clipart vectors and emojis
                  </span>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {Object.keys(DECAL_ICONS).map((iconName) => {
                      const Icon = DECAL_ICONS[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => handleAddGraphicLayer(iconName)}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all flex flex-col items-center gap-1.5 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-violet-600/20 shadow-sm"
                          title={`Add ${iconName} graphic layer`}
                        >
                          <Icon size={24} />
                          <span className="text-[8px] font-bold uppercase text-slate-450">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom upload area */}
                <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    2. Upload Custom Image Overlay (PNG with Transparency recommended)
                  </span>
                  
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="mx-auto text-slate-400 mb-2 animate-bounce" size={24} />
                    <h4 className="text-xs font-black uppercase text-slate-650 dark:text-slate-300 tracking-wider">Drag & Drop Image file here</h4>
                    <p className="text-[9.5px] text-slate-450 mt-1">Supports PNG, JPG, WEBP, or SVG files up to 5MB</p>
                  </div>
                </div>

                {/* Brand Crests & High-Fidelity Logos */}
                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-100/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1">
                      3. Premium Brand Crests & Logos
                    </span>
                    <p className="text-[9.5px] text-slate-450 uppercase tracking-wider font-semibold">
                      Click to place professional vector decals designed for varsity, athletic, and vintage apparel.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.keys(PRESET_LOGOS).map((logoName) => {
                      return (
                        <button
                          key={logoName}
                          type="button"
                          onClick={() => handleAddLogoLayer(logoName)}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-150/80 dark:border-slate-800 cursor-pointer flex flex-col items-center justify-between text-center gap-2 group transition-all hover:border-violet-600/30 shadow-sm animate-fade-in"
                          title={`Add ${logoName} Brand Logo preset`}
                        >
                          <div className="p-1 mb-1 transition-transform group-hover:scale-110 text-slate-800 dark:text-slate-100">
                            {PRESET_LOGOS[logoName]("#7c3aed")}
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight leading-none">
                            {logoName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Precision Coordinates for cliparts or custom overlays */}
                {getSelectedLayer() && (getSelectedLayer()?.type === 'graphic' || getSelectedLayer()?.type === 'upload' || getSelectedLayer()?.type === 'logo') && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase">
                      <Sliders size={12} />
                      Precision Slider Coordinates Adjuster
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Horizontal Position (X)</span>
                          <span>{getSelectedLayer()?.x}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={getSelectedLayer()?.x || 50}
                          onChange={(e) => updateSelectedLayerProps({ x: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Vertical Position (Y)</span>
                          <span>{getSelectedLayer()?.y}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={getSelectedLayer()?.y || 50}
                          onChange={(e) => updateSelectedLayerProps({ y: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Dimension Scale</span>
                          <span>{getSelectedLayer()?.scale}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.4}
                          max={3.0}
                          step={0.1}
                          value={getSelectedLayer()?.scale || 1.0}
                          onChange={(e) => updateSelectedLayerProps({ scale: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>Rotation degrees</span>
                          <span>{getSelectedLayer()?.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={getSelectedLayer()?.rotation || 0}
                          onChange={(e) => updateSelectedLayerProps({ rotation: Number(e.target.value) })}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* TAB 4: AI Intelligent Assistant - Slogan recommendations & Custom generated decals */}
            {activeWorkspaceTab === 'ai-copilot' && (
              <motion.div
                key="tab-aicopilot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* 1. Generative Artwork Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-violet-600 dark:text-violet-400 shrink-0" size={20} />
                    <div>
                      <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                        AI Image Decal Generator (Imagen Grounded)
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Describe what you want to draw. We will generate a graphic decal and apply it.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. A roaring royal Bengal tiger with cyberpunk visor glasses, retro illustration vector style"
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500 text-slate-700 dark:text-white dark:bg-slate-850"
                    />

                    <div className="flex items-center justify-between">
                      <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Info size={12} className="text-violet-500" />
                        Prompting tips: Specify vector, silhouette, or flat style
                      </div>
                      
                      <button
                        type="button"
                        onClick={triggerAiDecalGeneration}
                        disabled={isGeneratingImage || !aiPrompt.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {isGeneratingImage ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            AI is Rendering Decal...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            Generate Decal
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {generatedImgCount > 0 && (
                    <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Check size={14} />
                      AI Decal added successfully. You can drag and rotate it directly on the apparel block!
                    </div>
                  )}
                </div>

                {/* 2. Slogan Idea Copywriting Generator */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
                    <div>
                      <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider">
                        AI Slogan Copywriter Hub
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Ask Gemini to discover witty, trending slogans based on niches.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1">
                      <select
                        value={sloganCategory}
                        onChange={(e) => setSloganCategory(e.target.value)}
                        className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-white dark:bg-slate-850"
                      >
                        <option value="Software Developer">Software Developers Niche</option>
                        <option value="Dhaka City Traffic & Commuters">Dhaka Traffic & Commutes</option>
                        <option value="Gym Workout & Sports Enthusiasts">Fitness / Gym Warrior</option>
                        <option value="Biryani & Local Food Lovers">Foodie / Biryani Lovers</option>
                        <option value="Bangladeshi Cricket Tigers fan">Cricket Tigers Fan</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={triggerSloganGeneration}
                      disabled={isGeneratingSlogans}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer disabled:opacity-55 shrink-0 inline-flex items-center justify-center gap-1"
                    >
                      {isGeneratingSlogans ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          Consulting Gemini...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={12} />
                          Form Slogan List
                        </>
                      )}
                    </button>
                  </div>

                  {/* Slogans results table */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      Recommended Slogans (Click to apply layer):
                    </span>

                    <div className="grid grid-cols-1 gap-3.5">
                      {suggestedSlogans.map((idea, idx) => (
                        <div
                          key={idx}
                          role="button"
                          onClick={() => applySloganToShirt(idea.slogan, idea.stylePreset)}
                          className="p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-600/25 rounded-2xl transition-all text-left group cursor-pointer relative"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded text-[8px] font-black uppercase">
                              Idea #{idx + 1}
                            </span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline inline-flex items-center gap-1">
                              Apply <Plus size={10} />
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug">
                            "{idea.slogan}"
                          </h4>
                          <p className="text-[11px] font-medium text-slate-450 dark:text-slate-400 mt-1 lines-clamp-2">
                            {idea.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* Confetti celebration for placing visual manufacture order */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 h-4 bg-gradient-to-r from-red-500 via-emerald-500 to-indigo-500 z-50 pointer-events-none animate-bounce"
          ></motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: Size Chart pops */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 max-w-lg w-full border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white relative"
          >
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">🇧🇩 BD Cotton Size Chart Guide</h3>
            <p className="text-xs text-slate-450 mb-6">Standard measurement guides in inches for combed premium knit t-shirts.</p>
            
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl text-xs mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 font-black text-[10px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3">Size Tag</th>
                    <th className="p-3">Chest Width (Inches)</th>
                    <th className="p-3">Garment Length (Inches)</th>
                    <th className="p-3">Sleeve Length (Inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <tr key={sz} className={sz === selectedSize ? 'bg-violet-50/40 text-violet-600' : ''}>
                      <td className="p-3 font-black">{sz}</td>
                      <td className="p-3">{sz === 'S' ? '38"' : sz === 'M' ? '40"' : sz === 'L' ? '42"' : sz === 'XL' ? '44"' : '46"'}</td>
                      <td className="p-3">{sz === 'S' ? '27"' : sz === 'M' ? '28"' : sz === 'L' ? '29"' : sz === 'XL' ? '30"' : '31"'}</td>
                      <td className="p-3">8.5"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-3.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer"
            >
              Close Guide
            </button>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: Manufacturing Checkout order completed Pop */}
      {orderSummaryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 max-w-xl w-full border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-white space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <Check size={28} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider text-slate-850 dark:text-white">Spec Order Logged!</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Order ID: {mockOrderID}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-3 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-450 text-slate-400 uppercase font-black text-[9px] tracking-wider">Product Type</span>
                <span className="text-slate-800 dark:text-white capitalize">{apparelType} ({selectedSize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 text-slate-400 uppercase font-black text-[9px] tracking-wider">Fabric Weight / GSM</span>
                <span className="text-slate-800 dark:text-white capitalize">{fabricFit} fit / {fabricWeight} GSM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 text-slate-400 uppercase font-black text-[9px] tracking-wider">Order Batch quantity</span>
                <span className="text-slate-800 dark:text-white">{orderQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 text-slate-400 uppercase font-black text-[9px] tracking-wider">Stitching technology</span>
                <span className="text-slate-850 dark:text-white capitalized">{printType} stamp print</span>
              </div>
              <div className="flex justify-between pt-3.5 border-t border-slate-200 dark:border-slate-700 font-mono text-sm">
                <span className="text-slate-505 font-bold uppercase text-xs">Total payment quoted</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">৳{getSubtotalPrice()} BDT</span>
              </div>
            </div>

            <div className="space-y-3.5 text-[11px] leading-relaxed text-slate-505 bg-violet-500/5 dark:bg-violet-500/10 p-4 rounded-xl border border-violet-500/10">
              <h4 className="font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                <Info size={12} className="shrink-0" />
                Apparel Maintenance Instructions
              </h4>
              <ul className="list-disc list-inside space-y-1.5 font-medium pl-1">
                <li>Wash inside-out in cold water to protect custom printed decals.</li>
                <li>Do not iron directly over text overlays or custom AI decals.</li>
                <li>Hanger dry or tumble dry on low settings.</li>
                <li>Production delivery estimate inside Bangladesh: <span className="font-bold text-slate-700 dark:text-slate-350">3 to 5 business days</span>.</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportSpecification}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-250 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer"
              >
                Save Spec CSV
              </button>
              <button
                onClick={() => setOrderSummaryModal(false)}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-md shadow-emerald-500/15"
              >
                Got It, Thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
