import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { BackButton } from './BackButton';

interface MainLayoutProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, accentColor }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-500">
      <div className="atmosphere" aria-hidden="true" />
      <Header accentColor={accentColor} />
      <Hero accentColor={accentColor} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <BackButton />
        {children}
      </main>
      <footer className="w-full py-12 px-6 md:px-12 glass-panel border-x-0 border-b-0 rounded-none relative z-10 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase italic">QRnaMesa</span>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-black text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">Privacidade</a>
            <a href="#" className="text-[10px] font-black text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">Termos</a>
            <a href="#" className="text-[10px] font-black text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
