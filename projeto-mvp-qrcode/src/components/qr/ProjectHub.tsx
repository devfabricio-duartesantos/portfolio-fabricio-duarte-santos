import React, { useEffect, useState } from 'react';
import { qrService, SavedQRCode } from '../../services/qrService';
import { useAuth } from '../../contexts/AuthContext';
import { useQRCodeContext } from '../../contexts/QRCodeContext';
import { useNavigate } from 'react-router-dom';
import { Plus, History, Folder, Star, Clock, ArrowRight, LayoutGrid, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const ProjectHub: React.FC = () => {
  const { user, isGuest, login } = useAuth();
  const { loadOptions, resetOptions } = useQRCodeContext();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<SavedQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecent();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecent = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await qrService.getUserQRCodes(user.uid);
      setRecentProjects(data.slice(0, 3));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    resetOptions();
    navigate('/editor');
  };

  const handleLoadProject = (qr: SavedQRCode) => {
    loadOptions({
      ...qr.options,
      id: qr.id,
      name: qr.name,
    } as any);
    navigate('/editor');
  };

  const menuItems = [
    { icon: Folder, label: 'Meus Projetos', count: user ? recentProjects.length : '-', path: '/library', color: 'blue', restricted: !user },
    { icon: History, label: 'Histórico', count: user ? 'Recente' : '-', path: '/history', color: 'amber', restricted: !user },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">
            <Star className="w-3 h-3 fill-current" />
            Workspace {user ? 'Profissional' : 'Visitante'}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-[0.9]">
            Olá, <span className="text-blue-600 dark:text-blue-400">{user?.displayName?.split(' ')[0] || 'Visitante'}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">O que vamos criar hoje?</p>
        </div>
        
        <button 
          onClick={handleNewProject}
          className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20"
        >
          <div className="bg-blue-600 rounded-xl p-2 group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Novo Projeto
        </button>
      </div>

      {/* Quick Stats / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menuItems.map((item, idx) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              if (item.restricted) {
                if (window.confirm('Esta ferramenta requer login. Deseja entrar agora?')) {
                  login();
                }
              } else if (item.path !== '#') {
                navigate(item.path);
              }
            }}
            className={cn(
              "glass-panel p-8 rounded-[40px] border-slate-200 dark:border-white/5 hover:glass-panel-hover transition-all cursor-pointer group relative overflow-hidden",
              item.restricted && "opacity-60 grayscale-[0.5]"
            )}
          >
            {item.restricted && (
              <div className="absolute top-4 right-4 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
            )}
            <div className={`p-4 bg-${item.color}-500/10 rounded-2xl border border-${item.color}-500/20 w-fit mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-6 h-6 text-${item.color}-500`} />
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">{item.label}</h3>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                {item.restricted ? 'Requer Login' : `${item.count} itens`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Trabalhos Recentes</h3>
          </div>
          {user && (
            <button 
              onClick={() => navigate('/library')}
              className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {!user ? (
           <div className="py-24 text-center glass-panel rounded-[40px] border-dashed border-2 border-slate-200 dark:border-white/5 space-y-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest">Sincronização desativada</p>
                <button 
                  onClick={login}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest underline underline-offset-4"
                >
                  Entre com Google para salvar e visualizar seus trabalhos
                </button>
              </div>
           </div>
        ) : loading ? (
          <div className="flex gap-8 overflow-hidden">
             {[1,2,3].map(i => (
               <div key={i} className="flex-1 h-48 glass-panel rounded-[40px] animate-pulse" />
             ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-[40px] border-dashed border-2 border-slate-200 dark:border-white/5">
             <p className="text-xs text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest">Nenhum projeto encontrado. Comece algo novo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProjects.map((qr) => (
              <div 
                key={qr.id}
                onClick={() => handleLoadProject(qr)}
                className="glass-panel p-8 rounded-[40px] border-slate-200 dark:border-white/5 hover:glass-panel-hover transition-all cursor-pointer group space-y-6"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-colors">
                   <div className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                      {/* Abstract QR Icon */}
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current dark:text-white text-slate-900">
                        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm2 2h2v2h-2v-2zm-4-4h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
                      </svg>
                   </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight truncate">{qr.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest truncate">{qr.data}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
