import React from 'react';
import { Cpu, Check, ArrowRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const SubscriptionPlan = ({ onBack }: { onBack: () => void }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['Basic Tools Access', 'Standard Processing Speed', 'Limited Cloud Storage', 'Ad-supported'],
      active: false,
      color: 'gray'
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      features: ['Priority AI Tools', '10x Faster Processing', 'Unlimited Storage', 'Ad-free Experience', '24/7 Support'],
      active: true,
      color: 'blue'
    }
  ];

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
        <h2 className="text-2xl font-black tracking-tight">Subscription Plan</h2>
      </div>

      <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-500/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Plan</span>
          </div>
          <h3 className="text-3xl font-black mb-1">Premium</h3>
          <p className="text-blue-100 text-sm font-medium">Valid until Dec 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`p-1 rounded-[32px] ${plan.active ? 'bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-xl' : 'bg-slate-100 dark:bg-white/5'}`}
          >
            <div className="bg-[var(--bg)] rounded-[31px] p-6 h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-black text-[var(--ink)]">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[var(--ink)]">{plan.price}</span>
                    <span className="text-slate-400 text-xs font-bold">{plan.period}</span>
                  </div>
                </div>
                {plan.active && (
                  <div className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    CURRENT
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.active ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl font-black text-sm active:scale-95 transition-all ${
                  plan.active 
                  ? 'bg-slate-50 dark:bg-white/5 text-slate-400 cursor-default' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                {plan.active ? 'CURRENTLY ACTIVE' : 'UPGRADE PLAN'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
