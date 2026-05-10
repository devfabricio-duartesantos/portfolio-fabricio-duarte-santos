import React from 'react';

import { motion } from 'motion/react';

interface HeroProps {
  accentColor?: string;
}

export const Hero: React.FC<HeroProps> = ({ accentColor = '#3B82F6' }) => {
  return (
    <section className="w-full py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
            Design de Próxima Geração
          </div>
          
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white uppercase italic">
            Crie <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">QR Codes</span> sem limites
          </h2>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-gray-400 font-bold leading-relaxed">
            Personalize cada detalhe, das cores ao estilo dos pontos, com uma interface <span className="text-slate-900 dark:text-white">Crystal Glass</span> intuitiva.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
