import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Grid,
  BarChart3,
  RefreshCw,
  FolderOpen,
  X,
  FileDown,
  ChevronRight,
  Type,
  FileCode,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Global styles & defaults
const DEFAULT_COLS = 12; // A to L
const DEFAULT_ROWS = 30;

interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  bg?: string;
  color?: string;
  format?: 'general' | 'number' | 'currency' | 'percent';
}

interface CellData {
  value: string;
  style?: CellStyle;
}

interface SheetState {
  [cellId: string]: CellData;
}

// Helper to convert column index to Excel column name (e.g., 0 -> A, 27 -> AB)
const getColName = (idx: number): string => {
  let name = '';
  let temp = idx;
  while (temp >= 0) {
    name = String.fromCharCode((temp % 26) + 65) + name;
    temp = Math.floor(temp / 26) - 1;
  }
  return name;
};

// Helper to parse Excel column name to column index (e.g., "A" -> 0)
const parseColName = (name: string): number => {
  let idx = 0;
  for (let i = 0; i < name.length; i++) {
    idx = idx * 26 + (name.charCodeAt(i) - 64);
  }
  return idx - 1;
};

export const ExcelEditor = () => {
  // Grid bounds
  const [colsCount, setColsCount] = useState(DEFAULT_COLS);
  const [rowsCount, setRowsCount] = useState(DEFAULT_ROWS);

  // Spreadsheet state
  const [sheetData, setSheetData] = useState<SheetState>({});
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [formulaInput, setFormulaInput] = useState('');
  const [activeTab, setActiveTab] = useState<'grid' | 'charts'>('grid');

  // Search/Replace Dialog State
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Chart configuration
  const [chartConfig, setChartConfig] = useState({
    type: 'bar' as 'bar' | 'line' | 'pie',
    labelCol: 'A',
    valueCol: 'B',
    title: 'Spreadsheet Chart Insights',
    startRow: 1,
    endRow: 10
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync cell input field with current active cell value
  const activeCellId = activeCell ? `${getColName(activeCell.col)}${activeCell.row + 1}` : '';
  
  useEffect(() => {
    if (activeCellId) {
      setFormulaInput(sheetData[activeCellId]?.value || '');
    } else {
      setFormulaInput('');
    }
  }, [activeCellId, sheetData]);

  // Evaluated values resolver
  const computedValues = useMemo(() => {
    const computed: { [cellId: string]: string } = {};
    const visiting = new Set<string>();

    const getRawValue = (id: string): string => {
      return sheetData[id]?.value || '';
    };

    const resolve = (id: string): string => {
      if (visiting.has(id)) {
        return '#CYCLE!'; // Handle circular dependency
      }
      if (computed[id] !== undefined) {
        return computed[id];
      }

      const raw = getRawValue(id);
      if (!raw.startsWith('=')) {
        computed[id] = raw;
        return raw;
      }

      visiting.add(id);
      try {
        const formula = raw.substring(1).trim();
        const value = evaluateFormulaStr(formula);
        computed[id] = value;
      } catch (err) {
        computed[id] = '#ERR!';
      }
      visiting.delete(id);
      return computed[id];
    };

    const evaluateFormulaStr = (formula: string): string => {
      // Basic functions supported: SUM, AVERAGE, COUNT, MIN, MAX, UPPER, LOWER
      const sumMatch = formula.match(/^(SUM|AVERAGE|COUNT|MIN|MAX)\((.+)\)$/i);
      if (sumMatch) {
        const func = sumMatch[1].toUpperCase();
        const argStr = sumMatch[2];
        const cells = parseRangeOrList(argStr);
        const resolvedNums = cells.map(cid => {
          const val = Number(resolve(cid));
          return isNaN(val) ? 0 : val;
        });

        if (resolvedNums.length === 0) return '0';

        switch (func) {
          case 'SUM':
            return resolvedNums.reduce((a, b) => a + b, 0).toString();
          case 'AVERAGE':
            return (resolvedNums.reduce((a, b) => a + b, 0) / resolvedNums.length).toString();
          case 'COUNT':
            return resolvedNums.length.toString();
          case 'MIN':
            return Math.min(...resolvedNums).toString();
          case 'MAX':
            return Math.max(...resolvedNums).toString();
          default:
            return '0';
        }
      }

      // UPPER, LOWER
      const textMatch = formula.match(/^(UPPER|LOWER)\((.+)\)$/i);
      if (textMatch) {
        const func = textMatch[1].toUpperCase();
        const refId = textMatch[2].trim();
        const rawStr = resolve(refId);
        return func === 'UPPER' ? rawStr.toUpperCase() : rawStr.toLowerCase();
      }

      // Simple math evaluation (+, -, *, /) between cell names or plain values
      let expression = formula;
      // Find matches like "A1", "C22", etc. but preserve word formulas or functions
      const cellRefRegex = /[A-Z]+\d+/gi;
      const references = expression.match(cellRefRegex) || [];
      
      // Sort references from longest to shortest to avoid replacing "A10" as "A1" + "0"
      const uniqueRefs = Array.from(new Set(references)).sort((a, b) => b.length - a.length);
      
      for (const ref of uniqueRefs) {
        const resolvedRef = resolve(ref.toUpperCase());
        const numVal = Number(resolvedRef);
        const replacement = isNaN(numVal) ? `"${resolvedRef}"` : numVal.toString();
        // Replace occurrences of ref matches safely
        expression = expression.split(ref).join(replacement);
      }

      try {
        // Safe evaluation of basic mathematical expressions
        // Restrict character alphabet to basic math patterns to avoid code injection concerns
        if (/^[0-9+\-*/().\s"']*$/.test(expression)) {
          // eslint-disable-next-line no-eval
          const res = eval(expression);
          return res !== undefined ? String(res) : '';
        }
      } catch (e) {
        return '#MATH_ERR!';
      }

      return '#VALUE!';
    };

    const parseRangeOrList = (argStr: string): string[] => {
      const parts = argStr.split(',');
      const ids: string[] = [];

      for (let part of parts) {
        part = part.trim();
        if (part.includes(':')) {
          // It's a range like A1:B3
          const [start, end] = part.split(':').map(str => str.trim().toUpperCase());
          const startColStr = start.match(/[A-Z]+/)?.[0] || 'A';
          const startRowStr = start.match(/\d+/)?.[0] || '1';
          const endColStr = end.match(/[A-Z]+/)?.[0] || 'A';
          const endRowStr = end.match(/\d+/)?.[0] || '1';

          const startCol = parseColName(startColStr);
          const startRow = parseInt(startRowStr, 10) - 1;
          const endCol = parseColName(endColStr);
          const endRow = parseInt(endRowStr, 10) - 1;

          const minCol = Math.min(startCol, endCol);
          const maxCol = Math.max(startCol, endCol);
          const minRow = Math.min(startRow, endRow);
          const maxRow = Math.max(startRow, endRow);

          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              ids.push(`${getColName(c)}${r + 1}`);
            }
          }
        } else {
          ids.push(part.toUpperCase());
        }
      }
      return ids;
    };

    // Pre-populate all actual grid cells
    for (const key of Object.keys(sheetData)) {
      resolve(key);
    }

    return computed;
  }, [sheetData]);

  // Formatted displayed valuation of cells
  const getFormattedVal = (cellId: string) => {
    const rawVal = computedValues[cellId] || '';
    const style = sheetData[cellId]?.style;
    if (!style || !style.format || style.format === 'general') {
      return rawVal;
    }

    const num = Number(rawVal);
    if (isNaN(num)) return rawVal;

    switch (style.format) {
      case 'number':
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'currency':
        return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'percent':
        return (num * 100).toFixed(1) + '%';
      default:
        return rawVal;
    }
  };

  // Change single cell text / state
  const handleCellChange = (cellId: string, val: string) => {
    setSheetData(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        value: val
      }
    }));
  };

  // Formula bar updating code
  const handleFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCellId) {
      handleCellChange(activeCellId, formulaInput);
    }
  };

  // Apply cell styling tags
  const applyStyle = (update: Partial<CellStyle>) => {
    if (!activeCellId) return;
    setSheetData(prev => {
      const cell = prev[activeCellId] || { value: '' };
      return {
        ...prev,
        [activeCellId]: {
          ...cell,
          style: {
            ...(cell.style || {}),
            ...update
          }
        }
      };
    });
  };

  // Row and columns actions
  const addRow = () => {
    setRowsCount(prev => prev + 5);
  };

  const addCol = () => {
    setColsCount(prev => prev + 2);
  };

  const deleteActiveRow = () => {
    if (!activeCell) return;
    const targetRow = activeCell.row;

    setSheetData(prev => {
      const next: SheetState = {};
      Object.entries(prev).forEach(([id, obj]) => {
        const colStr = id.match(/[A-Z]+/)?.[0] || 'A';
        const rowNumStr = id.match(/\d+/)?.[0] || '1';
        const rowIdx = parseInt(rowNumStr, 10) - 1;

        if (rowIdx === targetRow) {
          // Remove row
          return;
        } else if (rowIdx > targetRow) {
          // Shift row index down
          next[`${colStr}${rowIdx}`] = obj;
        } else {
          // Keep as is
          next[id] = obj;
        }
      });
      return next;
    });

    setRowsCount(prev => Math.max(1, prev - 1));
  };

  const deleteActiveCol = () => {
    if (!activeCell) return;
    const targetColIdx = activeCell.col;
    const targetColStr = getColName(targetColIdx);

    setSheetData(prev => {
      const next: SheetState = {};
      Object.entries(prev).forEach(([id, obj]) => {
        const colStr = id.match(/[A-Z]+/)?.[0] || 'A';
        const rowNumStr = id.match(/\d+/)?.[0] || '1';
        const colIdx = parseColName(colStr);

        if (colIdx === targetColIdx) {
          // Remove cell
          return;
        } else if (colIdx > targetColIdx) {
          // Shift col letter leftward
          const shiftedColStr = getColName(colIdx - 1);
          next[`${shiftedColStr}${rowNumStr}`] = obj;
        } else {
          // Keep as is
          next[id] = obj;
        }
      });
      return next;
    });

    setColsCount(prev => Math.max(1, prev - 1));
  };

  // Clear Spreadsheet data
  const clearSheet = () => {
    if (confirm('Are you sure you want to clear this entire worksheet?')) {
      setSheetData({});
      setColsCount(DEFAULT_COLS);
      setRowsCount(DEFAULT_ROWS);
      setActiveCell({ row: 0, col: 0 });
    }
  };

  // Search/Replace action
  const handleSearchReplace = () => {
    if (!searchQuery) return;
    setSheetData(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(cellId => {
        const val = next[cellId]?.value || '';
        if (val.toLowerCase().includes(searchQuery.toLowerCase())) {
          next[cellId] = {
            ...next[cellId],
            value: val.replace(new RegExp(searchQuery, 'gi'), replaceQuery)
          };
        }
      });
      return next;
    });
    alert('Search and replace completion applied!');
  };

  // File Upload Handlers
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Read Sheet Cell contents
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const nextState: SheetState = {};

        // Auto adjust grid layout based on incoming worksheet scope
        const maxCol = Math.max(range.e.c + 1, DEFAULT_COLS);
        const maxRow = Math.max(range.e.r + 1, DEFAULT_ROWS);
        setColsCount(maxCol);
        setRowsCount(maxRow);

        for (let r = range.s.r; r <= range.e.r; r++) {
          for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = { r, c };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cellRaw = worksheet[cellRef];
            if (cellRaw) {
              nextState[cellRef] = {
                value: cellRaw.f ? `=${cellRaw.f}` : String(cellRaw.v ?? '')
              };
            }
          }
        }

        setSheetData(nextState);
        setActiveCell({ row: 0, col: 0 });
      } catch (err) {
        console.error(err);
        alert('Failed parsing spreadsheet template document!');
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Create clean demo templates
  const loadDemoTemplate = () => {
    const demo: SheetState = {
      A1: { value: 'Financial Overview Q2', style: { bold: true, align: 'center', bg: 'bg-emerald-100 dark:bg-emerald-500/20' } },
      A3: { value: 'Month', style: { bold: true, align: 'left', bg: 'bg-slate-100 dark:bg-white/10' } },
      B3: { value: 'Sales Revenue', style: { bold: true, align: 'right', bg: 'bg-slate-100 dark:bg-white/10' } },
      C3: { value: 'Operations Cost', style: { bold: true, align: 'right', bg: 'bg-slate-100 dark:bg-white/10' } },
      D3: { value: 'Net Profit', style: { bold: true, align: 'right', bg: 'bg-slate-100 dark:bg-white/10' } },

      A4: { value: 'January' },
      B4: { value: '12500', style: { format: 'currency' } },
      C4: { value: '8200', style: { format: 'currency' } },
      D4: { value: '=B4-C4', style: { format: 'currency', italic: true } },

      A5: { value: 'February' },
      B5: { value: '15400', style: { format: 'currency' } },
      C5: { value: '9100', style: { format: 'currency' } },
      D5: { value: '=B5-C5', style: { format: 'currency', italic: true } },

      A6: { value: 'March' },
      B6: { value: '18900', style: { format: 'currency' } },
      C6: { value: '10500', style: { format: 'currency' } },
      D6: { value: '=B6-C6', style: { format: 'currency', italic: true } },

      A7: { value: 'Total Q2 Sum', style: { bold: true } },
      B7: { value: '=SUM(B4:B6)', style: { bold: true, format: 'currency', bg: 'bg-indigo-50 dark:bg-indigo-500/10' } },
      C7: { value: '=SUM(C4:C6)', style: { bold: true, format: 'currency', bg: 'bg-indigo-50 dark:bg-indigo-500/10' } },
      D7: { value: '=SUM(D4:D6)', style: { bold: true, format: 'currency', bg: 'bg-indigo-50 dark:bg-indigo-500/10' } },

      A9: { value: 'Averages', style: { bold: true } },
      B9: { value: '=AVERAGE(B4:B6)', style: { format: 'currency' } },
      C9: { value: '=AVERAGE(C4:C6)', style: { format: 'currency' } },
      D9: { value: '=AVERAGE(D4:D6)', style: { format: 'currency' } }
    };
    
    setSheetData(demo);
    setColsCount(10);
    setRowsCount(20);
    setActiveCell({ row: 3, col: 1 });
  };

  // Excel Format Data Export
  const exportExcel = () => {
    const matrix: any[][] = [];
    for (let r = 0; r < rowsCount; r++) {
      const rowArr: any[] = [];
      for (let c = 0; c < colsCount; c++) {
        const cellId = `${getColName(c)}${r + 1}`;
        const finalVal = computedValues[cellId] || '';
        // If numeric value, parse to maintain proper calculations in downstream sheets
        const numVal = Number(finalVal);
        rowArr.push(isNaN(numVal) || finalVal === '' ? finalVal : numVal);
      }
      matrix.push(rowArr);
    }

    const ws = XLSX.utils.aoa_to_sheet(matrix);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Worksheet');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'spreadsheet_output.xlsx');
  };

  const exportCSV = () => {
    let csvStr = '';
    for (let r = 0; r < rowsCount; r++) {
      const rowArr: string[] = [];
      for (let c = 0; c < colsCount; c++) {
        const cellId = `${getColName(c)}${r + 1}`;
        const val = computedValues[cellId] || '';
        rowArr.push(`"${val.replace(/"/g, '""')}"`);
      }
      csvStr += rowArr.join(',') + '\n';
    }
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'spreadsheet_output.csv');
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Spreadsheet Document Report', 14, 15);

    const headers: string[] = ['Grid'];
    for (let c = 0; c < colsCount; c++) {
      headers.push(getColName(c));
    }

    const rows: string[][] = [];
    for (let r = 0; r < rowsCount; r++) {
      const rowData: string[] = [String(r + 1)];
      for (let c = 0; c < colsCount; c++) {
        const cellId = `${getColName(c)}${r + 1}`;
        rowData.push(computedValues[cellId] || '');
      }
      rows.push(rowData);
    }

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8 }
    });

    doc.save('spreadsheet_report.pdf');
  };

  // Compile structured series data for Charts
  const chartData = useMemo(() => {
    const rStart = chartConfig.startRow - 1;
    const rEnd = chartConfig.endRow - 1;
    const dataList: any[] = [];

    for (let r = rStart; r <= rEnd; r++) {
      const labelCell = `${chartConfig.labelCol}${r + 1}`;
      const valueCell = `${chartConfig.valueCol}${r + 1}`;

      const name = computedValues[labelCell] || `Row ${r + 1}`;
      const val = Number(computedValues[valueCell] || 0);

      dataList.push({
        name,
        value: isNaN(val) ? 0 : val
      });
    }
    return dataList;
  }, [sheetData, computedValues, chartConfig]);

  const COLORS_PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title & Metadata Header section */}
      <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[32px] p-6 border border-[var(--glass-border)] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
                Excel Editor Pro
                <span className="text-xs bg-emerald-500/20 text-emerald-500 font-medium px-2 py-0.5 rounded-full">Suite</span>
              </h3>
              <p className="text-sm text-slate-400 font-medium">Create sheets, evaluate formulas, style cells & generate visual reports.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={loadDemoTemplate}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all uppercase tracking-wide"
            >
              <Sparkles className="w-4 h-4" /> Load Demo
            </button>
            <button
              onClick={triggerFileInput}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 text-[var(--text-main)] hover:bg-slate-200 dark:hover:bg-white/10 font-bold text-xs rounded-xl border border-slate-200 dark:border-white/10 transition-all"
            >
              <FolderOpen className="w-4 h-4 text-emerald-500" /> Import XLSX
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={clearSheet}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs rounded-xl border border-rose-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* View Mode Switch Tabs */}
        <div className="flex gap-2 mt-6 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl max-w-xs border border-slate-200/50 dark:border-white/5">
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-[#1E293B] text-[var(--text-main)] shadow-sm'
                : 'text-slate-400 hover:text-[var(--text-main)]'
            }`}
          >
            <Grid className="w-4 h-4" /> Sheet Grid
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'charts'
                ? 'bg-white dark:bg-[#1E293B] text-[var(--text-main)] shadow-sm'
                : 'text-slate-400 hover:text-[var(--text-main)]'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Data Charts Build
          </button>
        </div>
      </div>

      {activeTab === 'grid' && (
        <div className="space-y-4">
          {/* Main Excel Toolbar: Formatting & Layout */}
          <div className="bg-[var(--glass)] backdrop-blur-2xl rounded-[24px] p-4 border border-[var(--glass-border)] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Text formatting styles */}
              <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => applyStyle({ bold: !sheetData[activeCellId]?.style?.bold })}
                  className={`p-2 rounded-lg transition-colors ${
                    sheetData[activeCellId]?.style?.bold 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyStyle({ italic: !sheetData[activeCellId]?.style?.italic })}
                  className={`p-2 rounded-lg transition-colors ${
                    sheetData[activeCellId]?.style?.italic 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyStyle({ underline: !sheetData[activeCellId]?.style?.underline })}
                  className={`p-2 rounded-lg transition-colors ${
                    sheetData[activeCellId]?.style?.underline 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              {/* Text alignment values */}
              <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button
                    key={align}
                    onClick={() => applyStyle({ align })}
                    className={`p-2 rounded-lg transition-colors ${
                      (sheetData[activeCellId]?.style?.align || 'left') === align
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                    title={`Align ${align}`}
                  >
                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Number Format Formatting Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-mono">Format</span>
                <select
                  value={sheetData[activeCellId]?.style?.format || 'general'}
                  onChange={e => applyStyle({ format: e.target.value as any })}
                  className="bg-transparent text-xs font-semibold text-[var(--text-main)] border-none outline-none pr-6 cursor-pointer"
                >
                  <option value="general" className="dark:bg-slate-800">General Text</option>
                  <option value="number" className="dark:bg-slate-800">Decimal (0.00)</option>
                  <option value="currency" className="dark:bg-slate-800">Currency ($)</option>
                  <option value="percent" className="dark:bg-slate-800">Percentage (%)</option>
                </select>
              </div>

              {/* Custom background color dots */}
              <div className="flex gap-1.5 items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl px-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1 font-mono">Fill</span>
                <button
                  onClick={() => applyStyle({ bg: undefined })}
                  className="w-5 h-5 rounded-full border border-slate-300 dark:border-white/20 relative flex items-center justify-center transition-transform hover:scale-110 bg-white"
                  title="No Fill"
                >
                  <X className="w-3 h-3 text-red-500 absolute" />
                </button>
                {[
                  { class: 'bg-red-100 dark:bg-red-500/20', label: 'Soft Red' },
                  { class: 'bg-blue-100 dark:bg-blue-500/20', label: 'Soft Blue' },
                  { class: 'bg-emerald-100 dark:bg-emerald-500/20', label: 'Soft Green' },
                  { class: 'bg-yellow-100 dark:bg-yellow-500/20', label: 'Soft Yellow' },
                  { class: 'bg-purple-100 dark:bg-purple-500/20', label: 'Soft Purple' }
                ].map(item => (
                  <button
                    key={item.class}
                    onClick={() => applyStyle({ bg: item.class })}
                    className={`w-5 h-5 rounded-full transition-transform hover:scale-110 border border-transparent ${item.class}`}
                    title={item.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold ${
                  showSearch 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-500/50'
                }`}
              >
                <Search className="w-4 h-4" /> Find / Replace
              </button>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10" />

              {/* Data Export dropdown menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  <Download className="w-4 h-4" /> Export Report
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-1.5 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20">
                  <button
                    onClick={exportExcel}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Excel Sheet (.xlsx)
                  </button>
                  <button
                    onClick={exportCSV}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4 text-blue-500" /> CSV File (.csv)
                  </button>
                  <button
                    onClick={exportPDF}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <FileCode className="w-4 h-4 text-red-500" /> PDF Document (.pdf)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Find/Replace sub-bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-inner p-4 flex flex-col md:flex-row gap-3 items-end"
              >
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search query</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter keyword to search..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Replace with</label>
                  <input
                    type="text"
                    value={replaceQuery}
                    onChange={e => setReplaceQuery(e.target.value)}
                    placeholder="Enter replacement string..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={handleSearchReplace}
                    className="flex-1 md:flex-none py-2 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all h-10 flex items-center justify-center"
                  >
                    Replace All
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setReplaceQuery('');
                      setShowSearch(false);
                    }}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold h-10 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formula input Bar */}
          <form
            onSubmit={handleFormulaSubmit}
            className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-2.5 flex items-center gap-3 shadow-inner"
          >
            <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold font-mono px-3 py-1.5 rounded-lg text-emerald-500 select-none min-w-[50px] text-center">
              {activeCellId || '--'}
            </div>
            <div className="text-slate-400 font-mono text-xs font-bold h-5 flex items-center select-none border-r border-slate-200 dark:border-white/10 pr-2.5">=</div>
            <input
              type="text"
              value={formulaInput}
              onChange={e => setFormulaInput(e.target.value)}
              placeholder="Enter numeric value, text or formula (e.g. =SUM(A1:A5), =AVERAGE(B1:B10) )"
              className="flex-1 bg-transparent border-none text-xs font-medium font-mono text-[var(--text-main)] outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={!activeCellId}
              className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider rounded-lg hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
            >
              Update Value
            </button>
          </form>

          {/* The Spreadsheet Grid Table */}
          <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[28px] overflow-hidden shadow-md flex">
            {/* Control Sidebar for Row Actions */}
            <div className="flex flex-col border-r border-slate-200 dark:border-white/10 select-none">
              <div className="h-9 w-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-400 uppercase font-mono">
                FX
              </div>
              {Array.from({ length: rowsCount }).map((_, rIdx) => {
                const isSelectedRow = activeCell?.row === rIdx;
                return (
                  <div
                    key={rIdx}
                    onClick={() => setActiveCell({ row: rIdx, col: activeCell?.col || 0 })}
                    className={`h-9 w-12 border-b border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs font-mono transition-colors cursor-pointer ${
                      isSelectedRow 
                        ? 'bg-emerald-500/10 text-emerald-500 border-r-2 border-r-emerald-500' 
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-150'
                    }`}
                  >
                    {rIdx + 1}
                  </div>
                );
              })}
              <button
                onClick={addRow}
                className="h-9 w-12 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/30 dark:hover:bg-emerald-500/15 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"
                title="Add 5 more rows"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Columns Grid area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div style={{ width: `max-content`, minWidth: '100%' }}>
                {/* Columns Letters Header list */}
                <div className="flex bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 select-none">
                  {Array.from({ length: colsCount }).map((_, cIdx) => {
                    const isSelectedCol = activeCell?.col === cIdx;
                    return (
                      <div
                        key={cIdx}
                        onClick={() => setActiveCell({ row: activeCell?.row || 0, col: cIdx })}
                        className={`w-32 h-9 border-r border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs font-mono transition-colors cursor-pointer ${
                          isSelectedCol 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {getColName(cIdx)}
                      </div>
                    );
                  })}
                  <button
                    onClick={addCol}
                    className="w-14 h-9 flex items-center justify-center text-slate-400 hover:text-emerald-500 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/30 dark:hover:bg-emerald-500/15 transition-colors border-r border-slate-200 dark:border-white/10"
                    title="Add Columns"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid Rows render */}
                {Array.from({ length: rowsCount }).map((_, rIdx) => (
                  <div key={rIdx} className="flex border-b border-slate-200 dark:border-white/10">
                    {Array.from({ length: colsCount }).map((_, cIdx) => {
                      const colName = getColName(cIdx);
                      const cellId = `${colName}${rIdx + 1}`;
                      const cell = sheetData[cellId] || { value: '' };
                      const style = cell.style;
                      const isSelected = activeCell?.row === rIdx && activeCell?.col === cIdx;
                      
                      return (
                        <div
                          key={cIdx}
                          onClick={() => setActiveCell({ row: rIdx, col: cIdx })}
                          className={`w-32 h-9 border-r border-slate-150 dark:border-white/5 relative group transition-all flex items-center ${
                            isSelected 
                              ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-500/5 z-10' 
                              : style?.bg || 'bg-transparent text-[var(--text-main)]'
                          }`}
                        >
                          <input
                            type="text"
                            value={isSelected ? formulaInput : getFormattedVal(cellId)}
                            onChange={e => handleCellChange(cellId, e.target.value)}
                            className={`w-full h-full px-2.5 bg-transparent border-none text-xs outline-none select-all relative z-10 font-medium ${
                              style?.bold ? 'font-bold' : ''
                            } ${
                              style?.italic ? 'italic' : ''
                            } ${
                              style?.underline ? 'underline' : ''
                            } ${
                              style?.align === 'center' 
                                ? 'text-center' 
                                : style?.align === 'right' 
                                ? 'text-right' 
                                : 'text-left'
                            }`}
                          />
                          {/* Hover styling background marker */}
                          {!isSelected && (
                            <div className="absolute inset-0 bg-slate-100/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                          )}
                        </div>
                      );
                    })}
                    {/* Placeholder space alignment helper */}
                    <div className="w-14 h-9 bg-slate-50/20 dark:bg-slate-800/10 border-r border-slate-150 dark:border-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Utility Active Rows/Cols deletion control footer */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3.5 border border-slate-200 dark:border-white/10 flex flex-wrap justify-between items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Target Cell Context: <strong className="text-[var(--text-main)] bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">{activeCellId || 'No selection'}</strong>
            </span>

            {activeCell && (
              <div className="flex gap-2">
                <button
                  onClick={deleteActiveRow}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Row {activeCell.row + 1}
                </button>
                <button
                  onClick={deleteActiveCol}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Col {getColName(activeCell.col)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts control parameters forms block */}
          <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-white/10">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-sm text-[var(--text-main)]">Chart Configuration Setup</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Chart Visualization Type</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                  {(['bar', 'line', 'pie'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setChartConfig(prev => ({ ...prev, type }))}
                      className={`py-1.5 rounded-lg text-xs font-black capitalize transition-colors ${
                        chartConfig.type === type
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-400 hover:text-[var(--text-main)]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Chart Title Header</label>
                <input
                  type="text"
                  value={chartConfig.title}
                  onChange={e => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Labels Column</label>
                  <select
                    value={chartConfig.labelCol}
                    onChange={e => setChartConfig(prev => ({ ...prev, labelCol: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2.5 rounded-xl text-xs font-bold ring-0 outline-none"
                  >
                    {Array.from({ length: colsCount }).map((_, cIdx) => (
                      <option key={cIdx} value={getColName(cIdx)} className="dark:bg-slate-800">
                        {getColName(cIdx)} (Words)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Values Column</label>
                  <select
                    value={chartConfig.valueCol}
                    onChange={e => setChartConfig(prev => ({ ...prev, valueCol: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2.5 rounded-xl text-xs font-bold ring-0 outline-none"
                  >
                    {Array.from({ length: colsCount }).map((_, cIdx) => (
                      <option key={cIdx} value={getColName(cIdx)} className="dark:bg-slate-800">
                        {getColName(cIdx)} (Numbers)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Start Row</label>
                  <input
                    type="number"
                    min={1}
                    max={rowsCount}
                    value={chartConfig.startRow}
                    onChange={e => setChartConfig(prev => ({ ...prev, startRow: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">End Row</label>
                  <input
                    type="number"
                    min={1}
                    max={rowsCount}
                    value={chartConfig.endRow}
                    onChange={e => setChartConfig(prev => ({ ...prev, endRow: parseInt(e.target.value, 10) || 10 }))}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
              <span className="font-bold text-emerald-500 block mb-1">💡 Formula Optimization</span>
              Populate label cells (e.g. Month) in Column {chartConfig.labelCol} and statistics data (e.g. Sales) in Column {chartConfig.valueCol} to compile interactive graphs dynamically.
            </div>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="lg:col-span-2 bg-[var(--glass)] border border-[var(--glass-border)] rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-[var(--text-main)] mb-1">{chartConfig.title}</h4>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-6 font-mono">
                Source range: {chartConfig.labelCol}{chartConfig.startRow}:{chartConfig.valueCol}{chartConfig.endRow}
              </p>
            </div>

            <div className="h-96 w-full flex items-center justify-center">
              {chartData.every(c => c.value === 0) ? (
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-400 font-bold">No numeric data values found in range!</p>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Ensure selected value column cells contains actual numbers instead of pure alphabetic text labels.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartConfig.type === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#aaa', fontWeight: 'bold' }} />
                      <Legend />
                      <Bar dataKey="value" name="Value Sum" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : chartConfig.type === 'line' ? (
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#aaa', fontWeight: 'bold' }} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Value progress" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PALETTE[index % COLORS_PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            <div />
          </div>
        </div>
      )}
    </div>
  );
};
