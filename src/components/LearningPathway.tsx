import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Award, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Play, 
  FileText, 
  Trophy, 
  ArrowRight,
  Shield,
  Layers,
  Zap,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Student, AudienceTheme } from '../types';
import { PATHWAY_LEVELS, PathwayLevel, PathwayUnit, PathwaySession } from '../data/pathwayData';
import { UnitQuizModal } from './UnitQuizModal';

interface LearningPathwayProps {
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  onOpenRegister: () => void;
  onOpenPlacementTest: () => void;
  onAwardXp: (studentId: string, amount: number) => void;
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({
  currentStudent,
  activeRole,
  audienceTheme,
  onOpenRegister,
  onOpenPlacementTest,
  onAwardXp
}) => {
  const isTeacher = activeRole === 'teacher';
  // A student is enrolled if their status is 'enrolled'
  const isEnrolled = isTeacher || (currentStudent && currentStudent.status === 'enrolled');

  // Level selection (defaults to current student's level or level_1)
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    currentStudent?.levelId || 'level_1'
  );

  // Selected Unit for Quiz
  const [quizUnit, setQuizUnit] = useState<PathwayUnit | null>(null);

  // Completed sessions tracking in local state
  const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>({});

  // Classroom copy notification
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const activeLevel = PATHWAY_LEVELS.find(l => l.levelId === selectedLevelId) || PATHWAY_LEVELS[0];

  const toggleSessionCompletion = (sessionKey: string) => {
    setCompletedSessions(prev => {
      const nextVal = !prev[sessionKey];
      if (nextVal && currentStudent) {
        onAwardXp(currentStudent.id, 25);
      }
      return { ...prev, [sessionKey]: nextVal };
    });
  };

