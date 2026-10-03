import React from 'react';
import { Sparkles, BookOpen, Clock, Users, Shield, ArrowRight, Zap, CheckCircle2, Award, Heart, Compass } from 'lucide-react';
import { AudienceTheme, PlanIntensity } from '../types';
import { MODULES_INFO, INTENSITY_PLANS } from '../data/curriculumData';

interface LandingHeroProps {
  audienceTheme: AudienceTheme;
  onStartRegistration: () => void;
  onExploreCalendar: () => void;
  onExploreGamification: () => void;
  onOpenOptimizer: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  audienceTheme,
  onStartRegistration,
  onExploreCalendar,
  onExploreGamification,
  onOpenOptimizer
}) => {
  const isKids = audienceTheme === 'kids';

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Welcome Banner */}
      <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 text-white shadow-xl transition-colors duration-300 ${
        isKids
          ? 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600'
          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800'
      }`}>
        
        {/* Decorative blur spheres */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${
              isKids
                ? 'bg-yellow-300 text-yellow-950 border-yellow-400'
                : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
            }`}>
              {isKids ? '🎈 Academia Kids & Teens • La Teacher Cokito' : '🎓 Formación Académica & Profesional • La Teacher Cokito'}
            </span>
            <span className="text-xs text-blue-200">
              McGraw-Hill Super Goal & MegaGoal
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            El Arte de Dominar el Inglés:{' '}
            <span className={isKids ? 'text-yellow-200 underline decoration-yellow-400' : 'text-amber-400'}>
              Sin Miedo, Sin Filtros
            </span>{' '}
            y a Tu Ritmo.
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Bienvenid@ a nuestra academia. Olvídate de traducir palabra por palabra en la mente o de memorizar listas aburridas. Nuestro programa bajo estándares del Marco Común Europeo (MCER) combina inmersión comunicativa, acompañamiento empático y adaptaciones neurodivergentes para que hables con total confianza.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStartRegistration}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-102 ${
                isKids
                  ? 'bg-yellow-300 hover:bg-yellow-200 text-slate-900'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <span>Inscribirme y Hacer Prueba de Nivel</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreCalendar}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors"
            >
              <span>Ver Horarios Disponibles</span>
            </button>

            <button
              onClick={onExploreGamification}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-xs bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/30 transition-colors"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>Retos Diarios Duolingo</span>
            </button>
          </div>

        </div>

      </section>

      {/* The 4 Official Learning Modules from Dossier */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-block">
            El Mapa del Viaje Pedagógico
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Los 4 Módulos de Transformación
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cada módulo representa una etapa de evolución donde desbloqueas nuevas competencias comunicativas en Google Classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES_INFO.map(mod => (
            <div
              key={mod.module}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center border border-blue-100">
                    M{mod.module}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {mod.hours}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-black text-blue-700 block">
                    {mod.tagline}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{mod.name}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    {mod.levelsText} • {mod.booksText}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Meta: {mod.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Weekly Rates Overview */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-white px-3 py-1 rounded-md border border-slate-200 inline-block mb-1">
              Transparencia Total
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Planes Semanales Oficiales
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tarifas por semana calculadas para ofrecerte el mejor costo por hora. A mayor número de alumnos o frecuencia, menor costo.
            </p>
          </div>

          <button
            onClick={onOpenOptimizer}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Ver Estructura de Horarios</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(INTENSITY_PLANS) as PlanIntensity[]).map(key => {
            const p = INTENSITY_PLANS[key];
            return (
              <div key={key} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    ${p.prices.individual}/sem
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 block">{p.badge}</span>
                
                <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span>1 Persona:</span>
                    <strong>${p.prices.individual.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>2 Personas (Dúo):</span>
                    <strong>${p.prices.duo.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>3 Personas (Squad):</span>
                    <strong>${p.prices.squad3.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>4 Personas (Crew):</span>
                    <strong>${p.prices.crew4.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  {p.recommendedFormat}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>Convenios Especiales:</strong> 20% descuento Friends & Family y tarifas institucionales preferenciales Zoom CSB aplicadas en tu control interno.
            </span>
          </div>
          <button
            onClick={onStartRegistration}
            className="text-blue-700 hover:underline font-bold text-xs whitespace-nowrap"
          >
            Quiero Inscribirme Ahora →
          </button>
        </div>
      </section>

      {/* Neurodivergent / TDAH Methodology Banner */}
      <section className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            🧠
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
              Metodología Neurodivergente • Espacio TDA & TDAH
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Creado por una Teacher TDAH para mentes brillantes e inquietas
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
          El cerebro con TDA o TDAH aprende idiomas a una velocidad asombrosa si se le da el estímulo correcto. En la academia de La Teacher Cokito eliminamos los muros de texto aburridos, utilizamos micro-lecciones dinámicas (chunking), dopamina a través de retos gamificados y un ambiente seguro sin ansiedad.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-slate-800">
            🌈 Cero Muros de Texto
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-slate-800">
            ⏱️ Micro-Lecciones Dinámicas
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-slate-800">
            🎮 Retos Tipo Duolingo
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-slate-800">
            🧘‍♀️ Ecosistema Antiansiedad
          </div>
        </div>
      </section>

    </div>
  );
};
