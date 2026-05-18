import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Hourglass, 
  Cake, 
  ChevronRight, 
  RefreshCcw, 
  Info,
  Gift,
  Star,
  Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: {
    months: number;
    days: number;
    dayOfWeek: string;
  };
  zodiac: string;
  chineseZodiac: string;
  lifeProgress: number;
}

export const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [liveSeconds, setLiveSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (birthDate && ageDetails) {
      interval = setInterval(() => {
        const birth = new Date(birthDate).getTime();
        const now = new Date().getTime();
        setLiveSeconds(Math.floor((now - birth) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [birthDate, ageDetails]);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);

    if (birth > today) {
      alert("Birth date cannot be in the future!");
      return;
    }

    // Basic Age Calculation
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total units
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffTime / (1000 * 60));
    const totalSeconds = Math.floor(diffTime / 1000);

    // Next Birthday
    const nextBdate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (today > nextBdate) {
      nextBdate.setFullYear(today.getFullYear() + 1);
    }
    
    let nextDiff = nextBdate.getTime() - today.getTime();
    let nextMonths = Math.floor(nextDiff / (1000 * 60 * 60 * 24 * 30.44));
    let nextDays = Math.floor((nextDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const nextDayOfWeek = nextBdate.toLocaleDateString('en-US', { weekday: 'long' });

    // Zodiac Sign
    const getZodiac = (date: Date) => {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius";
      if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return "Pisces";
      if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
      if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus";
      if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini";
      if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer";
      if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
      if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
      if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
      if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio";
      if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius";
      return "Capricorn";
    };

    // Chinese Zodiac
    const getChineseZodiac = (year: number) => {
      const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
      return animals[(year - 4) % 12];
    };

    // Life Progress (assuming 80 years as average)
    const lifeProgress = Math.min(100, (years / 80) * 100);

    setAgeDetails({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: {
        months: nextMonths,
        days: nextDays,
        dayOfWeek: nextDayOfWeek
      },
      zodiac: getZodiac(birth),
      chineseZodiac: getChineseZodiac(birth.getFullYear()),
      lifeProgress
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Hourglass className="w-40 h-40 text-blue-600" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              Chronos Precision Tool
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 leading-none">Age Calculator</h2>
              <p className="text-sm font-medium text-gray-500 max-w-xs">Astronomical precision calculations for your journey through time.</p>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 space-y-4 shadow-inner">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date of Birth</label>
               <input 
                 type="date"
                 value={birthDate}
                 onChange={(e) => setBirthDate(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
               />
               <button 
                 onClick={calculateAge}
                 disabled={!birthDate}
                 className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Calculate Longevity
               </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {ageDetails ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Live Seconds Counter */}
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200">
               <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Total Seconds Alive</p>
                    <div className="text-4xl md:text-6xl font-black tracking-tighter mt-1 tabular-nums">
                       {liveSeconds.toLocaleString()}
                    </div>
                  </div>
                  <div className="hidden md:block">
                     <Clock className="w-16 h-16 opacity-20 animate-spin-slow" style={{ animationDuration: '60s' }} />
                  </div>
               </div>
            </div>

            {/* Primary Age Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Years', value: ageDetails.years, icon: Milestone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 { label: 'Months', value: ageDetails.months, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'Days', value: ageDetails.days, icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="text-4xl font-black text-gray-900">{stat.value}</div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Next Birthday & Zodiac */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 border-l-4 border-indigo-500 pl-4">Next Birthday</h3>
                     <Gift className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black text-gray-900">{ageDetails.nextBirthday.months}</span>
                     <span className="text-sm font-medium text-gray-500 uppercase">Months</span>
                     <span className="text-5xl font-black text-gray-900">{ageDetails.nextBirthday.days}</span>
                     <span className="text-sm font-medium text-gray-500 uppercase">Days</span>
                  </div>
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Falls on a</span>
                     <span className="px-4 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{ageDetails.nextBirthday.dayOfWeek}</span>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 border-l-4 border-amber-500 pl-4">Astrological Stats</h3>
                     <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Zodiac</div>
                        <div className="font-black text-gray-900">{ageDetails.zodiac}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Chinese</div>
                        <div className="font-black text-gray-900">{ageDetails.chineseZodiac}</div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Life Progress (Est. 80yrs)</span>
                        <span className="text-xs font-black text-indigo-600">{Math.round(ageDetails.lifeProgress)}%</span>
                     </div>
                     <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ageDetails.lifeProgress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Interplanetary Age */}
            <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 border-l-4 border-teal-500 pl-4">Interplanetary Age</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Your age on other celestial bodies</p>
                  </div>
                  <Star className="w-5 h-5 text-teal-500" />
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: 'Mercury', factor: 0.24, color: 'text-gray-400', bg: 'bg-gray-50' },
                    { name: 'Venus', factor: 0.615, color: 'text-orange-400', bg: 'bg-orange-50' },
                    { name: 'Mars', factor: 1.88, color: 'text-red-400', bg: 'bg-red-50' },
                    { name: 'Jupiter', factor: 11.86, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { name: 'Saturn', factor: 29.46, color: 'text-yellow-600', bg: 'bg-yellow-50' }
                  ].map((planet) => (
                    <div key={planet.name} className={`${planet.bg} p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1`}>
                       <div className="text-[10px] font-black uppercase tracking-tighter opacity-40">{planet.name}</div>
                       <div className={`text-xl font-black ${planet.color}`}>{(ageDetails.years / planet.factor).toFixed(1)}</div>
                       <div className="text-[8px] font-bold text-gray-400 uppercase">Years</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Total Breakdown Metrics */}
            <div className="bg-gray-900 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-pulse"></div>
               </div>
               
               <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Info className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <h3 className="text-lg font-black tracking-tight">Total Metrics</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">A comprehensive log of your existence</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {[
                       { label: 'Total Months', value: ageDetails.totalMonths.toLocaleString() },
                       { label: 'Total Weeks', value: ageDetails.totalWeeks.toLocaleString() },
                       { label: 'Total Days', value: ageDetails.totalDays.toLocaleString() },
                       { label: 'Total Minutes', value: ageDetails.totalMinutes.toLocaleString() }
                     ].map((metric, i) => (
                       <div key={i} className="space-y-1">
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{metric.label}</div>
                          <div className="text-2xl font-black text-white">{metric.value}</div>
                       </div>
                     ))}
                  </div>
                  
                  <button 
                    onClick={() => { setAgeDetails(null); setBirthDate(''); }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors w-fit"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Reset Protocol
                  </button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Cake, title: "Birthday Pulse", desc: "Track precisely how many days until your next celebration." },
              { icon: Star, title: "Stellar Charts", desc: "Discover your Western and Chinese zodiac identities instantly." },
              { icon: Clock, title: "Granular Time", desc: "Break down your life into months, weeks, days, and even hours." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all">
                 <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">{feature.title}</h3>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
