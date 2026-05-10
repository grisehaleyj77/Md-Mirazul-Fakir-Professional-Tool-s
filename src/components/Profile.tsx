import React from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Camera,
  Star,
  Award,
  Clock,
  Briefcase,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export const Profile = ({ userStatus, onUpdateName }: any) => {
  const [activeSubView, setActiveSubView] = React.useState<string | null>(null);
  const [tempName, setTempName] = React.useState(userStatus.name);

  const stats = [
    { label: 'Tools Used', value: '42', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Time Saved', value: '12h', icon: Clock, color: 'text-green-600' },
    { label: 'Badge', value: userStatus.plan === 'Elite' ? 'Elite' : userStatus.plan === 'Pro' ? 'Pro' : 'Elite', icon: Award, color: 'text-purple-600' }
  ];

  const menuItems = [
    { id: 'personal', title: 'Personal Information', icon: User, subtitle: 'Update your display name and email', color: 'bg-blue-50 text-blue-600' },
    { id: 'security', title: 'Security & Privacy', icon: Shield, subtitle: 'Password, bio-metrics and more', color: 'bg-indigo-50 text-indigo-600' },
    { id: 'subscription', title: 'Subscription Plan', icon: CreditCard, subtitle: 'Manage your pro features', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'settings', title: 'App Settings', icon: Settings, subtitle: 'Theme, language and notifications', color: 'bg-slate-50 text-slate-600' },
    { id: 'help', title: 'Help & FAQ', icon: HelpCircle, subtitle: 'Need assistance? View our guides', color: 'bg-amber-50 text-amber-600' },
  ];

  if (activeSubView) {
    const activeItem = menuItems.find(item => item.id === activeSubView);
    return (
      <div className="space-y-6 pb-32">
        <div className="flex items-center gap-4 pt-10 px-2">
          <button 
            onClick={() => setActiveSubView(null)}
            className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-black italic">{activeItem?.title}</h2>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
           <div className={`w-16 h-16 ${activeItem?.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
              {activeItem && <activeItem.icon className="w-8 h-8" />}
           </div>
           
           {activeSubView === 'personal' ? (
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                 <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-4 font-bold outline-none focus:ring-2 ring-blue-500/20"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                 <input 
                  type="email" 
                  disabled
                  value="mirazul@enterprise.com" 
                  className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-4 font-bold opacity-50 cursor-not-allowed"
                 />
               </div>
             </div>
           ) : (
             <div className="text-center space-y-4">
               <h3 className="font-black">Configure {activeItem?.title}</h3>
               <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto">This feature is currently being optimized for your account. Changes will sync automatically.</p>
               
               <div className="pt-4 space-y-3">
                  <div className="h-12 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center px-4 justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Status</span>
                    <span className="text-[10px] font-black uppercase text-green-600">Active</span>
                  </div>
                  <div className="h-12 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center px-4 justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Access</span>
                    <span className="text-[10px] font-black uppercase text-blue-600">{userStatus.plan}</span>
                  </div>
               </div>
             </div>
           )}
           
           <button 
            onClick={() => {
              if (activeSubView === 'personal') {
                onUpdateName(tempName);
                alert('Name updated successfully!');
              }
              setActiveSubView(null);
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
           >
             Save Changes
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Profile Header */}
      <div className="relative pt-10 pb-6 px-4">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl relative overflow-hidden">
               <User className="w-16 h-16 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-6 text-center space-y-1">
            <h2 className="text-3xl font-black italic tracking-tight">{userStatus.name}</h2>
            <p className="text-slate-400 font-bold text-sm">Member since May 2024</p>
            <div className="flex items-center gap-2 justify-center mt-3">
              <div className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                {userStatus.isPro ? <Star className="w-3 h-3 fill-current" /> : <Zap className="w-3 h-3" />}
                {userStatus.plan} Member
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 px-2">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[24px] p-4 text-center space-y-1 shadow-sm">
            <div className={`w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-lg font-black">{stat.value}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Menu */}
      <div className="space-y-3 px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-4 mb-4">Account Settings</h3>
        {menuItems.map((item) => (
          <button 
            key={item.title}
            onClick={() => setActiveSubView(item.id)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[28px] group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-sm`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black tracking-tight">{item.title}</div>
                <div className="text-[10px] font-bold text-slate-400">{item.subtitle}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-2 pt-4">
        <button 
          onClick={() => {
            if(confirm('Are you sure you want to log out?')) {
              window.location.reload();
            }
          }}
          className="w-full h-16 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log out session
        </button>
      </div>

      <div className="text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Version 2.4.0 (Enterprise)</p>
      </div>
    </div>
  );

};
