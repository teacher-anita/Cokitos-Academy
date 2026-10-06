import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, Sparkles, AlertCircle, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (student: Student) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; desc: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    if (cleanCode === 'CSB2026' || cleanCode.includes('CSB2026')) {
      const redeemedStudent: Student = {
        id: `csb_${Date.now()}`,
        name: name.trim(),
        lastName: '(Comunidad)',
        email: email.trim().toLowerCase(),
        phone: '',
        age: 30,
        isKid: false,
        schoolOrProfession: 'Educación',
        learningGoal: 'Teacher Professional Development',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Tardes',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 22,
        currentUnit: 1,
        completedHours: 0,
        xp: 350,
        streak: 3,
        league: 'Oro',
        rating: { fluency: 4, grammar: 4, vocabulary: 4, pronunciation: 4 },
        notes: 'Pase de cortesía especial Comunidad Educativa Simón Bolívar.',
        assignedSlots: ['Lunes-16:00', 'Miércoles-16:00'],
        registeredAt: new Date().toISOString()
      };

      setSuccessInfo({
        title: '¡Pase Especial Activado! 🎁',
        desc: 'Se ha desbloqueado tu acceso de cortesía al Módulo 1 completo y sus unidades en la plataforma Cokitö. ¡Bienvenido!'
      });

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        onApplyCoupon(redeemedStudent);
        onClose();
      }, 2000);

    } else if (cleanCode === 'FRIENDS2026') {
      const redeemedStudent: Student = {
        id: `friends_${Date.now()}`,
        name: name.trim(),
        lastName: '(VIP Friends)',
        email: email.trim().toLowerCase(),
        phone: '',
        age: 28,
        isKid: false,
        schoolOrProfession: 'Comunidad Cokitö',
        learningGoal: 'Fluidez y práctica libre',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        plan: 'regular',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Flexible',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 25,
        currentUnit: 1,
        completedHours: 0,
        xp: 500,
        streak: 5,
        league: 'Diamante',
        rating: { fluency: 5, grammar: 5, vocabulary: 5, pronunciation: 5 },
        notes: 'Pase Friends & Family otorgado por La Teacher Cokitö.',
        assignedSlots: ['Martes-17:30', 'Jueves-17:30'],
        registeredAt: new Date().toISOString()
      };

      setSuccessInfo({
        title: '¡Pase Friends & Family Desbloqueado! 🌟',
        desc: 'Acceso de cortesía preferencial para amigos y familiares de La Teacher Cokitö.'
      });

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch {}

      setTimeout(() => {
        onApplyCoupon(redeemedStudent);
        onClose();
      }, 2000);

    } else if (cleanCode === 'COKITO5') {
      const redeemedStudent: Student = {
        id: `dig_${Date.now()}`,
        name: name.trim(),
        lastName: '',
        email: email.trim().toLowerCase(),
        phone: '',
        age: 25,
        isKid: false,
        schoolOrProfession: 'Autoaprendizaje',
        learningGoal: 'Práctica asincrónica autónoma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Asincrónico',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 18,
        currentUnit: 1,
        completedHours: 0,
        xp: 150,
        streak: 1,
        league: 'Plata',
        rating: { fluency: 3, grammar: 4, vocabulary: 4, pronunciation: 3 },
        notes: 'Suscripción Digital $5/mes activa.',
        assignedSlots: [],
        registeredAt: new Date().toISOString()
      };

      setSuccessInfo({
        title: '¡Suscripción Digital $5/mes Activa! 📱',
        desc: 'Acceso asincrónico a los recursos, audios y quizzes interactivos de la plataforma Cokitö.'
      });

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        onApplyCoupon(redeemedStudent);
        onClose();
      }, 2000);

    } else {
      setErrorMsg('Código no reconocido o expirado. Por favor verifica con La Teacher Cokitö.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Pases de Cortesía & Becas
              </span>
              <h3 className="font-black text-base text-white">
                Canjear Código Cokitö
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successInfo ? (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-slate-900">{successInfo.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{successInfo.desc}</p>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Si recibiste una cortesía especial, beca o pase de invitación de <strong>La Teacher Cokitö</strong>, ingrésalo a continuación para activar tu acceso de inmediato.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tu Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Andrés Silva"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Código de Invitación / Beca
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. CSB2026 o FRIENDS2026"
                    className="w-full px-3.5 py-2.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs text-slate-900 font-mono font-bold uppercase tracking-wider focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Sparkles className="w-4 h-4 text-amber-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>Validar y Activar Pase</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
