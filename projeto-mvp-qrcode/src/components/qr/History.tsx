import React, { useEffect, useState } from 'react';
import { qrService, HistoryItem } from '../../services/qrService';
import { localHistoryService, LocalHistoryItem } from '../../services/localHistoryService';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, ExternalLink, Download, FileJson, Cloud, Monitor, Trash2 } from 'lucide-react';

export const History: React.FC = () => {
  const { user } = useAuth();
  const [cloudHistory, setCloudHistory] = useState<HistoryItem[]>([]);
  const [localHistory, setLocalHistory] = useState<LocalHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'cloud' | 'local'>(user ? 'cloud' : 'local');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocalHistory();
    if (user) {
      loadCloudHistory();
    } else {
      setActiveTab('local');
    }
  }, [user]);

  const loadCloudHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await qrService.getGenerationHistory(user.uid);
      setCloudHistory(data);
    } catch (error) {
      console.error("Error loading cloud history:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalHistory = () => {
    const data = localHistoryService.getHistory();
    setLocalHistory(data);
    if (!user) setLoading(false);
  };

  const clearLocal = () => {
    if (window.confirm('Deseja limpar o histórico local?')) {
      localHistoryService.clearHistory();
      loadLocalHistory();
    }
  };

  const currentHistory = activeTab === 'cloud' ? cloudHistory : localHistory;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Histórico</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-black uppercase tracking-widest">Suas gerações recentes sincronizadas ou locais.</p>
        </div>

        <div className="flex bg-slate-200 dark:bg-black/40 p-1 rounded-2xl border border-slate-300 dark:border-white/10">
          <button 
            onClick={() => setActiveTab('cloud')}
            disabled={!user}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'cloud' 
                ? 'bg-white text-slate-900 dark:bg-white/10 dark:text-white shadow-sm border border-slate-300 dark:border-white/20' 
                : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 disabled:opacity-30'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Nuvem
          </button>
          <button 
            onClick={() => setActiveTab('local')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'local' 
                ? 'bg-white text-slate-900 dark:bg-white/10 dark:text-white shadow-sm border border-slate-300 dark:border-white/20' 
                : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Neste Navegador
          </button>
        </div>
      </div>

      {activeTab === 'local' && localHistory.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={clearLocal}
            className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Limpar tudo
          </button>
        </div>
      )}

      {loading && activeTab === 'cloud' ? (
        <div className="flex justify-center py-20">
          <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </div>
      ) : currentHistory.length === 0 ? (
        <div className="text-center py-32 glass-panel rounded-3xl border-dashed border-2 border-slate-200 dark:border-white/5">
          <p className="text-slate-400 dark:text-gray-500 font-black text-xs uppercase tracking-widest italic">
            {activeTab === 'cloud' ? 'Sincronize sua conta para ver gerações em nuvem.' : 'Nenhum item salvo localmente ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentHistory.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel rounded-3xl p-6 hover:glass-panel-hover transition-all border-slate-200 dark:border-white/5 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                   {item.format === 'json' ? <FileJson className="w-6 h-6 text-amber-500" /> : <Download className="w-6 h-6 text-blue-500" />}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    {item.format}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight truncate">
                  {item.data}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest italic">
                  <Calendar className="w-3 h-3" />
                  {typeof item.createdAt === 'string' 
                    ? new Date(item.createdAt).toLocaleString('pt-BR') 
                    : item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('pt-BR') : 'Agora'}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <button 
                  onClick={() => {
                     navigator.clipboard.writeText(item.data);
                     alert('Dados copiados!');
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                 >
                   <ExternalLink className="w-3 h-3" />
                   Copiar URL
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
