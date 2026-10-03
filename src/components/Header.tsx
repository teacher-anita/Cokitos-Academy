import React from 'react';
import { Sparkles, Calendar, BookOpen, UserCheck, Flame, Zap, LogOut, CheckCircle2, Home, Baby, GraduationCap, Lock, KeyRound, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';
import { AudienceTheme, Student } from '../types';

interface HeaderProps {
  user: User | null;
  isTeacherAuthenticated: boolean;
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
            {/* Logo & Teacher Cokitö Branding */}
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2 text-left focus:outline-hidden shrink-0"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
                isKids
                  ? 'bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 shadow-sky-100'
                  : 'bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-700 shadow-blue-100'
              }`}>
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 tracking-tight text-sm sm:text-base md:text-lg">
                    La Teacher Cokitö
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full border ${
                    isKids
                      ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {isKids ? 'Kids' : 'Academia'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">Aprende Inglés Sin Miedo & a Tu Ritmo</p>
              </div>
            </button>

            {/* Desktop Center Tabs Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => onTabChange('landing')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'landing'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Inicio
              </button>
              <button
                onClick={() => onTabChange('register')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Inscripción & Test
              </button>
              <button
                onClick={() => onTabChange('calendar')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Agenda
              </button>
              <button
                onClick={() => onTabChange('duolingo')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'duolingo'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                Retos Cokitö
              </button>
              <button
                onClick={() => onTabChange('pathway')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'pathway'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Classroom</span>
                {!isEnrolled && <Lock className="w-3 h-3 text-amber-500" />}
              </button>
              
              {/* Teacher Portal Tab */}
              <button
                onClick={() => onTabChange('teacher')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'teacher'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-200/60'
                }`}
                title="Acceso restringido para La Teacher"
              >
                <Lock className={`w-3.5 h-3.5 ${isTeacherAuthenticated ? 'text-emerald-400' : 'text-amber-500'}`} />
                <span>Teacher</span>
              </button>
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Coupon / Beca button */}
              <button
                onClick={onOpenCouponModal}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Canjear código de cortesía o beca"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Código</span>
              </button>

              {/* AUDIENCE THEME TOGGLE: Kids vs Adultos */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold border border-slate-200/80">
                <button
                  onClick={() => onAudienceChange('adults')}
                  className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all ${
                    !isKids
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Modo Adultos"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Adultos</span>
                </button>
                <button
                  onClick={() => onAudienceChange('kids')}
                  className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all ${
                    isKids
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Modo Kids"
                >
                  <Baby className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kids</span>
                </button>
              </div>

              {/* Gamification badge */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-xl text-xs">
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

              {/* Profile / Avatar Button (Opens Mobile Profile) */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 hover:bg-slate-100 rounded-xl transition-colors"
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
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[11px] font-bold transition-colors"
                  title="Cerrar sesión de Teacher"
                >
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>Salir Teacher</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET BOTTOM NAVIGATION BAR (Bello, táctil y espectacular) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex lg:hidden items-center justify-around pb-safe">
        <button
          onClick={() => onTabChange('landing')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'landing' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </button>

        <button
          onClick={() => onTabChange('pathway')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl relative transition-all ${
            activeTab === 'pathway' ? 'text-indigo-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {!isEnrolled && (
              <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                <Lock className="w-1.5 h-1.5 text-white" />
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Classroom</span>
        </button>

        <button
          onClick={() => onTabChange('duolingo')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'duolingo' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Retos</span>
        </button>

        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'calendar' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Agenda</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Mi Perfil</span>
        </button>

        <button
          onClick={() => onTabChange('teacher')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'teacher' ? 'text-blue-900 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className={`w-5 h-5 ${isTeacherAuthenticated ? 'text-emerald-500' : 'text-amber-500'}`} />
          <span className="text-[10px] tracking-tight">Teacher</span>
        </button>
      </nav>
    </>
  );
};
