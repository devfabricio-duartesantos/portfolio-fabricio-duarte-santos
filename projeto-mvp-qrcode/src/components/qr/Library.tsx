import React, { useEffect, useState } from 'react';
import { qrService, SavedQRCode } from '../../services/qrService';
import { useAuth } from '../../contexts/AuthContext';
import { useQRCodeContext } from '../../contexts/QRCodeContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Edit2 } from 'lucide-react';

export const Library: React.FC = () => {
  const { user } = useAuth();
  const { loadOptions } = useQRCodeContext();
  const navigate = useNavigate();
  const [qrcodes, setQrcodes] = useState<SavedQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserLibrary();
    }
  }, [user]);

  const loadUserLibrary = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await qrService.getUserQRCodes(user.uid);
      setQrcodes(data);
    } catch (error) {
      console.error("Error loading library:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Excluir este projeto permanentemente?')) {
      try {
        await qrService.deleteQRCode(id);
        setQrcodes(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleLoad = (qr: SavedQRCode) => {
    loadOptions({
      ...qr.options,
      id: qr.id,
      name: qr.name,
    } as any);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl">
        <p className="text-gray-400 font-black text-xl uppercase tracking-[0.2em] italic">Faça login para ver seus projetos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Meus Projetos</h2>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Seus projetos salvos na nuvem.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </div>
      ) : qrcodes.length === 0 ? (
        <div className="text-center py-32 glass-panel rounded-3xl border-dashed border-2">
          <p className="text-gray-500 font-black text-xs uppercase tracking-widest italic">Você ainda não salvou nenhum projeto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {qrcodes.map((qr) => (
            <div 
              key={qr.id} 
              onClick={() => handleLoad(qr)}
              className="glass-panel rounded-3xl p-6 hover:glass-panel-hover transition-all group cursor-pointer active:scale-[0.98] border-white/5 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight">{qr.name}</h3>
                  <p className="text-[10px] text-gray-500 truncate max-w-[200px] font-black uppercase tracking-widest">{qr.data}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLoad(qr); }}
                    className="p-2.5 text-gray-500 hover:text-blue-400 bg-white/5 rounded-xl transition-all border border-white/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, qr.id)}
                    className="p-2.5 text-gray-500 hover:text-red-400 bg-white/5 rounded-xl transition-all border border-white/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-black italic">
                <Calendar className="w-3 h-3" />
                {qr.createdAt?.toDate ? qr.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
