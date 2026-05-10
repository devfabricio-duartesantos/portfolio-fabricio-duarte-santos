import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on root
  if (location.pathname === '/') return null;

  return (
    <button
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest group"
    >
      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
      Voltar para o Painel
    </button>
  );
};
