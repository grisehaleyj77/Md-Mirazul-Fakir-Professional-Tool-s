import React, { useState } from 'react';
import { Calculator as CalcIcon, History, Trash2, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Using Function constructor as a safer alternative to eval for simple math
      const result = new Function(`return ${fullEquation.replace('×', '*').replace('÷', '/')}`)();
      const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, '');
      
      setHistory(prev => [fullEquation + ' = ' + resultStr, ...prev].slice(0, 50));
      setDisplay(resultStr);
      setEquation('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const buttons = [
    { label: 'C', action: clear, type: 'special' },
    { label: '⌫', action: backspace, type: 'special', icon: <Delete className="w-5 h-5" /> },
    { label: '%', action: () => setDisplay((parseFloat(display) / 100).toString()), type: 'operator' },
    { label: '÷', action: () => handleOperator('÷'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '×', action: () => handleOperator('×'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', wide: true },
    { label: '.', action: () => !display.includes('.') && handleNumber('.'), type: 'number' },
    { label: '=', action: calculate, type: 'equal' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <CalcIcon className="w-8 h-8 text-neutral-600" />
            Calculator
          </h2>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative bg-neutral-900 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-end">
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <AnimatePresence>
          {showHistory ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-10 bg-neutral-900 p-8 flex flex-col pt-16"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest">History</h3>
                <button 
                  onClick={() => setHistory([])}
                  className="text-neutral-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {history.length === 0 ? (
                  <p className="text-neutral-600 italic text-sm text-center mt-20">No recent calculations</p>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="text-right text-neutral-300 font-mono text-lg py-2 border-b border-neutral-800 last:border-0">
                      {item}
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="mt-4 w-full py-3 bg-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-700 transition-all"
              >
                Back to Calc
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              {/* Display */}
              <div className="flex flex-col items-end gap-2 mb-8 mt-4 overflow-hidden">
                <div className="h-6 text-neutral-500 font-mono text-sm overflow-hidden whitespace-nowrap">
                  {equation}
                </div>
                <motion.div 
                  key={display}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-medium text-white font-mono tracking-tighter truncate w-full text-right"
                >
                  {display}
                </motion.div>
              </div>

              {/* Pad */}
              <div className="grid grid-cols-4 gap-3">
                {buttons.map((btn) => (
                  <motion.button
                    key={btn.label}
                    whileTap={{ scale: 0.92 }}
                    onClick={btn.action}
                    className={`
                      ${btn.wide ? 'col-span-2' : 'col-span-1'}
                      h-16 rounded-[1.25rem] flex items-center justify-center text-xl font-bold transition-all
                      ${btn.type === 'number' ? 'bg-neutral-800 text-white hover:bg-neutral-700' : ''}
                      ${btn.type === 'operator' ? 'bg-neutral-100/10 text-brand-400 hover:bg-neutral-100/20' : ''}
                      ${btn.type === 'special' ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' : ''}
                      ${btn.type === 'equal' ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20' : ''}
                    `}
                  >
                    {btn.icon || btn.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] bg-neutral-50 py-2 rounded-xl">
          Standard Precision Arithmetic
        </p>
      </div>
    </div>
  );
}
