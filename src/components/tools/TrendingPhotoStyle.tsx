import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  User, 
  Users, 
  Zap, 
  TrendingUp, 
  Image as ImageIcon, 
  Loader2, 
  Focus, 
  Sun, 
  Moon,
  ChevronRight,
  RefreshCw,
  Heart,
  Copy,
  Download,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StyleTrend {
  id: string;
  category: 'Male' | 'Female' | 'Cinematic' | 'Portrait' | 'Aesthetic' | 'Traditional' | 'Street' | 'Candid';
  title: string;
  description: string;
  poseTip: string;
  lightingTip: string;
  colors: string[];
  imageKeywords: string;
}

const CONSTANT_TRENDS: StyleTrend[] = [
  {
    id: 'cinmatic_neon',
    category: 'Cinematic',
    title: 'Cyberpunk Neon Rain',
    description: 'Immersive low-light portraiture with cyber-futuristic neon reflections in a rainy street environment.',
    poseTip: 'Lean against a shop glass container showing wet drops, gaze sideways slightly down.',
    lightingTip: 'Use contrasting backlights of pink and cyan color gels. Capture during sunset gold-hour or night.',
    colors: ['#FF007F', '#00FFFF', '#0B0B1E'],
    imageKeywords: 'cyberpunk model in wet street reflection'
  },
  {
    id: 'aesthetic_vintage',
    category: 'Aesthetic',
    title: '90s Cassette Nostalgia',
    description: 'A warm, grainy lifestyle shot mimicking film chemistry from early 90s vintage film layouts.',
    poseTip: 'Sit cross-legged on a carpet, holding retro headphones, laughing or looking candid.',
    lightingTip: 'Golden afternoon window lights diffused with lace lace-curtains for soft ambient textures.',
    colors: ['#D2B48C', '#E6C280', '#5B4F37'],
    imageKeywords: 'vintage warm interior film photography model'
  },
  {
    id: 'street_brutalist',
    category: 'Street',
    title: 'Brutalist Structural Concrete',
    description: 'High-contrast street fashion featuring raw brutalist architecture and clean visual outlines.',
    poseTip: 'Stride confidently forward, captured from a low heroic perspective to enhance length.',
    lightingTip: 'Harsh, direct noon shadows that create strong diagonal architectural patterns.',
    colors: ['#8C8C8C', '#2C2C2C', '#F3F4F6'],
    imageKeywords: 'street fashion model architectural minimalist concrete'
  },
  {
    id: 'male_tech_techwear',
    category: 'Male',
    title: 'Urban Ninja Techwear',
    description: 'Modern functional streetwear featuring matte black apparel, straps, and high-tech utility accents.',
    poseTip: 'Low-crouching pose looking ready for motion, with industrial backgrounds.',
    lightingTip: 'Overcast skies providing high-fidelity soft light, retaining maximum clothing material detail.',
    colors: ['#0A0A0A', '#1D242B', '#7A8B99'],
    imageKeywords: 'cyberpunk techwear masculine model industrial'
  },
  {
    id: 'female_cottage_sun',
    category: 'Female',
    title: 'Cottagecore Meadows',
    description: 'Ethical summer wear and floral patterns captured in an endless soft green countryside prairie.',
    poseTip: 'Twill around gently while holding a basket of fresh daisies or sunhat.',
    lightingTip: 'Backlit golden hour sunlight to create a glowing halo or rim-light effect around the hair.',
    colors: ['#DCE7C5', '#FFFDD0', '#C2B280'],
    imageKeywords: 'cottagecore dress lady in sunny high flower grass'
  },
  {
    id: 'portrait_fine_art',
    category: 'Portrait',
    title: 'Chiaroscuro Masterpiece',
    description: 'Classical oil painting look featuring deep high-contrast shadows and delicate facial highlighting.',
    poseTip: 'Slightly three-quarters head turn with neutral elegant expression looking at the light source.',
    lightingTip: 'Single key-light set at a 45-degree angle (Rembrandt lighting setup). Use a black background.',
    colors: ['#3E2723', '#D7CCC8', '#1A0C08'],
    imageKeywords: 'classical Rembrandt fine art studio portrait side profile'
  },
  {
    id: 'trad_royal_zardozi',
    category: 'Traditional',
    title: 'Royal Zardozi Legacy',
    description: 'Stunning traditional cultural festive wear highlighted by golden metallic embroidery.',
    poseTip: 'Gracefully adjusting a velvet dupatta or showcasing hand jewelry while looking down demurely.',
    lightingTip: 'Warm glowing luxury interior lights to showcase metallic embroidery and velvet texture highlights.',
    colors: ['#800020', '#D4AF37', '#2E1A47'],
    imageKeywords: 'traditional festive elegant cultural dress royal gold portrait'
  },
  {
    id: 'candid_motion_blur',
    category: 'Candid',
    title: 'Kinetic Street Rhythm',
    description: 'Active urban motion blur style reflecting busy metropolitan life on walkways and metro systems.',
    poseTip: 'Standing perfectly still while surrounded by blurred crowds rushing past in long-exposure.',
    lightingTip: 'Natural ambient fluorescent subway lighting mixed with evening neon streams.',
    colors: ['#4B5563', '#1F2937', '#EF4444'],
    imageKeywords: 'long exposure city crowd kinetic motion blur person'
  }
];

