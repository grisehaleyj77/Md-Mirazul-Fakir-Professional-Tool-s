import React, { useState } from 'react';
import { 
  Hash, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Local hashtag theme preset library
const HASHTAG_PRESETS: Record<string, string[]> = {
  'sunset': ['#Sunset', '#GoldenHour', '#SunsetLovers', '#Skyline', '#BeautifulSunset', '#SunsetPhotography', '#SunsetVibes', '#SkyPorn', '#SunsetChaser'],
  'beach': ['#BeachVibes', '#OceanLife', '#SandyToes', '#SeaSide', '#BeachLife', '#SummerVibes', '#SaltLife', '#VitaminSea', '#CoastalLiving'],
  'travel': ['#TravelBlogger', '#Wanderlust', '#ExploreMore', '#AdventureSeeker', '#TravelVibes', '#GlobeTrotter', '#BeautifulDestinations', '#TravelGram', '#RoamThePlanet'],
  'food': ['#FoodPorn', '#Yummy', '#InstaFood', '#Delicious', '#FoodieStyle', '#Gourmet', '#FoodBlogger', '#HealthyEating', '#NomNom'],
  'tech': ['#TechNews', '#CodingLife', '#SoftwareDeveloper', '#Innovation', '#Gadgets', '#TechCommunity', '#ByteSized', '#WebDesign', '#DeveloperLife'],
  'fitness': ['#FitnessMotivation', '#WorkoutMotivation', '#GymLife', '#FitFam', '#HealthyLifestyle', '#GetFit', '#ActiveLiving', '#ExerciseDaily', '#StrengthTraining'],
  'fashion': ['#FashionStyle', '#OOTD', '#InstaFashion', '#StyleInspiration', '#FashionBlogger', '#StreetWear', '#ChicVibe', '#TrendyLook', '#LookBook'],
  'nature': ['#NatureLovers', '#MotherNature', '#ScenicView', '#Wilderness', '#NaturePhotography', '#GoOutside', '#EarthPix', '#ForestWalk', '#MountainAir']
};

const PLATFORM_STARTERS: Record<string, string[]> = {
  'Instagram': ['#ExplorePage', '#Instagood', '#PhotoOfTheDay', '#TrendingNow'],
  'X / Twitter': ['#Breaking', '#Trending', '#FNS', '#Opinion'],
  'LinkedIn': ['#Networking', '#ProfessionalDevelopment', '#WorkCulture', '#CareerGrowth', '#Inspiration'],
  'Facebook': ['#Community', '#FriendsFamily', '#SupportLocal', '#ViralVideo'],
  'Threads': ['#ThreadsApp', '#ThreadsVibes', '#Conversations', '#ChitChat'],
};

export const HashtagGenerator = () => {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const PLATFORMS = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'X / Twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Threads', icon: MessageSquare, color: 'text-slate-900', bg: 'bg-slate-100' },
  ];

  const generateHashtagsLocal = () => {
    if (!input.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const cleanInput = input.toLowerCase();
      const matchedTags = new Set<string>();

      // 1. Add platform essentials
      const starters = PLATFORM_STARTERS[platform] || [];
      starters.forEach(t => matchedTags.add(t));

      // 2. Scan for predefined keyword categories
      Object.entries(HASHTAG_PRESETS).forEach(([keyword, presetTags]) => {
        if (cleanInput.includes(keyword)) {
          presetTags.forEach(t => matchedTags.add(t));
        }
      });

      // 3. Extract standard capitalized words as hashtags
      const individualWords = input
        .split(/[^a-zA-Z0-9]+/)
        .filter(w => w.length > 3)
        .slice(0, 10);
      
      individualWords.forEach(w => {
        const hashWord = `#${w.charAt(0).toUpperCase() + w.slice(1)}`;
        matchedTags.add(hashWord);
      });

      // Maintain up to 30 custom hashtags limit
      const resultList = Array.from(matchedTags).slice(0, 30);
      setHashtags(resultList);
      setLoading(false);
    }, 600);
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-10" id="hashtag-suite-root">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tight">HASHTAG CONVERTER <span className="text-blue-600">SUITE</span></h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">100% Offline Platform Tag Optimizer</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Select Platform Type</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.name}
                onClick={() => setPlatform(p.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${platform === p.name ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
              >
                <p.icon className="w-4 h-4" />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Post Topic or Description</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. A gorgeous sunset photo at the beach with travel vibes..."
              className="w-full h-32 bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-750 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-blue-500/20 resize-none placeholder:text-slate-300 dark:text-slate-100 transition-all"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-black text-slate-450 dark:text-slate-400 select-none">
               Offline Analysis Enabled
            </div>
          </div>
        </div>

        <button
          onClick={generateHashtagsLocal}
          disabled={loading || !input.trim()}
          className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:grayscale cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Parsing key phrases...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              Generate Hashtags
            </>
          )}
        </button>
      </div>

      {/* Results panel */}
      <AnimatePresence>
        {hashtags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Generated tags ({hashtags.length})</h3>
              <button
                onClick={() => copyToClipboard(hashtags.join(' '))}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-600 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedAll ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copiedAll ? 'Copied All!' : 'Copy All Tags'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {hashtags.map((tag, idx) => (
                <button
                  key={tag + idx}
                  onClick={() => copyToClipboard(tag, idx)}
                  className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 border border-transparent hover:border-blue-500/10 text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-blue-600 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{tag}</span>
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3 h-3 text-slate-300 group-hover:block" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-55 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-dashed text-[11px] text-slate-405 dark:text-slate-400 leading-relaxed font-semibold">
               <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
               Select alternative values or tweak the input topic words to extract additional hashtag combinations.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
