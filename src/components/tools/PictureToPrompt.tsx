import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Trash2, 
  Palette, 
  Settings2, 
  BookOpen, 
  ArrowRight, 
  Sliders,
  Maximize2,
  FileText,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AestheticAnalysis {
  subject: string;
  lighting: string;
  colors: string[];
  composition: string;
  styleAndMedium: string;
}

interface PromptVariant {
  style: string;
  prompt: string;
  description: string;
}

interface ImageDeconstructResponse {
  masterPrompt: string;
  negativePrompt: string;
  aestheticAnalysis: AestheticAnalysis;
  keyTags: string[];
  variants: PromptVariant[];
  designSummary: string;
}

// Predefined Demo Samples (Each has immediate, realistic, high-quality prompt data to ensure instant high-fidelity interaction)
const DEMO_SAMPLES = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Alleyway',
    genre: 'Retro-Futurism',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    data: {
      masterPrompt: "A saturated cyberpunk alleyway in Neo-Tokyo, bustling night scene, dense hanging neon signs reflecting in rain puddles on cracked concrete street, towering monolithic skyscrapers in background, vapor rising from grid vents, cinematic lighting, dramatic sidelight, teal and magenta violet color palette, highly detailed, octane render, 8k resolution, shot on 35mm lens, f/1.8",
      negativePrompt: "sunny, daytime, clear sky, text, logos, watercolor, cartoon, sketch, high distortion, low quality, noise, grain, flat lighting",
      aestheticAnalysis: {
        subject: "Narrow rain-slicked alleyway surrounded by cyberpunk architecture and glowing vertical kanji neon shop panels.",
        lighting: "High-contrast dynamic neon lighting, dramatic reflections in wet floor puddles, volumetric atmospheric neon haze.",
        colors: ["#ff007f", "#00ffff", "#0b0c10", "#1f2833", "#45a29e", "#66fcf1"],
        composition: "Low angle wide-angle perspective, leading lines of the alleyway drawing the eye to the background monoliths, rule of thirds styling.",
        styleAndMedium: "Cinematic digital photorealism with hyper-vibrant color grading, styled after vintage blade-runner photography."
      },
      keyTags: ["cyberpunk", "neon", "neo-tokyo", "rain reflections", "retro-futuristic", "night photography", "octane-render", "volumetric"],
      variants: [
        {
          style: "Minimalist Ink",
          prompt: "Sleek noir ink sketch of a narrow wet alley with a single glowing pink neon bar indicator, absolute darkness, high-contrast chiaroscuro, minimal lines.",
          description: "Strips away the density to focus purely on shadow contrast and minimalist glowing accentuation."
        },
        {
          style: "Retro Anime (1980s)",
          prompt: "A hand-painted animation cell of a Tokyo alley, saturated watercolors, cel-shaded neon glow, nostalgic grain, aesthetic anime styling, celluloide texture.",
          description: "Evokes the warm, cozy hand-drawn digital-cel aesthetic of classic vintage sci-fi anime movies."
        },
        {
          style: "Vaporwave / Surreal",
          prompt: "A dreamlike marble alley covered in pastel purple water reflections, giant holographic dolphin floating among glowing Greek column terminals.",
          description: "Leans into retro-surrealism, trading cyberpunk grime for clean vaporwave dreamscapes."
        }
      ],
      designSummary: "A beautiful exploration of high-contrast nocturnal cityscapes, marrying classical moody urban structure with modern synthesized colored light streams."
    }
  },
  {
    id: 'cozy-woodland',
    name: 'Misty Forest Cabin',
    genre: 'Nature & Solitude',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80',
    data: {
      masterPrompt: "A cozy A-frame wooden cabin nestled in a deep redwood pine forest, soft misty morning fog floating through tall branches, warm golden light glowing from windows, smoke curling from brick chimney, soft moss-covered ground, ethereal ray tracing sunbeams filtering down, cinematic atmospheric depth, photorealistic nature shot, f/2.8 aperture, 50mm natural lighting",
      negativePrompt: "cyberpunk, neon, concrete streets, modern cars, sharp digital edges, plastic, over-saturated colors, flat look, watermarks, letters, low fidelity",
      aestheticAnalysis: {
        subject: "Rustic woodland A-frame cottage surrounded by monumental forest timbers and delicate mountain flora.",
        lighting: "Soft ambient morning twilight, warming golden light from interior glass, delicate volumetric sunrays diffusing through mist.",
        colors: ["#2d4a22", "#415d31", "#8b5a2b", "#dcd0c0", "#f0e6d2", "#1e301d"],
        composition: "Centered symmetric framing, high vertical trees flanking the cabin to emphasize dwarfing natural majesty.",
        styleAndMedium: "Atmospheric landscape photography, rich natural organic color-grading, medium format look."
      },
      keyTags: ["forest cabin", "misty morning", "cozy", "organic cottage", "sunbeams", "landscape photography", "soft-focus", "woodland solitude"],
      variants: [
        {
          style: "Impressionist Oil Painting",
          prompt: "Thick impasto oil painting of woodland cottage, loose glowing textured brushstrokes, warm orange lights blending into deep evergreen forest oil hues.",
          description: "Transforms the photographic detail into a cozy, paint-textured masterpiece focusing on color weight."
        },
        {
          style: "Cozy Ghibli Sketch",
          prompt: "Watercolor and colored pencil concept sketch of deep forest cabin, magical forest spirits, soft green pastel foliage, heartwarming hand-drawn fantasy poster.",
          description: "Creates an warm, whimsical, hand-painted illustrative cartoon design with gentle organic outlines."
        },
        {
          style: "Ethereal Architectural Render",
          prompt: "Sleek ultra-modern dark timber cottage in a dense pine forest, floor-to-ceiling glass windows revealing luxurious design, soft rain mist, architectural digest award.",
          description: "Upgrades the rustic cabin into a modern high-end architectural masterpiece design."
        }
      ],
      designSummary: "A serene nature study of solitude and safety, contrasting the cold, overwhelming wilderness forest with the comforting, inviting inner cabin warmth."
    }
  },
  {
    id: 'gourmet-dessert',
    name: 'Artisanal Patisserie',
    genre: 'Still Life Gastronomy',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    data: {
      masterPrompt: "A decadent gourmet chocolate berry torte cake served on a custom rustic ceramic plate, dusted with micro powdered sugar, fresh raspberries, dripping rich dark glaze, modern culinary presentation, elegant moody restaurant background, dramatic side key lighting, macro lens close-up details, shallow depth of field, award-winning food styling photograph",
      negativePrompt: "cheap container, blurry cake, overexposed light, flat color, cheap decorations, plastic fork, messy tabletop, text, cartoon sketch, low res",
      aestheticAnalysis: {
        subject: "Polished multi-layer dessert pastry topped with ripe fresh fruit and chocolate drip details.",
        lighting: "Directional side softbox lighting, highlights glistening on glaze, soft shadow fade.",
        colors: ["#2a0812", "#4a121a", "#7a1c31", "#ffebcd", "#808080", "#ff3b3b"],
        composition: "Macro rule of thirds, extreme close-up showing cake crumb textures, blurred background dinner tables.",
        styleAndMedium: "Editorial food/gastronomy close-up photograph, rich luxury dark-room atmosphere, rich contrast."
      },
      keyTags: ["gourmet torte", "food styling", "macro gastronomy", "editorial food plate", "dark glaze", "rustic ceramic", "chocolate glaze", "fine dining"],
      variants: [
        {
          style: "Vintage Editorial Magazine",
          prompt: "Flash photograph of chocolate cake, 1970s cookbook styling, high-contrast film grain, warm nostalgic dining room tables, retro plate decoration.",
          description: "Evokes the warm flash-burned look of vintage lifestyle and culinary booklets."
        },
        {
          style: "Abstract Vector Pop Art",
          prompt: "Flat color vector graphic of dripping cake slices, bold shapes, solid burgundy background, minimalist layout, pop art aesthetic poster.",
          description: "Strips the realistic crumbs away for high-end graphic design, fashion layout and logos."
        },
        {
          style: "Stylized Whimsical Claymation",
          prompt: "Toy claymation model of a delicious strawberry torte, stop motion cute style, tiny plastic culinary forks, colorful playful modeling clay studio setup.",
          description: "Re-imagines the dessert as a playful, tactile stop-motion clay model."
        }
      ],
      designSummary: "A masterclass in texture capture, relying on precise light placement to emphasize organic wet, matte, and crystalline powdered sugar details."
    }
  }
];

