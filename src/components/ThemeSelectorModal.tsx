import React, { useState } from 'react';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Trophy, 
  SunMedium, 
  Moon, 
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COQUITOS_THEMES, ThemeConfig, applyThemeToDocument } from '../services/themeService';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: string;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'neurodivergent' | 'sports' | 'pastels'>('all');
  const [tempSelectedId, setTempSelectedId] = useState<string>(activeThemeId);

  if (!isOpen) return null;

  const filteredThemes = COQUITOS_THEMES.filter(t => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'neurodivergent') return t.category === 'neurodivergent' || t.category === 'official';
    return t.category === selectedCategory;
  });

  const handleApply = (theme: ThemeConfig) => {
    setTempSelectedId(theme.id);
    applyThemeToDocument(theme);
    onSelectTheme(theme);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Personalización Visual Coquitos
              </span>
              <span className="text-xs text-blue-200 font-semibold">TDAH & Sensory Friendly</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Paletas de Colores & Temáticas
            </h2>
            <p className="text-xs text-slate-300 max-w-md">
              Adapta la plataforma a tus necesidades sensoriales de hoy: bajo estímulo, hiperfoco nocturno, tus equipos favoritos o tonos pasteles reconfortantes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🌟 Todos ({COQUITOS_THEMES.length})
          </button>

          <button
            onClick={() => setSelectedCategory('neurodivergent')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'neurodivergent'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>🧠 Enfoque & TDAH</span>
          </button>

          <button
            onClick={() => setSelectedCategory('sports')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'sports'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>🏆 Equipos de Waky</span>
          </button>

          <button
            onClick={() => setSelectedCategory('pastels')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'pastels'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-300" />
            <span>🌸 Tonos Pasteles & Dulces</span>
          </button>
        </div>

        {/* Themes Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredThemes.map((th) => {
              const isCurrent = th.id === tempSelectedId;

              return (
                <div
                  key={th.id}
                  onClick={() => handleApply(th)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${
                    isCurrent
                      ? 'border-slate-900 bg-slate-50/80 shadow-md scale-101'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/40 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{th.emoji}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm leading-tight">
                            {th.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {th.category === 'official' ? 'Oficial Coquitos' :
                             th.category === 'neurodivergent' ? 'Sensory & Focus' :
                             th.category === 'sports' ? 'Club Deportivo' : 'Paleta Pastel'}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {th.tagline}
                    </p>
                  </div>

                  {/* Swatch Previews */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400">Paleta:</span>
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: th.colors.primary }}
                        title="Primario"
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: th.colors.secondary }}
                        title="Secundario / Acento"
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: th.colors.bgBody }}
                        title="Fondo"
                      />
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: th.colors.textMain }}
                        title="Texto Principal"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tu tema se guarda automáticamente para tus próximas sesiones en este dispositivo.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-black shadow-md transition-colors"
          >
            Listo • Disfrutar Tema
          </button>
        </div>

      </div>
    </div>
  );
};
