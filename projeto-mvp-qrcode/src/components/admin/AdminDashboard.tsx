import React, { useEffect, useState } from 'react';
import { Shield, Trash2, Eye, Calendar, User, ExternalLink } from 'lucide-react';
import { qrService, SavedQRCode } from '@/src/services/qrService';
import { useAuth } from '@/src/contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [qrcodes, setQrcodes] = useState<SavedQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await qrService.getAllQRCodes();
      setQrcodes(data);
    } catch (error) {
      console.error("Error loading qrcodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este QR Code?')) {
      try {
        await qrService.deleteQRCode(id);
        setQrcodes(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        console.error("Error deleting qrcode:", error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Shield className="w-16 h-16 text-red-500 opacity-20" />
        <h2 className="text-2xl font-bold text-white">Acesso Negado</h2>
        <p className="text-gray-400">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">
            Painel Administrativo
          </h2>
          <p className="text-gray-400">Gerenciamento de todos os QR Codes gerados no sistema.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Admin Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : qrcodes.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-gray-500 font-medium">Nenhum QR Code encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">QR Code</th>
                  <th className="px-6 py-4 font-bold">Criador</th>
                  <th className="px-6 py-4 font-bold">Data</th>
                  <th className="px-6 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {qrcodes.map((qr) => (
                  <tr key={qr.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{qr.name}</span>
                        <span className="text-gray-500 text-xs truncate max-w-[200px]">{qr.data}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {qr.createdBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        {qr.createdAt?.toDate ? qr.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => handleDelete(qr.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
