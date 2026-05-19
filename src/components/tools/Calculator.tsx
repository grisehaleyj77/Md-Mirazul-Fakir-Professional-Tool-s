import React, { useState } from 'react';
import { Delete, Equal, Box, History, Zap, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0' || lastResult === display) {
      setDisplay(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
    setLastResult(null);
  };

  const calculate = () => {
    try {
      const sanitized = (equation + display).replace(/÷/g, '/').replace(/×/g, '*');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      const formatted = Number.isInteger(result) ? String(result) : result.toFixed(4).replace(/\.?0+$/, '');
      
      setHistory(prev => [`${equation}${display} = ${formatted}`, ...prev].slice(0, 5));
      setDisplay(String(formatted));
      setLastResult(String(formatted));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setLastResult(null);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const btnBase = "h-14 rounded-2xl text-lg font-bold transition-all flex items-center justify-center active:scale-95";
  const numColor = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm";
  const opColor = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-100 dark:border-amber-500/30";
  const accentColor = "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20";

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Box size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">Calcu AI</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Neural Computing Engine</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic: Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <RotateCcw size={120} className="text-white" />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="text-right h-6 text-slate-500 font-mono text-sm overflow-hidden whitespace-nowrap">
                {equation}
              </div>
              <div className="text-right h-20 text-white font-mono text-5xl font-bold overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-end">
                {display}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
             <button onClick={clear} className={`${opColor} col-span-2 font-black`}>AC</button>
             <button onClick={backspace} className={opColor}><Delete size={20} /></button>
             <button onClick={() => handleOperator('/')} className={opColor}>÷</button>

             {[7, 8, 9].map(n => (
               <button key={n} onClick={() => handleNumber(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleOperator('*')} className={opColor}>×</button>

             {[4, 5, 6].map(n => (
               <button key={n} onClick={() => handleNumber(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleOperator('-')} className={opColor}>-</button>

             {[1, 2, 3].map(n => (
               <button key={n} onClick={() => handleNumber(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleOperator('+')} className={opColor}>+</button>

             <button onClick={() => handleNumber('0')} className={`${numColor} col-span-2`}>0</button>
             <button onClick={() => handleNumber('.')} className={numColor}>.</button>
             <button onClick={calculate} className={accentColor}><Equal size={24} /></button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[400px]">
             <div className="flex items-center gap-2 mb-6">
                <History size={16} className="text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Neural History</h3>
             </div>
             
             <div className="flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {history.length > 0 ? (
                    history.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={i} 
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-amber-200 dark:hover:border-amber-500/30 transition-all"
                        onClick={() => {
                           const val = item.split('=')[1].trim();
                           setDisplay(val);
                           setLastResult(val);
                        }}
                      >
                         <p className="text-[10px] text-slate-400 font-mono mb-1">{item.split('=')[0]}</p>
                         <p className="text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 transition-colors">{item.split('=')[1]}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-700 opacity-50">
                       <Zap size={40} className="mb-4" />
                       <p className="text-[10px] uppercase font-black tracking-widest text-center">No neural data processed yet</p>
                    </div>
                  )}
                </AnimatePresence>
             </div>

             <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-500/5 rounded-3xl flex items-start gap-4 border border-amber-100 dark:border-amber-500/10">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">Logic Optimization</p>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Calcu AI uses high-precision arithmetic for everyday tasks. For complex scientific formulas, please switch to the Precision Scientific module.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
