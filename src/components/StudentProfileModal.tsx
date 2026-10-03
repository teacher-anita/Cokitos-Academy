import React from 'react';
import { X, Flame, Zap, Award, BookOpen, Clock, Calendar, Mail, Phone, LogOut, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { Student } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  user: FirebaseUser | null;
  onLogout: () => void;
  onOpenCoupon: () => void;
  onOpenPlacementTest: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  user,
  onLogout,
  onOpenCoupon,
  onOpenPlacementTest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">Mi Perfil Cokitö</h3>
              <p className="text-[11px] text-blue-200">Progreso & Estado de Alumno</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {student ? (
            <>
              {/* Profile Card */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <img
                  src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                  alt={student.name}
                  className="w-14 h-14 rounded-2xl border-2 border-white shadow-xs object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-900 text-sm sm:text-base truncate">
                    {student.name} {student.lastName || ''}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{student.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.status === 'enrolled'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {student.status === 'enrolled' ? 'Matriculado' : 'Aspirante'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {(student.levelId || 'SuperGoal 1').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-orange-600 font-black text-lg">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{student.streak}</span>
                  </div>
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mt-0.5">Días Racha</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-lg">
                    <Zap className="w-4 h-4 fill-emerald-500" />
                    <span>{student.xp}</span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Puntos XP</p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200/80 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 text-purple-600 font-black text-lg">
                    <Award className="w-4 h-4" />
                    <span>{student.league}</span>
                  </div>
                  <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mt-0.5">Liga</p>
                </div>
              </div>

              {/* Placement Test Result if exists */}
              {student.placementTestScore !== undefined && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-blue-900">
                    <span>Prueba Diagnóstica Cokitö:</span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded-lg text-[11px]">
                      {student.placementTestScore} / 25 pts
                    </span>
                  </div>
                  {student.placementTestDiagnosis && (
                    <p className="text-[11px] text-blue-800 italic pt-1 leading-relaxed">
                      "{student.placementTestDiagnosis}"
                    </p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCoupon();
                  }}
                  className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔑 Canjear Código de Invitación / Beca</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlacementTest();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📝 Repetir Prueba de Nivel (Placement Test)</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Modo Explorador (Sin Sesión)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Aún no has iniciado sesión o registrado tu cuenta de alumno.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCoupon();
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Canjear Código de Cortesía (CSB2026)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlacementTest();
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Hacer Prueba de Nivel Gratis
                </button>
              </div>
            </div>
          )}

          {/* Connected Google Account */}
          {user && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate text-slate-600">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 font-bold shrink-0 ml-2"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
