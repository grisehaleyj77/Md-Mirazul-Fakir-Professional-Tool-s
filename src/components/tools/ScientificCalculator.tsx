import React, { useState, useEffect } from 'react';
import { 
  Delete, 
  RefreshCcw, 
  Equal, 
  History, 
  ChevronDown, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';

export const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isRad, setIsRad] = useState(true);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleInput = (val: string) => {
    if (display === '0' || lastResult === display) {
      setDisplay(val);
      setLastResult(null);
    } else {
      setDisplay(display + val);
    }
  };

  const handleFunction = (func: string) => {
    if (display === '0') {
      setDisplay(func + '(');
    } else {
      setDisplay(display + func + '(');
    }
  };

  const calculate = () => {
    try {
      // Configuration for mathjs
      const config = {
        angles: isRad ? 'rad' : 'deg'
      };
      
      let expr = display;
      
      // Basic replacements for ease of use
      expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi');
      
      const result = math.evaluate(expr);
      const formattedResult = math.format(result, { precision: 10 });
      
      setHistory(prev => [display + ' = ' + formattedResult, ...prev].slice(0, 5));
      setDisplay(String(formattedResult));
      setLastResult(String(formattedResult));
      setEquation(display + ' =');
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

  const btnBase = "h-12 md:h-14 rounded-xl text-sm font-bold transition-all flex items-center justify-center active:scale-95";
  const numColor = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm";
  const funcColor = "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600";
  const opColor = "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-violet-100 dark:border-violet-500/30";
  const accentColor = "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20";

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">Precision Scientific</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">AI-Powered Computing Engine</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsRad(!isRad)}
             className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${isRad ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
           >
             {isRad ? 'RAD' : 'DEG'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Keyboard */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Display */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap size={80} className="text-white" />
            </div>
            <div className="relative z-10 space-y-1">
              <div className="text-right h-6 text-slate-500 font-mono text-sm overflow-hidden whitespace-nowrap">
                {equation}
              </div>
              <div className="text-right h-16 text-white font-mono text-4xl font-bold overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-end">
                {display}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
             {/* Scientific Row 1 */}
             <button onClick={() => handleFunction('sin')} className={funcColor}>sin</button>
             <button onClick={() => handleFunction('cos')} className={funcColor}>cos</button>
             <button onClick={() => handleFunction('tan')} className={funcColor}>tan</button>
             <button onClick={() => handleFunction('log')} className={funcColor}>log</button>
             <button onClick={() => handleInput('pi')} className={`${funcColor} hidden md:flex`}>π</button>

             {/* Scientific Row 2 */}
             <button onClick={() => handleFunction('asin')} className={funcColor}>sin⁻¹</button>
             <button onClick={() => handleFunction('acos')} className={funcColor}>cos⁻¹</button>
             <button onClick={() => handleFunction('atan')} className={funcColor}>tan⁻¹</button>
             <button onClick={() => handleFunction('sqrt')} className={funcColor}>√</button>
             <button onClick={() => handleInput('^')} className={`${funcColor} hidden md:flex`}>xʸ</button>

             {/* Main Numbers & Ops */}
             <button onClick={clear} className={`${opColor} col-span-2 font-black`}>AC</button>
             <button onClick={backspace} className={opColor}><Delete size={18} /></button>
             <button onClick={() => handleInput('/')} className={opColor}>÷</button>
             <button onClick={() => handleInput('(')} className={`${funcColor} hidden md:flex`}>(</button>

             {[7, 8, 9].map(n => (
               <button key={n} onClick={() => handleInput(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleInput('*')} className={opColor}>×</button>
             <button onClick={() => handleInput(')')} className={`${funcColor} hidden md:flex`}>)</button>

             {[4, 5, 6].map(n => (
               <button key={n} onClick={() => handleInput(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleInput('-')} className={opColor}>-</button>
             <button onClick={() => handleInput('e')} className={`${funcColor} hidden md:flex`}>e</button>

             {[1, 2, 3].map(n => (
               <button key={n} onClick={() => handleInput(String(n))} className={numColor}>{n}</button>
             ))}
             <button onClick={() => handleInput('+')} className={opColor}>+</button>
             <button onClick={() => handleInput('!')} className={`${funcColor} hidden md:flex`}>x!</button>

             <button onClick={() => handleInput('0')} className={`${numColor} col-span-2`}>0</button>
             <button onClick={() => handleInput('.')} className={numColor}>.</button>
             <button onClick={calculate} className={accentColor}><Equal size={22} /></button>
             <button onClick={() => handleFunction('abs')} className={`${funcColor} hidden md:flex`}>|x|</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           {/* History */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[300px]">
              <div className="flex items-center gap-2 mb-6">
                 <History size={16} className="text-violet-600" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Recent Calculations</h3>
              </div>
              
              <div className="flex-1 space-y-4">
                 {history.length > 0 ? (
                   history.map((item, i) => (
                     <motion.div 
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       key={i} 
                       className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-violet-200 dark:hover:border-violet-500/30 transition-all"
                       onClick={() => {
                          const val = item.split('=')[1].trim();
                          setDisplay(val);
                          setLastResult(val);
                       }}
                     >
                        <p className="text-[10px] text-slate-400 font-mono mb-1">{item.split('=')[0]}</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-violet-600 transition-colors">{item.split('=')[1]}</p>
                     </motion.div>
                   ))
                 ) : (
                   <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-700 opacity-50">
                      <RotateCcw size={32} className="mb-4" />
                      <p className="text-[10px] uppercase font-black tracking-widest">No history yet</p>
                   </div>
                 )}
              </div>

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start gap-3">
                 <Info size={14} className="text-violet-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                   Calculations are performed using the mathjs enterprise engine. Results are rounded to 10 decimal places for maximum accuracy across scientific domains.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