  const handleCopyClassroomTemplate = (unit: PathwayUnit, session: PathwaySession) => {
    const template = `📌 TÍTULO: [M${activeLevel.module}-N${activeLevel.levelNumber}-U${unit.unitNumber}-${session.sessionCode}] Unit ${unit.unitNumber}: ${unit.title} — ${session.sessionName}

¡Hola, chicos! Welcome to your mission with La Teacher Cokito! 👋✨

📖 1. TRABAJO DE CLASE (${activeLevel.book} - ${unit.sbPages}):
${session.items.map(it => `• Item ${it.number}: ${it.title} (${it.description})`).join('\n')}

${session.workbookPages ? `📝 2. HOMEWORK / WORKBOOK (Asignación obligatoria):
• Completa las páginas: ${session.workbookPages}.
• Sube la fotografía o escaneo PDF de tus páginas resueltas en esta publicación.` : '📝 2. ACTIVIDAD DE REFUERZO: Practica con tus notas de clase.'}

🕹️ 3. QUIZ DE PRÁCTICA:
• Ingresa a la plataforma y realiza el Quiz de la Unidad para sumar +50 XP a tu racha de Duolingo.

💡 TIP COKITO: ${unit.tipCokito}`;

    navigator.clipboard.writeText(template);
    setCopiedNotice(`¡Plantilla de [${unit.title} - ${session.sessionCode}] copiada para Classroom!`);
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  // IF NOT ENROLLED AND NOT TEACHER: LOCKED PREVIEW
  if (!isEnrolled) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
        
        {/* Paywall Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block">
              Acceso Exclusivo para Alumnos Matriculados
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Aula Virtual & Pensum McGraw-Hill
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Actualmente estás explorando en modo <strong>Aspirante / Invitado</strong>. Tienes acceso libre a la <strong>Prueba de Nivel (25 preguntas)</strong>, la <strong>Agenda de Disponibilidad</strong> y los <strong>Retos Duolingo</strong>.
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg mx-auto text-xs text-blue-200 text-left space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              ¿Qué obtienes al matricularte con La Teacher Cokito?
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-blue-100">
              <li>Clases en vivo personalizadas (Zoom CSB / Google Meet).</li>
              <li>Acceso al Student Book y Workbook digital de McGraw-Hill.</li>
              <li>Micro-sesiones de práctica (A, B y C) con 11 ítems pedagógicos.</li>
              <li>Quizzes autocorregibles de fin de unidad y Boss Fights con insignias.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenPlacementTest}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102"
            >
              Comenzar Prueba de Nivel Gratis
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Completar Solicitud de Inscripción
            </button>
          </div>
        </div>

        {/* Preview of Modules Locked */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>Vista Previa del Pensum Oficial (Bloqueado)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PATHWAY_LEVELS.map(lvl => (
              <div
                key={lvl.levelId}
                className="bg-white rounded-2xl border border-slate-200 p-5 opacity-75 relative overflow-hidden space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Módulo {lvl.module}: {lvl.moduleName}
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-slate-800 text-base">{lvl.levelName}</h4>
                <p className="text-xs text-slate-500">{lvl.book}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{lvl.units.length} Unidades estructuradas</span>
                  <span>Marco MCER {lvl.cefrEquiv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ENROLLED / TEACHER: FULL INTERACTIVE VIRTUAL CLASSROOM
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      
      {/* Toast Notice */}
      {copiedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Student Open English-style Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/30">
                {isTeacher ? 'Modo Docente • La Teacher Cokito' : 'Alumno Matriculado Oficial'}
              </span>
              <span className="text-xs text-blue-200">
                {activeLevel.book}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isTeacher ? 'Guía Maestra de Unidades & Pensum' : `Ruta de Aprendizaje: ${currentStudent?.name || 'Alumno'}`}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Cada unidad se divide en **3 Sesiones clave (A, B y C)** con los 11 ítems de McGraw-Hill. Completa tus sesiones y quizzes para ganar XP y mantener tu racha activa.
            </p>
          </div>

          {/* Quick Meet / Class info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200">Próxima Clase:</span>
              <span className="font-bold text-amber-300">En Vivo</span>
            </div>
            <div className="text-xs font-semibold">
              <span className="block text-white">Teacher: La Teacher Cokito</span>
              <span className="text-blue-200 text-[11px] block mt-0.5">
                {currentStudent?.assignedSlots && currentStudent.assignedSlots.length > 0
                  ? currentStudent.assignedSlots.join(', ')
                  : 'Horario según agenda'}
              </span>
            </div>
            <a
              href="https://meet.google.com/eng-cokito-class"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Entrar a Google Meet</span>
            </a>
          </div>
        </div>

        {/* Level Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-white/10 pt-4 text-xs font-bold">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0">Nivel:</span>
          {PATHWAY_LEVELS.map(lvl => (
            <button
              key={lvl.levelId}
              onClick={() => setSelectedLevelId(lvl.levelId)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedLevelId === lvl.levelId
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {lvl.levelName}
            </button>
          ))}
        </div>
      </div>

      {/* Book Format Notice */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        activeLevel.isIntegratedWorkbook
          ? 'bg-blue-50 border-blue-200 text-blue-950'
          : 'bg-purple-50 border-purple-200 text-purple-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <strong className="block font-bold">
              {activeLevel.isIntegratedWorkbook ? 'Formato SuperGoal (Tomo Integrado):' : 'Formato MegaGoal (Volúmenes Separados):'}
            </strong>
            <span className="text-[11px] opacity-80">
              {activeLevel.isIntegratedWorkbook
                ? 'El Student Book y el Workbook vienen en el mismo libro (el Workbook comienza a partir de la página 89).'
                : 'El Student Book y el Workbook son libros independientes. Los ejercicios de escritura analítica están en el cuaderno separado.'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-white px-3 py-1 rounded-xl shadow-2xs border border-slate-200">
          Marco MCER: {activeLevel.cefrEquiv}
        </span>
      </div>

      {/* Units & Boss Fights Section */}
      <div className="space-y-6">
        {activeLevel.units.map(unit => (
          <div
            key={unit.unitNumber}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
          >
            {/* Unit Header */}
            <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                    Unit {unit.unitNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{unit.bookTitle}</span>
                  <span className="text-xs text-slate-400">• {unit.sbPages}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-600">
                  <strong>Grammar:</strong> {unit.grammarFocus}
                </p>
                <p className="text-[11px] text-slate-500">
                  <strong>Vocabulary:</strong> {unit.vocabularyTheme}
                </p>
              </div>

              {/* Action Buttons for this Unit */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setQuizUnit(unit)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quiz de Unidad (+50 XP)</span>
                </button>
              </div>
            </div>

            {/* The 3 Sessions: A, B, C (Micro-chunking) */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {unit.sessions.map(session => {
                const sessionKey = `${unit.unitNumber}_${session.sessionCode}`;
                const isDone = completedSessions[sessionKey];

                return (
                  <div
                    key={session.sessionCode}
                    className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          {session.itemsRange}
                        </span>
                        <button
                          onClick={() => toggleSessionCompletion(sessionKey)}
                          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isDone ? 'Lista (+25 XP)' : 'Marcar Lista'}</span>
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{session.sessionName}</h4>

                      {/* Items List */}
                      <ul className="space-y-1.5 pt-1 text-xs">
                        {session.items.map(it => (
                          <li key={it.number} className="text-slate-600 flex items-start gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {it.number}
                            </span>
                            <div>
                              <strong className="text-slate-800">{it.title}</strong>
                              <span className="block text-[11px] text-slate-500">{it.description}</span>
                              {it.audioTrack && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md mt-0.5">
                                  🎧 {it.audioTrack}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Workbook mention */}
                      {session.workbookPages && (
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                          <strong className="block text-slate-800 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-blue-600" />
                            Workbook de Práctica:
                          </strong>
                          <span>{session.workbookPages}</span>
                        </div>
                      )}
                    </div>

                    {/* Teacher Action: Copy for Classroom */}
                    {isTeacher && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleCopyClassroomTemplate(unit, session)}
                          className="w-full py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          title="Copiar plantilla formateada para pegar en Google Classroom"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar para Classroom</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tip Cokito Footer */}
            <div className="px-6 py-3 bg-amber-50/60 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-950 font-medium">
              <span className="font-bold text-amber-700">💡 Tip Cokito:</span>
              <span>{unit.tipCokito}</span>
            </div>
          </div>
        ))}

        {/* Boss Fights (Expansion Units) */}
        {activeLevel.bossFights.map(boss => (
          <div
            key={boss.id}
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Boss Fight • Punto de Control
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {boss.badgeName}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                {boss.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-900/90 max-w-xl font-medium">
                {boss.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              {boss.googleFormUrl && (
                <a
                  href={boss.googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-transform hover:scale-102 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Realizar Boss Fight</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {quizUnit && (
        <UnitQuizModal
          unit={quizUnit}
          isOpen={!!quizUnit}
          onClose={() => setQuizUnit(null)}
          onQuizFinished={(score, total) => {
            if (currentStudent) {
              onAwardXp(currentStudent.id, 50);
            }
          }}
        />
      )}

    </div>
  );
};
