import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Clipboard, Check, Eye, EyeOff, Settings, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [mode, setMode] = useState<'char' | 'word'>('char');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const wordList = ['alpha', 'beta', 'gamma', 'delta', 'omega', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliett', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa', 'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray', 'yankee', 'zulu', 'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'pear', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yam', 'zucchini', 'active', 'brave', 'clever', 'dark', 'eager', 'fancy', 'great', 'happy', 'inner', 'jolly', 'kind', 'lucky', 'mighty', 'noble', 'open', 'proud', 'quiet', 'rapid', 'smart', 'tough', 'unique', 'vivid', 'wild', 'young', 'zealous'];

  const generatePassword = () => {
    if (mode === 'word') {
      const array = new Uint32Array(4);
      window.crypto.getRandomValues(array);
      const words = Array.from(array).map(val => wordList[val % wordList.length]);
      setPassword(words.join('-') + (options.numbers ? Math.floor(Math.random() * 99) : ''));
      return;
    }

    let charset = '';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let nums = '0123456789';
    let syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (options.excludeSimilar) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[ilo]/g, '');
      nums = nums.replace(/[01]/g, '');
    }

    if (options.uppercase) charset += upper;
    if (options.lowercase) charset += lower;
    if (options.numbers) charset += nums;
    if (options.symbols) charset += syms;

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  useEffect(() => {
    // Calculate strength (0-4)
    let s = 0;
    if (password.length > 8) s++;
    if (password.length > 12) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-slate-200';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Nuclear';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Shield size={120} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Password Architect</h2>
                <p className="text-sm font-medium text-slate-500 tracking-tight">Generate uncrackable security strings</p>
              </div>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMode('char')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'char' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Random
              </button>
              <button
                onClick={() => setMode('word')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'word' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Passphrase
              </button>
            </div>
          </div>

          <div className="relative group">
            <input
              type="text"
              readOnly
              value={password}
              className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-xl text-slate-800 tracking-wider focus:outline-none focus:border-blue-500/20 transition-all select-all pr-32"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={generatePassword}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all active:rotate-180 duration-500"
              >
                <RefreshCw size={22} />
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
              >
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strength: <span className="text-slate-800 font-black">{getStrengthLabel()}</span></span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1 p-[1px]">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-500 ${i < strength ? getStrengthColor() : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {mode === 'char' ? (
              <>
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Length: <span className="text-blue-600">{length}</span></label>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                  <span>8</span>
                  <span>32</span>
                  <span>64</span>
                </div>
              </>
            ) : (
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-widest">Passphrase Mode</p>
                <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                  Generates a sequence of random words separated by hyphens. Highly secure and significantly easier to remember than random strings.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all font-bold text-[10px] capitalize ${value ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-100'} ${(mode === 'word' && ['uppercase', 'lowercase', 'symbols'].includes(key)) ? 'opacity-30 pointer-events-none' : ''}`}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'}`}>
                  {value && <Check size={10} strokeWidth={4} />}
                </div>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-slate-400">
          <div className="p-2 bg-slate-50 rounded-lg">
            <Zap size={16} />
          </div>
          <p className="text-[11px] font-medium leading-relaxed">
            Passwords are generated locally on your device using the Browser Crypto API. No data is ever transmitted or saved.
          </p>
        </div>
      </div>
    </div>
  );
};
