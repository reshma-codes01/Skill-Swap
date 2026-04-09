import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, MapPin, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';

function InputField({ icon: Icon, label, id, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="relative mb-5 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10">
        <Icon size={18} />
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all text-base"
        placeholder={placeholder}
      />
      <label htmlFor={id} className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 sr-only">{label}</label>
    </div>
  );
}

function TextAreaField({ icon: Icon, label, id, value, onChange, placeholder }) {
  return (
    <div className="relative mb-5 group">
      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10">
        <Icon size={18} />
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="block w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all resize-none text-base"
        placeholder={placeholder}
      />
      <label htmlFor={id} className="sr-only">{label}</label>
    </div>
  );
}

export default function EditProfileModal({ isOpen, onClose, currentUser, onProfileUpdated }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', { name: name.trim(), bio: bio.trim(), location: location.trim() });
      onProfileUpdated(data);
      toast.success('Profile updated successfully! ✨');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
            className="relative w-full max-w-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-zinc-800 shadow-2xl shadow-indigo-500/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
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
                Edit Profile
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Update your personal information
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="px-8 py-6 flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Display Name</label>
              <InputField icon={UserIcon} label="Name" id="editName" value={name} onChange={setName} placeholder="Your full name" />

              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Bio</label>
              <TextAreaField icon={FileText} label="Bio" id="editBio" value={bio} onChange={setBio} placeholder="Tell people about yourself..." />

              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Location</label>
              <InputField icon={MapPin} label="Location" id="editLocation" value={location} onChange={setLocation} placeholder="e.g. Delhi Campus" />

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
                  {loading && <Loader2 size={16} className="animate-spin" />}
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
