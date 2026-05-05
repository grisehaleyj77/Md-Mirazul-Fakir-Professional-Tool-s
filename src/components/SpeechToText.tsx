import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Check, Trash2, Download, Languages, Volume2, Sparkles, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'bn-BD', name: 'Bangla (Bangladesh)', flag: '🇧🇩' },
  { code: 'bn-IN', name: 'Bangla (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
];

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang.code;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(prev => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please enable microphone permissions.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Auto-restart if we're supposed to be listening
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [selectedLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Start error:', err);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearTranscript = () => {
    if (window.confirm('Clear all text?')) {
      setTranscript('');
      setInterimTranscript('');
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript_${selectedLang.code}_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
          <Mic className="w-10 h-10 text-indigo-600" />
          Voice to Text AI
        </h2>
        <p className="text-neutral-500 text-lg font-medium">
          Accurate real-time transcription for English, Bangla, and Hindi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Languages className="w-3 h-3" /> Select Language
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      if (isListening) toggleListening();
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      selectedLang.code === lang.code
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-transparent bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      {lang.name}
                    </span>
                    {selectedLang.code === lang.code && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-50">
              <button
                onClick={toggleListening}
                className={`w-full py-6 rounded-[2rem] font-black text-2xl flex flex-col items-center gap-3 transition-all active:scale-95 shadow-xl ${
                  isListening
                    ? 'bg-red-500 text-white shadow-red-100'
                    : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-10 h-10" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10" />
                    <span>Start Voice Typing</span>
                  </>
                )}
              </button>
              
              {isListening && (
                <div className="mt-6 flex justify-center gap-1 h-8 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-red-400 rounded-full" 
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        transition: 'height 0.1s ease-in-out'
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-start gap-4 text-red-800"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-bold leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Output Display Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-2 border-neutral-100 rounded-[3rem] p-8 md:p-12 min-h-[600px] shadow-sm relative flex flex-col group">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-neutral-200'}`} />
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest italic">
                  {isListening ? 'Listening System Active' : 'System Idle'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!transcript}
                  className="p-4 bg-neutral-50 text-neutral-500 rounded-2xl hover:bg-neutral-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                >
                  {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                </button>
                <button
                  onClick={downloadTranscript}
                  disabled={!transcript}
                  className="p-4 bg-neutral-50 text-neutral-500 rounded-2xl hover:bg-neutral-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                >
                  <Download className="w-6 h-6" />
                </button>
                <button
                  onClick={clearTranscript}
                  disabled={!transcript}
                  className="p-4 bg-neutral-50 text-neutral-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-30"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 text-xl md:text-2xl font-medium text-neutral-800 leading-relaxed outline-none whitespace-pre-wrap min-h-[400px]">
              {transcript || interimTranscript ? (
                <>
                  {transcript}
                  <span className="text-neutral-300 italic">{interimTranscript}</span>
                  {isListening && (
                    <motion.span
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-1.5 h-7 bg-indigo-600 ml-1 translate-y-1"
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-10 text-center py-20 pointer-events-none">
                  <Mic className="w-32 h-32 mb-6" />
                  <p className="font-black text-2xl uppercase tracking-[0.2em]">Voice input will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[2.5rem] p-8 flex items-start gap-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 rotate-12 opacity-10">
                <Sparkles className="w-48 h-48" />
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Volume2 className="w-7 h-7 text-indigo-300" />
            </div>
            <div className="space-y-2 relative z-10">
              <p className="text-lg font-black tracking-tight">AI Multi-Language Engine</p>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium max-w-2xl">
                Supports deep dialect recognition for <strong>Bangla (Bangladesh & India)</strong> and <strong>Hindi</strong>. Perfect for fast note-taking, content creation, or accessibility. All audio is processed efficiently in the browser for maximum privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
