import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, Copy, Check, Languages, Loader2, Volume2 } from 'lucide-react';

export const STTAI = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('bn-BD'); // Default to Bangla
  const [copied, setCopied] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + event.results[i][0].transcript + ' ');
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setLanguage('bn-BD')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'bn-BD' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500'}`}
              >
                Bangla
              </button>
              <button 
                onClick={() => setLanguage('en-US')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'en-US' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('hi-IN')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'hi-IN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500'}`}
              >
                Hindi
              </button>
           </div>

           <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' 
                  : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700'
                }`}
              >
                {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? 'Stop Listening' : 'Start Recording'}
              </button>
           </div>
        </div>

        <div className="relative group">
           <div className="w-full min-h-[400px] bg-gray-50 border border-transparent rounded-3xl p-8 transition-all group-focus-within:bg-white group-focus-within:border-indigo-100">
              {transcript || interimTranscript ? (
                <div className="text-xl leading-relaxed text-gray-800 font-medium">
                   {transcript}
                   <span className="text-indigo-400 italic">{interimTranscript}</span>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30">
                   <Mic className="w-16 h-16 mb-4" />
                   <p className="text-lg font-bold">Say something...</p>
                   <p className="text-sm">Click the button above to start converting voice to text.</p>
                </div>
              )}
           </div>

           {(transcript || interimTranscript) && (
              <div className="absolute bottom-6 right-6 flex gap-3">
                 <button 
                   onClick={() => setTranscript('')} 
                   className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-red-500 transition-all shadow-sm"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={copyToClipboard}
                   className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"
                 >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                 </button>
              </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
           <h4 className="font-bold text-indigo-900 mb-2">High Accuracy</h4>
           <p className="text-xs text-indigo-700/70">Uses advanced browser recognition engine for 95%+ accuracy in stable environments.</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
           <h4 className="font-bold text-blue-900 mb-2">Multi-lingual</h4>
           <p className="text-xs text-blue-700/70">Seamlessly switch between Bangla, English, and Hindi voice profiles.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
           <h4 className="font-bold text-purple-900 mb-2">Real-time</h4>
           <p className="text-xs text-purple-700/70">Watch your words appear instantly as you speak with interim results processing.</p>
        </div>
      </div>
    </div>
  );
};
