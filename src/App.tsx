import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Settings, 
  FileText, 
  Languages, 
  Image as ImageIcon, 
  FileCode, 
  Layers, 
  QrCode, 
  Search, 
  Zap, 
  Tag,
  FileSpreadsheet, 
  FileType, 
  ShieldAlert,
  Youtube,
  Video,
  Music,
  LayoutGrid,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FileDown,
  Monitor,
  Book,
  Hash,
  Mic,
  Volume2,
  User,
  Camera,
  BarChart2,
  Radio,
  Flame,
  Gamepad2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Tools
import { PDFMerge } from './components/tools/PDFMerge';
import { PDFCompress } from './components/tools/PDFCompress';
import { PDFTextEditor } from './components/tools/PDFTextEditor';
import { PDFToExcel } from './components/tools/PDFToExcel';
import { ExcelToPDF } from './components/tools/ExcelToPDF';
import { CopyrightRemoverAI } from './components/tools/CopyrightRemoverAI';
import { VideoCopyrightRemover } from './components/tools/VideoCopyrightRemover';
import { EnglishToBengaliDictionary } from './components/tools/EnglishToBengaliDictionary';
import { PDFPageNumbering } from './components/tools/PDFPageNumbering';
import { WordEditor } from './components/tools/WordEditor';
import { OCRTool } from './components/tools/OCRTool';
import { QRSuite } from './components/tools/QRSuite';
import { ImageBeautifier } from './components/tools/ImageBeautifier';
import { WatermarkRemover } from './components/tools/WatermarkRemover';
import { PictureMagicLayers } from './components/tools/PictureMagicLayers';
import { Calculator } from './components/tools/Calculator';
import { HEICConverter } from './components/tools/HEICConverter';
import { ScanToPDF } from './components/tools/ScanToPDF';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { PhotoEditor } from './components/tools/PhotoEditor';
import { STTAI } from './components/tools/STTAI';
import { TTSAI } from './components/tools/TTSAI';
import { Translator } from './components/tools/Translator';
import { PDFToWord } from './components/tools/PDFToWord';
import { WordToPDF } from './components/tools/WordToPDF';
import { VideoEditor } from './components/tools/VideoEditor';
import { VideoToAudio } from './components/tools/VideoToAudio';
import { AudioEditor } from './components/tools/AudioEditor';
import { BanglaCalendar } from './components/tools/BanglaCalendar';
import { Subscription } from './components/Subscription';
import { Profile } from './components/Profile';
import { ScreenshotEditor } from './components/tools/ScreenshotEditor';
import { HashtagGenerator } from './components/tools/HashtagGenerator';
import { YouTubeSEOTool } from './components/tools/YouTubeSEOTool';
import { YouTubeResearchTool } from './components/tools/YouTubeResearchTool';
import { YouTubeTagTool } from './components/tools/YouTubeTagTool';
import { SocialMediaTrendingTool } from './components/tools/SocialMediaTrendingTool';

