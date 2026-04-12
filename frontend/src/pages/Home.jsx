import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Users, TrendingUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import PageWrapper from '../components/PageWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const features = [
  {
    icon: Wallet,
    title: 'Zero Money',
    description: 'Transform your knowledge into a currency. Barter skills without spending a single dime.',
    color: 'text-emerald-500 dark:text-emerald-400',
    bgLight: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-500/20'
  },
  {
    icon: Users,
    title: 'Campus Network',
    description: 'Connect with driven students locally. Build a professional, verified campus community.',
    color: 'text-indigo-500 dark:text-indigo-400',
    bgLight: 'bg-indigo-100',
    bgDark: 'dark:bg-indigo-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Skill Growth',
    description: 'Learn precisely what you need from experts next door. Accelerate your career growth organically.',
    color: 'text-purple-500 dark:text-purple-400',
    bgLight: 'bg-purple-100',
    bgDark: 'dark:bg-purple-500/20'
  }
];

export default function Home({ onLoginClick }) {
  return (
    <PageWrapper>
      <div className="flex flex-col w-full">
        <HeroSection onLoginClick={onLoginClick} />
        
        {/* Featured Section: Why Choose Us */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">SkillSwap?</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
              We bring together the most driven students on campus to foster a community of mutual growth and pure value exchange.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group relative bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 shadow-xl shadow-zinc-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Subtle Hover Glow behind card logic, achieved via border transition */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${feature.bgLight} ${feature.bgDark} transition-transform group-hover:scale-110 duration-300`}>
                  <feature.icon size={32} className={`${feature.color}`} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 relative z-10">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed relative z-10">
                  {feature.description}
               </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </PageWrapper>
  );
}
