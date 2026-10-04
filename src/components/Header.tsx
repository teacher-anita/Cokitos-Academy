import React from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Zap, 
  Flame, 
  Lock, 
  KeyRound, 
  GraduationCap, 
  Baby, 
  User as UserIcon 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AudienceTheme, Student, StaffRole } from '../types';

interface HeaderProps {
  user: User | null;
  isTeacherAuthenticated: boolean;
  staffRole?: StaffRole | null;
  onTeacherLogout: () => void;
  audienceTheme: AudienceTheme;
  onAudienceChange: (theme: AudienceTheme) => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  onOpenOptimizer: () => void;
  onOpenCouponModal: () => void;
  onOpenProfile: () => void;
  currentStudentXp: number;
  currentStudentStreak: number;
  currentStudent: Student | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isTeacherAuthenticated,
  staffRole,
  onTeacherLogout,
  audienceTheme,
  onAudienceChange,
  onLogin,
  onLogout,
  isLoggingIn,
  onOpenOptimizer,
  onOpenCouponModal,
  onOpenProfile,
  currentStudentXp,
  currentStudentStreak,
  currentStudent,
  activeTab,
  onTabChange,
  allStudents,
  onSelectStudent
}) => {
  const isKids = audienceTheme === 'kids';
  const isEnrolled = isTeacherAuthenticated || (currentStudent && currentStudent.status === 'enrolled');

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Row 1: Brand & Top Actions (Guaranteed 100% visible, never escapes on the right) */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo & Teacher Cokitö Branding */}
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2 text-left focus:outline-hidden shrink-0 min-w-0"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-all shrink-0 ${
                isKids
                  ? 'bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 shadow-sky-100'
                  : 'bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-700 shadow-blue-100'
              }`}>
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 tracking-tight text-sm sm:text-base md:text-lg truncate">
                    La Teacher Cokitö
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                    isKids
                      ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {isKids ? 'Kids' : 'Academia'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Aprende Inglés Sin Miedo & a Tu Ritmo</p>
              </div>
            </button>

            {/* Right Action Cluster - Always visible on desktop, tablet, and mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Coupon / Beca button */}
              <button
                onClick={onOpenCouponModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Canjear código de cortesía o beca"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Código / Beca</span>
              </button>

              {/* AUDIENCE THEME TOGGLE: Kids vs Adultos */}
              <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-xl items-center text-xs font-bold border border-slate-200/80">
                <button
                  onClick={() => onAudienceChange('adults')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    !isKids
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Modo Adultos"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Adultos</span>
                </button>
                <button
                  onClick={() => onAudienceChange('kids')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                    isKids
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Modo Kids"
                >
                  <Baby className="w-3.5 h-3.5" />
                  <span>Kids</span>
                </button>
              </div>

              {/* Gamification badge: Racha + XP */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 border border-slate-200/80 px-2 sm:px-2.5 py-1 rounded-xl text-xs">
                <div className="flex items-center gap-0.5 text-orange-600 font-bold" title="Racha activa de días">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>{currentStudentStreak}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-0.5 text-emerald-600 font-bold" title="Puntos XP Cokitö">
                  <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  <span>{currentStudentXp}</span>
                </div>
              </div>

              {/* Profile / Avatar Button */}
              <button
                onClick={onOpenProfile}
                className="flex items-center p-0.5 sm:p-1 hover:bg-slate-100 rounded-xl transition-colors focus:outline-hidden"
                title="Ver mi perfil"
              >
                {currentStudent ? (
                  <img
                    src={currentStudent.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentStudent.name}`}
                    alt={currentStudent.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : user ? (
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
                    alt={user.displayName || 'Usuario'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Teacher Logout if authenticated */}
              {isTeacherAuthenticated && (
                <button
                  onClick={onTeacherLogout}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold transition-colors"
                  title="Cerrar sesión de Teacher"
                >
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>Salir Teacher</span>
                </button>
              )}

            </div>
          </div>

          {/* Row 2: Navigation Pills Bar with Emojis & Aligned Locks (Visible on Desktop & Tablet) */}
          <div className="hidden md:flex items-center justify-center border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold text-slate-600">
              
              {/* 1. Inicio */}
              <button
                onClick={() => onTabChange('landing')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'landing'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">🏠</span>
                <span>Inicio</span>
              </button>

              {/* 2. Inscripción & Test */}
              <button
                onClick={() => onTabChange('register')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">✍️</span>
                <span>Inscripción & Test</span>
              </button>

              {/* 3. Agenda */}
              <button
                onClick={() => onTabChange('calendar')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">📅</span>
                <span>Agenda</span>
              </button>

              {/* 4. Retos Cokitö */}
              <button
                onClick={() => onTabChange('duolingo')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'duolingo'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">⚡</span>
                <span>Retos Cokitö</span>
              </button>

              {/* 5. Classroom (Emoji on left, Lock on RIGHT) */}
              <button
                onClick={() => onTabChange('pathway')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'pathway'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span className="text-sm">📚</span>
                <span>Classroom</span>
                {!isEnrolled && (
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-0.5" />
                )}
              </button>
              
              {/* 6. Laboratorio (Language Practice Lab • 100 Drills) */}
              <button
                onClick={() => onTabChange('lab')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'lab'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold ring-1 ring-emerald-300'
                    : 'hover:text-slate-900'
                }`}
                title="Laboratorio de Práctica • 100 Ejercicios Interactivos"
              >
                <span className="text-sm">🧪</span>
                <span>Laboratorio</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  100
                </span>
              </button>

              {/* 7. Teacher / Directora Portal (Emoji on left, Lock on RIGHT) */}
              <button
                onClick={() => onTabChange('teacher')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'teacher'
                    ? staffRole === 'principal'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-1 ring-amber-500'
                      : 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-200/60'
                }`}
                title={staffRole === 'principal' ? 'Despacho Directora Waky' : 'Acceso restringido para La Teacher'}
              >
                <span className="text-sm">{staffRole === 'principal' ? '👑' : '👩‍🏫'}</span>
                <span>{staffRole === 'principal' ? 'Directora (Waky)' : 'Teacher'}</span>
                <Lock className={`w-3.5 h-3.5 shrink-0 ml-0.5 ${isTeacherAuthenticated ? 'text-emerald-400' : 'text-amber-500'}`} />
              </button>

            </nav>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Con emoticones consistentes y candados a la derecha) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-1 py-1 flex md:hidden items-center justify-around pb-safe">
        <div className="w-full max-w-lg mx-auto flex items-center justify-around">
          
          {/* 1. Inicio */}
          <button
            onClick={() => onTabChange('landing')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[62px] ${
              activeTab === 'landing'
                ? 'text-blue-600 font-bold bg-blue-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">🏠</span>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Inicio</span>
          </button>

          {/* 2. Inscripción */}
          <button
            onClick={() => onTabChange('register')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[62px] ${
              activeTab === 'register'
                ? 'text-blue-600 font-bold bg-blue-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">✍️</span>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Inscripción</span>
          </button>

          {/* 3. Classroom (Lock on RIGHT) */}
          <button
            onClick={() => onTabChange('pathway')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[56px] relative ${
              activeTab === 'pathway'
                ? 'text-indigo-600 font-bold bg-indigo-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">📚</span>
              {!isEnrolled && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Classroom</span>
          </button>

          {/* 4. Laboratorio (100 Drills) */}
          <button
            onClick={() => onTabChange('lab')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[56px] relative ${
              activeTab === 'lab'
                ? 'text-emerald-600 font-bold bg-emerald-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">🧪</span>
              <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-600 text-white rounded-full text-[8px] font-black">
                100
              </span>
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Lab</span>
          </button>

          {/* 5. Retos */}
          <button
            onClick={() => onTabChange('duolingo')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[56px] ${
              activeTab === 'duolingo'
                ? 'text-emerald-600 font-bold bg-emerald-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">⚡</span>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Retos</span>
          </button>

          {/* 6. Agenda */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[56px] ${
              activeTab === 'calendar'
                ? 'text-blue-600 font-bold bg-blue-50/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-base">📅</span>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">Agenda</span>
          </button>

          {/* 7. Teacher / Directora (Lock on RIGHT) */}
          <button
            onClick={() => onTabChange('teacher')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all flex-1 min-w-0 max-w-[56px] relative ${
              activeTab === 'teacher'
                ? staffRole === 'principal'
                  ? 'text-amber-950 font-black bg-amber-200/80 scale-102'
                  : 'text-blue-900 font-bold bg-blue-100/80 scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <span className="text-base">{staffRole === 'principal' ? '👑' : '👩‍🏫'}</span>
              <span className={`absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                isTeacherAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                <Lock className="w-2 h-2 text-white" />
              </span>
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center mt-0.5">
              {staffRole === 'principal' ? 'Directora' : 'Teacher'}
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
