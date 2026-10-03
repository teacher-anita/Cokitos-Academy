import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Shield, 
  Send, 
  BookOpen, 
  Layers, 
  Award, 
  AlertCircle, 
  HelpCircle,
  Smartphone,
  Users,
  Star,
  Zap,
  KeyRound,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, ScheduleSlot, ClassModality, GroupSize, AudienceTheme } from '../types';
import { PlacementQuizModal } from './PlacementQuizModal';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';

interface RegistrationFlowProps {
  slots: ScheduleSlot[];
  onRegisterComplete: (newStudent: Student, bookedSlotIds: string[]) => void;
  onExploreCalendar: () => void;
  audienceTheme: AudienceTheme;
}

export type RegistrationPlanType = 'digital_5' | 'basic_2' | 'regular_3' | 'intensive_4' | 'express_6';

interface CustomPlanInfo {
  id: RegistrationPlanType;
  title: string;
  badge: string;
  priceDisplay: string;
  priceNumber: number;
  period: string;
  hoursNote: string;
  description: string;
  isSelfPaced: boolean;
  features: string[];
}

const REGISTRATION_PLANS: CustomPlanInfo[] = [
  {
    id: 'digital_5',
    title: 'Pase Digital Autónomo Cokitö',
    badge: 'Opción Esencial • Autoaprendizaje',
    priceDisplay: '$5',
    priceNumber: 5,
    period: '/ mes',
    hoursNote: 'A tu propio ritmo (Sin horario fijo)',
    description: 'Acceso completo e ilimitado a los 12 niveles de la plataforma, audios nativos, quizzes del Cyber Owl y retos diarios.',
    isSelfPaced: true,
    features: [
      'Acceso a todos los niveles (SuperGoal y MegaGoal)',
      'Quizzes interactivos de fin de unidad (+50 XP)',
      'Smart Owl Trivia de cultura general y etiqueta',
      'Sin clases en vivo con la profesora'
    ]
  },
  {
    id: 'express_6',
    title: '⚡ Nivel Express / Súper Intensivo (6 h/sem)',
    badge: '¡Máxima Velocidad! • 4 Semanas/Nivel',
    priceDisplay: '$105',
    priceNumber: 105,
    period: '/ semana',
    hoursNote: '6 horas semanales (3 sesiones de 120 min)',
    description: 'Inmersión récord: completa 1 nivel oficial en solo 4 semanas. Ideal para viajes inminentes o entrevistas urgentes.',
    isSelfPaced: false,
    features: [
      '3 sesiones semanales de 120 min (Lun/Mié/Vie)',
      '¡Terminas cada nivel en solo 4 semanas (1 mes)!',
      'Atención VIP exclusiva de Teacher Cokitö',
      'Soporte y dudas continuo vía WhatsApp'
    ]
  },
  {
    id: 'intensive_4',
    title: 'Plan Intensivo (4 h/sem)',
    badge: 'Progreso Acelerado • 6 Semanas/Nivel',
    priceDisplay: '$80',
    priceNumber: 80,
    period: '/ semana',
    hoursNote: '4 horas semanales (2 de 120 min o 4 de 60 min)',
    description: 'Avance rápido y enfocado para metas a corto plazo, ascensos laborales o preparación de certificaciones.',
    isSelfPaced: false,
    features: [
      '4 horas semanales de clases en vivo',
      'Terminas cada nivel en 6 semanas (1.5 meses)',
      'Simulación de entrevistas y fluidez laboral',
      'Acceso total al Classroom y libros oficiales'
    ]
  },
  {
    id: 'regular_3',
    title: 'Plan Regular (3 h/sem)',
    badge: '⭐ Más Recomendado • 8 Semanas/Nivel',
    priceDisplay: '$67.5',
    priceNumber: 67.5,
    period: '/ semana',
    hoursNote: '3 horas semanales (2 sesiones de 90 min)',
    description: 'La fórmula pedagógica dorada: máximo equilibrio entre velocidad, retención cognitiva y comodidad de horario.',
    isSelfPaced: false,
    features: [
      '2 sesiones semanales de 90 min (ej. Lun/Mié)',
      'Terminas cada nivel en 8 semanas (2 meses)',
      'Práctica conversacional inmersiva y natural',
      'Feedback detallado de pronunciación en cada clase'
    ]
  },
  {
    id: 'basic_2',
    title: 'Plan Súper Básico (2 h/sem)',
    badge: 'Constante y Relajado • 12 Semanas/Nivel',
    priceDisplay: '$50',
    priceNumber: 50,
    period: '/ semana',
    hoursNote: '2 horas semanales (2 sesiones de 60 min)',
    description: 'Para personas con agendas apretadas que desean avanzar firme y sin sobrecarga mental.',
    isSelfPaced: false,
    features: [
      '2 sesiones semanales de 60 min (ej. Mar/Jue)',
      'Terminas cada nivel en 12 semanas (3 meses)',
      'Aprende sin miedo, sin estrés y a tu ritmo',
      'Materiales digitales y audios incluidos'
    ]
  }
];

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
  const [age, setAge] = useState<number>(25);
  const [schoolOrProfession, setSchoolOrProfession] = useState('');
  const [learningGoal, setLearningGoal] = useState('Oportunidades laborales y superación personal');

  // Package & Preferences
  const [selectedPlanId, setSelectedPlanId] = useState<RegistrationPlanType>('digital_5');
  const [selectedModality, setSelectedModality] = useState<ClassModality>('online');
  const [selectedGroupSize, setSelectedGroupSize] = useState<GroupSize>('individual');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Tardes (4:00 - 7:00 pm)');

  // Coupon Code State in Registration
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; label: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

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
  const currentPlan = REGISTRATION_PLANS.find(p => p.id === selectedPlanId) || REGISTRATION_PLANS[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const clean = couponCode.trim().toUpperCase();

    if (clean === 'CSB2026') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase Comunidad Educativa CSB (100% Bonificado)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else if (clean === 'FRIENDS2026') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase VIP Friends & Family (100% Bonificado)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    } else if (clean === 'COKITO5') {
      setAppliedCoupon({
        code: clean,
        label: 'Suscripción Digital $5/mes Activada',
        discountPercent: 100
      });
      try { confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } }); } catch {}
    } else {
      setCouponError('Código no válido o expirado. Consulta con La Teacher Cokitö.');
    }
  };

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
      alert('Por favor realiza la prueba diagnóstica de nivel antes de finalizar.');
      return;
    }

    setIsSubmitting(true);

    const newStudentId = `student_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: name.trim(),
      lastName: lastName.trim(),
      cedula: cedula.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      age: Number(age),
      isKid,
      schoolOrProfession,
      learningGoal,
      avatar: `https://api.dicebear.com/7.x/${isKid ? 'bottts' : 'micah'}/svg?seed=${name}`,
      plan: selectedPlanId === 'express_6' ? 'super_intensive' : selectedPlanId === 'intensive_4' ? 'intensive' : selectedPlanId === 'regular_3' ? 'regular' : 'basic',
      modality: selectedModality,
      groupSize: selectedPlanId === 'digital_5' ? 'individual' : selectedGroupSize,
      preferredTimeSlot,
      status: appliedCoupon ? 'enrolled' : 'pending_evaluation',
      levelId: placementResult.suggestedLevelId || 'level_1',
      placementTestScore: placementResult.score,
      placementTestDiagnosis: `Puntaje: ${placementResult.score}/${placementResult.total}. Sugerencia: ${placementResult.suggestedLevelName}. ${placementResult.diagnosisText}`,
      placementTestDate: new Date().toISOString().split('T')[0],
      registeredAt: new Date().toISOString().split('T')[0],
      currentUnit: 1,
      completedHours: 0,
      xp: appliedCoupon ? 350 : 200,
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: `Plan: ${currentPlan.title}. Cupón: ${appliedCoupon ? appliedCoupon.code : 'Sin cupón'}. Diagnóstico: ${placementResult.suggestedLevelName}.`,
      assignedSlots: selectedSlotIds
    };

    // Send confirmation email
    await sendGmailEmail({
      to: email,
      subject: `¡Inscripción recibida en la academia de La Teacher Cokitö!`,
      bodyText: `Hola ${name},\n\n¡Bienvenido(a) a la academia de La Teacher Cokitö!\n\nHemos recibido tu registro y el resultado de tu prueba diagnóstica (${placementResult.score}/${placementResult.total} puntos).\n\nDetalles:\n- Plan elegido: ${currentPlan.title}\n- Nivel sugerido: ${placementResult.suggestedLevelName}\n- Horario / Modalidad: ${currentPlan.isSelfPaced ? 'Autónomo Asincrónico' : selectedSlotIds.join(', ') || preferredTimeSlot}\n\n¡Nos alegra mucho acompañarte en tu meta de hablar inglés con confianza!`
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
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 w-full overflow-x-hidden">
      
      {/* Progress Stepper (Responsive) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {[
            { num: 1, label: 'Tus Datos' },
            { num: 2, label: 'Elegir Plan' },
            { num: 3, label: 'Nivel & Horario' },
            { num: 4, label: 'Confirmación' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1 font-medium text-center ${
                  step === s.num ? 'text-blue-700 font-bold' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full ${
                  step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre(s) *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Mariana"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Ej. Márquez"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula / Identificación</label>
              <input
                type="text"
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                placeholder="Ej. V-25.123.456"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+58 412 1234567"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Edad del Alumno</label>
              <input
                type="number"
                min={5}
                max={99}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isKid ? '🎈 Perfil Infantil / Juvenil' : '🎓 Perfil Adulto / Profesional'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKid ? 'Colegio o Instituto y Grado' : 'Profesión, Trabajo o Empresa'}
              </label>
              <input
                type="text"
                value={schoolOrProfession}
                onChange={e => setSchoolOrProfession(e.target.value)}
                placeholder={isKid ? 'Ej. Colegio Simón Bolívar II - 7mo Grado' : 'Ej. Odontólogo / Diseñadora / Estudiante'}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              ¿Cuál es tu principal motivo para aprender inglés?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Oportunidades laborales y desarrollo profesional',
                'Viajes, turismo y soltar la lengua en el extranjero',
                'Exámenes, certificaciones o apoyo escolar',
                'Superación personal y pensar en inglés sin traducir'
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

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (!name.trim() || !email.trim()) {
                  alert('Por favor ingresa al menos tu nombre y correo electrónico.');
                  return;
                }
                setStep(2);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>Siguiente: Elegir Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Package Selection (Starting with the $5 Digital Plan!) */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 2 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Selecciona tu Plan de Aprendizaje
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Elige si deseas practicar de forma autónoma asincrónica o con clases en vivo de La Teacher Cokitö.
            </p>
          </div>

          {/* Modality Toggle (Only relevant if taking live classes) */}
          {selectedPlanId !== 'digital_5' && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-700">Modalidad de Clase:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModality('online')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'online'
                      ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  💻 Online (Google Meet)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModality('presencial')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedModality === 'presencial'
                      ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  🏫 Presencial
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Formato del Grupo:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('individual')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'individual'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    👤 1 a 1 (Privada)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('duo')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'duo'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    👥 Dúo (2 alumnos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupSize('crew4')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedGroupSize === 'crew4'
                        ? 'border-blue-600 bg-white text-blue-950 shadow-xs'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    🧑‍🤝‍🧑 Grupo (3-4 pax)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid (First option is ALWAYS $5 Platform Pass) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REGISTRATION_PLANS.map(plan => {
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.id === 'digital_5'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {plan.badge}
                      </span>
                      {plan.id === 'digital_5' && (
                        <Smartphone className="w-4 h-4 text-amber-600" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-base">{plan.title}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{plan.priceDisplay}</span>
                        <span className="text-xs text-slate-500 font-semibold">{plan.period}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">{plan.hoursNote}</span>
                    <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Seleccionado' : 'Elegir'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-slate-600 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>{currentPlan.isSelfPaced ? 'Siguiente: Prueba de Nivel' : 'Siguiente: Horario & Prueba'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Placement Test, Schedule & Coupon Code */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-1">
              Paso 3 de 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentPlan.isSelfPaced ? 'Prueba Diagnóstica & Confirmación' : 'Horarios y Prueba Diagnóstica'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentPlan.isSelfPaced
                ? 'La prueba toma de 5 a 10 minutos y te posiciona en el libro y nivel ideal para comenzar.'
                : 'Selecciona tus turnos preferidos y completa la prueba para que La Teacher Cokitö organice tu grupo.'}
            </p>
          </div>

          {/* Schedule Picker (Only if LIVE classes plan is chosen) */}
          {!currentPlan.isSelfPaced && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-emerald-950 font-medium">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Confidencialidad:</strong> Los horarios marcados como "🔒 Reservado" pertenecen a otros alumnos y sus identidades están protegidas.
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800">
                    Selecciona tu turno en vivo preferido:
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
                                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                                }`}
                              >
                                <span>{slot.startTime}</span>
                                <span className="block opacity-80 text-[9px]">
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
            </div>
          )}

          {/* Self-Paced Note */}
          {currentPlan.isSelfPaced && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="block font-bold">Modalidad 100% Asincrónica:</strong>
                <span>No necesitas agendar clases en vivo. Podrás ingresar a la plataforma, resolver los retos del Cyber Owl y avanzar a cualquier hora del día o de la noche.</span>
              </div>
            </div>
          )}

          {/* COUPON / BECA CODE INPUT */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <strong className="text-xs font-bold text-slate-900">
                ¿Tienes un Código de Invitación, Beca o Cupón?
              </strong>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold block">Código Activo: {appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-700">{appliedCoupon.label}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Ej. CSB2026 o FRIENDS2026"
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Aplicar Código
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
            )}
          </div>

          {/* PLACEMENT TEST REQUIREMENT */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Requisito Indispensable
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Prueba Diagnóstica de Nivel (25 Preguntas)
                </h3>
                <p className="text-xs text-blue-200 max-w-md mt-0.5 leading-relaxed">
                  Toma solo de 5 a 10 minutos. Evalúa gramática básica, vocabulario y comprensión lectora para que conozcas tu nivel exacto.
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
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-slate-600 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !placementResult}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registrando en la plataforma...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar Inscripción ({appliedCoupon ? 'Gratis con Código' : currentPlan.priceDisplay})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation Screen */}
      {step === 4 && registeredStudent && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 animate-fadeIn text-center space-y-6">
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
              Tus datos, tu plan de <strong>{currentPlan.title}</strong> y el resultado de tu prueba (<strong>{registeredStudent.placementTestScore}/25 pts</strong>) han quedado registrados directamente en la plataforma.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Alumno:</span>
              <strong className="text-slate-900">{registeredStudent.name} {registeredStudent.lastName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Plan Seleccionado:</span>
              <strong className="text-blue-700">{currentPlan.title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Inversión:</span>
              <strong className="text-emerald-700">
                {appliedCoupon ? '100% Bonificado por Código' : `${currentPlan.priceDisplay} ${currentPlan.period}`}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nivel Asignado:</span>
              <strong className="text-slate-900">{(registeredStudent.levelId || 'level_1').toUpperCase()}</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreCalendar}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Ir a la Agenda y Classroom
            </button>
          </div>
        </div>
      )}

      {/* Standalone Placement Quiz Modal */}
      <PlacementQuizModal
        isOpen={isQuizModalOpen}
        studentName={name || 'Aspirante'}
        onClose={() => setIsQuizModalOpen(false)}
        onFinishTest={(result) => {
          setPlacementResult({
            score: result.score,
            total: result.total,
            suggestedLevelId: result.suggestedLevelId,
            suggestedLevelName: result.suggestedLevelName,
            diagnosisText: result.diagnosisText
          });
          setIsQuizModalOpen(false);
        }}
      />

    </div>
  );
};