export const TrendingPhotoStyle = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Male' | 'Female' | 'Cinematic' | 'Aesthetic' | 'Street' | 'Portrait' | 'Traditional' | 'Candid'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTrends = CONSTANT_TRENDS.filter(t => 
    activeCategory === 'All' || t.category === activeCategory
  );

  const copyToClipboard = (trend: StyleTrend) => {
    const text = `Trend: ${trend.title}\nvibe: ${trend.description}\nPose Suggestion: ${trend.poseTip}\nLighting Protocol: ${trend.lightingTip}`;
    navigator.clipboard.writeText(text);
    setCopiedId(trend.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32" id="photo-vibe-suite">
       
       {/* Brand Header */}
       <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-250">
             <Camera size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">VOGUE & STYLE <span className="text-amber-500">TRENDS</span></h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">100% Offline Posing & Creative Direction Guide</p>
           </div>
         </div>
       </div>

       {/* Category Select Filters */}
       <div className="flex flex-wrap gap-2 px-1">
          {(['All', 'Male', 'Female', 'Cinematic', 'Aesthetic', 'Street', 'Portrait', 'Traditional', 'Candid'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border ${activeCategory === cat ? 'bg-slate-900 border-slate-900 text-white dark:bg-amber-500 dark:border-amber-500' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800'}`}
            >
              {cat}
            </button>
          ))}
       </div>

       {/* Trends Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTrends.map(trend => (
            <div 
              key={trend.id}
              className="bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-810 rounded-3xl shadow-sm flex flex-col justify-between gap-6 relative group border border-slate-100 dark:border-slate-800"
            >
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-950/25 rounded-md text-[9px] font-black uppercase tracking-wider">
                       {trend.category}
                     </span>
                     
                     <div className="flex gap-1.5">
                       {trend.colors.map(col => (
                         <span 
                           key={col} 
                           className="w-3.5 h-3.5 rounded-full border border-white" 
                           style={{ backgroundColor: col }} 
                           title={col}
                         />
                       ))}
                     </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                    {trend.title}
                  </h3>

                  <p className="text-sm text-slate-505 dark:text-slate-400 font-medium leading-relaxed">
                    {trend.description}
                  </p>

                  <div className="border-t border-slate-50 dark:border-white/5 pt-4 space-y-2">
                     <p className="text-xs text-slate-700 dark:text-slate-300">
                       <strong>Pose Direction: </strong> {trend.poseTip}
                     </p>
                     <p className="text-xs text-slate-755 dark:text-slate-300">
                       <strong>Lighting Protocol: </strong> {trend.lightingTip}
                     </p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Keywords: {trend.imageKeywords}
                  </span>
                  <button
                    onClick={() => copyToClipboard(trend)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-amber-600 rounded-xl cursor-pointer transition-all active:scale-95 border"
                  >
                     {copiedId === trend.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
               </div>
            </div>
          ))}
       </div>

    </div>
  );
};