export function PictureToPrompt() {
  // Input parameters
  const [selectedEngine, setSelectedEngine] = useState<string>('Midjourney v6');
  const [selectedStyle, setSelectedStyle] = useState<string>('Preserve Original Style');
  const [selectedDetail, setSelectedDetail] = useState<string>('Hyper-detailed Prompt');

  // App Running States
  const [image, setImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [response, setResponse] = useState<ImageDeconstructResponse | null>(null);

  // Copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // In-app Customizer/Refiner tools
  const [sandboxPrompt, setSandboxPrompt] = useState<string>('');
  const [addedModifiers, setAddedModifiers] = useState<string[]>([]);

  // Drag-and-drop file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger base64 encoding from file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg("Selected file is too large (max 15MB file size limit for base64 APIs).");
        return;
      }
      setImageMime(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out metadata if desired, but we need raw base64 data for the API
        const base64Data = result.split(',')[1];
        setImage(result); // With data url for preview
        setResponse(null); // Clear previous results
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectDemoSample = (demo: typeof DEMO_SAMPLES[0]) => {
    setImage(demo.imageUrl);
    setImageMime('image/jpeg');
    setLoading(true);
    setStatusLogs([]);
    setErrorMsg(null);
    setResponse(null);

    const logs = [
      "Accessing local precompiled texture cache...",
      "Analyzing image metadata structural matrices...",
      "Matching spatial light arrays to neural weights...",
      "Deconvolving visual vectors with style guides...",
      "Finalizing art synthesis parameters... SUCCESS!"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setStatusLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setLoading(false);
          setResponse(demo.data);
          setSandboxPrompt(demo.data.masterPrompt);
          setAddedModifiers([]);
        }
      }, (index + 1) * 350);
    });
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg("Selected file is too large (max 15MB limit).");
        return;
      }
      setImageMime(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResponse(null);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const triggerAnalysis = async () => {
    if (!image) return;

    setLoading(true);
    setErrorMsg(null);
    setResponse(null);
    setStatusLogs(["Compressing image vectors...", "Connecting to Gemini 3.5 Multimodal API..."]);

    try {
      // If the image is a remote URL (like Unsplash demo assets), fetch it first to convert to base64 or pass as is.
      let base64Image = '';
      if (image.startsWith('data:')) {
        base64Image = image.split(',')[1];
      } else {
        // Fetch from external Unsplash image url 
        setStatusLogs(prev => [...prev, "Downloading sample template to base64 bytes..."]);
        const urlRes = await fetch(image);
        const blob = await urlRes.blob();
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
        reader.readAsDataURL(blob);
        const dataUrl = await promise;
        base64Image = dataUrl.split(',')[1];
      }

      setStatusLogs(prev => [...prev, "Performing primary Deep Semantic Scene parsing..."]);
      setTimeout(() => {
        setStatusLogs(prev => [...prev, "Parsing lighting variables and key specular maps..."]);
      }, 800);
      setTimeout(() => {
        setStatusLogs(prev => [...prev, "Generating prompt syntax structures..."]);
      }, 1600);

      const res = await fetch('/api/picture-to-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          mimeType: imageMime,
          engine: selectedEngine,
          style: selectedStyle,
          detailLevel: selectedDetail
        })
      });

      if (!res.ok) {
        const errObj = await res.json().catch(() => ({}));
        throw new Error(errObj.error || "Deconstruction server error.");
      }

      const data = await res.json() as ImageDeconstructResponse;
      
      setStatusLogs(prev => [...prev, "Compiling color palette spectrum index...", "Complete!"]);
      setResponse(data);
      setSandboxPrompt(data.masterPrompt);
      setAddedModifiers([]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected network freeze occurred while reading files. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResponse(null);
    setErrorMsg(null);
    setStatusLogs([]);
    setSandboxPrompt('');
    setAddedModifiers([]);
  };

  // Modifier tags for the Prompt Sandbox
  const SANDBOX_MODIFIERS = [
    { label: "Volumetric Mist", text: "shrouded in volumetric fog, glowing light rays" },
    { label: "Unreal Engine 5", text: "nanite texture mapping, unreal engine 5 render, extremely detailed" },
    { label: "Cinematic anamorphic", text: "anamorphic lens flare, movie camera scale, organic bokeh" },
    { label: "Sunlight Rays", text: "dramatic light shafts filtering through window panels, warm gold tones" },
    { label: "Moody Dark Synth", text: "gloomy retro cyberpunk colors, low exposure neon ambiance" },
    { label: "Vintage Polaroid", text: "1990s color slide, faded warm tint, nostalgia polaroid scan, slightly aged" },
    { label: "Extreme Macro Close-up", text: "macro details, shallow range of focus, high-fidelity textural microstructures" }
  ];

  const toggleSandboxModifier = (mod: typeof SANDBOX_MODIFIERS[0]) => {
    if (addedModifiers.includes(mod.label)) {
      setAddedModifiers(prev => prev.filter(m => m !== mod.label));
      // Remove text
      setSandboxPrompt(prev => prev.replace(`, ${mod.text}`, ''));
    } else {
      setAddedModifiers(prev => [...prev, mod.label]);
      setSandboxPrompt(prev => `${prev}, ${mod.text}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10" id="picture-to-prompt-root">
      
      {/* 1. Header Hero section */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-4 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Multi-Model AI Reverse Engineering
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">
          Picture to Text-Prompt Suite
        </h2>
        <p className="text-sm font-medium text-gray-500 max-w-2xl leading-relaxed">
          Reverse-engineer any visual creation into high-performance prompts. Unpack composition elements, color values, light parameters, and stylistic parameters for Midjourney, Stable Diffusion, and Imagen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input & Customizer Configuration Panel (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* File Uploader Container */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              Source Image Selection
            </h3>

            {image ? (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-150 shadow-inner group">
                  <img src={image} alt="Source reverse engineering preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={clearImage}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Discard Core
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-1">
                  <span className="truncate">Active image ready for parsing</span>
                  <button onClick={clearImage} className="text-red-500 hover:underline">Change image</button>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-white p-10 rounded-2xl text-center cursor-pointer transition-all space-y-4 flex flex-col items-center justify-center group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-800 uppercase tracking-wider">Drag file here or click to browse</p>
                  <p className="text-[10px] text-gray-400 font-bold">Supports PNG, JPEG, WEBP up to 15MB size limit</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}

            {/* Quick Demo Previews */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-0.5">
                Or choose a quick demo pattern (Instantly ready)
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {DEMO_SAMPLES.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => selectDemoSample(demo)}
                    className="group relative aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all outline-none"
                    title={`Test with ${demo.name}`}
                  >
                    <img 
                      src={demo.imageUrl} 
                      alt={demo.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end text-left">
                      <span className="text-[8px] font-black text-white truncate">{demo.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Engine Parameters Customizer Block */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              Reverse Tuning Modifiers
            </h3>

            <div className="space-y-4 text-xs font-bold text-gray-700">
              
              {/* Target Engine */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block pb-0.5">
                  Art Generator Engine Target
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Midjourney v6', 'Stable Diffusion XL', 'DALL-E 3'].map(eng => {
                    const isSel = selectedEngine === eng;
                    return (
                      <button
                        key={eng}
                        onClick={() => setSelectedEngine(eng)}
                        className={`py-2 px-1 rounded-xl text-[10px] uppercase font-black tracking-wider border transition-all ${
                          isSel ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-gray-50 border-gray-150 text-gray-500 hover:bg-gray-100/50 hover:text-gray-800'
                        }`}
                      >
                        {eng.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block pb-0.5">
                  Prompt Style Influence
                </label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-gray-50 hover:bg-gray-100/50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2.5 outline-none tracking-tight font-bold text-gray-800"
                >
                  <option value="Preserve Original Style">Original Style Preserve</option>
                  <option value="Hyper-realistic Photography">Photorealistic DSLR Photography</option>
                  <option value="Saturated Japanese Anime">90s Retro Anime Illustration</option>
                  <option value="Cinematic Mood lighting">Heavy Dramatic Sci-Fi Cinema</option>
                  <option value="Fantasy Oil Painting Canvas">Classical Textured Impasto Painting</option>
                  <option value="Minimalist Digital Line-art">Fine Line Minimal Vector Draw</option>
                </select>
              </div>

              {/* Detail Options */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block pb-0.5">
                  Syllable Density & Detail Size
                </label>
                <select 
                  value={selectedDetail}
                  onChange={(e) => setSelectedDetail(e.target.value)}
                  className="w-full bg-gray-50 hover:bg-gray-100/50 border border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2.5 outline-none tracking-tight font-bold text-gray-800"
                >
                  <option value="Minimal & Abstract">Abstract & Tiny (Under 20 Words)</option>
                  <option value="Balanced Simple">Standard Balanced (Midjourney ideal)</option>
                  <option value="Hyper-detailed Prompt">Extremely Detailed Scene (SDXL / DALL-E ideal)</option>
                </select>
              </div>

            </div>

            {/* Run Analysis Trigger Button */}
            <button
              onClick={triggerAnalysis}
              disabled={!image || loading}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${
                !image 
                  ? 'bg-gray-100 text-gray-400 border border-gray-150 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              Analyze and Extract Prompt
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[10px] font-black text-red-800 uppercase tracking-tight leading-snug">{errorMsg}</span>
              </div>
            )}

          </div>

        </div>

        {/* Right Output Dashboard Presentation Panel (7 Columns) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {loading && (
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[450px] space-y-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-l-transparent border-r-transparent animate-spin"></div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600 animate-pulse">
                  Unpacking visual spectrum...
                </p>
                <p className="text-xs text-gray-400 font-bold max-w-sm">
                  Gemini multimodal vision engines are reading structural layers, textures, layouts, and art tags.
                </p>
              </div>

              {/* Streaming state logger logs */}
              <div className="w-full max-w-sm bg-gray-50 p-4 rounded-xl text-[10px] font-mono font-bold text-gray-500 space-y-1.5 text-left border border-gray-100">
                <span className="text-[8px] uppercase tracking-wider text-gray-400 block border-b border-gray-200/50 pb-1 mb-1 font-sans">
                  System Diagnostics Core status_logs
                </span>
                {statusLogs.map((logStr, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-500 shrink-0 select-none">✔</span>
                    <span className="break-all">{logStr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !response && (
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm min-h-[450px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest leading-none">
                  Awaiting Visual Inputs
                </h3>
                <p className="text-xs text-gray-400 font-bold max-w-sm leading-relaxed">
                  Upload an image from your computer, drop a creation file directly in, or choose from our quick demo patterns on the left to extract the underlying artistic logic.
                </p>
              </div>
            </div>
          )}

          {!loading && response && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              
              {/* PRIMARY PROMPT BLOCK */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block">
                      Extracted Master Command
                    </span>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      Art prompt parameters for {selectedEngine}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(response.masterPrompt, 'master')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 transition-all outline-none ${
                      copiedText === 'master' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                    }`}
                  >
                    {copiedText === 'master' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'master' ? 'Copied' : 'Copy Prompt'}
                  </button>
                </div>

                {/* Main Prompts view box */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 text-xs font-mono font-bold leading-relaxed text-gray-800 text-left select-all relative group">
                  <span className="absolute right-3.5 top-3.5 text-[8px] bg-gray-200/50 text-gray-500 px-1.5 py-0.5 rounded uppercase select-none font-sans font-black tracking-wider border border-gray-200/50">
                    Txt Cmd
                  </span>
                  {response.masterPrompt}
                </div>

                {/* Negative Prompt */}
                <div className="space-y-2 pt-2 text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    Recommended Negative Prompt
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="grow p-3 bg-red-50/30 rounded-xl border border-red-100 text-[10px] font-mono font-bold text-red-900 leading-snug">
                      {response.negativePrompt}
                    </div>
                    <button
                      onClick={() => handleCopy(response.negativePrompt, 'negative')}
                      className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                        copiedText === 'negative'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-500'
                          : 'bg-white hover:bg-gray-50 border-gray-150 text-gray-400 hover:text-gray-900'
                      }`}
                      title="Copy Negative Prompt"
                    >
                      {copiedText === 'negative' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* PLAYGROUND: LIVE CUSTOMIZER SANDBOX MODULE */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block">
                    Live Prompt Improviser Sandbox
                  </span>
                  <h3 className="text-md font-black text-gray-950 tracking-tight">
                    Add volumetric modifiers and tweak the active prompt
                  </h3>
                  <p className="text-xs text-gray-400 font-bold font-sans">
                    Click modifiers below to inject visual parameters directly. Check the sandbox text and copy the customized result.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {SANDBOX_MODIFIERS.map((mod, mIdx) => {
                    const active = addedModifiers.includes(mod.label);
                    return (
                      <button
                        key={mIdx}
                        onClick={() => toggleSandboxModifier(mod)}
                        className={`text-[9px] uppercase font-black px-2.5 py-1.5 rounded-lg border transition-all ${
                          active 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-150 text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {active ? '✓ ' : '+ '} {mod.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-1">
                  <textarea
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    className="w-full text-xs font-mono font-bold leading-relaxed bg-gray-50/70 focus:bg-white border-2 border-gray-150 focus:border-indigo-500 rounded-2xl p-4 min-h-[120px] outline-none text-gray-800"
                    placeholder="Refined sandbox text prompt is empty..."
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 font-bold">Characters count: {sandboxPrompt.length}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSandboxPrompt(response.masterPrompt);
                          setAddedModifiers([]);
                        }}
                        className="px-3 py-2 border border-gray-150 rounded-xl text-[10px] uppercase tracking-wide font-black text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      >
                        Reset to default
                      </button>
                      <button
                        onClick={() => handleCopy(sandboxPrompt, 'sandbox')}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-black flex items-center gap-1.5 transition-all outline-none ${
                          copiedText === 'sandbox'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow'
                        }`}
                      >
                        {copiedText === 'sandbox' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedText === 'sandbox' ? 'Copied' : 'Copy customized'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* DECONSTRUCTED VISUAL ANALYZER METRICS */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block">
                  Aesthetic Deconstruction Matrix
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left text-xs text-gray-700 font-bold">
                  {/* Subject */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Core Subject Elements</span>
                    <p className="font-semibold text-gray-800 leading-normal">{response.aestheticAnalysis.subject}</p>
                  </div>

                  {/* Lighting */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Detected Lighting Dynamics</span>
                    <p className="font-semibold text-gray-800 leading-normal">{response.aestheticAnalysis.lighting}</p>
                  </div>

                  {/* Composition */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Frame Angle & Composition</span>
                    <p className="font-semibold text-gray-800 leading-normal">{response.aestheticAnalysis.composition}</p>
                  </div>

                  {/* Style and medium */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Style & Artistic Medium</span>
                    <p className="font-semibold text-gray-800 leading-normal">{response.aestheticAnalysis.styleAndMedium}</p>
                  </div>
                </div>

                {/* Color Spectrum */}
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Key Color Hues Captured</span>
                  <div className="flex gap-2">
                    {response.aestheticAnalysis.colors.map((hex, hz) => (
                      <div key={hz} className="flex-1 flex flex-col gap-1 items-center">
                        <div 
                          className="w-full aspect-[2/1] rounded-lg shadow-sm border border-gray-100 transition-transform hover:-translate-y-0.5" 
                          style={{ backgroundColor: hex }} 
                        />
                        <span className="text-[9px] font-mono text-gray-400 selection:bg-purple-200">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tag cloud */}
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Underlying Theme Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {response.keyTags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 text-[10px] tracking-wide font-black uppercase bg-gray-100/70 border border-gray-150 text-gray-600 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Design Summary */}
                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl flex items-start gap-3 text-left">
                  <BookOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 block">Artist Statement Synopsis</span>
                    <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                      {response.designSummary}
                    </p>
                  </div>
                </div>

              </div>

              {/* THREE ALTERNATIVE SYSTEM VARIANTS */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block">Alternative Artistic Facets</span>
                  <h3 className="text-md font-black text-gray-950 tracking-tight">Different stylized variants for experimental generation</h3>
                </div>

                <div className="space-y-4">
                  {response.variants.map((vOption, vIdx) => {
                    const isCopied = copiedText === `variant-${vIdx}`;
                    return (
                      <div key={vIdx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 text-left">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-white text-indigo-600 text-[9px] tracking-widest font-black uppercase border border-gray-150 rounded-lg">
                            {vOption.style}
                          </span>
                          <button
                            onClick={() => handleCopy(vOption.prompt, `variant-${vIdx}`)}
                            className={`p-2 rounded-xl border transition-all ${
                              isCopied
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-500'
                                : 'bg-white hover:bg-gray-100 border-gray-150 text-gray-400 hover:text-gray-900'
                            }`}
                            title="Copy Variant Prompt"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 font-semibold leading-normal">{vOption.description}</p>
                        <div className="p-3 bg-white rounded-xl border border-gray-150 text-[11px] font-mono font-bold leading-relaxed text-gray-800">
                          {vOption.prompt}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
