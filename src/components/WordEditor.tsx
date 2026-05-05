import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Type, Save, Eraser, FileEdit, Wand2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mammoth from 'mammoth';
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';

export default function WordEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.docx')) {
      alert('Please upload a .docx file.');
      return;
    }

    setIsProcessing(true);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to load Word document. Ensure it is a valid .docx file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!content) return;
    setIsProcessing(true);

    try {
      const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`;
      const docxBlob = await asBlob(fullHtml, {
        orientation: 'portrait',
        margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      });

      const url = URL.createObjectURL(docxBlob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file?.name || 'document.docx'}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 flex items-center gap-4">
          <FileEdit className="w-10 h-10 text-brand-600" />
          Word File Editor
        </h2>
        <p className="text-neutral-500 text-lg font-medium">
          Edit your Word documents online with our professional rich text editor.
        </p>
      </div>

      {!file ? (
        <div
          className={`w-full border-2 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50 scale-[0.98]'
              : 'border-neutral-200 bg-white hover:border-brand-400 hover:bg-neutral-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept=".docx"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-brand-100/50">
            <Upload className="w-12 h-12" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black text-neutral-800 tracking-tight">Drop .docx here to edit</p>
            <p className="text-neutral-500 font-medium italic">High-fidelity conversion powered by AI-ready engines</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-neutral-900 text-white font-black text-lg rounded-[2rem] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95"
          >
            Select Document
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[2rem] border border-neutral-100 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={reset}
                className="p-3 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <p className="text-sm font-black text-neutral-900 line-clamp-1">{file.name}</p>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Live Editing Session</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-8 py-3 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              Save & Download
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border-2 border-neutral-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            <style>{`
              .quill { 
                height: 600px;
                display: flex;
                flex-direction: column;
              }
              .ql-toolbar {
                border: none !important;
                border-bottom: 2px solid #f5f5f5 !important;
                padding: 1.5rem !important;
                background: #fafafa;
              }
              .ql-container {
                border: none !important;
                flex: 1;
                font-family: 'Inter', sans-serif !important;
                font-size: 16px !important;
              }
              .ql-editor {
                padding: 3rem 4rem !important;
                line-height: 1.6;
              }
              .ql-editor h1 { font-weight: 800; font-size: 2.5rem; margin-bottom: 1.5rem; }
              .ql-editor h2 { font-weight: 800; font-size: 2rem; margin-bottom: 1rem; }
            `}</style>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ],
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-brand-50 border border-brand-100 rounded-[2.5rem] p-8 flex items-start gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
          <Wand2 className="w-7 h-7 text-brand-600" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-black text-brand-900">Professional Extraction Engine</p>
          <p className="text-sm text-brand-800/80 leading-relaxed font-medium">
            Our Word Editor uses <strong>Mammoth.js</strong> to ensure structural integrity during conversion. Unlike standard converters, we prioritize paragraphs, headings, and lists to keep your document clean and ready for professional use.
          </p>
        </div>
      </div>
    </div>
  );
}
