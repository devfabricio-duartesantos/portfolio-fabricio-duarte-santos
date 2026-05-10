import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User as UserIcon, Shield, ChevronDown, PlusCircle, Folder, Sun, Moon, Clock, Layout } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQRCodeContext } from '../../contexts/QRCodeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  accentColor?: string;
}

export const Header: React.FC<HeaderProps> = ({ accentColor = '#000000' }) => {
  const { user, isAdmin, isGuest, login, logout } = useAuth();
  const { resetOptions } = useQRCodeContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full glass-panel border-x-0 border-t-0 rounded-none py-4 px-6 md:px-12 relative z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer select-none">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 border border-slate-200 dark:border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            style={{ backgroundColor: accentColor !== '#000000' ? accentColor : '#3B82F6' }}
          >
            <span className="text-white font-display font-black text-xl italic uppercase">G</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase italic">
            QRnaMesa
          </span>
        </Link>
        
        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass-panel hover:glass-panel-hover transition-all text-slate-600 dark:text-gray-400 border-0 shadow-none bg-transparent"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-xl glass-panel hover:glass-panel-hover transition-all text-slate-900 dark:text-white border-0 shadow-none bg-transparent"
          >
            <ChevronDown className={cn("w-5 h-5 transition-transform", isMenuOpen && "rotate-180")} />
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            Início
          </Link>
          
          {(user || isGuest) && (
            <Link 
              to="/editor"
              onClick={() => { resetOptions(); }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Layout className="w-4 h-4" />
              Editor
            </Link>
          )}

          {(user || isGuest) && (
            <button 
              onClick={() => { resetOptions(); navigate('/editor'); }}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Criar QR
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

          {/* New prominent toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all group"
            title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
          >
            <div className="relative w-4 h-4">
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white">
              {theme === 'light' ? 'Escuro' : 'Claro'}
            </span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-2.5 rounded-2xl transition-all border border-slate-200 dark:border-white/10 group backdrop-blur-lg"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-slate-300 dark:border-white/20 shadow-sm" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {user.displayName?.split(' ')[0]}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 dark:text-gray-400 transition-transform", isMenuOpen && "rotate-180")} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    to="/library" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Folder className="w-4 h-4" />
                    Meus Projetos
                  </Link>
                  <Link 
                    to="/history" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Histórico
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Admin
                    </Link>
                  )}
                  <div className="h-px bg-slate-100 dark:bg-white/5 my-1 mx-2"></div>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : isGuest ? (
            <button 
              onClick={login}
              className="flex items-center gap-3 glass-panel hover:glass-panel-hover px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-slate-900 dark:text-white"
            >
              <LogIn className="w-4 h-4" />
              Sincronizar
            </button>
          ) : (
            <button 
              onClick={login}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              Entrar
            </button>
          )}
        </nav>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-[#030712] border-b border-slate-200 dark:border-white/10 md:hidden overflow-hidden z-40 transition-colors"
            >
              <div className="p-6 space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-gray-400">Início</Link>
                {(user || isGuest) && (
                  <Link to="/editor" onClick={() => { resetOptions(); setIsMenuOpen(false); }} className="block py-2 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-gray-400">Editor</Link>
                )}
                {user ? (
                  <>
                    <Link to="/library" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-gray-400">Meus Projetos</Link>
                    <Link to="/history" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-gray-400">Histórico</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Admin</Link>
                    )}
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block py-2 text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400 text-left">Sair</button>
                  </>
                ) : (
                  <button onClick={login} className="w-full py-4 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Entrar com Google</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
