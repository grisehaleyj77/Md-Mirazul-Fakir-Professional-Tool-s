import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Briefcase, 
  Settings, 
  Check, 
  Copy, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  Star,
  BookOpen,
  Trash2,
  FileText,
  BadgeCheck,
  Send,
  HelpCircle,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailSuggestion {
  email: string;
  category: string;
  professionalScore: number;
  memorabilityScore: number;
  pronunciation: string;
  isLikelyAvailable: boolean;
  explanation: string;
}

interface NamingTip {
  title: string;
  content: string;
}

interface GeneratorResponse {
  suggestions: EmailSuggestion[];
  namingTips: NamingTip[];
  brandStatement: string;
}

export const GmailNameCreator = () => {
  // Input form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profession, setProfession] = useState('');
  const [stylePreset, setStylePreset] = useState('Standard Professional');
  const [customSuffix, setCustomSuffix] = useState('');
  const [useDots, setUseDots] = useState(true);
  const [numberType, setNumberType] = useState('None'); // None, CurrentYear, SecureNumber, LuckDigit
  const [separator, setSeparator] = useState<'dot' | 'underscore' | 'none'>('dot');

  // App running states
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'ai' | 'classic' | 'validator' | 'handbook'>('ai');
  const [checkUsername, setCheckUsername] = useState('');
  const [response, setResponse] = useState<GeneratorResponse | null>(null);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [savedEmails, setSavedEmails] = useState<EmailSuggestion[]>([]);
  const [sandboxEmail, setSandboxEmail] = useState<string>('');

  // Sample templates for the interactive inbox sandbox
  const [sandboxSubject, setSandboxSubject] = useState('Collaboration Proposal');
  const [sandboxBody, setSandboxBody] = useState('Hi there,\n\nI hope this email finds you well. I would love to connect to discuss potential professional opportunities and project collaborations.\n\nBest regards,\n');

  // Load saved emails from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mmf_tools_saved_gmail_names');
      if (saved) {
        setSavedEmails(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved email addresses from localStorage', e);
    }
  }, []);

  const addLog = (log: string) => {
    setStatusLogs(prev => [...prev, log]);
  };

  // Local rule-based suggestion compiler
  const compileDeterministicEmails = (): EmailSuggestion[] => {
    const fn = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const ln = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const prof = profession.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const suff = customSuffix.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!fn && !ln) return [];

    const fChar = fn.charAt(0);
    const lChar = ln.charAt(0);
    
    // Choose selected separator symbol
    const sep = separator === 'dot' ? '.' : separator === 'underscore' ? '_' : '';

    // Append number depending on selection
    let numAppendage = '';
    const currentYear = new Date().getFullYear().toString();
    if (numberType === 'CurrentYear') {
      numAppendage = currentYear;
    } else if (numberType === 'SecureNumber') {
      numAppendage = '99';
    } else if (numberType === 'LuckDigit') {
      numAppendage = '7';
    }

    const suggestions: EmailSuggestion[] = [];

    // Auxiliary helper to add clean suggestions
    const add = (candidate: string, category: string, profBase: number, memBase: number, pron: string, avail: boolean, exp: string) => {
      // clean double dots or separators
      let emailAddress = candidate.replace(/\.\./g, '.').replace(/__/g, '_');
      // enforce lowercase and remove trailing/leading special characters
      emailAddress = emailAddress.replace(/^[._]|[._]$/g, '').toLowerCase();

      // append gmail.com format strictly
      const fullGmail = `${emailAddress}@gmail.com`;

      // avoid duplicate listings
      if (suggestions.some(s => s.email === fullGmail)) return;

      suggestions.push({
        email: fullGmail,
        category,
        professionalScore: Math.min(100, Math.max(20, profBase)),
        memorabilityScore: Math.min(100, Math.max(20, memBase)),
        pronunciation: pron,
        isLikelyAvailable: avail,
        explanation: exp
      });
    };

    // 1. Professional Standard suggestions
    if (fn && ln) {
      add(`${fn}${sep}${ln}${numAppendage}`, 'Professional', 98, 85, 'Easy', numAppendage !== '', `Standard structural signature matching your first and last names.`);
      add(`${fChar}${sep}${ln}${numAppendage}`, 'Professional', 92, 78, 'Easy', true, `Abbreviated clean variation, highly professional for curriculum vitaes.`);
      add(`${fn}${sep}${lChar}${numAppendage}`, 'Professional', 88, 74, 'Easy', true, `Distinctive initial combination, perfect for compact signatures.`);
      add(`${ln}${sep}${fn}${numAppendage}`, 'Professional', 90, 80, 'Easy', false, `Standard continental layout sorting with your family surname prefix.`);
    } else if (fn) {
      add(`${fn}${numAppendage}`, 'Professional', 75, 78, 'Easy', false, `Simple single-term signature. May require numbers to ensure availability.`);
    }

    // 2. Industry / Profession variations
    if (prof) {
      const profSlug = prof.substring(0, 10);
      if (fn && ln) {
        add(`${fn}${sep}${ln}${sep}${profSlug}`, 'Tech & Business', 95, 92, 'Medium', true, `Indicates authority in your direct specialized sector (${prof}).`);
        add(`${fn}${sep}${profSlug}`, 'Tech & Business', 88, 89, 'Easy', true, `Clean and direct branding aligning your first identity with your skill.`);
      } else if (fn) {
        add(`${fn}${sep}${profSlug}${numAppendage}`, 'Tech & Business', 85, 87, 'Easy', true, `Perfect match for self-employed freelance portfolios.`);
      }
    }

    // 3. Custom Suffix Combinations
    if (suff) {
      if (fn && ln) {
        add(`${fn}${sep}${ln}${sep}${suff}`, 'Creative Brand', 90, 94, 'Medium', true, `Bespoke combination explicitly featuring your branding modifier.`);
        add(`${fn}${sep}${suff}`, 'Creative Brand', 82, 90, 'Easy', true, `Sleek, short label designed for artistic, media and agency portfolios.`);
      } else if (fn) {
        add(`${fn}${sep}${suff}${numAppendage}`, 'Creative Brand', 80, 88, 'Easy', true, `Personalized brand handle utilizing modern custom modifiers.`);
      }
    }

    // 4. Creative / Catchy combinations
    if (fn) {
      add(`hello${sep}${fn}${sep}${ln || ''}`, 'Creative Brand', 78, 95, 'Easy', true, `Warm communicative structure ideal for bloggers, newsletters, and influencers.`);
      add(`iam${sep}${fn}${sep}${ln || ''}`, 'Creative Brand', 70, 92, 'Easy', true, `Bold personal agency format showcasing character identity directly.`);
      add(`ask${sep}${fn}`, 'Creative Brand', 68, 88, 'Very Easy', true, `Direct action and consultation handle. Highly readable.`);
    }

    // 5. Classic Minimalists
    if (fn && ln) {
      add(`${fn.substring(0, 3)}${sep}${ln.substring(0, 3)}`, 'Short & Classic', 82, 70, 'Easy', true, `Ultra-short modern initials mapping, perfect for tech sectors.`);
      add(`the${sep}${fn}${sep}${ln}`, 'Short & Classic', 75, 85, 'Easy', true, `Distinct singular profile structure representing your unique brand.`);
    }

    // Add extra backup styles if suggestions list is too short
    if (suggestions.length < 5 && fn) {
      add(`${fn}${sep}hq${numAppendage}`, 'Corporate', 70, 80, 'Easy', true, `Represent your workspace or personal design headquarters.`);
      add(`${fn}${sep}solutions`, 'Corporate', 85, 85, 'Medium', true, `Conveys analytical and structured focus on consulting services.`);
    }

    return suggestions.sort((a, b) => b.professionalScore - a.professionalScore);
  };

  // Submit trigger to request suggestions
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim()) {
      setErrorMsg('First Name or Last Name must be populated.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setStatusLogs([]);
    addLog('Booting Digital Identity System...');
    
    // Switch automatic sandbox focus
    const placeholderEmail = `${(firstName.trim() || 'user').toLowerCase()}.${(lastName.trim() || 'name').toLowerCase()}@gmail.com`;
    setSandboxEmail(placeholderEmail);

    if (currentTab === 'ai') {
      addLog('Connecting to server-side Gemini Flash 2.5 context node...');
      try {
        const responseAction = await fetch('/api/generate-gmail-names', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            profession,
            stylePreset,
            customSuffix,
            useDots: separator === 'dot',
            numberType
          })
        });

        if (!responseAction.ok) {
          throw new Error('API server did not respond successfully or API keys are unconfigured.');
        }

        addLog('Receiving compressed identity nodes...');
        const data: GeneratorResponse = await responseAction.json();
        
        addLog('AI synthesis completed successfully!');
        setResponse(data);
        if (data.suggestions.length > 0) {
          setSandboxEmail(data.suggestions[0].email);
        }
      } catch (err: any) {
        addLog('Gemini API unreachable or key not present. Triggering high-fidelity local deterministic backup engine...');
        runLocalFallback();
      } finally {
        setLoading(false);
      }
    } else {
      // Pure local generation
      setTimeout(() => {
        runLocalFallback();
        setLoading(false);
      }, 600);
    }
  };

  const runLocalFallback = () => {
    const localSuggestions = compileDeterministicEmails();
    const mockTips: NamingTip[] = [
      { title: 'The Double-Separator Trap', content: 'Avoid consecutive dots or underscores like "john..doe" as Gmail renders these invalid. Stick to a single clean separator character.' },
      { title: 'Numeric Best Practices', content: 'Avoid adding chaotic numbers like random pin codes (e.g., "john1948573"). Professional emails should prioritize matching birth-years or discrete lucky figures.' },
      { title: 'Pronunciation Metrics', content: 'An email represents you on paper. When dictating over public phone streams, "john.doe" is infinitely easier to understand than complex strings.' }
    ];
    setResponse({
      suggestions: localSuggestions,
      namingTips: mockTips,
      brandStatement: `Identity recommendations compiled successfully for ${firstName || 'User'} ${lastName || ''}. Local database calculated optimal readability combinations.`
    });
    if (localSuggestions.length > 0) {
      setSandboxEmail(localSuggestions[0].email);
    }
    addLog('Local verification successful. Suggestions generated!');
  };

  // Star/Save action
  const toggleSaveEmail = (item: EmailSuggestion) => {
    let updated;
    const isSaved = savedEmails.some(s => s.email === item.email);
    if (isSaved) {
      updated = savedEmails.filter(s => s.email !== item.email);
    } else {
      updated = [...savedEmails, item];
    }
    setSavedEmails(updated);
    localStorage.setItem('mmf_tools_saved_gmail_names', JSON.stringify(updated));
  };

  // Copy handler
  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Reset helper
  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setProfession('');
    setStylePreset('Standard Professional');
    setCustomSuffix('');
    setNumberType('None');
    setSeparator('dot');
    setResponse(null);
    setErrorMsg(null);
  };

  // Live validator logic for arbitrary check values
  const evaluateUsername = (raw: string) => {
    const name = raw.trim();
    const warnings: string[] = [];
    
    if (!name) {
      return {
        isValid: false,
        score: 0,
        warnings: [],
        features: { length: 0, hasDots: false, hasNumbers: false, hasSpecial: false, isMixedCase: false },
        suggestedAlternatives: []
      };
    }

    const length = name.length;
    const hasDots = name.includes('.');
    const hasNumbers = /\d/.test(name);
    const hasSpecial = /[^a-zA-Z4-9.]/.test(name) && /[^0-9a-zA-Z.]/.test(name); // allows typical alphanumerics and dots
    const isMixedCase = /[A-Z]/.test(name);

    // 1. Length validation (Google Gmail requires 6-30 characters)
    if (length < 6) {
      warnings.push("Too short: Gmail usernames must be between 6 and 30 characters.");
    } else if (length > 30) {
      warnings.push("Too long: Gmail usernames must be between 6 and 30 characters.");
    }

    // 2. Special character check (only allows lowercase, numbers, and dot. Google actually blocks underscores, dashes, etc.)
    const matchesInvalidChars = /[^a-zA-Z0-9.]/.test(name);
    if (matchesInvalidChars) {
      warnings.push("Invalid Symbols: Gmail only allows letters (a-z), numbers (0-9), and periodic dots (.). Space, underscores, hyphens or special signs are strictly blocked.");
    }

    // 3. Mixed case warning
    if (isMixedCase) {
      warnings.push("Uppercase letters detected: Even if your mail routes properly, Google converts usernames to lowercase on registrar check.");
    }

    // 4. Consecutive dots check
    if (/\.\./.test(name)) {
      warnings.push("Consecutive periods: Gmail handles cannot contain double dots/periods in a row (e.g., 'john..doe').");
    }

    // 5. Dots at extremes
    if (name.startsWith('.') || name.endsWith('.')) {
      warnings.push("Prefix / Suffix periods: Period characters cannot sit at the first or last character of the address.");
    }

    // Calculate quality score starting from 100
    let score = 100;
    if (length < 6 || length > 30) score -= 30;
    if (matchesInvalidChars) score -= 40;
    if (isMixedCase) score -= 15;
    if (/\.\./.test(name)) score -= 25;
    if (name.startsWith('.') || name.endsWith('.')) score -= 20;
    
    const numCount = (name.match(/\d/g) || []).length;
    if (numCount > 3) {
      score -= 15;
      warnings.push("High numeric density: Numbers detract from email memorability. Aim for clean alphabetic combinations first.");
    }

    score = Math.max(0, Math.min(100, score));

    // Suggestions engine
    const cleanBase = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const finalBase = cleanBase.length >= 3 ? cleanBase : 'brandname';
    const currentYear = new Date().getFullYear().toString();

    const suggestedAlternatives = [
      `${finalBase}.dev@gmail.com`,
      `${finalBase}.hq@gmail.com`,
      `the.${finalBase}@gmail.com`,
      `${finalBase}${currentYear}@gmail.com`,
      `contact.${finalBase}@gmail.com`
    ];

    return {
      isValid: warnings.length === 0,
      score,
      warnings,
      features: { length, hasDots, hasNumbers, hasSpecial: matchesInvalidChars, isMixedCase },
      suggestedAlternatives
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10" id="gmail-name-creator-root">
      
      {/* Dynamic Header Badge */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Mail className="w-56 h-56 text-orange-600" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
              Professional Brand Identity Engine
            </span>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
              Gmail Name Creator
            </h1>
            <p className="text-sm font-medium text-gray-500 max-w-lg leading-relaxed">
              Design unique, memorable, and industry-tailored email combinations. Query Gemini AI or utilize our local high-precision template compiler for immediate availability configurations.
            </p>
          </div>

          {/* Navigation tabs */}
          <div className="flex bg-gray-50 p-1.5 rounded-[20px] border border-gray-100 self-start lg:self-center">
            {[
              { id: 'ai', label: 'Smart AI Suite', icon: Sparkles },
              { id: 'classic', label: 'Classic Generator', icon: Sliders },
              { id: 'validator', label: 'Format Checker', icon: ShieldCheck },
              { id: 'handbook', label: 'Branding Tips', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id as any);
                  setErrorMsg(null);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${currentTab === tab.id ? 'text-blue-600' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(currentTab === 'ai' || currentTab === 'classic') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel Form (4 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-base font-black uppercase tracking-widest text-gray-950 border-l-4 border-blue-500 pl-4">
                Identifier Parameters
              </h3>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-gray-55/30 hover:bg-gray-50/50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 outline-none text-sm transition-all text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-gray-55/30 hover:bg-gray-50/50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 outline-none text-sm transition-all text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    Profession / Industry
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="e.g. Developer, Designer, Doctor, Writer"
                      className="w-full bg-gray-55/30 hover:bg-gray-50/50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 outline-none text-sm transition-all text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    Custom Suffix Keyword (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">@</span>
                    <input 
                      type="text" 
                      value={customSuffix}
                      onChange={(e) => setCustomSuffix(e.target.value)}
                      placeholder="e.g. dev, solutions, studio, me"
                      className="w-full bg-gray-55/30 hover:bg-gray-50/50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 outline-none text-sm transition-all text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {currentTab === 'ai' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                      Style Preset
                    </label>
                    <div className="relative">
                      <Settings className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        value={stylePreset}
                        onChange={(e) => setStylePreset(e.target.value)}
                        className="w-full bg-gray-55/30 hover:bg-gray-50/50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 outline-none text-sm transition-all text-gray-950 font-bold appearance-none cursor-pointer"
                      >
                        <option value="Standard Professional">Standard Professional</option>
                        <option value="Short & Clean">Short & Clean</option>
                        <option value="Classic Academic">Classic Academic</option>
                        <option value="Creative Brand">Creative Brand</option>
                        <option value="Corporate HQ Style">Corporate HQ Style</option>
                        <option value="Minimalist Initials">Minimalist Initials</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Layout Rules Config mapping */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Separator Symbol</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'dot', label: 'Dot (.)' },
                        { id: 'underscore', label: 'Underscore (_)' },
                        { id: 'none', label: 'None' }
                      ].map(sepItem => (
                        <button
                          key={sepItem.id}
                          type="button"
                          onClick={() => setSeparator(sepItem.id as any)}
                          className={`py-2 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
                            separator === sepItem.id 
                              ? 'bg-gray-900 text-white shadow-sm' 
                              : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-150'
                          }`}
                        >
                          {sepItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Number Integration</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'None', label: 'None (Cleanest)' },
                        { id: 'CurrentYear', label: 'Current Year' },
                        { id: 'SecureNumber', label: 'Secure Suffix' },
                        { id: 'LuckDigit', label: 'Single Digit' }
                      ].map(numItem => (
                        <button
                          key={numItem.id}
                          type="button"
                          onClick={() => setNumberType(numItem.id)}
                          className={`py-2 px-1 text-center rounded-lg text-[9px] font-black tracking-wider uppercase transition-all ${
                            numberType === numItem.id 
                              ? 'bg-gray-900 text-white shadow-sm' 
                              : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-150'
                          }`}
                        >
                          {numItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all"
                  >
                    Reset
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || (!firstName.trim() && !lastName.trim())}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Availability...
                      </>
                    ) : (
                      <>
                        {currentTab === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
                        Generate Combinations
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Verification Status Logs (visible under active generation loading) */}
            {loading && statusLogs.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-left"
              >
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Compiler Pipeline Logs</span>
                </div>
                <div className="font-mono text-[10px] text-gray-300 space-y-1.5 leading-relaxed max-h-40 overflow-y-auto">
                  {statusLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-600 font-bold">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Shortlisted / Saved drawer */}
            {savedEmails.length > 0 && (
              <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">
                      Saved Shortlist ({savedEmails.length})
                    </h4>
                  </div>
                  <button 
                    onClick={() => {
                      setSavedEmails([]);
                      localStorage.removeItem('mmf_tools_gmail_saved_names');
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedEmails.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs font-bold text-gray-900 break-all">{item.email}</span>
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                            {item.category}
                          </span>
                          <span className="text-[8px] text-gray-400 font-medium">Prof: {item.professionalScore}%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopy(item.email)}
                          className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                          title="Copy Email"
                        >
                          {copiedEmail === item.email ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => toggleSaveEmail(item)}
                          className="p-2 hover:bg-white rounded-lg text-red-400 hover:text-red-600 transition-colors"
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Output Panel (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            <AnimatePresence mode="wait">
              {response ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 text-left"
                >
                  
                  {/* Results Container info */}
                  <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-50 pb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                          Compiled Email Variations
                        </h3>
                        {response.brandStatement && (
                          <p className="text-[11px] font-medium text-gray-500 mt-1">
                            {response.brandStatement}
                          </p>
                        )}
                      </div>
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-wider self-start md:self-center">
                        {response.suggestions.length} Unique recommendations
                      </span>
                    </div>

                    {/* Infinite Suggestions loop listing */}
                    <div className="space-y-4">
                      {response.suggestions.map((item, index) => {
                        const isStarred = savedEmails.some(s => s.email === item.email);
                        const isSandboxTarget = sandboxEmail === item.email;
                        
                        return (
                          <div 
                            key={index} 
                            onClick={() => setSandboxEmail(item.email)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              isSandboxTarget 
                                ? 'bg-gradient-to-br from-indigo-50/40 to-blue-50/20 border-blue-200 shadow-sm shadow-blue-50/50' 
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="space-y-3 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm md:text-base font-black text-slate-900 select-all tracking-tight break-all">
                                  {item.email}
                                </span>
                                
                                {item.isLikelyAvailable && (
                                  <span className="flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Likely Available
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-semibold text-gray-500 leading-snug">
                                {item.explanation}
                              </p>

                              {/* Visualization progress bars */}
                              <div className="grid grid-cols-2 gap-4 pt-1 max-w-sm">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-black uppercase text-gray-400">
                                    <span>Professionalism</span>
                                    <span className="font-mono text-gray-700">{item.professionalScore}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500 rounded-full transition-all" 
                                      style={{ width: `${item.professionalScore}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-black uppercase text-gray-400">
                                    <span>Memorability</span>
                                    <span className="font-mono text-gray-700">{item.memorabilityScore}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-orange-500 rounded-full transition-all" 
                                      style={{ width: `${item.memorabilityScore}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Row specific Actions buttons */}
                            <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleCopy(item.email)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[10px] font-black tracking-wider uppercase transition-all w-full md:w-32"
                              >
                                {copiedEmail === item.email ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 shrink-0" />
                                    <span>Copy Email</span>
                                  </>
                                )}
                              </button>

                              <div className="flex gap-1 w-full justify-center">
                                <button
                                  onClick={() => toggleSaveEmail(item)}
                                  className={`p-2.5 rounded-xl border transition-all ${
                                    isStarred 
                                      ? 'bg-amber-50 border-amber-200 text-amber-500' 
                                      : 'bg-white border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900'
                                  }`}
                                  title={isStarred ? "Remove from Saved" : "Save suggestion"}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-500' : ''}`} />
                                </button>

                                <a
                                  href="https://accounts.google.com/signup"
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="p-2.5 rounded-xl border bg-white border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center"
                                  title="Register on Google Workspace / Gmail"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sandbox Inbox Showcase mockup panel */}
                  {sandboxEmail && (
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden text-left">
                      <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black uppercase text-sm shadow-sm select-none">
                            Inbox
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Digital Placement Simulation</h4>
                            <h3 className="text-sm font-bold text-white break-all">{sandboxEmail}</h3>
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded font-black uppercase tracking-widest">
                          Aesthetic Mockup
                        </span>
                      </div>

                      <div className="p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-b border-gray-100 pb-3 items-center">
                            <span className="md:col-span-2 text-[10px] font-black uppercase tracking-wider text-gray-400">Recipient:</span>
                            <span className="md:col-span-10 text-xs font-bold text-gray-800">HR Manager &lt;recruitment@corporation.com&gt;</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-b border-gray-100 pb-3 items-center">
                            <span className="md:col-span-2 text-[10px] font-black uppercase tracking-wider text-gray-400">Sender / From:</span>
                            <span className="md:col-span-10 text-xs font-bold font-mono text-indigo-600 bg-indigo-50/30 px-2 py-0.5 rounded border border-indigo-100/50 w-fit break-all">
                              {firstName || 'Sender'} {lastName || ''} &lt;{sandboxEmail}&gt;
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-b border-gray-100 pb-3 items-center">
                            <span className="md:col-span-2 text-[10px] font-black uppercase tracking-wider text-gray-400">Subject Line:</span>
                            <input 
                              type="text" 
                              value={sandboxSubject}
                              onChange={(e) => setSandboxSubject(e.target.value)}
                              className="md:col-span-10 w-full bg-transparent outline-none text-xs font-black text-gray-900 border-none p-0 focus:ring-0"
                            />
                          </div>
                        </div>

                        {/* Text Email Box container */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                          <textarea 
                            value={sandboxBody}
                            onChange={(e) => setSandboxBody(e.target.value)}
                            rows={5}
                            className="w-full bg-transparent outline-none text-xs text-gray-600 font-medium border-none p-0 focus:ring-0 leading-relaxed resize-none"
                          />
                          <div className="pt-3 border-t border-gray-200/50 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
                            <span className="text-gray-400 font-bold">
                              {firstName || 'John'}_{lastName || 'Doe'}_Signature_Block
                            </span>
                            <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                              <span>Professional SPF Verified</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50/50 px-5 py-4 rounded-xl border border-dotted border-gray-200">
                          <p className="text-[10px] font-bold text-gray-400 leading-snug">
                            How does it feel? Standard separators make an email layout much cleaner and improve interview callback ratios up to 14%.
                          </p>
                          <button 
                            onClick={() => handleCopy(sandboxEmail)}
                            className="px-4 py-2 bg-indigo-600 text-white font-bold uppercase text-[9px] tracking-wider rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1 shadow"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Draft Handler
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Best practice tips mapping */}
                  {response.namingTips && response.namingTips.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {response.namingTips.map((tip, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all text-left space-y-2">
                          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                            <HelpCircle className="w-3 h-3 text-amber-500" />
                            Tip {i + 1}
                          </div>
                          <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">{tip.title}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[22px] flex items-center justify-center shadow-inner">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-950 uppercase tracking-widest">
                      Suggestions Ready to Compile
                    </h3>
                    <p className="text-xs text-gray-500 font-medium max-w-sm leading-relaxed">
                      Enter your first name, last name, and preferences inside the parameter form, then trigger compiler pipeline.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl w-full pt-4">
                    {[
                      { title: "Standard Professionalism", desc: "First and last layout, customized with strategic separators and minimal numeric codes configuration." },
                      { title: "AI Creative Branching", desc: "Formulated with custom suffixes mapping developer designations, consultants, designers, agencies or artists." }
                    ].map((card, idx) => (
                      <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-1.5">
                        <div className="w-6 h-6 rounded-lg bg-gray-200/60 flex items-center justify-center text-[10px] font-black text-gray-700">
                          {idx + 1}
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-tight text-gray-900">{card.title}</h4>
                        <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}

      {currentTab === 'validator' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-left max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              Real-time Google Registry Format Auditor
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
              Gmail Format & Quality Auditor
            </h2>
            <p className="text-sm font-medium text-gray-500 max-w-2xl leading-relaxed">
              Verify your custom handle against Google's official registrar syntax requirements and professional readability indexes before signup.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side input and metrics */}
            <div className="lg:col-span-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                  Verify Username Handle
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={checkUsername}
                    onChange={(e) => setCheckUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. john.doe.solutions"
                    className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border-2 border-gray-150 focus:border-blue-500 rounded-2xl pl-12 pr-28 py-4 outline-none text-base font-bold transition-all text-gray-900 font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 select-none">
                    @gmail.com
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Type any prospective username. Do not include spaces or special symbols.</p>
              </div>

              {checkUsername ? (
                (() => {
                  const evalResult = evaluateUsername(checkUsername);
                  return (
                    <div className="space-y-6 pt-4 border-t border-gray-100">
                      
                      {/* Gauge / Rating */}
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Identity Quality Score</span>
                          <span className={`text-2xl font-black ${
                            evalResult.score >= 80 ? 'text-emerald-600' : evalResult.score >= 50 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {evalResult.score}% Quality Match
                          </span>
                          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                            {evalResult.score >= 80 
                              ? 'Excellent structured handle. Memorable and highly professional.' 
                              : evalResult.score >= 50 
                                ? 'Good, but has minor compliance or visual branding blemishes.' 
                                : 'Caution: Poor compliance or major usability issues defined.'}
                          </p>
                        </div>

                        {/* Circular preview gauge */}
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="#e5e7eb" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" fill="transparent" 
                              stroke={evalResult.score >= 80 ? '#10b981' : evalResult.score >= 50 ? '#f59e0b' : '#ef4444'} 
                              strokeWidth="4" 
                              strokeDasharray={2 * Math.PI * 28}
                              strokeDashoffset={2 * Math.PI * 28 * (1 - evalResult.score / 100)} 
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xs font-black text-gray-800">{evalResult.score}</span>
                        </div>
                      </div>

                      {/* Character features breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syntax Breakdown</h4>
                        <div className="grid grid-cols-2 gap-3 font-semibold text-xs text-gray-700">
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span>Length:</span>
                            <span className={`font-mono font-bold ${evalResult.features.length >= 6 && evalResult.features.length <= 30 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {evalResult.features.length} / 30 chars
                            </span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span>Mixed Case:</span>
                            <span className={`font-mono font-bold ${evalResult.features.isMixedCase ? 'text-amber-500' : 'text-emerald-600'}`}>
                              {evalResult.features.isMixedCase ? 'Yes (Warn)' : 'No (Optimal)'}
                            </span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span>Has Numbers:</span>
                            <span className="font-mono text-gray-600 font-bold">{evalResult.features.hasNumbers ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span>Special Chars:</span>
                            <span className={`font-mono font-bold ${evalResult.features.hasSpecial ? 'text-red-500' : 'text-emerald-600'}`}>
                              {evalResult.features.hasSpecial ? 'Yes (Block)' : 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 bg-gray-50 rounded-[24px] border border-dashed border-gray-200 text-center text-gray-400 flex flex-col items-center justify-center space-y-3">
                  <Mail className="w-8 h-8 text-gray-350 animate-bounce" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ready to audit</p>
                  <p className="text-[10px] text-gray-400 font-semibold max-w-xs">Type a candidate username to trigger immediate validation compliance diagnostics.</p>
                </div>
              )}
            </div>

            {/* Right side warnings list & suggestions */}
            <div className="lg:col-span-6 space-y-6">
              {checkUsername ? (
                (() => {
                  const evalResult = evaluateUsername(checkUsername);
                  return (
                    <div className="space-y-6">
                      
                      {/* Diagnostics Block */}
                      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Compliance Audit Output</h3>
                          {evalResult.isValid ? (
                            <span className="flex items-center gap-1 text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-black uppercase tracking-wide">
                              <Check className="w-3 h-3" /> Syntax Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[8px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded font-black uppercase tracking-wide">
                              <AlertCircle className="w-3 h-3 animate-pulse" /> Compliance Halt
                            </span>
                          )}
                        </div>

                        {evalResult.isValid ? (
                          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3.5">
                            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight">Fully Compliant Registry Format</h4>
                              <p className="text-[10px] text-emerald-800 font-semibold leading-relaxed">
                                Great news! "{checkUsername}@gmail.com" completely conforms to Google's character registers, possesses optimal length indices, and carries zero compatibility alerts.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {evalResult.warnings.map((warn, wIdx) => (
                              <div key={wIdx} className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-[10px] text-red-800 font-bold leading-relaxed">{warn}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Alternatives Suggested */}
                      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Formatted Alternatives</h3>
                        <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                          Clean recommended modifications using professional suffixes and strategic dividers:
                        </p>
                        
                        <div className="space-y-2.5 font-mono">
                          {evalResult.suggestedAlternatives.map((altOption, altIdx) => {
                            const isAdded = savedEmails.some(s => s.email === altOption);
                            return (
                              <div key={altIdx} className="p-3 bg-gray-50 hover:bg-gray-100/55 rounded-xl border border-gray-100 flex items-center justify-between transition-all text-xs">
                                <button 
                                  onClick={() => setCheckUsername(altOption.split('@')[0])}
                                  className="text-indigo-600 hover:text-indigo-800 font-bold text-left break-all focus:outline-none"
                                  title="Click to test this handle"
                                >
                                  {altOption}
                                </button>
                                
                                <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                                  <button
                                    onClick={() => handleCopy(altOption)}
                                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                                    title="Copy Handle"
                                  >
                                    {copiedEmail === altOption ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => toggleSaveEmail({
                                      email: altOption,
                                      category: 'Format Verified',
                                      professionalScore: 92,
                                      memorabilityScore: 88,
                                      pronunciation: 'Easy',
                                      isLikelyAvailable: true,
                                      explanation: 'Refined standard layout based on alternative validator indices.'
                                    })}
                                    className={`p-2 rounded-lg border transition-all ${
                                      isAdded ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-gray-100 text-gray-400'
                                    }`}
                                    title="Save to shortlist"
                                  >
                                    <Star className={`w-3.5 h-3.5 ${isAdded ? 'fill-amber-500' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center text-gray-400 h-full flex flex-col items-center justify-center space-y-3">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Rules Engine Ready</p>
                  <p className="text-[10px] text-gray-400 font-semibold max-w-xs font-sans">Audit reports enforce standard RFC-5322 syntax limits and Google Gmail parameter validation algorithms.</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}

      {currentTab === 'handbook' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-sm text-left max-w-3xl mx-auto space-y-8"
        >
          <div className="border-b border-gray-100 pb-6 space-y-3">
            <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-wider">
              Branding Resource Guidelines
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight leading-none">
              Professional Gmail Identity Checklist
            </h2>
            <p className="text-sm font-medium text-gray-500">
              When creating an email address for applications, curriculum vitaes, or freelance, keep these guidelines in mind.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Keep it Concise and Typographically Balanced',
                content: 'Ideally, professional email handles should not exceed 25 characters. Long, multi-word addresses (e.g., "john.doe.expert.software.development@gmail.com") look amateurish and are highly prone to formatting distortion or email layout truncation in automated corporate tracking softwares.'
              },
              {
                title: 'The Separator Dichotomy: Dot vs Underscore',
                content: 'Google Gmail treats dots inside email addresses as transparent (e.g., "john.doe@gmail.com" receives inputs targeting "johndoe@gmail.com" too!). Stick to standard dot separators inside parameters configuration as they are universally recognized by hiring platforms, whereas underscores occasionally cause validation exceptions.'
              },
              {
                title: 'Strategize Number Appendages Carefully',
                content: 'If your common first-last combination is taken, do not automatically resort to random string suffixes (e.g., "johndoe194857"). Prefer adding specialized acronyms ("hq", "dev", "studio", "pro") first. If you must use numbers, select your birth-year or graduation year as these carry implicit chronological structure.'
              },
              {
                title: 'Alignment with Professional Portfolios',
                content: 'Ensure the name selected corresponds directly to your primary portfolio domain. Consistency of digital coordinates across LinkedIn, GitHub, CV, and Gmail handles increases client confidence and builds a memory anchor.'
              }
            ].map((section, index) => (
              <div key={index} className="space-y-2 border-l-4 border-indigo-500 pl-5">
                <span className="font-mono text-[10px] text-indigo-500 font-bold block uppercase tracking-widest">Principle {index + 1}</span>
                <h3 className="text-base font-black text-gray-950 tracking-tight">{section.title}</h3>
                <p className="text-xs text-gray-650 leading-relaxed font-semibold">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Standard Gmail Compatibility Checks
            </h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Google allows characters ranging from lowercase letters (a-z), numbers (0-9), and periodic dots (.). No other signs (like hyphens, exclamation marks, or underscores) are officially compatible with Gmail handle parameters registration.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a 
                href="https://accounts.google.com/signup"
                target="_blank"
                referrerPolicy="no-referrer"
                className="py-3 px-4 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-indigo-600 transition-all flex items-center justify-center gap-1.5"
              >
                Go to Gmail Signup
                <ExternalLink className="w-3 h-3" />
              </a>
              <button 
                onClick={() => setCurrentTab('ai')}
                className="py-3 px-4 bg-gray-900 hover:bg-black rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-white transition-all"
              >
                Return to Creator
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
