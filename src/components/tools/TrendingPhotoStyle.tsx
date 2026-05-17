import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';
import { ai, GEMINI_API_KEY } from '../../lib/gemini';

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

export const TrendingPhotoStyle = () => {
  const [trends, setTrends] = useState<StyleTrend[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Male' | 'Female' | 'Cinematic' | 'Aesthetic' | 'Street'>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const fetchTrends = async () => {
    if (!GEMINI_API_KEY) return;
    setLoading(true);
    setError(null);

    try {
      const prompt = `Analyze global social media trends (Instagram, Pinterest, TikTok, Vogue) for photography, posing, and aesthetic fashion for the current month.
      Generate 30 extremely diverse and unique photography trends/styles for these categories: 
      Male, Female, Cinematic, Aesthetic, Street, Portrait, Traditional, Candid.
      
      Return strictly a JSON array of objects with this structure (minimum 30 distinct items):
      {
        "id": "unique_random_string",
        "category": "Male" | "Female" | "Cinematic" | "Aesthetic" | "Street" | "Portrait" | "Traditional" | "Candid",
        "title": "Creative Trend Name",
        "description": "Engaging description of the vibe",
        "poseTip": "Detailed posing instructions",
        "lightingTip": "Specific lighting or gear tip",
        "colors": ["#hex1", "#hex2"],
        "imageKeywords": "One highly specific photography keyword (e.g. 'cyberpunk', 'renaissance', 'minimalist', 'brutalist')"
      }
      Just the JSON array. No explanatory text. No markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const text = response.text || '[]';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleaned);
      setTrends(data);
    } catch (err) {
      console.error(err);
      setError('Connection to viral labs failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (trend: StyleTrend) => {
    const text = `Trend: ${trend.title}\nCategory: ${trend.category}\nAdvice: ${trend.description}\nPose: ${trend.poseTip}\nLighting: ${trend.lightingTip}`;
    navigator.clipboard.writeText(text);
    setCopiedId(trend.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename.toLowerCase().replace(/\s+/g, '_')}_style.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const getFallbackImage = (category: string) => {
    const fallbacks: Record<string, string> = {
      'Male': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&h=1000',
      'Female': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800&h=1000',
      'Cinematic': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800&h=1000',
      'Aesthetic': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&h=1000',
      'Street': 'https://images.unsplash.com/photo-1520975954732-35dd2036c8ad?auto=format&fit=crop&q=80&w=800&h=1000'
    };
    return fallbacks[category] || fallbacks['Cinematic'];
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const filteredTrends = activeCategory === 'All' 
    ? trends 
    : trends.filter(t => t.category === activeCategory || (activeCategory === 'Aesthetic' && (t.category === 'Aesthetic' || t.category === 'Candid' || t.category === 'Portrait')));

  return (
    <div className="space-y-10 pb-32">
      {/* Header */}
      <div className="bg-slate-900 p-12 rounded-[64px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-rose-500/20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-5">
                 <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[28px] flex items-center justify-center shadow-3xl shadow-indigo-500/40 rotate-6 hover:rotate-0 transition-transform duration-500">
                    <Camera className="w-8 h-8" />
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Style <span className="text-indigo-500">Studio</span></h2>
              </div>
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400 pl-1 italic">Quantum Trend Scouting Matrix v3.0</p>
           </div>
           
           <button 
            onClick={fetchTrends}
            disabled={loading}
            className="group relative flex items-center gap-5 bg-white/5 hover:bg-white/10 px-12 py-6 rounded-[32px] border border-white/10 transition-all active:scale-95 shadow-2xl overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-400" /> : <RefreshCw className="w-6 h-6 text-indigo-400 group-hover:rotate-180 transition-transform duration-700" />}
              <div className="text-left relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-500">Synchronize Feed</p>
                <p className="text-[13px] font-black uppercase tracking-widest">Get New Styles</p>
              </div>
           </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-3 bg-white/50 dark:bg-white/5 p-4 rounded-[40px] border border-white/20 dark:border-white/5 shadow-xl sticky top-4 z-50 backdrop-blur-2xl">
         {(['All', 'Male', 'Female', 'Cinematic', 'Aesthetic', 'Street'] as const).map(cat => (
           <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 scale-105' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/10'
            }`}
           >
             {cat}
           </button>
         ))}
      </div>

      {error ? (
        <div className="h-96 flex flex-col items-center justify-center bg-rose-500/5 rounded-[64px] border border-rose-500/10 space-y-8 p-10 text-center">
           <Zap className="w-16 h-16 text-rose-500 animate-bounce" />
           <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-rose-600">Sync Failure Detected</h3>
              <p className="text-sm font-bold text-rose-500/70">{error}</p>
              <button 
                onClick={fetchTrends}
                className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20"
              >
                Retry Matrix Connection
              </button>
           </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {[1,2,3,4,5,6,7,8,9].map(i => (
             <div key={i} className="h-[550px] bg-slate-100 dark:bg-white/5 rounded-[64px] animate-pulse border border-slate-200 dark:border-white/5" />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           <AnimatePresence mode="popLayout">
              {filteredTrends.map((trend, idx) => (
                <motion.div 
                  key={trend.id + idx}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: idx * 0.03, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[64px] overflow-hidden flex flex-col shadow-2xl hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-700 group hover:-translate-y-4"
                >
                   {/* Visual Section */}
                   <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-20 group-hover:via-slate-950/40 transition-all duration-700" />
                      
                      <img 
                        src={imageErrors[trend.id] 
                          ? getFallbackImage(trend.category) 
                          : `https://loremflickr.com/800/1000/${trend.category.toLowerCase()},${encodeURIComponent(trend.imageKeywords)}?lock=${idx + Math.floor(Math.random() * 1000)}`
                        }
                        alt={trend.title}
                        onError={() => setImageErrors(prev => ({ ...prev, [trend.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms] ease-out opacity-85 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute top-10 left-10 z-30 flex items-center gap-4">
                         <span className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-xl border border-white/20 ${
                            trend.category === 'Male' ? 'bg-indigo-600/80' : 
                            trend.category === 'Female' ? 'bg-rose-600/80' : 
                            trend.category === 'Street' ? 'bg-orange-600/80' :
                            trend.category === 'Cinematic' ? 'bg-amber-600/80' :
                            'bg-indigo-600/80'
                         }`}>
                           {trend.category}
                         </span>
                      </div>
                      
                      <button 
                        onClick={() => downloadImage(
                          imageErrors[trend.id] ? getFallbackImage(trend.category) : `https://loremflickr.com/800/1000/${trend.category.toLowerCase()},${encodeURIComponent(trend.imageKeywords)}?lock=${idx}`,
                          trend.title
                        )}
                        className="absolute top-10 right-10 z-30 w-16 h-16 bg-white/10 hover:bg-indigo-600 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center text-white transition-all transform scale-0 group-hover:scale-100 hover:rotate-12 duration-500 shadow-2xl"
                        title="Download Style Guide"
                      >
                         <Download className="w-6 h-6" />
                      </button>

                      <div className="absolute bottom-12 left-12 right-12 z-30 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                         <div className="flex gap-2">
                            {trend.colors.map((c, i) => (
                              <div key={i} className="w-4 h-4 rounded-full border-2 border-white/30 shadow-2xl transition-transform hover:scale-150" style={{ backgroundColor: c }} />
                            ))}
                         </div>
                         <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-2xl group-hover:text-indigo-400 transition-colors">{trend.title}</h3>
                         <p className="text-[12px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed line-clamp-2">{trend.description}</p>
                      </div>
                   </div>

                   {/* Data Section */}
                   <div className="p-12 space-y-12 flex-1 flex flex-col justify-between">
                      <div className="space-y-8">
                         <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-[22px] bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                               <Focus className="w-6 h-6" />
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">Pose Matrix</p>
                               <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{trend.poseTip}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-[22px] bg-amber-50 dark:bg-white/5 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                               {trend.lightingTip.toLowerCase().includes('night') ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors">Aether & Light</p>
                               <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{trend.lightingTip}</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-5">
                         <button 
                          onClick={() => copyText(trend)}
                          className={`flex-1 h-16 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 group-hover:translate-x-1 ${
                            copiedId === trend.id 
                              ? 'bg-green-600 text-white shadow-xl shadow-green-500/20' 
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/10'
                          }`}
                         >
                            {copiedId === trend.id ? <Check className="w-5 h-5 animate-pulse" /> : <Copy className="w-5 h-5" />}
                            {copiedId === trend.id ? 'Saved!' : 'Get Notes'}
                         </button>
                         <button className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-110 active:scale-95 transition-all">
                            <ChevronRight className="w-7 h-7" />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      )}

      {/* Extreme Footer */}
      <div className="bg-slate-900 mx-4 mt-20 p-20 rounded-[80px] text-white flex flex-col xl:flex-row items-center justify-between gap-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-rose-500 via-amber-500 to-indigo-600 bg-[length:200%_100%] animate-gradient" />
         
         <div className="flex items-center gap-10 relative z-10 text-center xl:text-left flex-col xl:flex-row">
            <div className="w-28 h-28 bg-indigo-600/10 rounded-[44px] flex items-center justify-center border border-indigo-500/20 group-hover:rotate-[360deg] transition-all duration-[2000ms]">
               <TrendingUp className="w-14 h-14 text-indigo-500" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter italic leading-none">The Matrix <span className="text-indigo-500">Live</span></h4>
               <p className="text-[12px] font-black opacity-50 uppercase tracking-[0.4em] leading-relaxed max-w-xl mx-auto xl:mx-0">
                  Global pattern recognition engine scanning 50,000+ fashion signals every hour. 
                  Always current. Always viral.
               </p>
            </div>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 w-full xl:w-auto">
            <div className="text-center xl:text-right px-8 border-r-0 xl:border-r border-white/10 hidden md:block">
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Model Precision</p>
               <p className="text-sm font-black uppercase text-indigo-400 italic">99.2% Trend Accuracy</p>
            </div>
            <button 
              onClick={fetchTrends}
              disabled={loading}
              className="w-full sm:w-auto h-20 px-16 bg-white text-slate-900 hover:bg-slate-100 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-3xl hover:-translate-y-2 active:scale-95 disabled:opacity-50"
            >
               Force Update Pulse
            </button>
            <div className="flex items-center gap-4">
               {[1,2,3].map(i => (
                 <div key={i} className="w-3 h-3 bg-indigo-600/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

