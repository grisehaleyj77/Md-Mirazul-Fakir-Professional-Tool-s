import React, { useState, useEffect } from 'react';
import { 
  FileCode, Terminal, Sparkles, Copy, Check, Info, Binary, Code, LayoutGrid, Cpu, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DevSuiteProps {
  toolId?: string;
}

export const DevSuite = ({ toolId }: DevSuiteProps) => {
  const [activeSubTool, setActiveSubTool] = useState(toolId || 'dev-txbin');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (toolId) {
      setActiveSubTool(toolId);
      setInputText('');
      setResult('');
    }
  }, [toolId]);

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert Text to Binary
  const textToBinary = () => {
    const bin = inputText
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    setResult(bin);
  };

  // Convert Binary to Text
  const binaryToText = () => {
    try {
      const cleanBin = inputText.trim().split(/\s+/);
      const text = cleanBin
        .map(binStr => String.fromCharCode(parseInt(binStr, 2)))
        .join('');
      setResult(text);
    } catch (e: any) {
      setResult(`Parsing failure: Ensure binary consists of space-separated 8-digit blocks (e.g. 01101000). Error: ${e.message}`);
    }
  };

  // HEX to RGB
  const hexToRgb = () => {
    const cleanHex = inputText.trim().replace(/^#/, '');
    if (cleanHex.length !== 3 && cleanHex.length !== 6) {
      setResult("Invalid HEX code length. Use format e.g. #FFFFFF or FFF.");
      return;
    }
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    setResult(`rgb(${r}, ${g}, ${b})`);
  };

  // RGB to HEX
  const rgbToHex = () => {
    const match = inputText.trim().match(/\d+/g);
    if (!match || match.length < 3) {
      setResult("Invalid RGB format. Use format e.g. rgb(255, 255, 255) or 255, 255, 255.");
      return;
    }
    const r = Math.min(255, Math.max(0, parseInt(match[0])));
    const g = Math.min(255, Math.max(0, parseInt(match[1])));
    const b = Math.min(255, Math.max(0, parseInt(match[2])));
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    setResult(hex);
  };

  // Minifiers helper
  const minifyCode = (lang: 'html' | 'css' | 'js') => {
    if (!inputText.trim()) return;
    let minified = inputText.trim();
    if (lang === 'html') {
      minified = minified
        .replace(/<!--[\s\S]*?-->/g, '') // remove comments
        .replace(/\s+/g, ' ')            // reduce space
        .replace(/>\s+</g, '><');        // tag-to-tag compress
    } else if (lang === 'css') {
      minified = minified
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s+/g, ' ')             // reduce space
        .replace(/\s*([\{\};:])\s*/g, '$1') // remove space around braces
        .replace(/;}/g, '}');             // remove unnecessary semicolons
    } else {
      // Basic JS compressor
      minified = minified
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s+/g, ' ')                    // compress spaces
        .replace(/\s*([;,\{\}\(\):=\+\-\*\/])\s*/g, '$1'); // compress symbols
    }
    setResult(minified);
  };

  // JSON Validator & Formatter
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(inputText.trim());
      setResult(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setResult(`Invalid JSON Schema:\n${e.message}`);
    }
  };

  // Base64 Codec
  const base64Codec = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setResult(btoa(unescape(encodeURIComponent(inputText))));
      } else {
        setResult(decodeURIComponent(escape(atob(inputText))));
      }
    } catch (e: any) {
      setResult(`Base64 execution error: ${e.message}`);
    }
  };

  // HTML Entity Converter
  const convertHTMLEntities = (mode: 'to' | 'from') => {
    if (mode === 'to') {
      const entityMap: any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      const converted = inputText.replace(/[&<>"'/]/g, (s) => entityMap[s]);
      setResult(converted);
    } else {
      const container = document.createElement('div');
      container.innerHTML = inputText;
      setResult(container.textContent || container.innerText || '');
    }
  };

  // JSON to XML Converter
  const jsonToXml = () => {
    try {
      const parsed = JSON.parse(inputText.trim());
      const buildXml = (obj: any, rootName = 'root'): string => {
        let xml = `<${rootName}>`;
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (typeof val === 'object' && val !== null) {
              xml += buildXml(val, key);
            } else {
              xml += `<${key}>${val}</${key}>`;
            }
          }
        }
        xml += `</${rootName}>`;
        return xml;
      };
      setResult('<?xml version="1.0" encoding="UTF-8"?>\n' + buildXml(parsed));
    } catch (e: any) {
      setResult(`JSON Translation Error: Ensure your JSON has valid root elements. error: ${e.message}`);
    }
  };

  // XML to JSON Converter (Simple tag parser)
  const xmlToJson = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputText.trim(), "text/xml");
      // Check for parsing errors
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        throw new Error(errorNode.textContent || "XML parsing failed");
      }

      const parseElement = (element: Element): any => {
        const obj: any = {};
        if (element.children.length === 0) {
          return element.textContent;
        }
        for (let i = 0; i < element.children.length; i++) {
          const child = element.children[i];
          const nodeName = child.nodeName;
          const childVal = parseElement(child);
          if (obj[nodeName]) {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(childVal);
          } else {
            obj[nodeName] = childVal;
          }
        }
        return obj;
      };

      if (xmlDoc.documentElement) {
        const resultObj: any = {};
        resultObj[xmlDoc.documentElement.nodeName] = parseElement(xmlDoc.documentElement);
        setResult(JSON.stringify(resultObj, null, 2));
      } else {
        setResult("{}");
      }
    } catch (e: any) {
      setResult(`XML Translation Failure: Ensure valid XML structure. error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-100 dark:border-slate-800">
        {[
          { id: 'dev-txbin', label: 'Text to Binary', icon: Binary },
          { id: 'dev-bintx', label: 'Binary to Text', icon: Binary },
          { id: 'dev-hexrgb', label: 'HEX to RGB', icon: LayoutGrid },
          { id: 'dev-rgbhex', label: 'RGB to HEX', icon: LayoutGrid },
          { id: 'dev-htmlmin', label: 'HTML Compactor', icon: FileCode },
          { id: 'dev-cssmin', label: 'CSS Compactor', icon: FileCode },
          { id: 'dev-jsmin', label: 'JS Compactor', icon: FileCode },
          { id: 'dev-json', label: 'JSON Beautify', icon: Code },
          { id: 'dev-b64en', label: 'Base64 Enc', icon: Cpu },
          { id: 'dev-b64de', label: 'Base64 Dec', icon: Cpu },
          { id: 'dev-htmlent', label: 'Entity Codec', icon: Code },
          { id: 'dev-jsonxml', label: 'JSON to XML', icon: RefreshCw },
          { id: 'dev-xmljson', label: 'XML to JSON', icon: RefreshCw }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              setActiveSubTool(btn.id);
              setInputText('');
              setResult('');
            }}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 ${
              activeSubTool === btn.id 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/40' 
                : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {btn.id.includes('bin') ? <Binary size={12} /> : <Terminal size={12} />}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950/40 text-slate-800 dark:text-slate-250 rounded-xl flex items-center justify-center">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white capitalize">
              {activeSubTool.replace('dev-', '').replace('-', ' ')}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Local Sandbox Container</p>
          </div>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Input Source Statement</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeSubTool.includes('bin-') ? "e.g. 01101000 01100101 01101100 01101100 01101111" :
                  activeSubTool === 'dev-json' || activeSubTool === 'dev-jsonxml' ? '{"name": "production", "active": true}' :
                  "Paste your draft here..."
                }
                className="w-full h-36 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-mono font-bold resize-none"
              />
           </div>

           {['dev-b64en', 'dev-b64de'].includes(activeSubTool) ? (
              <div className="flex gap-2">
                 <button 
                   onClick={() => base64Codec('encode')} 
                   disabled={!inputText.trim()}
                   className="flex-1 h-12 bg-slate-800 text-white rounded-xl font-black text-xs uppercase"
                 >
                   Encode Base64
                 </button>
                 <button 
                   onClick={() => base64Codec('decode')} 
                   disabled={!inputText.trim()}
                   className="flex-1 h-12 bg-slate-700 text-white rounded-xl font-black text-xs uppercase"
                 >
                   Decode Base64
                 </button>
              </div>
           ) : ['dev-htmlent'].includes(activeSubTool) ? (
              <div className="flex gap-2">
                 <button 
                   onClick={() => convertHTMLEntities('to')} 
                   disabled={!inputText.trim()}
                   className="flex-1 h-12 bg-slate-800 text-white rounded-xl font-black text-xs uppercase"
                 >
                   Encode to Entities
                 </button>
                 <button 
                   onClick={() => convertHTMLEntities('from')} 
                   disabled={!inputText.trim()}
                   className="flex-1 h-12 bg-slate-700 text-white rounded-xl font-black text-xs uppercase"
                 >
                   Decode from Entities
                 </button>
              </div>
           ) : (
              <button
                onClick={() => {
                  if (activeSubTool === 'dev-txbin') textToBinary();
                  if (activeSubTool === 'dev-bintx') binaryToText();
                  if (activeSubTool === 'dev-hexrgb') hexToRgb();
                  if (activeSubTool === 'dev-rgbhex') rgbToHex();
                  if (activeSubTool === 'dev-htmlmin') minifyCode('html');
                  if (activeSubTool === 'dev-cssmin') minifyCode('css');
                  if (activeSubTool === 'dev-jsmin') minifyCode('js');
                  if (activeSubTool === 'dev-json') formatJSON();
                  if (activeSubTool === 'dev-jsonxml') jsonToXml();
                  if (activeSubTool === 'dev-xmljson') xmlToJson();
                }}
                disabled={!inputText.trim()}
                className="w-full h-14 bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-50 shadow-md"
              >
                <Sparkles size={14} className="text-yellow-400" />
                Process Code Syntax
              </button>
           )}
        </div>
      </div>

      {/* Output Panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <div className="bg-slate-900 text-white rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-500/10 blur-[80px] rounded-full" />
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Developer Output Terminal</span>
                   <button 
                     onClick={() => copyText(result)}
                     className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                   >
                     {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                     {copied ? 'Copied' : 'Copy Output'}
                   </button>
                 </div>

                 <div className="text-xs font-mono leading-relaxed whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto pr-2 bg-black/40 p-4 rounded-xl border border-white/5">
                    {result}
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 flex gap-4">
        <Info size={20} className="text-slate-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Compiler Directives</p>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Parsing, minifying, and validating activities are performed 100% locally in the sandbox container context.
          </p>
        </div>
      </div>
    </div>
  );
};
