import React, { useState } from 'react';
import { Calculator as CalcIcon, Delete, RefreshCcw, Equal } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const btnClass = "h-16 rounded-2xl text-lg font-bold transition-all flex items-center justify-center";
  const numClass = `${btnClass} bg-[var(--card-bg)] border border-[var(--glass-border)] hover:bg-[var(--line)] text-[var(--ink)]`;
  const opClass = `${btnClass} bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100`;
  const actionClass = `${btnClass} bg-slate-900 dark:bg-blue-600 text-white hover:opacity-90`;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-900 dark:bg-black/40 rounded-3xl p-6 shadow-2xl mb-8 border border-white/5">
        <div className="text-right h-12 text-slate-400 font-mono text-sm overflow-hidden whitespace-nowrap mb-2">
          {equation}
        </div>
        <div className="text-right h-20 text-white font-mono text-4xl font-bold overflow-hidden whitespace-nowrap">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <button onClick={clear} className={`${opClass} col-span-2`}>AC</button>
        <button onClick={() => setDisplay(display.slice(0, -1) || '0')} className={opClass}><Delete className="w-5 h-5" /></button>
        <button onClick={() => handleOperator('/')} className={opClass}>÷</button>

        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => handleNumber(String(n))} className={numClass}>{n}</button>
        ))}
        <button onClick={() => handleOperator('*')} className={opClass}>×</button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => handleNumber(String(n))} className={numClass}>{n}</button>
        ))}
        <button onClick={() => handleOperator('-')} className={opClass}>-</button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => handleNumber(String(n))} className={numClass}>{n}</button>
        ))}
        <button onClick={() => handleOperator('+')} className={opClass}>+</button>

        <button onClick={() => handleNumber('0')} className={`${numClass} col-span-2`}>0</button>
        <button onClick={() => handleNumber('.')} className={numClass}>.</button>
        <button onClick={calculate} className={actionClass}><Equal className="w-6 h-6" /></button>
      </div>
    </div>
  );
};
