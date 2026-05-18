import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Loader2, 
  Plus, 
  Trash2, 
  Save, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic,
  Underline
} from 'lucide-react';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { motion, AnimatePresence } from 'framer-motion';

export const WordEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.docx')) {
      alert('Please upload a .docx file');
      return;
    }

    setIsProcessing(true);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setContent(result.value);
    } catch (error) {
      console.error('Error reading docx:', error);
      alert('Failed to read document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: content.split('\n').map(line => 
              new Paragraph({
                children: [new TextRun(line)],
              })
            ),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file ? `edited_${file.name}` : 'document.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving docx:', error);
      alert('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setFile(null);
    setContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[32px] p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">Word Editor</h3>
              <p className="text-sm text-slate-400 font-medium">Edit and save .docx documents</p>
            </div>
          </div>

          {!file ? (
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-black cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4" />
              Upload Docx
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".docx" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          ) : (
            <button 
              onClick={reset}
              className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Reading Document...</p>
            </motion.div>
          ) : file ? (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Bold className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Italic className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1" />
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><AlignRight className="w-4 h-4" /></button>
              </div>

              {/* Text Area */}
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] text-lg font-medium text-[var(--text-main)] outline-none focus:ring-2 ring-blue-500/20 transition-all resize-none"
                placeholder="Start typing your document..."
              />

              <button 
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                Save Document
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] text-center bg-slate-50/50 dark:bg-white/5"
            >
              <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h4 className="text-xl font-bold mb-2">Editor is Empty</h4>
              <p className="text-slate-400 font-medium">Upload a .docx file to begin editing</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
