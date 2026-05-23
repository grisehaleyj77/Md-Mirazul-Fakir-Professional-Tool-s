import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Loader2, 
  FileCheck, 
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  Layout,
  Maximize2,
  Minimize2,
  Trash2,
  Edit2,
  AlignLeft,
  Settings,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

type PagePreset = 'a4' | 'letter';
type PageOrientation = 'portrait' | 'landscape';
type MarginSize = 'none' | 'narrow' | 'normal' | 'wide';
type FontStyle = 'sans' | 'serif' | 'mono';
type ThemePreset = 'corporate' | 'academic' | 'modern' | 'warm';

export const WordToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Custom document settings
  const [pageSize, setPageSize] = useState<PagePreset>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [marginSize, setMarginSize] = useState<MarginSize>('normal');
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [themePreset, setThemePreset] = useState<ThemePreset>('corporate');
  const [textSize, setTextSize] = useState<string>('text-sm md:text-base');
  const [lineSpacing, setLineSpacing] = useState<string>('leading-relaxed');
  
  // Real-time editable HTML preview
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processSelectedFile(selectedFile);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    if (selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
      setStatus('idle');
      setError(null);
      setIsProcessing(true);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        if (result.value) {
          setHtmlContent(result.value);
        } else {
          setHtmlContent('<p className="text-gray-400 italic">This document is empty.</p>');
        }
      } catch (err) {
        console.error('Mammoth parsing error:', err);
        setError('Error reading the Word file. Ensure it is a valid .docx document.');
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setError('Unsupported file type. Please upload a valid Microsoft Word (.docx) file.');
      setFile(null);
    }
  };

  const convertToPDF = async () => {
    if (!file) return;

    // Get final HTML content from the editor/preview if it exists
    let finalHtml = htmlContent;
    if (editorRef.current) {
      finalHtml = editorRef.current.innerHTML;
      setHtmlContent(finalHtml);
    }

    setIsProcessing(true);
    setStatus('converting');
    setError(null);

    try {
      // Create a dedicated off-screen or container element styled for PDF export
      const container = document.createElement('div');
      container.className = `pdf-export-container ${getFontClass()} ${getThemeBgClass()} ${getThemeTextClass()}`;
      
      // Setup structural padding corresponding to margin selection
      let pClass = 'p-12';
      if (marginSize === 'none') pClass = 'p-0';
      else if (marginSize === 'narrow') pClass = 'p-6';
      else if (marginSize === 'wide') pClass = 'p-20';

      container.innerHTML = `
        <div class="${pClass} ${textSize} ${lineSpacing} docx-rendered-content max-w-full">
          ${finalHtml}
        </div>
      `;

      // Apply styling overrides for elegant typography inside export
      const style = document.createElement('style');
      style.innerHTML = `
        .pdf-export-container h1 { font-size: 24pt; font-weight: 800; margin-bottom: 16pt; color: ${themePreset === 'corporate' ? '#1e3a8a' : '#111827'}; line-height: 1.2; border-bottom: 1px solid #e5e7eb; padding-bottom: 6pt; }
        .pdf-export-container h2 { font-size: 18pt; font-weight: 700; margin-top: 18pt; margin-bottom: 12pt; color: ${themePreset === 'corporate' ? '#2563eb' : '#374151'}; }
        .pdf-export-container h3 { font-size: 14pt; font-weight: 700; margin-top: 14pt; margin-bottom: 8pt; }
        .pdf-export-container p { margin-bottom: 10pt; text-align: justify; }
        .pdf-export-container ul { list-style-type: disc; margin-left: 20pt; margin-bottom: 10pt; }
        .pdf-export-container ol { list-style-type: decimal; margin-left: 20pt; margin-bottom: 10pt; }
        .pdf-export-container li { margin-bottom: 4pt; }
        .pdf-export-container table { width: 100%; border-collapse: collapse; margin-top: 12pt; margin-bottom: 12pt; font-size: 10pt; }
        .pdf-export-container th { background-color: #f3f4f6; padding: 8px; border: 1px solid #d1d5db; font-weight: bold; text-align: left; }
        .pdf-export-container td { padding: 8px; border: 1px solid #e5e7eb; }
        .pdf-export-container blockquote { border-left: 4px solid #3b82f6; padding-left: 12pt; margin-left: 0; color: #4b5563; font-style: italic; }
      `;
      container.appendChild(style);

      // Define page dimension metrics
      const isPortrait = orientation === 'portrait';
      const widthMm = pageSize === 'a4' ? (isPortrait ? 210 : 297) : (isPortrait ? 215.9 : 279.4);
      const heightMm = pageSize === 'a4' ? (isPortrait ? 297 : 210) : (isPortrait ? 279.4 : 215.9);

      const opt = {
        margin: 0, // already custom computed in padding class
        filename: file.name.replace(/\.[^/.]+$/, "") + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: pageSize, 
          orientation: orientation 
        }
      } as any;

      // Generate and trigger download
      await html2pdf().from(container).set(opt).save();
      
      setStatus('done');
    } catch (err) {
      console.error('PDF Generation error:', err);
      setError('Could not compile PDF. Word documents containing heavy multi-layered charts or tables might exceed default render sizes.');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFontClass = () => {
    switch (fontStyle) {
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      default: return 'font-serif';
    }
  };

  const getThemeBgClass = () => {
    switch (themePreset) {
      case 'warm': return 'bg-amber-50/40';
      case 'academic': return 'bg-amber-50/20';
      case 'modern': return 'bg-slate-50';
      default: return 'bg-white';
    }
  };

  const getThemeTextClass = () => {
    switch (themePreset) {
      case 'warm': return 'text-[#2d2216]';
      case 'academic': return 'text-slate-900';
      case 'modern': return 'text-slate-800';
      default: return 'text-gray-900';
    }
  };

  const handleReset = () => {
    setFile(null);
    setHtmlContent('');
    setStatus('idle');
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="word-to-pdf-suite">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Setup Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2.5 font-black text-gray-900 tracking-tight text-lg">
                <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                Word to PDF Pro
              </span>
              {file && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Convert your Microsoft Word documents (<code className="font-mono text-xs text-red-600 font-semibold bg-red-50 px-1 rounded">.docx</code>) with high layout fidelity into ready-to-share PDF files. Adjust paper settings, text layout, and even edit content live.
            </p>

            {!file ? (
              <div 
                className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/40 scale-[0.99]' 
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".docx" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-black text-slate-800 text-base">Drag & Drop Word File</p>
                <p className="text-xs text-slate-400 mt-2">Supports any standard <strong>.docx</strong>, size limit 15MB</p>
                
                <div className="mt-5 px-4 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm text-xs font-bold text-blue-600 hover:scale-105 transition-all">
                  Browse Files
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mr-3 shadow-md">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-blue-500 font-black tracking-widest uppercase">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Word DocX
                    </p>
                  </div>
                </div>

                {/* Submitting Actions */}
                <div className="space-y-3">
                  <button
                    onClick={convertToPDF}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${
                      status === 'done'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700'
                    } disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        COMPILING EXPORT...
                      </>
                    ) : status === 'done' ? (
                      <>
                        <FileCheck className="w-4 h-4" />
                        EXPORT SUCCESSFUL!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        CONVERT & DOWNLOAD PDF
                      </>
                    )}
                  </button>

                  {status === 'done' && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-800 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      Converted correctly! Check your default downloads system directory.
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-4 mt-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Configuration Workspace Settings */}
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                Layout & Format Presets
              </h3>

              <div className="space-y-4">
                
                {/* Size and Orientation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Page Size</label>
                    <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
                      <button 
                        onClick={() => setPageSize('a4')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pageSize === 'a4' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        A4
                      </button>
                      <button 
                        onClick={() => setPageSize('letter')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pageSize === 'letter' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        Letter
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Orientation</label>
                    <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
                      <button 
                        onClick={() => setOrientation('portrait')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${orientation === 'portrait' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        Portrait
                      </button>
                      <button 
                        onClick={() => setOrientation('landscape')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${orientation === 'landscape' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Page Margins</label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {(['none', 'narrow', 'normal', 'wide'] as MarginSize[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMarginSize(m)}
                        className={`py-1.5 text-[11px] font-bold capitalize rounded-lg ${marginSize === m ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Profiles */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Font Type</label>
                    <select
                      value={fontStyle}
                      onChange={(e) => setFontStyle(e.target.value as FontStyle)}
                      className="w-full text-xs font-medium p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800"
                    >
                      <option value="serif">Standard Serif</option>
                      <option value="sans">Modern Sans-Serif</option>
                      <option value="mono">Tech Monospace</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Theme Palette</label>
                    <select
                      value={themePreset}
                      onChange={(e) => setThemePreset(e.target.value as ThemePreset)}
                      className="w-full text-xs font-medium p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800"
                    >
                      <option value="corporate">Classic Business</option>
                      <option value="warm">Warm Reader</option>
                      <option value="academic">Editorial Cream</option>
                      <option value="modern">Minimal Stark</option>
                    </select>
                  </div>
                </div>

                {/* Sizes and spacing adjustment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Text Size</label>
                    <select
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      className="w-full text-xs font-medium p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800"
                    >
                      <option value="text-xs md:text-sm">Compact (S)</option>
                      <option value="text-sm md:text-base">Standard (M)</option>
                      <option value="text-base md:text-lg">Generous (L)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Line Spacing</label>
                    <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
                      <button 
                        onClick={() => setLineSpacing('leading-snug')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${lineSpacing === 'leading-snug' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        1.15
                      </button>
                      <button 
                        onClick={() => setLineSpacing('leading-normal')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${lineSpacing === 'leading-normal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        1.5
                      </button>
                      <button 
                        onClick={() => setLineSpacing('leading-loose')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${lineSpacing === 'leading-loose' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                      >
                        2.0
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Safety & Privacy Guarantee</h4>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Converted instantly inside your browser safely.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Zero permanent document storage or metadata indexing.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Supports docx styling including standard margins, lines, and tables.
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Document Editor & Real-time page sheet */}
        <div className="lg:col-span-7">
          {file ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Toolbar of preview container */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white px-5 py-3.5 border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 tracking-wider uppercase">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    LIVE CANVAS PREVIEW
                  </span>
                  {isEditing && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Edit2 className="w-2.5 h-2.5 animate-pulse" />
                      Editor Mode
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition duration-200 ${
                      isEditing 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {isEditing ? 'Save Changes' : 'Edit Text In Preview'}
                  </button>
                </div>
              </div>

              {/* Main physical paper sheet component */}
              <div 
                className="overflow-x-auto w-full flex justify-center py-4 rounded-3xl"
              >
                <div 
                  ref={editorRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                  className={`
                    ${getFontClass()} 
                    ${getThemeBgClass()} 
                    ${getThemeTextClass()}
                    shadow-2xl 
                    rounded-2xl
                    border border-gray-100
                    transition-all 
                    duration-300
                    w-full 
                    outline-none
                    min-h-[500px]
                    ${pageSize === 'a4' ? 'max-w-[794px]' : 'max-w-[816px]'}
                    ${orientation === 'portrait' ? 'aspect-[1/1.414]' : 'aspect-[1.414/1]'}
                    ${marginSize === 'none' ? 'p-0' : marginSize === 'narrow' ? 'p-6 md:p-8' : marginSize === 'wide' ? 'p-12 md:p-20' : 'p-8 md:p-14'}
                    ${textSize}
                    ${lineSpacing}
                    docx-rendered-content
                  `}
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <p className="text-center text-xs text-amber-600 font-bold uppercase tracking-wider">
                  ⚠️ Feel free to edit layout elements directly in the page above!
                </p>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-50/50 border border-slate-100 rounded-[32px] p-8">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-sm text-slate-300 mb-4 animate-bounce">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800 text-lg">Waiting for Document</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Upload your word file in the left panel to configure formats, preview formatting, and compile a beautiful PDF file instantly.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
