import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Shield, Video, User, CheckCircle2, AlertCircle, RefreshCw, Send, Lock, Plus } from 'lucide-react';
import { ScheduleSlot, Student, AudienceTheme } from '../types';
import { ENGLISH_LEVELS } from '../data/curriculumData';
import { generateEmailTemplate, sendGmailEmail } from '../services/gmailNotifier';

interface CalendarViewProps {
  slots: ScheduleSlot[];
  students: Student[];
  currentStudent: Student | null;
  activeRole: 'student' | 'teacher';
  audienceTheme: AudienceTheme;
  onFreeSlot?: (slotId: string) => void;
  onOpenRegister: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  slots,
  students,
  currentStudent,
  activeRole,
  audienceTheme,
  onFreeSlot,
  onOpenRegister
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Todos');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const isKids = audienceTheme === 'kids';
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const filteredDays = selectedDayFilter === 'Todos' ? days : [selectedDayFilter];

  const handleSendQuickReminder = async (slot: ScheduleSlot) => {
    if (!slot.studentId) return;
    const student = students.find(s => s.id === slot.studentId);
    if (!student) return;

    const level = ENGLISH_LEVELS.find(l => l.id === slot.levelId) || ENGLISH_LEVELS[0];
    const template = generateEmailTemplate('reminder_24h', {
      studentName: student.name,
      levelName: level.levelName,
      book: level.book,
      planName: student.plan,
      slotTime: `${slot.day} ${slot.startTime} - ${slot.endTime}`,
      meetLink: slot.meetLink
    });

    setActionMessage(`Enviando recordatorio a ${student.name}...`);
    const res = await sendGmailEmail({
      to: student.email,
      subject: template.subject,
      bodyText: template.bodyText
    });

    if (res.success) {
      setActionMessage(`✅ Recordatorio enviado exitosamente a ${student.email}`);
    } else {
      setActionMessage(`ℹ️ Correo preparado: para envío en vivo, conecta Google Workspace en la barra superior.`);
    }

    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
            isKids ? 'bg-sky-100 text-sky-700' : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}>
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Agenda Semanal de Clases
              </h2>
              {activeRole === 'teacher' ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Modo Teacher Cokito
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Horarios Confidenciales
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeRole === 'teacher'
                ? 'Gestiona la agenda docente, libera horarios asignados y envía recordatorios inmediatos por correo.'
                : 'Para proteger la privacidad de los alumnos, los turnos ocupados por otros compañeros se muestran como "Reservado".'}
            </p>
          </div>
        </div>

        {/* Day filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDayFilter('Todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDayFilter === 'Todos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Toda la semana
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDayFilter(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDayFilter === d
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs flex items-center justify-between shadow-md">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Disponible para reservar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>Tu Clase Confirmada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400 inline-block"></span>
            <span>🔒 Reservado por otro alumno (Confidencial)</span>
          </div>
        </div>

        <button
          onClick={onOpenRegister}
          className="flex items-center gap-1 font-bold text-xs text-blue-700 hover:text-blue-900"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Solicitar Inscripción en un Turno</span>
        </button>
      </div>

      {/* Grid of Days */}
      <div className={`grid gap-4 ${filteredDays.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredDays.map(day => {
          const daySlots = slots.filter(s => s.day === day);

          return (
            <div key={day} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              
              <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm tracking-tight">{day}</span>
                <span className="text-xs text-slate-500 font-medium">
                  {daySlots.filter(s => s.status === 'booked').length} / {daySlots.length} Ocupados
                </span>
              </div>

              <div className="p-3.5 space-y-2.5 flex-1">
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Sin turnos configurados</p>
                ) : (
                  daySlots.map(slot => {
                    const isBooked = slot.status === 'booked';
                    const isMyClass = isBooked && currentStudent && slot.studentId === currentStudent.id;
                    const isOtherBooked = isBooked && (!currentStudent || slot.studentId !== currentStudent.id);
                    const studentData = isBooked ? students.find(s => s.id === slot.studentId) : null;
                    const levelData = slot.levelId ? ENGLISH_LEVELS.find(l => l.id === slot.levelId) : null;

                    // CASE 1: Confidential (Student view of someone else's class)
                    if (isOtherBooked && activeRole === 'student') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-100/70 text-slate-500 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-700">
                                {slot.startTime} - {slot.endTime}
                              </div>
                              <span className="text-[11px] text-slate-500">🔒 Horario Reservado (Confidencial)</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                            Ocupado
                          </span>
                        </div>
                      );
                    }

                    // CASE 2: My Booked Class
                    if (isMyClass && activeRole === 'student') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-blue-950 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              ⭐ Tu Clase
                            </span>
                          </div>

                          <div className="text-xs">
                            <p className="font-bold text-slate-900">
                              {levelData?.levelName || 'Nivel Asignado'} • {levelData?.book || 'Super Goal'}
                            </p>
                            <p className="text-[11px] text-slate-500">Docente: La Teacher Cokito</p>
                          </div>

                          {slot.meetLink && (
                            <a
                              href={slot.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-xl shadow-2xs"
                            >
                              <Video className="w-3 h-3 text-blue-600" />
                              <span>Entrar a Google Meet</span>
                            </a>
                          )}
                        </div>
                      );
                    }

                    // CASE 3: Teacher Cokito Full View
                    if (isBooked && activeRole === 'teacher') {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-blue-950 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-[10px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded-full">
                              Ocupado
                            </span>
                          </div>

                          <div className="text-xs">
                            <strong className="text-slate-900 block">{slot.studentName || studentData?.name}</strong>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {levelData?.levelName} ({levelData?.book}) • Plan {studentData?.plan}
                            </p>
                          </div>

                          <div className="pt-1 flex items-center justify-between gap-2 border-t border-blue-200/60">
                            {slot.meetLink && (
                              <a
                                href={slot.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700"
                              >
                                <Video className="w-3 h-3" />
                                <span>Meet</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleSendQuickReminder(slot)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-white border border-blue-200 px-2 py-0.5 rounded-lg"
                            >
                              <Send className="w-3 h-3" />
                              <span>Notificar</span>
                            </button>
                            {onFreeSlot && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Liberar este horario para ${slot.studentName}?`)) {
                                    onFreeSlot(slot.id);
                                  }
                                }}
                                className="text-[10px] text-rose-600 font-bold"
                              >
                                Liberar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Available
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-black text-xs text-emerald-950">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-medium">Disponible</span>
                        </div>
                        <button
                          onClick={onOpenRegister}
                          className="text-[11px] font-black text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 px-3 py-1 rounded-xl shadow-2xs transition-colors"
                        >
                          Reservar
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
