import React, { useState } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  RotateCcw, 
  Youtube, 
  Hash, 
  CheckSquare, 
  HelpCircle,
  Loader2,
  ListPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const YouTubeTagTool = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const CATEGORIES = [
    { name: 'Tech & Coding', value: 'Tech' },
    { name: 'Gaming & Esport', value: 'Gaming' },
    { name: 'Vlog & Lifestyle', value: 'Vlog' },
    { name: 'Education & HowTo', value: 'Education' },
    { name: 'Music & Ambient', value: 'Entertainment' }
  ];

  const generateTagsLocal = () => {
    if (!keyword.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const cleanInput = keyword.toLowerCase().trim();
      const tagSet = new Set<string>();

      // Primary tag
      tagSet.add(cleanInput);

      // Category based variations
      if (category === 'Tech') {
        const TechAdditions = [
          'coding', 'developer tutorial', 'software coding',
          'program tutorial', 'step-by-step programming', 'tech guide',
          'programming for beginners', 'tips and tricks code', 'web development',
          'full course coding', 'modern programmer setup', 'learn engineering'
        ];
        TechAdditions.forEach(t => tagSet.add(`${cleanInput} ${t}`));
      } else if (category === 'Gaming') {
        const GameAdditions = [
          'gameplay video', 'let\'s play walkthrough', 'funny moments gameplay',
          'speedrun record', 'ultimate guide gamer', 'tips and tricks gameplay',
          'honest review game', 'hilarious reaction gameplay', 'multiplayer challenge'
        ];
        GameAdditions.forEach(t => tagSet.add(`${cleanInput} ${t}`));
      } else if (category === 'Vlog') {
        const VlogAdditions = [
          'daily vlog lifestyle', 'vlogger daily route', 'lifestyle inspiration',
          'aesthetic travel vlog', 'day in the life study', 'spend the day with me',
          'realistic routine vlog', 'weekly recap lifestyle', 'creative photo ideas'
        ];
        VlogAdditions.forEach(t => tagSet.add(`${cleanInput} ${t}`));
      } else if (category === 'Education') {
        const EduAdditions = [
          'explained simply', 'complete course tutorial', 'school homework help',
          'educational learning video', 'explained in 10 minutes', 'how-to tutorial',
          'basic concept guide', 'educational lecture walkthrough', 'improve your skill'
        ];
        EduAdditions.forEach(t => tagSet.add(`${cleanInput} ${t}`));
      } else {
        const EntAdditions = [
          'funny entertainment review', 'parody reactions funny', 'top 10 compilation',
          'music stream background', 'chill sound loop', 'entertaining commentary',
          'cultural discussion review', 'reaction review video', 'interesting facts video'
        ];
        EntAdditions.forEach(t => tagSet.add(`${cleanInput} ${t}`));
      }

      // Add longtail phrase variants
      tagSet.add(`how to do ${cleanInput}`);
      tagSet.add(`best ${cleanInput} ideas`);
      tagSet.add(`${cleanInput} compilation`);
      tagSet.add(`${cleanInput} beginners guide`);

      // Convert to Array & set limit to 25 tags
      setTags(Array.from(tagSet).slice(0, 25));
      setLoading(false);
    }, 500);
  };

  const copyAsCommaStream = () => {
    const streamText = tags.join(', ');
    navigator.clipboard.writeText(streamText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copySingleTag = (tag: string, idx: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32" id="youtube-tags-root">
       
       {/* Brand Header */}
       <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
             <Tag size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">VIDEO TAGS <span className="text-red-500">GENERATOR</span></h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">100% Offline YouTube Console Ready Tags</p>
           </div>
         </div>
       </div>

       {/* Form details block */}
       <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Tag Keyword</label>
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Photoshop design, learning math, travel hacks"
                  className="w-full bg-slate-50 dark:bg-slate-850 p-4 border rounded-xl font-bold outline-none text-sm text-slate-800 dark:text-slate-100"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Niche</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 p-4 border rounded-xl font-bold outline-none text-sm text-slate-605 dark:text-slate-350"
                >
                   {CATEGORIES.map(cat => (
                     <option key={cat.value} value={cat.value}>{cat.name}</option>
                   ))}
                </select>
             </div>

          </div>

          <button 
            onClick={generateTagsLocal}
            disabled={loading || !keyword.trim()}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-200 dark:shadow-none cursor-pointer disabled:opacity-50 animate-pulse"
          >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <ListPlus size={16} />}
             {loading ? 'Synthesizing tags list...' : 'Assemble Optimization Tags'}
          </button>
       </div>

       {/* Results mapping */}
       <AnimatePresence>
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-820 p-8 shadow-sm space-y-6 animate-fade-in"
            >
               <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">CONSOLE READY TAGS ({tags.length})</h3>
                  <button
                    onClick={copyAsCommaStream}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                     {copiedAll ? <Check className="w-4 h-4 text-emerald-500 inline mr-1" /> : <Copy className="w-4 h-4 inline mr-1" />}
                     {copiedAll ? 'Copied Comma List!' : 'Copy Tags (Comma-Separated)'}
                  </button>
               </div>

               <div className="flex flex-wrap gap-2.5">
                  {tags.map((tag, idx) => (
                    <button
                      key={tag + idx}
                      onClick={() => copySingleTag(tag, idx)}
                      className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-755 border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                       <span>{tag}</span>
                       {copiedIndex === idx ? <Check size={12} className="text-green-500" /> : <Copy size={10} className="text-slate-305" />}
                    </button>
                  ))}
               </div>

               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl flex gap-3 text-[10px] text-slate-500 font-semibold border italic leading-relaxed">
                  <HelpCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  YouTube tags remain excellent for signaling longtail search intent in your YouTube studio console. Copy the Comma-Separated output stream above and paste it directly into the "Tags" textbox in YouTube Creator Studio.
               </div>
            </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
};
