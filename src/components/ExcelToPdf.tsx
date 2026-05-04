import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { FileSpreadsheet, FileDown, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Tooltip from './Tooltip';

export default function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid Excel or CSV file');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const convertToPdf = async () => {
    if (!file || !hiddenContainerRef.current) return;
    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      let htmlContent = '';
      
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet);
        htmlContent += `<h2>${sheetName}</h2>${html}<br/><br/>`;
      });
      
      // Inject HTML into hidden container
      hiddenContainerRef.current.innerHTML = `
        <style>
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h2 { font-family: sans-serif; color: #333; }
        </style>
        ${htmlContent}
      `;
      
      // Convert to PDF
      const opt = {
        margin:       0.5,
        filename:     file.name.replace(/\.(xlsx|xls|csv)$/, '.pdf'),
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' as const }
      };
      
      await html2pdf().set(opt).from(hiddenContainerRef.current).save();
      
      // Clear container
      hiddenContainerRef.current.innerHTML = '';
    } catch (error) {
      console.error('Error converting Excel to PDF:', error);
      alert('Failed to convert document. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          Excel to PDF Converter
        </h2>
        <p className="text-neutral-500 text-lg">
          Upload an Excel (.xlsx, .xls) or CSV file to convert it into a PDF document.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {!file ? (
          <div
            className={`relative w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-200 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-neutral-300 bg-white hover:border-emerald-400 hover:bg-neutral-50'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
                e.target.value = '';
              }}
            />
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-neutral-800">
                Drag & drop an Excel file here
              </p>
              <p className="text-neutral-500 mt-1">
                or click to browse from your device
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
              Select Excel File
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                Selected File
              </h3>
            </div>
            
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{file.name}</p>
                    <p className="text-sm text-neutral-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Tooltip content="Remove file">
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={convertToPdf}
                disabled={isConverting}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isConverting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Converting to PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={hiddenContainerRef} className="hidden" />
    </div>
  );
}
