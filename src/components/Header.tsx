import React from 'react';
import { Sparkles, Calendar, BookOpen, UserCheck, Flame, Zap, LogOut, CheckCircle2, Home, Baby, GraduationCap, Lock, KeyRound } from 'lucide-react';
import { User } from 'firebase/auth';
import { AudienceTheme, Student } from '../types';

interface HeaderProps {
  user: User | null;
  activeRole: 'student' | 'teacher';
  onRoleChange: (role: 'student' | 'teacher') => void;
  audienceTheme: AudienceTheme;
  onAudienceChange: (theme: AudienceTheme) => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  onOpenOptimizer: () => void;
  onOpenCouponModal: () => void;
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
  activeRole,
  onRoleChange,
  audienceTheme,
  onAudienceChange,
  onLogin,
  onLogout,
  isLoggingIn,
  onOpenOptimizer,
  onOpenCouponModal,
  currentStudentXp,
  currentStudentStreak,
  currentStudent,
  activeTab,
  onTabChange,
  allStudents,
  onSelectStudent
}) => {
  const isKids = audienceTheme === 'kids';
  const isEnrolled = activeRole === 'teacher' || (currentStudent && currentStudent.status === 'enrolled');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Teacher Cokitö Branding */}
          <button
            onClick={() => onTabChange('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
              isKids
                ? 'bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 shadow-sky-100'
                : 'bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-700 shadow-blue-100'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  La Teacher Cokitö
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  isKids
                    ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {isKids ? 'Kids & Teens' : 'Academia Cokitö'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Aprende Inglés Sin Miedo & a Tu Ritmo</p>
            </div>
          </button>

          {/* Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl text-xs font-semibold text-slate-600">
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

            {/* AULA VIRTUAL & RUTA */}
            <button
              onClick={() => onTabChange('pathway')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'pathway'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Aula Virtual</span>
              {!isEnrolled && <Lock className="w-3 h-3 text-amber-500" />}
            </button>

            {activeRole === 'teacher' && (
              <button
                onClick={() => onTabChange('teacher')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'teacher'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Docente
              </button>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            
            {/* Coupon / Beca button */}
            <button
              onClick={onOpenCouponModal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
              title="Canjear código de cortesía o beca"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Código</span>
            </button>

            {/* Quick Switch for testing: Alumno / Aspirante / Teacher */}
            {activeRole === 'student' && (
              <select
                value={currentStudent?.id || ''}
                onChange={e => onSelectStudent(e.target.value)}
                className="hidden lg:block text-[11px] p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold max-w-[130px] truncate"
                title="Cambiar perfil de prueba"
              >
                <option value="guest">👤 Visitante (Sin Matricular)</option>
                {allStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.status === 'enrolled' ? 'Matriculado' : 'Aspirante'})
                  </option>
                ))}
              </select>
            )}

            {/* AUDIENCE THEME TOGGLE: Kids vs Adultos */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold border border-slate-200/80">
              <button
                onClick={() => onAudienceChange('adults')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                  !isKids
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Modo Adultos: Paleta académica formal y sobria"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Adultos</span>
              </button>
              <button
                onClick={() => onAudienceChange('kids')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                  isKids
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Modo Kids: Paleta alegre, vibrante y cercana"
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

            {/* Role Switcher Pill (Alumno vs Teacher Cokitö) */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => onRoleChange('student')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeRole === 'student'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Alumno
              </button>
              <button
                onClick={() => onRoleChange('teacher')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeRole === 'teacher'
                    ? 'bg-blue-900 text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Teacher
              </button>
            </div>

            {/* Google Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
                  alt={user.displayName || 'Usuario'}
                  className="w-7 h-7 rounded-full border border-slate-300 object-cover"
                />
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                title="Conectar Google Workspace"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Conectar</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => onTabChange('landing')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap ${
              activeTab === 'landing' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onTabChange('register')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap ${
              activeTab === 'register' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Inscripción & Test
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap ${
              activeTab === 'calendar' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => onTabChange('duolingo')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap ${
              activeTab === 'duolingo' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Retos Cokitö
          </button>
          <button
            onClick={() => onTabChange('pathway')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'pathway' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            <span>Aula Virtual</span>
            {!isEnrolled && <Lock className="w-2.5 h-2.5 text-amber-400" />}
          </button>
          {activeRole === 'teacher' && (
            <button
              onClick={() => onTabChange('teacher')}
              className={`px-3 py-1 rounded-xl whitespace-nowrap ${
                activeTab === 'teacher' ? 'bg-blue-900 text-white font-bold' : 'text-blue-900 font-semibold'
              }`}
            >
              Docente
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
