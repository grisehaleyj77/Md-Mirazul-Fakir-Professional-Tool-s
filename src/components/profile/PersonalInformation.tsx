import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PersonalInformation = ({ 
  onBack, 
  profileImage, 
  onUpdateImage 
}: { 
  onBack: () => void, 
  profileImage: string | null,
  onUpdateImage: (img: string | null) => void 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-[var(--ink)]">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Personal Information</h2>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-[32px] flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-black shadow-inner overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              "MF"
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--bg)] shadow-xl rounded-full flex items-center justify-center border border-[var(--glass-border)] text-blue-600 hover:scale-110 transition-transform"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: 'Full Name', value: 'User', icon: User, type: 'text' },
          { label: 'Email Address', value: 'user@example.com', icon: Mail, type: 'email' },
          { label: 'Phone Number', value: '+880 1700 000000', icon: Phone, type: 'tel' },
          { label: 'Location', value: 'Dhaka, Bangladesh', icon: MapPin, type: 'text' },
        ].map((field, i) => (
          <div key={i} className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">
              {field.label}
            </label>
            <div className="relative">
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type={field.type}
                defaultValue={field.value}
                className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-[var(--ink)]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Save className="w-5 h-5" />
            </motion.div>
          ) : showSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              UPDATED SUCCESSFULLY
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              SAVE CHANGES
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
