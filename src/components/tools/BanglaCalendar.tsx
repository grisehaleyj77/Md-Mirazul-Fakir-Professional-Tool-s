import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Globe,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Bengali Data Constants
const BN_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 
  'কার্ত্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

const BN_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const bnDigits = (n: number | string) => {
  const digits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return n.toString().split('').map(d => digits[d] || d).join('');
};

/**
 * Bangladeshi Revised Bengali Calendar Conversion (Post-2019)
 * - 1 Boishakh is 14 April
 * - Boishakh to Ashwin (1-6): 31 days
 * - Kartik to Choitro (7-12): 30 days
 * - Leap year: Falgun (11) is 31 days
 */
const getBanglaDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
  let bnYear = year - 593;
  let bnMonth = 0;
  let bnDay = 0;

  // Offset from April 14 (1 Boishakh)
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 3, 14).getTime()) / (1000 * 60 * 60 * 24));

  if (dayOfYear >= 0) {
    // Current Bengali Year
    let remainingDays = dayOfYear;
    const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeapYear ? 31 : 30, 30];
    
    for (let i = 0; i < 12; i++) {
      if (remainingDays < daysInMonths[i]) {
        bnMonth = i;
        bnDay = remainingDays + 1;
        break;
      }
      remainingDays -= daysInMonths[i];
    }
  } else {
    // Previous Bengali Year
    bnYear -= 1;
    const prevYear = year - 1;
    const isPrevLeap = (prevYear % 4 === 0 && prevYear % 100 !== 0) || (prevYear % 400 === 0);
    const daysInMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isPrevLeap ? 31 : 30, 30];
    
    // Calculate days from April 14 of previous year
    const dayOfPrevYear = Math.floor((date.getTime() - new Date(prevYear, 3, 14).getTime()) / (1000 * 60 * 60 * 24));
    let remainingDays = dayOfPrevYear;
    
    for (let i = 0; i < 12; i++) {
      if (remainingDays < daysInMonths[i]) {
        bnMonth = i;
        bnDay = remainingDays + 1;
        break;
      }
      remainingDays -= daysInMonths[i];
    }
  }

  return {
    day: bnDay,
    month: BN_MONTHS[bnMonth],
    year: bnYear,
    dayName: BN_DAYS[date.getDay()]
  };
};

export const BanglaCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const currentBn = getBanglaDate(currentDate);

  return (
    <div className="space-y-10 pb-32">
      {/* Dynamic Header with Live Stats */}
      <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-500/20 rotate-3">
                    <CalendarIcon className="w-8 h-8" />
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Elite <span className="text-indigo-400">Calendar</span></h2>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                    <Globe className="w-3 h-3" />
                    <span>UTC+6 Dhaka</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                    <Sun className="w-3 h-3" />
                    <span>Revised 1426 Scheme</span>
                 </div>
              </div>
           </div>

           <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] text-center min-w-[240px] relative group">
              <div className="absolute top-2 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                 <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Current Time</p>
              <h3 className="text-4xl font-mono font-bold tracking-tighter">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-widest">
                {currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Today Spotlight Card */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-10 rounded-[56px] shadow-sm space-y-8 flex flex-col items-center">
              <div className="text-center space-y-2">
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Today's Bengali Date</h4>
                 <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
                    {bnDigits(currentBn.day)}
                 </div>
              </div>

              <div className="w-full space-y-4">
                 <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-white/5 text-center">
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{currentBn.month}</p>
                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em]">{bnDigits(currentBn.year)} বঙ্গাব্দ</p>
                 </div>
                 <div className="flex items-center justify-between px-8 py-4 bg-indigo-600 rounded-3xl text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest">Day</span>
                    <span className="text-sm font-black italic uppercase italic">{currentBn.dayName}</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-white/5 w-full space-y-6">
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Season (ঋতু)</p>
                       <p className="text-xs font-black uppercase">{['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'][Math.floor(BN_MONTHS.indexOf(currentBn.month) / 2)]}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 p-8 rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-indigo-600/20">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase opacity-60">Digital Bangladesh</p>
                 <p className="text-lg font-black uppercase italic tracking-tighter">Live Calendar API</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Sun className="w-6 h-6 animate-spin-slow" />
              </div>
           </div>
        </div>

        {/* Calendar Grid View */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-white/5 rounded-[56px] border border-slate-100 dark:border-white/5 p-8 sm:p-12 shadow-sm space-y-10">
              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{EN_MONTHS[viewDate.getMonth()]} <span className="text-indigo-500">{viewDate.getFullYear()}</span></h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Monthly Overview Engine</p>
                 </div>

                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => changeMonth(-1)}
                      className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-transparent hover:border-indigo-100"
                    >
                       <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setViewDate(new Date())}
                      className="px-6 h-12 bg-slate-900 dark:bg-white/10 text-white dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                       Today
                    </button>
                    <button 
                      onClick={() => changeMonth(1)}
                      className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-transparent hover:border-indigo-100"
                    >
                       <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-4">
                 {/* Weekday Labels */}
                 <div className="grid grid-cols-7 gap-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                       <div key={i} className="text-center">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${i === 0 || i === 6 ? 'text-red-500' : 'text-slate-400'}`}>
                             {day}
                          </p>
                       </div>
                    ))}
                 </div>

                 {/* Days Grid */}
                 <div className="grid grid-cols-7 gap-3 sm:gap-4">
                    {/* Empty slots for start of month */}
                    {Array.from({ length: firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => (
                       <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Actual days */}
                    {Array.from({ length: daysInMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => {
                       const day = i + 1;
                       const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                       const isToday = d.toDateString() === currentDate.toDateString();
                       const bnDate = getBanglaDate(d);

                       return (
                          <motion.div 
                            key={day}
                            whileHover={{ y: -4, scale: 1.05 }}
                            className={`aspect-square rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center p-1 sm:p-2 relative transition-all group
                              ${isToday ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-indigo-200'}
                            `}
                          >
                             <p className={`text-base sm:text-xl font-bold leading-none ${isToday ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                {day}
                             </p>
                             <p className={`text-[9px] sm:text-[11px] font-black uppercase tracking-tighter mt-1 sm:mt-1.5 ${isToday ? 'text-white/60' : 'text-indigo-500'}`}>
                                {bnDigits(bnDate.day)}
                             </p>
                             
                             {/* Floating Bangla Month indicator for first day */}
                             {bnDate.day === 1 && (
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase whitespace-nowrap shadow-md z-10">
                                   {bnDate.month}
                                </div>
                             )}
                          </motion.div>
                       );
                    })}
                 </div>
              </div>

              {/* Legend/Info */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">English Date</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-50" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bangla Date</span>
                    </div>
                 </div>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-indigo-500 transition-colors">
                    Official Timepiece Engine V4.0
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
