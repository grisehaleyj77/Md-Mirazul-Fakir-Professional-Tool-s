import React from 'react';
import { 
  Zap, 
  Check, 
  Crown, 
  Diamond, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Star,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Basic tools for personal use',
    features: ['10 daily AI requests', 'Standard processing speed', 'Basic PDF tools', 'Ad-supported'],
    color: 'bg-slate-100 dark:bg-white/5',
    icon: Zap,
    popular: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/mo',
    description: 'Best for creators and professionals',
    features: ['Unlimited AI requests', 'Priority processing', 'All PDF & Doc tools', 'Zero Ads', 'Advanced Image AI'],
    color: 'bg-blue-600',
    icon: Crown,
    popular: true
  },
  {
    name: 'Elite',
    price: '$24.99',
    period: '/mo',
    description: 'The ultimate toolkit for businesses',
    features: ['Everything in Pro', 'Custom AI models', 'Batch processing', 'API Access', '24/7 Priority support'],
    color: 'bg-indigo-950 dark:bg-white/10',
    icon: Diamond,
    popular: false
  }
];

export const Subscription = ({ userStatus, onUpgrade }: any) => {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

  const handleSelect = async (planName: string) => {
    if (planName === userStatus.plan) return;
    
    setLoadingPlan(planName);
    await new Promise(r => setTimeout(r, 1500));
    onUpgrade(planName);
    setLoadingPlan(null);
    alert(`Successfully upgraded to ${planName} plan!`);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
          <Zap className="w-3 h-3" />
          Current Plan: {userStatus.plan}
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight leading-tight">
          Upgrade to <span className="text-blue-600 italic">Premium</span>
        </h2>
        <p className="text-[var(--text-muted)] font-medium max-w-xs mx-auto">
          Unlock the full power of MMF Tools with our advanced features and AI capabilities.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-6 px-2">
        {PLANS.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-[32px] p-6 border ${plan.popular ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-[var(--glass-border)]'} ${plan.name === userStatus.plan ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-8 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
                <Star className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <div className={`w-10 h-10 ${plan.popular ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-600'} rounded-xl flex items-center justify-center mb-3`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className={`text-xl font-black ${plan.popular ? 'text-white' : ''}`}>{plan.name}</h3>
                <p className={`text-xs font-bold ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>{plan.description}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${plan.popular ? 'text-white' : ''}`}>
                  {plan.price}
                  {plan.period && <span className="text-sm font-bold opacity-60">{plan.period}</span>}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-wider ${plan.popular ? 'text-blue-100' : 'text-slate-400'}`}>Billed Monthly</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600 dark:bg-green-500/10'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={`text-xs font-bold ${plan.popular ? 'text-blue-50' : 'text-slate-500 font-medium'}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleSelect(plan.name)}
              disabled={loadingPlan !== null || plan.name === userStatus.plan}
              className={`w-full py-4 rounded-[20px] font-black uppercase tracking-[0.15em] text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.popular ? 'bg-white text-blue-600 shadow-xl' : 'bg-slate-900 text-white dark:bg-white/10 dark:text-white'} disabled:opacity-50`}
            >
              {loadingPlan === plan.name ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : plan.name === userStatus.plan ? (
                'Current Plan'
              ) : (
                <>Select {plan.name} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            {plan.popular && (
              <div className="absolute inset-0 bg-blue-600 -z-10 rounded-[32px]" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-8 space-y-6 border border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">Secure Payment</h4>
            <p className="text-[10px] font-bold text-slate-400">SSL Encrypted & Secure Transfers</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest justify-center border-t border-slate-200 dark:border-white/5 pt-6">
          Guaranteed <span className="text-blue-600">30-Day</span> Money Back
        </div>
      </div>
    </div>
  );
};
