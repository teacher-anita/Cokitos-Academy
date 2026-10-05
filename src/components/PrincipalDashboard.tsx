import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  ArrowRightLeft, 
  Settings, 
  Phone, 
  Mail, 
  Lock, 
  Unlock, 
  DollarSign,
  Award,
  Video,
  X,
  Check,
  Coffee,
  Smartphone,
  MessageCircle,
  TrendingUp,
  Gift
} from 'lucide-react';
import { Student, Teacher, ScheduleSlot, EnglishLevel } from '../types';
import { ENGLISH_LEVELS } from '../data/curriculumData';
import { TeachersLounge } from './TeachersLounge';
import { OFFICIAL_PAGO_MOVIL, getBcvExchangeRate, setBcvExchangeRateOverride, convertUsdToBs } from '../services/currencyService';

interface PrincipalDashboardProps {
  students: Student[];
  teachers: Teacher[];
  slots: ScheduleSlot[];
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddStudent: (student: Student) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateSlots: (slots: ScheduleSlot[]) => void;
  onSwitchView: (role: 'principal' | 'teacher' | 'student') => void;
  onLogout: () => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  students,
  teachers,
  slots,
  onUpdateStudent,
  onDeleteStudent,
  onAddStudent,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddTeacher,
  onUpdateSlots,
  onSwitchView,
  onLogout
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'classrooms' | 'payments' | 'lounge'>('payments');

  // BCV Rate Management (Waky Control)
  const [currentBcvRate, setCurrentBcvRate] = useState<number>(() => getBcvExchangeRate());
  const [isEditingBcvRate, setIsEditingBcvRate] = useState(false);
  const [bcvRateInput, setBcvRateInput] = useState<string>(() => getBcvExchangeRate().toString());
  const [bcvRateSavedNotice, setBcvRateSavedNotice] = useState(false);

