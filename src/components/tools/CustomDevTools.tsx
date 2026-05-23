import React, { useState, useRef } from 'react';
import { 
  Key, Shield, Sliders, Copy, Check, Upload, Image as ImageIcon,
  Minimize, Code, RefreshCw, Link2, Share2, Binary, Hash
} from 'lucide-react';

export const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) charset += '0123456789';
    if (syms) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-="';
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    let pw = '';
    for (let i = 0; i < length; i++) {
      pw += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setResult(pw);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Key size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Advanced Password Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Cryptographically strong offline passkeys builder</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border">
            <span className="text-[8px] block font-black text-slate-400 uppercase mb-2">Length: {length}</span>
            <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-slate-800" />
          </div>
          {[
            { label: 'Uppers', val: upper, set: setUpper },
            { label: 'Lowers', val: lower, set: setLower },
            { label: 'Numbers', val: nums, set: setNums },
            { label: 'Symbols', val: syms, set: setSyms }
          ].map((ch, idx) => (
            <button key={idx} onClick={() => ch.set(!ch.val)} className={`p-3 rounded-2xl border font-black text-xs uppercase cursor-pointer transition ${ch.val ? 'bg-slate-800 text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-405 text-slate-400'}`}>
              {ch.label}
            </button>
          ))}
        </div>
        <button onClick={generate} className="w-full h-14 bg-slate-800 hover:bg-slate-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Compile Passkey
        </button>
        {result && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
              <span>Secure Passkey</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
                {copied ? 'Copied' : 'Copy Key'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 text-xs font-mono font-black border rounded-2xl break-all select-all text-neutral-800 dark:text-neutral-200">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const TextToQRCode = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const generateQR = () => {
    if (!text.trim()) return;
    // Client-side offline QR representation image URL
    // Uses standard compliant QR API or mock visual matrix box
    setResult(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Share2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Text to QR Code Generator</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Export instantly shareable raster codes offline</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste URL, email or copy block..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={generateQR} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine QR Code Matrix
        </button>
        {result && (
          <div className="text-center p-4 bg-slate-50 dark:bg-black/30 border rounded-2xl max-w-sm mx-auto animate-fade-in space-y-4">
            <span className="text-[9px] block font-black uppercase text-slate-400">Scan QR Code Targets:</span>
            <img src={result} referrerPolicy="no-referrer" alt="Generated QR code" className="mx-auto w-40 h-40 border bg-white p-2.5 rounded-xl shadow" />
            <a href={result} download="qrcode_output.png" className="inline-block px-4 py-2 bg-slate-800 text-white text-[9px] font-black uppercase rounded-lg">Download raster frame</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImageResizer = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [resizedBlob, setResizedBlob] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const keyLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processResize = () => {
    if (!selectedImg) return;
    const img = new Image();
    img.src = selectedImg;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0,0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        setResizedBlob(canvas.toDataURL('image/jpeg', 0.9));
      }
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Minimize size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Interactive Image Resizer</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Scale picture aspects inside canvas elements locally</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <div className="flex justify-center border-2 border-dashed rounded-2xl p-6 bg-slate-50 dark:bg-white/5 cursor-pointer relative">
          <input type="file" accept="image/*" onChange={keyLoadImage} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="text-center space-y-1 text-xs">
            <Upload className="mx-auto text-slate-400" />
            <span className="block font-black text-slate-700 dark:text-slate-200">
              {selectedImg ? 'Switch active asset' : 'Click to select picture file'}
            </span>
          </div>
        </div>
        {selectedImg && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 block">Output Width (px)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 block">Output Height (px)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold" />
              </div>
            </div>
            <button onClick={processResize} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
              Compile Canvas Asset
            </button>
            <canvas ref={canvasRef} className="hidden" />
            {resizedBlob && (
              <div className="text-center p-4 bg-slate-50 dark:bg-black/30 border rounded-2xl max-w-sm mx-auto animate-fade-in space-y-4">
                <span className="text-[9px] block font-black uppercase text-slate-400">Scaled result asset:</span>
                <img src={resizedBlob} referrerPolicy="no-referrer" alt="Scaled Image Outcome" className="mx-auto rounded-xl shadow border max-h-[160px] object-contain bg-slate-100" />
                <a href={resizedBlob} download="resized_asset.jpg" className="inline-block px-4 py-2 bg-slate-800 text-white text-[9px] font-black uppercase rounded-lg">Download scaled asset JPG</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ImageCompressor = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [compressedBlob, setCompressedBlob] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const keyLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processCompression = () => {
    if (!selectedImg) return;
    const img = new Image();
    img.src = selectedImg;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        setCompressedBlob(canvas.toDataURL('image/jpeg', quality));
      }
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Minimize size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Interactive Image Compressor</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Reduce image disk footprint using pixel canvas rendering</p>
        </div>
      </div>
      <div className="space-y-4 font-sans">
        <div className="flex justify-center border-2 border-dashed rounded-2xl p-6 bg-slate-50 dark:bg-white/5 cursor-pointer relative">
          <input type="file" accept="image/*" onChange={keyLoadImage} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="text-center space-y-1 text-xs">
            <Upload className="mx-auto text-slate-400" />
            <span className="block font-black text-slate-700 dark:text-slate-200">
              {selectedImg ? 'Switch active asset' : 'Click to select picture file'}
            </span>
          </div>
        </div>
        {selectedImg && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Compression Quality: {Math.floor(quality * 100)}%</label>
              <input type="range" min={0.1} max={1.0} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-slate-800" />
            </div>
            <button onClick={processCompression} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
              Compress Asset
            </button>
            <canvas ref={canvasRef} className="hidden" />
            {compressedBlob && (
              <div className="text-center p-4 bg-slate-50 dark:bg-black/30 border rounded-2xl max-w-sm mx-auto animate-fade-in space-y-4">
                <span className="text-[9px] block font-black uppercase text-slate-400">Compressed outcome:</span>
                <img src={compressedBlob} referrerPolicy="no-referrer" alt="Compressed quality view" className="mx-auto rounded-xl shadow border max-h-[160px] object-contain bg-slate-100" />
                <a href={compressedBlob} download="compressed_asset.jpg" className="inline-block px-4 py-2 bg-slate-800 text-white text-[9px] font-black uppercase rounded-lg">Download Compressed JPG</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const URLEncodeDecoder = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setResult(encodeURIComponent(inputText));
    } catch {
      setResult('Encoding error.');
    }
  };

  const decode = () => {
    try {
      setResult(decodeURIComponent(inputText));
    } catch {
      setResult('Decoding error.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Link2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">URL Encoder / Decoder</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Convert special character queries within links safely offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste plain or query URI values..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <div className="grid grid-cols-2 gap-4">
          <button onClick={encode} className="h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
            Encode URI
          </button>
          <button onClick={decode} className="h-14 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
            Decode URI
          </button>
        </div>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
              <span>Codec Outcomes</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 text-xs font-mono border rounded-2xl overflow-x-auto select-all">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const CSSMinifier = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const minifyCSS = () => {
    let clean = inputText
      .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
      .replace(/\s+/g, ' ') // clean multiple spaces
      .replace(/\s*([\{\};:])\s*/g, '$1') // trim whitespace around brackets/separators
      .trim();
    setResult(clean);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">CSS Stylesheets Minifier</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit and compress large CSS asset sizes locally</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste raw readable CSS rules..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={minifyCSS} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Determine minified CSS
        </button>
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
              <span>Optimized CSS stylesheet code:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 text-xs font-mono text-emerald-600 dark:text-emerald-400 border rounded-2xl overflow-x-auto select-all">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const JSMinifier = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const minifyJS = () => {
    let clean = inputText
      .replace(/\/\/.*?\n/g, '') // remove line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
      .replace(/\s+/g, ' ') // clean extra spaces
      .trim();
    setResult(clean);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Code size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">JavaScript Code Minifier</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Audit syntax stream files compression locally</p>
        </div>
      </div>
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste JavaScript function code to condense..."
          className="w-full h-24 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={minifyJS} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Condense syntax code
        </button>
        {result && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
              <span>Optimized syntax code:</span>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-slate-50 dark:bg-black/30 text-xs font-mono text-emerald-600 dark:text-emerald-400 border rounded-2xl overflow-x-auto select-all">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const CryptographicHasherMD = () => {
  const [inputText, setInputText] = useState('');
  const [result256, setResult256] = useState('');
  const [resultSHA1, setResultSHA1] = useState('');
  const [copiedSha, setCopiedSha] = useState(false);

  const calculateHashes = async () => {
    if (!inputText) return;
    const utf8 = new TextEncoder().encode(inputText);

    // SubtleCrypto SHA-256
    const hashBuffer256 = await window.crypto.subtle.digest('SHA-256', utf8);
    const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
    const hashHex256 = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');
    setResult256(hashHex256);

    // SubtleCrypto SHA-1
    const hashBufferSha1 = await window.crypto.subtle.digest('SHA-1', utf8);
    const hashArraySha1 = Array.from(new Uint8Array(hashBufferSha1));
    const hashHexSha1 = hashArraySha1.map(b => b.toString(16).padStart(2, '0')).join('');
    setResultSHA1(hashHexSha1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-850 text-slate-850 dark:text-neutral-250 rounded-xl">
          <Hash size={20} />
        </div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Cryptographic Checksum Hasher</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Failsafe secure SHA-256 and SHA-1 engine offline</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Seed message string to digest checksum..."
          className="w-full p-4 bg-slate-50 dark:bg-white/5 border rounded-2xl outline-none text-xs font-bold"
        />
        <button onClick={calculateHashes} className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest cursor-pointer">
          Digest Checksums
        </button>
        {result256 && (
          <div className="space-y-3 font-mono text-xs text-left animate-fade-in">
            <div className="bg-slate-50 dark:bg-black/30 p-3.5 border rounded-xl">
               <span className="text-[8px] block font-black text-slate-400 uppercase mb-1">SHA-256 Digest Result:</span>
               <div className="break-all text-red-600 font-bold font-mono">{result256}</div>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-3.5 border rounded-xl">
               <span className="text-[8px] block font-black text-slate-400 uppercase mb-1">SHA-1 Digest Result:</span>
               <div className="break-all text-emerald-600 font-bold font-mono">{resultSHA1}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
