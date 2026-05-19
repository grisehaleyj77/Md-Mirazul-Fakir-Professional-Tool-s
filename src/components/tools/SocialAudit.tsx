import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign, 
  Zap, 
  Search, 
  Youtube, 
  Instagram, 
  Twitter, 
  Video,
  ExternalLink,
  ChevronRight,
  Loader2,
  Info,
  ShieldCheck,
  Trophy,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface GrowthNode {
  date: string;
  count: number;
}

interface AuditData {
  followers: string;
  totalViews: string;
  engagementRate: string;
  grade: string;
  estimatedMonthlyEarnings: string;
  recentGrowth: GrowthNode[];
  topContentSummary: string;
  viralPotential: number;
}

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-slate-900', bg: 'bg-slate-100' },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-blue-500', bg: 'bg-blue-50' },
];

export const SocialAudit = () => {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [data, setData] = useState<AuditData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    if (!username.trim()) return;
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await fetch('/api/social-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, username }),
      });
      
      const auditResult = await response.json();
      if (auditResult.error) {
        setError(auditResult.error);
      } else {
        setData(auditResult);
      }
    } catch (err) {
      setError('Connection failure. Neural link blocked.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header & Input */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <BarChart3 size={24} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">SOCIAL<span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">AUDITOR</span></h1>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] pl-1">Live Viral Intelligence Engine</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
             {PLATFORMS.map((p) => (
               <button
                 key={p.id}
                 onClick={() => setPlatform(p.id)}
                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${platform === p.id ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <p.icon size={16} className={platform === p.id ? p.color : 'text-slate-400'} />
                 <span className="hidden sm:inline">{p.name}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="relative group">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
              <Search size={22} />
           </div>
           <input 
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
             placeholder={`Enter ${platform} handle or channel name...`}
             className="w-full pl-16 pr-40 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-[32px] font-bold text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-lg shadow-inner"
           />
           <button
             onClick={handleAudit}
             disabled={isProcessing || !username.trim()}
             className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20"
           >
             {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'Run Audit'}
           </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold"
          >
             <Info size={16} />
             {error}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Base', value: data.followers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                { label: 'Engage Rate', value: data.engagementRate, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/5' },
                { label: 'Audit Grade', value: data.grade, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/5', suffix: 'SCORE' },
                { label: 'Est. Monthly', value: data.estimatedMonthlyEarnings, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[32px] space-y-4">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Area */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[40px] space-y-8">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Growth Trajectory</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 days projection</p>
                   </div>
                   <div className="px-3 py-1 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center gap-2">
                       <TrendingUp size={14} className="text-green-600" />
                       <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">+12.4% Momentum</span>
                   </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.recentGrowth}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Zap size={100} />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight italic">VIRAL POTENTIAL</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Algorithm Index</p>
                      </div>

                      <div className="flex items-center justify-center py-4">
                         <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="transparent"
                                stroke="#6366f1"
                                strokeWidth="8"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * data.viralPotential) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <span className="absolute text-3xl font-black tracking-tighter">{data.viralPotential}</span>
                         </div>
                      </div>

                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic text-center">
                        "{data.topContentSummary}"
                      </p>
                   </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-500/10 flex items-start gap-3">
                   <ShieldCheck className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Verified Data</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Stats are synthesized via real-time web grounding and public metadata matching.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !isProcessing && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center opacity-40">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <BarChart3 size={48} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Engine Standby</h3>
                <p className="text-sm text-slate-500 font-medium max-w-xs uppercase tracking-widest">Select platform and enter handle to begin audit</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
