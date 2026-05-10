import React, { useState } from 'react';
import { QRState, DotType, CornerSquareType, CornerDotType } from '../../types/qr';
import { ChevronDown, ChevronUp, Loader2, Sparkles, Sun, Moon } from 'lucide-react';
import { generateLogo } from '../../services/geminiService';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface QRControlsProps {
  options: QRState;
  updateOptions: (options: Partial<QRState>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const QRControls: React.FC<QRControlsProps> = ({ options, updateOptions, onImageUpload }) => {
  const { isGuest, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>('data');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLogo = async () => {
    if (isGuest) return;
    if (!generationPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const base64 = await generateLogo(generationPrompt);
      updateOptions({ image: base64 });
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar logotipo. Verifique sua conexão e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const dotTypes: DotType[] = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
  const cornerSquareTypes: CornerSquareType[] = ['square', 'dot', 'extra-rounded'];
  const cornerDotTypes: CornerDotType[] = ['square', 'dot'];

  const translateType = (type: string) => {
    const map: Record<string, string> = {
      'square': 'Quadrado',
      'dots': 'Pontos',
      'rounded': 'Arredondado',
      'extra-rounded': 'Extra Arredondado',
      'classy': 'Elegante',
      'classy-rounded': 'Elegante Arredondado',
      'dot': 'Ponto',
      'Numeric': 'Numérico',
      'Alphanumeric': 'Alfanumérico',
      'Byte': 'Byte',
      'Kanji': 'Kanji'
    };
    return map[type] || type.replace('-', ' ');
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const SectionHeader = ({ id, title }: { id: string, title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between py-5 text-slate-900 dark:text-white font-black tracking-widest text-xs border-b border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-all px-6 rounded-2xl mb-1 uppercase ${activeSection === id ? 'bg-slate-100 dark:bg-white/5 shadow-inner' : ''}`}
    >
      <span className={activeSection === id ? 'text-slate-900 dark:text-white scale-105 transition-transform' : 'text-gray-400'}>{title}</span>
      {activeSection === id ? <ChevronUp size={16} className="text-slate-900 dark:text-white" /> : <ChevronDown size={16} className="text-gray-500" />}
    </button>
  );

  return (
    <div className="space-y-6 glass-panel p-2 rounded-3xl overflow-hidden">
      {/* 1. Data Input Section (Main Options) */}
      <div className="last:border-0">
        <SectionHeader id="data" title="Conteúdo" />
        {activeSection === 'data' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Texto ou URL</label>
              <input
                type="text"
                value={options.data}
                onChange={(e) => updateOptions({ data: e.target.value })}
                placeholder="Insira a URL ou texto"
                className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white text-sm font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gerar Logo com IA</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generationPrompt}
                  disabled={isGuest}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder={isGuest ? "Faça login para usar a IA" : "Descreva o logo (ex: uma xícara de café)"}
                  className="flex-grow px-4 py-2.5 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm text-slate-900 dark:text-white font-bold transition-all disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateLogo()}
                />
                {isGuest ? (
                  <button
                    onClick={login}
                    className="px-4 py-2.5 glass-panel hover:glass-panel-hover text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateLogo}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gerar'}
                  </button>
                )}
              </div>
              <p className="text-[9px] text-gray-500 italic font-medium uppercase tracking-widest">
                {isGuest ? "Recurso exclusivo para usuários autenticados." : "Potencializado por Gemini AI"}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logotipo Manual</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={onImageUpload}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-blue-500 group-hover:bg-blue-500/5 transition-all">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-400">Clique para enviar imagem</span>
                </div>
              </div>
              {options.image && (
                <button 
                  onClick={() => updateOptions({ image: undefined })}
                  className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  Remover logotipo
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Largura</label>
                <input
                  type="number"
                  value={options.width}
                  onChange={(e) => updateOptions({ width: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Altura</label>
                <input
                  type="number"
                  value={options.height}
                  onChange={(e) => updateOptions({ height: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Margem</label>
                <input
                  type="number"
                  value={options.margin}
                  onChange={(e) => updateOptions({ margin: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Dots Styling Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="dots" title="Design dos Pontos" />
        {activeSection === 'dots' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid grid-cols-3 gap-3">
              {dotTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateOptions({ dotsOptions: { type } })}
                  className={`px-3 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                    options.dotsOptions?.type === type
                      ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-white/40 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {translateType(type)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cor dos Pontos</label>
                <div className="flex items-center gap-4 bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <input
                    type="color"
                    value={options.dotsOptions?.color}
                    onChange={(e) => updateOptions({ dotsOptions: { color: e.target.value } })}
                    onInput={(e) => updateOptions({ dotsOptions: { color: (e.target as HTMLInputElement).value } })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-transparent active:scale-90 transition-transform"
                  />
                  <span className="text-xs font-mono text-slate-900 dark:text-white font-black uppercase tracking-widest">{options.dotsOptions?.color}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Corners Square Options Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="corners-square" title="Cantos (Moldura)" />
        {activeSection === 'corners-square' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Style */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estilo da Moldura</label>
              <div className="grid grid-cols-3 gap-3">
                {['square', 'dot', 'extra-rounded'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateOptions({ cornersSquareOptions: { type: type as CornerSquareType } })}
                    className={`px-3 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                      options.cornersSquareOptions?.type === type
                        ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-105'
                        : 'bg-white/40 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {translateType(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Cor</span>
                <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  <button 
                    onClick={() => updateOptions({ cornersSquareOptions: { gradient: undefined } })}
                    className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${!options.cornersSquareOptions?.gradient ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'}`}
                  >Sólida</button>
                  <button 
                    onClick={() => updateOptions({ cornersSquareOptions: { gradient: { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: options.cornersSquareOptions?.color || '#000000' }, { offset: 1, color: '#ffffff' }] } } })}
                    className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${options.cornersSquareOptions?.gradient ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'}`}
                  >Degradê</button>
                </div>
              </div>

              {!options.cornersSquareOptions?.gradient ? (
                <div className="flex items-center gap-4 bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <input
                    type="color"
                    value={options.cornersSquareOptions?.color}
                    onChange={(e) => updateOptions({ cornersSquareOptions: { color: e.target.value } })}
                    onInput={(e) => updateOptions({ cornersSquareOptions: { color: (e.target as HTMLInputElement).value } })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-transparent shadow-lg active:scale-95 transition-transform"
                  />
                  <span className="text-xs font-mono text-slate-900 dark:text-white font-black uppercase tracking-widest">{options.cornersSquareOptions?.color}</span>
                </div>
              ) : (
                <div className="space-y-4 p-5 bg-slate-100 dark:bg-black/40 rounded-3xl border border-slate-200 dark:border-white/10">
                   <p className="text-[9px] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Configurações de Degradê</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Corners Dot Options Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="corners-dot" title="Cantos (Interno)" />
        {activeSection === 'corners-dot' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid grid-cols-2 gap-4">
              {cornerDotTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateOptions({ cornersDotOptions: { type } })}
                  className={`px-3 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl border transition-all ${
                    options.cornersDotOptions?.type === type
                      ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {translateType(type)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Background Options Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="background" title="Opções de Fundo" />
        {activeSection === 'background' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Color Type & Gradient */}
            <div className="bg-slate-100 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Cor</span>
                <div className="flex bg-slate-200 dark:bg-black/60 p-1 rounded-xl border border-slate-300 dark:border-white/5">
                  <button 
                    onClick={() => updateOptions({ backgroundOptions: { gradient: undefined } })}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${!options.backgroundOptions?.gradient ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >Cor Única</button>
                  <button 
                    onClick={() => updateOptions({ backgroundOptions: { gradient: { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: options.backgroundOptions?.color || '#ffffff' }, { offset: 1, color: '#e6e6e6' }] } } })}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${options.backgroundOptions?.gradient ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >Degradê</button>
                </div>
              </div>

              {!options.backgroundOptions?.gradient ? (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cor de Fundo</label>
                  <div className="flex items-center gap-4 bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                    <input
                      type="color"
                      value={options.backgroundOptions?.color}
                      onChange={(e) => updateOptions({ backgroundOptions: { color: e.target.value } })}
                      onInput={(e) => updateOptions({ backgroundOptions: { color: (e.target as HTMLInputElement).value } })}
                      className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-transparent shadow-lg"
                    />
                    <span className="text-xs font-mono text-slate-900 dark:text-white font-black uppercase tracking-widest">{options.backgroundOptions?.color}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Degradê</span>
                    <div className="flex bg-slate-200 dark:bg-black/60 p-1 rounded-xl border border-slate-300 dark:border-white/5">
                      <button 
                        onClick={() => updateOptions({ backgroundOptions: { gradient: { type: 'linear' } } })}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${options.backgroundOptions?.gradient?.type === 'linear' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >Linear</button>
                      <button 
                        onClick={() => updateOptions({ backgroundOptions: { gradient: { type: 'radial' } } })}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${options.backgroundOptions?.gradient?.type === 'radial' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >Radial</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cor Inicial</label>
                      <input
                        type="color"
                        value={options.backgroundOptions?.gradient?.colorStops[0].color}
                        onChange={(e) => {
                          const stops = [...options.backgroundOptions!.gradient!.colorStops];
                          stops[0].color = e.target.value;
                          updateOptions({ backgroundOptions: { gradient: { colorStops: stops } } });
                        }}
                        className="w-full h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cor Final</label>
                      <input
                        type="color"
                        value={options.backgroundOptions?.gradient?.colorStops[1].color}
                        onChange={(e) => {
                          const stops = [...options.backgroundOptions!.gradient!.colorStops];
                          stops[1].color = e.target.value;
                          updateOptions({ backgroundOptions: { gradient: { colorStops: stops } } });
                        }}
                        className="w-full h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rotation */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rotação (Graus)</label>
              <input
                type="number"
                value={options.backgroundOptions?.gradient?.rotation || 0}
                disabled={!options.backgroundOptions?.gradient}
                onChange={(e) => {
                  if (options.backgroundOptions?.gradient) {
                    updateOptions({ backgroundOptions: { ...options.backgroundOptions, gradient: { ...options.backgroundOptions.gradient, rotation: Number(e.target.value) } } });
                  }
                }}
                className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-30"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. Image Options Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="logo" title="Opções de Logotipo" />
        {activeSection === 'logo' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <label className="text-[10px] font-black text-slate-500 dark:text-gray-300 uppercase tracking-widest cursor-pointer" htmlFor="hide-dots">
                Ocultar Pontos Atrás do Logo
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  id="hide-dots"
                  type="checkbox"
                  checked={options.imageOptions?.hideBackgroundDots}
                  onChange={(e) => updateOptions({ 
                    imageOptions: { ...options.imageOptions, hideBackgroundDots: e.target.checked } 
                  })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tamanho</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1"
                  value={options.imageOptions?.imageSize}
                  onChange={(e) => updateOptions({ 
                    imageOptions: { ...options.imageOptions, imageSize: Number(e.target.value) } 
                  })}
                  className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Margem (px)</label>
                <input
                  type="number"
                  value={options.imageOptions?.margin}
                  onChange={(e) => updateOptions({ 
                    imageOptions: { ...options.imageOptions, margin: Number(e.target.value) } 
                  })}
                  className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Appearance Section */}
      <div className="last:border-0 border-t border-white/5">
        <SectionHeader id="appearance" title="Aparência" />
        {activeSection === 'appearance' && (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tema do Aplicativo</span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 border-slate-200 shadow-xl ring-2 ring-blue-500/20'
                      : 'bg-white/5 text-slate-500 dark:text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : 'text-gray-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Modo Claro</span>
                </button>
                <button
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-white border-transparent shadow-xl ring-2 ring-blue-500/20'
                      : 'bg-white/40 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Modo Escuro</span>
                </button>
              </div>
              <p className="text-[9px] text-gray-500 italic font-medium uppercase tracking-widest px-1 text-center">
                Altere o tema para melhor conforto visual durante a criação.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
