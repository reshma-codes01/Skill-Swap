import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';

const categories = ['Coding', 'Design', 'Music', 'Languages', 'Fitness', 'Photography', 'Math', 'Writing', 'Finance', 'Other'];
const statuses = ['Open', 'In-Progress', 'Completed'];

function InputField({ label, id, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">{label}</label>
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
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none text-base cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function EditSwapModal({ isOpen, onClose, swap, onSwapUpdated }) {
  const [offerSkill, setOfferSkill] = useState(swap?.offerSkill || '');
  const [offerCategory, setOfferCategory] = useState(swap?.offerCategory || 'Coding');
  const [seekSkill, setSeekSkill] = useState(swap?.seekSkill || '');
  const [seekCategory, setSeekCategory] = useState(swap?.seekCategory || 'Design');
  const [status, setStatus] = useState(swap?.status || 'Open');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!offerSkill.trim() || !seekSkill.trim()) {
      toast.error('Skill fields cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.put(`/swaps/${swap._id}`, {
        offerSkill: offerSkill.trim(),
        offerCategory,
        seekSkill: seekSkill.trim(),
        seekCategory,
        status,
      });
      onSwapUpdated(data);
      toast.success('Swap updated successfully! ✨');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update swap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 dark:bg-zinc-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-zinc-800 shadow-2xl shadow-indigo-500/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4 relative border-b border-zinc-100 dark:border-zinc-800/80">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-10 focus:outline-none"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 pr-8">
                Edit Swap
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="px-8 py-6">
              <InputField label="Offering Skill" id="editOfferSkill" value={offerSkill} onChange={setOfferSkill} placeholder="e.g. React Development" />
              <SelectField label="Offer Category" value={offerCategory} onChange={setOfferCategory} options={categories} />
              <InputField label="Seeking Skill" id="editSeekSkill" value={seekSkill} onChange={setSeekSkill} placeholder="e.g. UI/UX Design" />
              <SelectField label="Seek Category" value={seekCategory} onChange={setSeekCategory} options={categories} />
              <SelectField label="Status" value={status} onChange={setStatus} options={statuses} />

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
