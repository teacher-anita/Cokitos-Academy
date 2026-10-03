import React, { useState } from 'react';
import { Flame, Zap, Award, Trophy, CheckCircle2, XCircle, ArrowRight, Star, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyChallenge, Student, AudienceTheme } from '../types';
import { DAILY_CHALLENGES } from '../data/curriculumData';

interface GamificationHubProps {
  currentStudent: Student | null;
  students: Student[];
  onAwardXp: (studentId: string, amount: number) => void;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  currentStudent,
  students,
  onAwardXp,
  activeRole,
  audienceTheme
}) => {
  const isKids = audienceTheme === 'kids';

  const [challenges, setChallenges] = useState<DailyChallenge[]>(DAILY_CHALLENGES);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<'All' | 'Bronce' | 'Plata' | 'Oro' | 'Diamante'>('All');
  
  // Teacher modal for new challenge
  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening'>('Vocabulary');
  const [newAudience, setNewAudience] = useState<'all' | 'kids' | 'adults'>('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newXp, setNewXp] = useState(30);

  // Filter challenges according to theme
  const filteredChallenges = challenges.filter(c => {
    if (c.audience === 'all') return true;
    return isKids ? c.audience === 'kids' : c.audience === 'adults';
  });

  const currentChallenge = filteredChallenges[activeChallengeIndex] || filteredChallenges[0] || challenges[0];

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentChallenge.correctIndex;
    setIsCorrect(correct);
    setHasSubmitted(true);

    if (correct) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      if (currentStudent) {
        onAwardXp(currentStudent.id, currentChallenge.xpReward);
      }
    }
  };

  const handleNextChallenge = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setActiveChallengeIndex((prev) => (prev + 1) % filteredChallenges.length);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || newOptions.some(o => !o.trim())) {
      alert('Por favor completa todos los campos del reto');
      return;
    }

    const created: DailyChallenge = {
      id: `ch_${Date.now()}`,
      title: newTitle || 'Reto de Teacher Cokito',
      category: newCategory,
      audience: newAudience,
      xpReward: Number(newXp) || 25,
      prompt: 'Responde correctamente para sumar puntos a tu liga semanal:',
      question: newQuestion,
      options: newOptions,
      correctIndex: Number(newCorrectIndex),
      explanation: newExplanation || '¡Excelente trabajo practicando tu inglés!'
    };

    setChallenges(prev => [created, ...prev]);
    setShowNewChallengeModal(false);
    alert('¡Reto diario publicado con éxito!');
  };

  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);
  const filteredStudents = selectedLeague === 'All'
    ? sortedStudents
    : sortedStudents.filter(s => s.league === selectedLeague);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Top Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        isKids
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500'
          : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800'
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Gamificación Duolingo Style
            </span>
            <span className="text-xs text-blue-200">
              {isKids ? '🎈 Retos para Niños & Teens' : '🎓 Retos para Adultos & Pro'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ¡Entrena tu inglés y escala en la clasificación!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Resuelve los micro-retos diarios preparados por Teacher Cokito para ganar XP, mantener encendida tu racha (🔥) y asegurar tu ascenso de liga.
          </p>
        </div>

        {/* Streak & XP Counters */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-2xl">
              <Flame className="w-7 h-7 fill-amber-400 text-amber-400 animate-bounce" />
              <span>{currentStudent?.streak || 14}</span>
            </div>
            <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Días de Racha</span>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-300 font-black text-2xl">
              <Zap className="w-7 h-7 fill-yellow-400 text-yellow-400" />
              <span>{currentStudent?.xp || 1420}</span>
            </div>
            <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Total XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Challenge Interactive Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Reto Diario #{activeChallengeIndex + 1}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                      {currentChallenge.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{currentChallenge.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  +{currentChallenge.xpReward} XP
                </span>
                {activeRole === 'teacher' && (
                  <button
                    onClick={() => setShowNewChallengeModal(true)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Reto</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">{currentChallenge.prompt}</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                  {currentChallenge.question}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {currentChallenge.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optionClasses = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                if (hasSubmitted) {
                  if (idx === currentChallenge.correctIndex) {
                    optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optionClasses = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200';
                  } else {
                    optionClasses = 'opacity-50 border-slate-200 bg-slate-50 text-slate-400';
                  }
                } else if (isSelected) {
                  optionClasses = 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-200 shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optionClasses}`}
                  >
                    <span>{opt}</span>
                    {hasSubmitted && idx === currentChallenge.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {hasSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasSubmitted && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Respuesta Correcta! Has sumado +{currentChallenge.xpReward} XP</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Explicación de Teacher Cokito:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed mt-1">
                  {currentChallenge.explanation}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Reto {activeChallengeIndex + 1} de {filteredChallenges.length}
              </span>

              {!hasSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  Comprobar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  <span>Siguiente Reto</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Tabla de Clasificación</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Liga Semanal</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['All', 'Diamante', 'Oro', 'Plata', 'Bronce'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLeague(l)}
                  className={`flex-1 py-1 rounded-lg transition-all text-center ${
                    selectedLeague === l
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l === 'All' ? 'Todos' : l}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredStudents.map((st, idx) => {
                const isCurrent = currentStudent && st.id === currentStudent.id;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-300'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-sm text-slate-700">
                        {medal}
                      </span>
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                            {st.name} {st.lastName || ''}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase bg-blue-600 text-white px-1.5 rounded-full">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-0.5 text-orange-600 font-semibold">
                            <Flame className="w-3 h-3 fill-orange-500" />
                            {st.streak} días
                          </span>
                          <span>•</span>
                          <span className="font-medium text-slate-600">{st.league}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-slate-900 block flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {st.xp}
                      </span>
                      <span className="text-[10px] text-slate-400">XP</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Teacher: New Challenge Modal */}
      {showNewChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Crear Reto Diario (Teacher Cokito)</h3>
            <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Reto</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej. Suffixes & Spelling Bee #21"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audiencia</label>
                  <select
                    value={newAudience}
                    onChange={e => setNewAudience(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    <option value="all">Todos los alumnos</option>
                    <option value="kids">Niños / Teens (Kids)</option>
                    <option value="adults">Adultos / Profesionales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Pronunciation">Pronunciation</option>
                    <option value="Listening">Listening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pregunta / Desafío</label>
                <textarea
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Escribe la frase o pregunta..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Opciones (Marca la correcta):</label>
                {newOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIdx"
                      checked={newCorrectIndex === idx}
                      onChange={() => setNewCorrectIndex(idx)}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => {
                        const copy = [...newOptions];
                        copy[idx] = e.target.value;
                        setNewOptions(copy);
                      }}
                      placeholder={`Opción ${idx + 1}`}
                      className="flex-1 p-1.5 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Explicación Pedagógica</label>
                <textarea
                  value={newExplanation}
                  onChange={e => setNewExplanation(e.target.value)}
                  placeholder="Por qué es correcta..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChallengeModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Publicar Reto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
