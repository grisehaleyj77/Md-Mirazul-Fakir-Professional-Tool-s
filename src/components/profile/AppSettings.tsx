import React, { useState } from 'react';
import { Settings, Moon, Sun, Globe, Bell, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const AppSettings = ({ onBack, isDarkMode, onToggleTheme }: { onBack: () => void, isDarkMode: boolean, onToggleTheme: () => void }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    hapticFeedback: true,
    language: 'English'
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
        <h2 className="text-2xl font-black tracking-tight">App Settings</h2>
      </div>

      <div className="space-y-3">
        <div className="bg-[var(--glass)] p-5 rounded-3xl border border-[var(--glass-border)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold">Dark Mode</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Appearance</p>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Notifications</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Push alerts for tools</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('notifications')}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-teal-600' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Haptic Feedback</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Vibrate on actions</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('hapticFeedback')}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.hapticFeedback ? 'bg-orange-600' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">System Language</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Choose your native language</p>
            </div>
          </div>
          <select className="bg-gray-50 border-none rounded-xl px-3 py-1 text-[10px] font-black uppercase outline-none">
            <option>English</option>
            <option>Bangla</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};
