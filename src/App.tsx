import { ArrowRightLeft, Image as ImageIcon, FileText, FileType, FileDown, Hash, FileSpreadsheet, Presentation, Camera, Lock, LockOpen, Type, QrCode, LayoutGrid, Languages, Sparkles, Shield, Cpu, Zap, Github, Twitter, Linkedin, Globe, Mail, Phone, MapPin, ChevronRight, Search, Settings, FileStack, Calculator as CalculatorIcon, Wand2, Volume2, PenTool, Eraser, Smile, Layers, FileEdit, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import NumberToWords from './components/NumberToWords';
import PictureToPdf from './components/PictureToPdf';
import WordToPdf from './components/WordToPdf';
import PdfToWord from './components/PdfToWord';
import ExcelToPdf from './components/ExcelToPdf';
import PdfToExcel from './components/PdfToExcel';
import PowerPointToPdf from './components/PowerPointToPdf';
import PdfToPowerPoint from './components/PdfToPowerPoint';
import ScanToPdf from './components/ScanToPdf';
import PdfLock from './components/PdfLock';
import PdfUnlock from './components/PdfUnlock';
import PdfMerge from './components/PdfMerge';
import PictureToText from './components/PictureToText';
import QrScanner from './components/QrScanner';
import QrGenerator from './components/QrGenerator';
import HeicConverter from './components/HeicConverter';
import BanglaTranslator from './components/BanglaTranslator';
import Calculator from './components/Calculator';
import TextToSpeech from './components/TextToSpeech';

type Tab = 'home' | 'number-to-words' | 'picture-to-pdf' | 'word-to-pdf' | 'pdf-to-word' | 'excel-to-pdf' | 'pdf-to-excel' | 'powerpoint-to-pdf' | 'pdf-to-powerpoint' | 'scan-to-pdf' | 'pdf-merge' | 'pdf-lock' | 'pdf-unlock' | 'picture-to-text' | 'qr-scanner' | 'qr-generator' | 'heic-converter' | 'translator' | 'calculator' | 'text-to-speech';

interface Tool {
  id: Tab;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'PDF' | 'Image' | 'Utility' | 'Security';
  color: string;
}

const TOOLS: Tool[] = [
  { id: 'picture-to-pdf', name: 'Pic to PDF', description: 'Convert images to high-quality PDF files.', icon: ImageIcon, category: 'PDF', color: 'bg-blue-500' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Transform DOCX documents into PDF format.', icon: FileType, category: 'PDF', color: 'bg-blue-600' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Extract and edit PDF content in Word.', icon: FileDown, category: 'PDF', color: 'bg-sky-500' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert spreadsheets to PDF accurately.', icon: FileSpreadsheet, category: 'PDF', color: 'bg-emerald-600' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Turn PDF tables into editable spreadsheets.', icon: FileSpreadsheet, category: 'PDF', color: 'bg-teal-600' },
  { id: 'powerpoint-to-pdf', name: 'PPT to PDF', description: 'Convert presentations to PDF slides.', icon: Presentation, category: 'PDF', color: 'bg-orange-600' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PPT', description: 'Convert PDF files to editable PPT slides.', icon: Presentation, category: 'PDF', color: 'bg-amber-600' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', description: 'Capture documents using your camera.', icon: Camera, category: 'PDF', color: 'bg-indigo-600' },
  { id: 'pdf-merge', name: 'Merge PDF', description: 'Combine multiple PDF files into one.', icon: FileStack, category: 'PDF', color: 'bg-sky-600' },
  { id: 'pdf-lock', name: 'Lock PDF', description: 'Secure your PDF files with encryption.', icon: Lock, category: 'Security', color: 'bg-red-600' },
  { id: 'pdf-unlock', name: 'Unlock PDF', description: 'Remove passwords from protected PDFs.', icon: LockOpen, category: 'Security', color: 'bg-rose-600' },
  { id: 'picture-to-text', name: 'Pic to Text', description: 'Extract text from images using OCR.', icon: Type, category: 'Image', color: 'bg-violet-600' },
  { id: 'heic-converter', name: 'HEIC to JPG', description: 'Convert Apple HEIC photos to JPG/PNG.', icon: ImageIcon, category: 'Image', color: 'bg-fuchsia-600' },
  { id: 'qr-scanner', name: 'QR Scanner', description: 'Scan and decode QR codes instantly.', icon: QrCode, category: 'Utility', color: 'bg-neutral-800' },
  { id: 'qr-generator', name: 'QR Generator', description: 'Create custom QR codes effortlessly.', icon: LayoutGrid, category: 'Utility', color: 'bg-indigo-700' },
  { id: 'translator', name: 'Translator', description: 'AI-powered English to Bangla translation.', icon: Languages, category: 'Utility', color: 'bg-brand-500' },
  { id: 'number-to-words', name: 'Num to Words', description: 'Convert numbers into spoken text.', icon: Hash, category: 'Utility', color: 'bg-neutral-600' },
  { id: 'calculator', name: 'Calculator', description: 'Professional arithmetic calculator.', icon: CalculatorIcon, category: 'Utility', color: 'bg-neutral-900' },
  { id: 'text-to-speech', name: 'TTS AI', description: 'Convert text to natural speech voices.', icon: Volume2, category: 'Utility', color: 'bg-indigo-600' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const categories = ['PDF', 'Image', 'Security', 'Utility'] as const;

  const renderTool = () => {
    switch (activeTab) {
      case 'number-to-words': return <NumberToWords />;
      case 'picture-to-pdf': return <PictureToPdf />;
      case 'word-to-pdf': return <WordToPdf />;
      case 'pdf-to-word': return <PdfToWord />;
      case 'excel-to-pdf': return <ExcelToPdf />;
      case 'pdf-to-excel': return <PdfToExcel />;
      case 'powerpoint-to-pdf': return <PowerPointToPdf />;
      case 'pdf-to-powerpoint': return <PdfToPowerPoint />;
      case 'scan-to-pdf': return <ScanToPdf />;
      case 'pdf-merge': return <PdfMerge />;
      case 'pdf-lock': return <PdfLock />;
      case 'pdf-unlock': return <PdfUnlock />;
      case 'picture-to-text': return <PictureToText />;
      case 'qr-scanner': return <QrScanner />;
      case 'qr-generator': return <QrGenerator />;
      case 'heic-converter': return <HeicConverter />;
      case 'translator': return <BanglaTranslator />;
      case 'calculator': return <Calculator />;
      case 'text-to-speech': return <TextToSpeech />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-neutral-900 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 h-screen overflow-hidden">
      {/* App Bar / Header */}
      <header className="h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-neutral-100 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => { setActiveTab('home'); setIsSearchActive(false); }}
            className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-200 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-neutral-900 leading-none">
              {activeTab === 'home' ? 'MMF Tools' : TOOLS.find(t => t.id === activeTab)?.name}
            </h1>
            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mt-1">
              {activeTab === 'home' ? 'Universal Kit' : 'Active Tool'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchActive(!isSearchActive)}
            className={`p-2.5 rounded-xl transition-all ${isSearchActive ? 'bg-brand-500 text-white' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 overflow-y-auto relative pb-24 scroll-smooth bg-[#F8F9FE]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 md:p-12 space-y-10 max-w-5xl mx-auto w-full"
            >
              {/* Search Overlay/Animation */}
              {isSearchActive && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-8"
                >
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-14 pl-14 pr-6 bg-white border-2 border-brand-100 rounded-2xl shadow-sm focus:border-brand-500 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}

              {/* Greeting */}
              {!isSearchActive && (
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tight text-neutral-900">Hello, <span className="text-brand-500 italic">User</span></h2>
                  <p className="text-neutral-400 font-medium">Which tool do you need today?</p>
                </div>
              )}

              {/* Tools Categories */}
              {(isSearchActive ? ['Search Results'] : categories).map(category => {
                const categoryTools = isSearchActive 
                  ? filteredTools 
                  : TOOLS.filter(t => t.category === category);
                
                if (categoryTools.length === 0) return null;

                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em]">{category}</h3>
                      <span className="text-xs font-bold text-brand-500 bg-brand-50 px-2 py-1 rounded-md">{categoryTools.length}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {categoryTools.map(tool => (
                        <motion.button
                          key={tool.id}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => {
                            setActiveTab(tool.id);
                            setIsSearchActive(false);
                          }}
                          className="flex flex-col items-center text-center gap-4 p-6 bg-white border border-neutral-100 rounded-[2.5rem] shadow-sm active:shadow-inner active:bg-neutral-50 transition-all group lg:hover:border-brand-200 lg:hover:shadow-md"
                        >
                          <div className={`w-16 h-16 ${tool.color} text-white rounded-[1.75rem] flex items-center justify-center shadow-lg shadow-${tool.color.split('-')[1]}-100 shrink-0 group-hover:scale-110 transition-transform`}>
                             <tool.icon className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-800 leading-tight group-active:translate-y-0.5 transition-transform">{tool.name}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Developer Credit */}
              <div className="pt-12 pb-6 text-center">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
                  Developer Md Mirazul Fakir
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full bg-white md:bg-[#F8F9FE]"
            >
              <div className="max-w-4xl mx-auto w-full p-4 lg:p-12 pb-32">
                 <div className="hidden lg:flex items-center justify-between mb-8">
                    <button 
                      onClick={() => setActiveTab('home')}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-100 rounded-xl text-neutral-400 hover:text-brand-500 font-bold text-xs uppercase tracking-widest transition-all shadow-sm group"
                    >
                      <ArrowRightLeft className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      Back to Home
                    </button>
                    <div className="flex gap-2 p-1 bg-neutral-200/50 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
                      {TOOLS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap uppercase tracking-tighter ${activeTab === t.id ? 'bg-white text-brand-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="bg-white border-neutral-100 lg:border lg:rounded-[3rem] p-4 lg:p-12 lg:shadow-2xl lg:shadow-neutral-200/20 rounded-2xl shadow-sm">
                    {renderTool()}
                 </div>

                 <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
                      Developer Md Mirazul Fakir
                    </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Native App Style) */}
      <nav className="h-20 bg-white/90 backdrop-blur-2xl border-t border-neutral-100 px-8 flex items-center justify-around shrink-0 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
        {[
          { id: 'home', icon: LayoutGrid, label: 'Tools' },
          { id: 'search', icon: Search, label: 'Search', action: () => { setActiveTab('home'); setIsSearchActive(true); } },
          { id: 'premium', icon: Zap, label: 'Plus', action: () => alert('MMF Plus Coming Soon!') },
          { id: 'profile', icon: MapPin, label: 'Near Me', action: () => alert('Local features coming soon!') }
        ].map((item) => {
          const isActive = (activeTab === item.id && !isSearchActive) || (item.id === 'search' && isSearchActive);
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.85 }}
              onClick={item.action || (() => { setActiveTab(item.id as Tab); setIsSearchActive(false); })}
              className="flex flex-col items-center gap-1 min-w-[64px] relative group"
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'text-brand-500 bg-brand-50' : 'text-neutral-400 group-hover:text-neutral-600 group-hover:bg-neutral-50'}`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand-500/10' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-brand-500' : 'text-neutral-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-brand-500" 
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
