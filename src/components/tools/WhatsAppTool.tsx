import React, { useState } from 'react';
import { MessageSquare, Copy, ExternalLink, Trash2, Phone, AlignLeft, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppTool = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Clean phone number: remove non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  const waLink = cleanPhone 
    ? `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    : '';

  const handleCopy = () => {
    if (!waLink) return;
    navigator.clipboard.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    if (!waLink) return;
    window.open(waLink, '_blank');
  };

  const clear = () => {
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">WhatsApp Link Smith</h2>
            <p className="text-xs text-slate-500">Create direct chat links without saving contacts</p>
          </div>
        </div>
        
        {waLink && (
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleOpen}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
            >
              <ExternalLink size={18} />
              Open Chat
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 234 567 8900"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500/20 focus:bg-white transition-all ring-offset-0"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium ml-1 italic">Include country code without special characters (e.g., 15551234567)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pre-filled Message</label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <AlignLeft size={18} />
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello! I'm interested in..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500/20 focus:bg-white transition-all h-32 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden h-full flex flex-col justify-between">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <MessageSquare size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Direct Link Preview</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Shareable URL</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-sm break-all text-emerald-400 min-h-[100px] flex items-center">
                {waLink ? waLink : <span className="opacity-30 italic">Enter a phone number to generate link...</span>}
              </div>
            </div>

            <div className="relative z-10 space-y-4 pt-8">
              <button
                onClick={handleCopy}
                disabled={!waLink}
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] disabled:opacity-30'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied to Clipboard' : 'Copy Link'}
              </button>
              
              <div className="flex items-center gap-3 px-2">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Usage Tips</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Send this link to someone or use it on your website as a 
                <span className="text-white"> "Contact Us"</span> button. It opens the chat application immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
