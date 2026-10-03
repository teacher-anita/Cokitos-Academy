import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Shield, Send, BookOpen, Layers, Award, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INTENSITY_PLANS } from '../data/curriculumData';
import { Student, ScheduleSlot, PlanIntensity, ClassModality, GroupSize, AudienceTheme } from '../types';
import { PlacementQuizModal } from './PlacementQuizModal';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';
import { buildGoogleCalendarUrl } from '../services/googleCalendar';

interface RegistrationFlowProps {
  slots: ScheduleSlot[];
  onRegisterComplete: (newStudent: Student, bookedSlotIds: string[]) => void;
  onExploreCalendar: () => void;
  audienceTheme: AudienceTheme;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  slots,
  onRegisterComplete,
  onExploreCalendar,
  audienceTheme
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(20);
  const [schoolOrProfession, setSchoolOrProfession] = useState('');
  const [learningGoal, setLearningGoal] = useState('Oportunidades laborales y desarrollo profesional');

  // Package & Preferences
  const [selectedPlan, setSelectedPlan] = useState<PlanIntensity>('regular');
  const [selectedModality, setSelectedModality] = useState<ClassModality>('online');
  const [selectedGroupSize, setSelectedGroupSize] = useState<GroupSize>('individual');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Tardes (4:00 - 7:00 pm)');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  // Placement Test State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [placementResult, setPlacementResult] = useState<{
    score: number;
    total: number;
    suggestedLevelId: string;
    suggestedLevelName: string;
    diagnosisText: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const isKid = age < 18;
  const currentPlan = INTENSITY_PLANS[selectedPlan];
  const weeklyPrice = currentPlan.prices[selectedGroupSize];

  const handleToggleSlot = (slot: ScheduleSlot) => {
    if (slot.status === 'booked') return;
    if (selectedSlotIds.includes(slot.id)) {
      setSelectedSlotIds(prev => prev.filter(id => id !== slot.id));
    } else {
      setSelectedSlotIds(prev => [...prev, slot.id]);
    }
  };

