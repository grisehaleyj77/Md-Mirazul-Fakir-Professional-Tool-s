import React, { useState } from 'react';
import { FileText, Download, Upload, Loader2, FileCheck, AlertCircle } from 'lucide-react';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

export const WordToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'converting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        setStatus('idle');
        setError(null);
      } else {
        setError('Please upload a valid .docx file');
        setFile(null);
      }
    }
  };

  const convertToPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus('converting');
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Create a temporary container for HTML content
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.fontFamily = 'serif';
      container.style.color = '#333';
      container.style.lineHeight = '1.6';
      container.innerHTML = html;

      // Options for html2pdf
      const opt = {
        margin: [10, 10, 10, 10],
        filename: file.name.replace('.docx', '.pdf'),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      } as any;

      // Generate PDF
      await html2pdf().from(container).set(opt).save();
      
      setStatus('done');
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Could not convert file. Some Word elements might not be supported.');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Word to PDF Converter
        </h3>

        {!file ? (
          <div className="relative group">
            <input 
              type="file" 
              accept=".docx" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center group-hover:border-blue-400 transition-colors">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-700">Choose .docx file</p>
              <p className="text-xs text-gray-400 mt-2 lowercase">drag and drop or click to browse</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{file.name}</p>
                <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Selected</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2"
              >
                REMOVE
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={convertToPDF}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                status === 'done' 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  CONVERTING...
                </>
              ) : status === 'done' ? (
                <>
                  <FileCheck className="w-5 h-5" />
                  DOWNLOADED SUCCESSFUL
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  CONVERT TO PDF
                </>
              )}
            </button>

            {status === 'done' && (
              <p className="text-center text-xs text-green-600 font-bold uppercase tracking-widest mt-4">
                Saved! Look in your downloads folder.
              </p>
            )}
          </div>
        )}

        <div className="mt-12 space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">How it works</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <span className="text-[10px] font-black text-blue-600 mb-2 block">STEP 1</span>
              <p className="text-[11px] font-medium text-gray-600">Select any Microsoft Word document (.docx).</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <span className="text-[10px] font-black text-blue-600 mb-2 block">STEP 2</span>
              <p className="text-[11px] font-medium text-gray-600">Our engine parses the document structure.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <span className="text-[10px] font-black text-blue-600 mb-2 block">STEP 3</span>
              <p className="text-[11px] font-medium text-gray-600">Your PDF is generated and downloaded instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
