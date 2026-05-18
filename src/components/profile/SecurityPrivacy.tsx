import React from 'react';
import { Layers, ShieldCheck, Key, Eye, EyeOff, ArrowRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SecurityPrivacy = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-[var(--ink)]">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Security & Privacy</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--glass)] p-6 rounded-[32px] border border-[var(--glass-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Security Status</h4>
          </div>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-[var(--ink)] transition-colors">Change Password</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-all" />
            </button>
            <div className="h-px bg-[var(--line)]" />
            <button className="w-full flex items-center justify-between group">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                 <span className="text-xs font-bold text-slate-500 group-hover:text-[var(--ink)] transition-colors">Two-Factor Authentication</span>
               </div>
               <span className="text-[10px] font-black text-slate-300 uppercase">Disabled</span>
            </button>
          </div>
        </div>

        <div className="bg-[var(--glass)] p-6 rounded-[32px] border border-[var(--glass-border)]">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 flex items-center justify-center">
               <Layers className="w-5 h-5" />
             </div>
             <h4 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Data & Privacy</h4>
          </div>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-[var(--ink)] transition-colors">Session Masking</span>
              </div>
              <div className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full p-1 transition-colors">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </button>
            <div className="h-px bg-[var(--line)]" />
            <button className="w-full flex items-center justify-between group">
               <div className="flex items-center gap-3">
                 <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                 <span className="text-xs font-bold text-slate-500 group-hover:text-[var(--ink)] transition-colors">Clear Conversion History</span>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-200" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-[32px] border border-red-100 dark:border-red-500/20">
           <h4 className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-4">Danger Zone</h4>
           <button className="w-full py-4 bg-[var(--bg)] border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs active:scale-95 transition-all shadow-sm">
             DELETE ACCOUNT PERMANENTLY
           </button>
           <p className="text-[9px] text-red-400 text-center mt-3 font-bold uppercase tracking-tighter">This action cannot be undone.</p>
        </div>
      </div>
    </motion.div>
  );
};