  const handleFinalSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y correo electrónico.');
      return;
    }
    if (!placementResult) {
      alert('Por favor realiza la prueba de nivel antes de finalizar.');
      return;
    }

    setIsSubmitting(true);

    const newStudentId = `student_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name,
      lastName,
      cedula,
      email,
      phone,
      age: Number(age),
      isKid,
      schoolOrProfession,
      learningGoal,
      avatar: `https://api.dicebear.com/7.x/${isKid ? 'bottts' : 'micah'}/svg?seed=${name}`,
      plan: selectedPlan,
      modality: selectedModality,
      groupSize: selectedGroupSize,
      preferredTimeSlot,
      status: 'pending_evaluation',
      placementTestScore: placementResult.score,
      placementTestDiagnosis: `Puntaje: ${placementResult.score}/${placementResult.total}. Sugerencia: ${placementResult.suggestedLevelName}. ${placementResult.diagnosisText}`,
      placementTestDate: new Date().toISOString().split('T')[0],
      registeredAt: new Date().toISOString().split('T')[0],
      currentUnit: 1,
      completedHours: 0,
      xp: 200, // Welcome XP
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: `Aspirante registrado. Paquete: ${currentPlan.name} (${selectedModality}, ${selectedGroupSize}). Diagnóstico: ${placementResult.suggestedLevelName}.`,
      assignedSlots: selectedSlotIds
    };

    // Send confirmation email via Gmail
    const emailData = generateEmailTemplate('welcome', {
      studentName: `${name} ${lastName}`.trim(),
      levelName: `Evaluación Inicial (${placementResult.score}/25 pts)`,
      book: 'Nivel por asignar por Teacher Cokito',
      planName: currentPlan.name,
      slotTime: selectedSlotIds.length > 0 ? selectedSlotIds.join(', ') : preferredTimeSlot,
      meetLink: 'https://meet.google.com/eng-cokito-welcome'
    });

    await sendGmailEmail({
      to: email,
      subject: `¡Inscripción recibida! La Teacher Cokito revisará tu prueba de nivel`,
      bodyText: `Hola ${name},\n\n¡Gracias por dar este primer paso tan valiente en la academia de La Teacher Cokito!\n\nHemos recibido tus datos y el resultado de tu prueba de nivel (${placementResult.score}/25 puntos).\n\nDetalles de tu solicitud:\n- Paquete elegido: ${currentPlan.name}\n- Modalidad: ${selectedModality === 'online' ? 'Online (Zoom CSB / Google Meet)' : 'Presencial'}\n- Formato: ${selectedGroupSize}\n- Diagnóstico preliminar: ${placementResult.suggestedLevelName}\n\nLa Teacher Cokito analizará tus respuestas a detalle y te contactará en las próximas 24 horas para asignarte tu nivel oficial definitivo (Super Goal o MegaGoal) y confirmar tu horario.\n\n¡Bienvenid@ a bordo!`
    }).catch(() => null);

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}

    onRegisterComplete(newStudent, selectedSlotIds);
    setRegisteredStudent(newStudent);
    setIsSubmitting(false);
    setStep(4);
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Tus Datos' },
            { num: 2, label: 'Paquete & Formato' },
            { num: 3, label: 'Horarios & Prueba' },
            { num: 4, label: 'Confirmación' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${step === s.num ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal Data & Contextual Questions */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 1 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cuéntanos sobre ti
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Personalizamos la experiencia pedagógica según tu edad, ocupación y objetivos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre(s) *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Mariana"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Apellidos *</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Ej. Márquez"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cédula de Identidad / DNI *</label>
              <input
                type="text"
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                placeholder="Ej. V-25.123.456"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo Electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+58 412 1234567"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          {/* Age & Contextual School/Job input */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Edad del Alumno</label>
              <input
                type="number"
                min={5}
                max={99}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {isKid ? '🎈 Perfil Infantil / Juvenil' : '🎓 Perfil Adulto / Profesional'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKid ? '¿En qué Colegio o Instituto estudias y en qué grado?' : '¿Cuál es tu profesión, área de trabajo o empresa?'}
              </label>
              <input
                type="text"
                value={schoolOrProfession}
                onChange={e => setSchoolOrProfession(e.target.value)}
                placeholder={isKid ? 'Ej. Colegio Simón Bolívar II - 7mo Grado A' : 'Ej. Administrador / Ingeniero en Finanzas'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              ¿Cuál es tu principal motivo u objetivo para aprender inglés?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Oportunidades laborales y entrevistas de trabajo',
                'Viajes, turismo y desenvolverse en el extranjero',
                'Exámenes escolares, Spelling Bee y certificaciones',
                'Superación personal y poder pensar en inglés sin traducir'
              ].map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setLearningGoal(goal)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    learningGoal === goal
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (!name.trim() || !email.trim()) {
                  alert('Por favor ingresa al menos tu nombre y correo.');
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>Siguiente: Elegir Paquete</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Package, Modality & Rates */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 2 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Elige tu Paquete y Modalidad
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tú eliges cuántas horas a la semana deseas estudiar y el formato. La Teacher Cokito te asignará el libro y nivel oficial tras tu prueba diagnóstica.
            </p>
          </div>

          {/* Modality & Group Size Selectors */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Modality */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Modalidad de Clase:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModality('online')}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'online'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  💻 Online (Zoom / Meet)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModality('presencial')}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'presencial'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🏫 Presencial
                </button>
              </div>
            </div>

            {/* Group Size */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Formato del Grupo:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'individual', label: '1 Persona', sub: 'Coach Privado' },
                  { id: 'duo', label: '2 Personas', sub: 'Plan Dúo' },
                  { id: 'squad3', label: '3 Personas', sub: 'Plan Squad' },
                  { id: 'crew4', label: '4 Personas', sub: 'Full Crew' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGroupSize(g.id as GroupSize)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedGroupSize === g.id
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">{g.label}</span>
                    <span className="text-[10px] text-slate-400 block">{g.sub}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Official Plans Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.keys(INTENSITY_PLANS) as PlanIntensity[]).map(planKey => {
              const p = INTENSITY_PLANS[planKey];
              const isSelected = selectedPlan === planKey;
              const rate = p.prices[selectedGroupSize];

              return (
                <div
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-gradient-to-b from-blue-50/70 to-white shadow-md ring-2 ring-blue-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                      <span className="text-xs font-black text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">
                        ${rate.toFixed(2)} / sem
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700 block mt-1">{p.badge}</span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{p.description}</p>
                    
                    <div className="mt-3 bg-white p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider mb-0.5">
                        Distribución de clases:
                      </span>
                      {p.recommendedFormat}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{p.hoursPerWeek} horas semanales</span>
                    <span className="font-bold text-blue-700">
                      {isSelected ? '✓ Paquete Seleccionado' : 'Elegir este paquete'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-slate-600 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>Siguiente: Horarios & Prueba</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Schedule Selection & Placement Test */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 3 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Preferencia de Horario y Prueba de Nivel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visualiza los turnos disponibles en tiempo real (los horarios ocupados por otros estudiantes son confidenciales).
            </p>
          </div>

          {/* Confidentiality Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Confidencialidad Total:</strong> Los turnos marcados como "🔒 Reservado" pertenecen a otros alumnos y sus identidades están protegidas.
            </span>
          </div>

          {/* Schedule slots picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">
                Selecciona tus bloques semanales preferidos ({currentPlan.hoursPerWeek}h requeridas):
              </label>
              <span className="text-blue-700 font-semibold">{selectedSlotIds.length} bloque(s) elegidos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {days.map(day => {
                const daySlots = slots.filter(s => s.day === day);
                return (
                  <div key={day} className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-700 block pb-1 border-b border-slate-200 uppercase">
                      {day}
                    </span>
                    <div className="mt-1.5 space-y-1">
                      {daySlots.map(slot => {
                        const isBooked = slot.status === 'booked';
                        const isSelected = selectedSlotIds.includes(slot.id);

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleToggleSlot(slot)}
                            className={`w-full p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                              isBooked
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                            }`}
                          >
                            <span>{slot.startTime}</span>
                            <span className="block opacity-80">
                              {isBooked ? '🔒 Reserv.' : isSelected ? 'Elegido' : 'Libre'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MANDATORY PLACEMENT TEST SECTION */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Requisito Indispensable
                </span>
                <h3 className="text-lg font-black tracking-tight">Prueba Diagnóstica de Nivel (25 Preguntas)</h3>
                <p className="text-xs text-blue-200 max-w-md mt-0.5">
                  Toma solo de 5 a 10 minutos. Evalúa gramática básica, vocabulario y comprensión lectora para que La Teacher Cokito te asigne el nivel ideal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuizModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-colors whitespace-nowrap"
              >
                {placementResult ? '✓ Repetir Prueba' : 'Comenzar Prueba de Nivel'}
              </button>
            </div>

            {/* If completed */}
            {placementResult && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between text-xs animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">
                      Resultado Registrado: {placementResult.score} / {placementResult.total} puntos
                    </span>
                    <span className="text-blue-200 text-[11px] block">{placementResult.suggestedLevelName}</span>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold border border-emerald-400/30">
                  Listo para Enviar
                </span>
              </div>
            )}
          </div>

          {/* Navigation & Submit */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 text-slate-600 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !placementResult}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registrando en la plataforma...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enviar Registro a Teacher Cokito</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success & Confirmation */}
      {step === 4 && registeredStudent && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-fadeIn text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">
              ¡Inscripción Registrada con Éxito!
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Bienvenido(a), {registeredStudent.name}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
              Tus datos, tu paquete de <strong>{currentPlan.name}</strong> y el resultado de tu prueba (<strong>{registeredStudent.placementTestScore}/25 pts</strong>) han quedado registrados directamente en la plataforma.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Alumno:</span>
              <strong className="text-slate-900">{registeredStudent.name} {registeredStudent.lastName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Paquete Seleccionado:</span>
              <strong className="text-blue-700">{currentPlan.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Modalidad:</span>
              <strong className="text-slate-900">{selectedModality.toUpperCase()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Próximo Paso:</span>
              <strong className="text-amber-700">Asignación de Nivel por Teacher Cokito</strong>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-md mx-auto text-xs text-blue-950 text-left space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              Notificación enviada a tu correo:
            </p>
            <p className="text-blue-800">
              En las próximas 24 horas recibirás la confirmación de tu libro, grupo y enlace de Google Classroom para arrancar tus clases.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreCalendar}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Ver Horarios en la Agenda Compartida
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setPlacementResult(null);
                setSelectedSlotIds([]);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Registrar otro estudiante
            </button>
          </div>
        </div>
      )}

      {/* Placement Test Interactive Modal */}
      <PlacementQuizModal
        isOpen={isQuizModalOpen}
        studentName={`${name} ${lastName}`.trim()}
        onClose={() => setIsQuizModalOpen(false)}
        onFinishTest={(result) => {
          setPlacementResult(result);
          setIsQuizModalOpen(false);
        }}
      />

    </div>
  );
};
