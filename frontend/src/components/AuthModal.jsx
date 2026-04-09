import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: 'easeIn' } }
};

// Defined OUTSIDE the component to prevent re-creation on every render.
// This is the fix for the focus-loss bug: React was unmounting and remounting
// the input element each render because it saw a brand-new component definition.
function InputField({ icon: Icon, type, label, id, value, onChange }) {
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
        className="block w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all peer"
        placeholder={label}
        required
      />
      <label
        htmlFor={id}
        className="absolute left-11 -top-2.5 bg-white dark:bg-zinc-900 px-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400 peer-focus:bg-white dark:peer-focus:bg-zinc-900 rounded-sm"
      >
        {label}
      </label>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back! 🎉");
      } else {
        await signup(name, email, password);
        toast.success("Account created successfully! 👋");
      }
      // Reset form and close modal on success
      setName('');
      setEmail('');
      setPassword('');
      onClose();
      navigate('/');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || 'Something went wrong'));
    } finally {
      setLoading(false);
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
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 dark:bg-zinc-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-zinc-800 shadow-2xl shadow-indigo-500/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-10 focus:outline-none"
            >
              <X size={20} />
            </button>

            <div className="px-8 pt-10 pb-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                {isLogin ? 'Welcome back' : 'Join SkillSwap'}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isLogin ? 'Enter your details to access your account.' : 'Create an account to start exchanging skills.'}
              </p>
            </div>

            <div className="px-8 pb-8 relative flex-1">
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? 'login' : 'signup'}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col"
                  onSubmit={handleSubmit}
                >
                  {!isLogin && <InputField icon={UserIcon} type="text" id="name" label="Full Name" value={name} onChange={setName} />}
                  <InputField icon={Mail} type="email" id="email" label="College Email (.edu / .ac.in)" value={email} onChange={setEmail} />
                  <InputField icon={Lock} type="password" id="password" label="Password" value={password} onChange={setPassword} />

                  {isLogin && (
                    <div className="flex justify-end mb-4 -mt-2">
                      <button type="button" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 mt-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </motion.form>
              </AnimatePresence>

              <div className="mt-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={toggleMode}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