  const handleSaveBcvRate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(bcvRateInput);
    if (!isNaN(val) && val > 0) {
      setBcvExchangeRateOverride(val);
      setCurrentBcvRate(val);
      setIsEditingBcvRate(false);
      setBcvRateSavedNotice(true);
      setTimeout(() => setBcvRateSavedNotice(false), 2500);
    }
  };

  // Payment Management Tab State
  const [paymentSubFilter, setPaymentSubFilter] = useState<'pending' | 'trials' | 'deposits' | 'all'>('pending');
  const [approvingStudent, setApprovingStudent] = useState<Student | null>(null);
  const [approvalSlotId, setApprovalSlotId] = useState<string>('');
  const [approvalTeacherId, setApprovalTeacherId] = useState<string>('');
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  // Quick Approval Handler
  const handleApprovePayment = (student: Student, slotId?: string, teacherId?: string) => {
    const isDeposit = student.depositAmountUsd === 5 && student.plan !== 'basic';
    const chosenTeacher = teachers.find(t => t.id === teacherId);
    
    let updatedSlots = [...(student.assignedSlots || [])];
    if (slotId && !updatedSlots.includes(slotId)) {
      updatedSlots.push(slotId);
      // Update schedule slots
      if (onUpdateSlots) {
        const nextSlots = slots.map(s => {
          if (s.id === slotId) {
            const currentEnrolled = s.enrolledStudents || [];
            if (!currentEnrolled.some(e => e.studentId === student.id)) {
              return {
                ...s,
                enrolledStudents: [
                  ...currentEnrolled,
                  {
                    studentId: student.id,
                    studentName: `${student.name} ${student.lastName || ''}`.trim(),
                    levelId: student.levelId || 'level_1',
                    avatar: student.avatar,
                    email: student.email
                  }
                ],
                status: 'booked' as const
              };
            }
          }
          return s;
        });
        onUpdateSlots(nextSlots);
      }
    }

    const updated: Student = {
      ...student,
      status: 'enrolled',
      paymentStatus: isDeposit ? 'deposit_5_paid' : 'fully_paid',
      teacherId: teacherId || student.teacherId,
      teacherName: chosenTeacher ? `Teacher ${chosenTeacher.name}` : student.teacherName,
      assignedSlots: updatedSlots,
      notes: `${student.notes || ''} | Pago verificado y aprobado por Directora Waky el ${new Date().toLocaleDateString('es-VE')}`
    };

    onUpdateStudent(updated);
    setApprovingStudent(null);
    setApprovalNotice(`¡Pago de ${student.name} aprobado y matrícula activada exitosamente!`);
    setTimeout(() => setApprovalNotice(null), 3500);
  };

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');

  // Teacher Modals
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isNewTeacherModalOpen, setIsNewTeacherModalOpen] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<Partial<Teacher>>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: 'Super Goal & Kids Foundations',
    levelsAssigned: ['level_1', 'level_2'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '08:00 - 14:00',
    status: 'active',
    hourlyRate: 15,
    bio: ''
  });

  // Student Modals
  const [movingStudent, setMovingStudent] = useState<Student | null>(null);
  const [targetLevelId, setTargetLevelId] = useState('level_1');
  const [targetUnit, setTargetUnit] = useState(1);
  const [targetTeacherId, setTargetTeacherId] = useState('');
  const [targetStatus, setTargetStatus] = useState<'enrolled' | 'pending_evaluation' | 'paused' | 'completed'>('enrolled');
  const [targetSlotId, setTargetSlotId] = useState<string>('none');

  // Classrooms filter and assignment state
  const [slotDayFilter, setSlotDayFilter] = useState<string>('all');
  const [slotTeacherFilter, setSlotTeacherFilter] = useState<string>('all');
  const [slotSearch, setSlotSearch] = useState<string>('');
  const [selectedSlotForEnrollStudent, setSelectedSlotForEnrollStudent] = useState<ScheduleSlot | null>(null);
  const [studentToEnrollId, setStudentToEnrollId] = useState<string>('');

  // New Student Manual Registration Modal
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState<Partial<Student>>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: 25,
    isKid: false,
    schoolOrProfession: 'Estudiante Institucional',
    learningGoal: 'Superación laboral y fluidez conversacional',
    plan: 'basic',
    modality: 'online',
    groupSize: 'individual',
    preferredTimeSlot: 'Tardes',
    levelId: 'level_1',
    currentUnit: 1,
    status: 'enrolled'
  });

  // Slot Teacher Assignment Modal
  const [selectedSlotForTeacher, setSelectedSlotForTeacher] = useState<ScheduleSlot | null>(null);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const fullName = `${s.name} ${s.lastName || ''}`.toLowerCase();
    const matchesSearch = !studentSearch || 
      fullName.includes(studentSearch.toLowerCase()) || 
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesLevel = studentLevelFilter === 'all' || s.levelId === studentLevelFilter;
    const matchesStatus = studentStatusFilter === 'all' || s.status === studentStatusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Calculate Statistics
  const activeStudentsCount = students.filter(s => s.status === 'enrolled').length;
  const pendingStudentsCount = students.filter(s => s.status === 'pending_evaluation').length;
  const activeTeachersCount = teachers.filter(t => t.status === 'active').length;
  const bookedSlotsCount = slots.filter(s => s.status === 'booked').length;

  // Handle Save Teacher
  const handleSaveTeacherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    onUpdateTeacher(editingTeacher);
    setEditingTeacher(null);
  };

  // Handle Create Teacher
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherData.name || !newTeacherData.email) return;

    const teacherToAdd: Teacher = {
      id: `teacher_${Date.now()}`,
      name: newTeacherData.name.trim(),
      lastName: newTeacherData.lastName?.trim() || '',
      email: newTeacherData.email.trim().toLowerCase(),
      phone: newTeacherData.phone?.trim() || '',
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${newTeacherData.name}`,
      specialty: newTeacherData.specialty || 'General English',
      levelsAssigned: newTeacherData.levelsAssigned || ['level_1'],
      assignedDays: newTeacherData.assignedDays || ['Lunes', 'Miércoles'],
      workingHours: newTeacherData.workingHours || '08:00 - 13:00',
      status: (newTeacherData.status as any) || 'active',
      hourlyRate: Number(newTeacherData.hourlyRate) || 12,
      bio: newTeacherData.bio || 'Profesor de Cokitö Academy'
    };

    onAddTeacher(teacherToAdd);
    setIsNewTeacherModalOpen(false);
    setNewTeacherData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: 'Super Goal & Kids Foundations',
      levelsAssigned: ['level_1', 'level_2'],
      assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      workingHours: '08:00 - 14:00',
      status: 'active',
      hourlyRate: 15,
      bio: ''
    });
  };

  // Handle Student Movement / Reassignment
  const handleApplyStudentMove = () => {
    if (!movingStudent) return;

    const matchedTeacher = teachers.find(t => t.id === targetTeacherId);
    let newAssignedSlots = [...(movingStudent.assignedSlots || [])];

    if (targetSlotId && targetSlotId !== 'none') {
      if (!newAssignedSlots.includes(targetSlotId)) {
        newAssignedSlots.push(targetSlotId);
      }
      // Also update slot's enrolled students
      const slot = slots.find(s => s.id === targetSlotId);
      if (slot) {
        const curEnrolled = slot.enrolledStudents || [];
        if (!curEnrolled.some(e => e.studentId === movingStudent.id)) {
          const newEnrolled = [
            ...curEnrolled,
            {
              studentId: movingStudent.id,
              studentName: `${movingStudent.name} ${movingStudent.lastName || ''}`.trim(),
              levelId: targetLevelId,
              avatar: movingStudent.avatar,
              email: movingStudent.email
            }
          ];
          const maxCap = slot.maxCapacity || 1;
          const isNowBooked = newEnrolled.length >= maxCap;
          const updatedSlot: ScheduleSlot = {
            ...slot,
            status: isNowBooked ? 'booked' : 'available',
            studentId: movingStudent.id,
            studentName: `${movingStudent.name} ${movingStudent.lastName || ''}`.trim(),
            levelId: targetLevelId,
            enrolledStudents: newEnrolled
          };
          onUpdateSlots(slots.map(s => s.id === slot.id ? updatedSlot : s));
        }
      }
    }

    const updated: Student = {
      ...movingStudent,
      levelId: targetLevelId,
      currentUnit: targetUnit,
      status: targetStatus,
      teacherId: targetTeacherId || movingStudent.teacherId,
      teacherName: matchedTeacher ? `${matchedTeacher.name} ${matchedTeacher.lastName || ''}`.trim() : movingStudent.teacherName,
      assignedSlots: newAssignedSlots,
      notes: `${movingStudent.notes || ''} | [Rectoría Waky]: Movido a ${targetLevelId} Unidad ${targetUnit} (${new Date().toLocaleDateString()})`
    };

    onUpdateStudent(updated);
    setMovingStudent(null);
  };

  // Remove student from specific classroom slot
  const handleRemoveStudentFromSlot = (slotId: string, studentId: string) => {
    const updatedSlots = slots.map(s => {
      if (s.id === slotId) {
        const remaining = (s.enrolledStudents || []).filter(e => e.studentId !== studentId);
        return {
          ...s,
          enrolledStudents: remaining,
          status: remaining.length > 0 ? ('booked' as const) : ('available' as const),
          studentId: remaining[0]?.studentId,
          studentName: remaining[0]?.studentName,
          levelId: remaining[0]?.levelId
        };
      }
      return s;
    });
    onUpdateSlots(updatedSlots);

    const student = students.find(s => s.id === studentId);
    if (student) {
      onUpdateStudent({
        ...student,
        assignedSlots: (student.assignedSlots || []).filter(id => id !== slotId)
      });
    }
  };

  // Enroll student in classroom slot
  const handleEnrollStudentInSlot = (slotId: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const curEnrolled = slot.enrolledStudents || [];
    if (curEnrolled.some(e => e.studentId === student.id)) return;

    const newEnrolled = [
      ...curEnrolled,
      {
        studentId: student.id,
        studentName: `${student.name} ${student.lastName || ''}`.trim(),
        levelId: student.levelId || 'level_1',
        avatar: student.avatar,
        email: student.email
      }
    ];

    const maxCap = slot.maxCapacity || 1;
    const isNowBooked = newEnrolled.length >= maxCap;

    const updatedSlot: ScheduleSlot = {
      ...slot,
      status: isNowBooked ? 'booked' : 'available',
      studentId: student.id,
      studentName: `${student.name} ${student.lastName || ''}`.trim(),
      levelId: student.levelId,
      meetLink: slot.meetLink || `https://meet.google.com/eng-${slot.id}-${Date.now().toString().slice(-4)}`,
      enrolledStudents: newEnrolled
    };

    onUpdateSlots(slots.map(s => s.id === slot.id ? updatedSlot : s));
    onUpdateStudent({
      ...student,
      status: 'enrolled',
      assignedSlots: Array.from(new Set([...(student.assignedSlots || []), slot.id]))
    });
    setSelectedSlotForEnrollStudent(null);
    setStudentToEnrollId('');
  };

  // Handle Create Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.email) return;

    const studentToAdd: Student = {
      id: `student_${Date.now()}`,
      name: newStudentData.name.trim(),
      lastName: newStudentData.lastName?.trim() || '',
      email: newStudentData.email.trim().toLowerCase(),
      phone: newStudentData.phone?.trim() || '',
      age: Number(newStudentData.age) || 20,
      isKid: Boolean(newStudentData.isKid),
      schoolOrProfession: newStudentData.schoolOrProfession || 'Estudiante Cokitö',
      learningGoal: newStudentData.learningGoal || 'Inglés conversacional',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newStudentData.name}`,
      plan: newStudentData.plan || 'basic',
      modality: newStudentData.modality || 'online',
      groupSize: newStudentData.groupSize || 'individual',
      preferredTimeSlot: newStudentData.preferredTimeSlot || 'Tardes',
      levelId: newStudentData.levelId || 'level_1',
      currentUnit: Number(newStudentData.currentUnit) || 1,
      status: newStudentData.status || 'enrolled',
      registeredAt: new Date().toISOString().split('T')[0],
      completedHours: 0,
      xp: 300,
      streak: 1,
      league: 'Bronce',
      rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
      notes: 'Matriculado directamente por The Principal (Directora Waky).',
      assignedSlots: []
    };

    onAddStudent(studentToAdd);
    setIsNewStudentModalOpen(false);
  };

  // Assign Teacher to Slot
  const handleAssignTeacherToSlot = (teacherId: string) => {
    if (!selectedSlotForTeacher) return;
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const updatedSlots = slots.map(s => {
      if (s.id === selectedSlotForTeacher.id) {
        return {
          ...s,
          teacherName: `Teacher ${teacher.name}`
        };
      }
      return s;
    });

    onUpdateSlots(updatedSlots);
    setSelectedSlotForTeacher(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      
      {/* 1. TOP INSTITUTIONAL COMMAND HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-6 sm:p-8 text-slate-950 shadow-xl border border-amber-400">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Crown className="w-4 h-4 text-amber-400" />
                The Principal • Directora General
              </span>
              <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                👑 Sesión: Rectoría General
              </span>
              <span className="bg-amber-100 text-amber-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Acceso Seguro Verificado</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              Despacho Institucional Cokitö Academy
            </h1>

            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              Control maestro de rectoría: asigna y reasigna profesores a sus turnos de trabajo, mueve alumnos de clase o nivel, gestiona los salones y supervisa toda la institución.
            </p>
          </div>

          {/* Quick Impersonation / Role Switcher */}
          <div className="bg-slate-950 text-white rounded-2xl p-4 border border-amber-300/40 w-full lg:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Conmutador de Vista (Impersonate)
              </span>
              <span className="text-[10px] text-slate-400">Ver como:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => onSwitchView('teacher')}
                className="py-2 px-3 bg-blue-900/80 hover:bg-blue-800 text-blue-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Ver la plataforma tal como la ve un Teacher"
              >
                <span>👩‍🏫 Teacher</span>
              </button>
              <button
                onClick={() => onSwitchView('student')}
                className="py-2 px-3 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Ver la plataforma tal como la ve un Alumno"
              >
                <span>🎓 Alumno</span>
              </button>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-1.5 text-center text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Cerrar Sesión de Directora
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Profesores</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeTeachersCount}</div>
          <div className="text-[11px] text-emerald-600 font-bold">En plantilla activa</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Alumnos Activos</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeStudentsCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">+{pendingStudentsCount} pendientes</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Salones Ocupados</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bookedSlotsCount}</div>
          <div className="text-[11px] text-purple-600 font-bold">Bloques con alumnos</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Niveles Curriculares</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">12</div>
          <div className="text-[11px] text-amber-700 font-bold">Super Goal & Mega Goal</div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all relative ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Gestión de Pagos & Matrícula</span>
          {students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length > 0 && (
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs animate-pulse">
              🔔 {students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lounge')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'lounge'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Coffee className="w-4 h-4 text-amber-500" />
          <span>☕ Teacher's Lounge & Cartelera</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'teachers'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Control de Profesores ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Mover y Gestionar Alumnos ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classrooms')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all ${
            activeTab === 'classrooms'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Salones y Horarios de Profesores</span>
        </button>
      </div>

      {/* 4. TAB CONTENT: TEACHERS MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Plantilla Docente & Asignación de Horarios
              </h2>
              <p className="text-xs text-slate-500">
                Como Directora, asigna los horarios de trabajo de cada profesor, qué niveles imparten y cuántos alumnos tienen.
              </p>
            </div>

            <button
              onClick={() => setIsNewTeacherModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Contratar / Agregar Profesor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map(t => {
              const studentsAssignedToThisTeacher = students.filter(s => s.teacherId === t.id);
              return (
                <div key={t.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${t.name}`}
                        alt={t.name}
                        className="w-12 h-12 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            Teacher {t.name} {t.lastName || ''}
                          </h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.status === 'active' ? 'Activo' : 'De Permiso'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-700 font-semibold">{t.specialty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTeacher(t)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Modificar horarios y niveles del profesor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {t.id !== 'teacher_cokito' && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Dar de baja a Teacher ${t.name}?`)) {
                              onDeleteTeacher(t.id);
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Dar de baja profesor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Días Asignados:</span>
                      <span className="font-bold text-slate-800">{t.assignedDays.join(', ') || 'Sin definir'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Franja de Horario:</span>
                      <span className="font-bold text-slate-800">{t.workingHours || 'Flexible'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Niveles que Imparte:</span>
                      <span className="font-bold text-indigo-700">{t.levelsAssigned.join(', ').toUpperCase()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Alumnos Asignados:</span>
                      <span className="font-bold text-emerald-700">{studentsAssignedToThisTeacher.length} alumnos</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="truncate max-w-[200px]">{t.email}</span>
                    <button
                      onClick={() => setEditingTeacher(t)}
                      className="text-indigo-600 hover:underline font-bold text-xs"
                    >
                      Asignar Horarios & Clases →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: STUDENTS MANAGEMENT & MOVEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Movimiento de Alumnos & Control de Niveles
              </h2>
              <p className="text-xs text-slate-500">
                Mueve alumnos de nivel, cambia sus unidades, reasígnalos de profesor o dálos de baja.
              </p>
            </div>

            <button
              onClick={() => setIsNewStudentModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Matricular Nuevo Alumno</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Buscar por nombre o correo de alumno..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={studentLevelFilter}
                onChange={e => setStudentLevelFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Niveles</option>
                {ENGLISH_LEVELS.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>{lvl.levelName} ({lvl.book})</option>
                ))}
              </select>

              <select
                value={studentStatusFilter}
                onChange={e => setStudentStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">Todos los Estados</option>
                <option value="enrolled">Inscritos</option>
                <option value="pending_evaluation">Pendientes</option>
                <option value="paused">Pausados</option>
                <option value="completed">Graduados</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Nivel Actual</th>
                    <th className="py-3 px-4">Unidad</th>
                    <th className="py-3 px-4">Teacher Asignado</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones de Directora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const matchedLevel = ENGLISH_LEVELS.find(l => l.id === student.levelId);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                              alt={student.name}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{student.name} {student.lastName || ''}</div>
                              <div className="text-[11px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-indigo-700">
                          {matchedLevel ? `${matchedLevel.levelName} (${matchedLevel.book})` : student.levelId || 'Sin asignar'}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          Unidad {student.currentUnit || 1}
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          {student.teacherName ? (
                            <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              {student.teacherName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Teacher Cokitö (General)</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            student.status === 'enrolled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.status === 'pending_evaluation'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {student.status === 'enrolled' ? 'Inscrito' : student.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setMovingStudent(student);
                                setTargetLevelId(student.levelId || 'level_1');
                                setTargetUnit(student.currentUnit || 1);
                                setTargetTeacherId(student.teacherId || '');
                                setTargetStatus(student.status || 'enrolled');
                                setTargetSlotId(student.assignedSlots?.[0] || 'none');
                              }}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-xl transition-colors flex items-center gap-1"
                              title="Mover de nivel, unidad o profesor"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Mover / Reasignar</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Dar de baja y eliminar a ${student.name} del sistema?`)) {
                                  onDeleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Dar de baja al alumno"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: CLASSROOMS & TEACHER SLOTS */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Salones de Clase y Asignación de Horarios Docentes
            </h2>
            <p className="text-xs text-slate-500">
              Haz clic en cualquier bloque para asignar qué profesor dictará la clase en ese horario.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.slice(0, 18).map(slot => (
              <div 
                key={slot.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800">{slot.day} • {slot.startTime} - {slot.endTime}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    slot.status === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {slot.status === 'booked' ? 'Ocupado' : 'Disponible'}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">{slot.classroomTitle || 'Aula General'}</div>
                  <div className="text-amber-800 font-bold mt-1">
                    Profesor: {slot.teacherName || 'Sin asignar'}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSlotForTeacher(slot)}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Asignar / Cambiar Profesor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: GESTIÓN DE PAGOS Y MATRÍCULA (WAKY RECTORÍA) */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fadeIn">
          {approvalNotice && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{approvalNotice}</span>
            </div>
          )}

          {/* Top Row: Rate Management & Bank Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: BCV Exchange Rate Control */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tasa Oficial de Cambio (BCV)
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                  Activa
                </span>
              </div>

              {isEditingBcvRate ? (
                <form onSubmit={handleSaveBcvRate} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={bcvRateInput}
                      onChange={e => setBcvRateInput(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBcvRate(false)}
                      className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Actualiza el cálculo automático en Bs para todos los alumnos.</span>
                </form>
              ) : (
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      Bs. {currentBcvRate.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-slate-400">por 1.00 USD</span>
                  </div>
                  <button
                    onClick={() => {
                      setBcvRateInput(currentBcvRate.toString());
                      setIsEditingBcvRate(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modificar</span>
                  </button>
                </div>
              )}

              {bcvRateSavedNotice && (
                <p className="text-[11px] text-emerald-600 font-bold animate-fadeIn">✓ Tasa actualizada exitosamente</p>
              )}
            </div>

            {/* Box 2: Official Account Provincial */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1.5 text-xs md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cuenta Oficial de Recepción (Pago Móvil)
                </span>
                <span className="text-[11px] font-bold text-blue-700">Directora Waky</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-medium">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Banco:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.bankName} ({OFFICIAL_PAGO_MOVIL.bankCode})</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Cédula:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.cedula}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Teléfono:</span>
                  <strong className="text-slate-900">{OFFICIAL_PAGO_MOVIL.phone}</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Comunidad WhatsApp Welcome Lounge vinculada para preinscripciones.</span>
              </div>
            </div>

          </div>

          {/* Subfilter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setPaymentSubFilter('pending')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'pending'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Por Validar ({students.filter(s => s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef)).length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('trials')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'trials'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Pases de Cortesía 24h ({students.filter(s => s.paymentStatus === 'trial_24h').length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('deposits')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                paymentSubFilter === 'deposits'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Reservas $5 / Saldo Pendiente ({students.filter(s => s.paymentStatus === 'deposit_5_paid' || (s.balanceDueUsd && s.balanceDueUsd > 0)).length})</span>
            </button>

            <button
              onClick={() => setPaymentSubFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                paymentSubFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Todos los Alumnos</span>
            </button>
          </div>

          {/* Student Payment Cards / Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Bandeja de Conciliación Bancaria y Activación de Cupos
                </h3>
                <p className="text-xs text-slate-500">
                  Verifica el comprobante con tu aplicación de Banco Provincial y aprueba con un solo clic para abrir el acceso del alumno.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Plan & Modalidad</th>
                    <th className="py-3 px-4">Datos de Pago Móvil</th>
                    <th className="py-3 px-4">Estado Actual</th>
                    <th className="py-3 px-4 text-right">Decisión de Directora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => {
                      if (paymentSubFilter === 'pending') {
                        return s.paymentStatus === 'pending_approval' || (s.status === 'pending_evaluation' && s.pagoMovilRef);
                      }
                      if (paymentSubFilter === 'trials') return s.paymentStatus === 'trial_24h';
                      if (paymentSubFilter === 'deposits') return s.paymentStatus === 'deposit_5_paid' || (s.balanceDueUsd && s.balanceDueUsd > 0);
                      return true;
                    })
                    .map(st => {
                      const isPending = st.paymentStatus === 'pending_approval' || (st.status === 'pending_evaluation' && st.pagoMovilRef);
                      const isTrial = st.paymentStatus === 'trial_24h';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                              />
                              <div>
                                <strong className="text-slate-900 block font-semibold">{st.name} {st.lastName || ''}</strong>
                                <span className="text-xs text-slate-400 block">{st.email}</span>
                                <span className="text-[11px] text-slate-500">{st.phone || 'Sin WhatsApp'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-blue-900 block capitalize">{st.plan}</span>
                            <span className="text-xs text-slate-500 block capitalize">
                              {st.modality} • {st.groupSize === 'individual' ? '1 a 1' : 'Grupal'}
                            </span>
                            {st.preferredTimeSlot && (
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Preferencia: {st.preferredTimeSlot}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {st.pagoMovilRef ? (
                              <div className="space-y-0.5">
                                <span className="font-black text-slate-900 block text-xs">
                                  Ref: {st.pagoMovilRef}
                                </span>
                                <span className="text-[11px] text-slate-600 block">
                                  {st.pagoMovilBank || 'Banco emisor'} • {st.pagoMovilAmountBs ? `Bs. ${st.pagoMovilAmountBs}` : '$5 USD'}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {st.pagoMovilDate ? new Date(st.pagoMovilDate).toLocaleDateString() : 'Fecha reciente'}
                                </span>
                              </div>
                            ) : isTrial ? (
                              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                ⏱️ Pase de Cortesía 24h
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Sin reporte de referencia</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                              st.status === 'enrolled' && st.paymentStatus !== 'trial_24h'
                                ? 'bg-emerald-100 text-emerald-800'
                                : isTrial
                                ? 'bg-amber-100 text-amber-800'
                                : isPending
                                ? 'bg-blue-100 text-blue-900 animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {st.status === 'enrolled' && st.paymentStatus !== 'trial_24h'
                                ? '🟢 Matriculado / Activo'
                                : isTrial
                                ? '🎁 Modo Cortesía'
                                : isPending
                                ? '🔔 Por Conciliar'
                                : '🟡 Modo Guest'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* WhatsApp Contact */}
                              {st.phone && (
                                <a
                                  href={`https://wa.me/${st.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${st.name}! Te saluda la Directora Waky de Cokits Academy. Te escribo con respecto a tu inscripción y confirmación de horario en la academia.`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition-colors"
                                  title="Escribir por WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Approve Button */}
                              {st.status !== 'enrolled' || isTrial ? (
                                <button
                                  onClick={() => {
                                    setApprovingStudent(st);
                                    setApprovalSlotId(st.assignedSlots?.[0] || '');
                                    setApprovalTeacherId(st.teacherId || '');
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aprobar Pago & Activar</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Al día
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Approving Student with Slot & Teacher Assignment */}
          {approvingStudent && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      Aprobar Matrícula: {approvingStudent.name} {approvingStudent.lastName || ''}
                    </h3>
                    <p className="text-xs text-slate-400">Conciliación bancaria de Banco Provincial</p>
                  </div>
                  <button onClick={() => setApprovingStudent(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Referencia reportada:</span>
                    <strong className="text-slate-900">{approvingStudent.pagoMovilRef || 'Depósito manual'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Banco de origen:</span>
                    <strong className="text-slate-900">{approvingStudent.pagoMovilBank || 'No especificado'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monto transferido:</span>
                    <strong className="text-emerald-700 font-bold">{approvingStudent.pagoMovilAmountBs ? `Bs. ${approvingStudent.pagoMovilAmountBs}` : '$5 USD'}</strong>
                  </div>
                </div>

                {/* Teacher and Slot assignment */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Profesor Asignado:</label>
                    <select
                      value={approvalTeacherId}
                      onChange={e => setApprovalTeacherId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="">Teacher Cokitö (General)</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>Teacher {t.name} {t.lastName || ''} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Salón / Horario Confirmado por Waky:</label>
                    <select
                      value={approvalSlotId}
                      onChange={e => setApprovalSlotId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="">A convenir / Asincrónico</option>
                      {slots.slice(0, 15).map(s => (
                        <option key={s.id} value={s.id}>{s.day} {s.startTime} - {s.classroomTitle || 'Aula Regular'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApprovingStudent(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprovePayment(approvingStudent, approvalSlotId, approvalTeacherId)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar Conciliación & Activar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: TEACHER'S LOUNGE (SALA DE PROFESORES Y STAFF HUB) */}
      {activeTab === 'lounge' && (
        <div className="space-y-6 animate-fadeIn">
          <TeachersLounge
            currentStaffRole="principal"
            staffName="Directora Waky"
            staffAvatar="👑"
            students={students}
            teachers={teachers}
            slots={slots}
          />
        </div>
      )}

      {/* MODAL: MOVER ALUMNO (NIVEL, UNIDAD, PROFESOR, ESTADO) */}
      {movingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Mover Alumno: {movingStudent.name} {movingStudent.lastName || ''}
                  </h3>
                  <p className="text-xs text-slate-400">{movingStudent.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setMovingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target Level */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. Nivel Académico (Reubicación de Pensum):
                </label>
                <select
                  value={targetLevelId}
                  onChange={e => setTargetLevelId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.levelName} - {l.book} ({l.cefrEquiv})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Unit */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  2. Unidad Activa (1 a 8):
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={targetUnit}
                  onChange={e => setTargetUnit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                />
              </div>

              {/* Target Teacher */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  3. Asignar Profesor Responsable:
                </label>
                <select
                  value={targetTeacherId}
                  onChange={e => setTargetTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="">Teacher Cokitö (General)</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      Teacher {t.name} {t.lastName || ''} ({t.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Status */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  4. Estado del Alumno:
                </label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="enrolled">Inscrito / Activo</option>
                  <option value="pending_evaluation">Pendiente de Diagnóstico</option>
                  <option value="paused">Pausado / Permiso</option>
                  <option value="completed">Graduado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setMovingStudent(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyStudentMove}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors"
              >
                Aplicar Cambio en Rectoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PROFESOR (HORARIOS, DÍAS, NIVELES) */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveTeacherEdit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                Editar Horarios de Teacher {editingTeacher.name}
              </h3>
              <button 
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialidad Docente:</label>
                <input
                  type="text"
                  value={editingTeacher.specialty}
                  onChange={e => setEditingTeacher({ ...editingTeacher, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Franja de Horas Laborales (Ej. 08:00 - 14:00):</label>
                <input
                  type="text"
                  value={editingTeacher.workingHours}
                  onChange={e => setEditingTeacher({ ...editingTeacher, workingHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Días Asignados (Separados por coma):</label>
                <input
                  type="text"
                  value={editingTeacher.assignedDays.join(', ')}
                  onChange={e => setEditingTeacher({ 
                    ...editingTeacher, 
                    assignedDays: e.target.value.split(',').map(d => d.trim() as any) 
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="Lunes, Miércoles, Viernes"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Niveles que Imparte (Separados por coma):</label>
                <input
                  type="text"
                  value={editingTeacher.levelsAssigned.join(', ')}
                  onChange={e => setEditingTeacher({ 
                    ...editingTeacher, 
                    levelsAssigned: e.target.value.split(',').map(l => l.trim().toLowerCase()) 
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  placeholder="level_1, level_2, level_3"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado del Profesor:</label>
                <select
                  value={editingTeacher.status}
                  onChange={e => setEditingTeacher({ ...editingTeacher, status: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="active">Activo en Clases</option>
                  <option value="leave">De Permiso / Vacaciones</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Guardar Horarios del Profesor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CONTRATAR / AGREGAR NUEVO PROFESOR */}
      {isNewTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateTeacher}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                Contratar Nuevo Profesor para la Academia
              </h3>
              <button 
                type="button"
                onClick={() => setIsNewTeacherModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newTeacherData.name}
                    onChange={e => setNewTeacherData({ ...newTeacherData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Elena"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido:</label>
                  <input
                    type="text"
                    value={newTeacherData.lastName}
                    onChange={e => setNewTeacherData({ ...newTeacherData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Rondón"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={newTeacherData.email}
                  onChange={e => setNewTeacherData({ ...newTeacherData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="profe@cokito.com"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialidad:</label>
                <input
                  type="text"
                  value={newTeacherData.specialty}
                  onChange={e => setNewTeacherData({ ...newTeacherData, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="Inglés Conversacional Teens & Kids"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Horario Laboral Asignado:</label>
                <input
                  type="text"
                  value={newTeacherData.workingHours}
                  onChange={e => setNewTeacherData({ ...newTeacherData, workingHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="14:00 - 20:00 (Tardes y Noches)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewTeacherModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors"
              >
                Registrar Profesor en Plantilla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: MATRICULAR ALUMNO MANUALMENTE */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateStudent}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                Matricular Nuevo Alumno desde Rectoría
              </h3>
              <button 
                type="button"
                onClick={() => setIsNewStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newStudentData.name}
                    onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Carlos"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido:</label>
                  <input
                    type="text"
                    value={newStudentData.lastName}
                    onChange={e => setNewStudentData({ ...newStudentData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    placeholder="Gómez"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={newStudentData.email}
                  onChange={e => setNewStudentData({ ...newStudentData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  placeholder="alumno@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nivel Inicial Asignado:</label>
                <select
                  value={newStudentData.levelId}
                  onChange={e => setNewStudentData({ ...newStudentData, levelId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>{l.levelName} - {l.book}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewStudentModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-colors"
              >
                Matricular e Inscribir
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ASIGNAR PROFESOR A UN SLOT DE HORARIO */}
      {selectedSlotForTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Asignar Profesor a {selectedSlotForTeacher.day} {selectedSlotForTeacher.startTime}
              </h3>
              <button 
                onClick={() => setSelectedSlotForTeacher(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Selecciona el profesor que dictará la clase en este horario:
            </p>

            <div className="space-y-2">
              {teachers.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleAssignTeacherToSlot(t.id)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Teacher {t.name} {t.lastName || ''}</div>
                      <div className="text-[11px] text-slate-500">{t.specialty}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
