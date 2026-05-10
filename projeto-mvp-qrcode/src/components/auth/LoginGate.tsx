import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, User as UserIcon, Sparkles, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest, login, continueAsGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030712] flex items-center justify-center z-[9999]">
        <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (user || isGuest) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-[#030712] flex items-center justify-center p-6 z-[9998] overflow-hidden">
      <div className="atmosphere" aria-hidden="true" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel rounded-[40px] p-10 md:p-14 text-center space-y-12 border-white/5 shadow-2xl"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] transform -rotate-12 border border-blue-400/30">
              <QrCode className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">QRnaMesa</h1>
            <p className="text-gray-400 font-black px-4 text-xs uppercase tracking-widest leading-relaxed">Gerador de QR Codes profissional para restaurantes de elite.</p>
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={login}
            className="group w-full flex items-center justify-center gap-3 bg-white text-black py-4.5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Entrar com Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-500">
              <span className="bg-[#030712] px-4">Modo</span>
            </div>
          </div>

          <button
            onClick={continueAsGuest}
            className="w-full flex items-center justify-center gap-3 glass-panel border-white/10 text-white py-4.5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
          >
            <UserIcon className="w-4 h-4" />
            Acesso Visitante
          </button>
        </div>

        <div className="bg-black/40 rounded-3xl p-6 border border-white/5 text-left space-y-5">
          <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Vantagens do Acesso Premium
          </div>
          <ul className="space-y-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <li className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>Geração de Logotipos com Inteligência Artificial.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>Sincronização ilimitada em múltiplos dispositivos.</span>
            </li>
          </ul>
        </div>

        <p className="text-[9px] text-gray-600 font-black leading-relaxed italic uppercase tracking-[0.1em] px-4">
          Ambiente seguro e profissional de design digital.
        </p>
      </motion.div>
    </div>
  );
};
