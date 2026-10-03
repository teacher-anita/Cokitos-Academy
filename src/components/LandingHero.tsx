import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Smile, 
  BookOpen, 
  Video, 
  Zap, 
  Award,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Smartphone
} from 'lucide-react';
import { AudienceTheme } from '../types';
import { MODULES_INFO } from '../data/curriculumData';

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
    <div className="space-y-12 sm:space-y-16 animate-fadeIn pb-12">
      
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 text-white shadow-xl transition-all ${
        isKids
          ? 'bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600'
          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800'
      }`}>
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Método Adaptativo • TDAH & Neurodivergente Friendly</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {isKids ? (
              <>¡Aprende Inglés <span className="text-amber-300 underline decoration-amber-400">Jugando y Riendo</span> con La Teacher Cokitö! 🎈</>
            ) : (
              <>Habla Inglés con <span className="text-amber-400">Confianza Real</span>, Sin Bloqueos ni Estrés.</>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            {isKids
              ? 'Lecciones dinámicas de 30 a 45 minutos diseñadas para mantener la atención, celebrar cada pequeño logro y hablar desde la primera clase.'
              : 'Alineado al currículo internacional McGraw-Hill (SuperGoal y MegaGoal), con micro-bloques de 3 sesiones por unidad, quizzes interactivos y clases en vivo.'}
          </p>

          {/* Core Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs">
              <span className="block font-bold text-amber-300">Micro-Chunking ⏱️</span>
              <span className="text-blue-100 text-[11px]">3 sesiones por unidad, cero fatiga cognitiva</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs">
              <span className="block font-bold text-amber-300">100% Conversacional 🗣️</span>
              <span className="text-blue-100 text-[11px]">Pierde el miedo y suelta la lengua</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs col-span-2 sm:col-span-1">
              <span className="block font-bold text-amber-300">Gamificación Cokitö 🏆</span>
              <span className="text-blue-100 text-[11px]">Racha activa, puntos XP y Boss Fights</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <button
              onClick={onStartRegistration}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>Hacer Prueba Diagnóstica (25 Preguntas)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreCalendar}
              className="px-6 py-4 bg-white/15 hover:bg-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Horarios Disponibles</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. THE 4 MODULES PENSUM OVERVIEW */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Currículo Estructurado • 12 Niveles de Transformación
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Los 4 Módulos de La Teacher Cokitö
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Un camino paso a paso desde cero absoluto hasta la maestría conversacional y profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES_INFO.map(m => (
            <div
              key={m.module}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all hover:border-blue-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 font-black text-sm flex items-center justify-center">
                    M{m.module}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {m.hours}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-lg">{m.name}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{m.tagline}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Niveles que abarca:</span>
                  <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="font-bold">{m.levelsText}</span> • {m.booksText}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>{m.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRANSPARENT PRICING & DIGITAL SUBSCRIPTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Inversión Clara & Accesible
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Planes Diseñados Para Tu Rutina
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Elige entre el pase digital autónomo o el acompañamiento con clases en vivo de La Teacher Cokitö.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1: Plataforma Digital Autónoma ($5/mes) */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  Práctica Asincrónica
                </span>
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Pase Digital Cokitö</h3>
                <p className="text-xs text-slate-500">A tu propio ritmo, desde cualquier dispositivo</p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">$5</span>
                <span className="text-xs text-slate-500 font-semibold">/ mes</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acceso a los 12 niveles de la plataforma</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Banco de Quizzes interactivos por unidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pistas de audio nativas y fonética</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Retos diarios y racha Cokitö</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <span>Sin clases en vivo con la profesora</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Comenzar con Pase Digital
            </button>
          </div>

          {/* Plan 2: Clases Grupales */}
          <div className="bg-white rounded-3xl border-2 border-blue-600 p-6 shadow-md relative flex flex-col justify-between space-y-5">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Más Popular • Grupos Reducidos
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                  4 Horas / Mes
                </span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Grupo Dinámico</h3>
                <p className="text-xs text-slate-500">1 hora semanal en vivo (máx 4 alumnos)</p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">$20</span>
                <span className="text-xs text-slate-500 font-semibold">/ mes ($5/hora)</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 clase semanal en vivo con Teacher Cokitö</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Práctica conversacional en parejas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acceso completo a la plataforma y libros</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Corrección directa de pronunciación y tareas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Inscribirme en Grupo
            </button>
          </div>

          {/* Plan 3: Clases Privadas Personalizadas */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                  100% Personalizado 1 a 1
                </span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Mentoría Privada</h3>
                <p className="text-xs text-slate-500">Horarios flexibles adaptados a tu agenda</p>
              </div>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">$10</span>
                <span className="text-xs text-slate-500 font-semibold">/ hora</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Atención 1 a 1 exclusiva con Teacher Cokitö</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ritmo acelerado o de refuerzo neurodivergente</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simulación de entrevistas o inglés corporativo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Horarios coordinados en calendario compartido</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartRegistration}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Solicitar Clase Privada
            </button>
          </div>

        </div>
      </section>

      {/* 4. METHODOLOGY & TRUST PILLARS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <h3 className="font-bold text-slate-900 text-base text-center">
          Por Qué el Método Cokitö Transforma Tu Fluidez
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto">
              <Smile className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">Cero Juicio, Cero Vergüenza</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equivocarse es la única manera de aprender. Creamos un espacio seguro donde el error se celebra como un avance.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">Alineado a McGraw-Hill</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plan curricular estructurado con los objetivos de las series internacionales SuperGoal y MegaGoal de McGraw-Hill Education.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">Puntualidad & Respeto</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sesiones respetadas minuto a minuto con agenda compartida transparente y recordatorios automáticos.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
