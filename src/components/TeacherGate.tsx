import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User } from 'firebase/auth';

interface TeacherGateProps {
  user: User | null;
  onLoginWithGoogle: () => void;
  isLoggingIn: boolean;
  onAuthenticated: () => void;
  onBackToStudent: () => void;
}

export const TeacherGate: React.FC<TeacherGateProps> = ({
  user,
  onLoginWithGoogle,
  isLoggingIn,
  onAuthenticated,
  onBackToStudent
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Teacher credentials: User "Coquito" / "coquito", Clave "3223"
    if ((cleanUser === 'coquito' || cleanUser === 'cokitö') && cleanPass === '3223') {
      onAuthenticated();
    } else {
      setErrorMessage('Credenciales inválidas. Este portal es de acceso privado y exclusivo para La Teacher.');
    }
  };

  const isTeacherGoogle = user && (user.email === 'anateresa.csb@gmail.com' || user.email?.includes('anateresa'));

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-900 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
        <Lock className="w-8 h-8 text-amber-400" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-bold text-blue-900 mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        Acceso Restringido • Solo Teacher
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        Portal Teacher Cokitö
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
        Área confidencial exclusiva para la gestión de alumnos, diagnósticos y asignación de horarios de La Teacher.
      </p>

      {/* Google login option if already matching email */}
      {isTeacherGoogle ? (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cuenta verificada: {user.email}</span>
          </div>
          <button
            type="button"
            onClick={onAuthenticated}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            Entrar como Teacher
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Usuario Teacher
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Coquito"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clave de Seguridad
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Ingresar al Portal Teacher</span>
            </button>
          </form>

          <div className="relative py-2 text-center">
            <span className="bg-white px-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              o con tu cuenta oficial
            </span>
          </div>

          <button
            type="button"
            onClick={onLoginWithGoogle}
            disabled={isLoggingIn}
            className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{isLoggingIn ? 'Conectando...' : 'Iniciar con Google (Teacher)'}</span>
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBackToStudent}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la vista de Estudiante</span>
        </button>
      </div>
    </div>
  );
};
