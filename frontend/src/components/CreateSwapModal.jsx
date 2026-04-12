import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';

const categories = ['Coding', 'Design', 'Music', 'Languages', 'Fitness', 'Photography', 'Math', 'Writing', 'Finance', 'Other'];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0
  })
};

const InputField = ({ label, id, value, onChange, placeholder }) => (
  <div className="mb-5 relative">
    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</label>
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-base"
      placeholder={placeholder}
      required
    />
  </div>
);

const SelectField = ({ label, value, onChange }) => (
  <div className="mb-5 relative">
    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none text-base cursor-pointer"
    >
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-7 text-zinc-500">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
);

export default function CreateSwapModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    title: '',
    offerSkill: '',
    offerCategory: 'Coding',
    seekSkill: '',
    seekCategory: 'Design'
  });

  const nextStep = () => { setDirection(1); setStep(2); };
  const prevStep = () => { setDirection(-1); setStep(1); };

  const handleClose = () => {
    onClose();
    setTimeout(() => { 
      setStep(1); 
      setFormData({ 
        title: '',
        offerSkill: '', 
        offerCategory: 'Coding', 
        seekSkill: '', 
        seekCategory: 'Design' 
      }); 
    }, 300); 
  };

  const handlePost = async () => {
    if (!formData.title.trim()) {
      return toast.error("Please enter a Gig Title");
    }

    try {
      const payload = {
        title: formData.title.trim(),
        offerSkill: formData.offerSkill.trim(),
        offerCategory: formData.offerCategory,
        seekSkill: formData.seekSkill.trim(),
        seekCategory: formData.seekCategory
      };

      await API.post('/swaps', payload);
      toast.success("Skill swap posted successfully! 🚀");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post swap");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 shadow-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-zinc-900/40 dark:bg-zinc-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-zinc-800 shadow-2xl shadow-indigo-500/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header & Progress */}
            <div className="px-8 pt-8 pb-4 relative border-b border-zinc-100 dark:border-zinc-800/80">
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-10 focus:outline-none"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 pr-8">
                Post a Skill Swap
              </h2>
              
              {/* Progress Bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-1.5 mb-2 relative overflow-hidden">
                <motion.div 
                   className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
                   initial={{ width: step === 1 ? '50%' : '100%' }}
                   animate={{ width: step === 1 ? '50%' : '100%' }}
                   transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <span className={step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Offer</span>
                <span className={step === 2 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Request</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative overflow-y-auto min-h-[320px] flex-1 custom-scrollbar">
              <AnimatePresence initial={false} custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 px-8 py-6 w-full h-full"
                  >
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">What are you offering?</h3>
                    <InputField 
                      label="Gig Title" 
                      id="title" 
                      placeholder="e.g. Logo Design for Web App"
                      value={formData.title}
                      onChange={(val) => setFormData({...formData, title: val})}
                    />
                    <InputField 
                      label="Skill Name" 
                      id="offerSkill" 
                      placeholder="e.g. React Frontend Development"
                      value={formData.offerSkill}
                      onChange={(val) => setFormData({...formData, offerSkill: val})}
                    />
                    <SelectField
                      label="Category"
                      value={formData.offerCategory}
                      onChange={(val) => setFormData({...formData, offerCategory: val})}
                    />
                    
                    <div className="absolute bottom-6 left-8 right-8 flex justify-end">
                      <button
                        onClick={nextStep}
                        disabled={!formData.offerSkill || !formData.title}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Next <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 px-8 py-6 w-full h-full"
                  >
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">What are you looking to learn?</h3>
                    <InputField 
                      label="Desired Skill" 
                      id="seekSkill" 
                      placeholder="e.g. UI/UX Design Prototyping"
                      value={formData.seekSkill}
                      onChange={(val) => setFormData({...formData, seekSkill: val})}
                    />
                    <SelectField
                      label="Category"
                      value={formData.seekCategory}
                      onChange={(val) => setFormData({...formData, seekCategory: val})}
                    />
                    
                    <div className="absolute bottom-6 left-8 right-8 flex justify-between">
                      <button
                        onClick={prevStep}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <ArrowLeft size={18} /> Back
                      </button>

                      <button
                        onClick={handlePost}
                        disabled={!formData.seekSkill}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-zinc-900"
                      >
                        <Sparkles size={18} /> Post Swap
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
