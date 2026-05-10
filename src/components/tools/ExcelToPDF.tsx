import React, { useState } from 'react';
import { Download, Upload, Loader2, FileCheck, AlertCircle, FileType, FileCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'motion/react';

export const ExcelToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError('Please select a valid Excel or CSV file.');
    }
  };

  const convertExcelToPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const doc = new jsPDF();
      
      workbook.SheetNames.forEach((sheetName, index) => {
        if (index > 0) doc.addPage();
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 0) {
          doc.text(`Sheet: ${sheetName}`, 14, 15);
          autoTable(doc, {
            head: [jsonData[0] as any[]],
            body: jsonData.slice(1) as any[][],
            startY: 20,
            styles: { fontSize: 8 },
          });
        }
      });

      doc.save(file.name.replace(/\.[^/.]+$/, "") + ".pdf");
      setSuccess(true);
    } catch (err) {
      setError('Failed to convert Excel.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-3xl p-8 border border-[var(--glass-border)] shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl text-blue-600">
            <FileType className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Excel to PDF</h3>
            <p className="text-sm text-slate-400 font-medium">Convert spreadsheets to documents</p>
          </div>
        </div>

        {!file ? (
          <label className="relative group cursor-pointer block">
            <div className="py-20 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center bg-[var(--bg)]/20 hover:border-blue-500/50 transition-all">
              <Upload className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Select Excel (.xlsx, .csv)</p>
            </div>
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-[var(--bg)]/50 p-6 rounded-2xl">
              <FileCode className="w-6 h-6 text-emerald-500" />
              <div className="flex-1 truncate font-bold">{file.name}</div>
            </div>
            <button
              onClick={convertExcelToPdf}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