const TOOL_CONFIG = [
  // Document Category
  { id: 'word-editor', name: 'Word Editor', description: 'Edit & Save docx', category: 'DOC', icon: FileText, color: 'bg-[#2563eb]', component: WordEditor },
  { id: 'pic-to-pdf', name: 'Pic to PDF', description: 'Convert image to PDF', category: 'DOC', icon: ImageIcon, color: 'bg-[#14b8a6]', component: PDFMerge }, 
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert doc to PDF', category: 'DOC', icon: FileText, color: 'bg-[#2563eb]', component: WordToPDF },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to doc', category: 'DOC', icon: FileDown, color: 'bg-[#0ea5e9]', component: PDFToWord },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert xls to PDF', category: 'DOC', icon: FileSpreadsheet, color: 'bg-[#059669]', component: ExcelToPDF },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF to xls', category: 'DOC', icon: FileUp, color: 'bg-[#0d9488]', component: PDFToExcel },
  { id: 'ppt-to-pdf', name: 'PPT to PDF', description: 'Convert ppt to PDF', category: 'DOC', icon: Monitor, color: 'bg-[#e11d48]', component: PDFMerge },
  { id: 'pdf-compress', name: 'Compress', description: 'Reduce file size', category: 'DOC', icon: Zap, color: 'bg-[#f59e0b]', component: PDFCompress },
  { id: 'pdf-text-editor', name: 'PDF Editor', description: 'Edit PDF text', category: 'DOC', icon: Settings, color: 'bg-[#ec4899]', component: PDFTextEditor },
  { id: 'pdf-merge', name: 'PDF Merge', description: 'Join PDF files', category: 'DOC', icon: FileCode, color: 'bg-[#8b5cf6]', component: PDFMerge },
  { id: 'pdf-pagination', name: 'Pagination', description: 'Add page numbers', category: 'DOC', icon: Hash, color: 'bg-[#14b8a6]', component: PDFPageNumbering },
  { id: 'scan-to-pdf', name: 'Scan to PDF', description: 'Mobile PDF scanner', category: 'DOC', icon: FileUp, color: 'bg-[#6366f1]', component: ScanToPDF },

  // AI & Media Category
  { id: 'video-editor', name: 'Video Studio Pro', description: 'Elite Trim & Merge', category: 'AI', icon: Video, color: 'bg-[#6366f1]', component: VideoEditor },
  { id: 'video-to-audio', name: 'Video to Audio', description: 'Extract Master Audio', category: 'AI', icon: Music, color: 'bg-[#a855f7]', component: VideoToAudio },
  { id: 'audio-editor', name: 'Audio Studio Pro', description: 'Trim & Merge Tracks', category: 'AI', icon: Mic, color: 'bg-[#f59e0b]', component: AudioEditor },
  { id: 'sm-trends', name: 'Social Trends', description: 'Live viral topics', category: 'AI', icon: Flame, color: 'bg-[#ff5722]', component: SocialMediaTrendingTool },
  { id: 'yt-tags', name: 'YT Tag Live', description: 'Viral tag generation', category: 'AI', icon: Tag, color: 'bg-[#ff0000]', component: YouTubeTagTool },
  { id: 'yt-research', name: 'YT Research', description: 'Live Market Intel', category: 'AI', icon: BarChart2, color: 'bg-[#ff0000]', component: YouTubeResearchTool },
  { id: 'yt-seo', name: 'YT SEO Pro', description: 'Rank your videos #1', category: 'AI', icon: Youtube, color: 'bg-[#ff0000]', component: YouTubeSEOTool },
  { id: 'hashtag-generator', name: 'AI Hashtag', description: 'Social Media tags', category: 'AI', icon: Hash, color: 'bg-[#ffca28]', component: HashtagGenerator },
  { id: 'screenshot-editor', name: 'SS Editor', description: 'Annotate & Redact', category: 'AI', icon: Camera, color: 'bg-[#06b6d4]', component: ScreenshotEditor },
  { id: 'bg-remover', name: 'BG Remover', description: 'AI background removal', category: 'AI', icon: Layers, color: 'bg-[#6366f1]', component: BackgroundRemover },
  { id: 'photo-editor', name: 'Photo Pro', description: 'Advanced image editor', category: 'AI', icon: ImageIcon, color: 'bg-[#d946ef]', component: PhotoEditor },
  { id: 'video-cr-remover', name: 'YouTube CR', description: 'Bypass Content ID', category: 'AI', icon: Youtube, color: 'bg-[#ef4444]', component: VideoCopyrightRemover },
  { id: 'copyright-ai', name: 'Image Eraser', description: 'Deep erase marks', category: 'AI', icon: ShieldAlert, color: 'bg-[#4f46e5]', component: CopyrightRemoverAI },
  { id: 'ocr', name: 'Image 2 Text', description: 'Extract text AI', category: 'AI', icon: FileText, color: 'bg-[#10b981]', component: OCRTool },
  { id: 'watermark-remover', name: 'No Watermark', description: 'AI Logo remover', category: 'AI', icon: Layers, color: 'bg-[#f43f5e]', component: WatermarkRemover },
  { id: 'magic-layers', name: 'Magic Layers', description: 'Text behind images', category: 'AI', icon: Layers, color: 'bg-[#8b5cf6]', component: PictureMagicLayers },
  { id: 'image-beautifier', name: 'Beautifier', description: 'AI Photo enhancement', category: 'AI', icon: Zap, color: 'bg-[#d946ef]', component: ImageBeautifier },

  // Utilities
  { id: 'qr-suite', name: 'QR Suite', description: 'Gen & Scan QR', category: 'UTIL', icon: QrCode, color: 'bg-[#06b6d4]', component: QRSuite },
  { id: 'calculator', name: 'Calcu AI', description: 'Voice Calculator', category: 'UTIL', icon: Box, color: 'bg-[#f59e0b]', component: Calculator },
  { id: 'heic-converter', name: 'HEIC 2 JPG', description: 'iPhone image fix', category: 'UTIL', icon: ImageIcon, color: 'bg-[#14b8a6]', component: HEICConverter },
  { id: 'stt-ai', name: 'Voice 2 Text', description: 'Real-time AI typing', category: 'UTIL', icon: Mic, color: 'bg-[#8b5cf6]', component: STTAI },
  { id: 'tts-ai', name: 'Text 2 Voice', description: 'AI natural speech', category: 'UTIL', icon: Volume2, color: 'bg-[#ec4899]', component: TTSAI },
  { id: 'bangla-calendar', name: 'Live Calendar', description: 'English & Bangla dual kit', category: 'UTIL', icon: CalendarIcon, color: 'bg-[#4f46e5]', component: BanglaCalendar },

  // Language
  { id: 'translator', name: 'Translate', description: 'AI Language expert', category: 'LANG', icon: Languages, color: 'bg-[#10b981]', component: Translator },
  { id: 'en-bn-dict', name: 'En-Bn Dict', description: 'AI Powered Dictionary', category: 'LANG', icon: Book, color: 'bg-[#6366f1]', component: EnglishToBengaliDictionary },
];

export default function App() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredTools = TOOL_CONFIG.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderActiveTool = () => {
    const tool = TOOL_CONFIG.find(t => t.id === activeTool);
    if (!tool) return null;
    const ToolComponent = tool.component;
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-screen pb-32"
      >
        <div className="p-6 md:p-10">
          <button 
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--app-blue)] font-bold mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-2">{tool.name}</h2>
            <p className="text-[var(--text-muted)] font-medium">{tool.description}</p>
          </div>
          
          <ToolComponent />
          
          <footer className="mt-20 pb-10 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Developer by <span className="text-blue-600">Md Mirazul Fakir</span>
            </p>
          </footer>
        </div>
      </motion.div>
    );
  };

  const [userStatus, setUserStatus] = useState({
    name: 'User',
    plan: 'Starter',
    requestsUsed: 12,
    isPro: false
  });

  const renderDashboard = () => {
    if (activeNav === 'plus') {
      return (
        <motion.div
          key="plus"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-6 md:p-8"
        >
          <Subscription userStatus={userStatus} onUpgrade={(plan: string) => setUserStatus(prev => ({ ...prev, plan, isPro: plan !== 'Starter' }))} />
        </motion.div>
      );
    }

    if (activeNav === 'profile') {
      return (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-6 md:p-8"
        >
          <Profile userStatus={userStatus} onUpdateName={(name: string) => setUserStatus(prev => ({ ...prev, name }))} />
        </motion.div>
      );
    }

    return (
      <motion.main 
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6 md:p-8 space-y-10 flex-1 pb-32"
      >
        {/* Greeting */}
        <section className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
            Hello, <span className="italic text-blue-600">{userStatus.name.split(' ')[0]}</span>
          </h2>
          <p className="text-lg font-medium text-[var(--text-muted)]">
            Which tool do you need today?
          </p>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">DOCUMENT SOLUTIONS</h3>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-blue-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'DOC').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'DOC').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Tools Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">AI & MEDIA</h3>
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-indigo-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'AI').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'AI').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Utilities Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">UTILITIES</h3>
            <div className="w-7 h-7 bg-cyan-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-cyan-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'UTIL').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'UTIL').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Language & Dictionary Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">LANGUAGE & LEARN</h3>
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-indigo-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'LANG').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'LANG').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <footer className="pt-10 pb-4 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Developer by <span className="text-blue-600">Md Mirazul Fakir</span>
          </p>
        </footer>
      </motion.main>
    );
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between sticky top-0 bg-[var(--app-bg)]/80 backdrop-blur-md z-50">
        <AnimatePresence mode="wait">
          {!isSearching && activeNav !== 'search' ? (
            <motion.div 
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Box className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black leading-none tracking-tight">MMF Tools</h1>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">UNIVERSAL KIT</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="search-input"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 mr-4"
            >
              <input 
                autoFocus
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-slate-100 dark:bg-white/5 rounded-2xl px-6 font-bold text-sm outline-none focus:ring-2 ring-blue-500/20"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => {
            if (activeNav === 'search') {
              setActiveNav('tools');
              setSearchQuery('');
              setIsSearching(false);
            } else {
              setIsSearching(!isSearching);
              if (isSearching) setSearchQuery('');
            }
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSearching || activeNav === 'search' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200'}`}
        >
          {isSearching || activeNav === 'search' ? <ChevronRight className="w-6 h-6" /> : <Search className="w-6 h-6" />}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {activeTool ? (
          renderActiveTool()
        ) : (
          renderDashboard()
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen-md px-6 pb-8 z-[100]">
        <div className="bg-[var(--nav-bg)] backdrop-blur-2xl rounded-[32px] border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-around py-4 px-2">
          {[
            { id: 'tools', label: 'TOOLS', icon: LayoutGrid },
            { id: 'search', label: 'SEARCH', icon: Search },
            { id: 'plus', label: 'PLUS', icon: Zap },
            { id: 'profile', label: 'PROFILE', icon: User },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setActiveTool(null);
                if (item.id === 'search') {
                  setIsSearching(true);
                } else {
                  setIsSearching(false);
                }
              }}
              className="flex flex-col items-center gap-1 min-w-[70px] relative transition-all active:scale-90"
            >
              <div className={`absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-600 transition-all ${activeNav === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
              <item.icon className={`w-6 h-6 transition-all ${activeNav === item.id ? 'text-blue-600 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[9px] font-black tracking-widest transition-all ${activeNav === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
