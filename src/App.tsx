import React, { useState } from 'react';
import { ArrowRightLeft, Image as ImageIcon, FileText, FileType, FileDown, Hash, FileSpreadsheet, Presentation, Camera, Lock, LockOpen, Type, QrCode, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import PictureToText from './components/PictureToText';
import QrScanner from './components/QrScanner';
import QrGenerator from './components/QrGenerator';
import HeicConverter from './components/HeicConverter';

type Tab = 'number-to-words' | 'picture-to-pdf' | 'word-to-pdf' | 'pdf-to-word' | 'excel-to-pdf' | 'pdf-to-excel' | 'powerpoint-to-pdf' | 'pdf-to-powerpoint' | 'scan-to-pdf' | 'pdf-lock' | 'pdf-unlock' | 'picture-to-text' | 'qr-scanner' | 'qr-generator' | 'heic-converter';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('number-to-words');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full py-6 px-8 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md border-2 border-indigo-100 ring-2 ring-indigo-50">
              <img 
                src="/logo.png" 
                alt="Md Mirazul Fakir Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to avatar if logo.png is not uploaded yet
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Md+Mirazul+Fakir&background=4f46e5&color=fff&size=128";
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                Md Mirazul Fakir
              </h1>
              <span className="text-sm font-medium text-indigo-600">Professional Tools</span>
            </div>
          </motion.div>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center bg-neutral-100/80 p-1.5 rounded-2xl gap-1 shadow-inner">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('number-to-words')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'number-to-words'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Hash className="w-4 h-4" />
              Num to Words
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('picture-to-pdf')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'picture-to-pdf'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Pic to PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('word-to-pdf')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'word-to-pdf'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <FileType className="w-4 h-4" />
              Word to PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pdf-to-word')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'pdf-to-word'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <FileDown className="w-4 h-4" />
              PDF to Word
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('excel-to-pdf')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'excel-to-pdf'
                  ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel to PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pdf-to-excel')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'pdf-to-excel'
                  ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              PDF to Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('powerpoint-to-pdf')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'powerpoint-to-pdf'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Presentation className="w-4 h-4" />
              PPT to PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pdf-to-powerpoint')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'pdf-to-powerpoint'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Presentation className="w-4 h-4" />
              PDF to PPT
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('scan-to-pdf')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'scan-to-pdf'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              Scan to PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pdf-lock')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'pdf-lock'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              Lock PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pdf-unlock')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'pdf-unlock'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <LockOpen className="w-4 h-4" />
              Unlock PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('picture-to-text')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'picture-to-text'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <Type className="w-4 h-4" />
              Pic to Text
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('qr-scanner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'qr-scanner'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Scanner
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('qr-generator')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'qr-generator'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              QR Generator
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('heic-converter')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'heic-converter'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              HEIC to JPG
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'number-to-words' && (
            <motion.div
              key="number-to-words"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <NumberToWords />
            </motion.div>
          )}
          {activeTab === 'picture-to-pdf' && (
            <motion.div
              key="picture-to-pdf"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PictureToPdf />
            </motion.div>
          )}
          {activeTab === 'word-to-pdf' && (
            <motion.div
              key="word-to-pdf"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <WordToPdf />
            </motion.div>
          )}
          {activeTab === 'pdf-to-word' && (
            <motion.div
              key="pdf-to-word"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PdfToWord />
            </motion.div>
          )}
          {activeTab === 'excel-to-pdf' && (
            <motion.div
              key="excel-to-pdf"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ExcelToPdf />
            </motion.div>
          )}
          {activeTab === 'pdf-to-excel' && (
            <motion.div
              key="pdf-to-excel"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PdfToExcel />
            </motion.div>
          )}
          {activeTab === 'powerpoint-to-pdf' && (
            <motion.div
              key="powerpoint-to-pdf"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PowerPointToPdf />
            </motion.div>
          )}
          {activeTab === 'pdf-to-powerpoint' && (
            <motion.div
              key="pdf-to-powerpoint"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PdfToPowerPoint />
            </motion.div>
          )}
          {activeTab === 'scan-to-pdf' && (
            <motion.div
              key="scan-to-pdf"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ScanToPdf />
            </motion.div>
          )}
          {activeTab === 'pdf-lock' && (
            <motion.div
              key="pdf-lock"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PdfLock />
            </motion.div>
          )}
          {activeTab === 'pdf-unlock' && (
            <motion.div
              key="pdf-unlock"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PdfUnlock />
            </motion.div>
          )}
          {activeTab === 'picture-to-text' && (
            <motion.div
              key="picture-to-text"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PictureToText />
            </motion.div>
          )}
          {activeTab === 'qr-scanner' && (
            <motion.div
              key="qr-scanner"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <QrScanner />
            </motion.div>
          )}
          {activeTab === 'qr-generator' && (
            <motion.div
              key="qr-generator"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <QrGenerator />
            </motion.div>
          )}
          {activeTab === 'heic-converter' && (
            <motion.div
              key="heic-converter"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <HeicConverter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
