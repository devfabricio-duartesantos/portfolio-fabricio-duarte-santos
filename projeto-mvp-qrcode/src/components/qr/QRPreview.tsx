import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Loader2, Eye, Layout, Coffee } from 'lucide-react';
import { Extension } from '../../types/qr';
import { useQRCodeContext } from '../../contexts/QRCodeContext';
import { motion, AnimatePresence } from 'motion/react';

interface QRPreviewProps {
  qrRef: (node: HTMLDivElement | null) => void;
  download: (ext: Extension) => void;
  downloadJSON: () => void;
  onSave?: (name: string) => void;
  isSaving?: boolean;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ 
  qrRef, 
  download, 
  downloadJSON, 
  onSave,
  isSaving 
}) => {
  const { options } = useQRCodeContext();
  const [selectedFormat, setSelectedFormat] = useState<Extension>('png');
  const [isExpanded, setIsExpanded] = useState(true);
  const [qrName, setQrName] = useState(options.name || 'Meu QR Code');

  // Sync name when options change (e.g. after loading a project)
  useEffect(() => {
    if (options.name) {
      setQrName(options.name);
    }
  }, [options.name]);

  const formats: { id: Extension; label: string }[] = [
    { id: 'png', label: 'PNG' },
    { id: 'jpeg', label: 'JPEG' },
    { id: 'svg', label: 'SVG' },
  ];

  const handleSave = () => {
    if (onSave) {
      onSave(qrName);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 sticky top-12">
      <div className="relative w-full aspect-square max-w-[420px] group">
        <motion.div 
          key="raw"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full bg-white p-10 rounded-[40px] shadow-2xl flex items-center justify-center transition-all overflow-hidden border border-slate-200 dark:border-white/20"
        >
          <div 
            ref={qrRef} 
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
      </div>

      <div className="w-full space-y-6">
        {onSave && (
          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 px-1 uppercase tracking-widest">Nome do projeto</label>
              <input 
                type="text" 
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                className="w-full p-4 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-black text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="Ex: Tabela 01"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-3 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-400 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Salvando...' : options.id ? 'Atualizar Cloud' : 'Salvar Cloud'}
            </button>
            {options.id && (
              <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-widest">Projeto sincronizado</p>
            )}
          </div>
        )}

        <div className="glass-panel rounded-3xl overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest border-b border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors px-6"
          >
            <span className={isExpanded ? 'text-slate-900 dark:text-white' : 'text-gray-400'}>Download</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isExpanded && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-gray-500 text-center block uppercase tracking-[0.2em]">Formato</span>
                <div className="grid grid-cols-3 gap-3">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${
                        selectedFormat === format.id 
                          ? 'border-transparent bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                          : 'border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => download(selectedFormat)}
                className="w-full flex items-center justify-center gap-3 py-4.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-slate-800 dark:hover:bg-gray-100 transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-blue-500/10"
              >
                Baixar agora
              </button>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={downloadJSON}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white/40 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all text-[10px] font-black text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest"
                >
                  Exportar JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
