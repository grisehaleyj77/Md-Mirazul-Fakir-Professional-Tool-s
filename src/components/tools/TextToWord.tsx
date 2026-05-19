import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const TextToWord = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [alignment, setAlignment] = useState<any>(AlignmentType.LEFT);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleExport = async () => {
    if (!text.trim()) return;
    setIsExporting(true);

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title || 'Untitled Document',
                heading: 'Heading1',
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              ...text.split('\n').map(line => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      bold: isBold,
                      italics: isItalic,
                    }),
                  ],
                  alignment: alignment,
                  spacing: { after: 200 },
                })
              ),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title || 'document'}.docx`);
    } catch (error) {
      console.error('Error creating Word document:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Clear all text?')) {
      setText('');
      setTitle('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Text to Word</h2>
            <p className="text-xs text-slate-500">Convert plain text to professional documents</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            disabled={!text.trim() || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export .docx'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Alignment
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setAlignment(AlignmentType.LEFT)}
                  className={`flex-1 p-2 rounded-lg transition-all ${alignment === AlignmentType.LEFT ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlignLeft size={18} className="mx-auto" />
                </button>
                <button
                  onClick={() => setAlignment(AlignmentType.CENTER)}
                  className={`flex-1 p-2 rounded-lg transition-all ${alignment === AlignmentType.CENTER ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlignCenter size={18} className="mx-auto" />
                </button>
                <button
                  onClick={() => setAlignment(AlignmentType.RIGHT)}
                  className={`flex-1 p-2 rounded-lg transition-all ${alignment === AlignmentType.RIGHT ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlignRight size={18} className="mx-auto" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Style
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`flex-1 p-2 border rounded-xl transition-all ${isBold ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Bold size={18} className="mx-auto" />
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`flex-1 p-2 border rounded-xl transition-all ${isItalic ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Italic size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-400">Editor</span>
              <span className="text-xs text-slate-400">{text.length} characters | {text.split(/\s+/).filter(x => x).length} words</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className={`flex-1 w-full p-6 focus:outline-none resize-none text-slate-700 leading-relaxed ${alignment === AlignmentType.CENTER ? 'text-center' : alignment === AlignmentType.RIGHT ? 'text-right' : 'text-left'} ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
            />
          </div>
        </div>
      </div>

      {!text.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-700"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FileText size={18} />
          </div>
          <p className="text-sm font-medium">Ready to start? Type or paste your content to preview and export.</p>
        </motion.div>
      )}
    </div>
  );
};
