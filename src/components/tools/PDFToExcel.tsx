import React, { useState } from 'react';
import { FileCode, Download, Upload, Loader2, FileCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const convertPdfToExcel = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      const allData: string[][] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by vertical position
        const rows: { [key: number]: any[] } = {};
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!rows[y]) rows[y] = [];
          rows[y].push(item);
        });

        const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);
        sortedY.forEach(y => {
          const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
          const rowText = rowItems.map(item => item.str).join('   ').trim();
          const columns = rowText.split(/\s{3,}/);
          if (columns.length > 0 && columns[0] !== '') {
            allData.push(columns);
          }
        });
        setProgress(Math.round((i / numPages) * 100));
      }

      const ws = XLSX.utils.aoa_to_sheet(allData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '.xlsx');
      a.click();
      setSuccess(true);
    } catch (err) {
      setError('Failed to convert PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--ink)]">PDF to Excel</h3>
            <p className="text-sm text-slate-400 font-medium">Extract table data</p>
          </div>
        </div>

        {!file ? (
          <label className="relative group cursor-pointer block">
            <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center bg-[var(--bg)]/20 hover:border-emerald-500/50 transition-all">
              <Upload className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Upload PDF to Convert</p>
            </div>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-[var(--bg)]/50 p-6 rounded-2xl">
              <FileCode className="w-6 h-6 text-red-500" />
              <div className="flex-1 truncate font-bold text-[var(--ink)]">{file.name}</div>
            </div>
            <button
              onClick={convertPdfToExcel}
              disabled={isProcessing}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
              {isProcessing ? `Processing ${progress}%` : 'Convert to Excel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
