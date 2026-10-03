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
  Tag,
  Lock,
  Banknote,
  ExternalLink,
  Copy
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
  const [password, setPassword] = useState('');
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

  // Step 4 Validation State (post-registration)
  const [step4Code, setStep4Code] = useState('');
  const [step4Error, setStep4Error] = useState<string | null>(null);
  const [step4Success, setStep4Success] = useState<string | null>(null);
  const [showPagoMovilBox, setShowPagoMovilBox] = useState(false);
  const [pagoMovilRef, setPagoMovilRef] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleValidateStep4Code = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredStudent) return;
    const clean = step4Code.trim().toUpperCase();
    const VALID_CODES = [
      'CSB-PRE', 
      'CSB2026', 
      'COKITO2026', 
      'BECA100', 
      'TEACHERCOKITO', 
      'MALU2026', 
      'VIP-BECA', 
      'COKITO5', 
      'FRIENDS2026',
      'COKITO-VIP'
    ];

    if (VALID_CODES.includes(clean)) {
      const updated: Student = {
        ...registeredStudent,
        status: 'enrolled',
        xp: registeredStudent.xp + 250,
        notes: `${registeredStudent.notes || ''} | Validado exitosamente con código post-registro: ${clean}`
      };
      setRegisteredStudent(updated);
      onRegisterComplete(updated, selectedSlotIds);
      setStep4Success(`¡Código ${clean} Validado Exitosamente! Tu acceso a la plataforma está 100% activo.`);
      setStep4Error(null);
      try { confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } }); } catch {}
    } else {
      setStep4Error('Código no válido o no reconocido. Consulta con La Teacher Cokitö o verifica que esté bien escrito.');
      setStep4Success(null);
    }
  };

  const handlePaypalStep4 = () => {
    try {
      window.open('https://paypal.me/anateresacsb/5', '_blank');
    } catch {}
    if (!registeredStudent) return;
    const updated: Student = {
      ...registeredStudent,
      status: 'enrolled',
      xp: registeredStudent.xp + 200,
      notes: `${registeredStudent.notes || ''} | Pase Digital $5 pagado vía PayPal Checkout (anateresa.csb@gmail.com)`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setStep4Success('¡Pago de $5 registrado con PayPal! Tu Pase Digital ha sido desbloqueado.');
    try { confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } }); } catch {}
  };

  const handleReportPagoMovilStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoMovilRef.trim() || !registeredStudent) {
      alert('Por favor ingresa el número de referencia del Pago Móvil.');
      return;
    }
    const updated: Student = {
      ...registeredStudent,
      status: 'enrolled',
      xp: registeredStudent.xp + 200,
      notes: `${registeredStudent.notes || ''} | Pase Digital $5 reportado vía Pago Móvil (Ref: ${pagoMovilRef.trim()})`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setStep4Success(`¡Pago Móvil reportado (Ref: ${pagoMovilRef.trim()})! Tu Pase Digital ha sido activado.`);
    setShowPagoMovilBox(false);
    try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
  };

  const handleCashStep4 = () => {
    if (!registeredStudent) return;
    const updated: Student = {
      ...registeredStudent,
      status: 'enrolled',
      xp: registeredStudent.xp + 200,
      notes: `${registeredStudent.notes || ''} | Pago de $5 confirmado en efectivo con Teacher Cokitö`
    };
    setRegisteredStudent(updated);
    onRegisterComplete(updated, selectedSlotIds);
    setStep4Success('¡Pago en efectivo acordado con La Teacher! Tu cuenta ha sido activada.');
    try { confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } }); } catch {}
  };

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
    } else if (clean.includes('ALUMNO') || clean.includes('STUDENT') || clean.includes('ESTUDIANTE')) {
      setAppliedCoupon({
        code: clean,
        label: 'Pase Alumno Colegio Simón Bolívar (Prioridad 3:00 - 5:00 pm)',
        discountPercent: 100
      });
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch {}
    } else if (clean.includes('TEACHER') || clean.includes('DOCENTE') || clean === 'PRE-CSB' || clean === 'CSB-PRE') {
      setAppliedCoupon({
        code: clean,
        label: 'Pase Docente CSB (Prioridad 5:00 - 7:00 pm)',
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

  // Check student and teacher priority roles
  const isCSBStudent = Boolean(
    appliedCoupon?.code?.includes('ALUMNO') ||
    appliedCoupon?.code?.includes('STUDENT') ||
    appliedCoupon?.code?.includes('ESTUDIANTE') ||
    (isKid && (
      schoolOrProfession.toLowerCase().includes('simón bolívar') ||
      schoolOrProfession.toLowerCase().includes('simon bolivar') ||
      schoolOrProfession.toLowerCase().includes('csb')
    ))
  );

  const isCSBTeacher = Boolean(
    appliedCoupon?.code?.includes('TEACHER') ||
    appliedCoupon?.code?.includes('DOCENTE') ||
    appliedCoupon?.code === 'PRE-CSB' ||
    appliedCoupon?.code === 'CSB-PRE' ||
    appliedCoupon?.code === 'CSB2026' ||
    schoolOrProfession.toLowerCase().includes('docente') ||
    schoolOrProfession.toLowerCase().includes('teacher') ||
    schoolOrProfession.toLowerCase().includes('auxiliar') ||
    schoolOrProfession.toLowerCase().includes('pre csb')
  );

  const isCSBMember = isCSBStudent || isCSBTeacher || Boolean(appliedCoupon?.code?.toUpperCase().includes('CSB'));

  // Maximum allowed hours for the chosen plan
  const maxHoursForPlan = 
    selectedPlanId === 'digital_5' ? 0 :
    selectedPlanId === 'basic_2' ? 2 :
    selectedPlanId === 'regular_3' ? 3 :
    selectedPlanId === 'intensive_4' ? 4 : 6;

  // Allowed days according to plan rules
  const getAllowedDaysForPlan = (planId: RegistrationPlanType): string[] => {
    switch (planId) {
      case 'basic_2': return ['Martes', 'Jueves'];
      case 'regular_3': return ['Lunes', 'Miércoles', 'Viernes'];
      case 'express_6': return ['Lunes', 'Miércoles', 'Viernes'];
      case 'intensive_4': return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      default: return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    }
  };

  const allowedDays = getAllowedDaysForPlan(selectedPlanId);

  // Helper to determine slot restriction
  const getSlotRestriction = (slot: ScheduleSlot): { isBlocked: boolean; reason: string } => {
    if (slot.status === 'booked') {
      return { isBlocked: true, reason: 'Reservado por otro alumno' };
    }

    // 1. Day restriction according to plan
    if (!allowedDays.includes(slot.day)) {
      return { 
        isBlocked: true, 
        reason: `Día no habilitado para tu plan (${allowedDays.join(', ')})` 
      };
    }

    // 2. Alumnos CSB Priority (3:00 pm - 5:00 pm = 15:00, 16:00)
    const isCSBStudentHours = slot.startTime === '15:00' || slot.startTime === '16:00';
    if (isCSBStudentHours && !isCSBStudent && !isCSBTeacher) {
      return { 
        isBlocked: true, 
        reason: 'Bloque reservado con prioridad para Alumnos del Colegio Simón Bolívar (3:00 a 5:00 pm)' 
      };
    }

    // 3. Teachers CSB Priority (5:00 pm - 7:00 pm = 17:00, 18:00)
    const isCSBTeacherHours = slot.startTime === '17:00' || slot.startTime === '18:00';
    if (isCSBTeacherHours && !isCSBTeacher) {
      return { 
        isBlocked: true, 
        reason: 'Bloque reservado con prioridad para Teachers del Colegio Simón Bolívar (5:00 a 7:00 pm)' 
      };
    }

    // 4. Morning group restriction (6:00 am - 8:00 am = 06:00, 07:00)
    const isMorningHours = slot.startTime === '06:00' || slot.startTime === '07:00';
    if (isMorningHours && selectedGroupSize === 'individual') {
      return { 
        isBlocked: true, 
        reason: 'Bloque matutino exclusivo para grupos (no disponible para 1 a 1)' 
      };
    }

    // 5. Night group restriction (8:00 pm - 10:00 pm = 20:00, 21:00)
    const isNightHours = slot.startTime === '20:00' || slot.startTime === '21:00';
    if (isNightHours && selectedGroupSize === 'individual') {
      return { 
        isBlocked: true, 
        reason: 'Bloque nocturno exclusivo para grupos (no disponible para 1 a 1)' 
      };
    }

    return { isBlocked: false, reason: '' };
  };

  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);

  const handleToggleSlot = (slot: ScheduleSlot) => {
    const restriction = getSlotRestriction(slot);
    if (restriction.isBlocked) {
      setScheduleNotice(`⚠️ Horario no disponible: ${restriction.reason}`);
      return;
    }

    setScheduleNotice(null);

    if (selectedSlotIds.includes(slot.id)) {
      setSelectedSlotIds(prev => prev.filter(id => id !== slot.id));
    } else {
      if (selectedSlotIds.length >= maxHoursForPlan) {
        setScheduleNotice(`Tu plan (${currentPlan.title}) incluye ${maxHoursForPlan} horas semanales. Desmarca un bloque anterior para cambiar.`);
        return;
      }
      setSelectedSlotIds(prev => [...prev, slot.id]);
    }
  };

  const handleFinalSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    setIsSubmitting(true);

    const defaultLevelId = isKid ? 'level_1' : 'level_7';
    const defaultLevelName = isKid ? 'Super Goal 1 (Kids & Jóvenes A1)' : 'Mega Goal 1 (Adultos A1/A2)';

    const newStudentId = `student_${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: name.trim(),
      lastName: lastName.trim(),
      cedula: cedula.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim() || undefined,
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
      levelId: placementResult?.suggestedLevelId || defaultLevelId,
      placementTestScore: placementResult?.score,
      placementTestDiagnosis: placementResult 
        ? `Puntaje: ${placementResult.score}/${placementResult.total}. Sugerencia: ${placementResult.suggestedLevelName}. ${placementResult.diagnosisText}`
        : 'Prueba diagnóstica pendiente por realizar a tu propio ritmo desde tu perfil de alumno.',
      placementTestDate: placementResult ? new Date().toISOString().split('T')[0] : undefined,
      registeredAt: new Date().toISOString().split('T')[0],
      currentUnit: 1,
      completedHours: 0,
      xp: appliedCoupon ? 350 : 200,
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: `Plan: ${currentPlan.title}. Horas elegidas: ${selectedSlotIds.length}/${maxHoursForPlan}. ${isCSBMember ? 'Docente/Personal CSB.' : ''} ${appliedCoupon ? `Cupón: ${appliedCoupon.code}` : 'Sin cupón'}. Diagnóstico: ${placementResult ? placementResult.suggestedLevelName : 'Inicial por defecto (Prueba pendiente)'}.`,
      assignedSlots: selectedSlotIds
    };

    // Send confirmation email
    await sendGmailEmail({
      to: email,
      subject: `¡Inscripción recibida en la academia de La Teacher Cokitö!`,
      bodyText: `Hola ${name},\n\n¡Bienvenido(a) a la academia de La Teacher Cokitö!\n\nHemos recibido tu registro${placementResult ? ` y el resultado de tu prueba diagnóstica (${placementResult.score}/${placementResult.total} puntos)` : ' para comenzar tu aprendizaje'}.\n\nDetalles:\n- Plan elegido: ${currentPlan.title}\n- Nivel: ${placementResult ? placementResult.suggestedLevelName : 'Inicial (A1) por defecto'}\n- Horario / Modalidad: ${currentPlan.isSelfPaced ? 'Autónomo Asincrónico' : selectedSlotIds.join(', ') || preferredTimeSlot}\n\n¡Nos alegra mucho acompañarte en tu meta de hablar inglés con confianza!`
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña de cuenta (opcional)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Crea tu clave de acceso"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Para iniciar sesión sin Google
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKid ? 'Colegio o Grado' : 'Profesión o Empresa'}
              </label>
              <input
                type="text"
                value={schoolOrProfession}
                onChange={e => setSchoolOrProfession(e.target.value)}
                placeholder={isKid ? 'Ej. Simón Bolívar II' : 'Ej. Diseñador / Estudiante'}
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
              {/* Plan Rules & Limits Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold">
                      Frecuencia Oficial: <span className="text-amber-300">{allowedDays.join(' - ')}</span>
                    </span>
                  </div>
                  <span className="text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                    {selectedSlotIds.length} / {maxHoursForPlan} horas elegidas
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">
                  {selectedPlanId === 'regular_3' && '📌 El Plan Regular de 3h/sem se organiza los Lunes, Miércoles y Viernes.'}
                  {selectedPlanId === 'basic_2' && '📌 El Plan Súper Básico de 2h/sem se organiza los Martes y Jueves.'}
                  {selectedPlanId === 'express_6' && '📌 El Plan Express de 6h/sem se organiza los Lunes, Miércoles y Viernes.'}
                  {selectedPlanId === 'intensive_4' && '📌 El Plan Intensivo de 4h/sem se organiza de Lunes a Jueves.'}
                </p>
              </div>

              {/* Notice Banner */}
              {scheduleNotice && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-semibold flex items-center justify-between">
                  <span>{scheduleNotice}</span>
                  <button 
                    type="button" 
                    onClick={() => setScheduleNotice(null)}
                    className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Schedule Rules Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>🎒 <strong>15:00 - 17:00:</strong> Alumnos CSB</div>
                <div>🏫 <strong>17:00 - 19:00:</strong> Teachers CSB</div>
                <div>🌅 <strong>06:00 - 08:00:</strong> Solo Grupos</div>
                <div>🌙 <strong>20:00 - 22:00:</strong> Solo Grupos</div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {days.map(day => {
                    const daySlots = slots.filter(s => s.day === day);
                    const isAllowedDay = allowedDays.includes(day);

                    return (
                      <div 
                        key={day} 
                        className={`rounded-xl p-2 border text-center transition-all ${
                          isAllowedDay
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-slate-100/60 border-slate-200/50 opacity-50'
                        }`}
                      >
                        <span className={`text-[11px] font-bold block pb-1 border-b uppercase ${
                          isAllowedDay ? 'text-slate-800 border-slate-200' : 'text-slate-400 border-slate-200/50'
                        }`}>
                          {day}
                        </span>
                        
                        <div className="mt-1.5 space-y-1">
                          {daySlots.map(slot => {
                            const isBooked = slot.status === 'booked';
                            const isSelected = selectedSlotIds.includes(slot.id);
                            const restriction = getSlotRestriction(slot);
                            const isBlocked = restriction.isBlocked;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={isBooked || (isBlocked && !isSelected)}
                                onClick={() => handleToggleSlot(slot)}
                                title={restriction.reason || `Turno ${slot.startTime} a ${slot.endTime}`}
                                className={`w-full p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                  isBooked
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                    : isBlocked
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                              >
                                <span>{slot.startTime} - {slot.endTime}</span>
                                <span className="block opacity-80 text-[8px] truncate">
                                  {isBooked ? '🔒 Reserv.' : isSelected ? '✓ Elegido' : isBlocked ? 'No disp.' : 'Libre'}
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

          {/* COUPON / BECA CODE INPUT (WITHOUT LEAKING ANY CODES!) */}
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
                  placeholder="Ingresa tu código promocional o beca..."
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

          {/* PLACEMENT TEST REQUIREMENT (NOW OPTIONAL) */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Recomendado • Opcional
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Prueba Diagnóstica de Nivel (25 Preguntas)
                </h3>
                <p className="text-xs text-blue-200 max-w-md mt-0.5 leading-relaxed">
                  Puedes realizarla ahora para ubicarte en tu libro ideal, o puedes continuar e iniciar en el Nivel Inicial (A1) y hacer la prueba más adelante desde tu perfil.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-md transition-colors whitespace-nowrap"
                >
                  {placementResult ? '✓ Repetir Prueba' : '📝 Hacer Prueba Ahora'}
                </button>
              </div>
            </div>

            {placementResult ? (
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
                  Nivel Asignado
                </span>
              </div>
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-blue-200 flex items-center justify-between">
                <span>¿Deseas omitir la prueba por ahora? Comenzarás en el Nivel Inicial (A1).</span>
                <span className="text-amber-300 font-bold ml-2">Nivel Inicial por defecto</span>
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

      {/* STEP 4: Post-Registration Account Validation Screen */}
      {step === 4 && registeredStudent && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 animate-fadeIn space-y-6">
          
          {/* Header Status */}
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              registeredStudent.status === 'enrolled' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-amber-100 text-amber-600'
            }`}>
              {registeredStudent.status === 'enrolled' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Lock className="w-8 h-8" />
              )}
            </div>

            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
              registeredStudent.status === 'enrolled'
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-amber-800 bg-amber-50 border border-amber-200'
            }`}>
              {registeredStudent.status === 'enrolled' 
                ? '¡Cuenta Validada y Activa!' 
                : 'Paso Final • Validación de Cuenta Requerida'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bienvenido(a), {registeredStudent.name}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Tus datos y tu prueba diagnóstica (<strong>{registeredStudent.placementTestScore}/25 pts</strong>) han quedado guardados en el sistema con nivel sugerido <strong>{(registeredStudent.levelId || 'level_1').toUpperCase()}</strong>.
            </p>
          </div>

          {/* Registration Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Alumno:</span>
              <strong className="text-slate-900">{registeredStudent.name} {registeredStudent.lastName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Plan Seleccionado:</span>
              <strong className="text-blue-700">{currentPlan.title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Inversión del Plan:</span>
              <strong className="text-slate-900 font-bold">{currentPlan.priceDisplay} {currentPlan.period}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estado Actual:</span>
              <strong className={registeredStudent.status === 'enrolled' ? 'text-emerald-700' : 'text-amber-600'}>
                {registeredStudent.status === 'enrolled' ? '🟢 Acceso Total Desbloqueado' : '🟡 Modo Fantasma (Pendiente de Validación)'}
              </strong>
            </div>
          </div>

          {/* SCENARIO A: ALREADY ENROLLED */}
          {registeredStudent.status === 'enrolled' ? (
            <div className="text-center space-y-4 pt-2 max-w-md mx-auto">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-medium space-y-1">
                <p className="font-bold text-sm">🎉 ¡Tu cuenta está 100% activa!</p>
                <p className="text-emerald-700">Tienes acceso a tus libros oficiales, quizzes del Cyber Owl y tu agenda de clases.</p>
              </div>

              <button
                type="button"
                onClick={onExploreCalendar}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition-all hover:scale-101 flex items-center justify-center gap-2"
              >
                <span>Entrar a mi Classroom y Comenzar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* SCENARIO B: PENDING VALIDATION (Requires Code or Payment) */
            <div className="space-y-6 max-w-xl mx-auto pt-2">
              
              {/* Notification banners */}
              {step4Success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold text-center animate-fadeIn">
                  {step4Success}
                </div>
              )}
              {step4Error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold text-center animate-fadeIn">
                  {step4Error}
                </div>
              )}

              {/* OPTION 1: CODE VALIDATION (CSB, Becas, Promociones) */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-950">
                      Opción 1: Validar con Código Promocional o Beca CSB
                    </h4>
                    <p className="text-[11px] text-blue-800/80">
                      Si eres docente o personal del Colegio Simón Bolívar o tienes un código de cortesía:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleValidateStep4Code} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={step4Code}
                    onChange={e => setStep4Code(e.target.value)}
                    placeholder="Ej. CSB-PRE, COKITO2026, BECA100"
                    className="flex-1 p-3 bg-white border border-blue-200 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-colors whitespace-nowrap"
                  >
                    Validar Código
                  </button>
                </form>
              </div>

              {/* OPTION 2: PAYMENT VALIDATION ($5 USD Pase Digital) */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Opción 2: Validar con Pago de $5 USD
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Pase Digital Autónomo ($5/mes) o activación de tu paquete
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    $5 USD
                  </span>
                </div>

                {/* Payment Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  
                  {/* PayPal */}
                  <button
                    type="button"
                    onClick={handlePaypalStep4}
                    className="p-3 bg-[#FFC439] hover:bg-[#F4B41A] text-slate-900 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-101"
                  >
                    <svg className="w-4 h-4 text-[#003087] fill-current" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.786.786 0 0 1 .775-.652h6.812c3.275 0 5.617 1.343 6.074 4.364.28 1.85-.246 3.447-1.565 4.747-1.34 1.32-3.23 2.012-5.618 2.012H8.818l-.946 5.99-.044.254a.64.64 0 0 1-.633.535l-.119.367zm2.493-9.068h1.853c2.25 0 3.79-.824 4.34-2.316.368-.997.23-1.927-.41-2.766-.63-.824-1.748-1.238-3.323-1.238H9.06l-1.49 8.32h2zm.12 7.068h2.008l1.09-6.9h-1.853l-1.245 6.9z" />
                    </svg>
                    <span>PayPal ($5)</span>
                  </button>

                  {/* Pago Móvil */}
                  <button
                    type="button"
                    onClick={() => setShowPagoMovilBox(!showPagoMovilBox)}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-101"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pago Móvil (Bs)</span>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={handleCashStep4}
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-101"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Efectivo ($ USD)</span>
                  </button>
                </div>

                {/* Sub-form Pago Móvil if expanded */}
                {showPagoMovilBox && (
                  <form onSubmit={handleReportPagoMovilStep4} className="p-4 bg-white border border-emerald-200 rounded-xl space-y-3 animate-fadeIn">
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Banco:</span>
                        <strong className="text-slate-900">Banco de Venezuela (0102)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Teléfono:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-900">0412 1234567</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy('04121234567', 'tel')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Cédula:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-900">V-12.345.678</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy('12345678', 'ci')}
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span>Monto:</span>
                        <strong className="text-emerald-700">Equivalente a $5 USD a Tasa BCV</strong>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pagoMovilRef}
                        onChange={e => setPagoMovilRef(e.target.value)}
                        placeholder="Nro. de Referencia (Ej. 849201)"
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:outline-hidden"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs whitespace-nowrap"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* OPTION 3: GHOST MODE (Explore with locks) */}
              <div className="pt-2 text-center space-y-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  ¿Prefieres ver primero los libros y temas antes de validar?
                </p>
                <button
                  type="button"
                  onClick={onExploreCalendar}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>👻 Explorar en Modo Fantasma (Vista Previa)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

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
