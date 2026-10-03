/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { RegistrationFlow } from './components/RegistrationFlow';
import { CalendarView } from './components/CalendarView';
import { GamificationHub } from './components/GamificationHub';
import { LearningPathway } from './components/LearningPathway';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ScheduleOptimizerModal } from './components/ScheduleOptimizerModal';
import { PlacementQuizModal } from './components/PlacementQuizModal';
import { CouponModal } from './components/CouponModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { TeacherGate } from './components/TeacherGate';
import { StudentProfileModal } from './components/StudentProfileModal';
import { Student, ScheduleSlot, AudienceTheme } from './types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from './data/curriculumData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { saveStudent, saveSlots, subscribeToStudents, getLocalSlots } from './services/db';
import { ShieldCheck } from 'lucide-react';
import { CyberOwlChatbot } from './components/CyberOwlChatbot';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [audienceTheme, setAudienceTheme] = useState<AudienceTheme>('adults');
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isPlacementQuizOpen, setIsPlacementQuizOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Teacher Authentication state (Private to Teacher Cokitö: User Coquito / PIN 3223 or Google)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cokito_teacher_auth') === 'true';
  });

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Real-time Database State (Firestore + Local fallback)
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [slots, setSlots] = useState<ScheduleSlot[]>(() => getLocalSlots());

  // Current active student selector (Defaults to 'guest' for phone visitors to test paywall!)
  const [currentStudentId, setCurrentStudentId] = useState<string>('guest');

  // Real-time Firestore Sync
  useEffect(() => {
    const unsubStudents = subscribeToStudents((latestStudents) => {
      setStudents(latestStudents);
    });
    return () => {
      if (typeof unsubStudents === 'function') unsubStudents();
    };
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          if (currentUser.email === 'anateresa.csb@gmail.com' || currentUser.email?.includes('anateresa')) {
            setIsTeacherAuthenticated(true);
            sessionStorage.setItem('cokito_teacher_auth', 'true');
          } else {
            // If registered student matches this Google account email, auto-switch to their profile
            const matched = students.find(s => s.email.toLowerCase() === currentUser.email?.toLowerCase());
            if (matched) {
              setCurrentStudentId(matched.id);
            }
          }
        }
      },
      () => setUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [students]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) setUser(res.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCredentialsLogin = (emailOrUser: string, pass: string): boolean => {
    const clean = emailOrUser.trim().toLowerCase();
    const matched = students.find(s => 
      s.email.toLowerCase() === clean || 
      s.name.toLowerCase() === clean ||
      s.username?.toLowerCase() === clean ||
      `${s.name} ${s.lastName || ''}`.trim().toLowerCase() === clean
    );
    if (matched) {
      if (!matched.password || matched.password === pass || pass === '') {
        setCurrentStudentId(matched.id);
        return true;
      }
    }
    return false;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentStudentId('guest');
    sessionStorage.removeItem('cokito_teacher_auth');
    setIsTeacherAuthenticated(false);
  };

  // Find active student or null if guest
  const currentStudent = currentStudentId === 'guest'
    ? null
    : students.find(s => s.id === currentStudentId) || null;

  // Registration Callback (Saves to Cloud Firestore + LocalStorage!)
  const handleRegisterComplete = async (newStudent: Student, bookedSlotIds: string[]) => {
    await saveStudent(newStudent);
    setCurrentStudentId(newStudent.id);

    if (newStudent.isKid) {
      setAudienceTheme('kids');
    }

    if (bookedSlotIds.length > 0) {
      const updatedSlots = slots.map(slot => {
        if (bookedSlotIds.includes(slot.id)) {
          return {
            ...slot,
            status: 'booked' as const,
            studentId: newStudent.id,
            studentName: `${newStudent.name} ${newStudent.lastName || ''}`.trim(),
            levelId: newStudent.levelId,
            meetLink: 'https://meet.google.com/eng-class'
          };
        }
        return slot;
      });
      setSlots(updatedSlots);
      await saveSlots(updatedSlots);
    }
  };

  const handleUpdateSlots = async (updatedSlots: ScheduleSlot[]) => {
    setSlots(updatedSlots);
    await saveSlots(updatedSlots);
  };

  const handleApplyCoupon = async (redeemedStudent: Student) => {
    await saveStudent(redeemedStudent);
    setCurrentStudentId(redeemedStudent.id);
    setActiveTab('pathway');
  };

  const handleFreeSlot = async (slotId: string) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: 'available' as const,
          studentId: undefined,
          studentName: undefined,
          levelId: undefined,
          meetLink: undefined
        };
      }
      return slot;
    });
    setSlots(updatedSlots);
    await saveSlots(updatedSlots);
  };

  const handleAwardXp = async (studentId: string, amount: number) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;
    const updated: Student = {
      ...target,
      xp: target.xp + amount,
      streak: target.streak + 1
    };
    await saveStudent(updated);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    await saveStudent(updatedStudent);

    // Also update slots if assigned
    if (updatedStudent.assignedSlots && updatedStudent.assignedSlots.length > 0) {
      const updatedSlots = slots.map(slot => {
        const slotTag = `${slot.day}-${slot.startTime}`;
        if (updatedStudent.assignedSlots.includes(slotTag)) {
          return {
            ...slot,
            status: 'booked' as const,
            studentId: updatedStudent.id,
            studentName: `${updatedStudent.name} ${updatedStudent.lastName || ''}`.trim(),
            levelId: updatedStudent.levelId,
            meetLink: 'https://meet.google.com/eng-cokito-class'
          };
        }
        return slot;
      });
      setSlots(updatedSlots);
      await saveSlots(updatedSlots);
    }
  };

  const handlePaymentSuccess = async (method: string, reference: string) => {
    // If student exists, upgrade them to enrolled with digital pass
    if (currentStudent && currentStudent.id !== 'guest') {
      const updated: Student = {
        ...currentStudent,
        status: 'enrolled',
        plan: 'basic',
        xp: (currentStudent.xp || 0) + 200,
        notes: `${currentStudent.notes || ''} | Pase Digital $5 activado vía ${method} (Ref: ${reference})`
      };
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
      await saveStudent(updated);
    } else {
      const newStudentId = `student_${Date.now()}`;
      const newStudent: Student = {
        id: newStudentId,
        name: user?.displayName || 'Alumno Cokitö',
        lastName: '',
        email: user?.email || 'alumno@cokito.com',
        phone: '',
        age: 25,
        isKid: false,
        schoolOrProfession: 'Estudiante Digital',
        learningGoal: 'Aprender inglés a mi propio ritmo',
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/micah/svg?seed=PaseDigital`,
        plan: 'basic',
        modality: 'online',
        groupSize: 'individual',
        preferredTimeSlot: 'Autónomo Asincrónico',
        status: 'enrolled',
        levelId: 'level_1',
        placementTestScore: 25,
        placementTestDiagnosis: 'Pase Digital $5 Activado',
        placementTestDate: new Date().toISOString().split('T')[0],
        registeredAt: new Date().toISOString().split('T')[0],
        currentUnit: 1,
        completedHours: 0,
        xp: 300,
        streak: 1,
        league: 'Bronce',
        rating: { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 },
        notes: `Pase Digital $5 activado vía ${method} (Ref: ${reference})`,
        assignedSlots: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentStudentId(newStudent.id);
      await saveStudent(newStudent);
    }
    setIsPaymentModalOpen(false);
    setActiveTab('pathway');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      audienceTheme === 'kids' ? 'bg-sky-50/50 text-slate-800' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Header
        user={user}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onTeacherLogout={() => {
          setIsTeacherAuthenticated(false);
          sessionStorage.removeItem('cokito_teacher_auth');
          setActiveTab('landing');
        }}
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenCouponModal={() => setIsCouponOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        currentStudentXp={currentStudent?.xp || 0}
        currentStudentStreak={currentStudent?.streak || 0}
        currentStudent={currentStudent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allStudents={students}
        onSelectStudent={setCurrentStudentId}
      />

      {/* Main Content (with bottom padding on mobile for the floating bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        
        {/* TAB 1: LANDING PAGE (Initial Welcome Page) */}
        {activeTab === 'landing' && (
          <LandingHero
            audienceTheme={audienceTheme}
            onStartRegistration={() => setActiveTab('register')}
            onExploreCalendar={() => setActiveTab('calendar')}
            onExploreGamification={() => setActiveTab('duolingo')}
            onOpenOptimizer={() => setIsOptimizerOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* TAB 2: REGISTRATION & PLACEMENT TEST FLOW */}
        {activeTab === 'register' && (
          <RegistrationFlow
            slots={slots}
            onRegisterComplete={handleRegisterComplete}
            onExploreCalendar={() => setActiveTab('calendar')}
            audienceTheme={audienceTheme}
          />
        )}

        {/* TAB 3: CONFIDENTIAL SHARED CALENDAR */}
        {activeTab === 'calendar' && (
          <CalendarView
            slots={slots}
            students={students}
            currentStudent={currentStudent}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
            onFreeSlot={handleFreeSlot}
            onOpenRegister={() => setActiveTab('register')}
          />
        )}

        {/* TAB 4: RETOS COKITÖ & TABLA DE LIGA */}
        {activeTab === 'duolingo' && (
          <GamificationHub
            currentStudent={currentStudent}
            students={students}
            onAwardXp={handleAwardXp}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
          />
        )}

        {/* TAB 5: AULA VIRTUAL & RUTA DE APRENDIZAJE */}
        {activeTab === 'pathway' && (
          <LearningPathway
            currentStudent={currentStudent}
            activeRole={isTeacherAuthenticated ? 'teacher' : 'student'}
            audienceTheme={audienceTheme}
            onOpenRegister={() => setActiveTab('register')}
            onOpenPlacementTest={() => setIsPlacementQuizOpen(true)}
            onOpenCouponModal={() => setIsCouponOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onAwardXp={handleAwardXp}
          />
        )}

        {/* TAB 6: TEACHER COKITÖ DASHBOARD (Protected Gate) */}
        {activeTab === 'teacher' && (
          isTeacherAuthenticated ? (
            <TeacherDashboard
              students={students}
              slots={slots}
              onUpdateStudent={handleUpdateStudent}
              onUpdateSlots={handleUpdateSlots}
              onOpenOptimizer={() => setIsOptimizerOpen(true)}
              onLogoutTeacher={() => {
                setIsTeacherAuthenticated(false);
                sessionStorage.removeItem('cokito_teacher_auth');
                setActiveTab('landing');
              }}
            />
          ) : (
            <TeacherGate
              user={user}
              onLoginWithGoogle={handleLogin}
              isLoggingIn={isLoggingIn}
              onAuthenticated={() => {
                setIsTeacherAuthenticated(true);
                sessionStorage.setItem('cokito_teacher_auth', 'true');
              }}
              onBackToStudent={() => setActiveTab('landing')}
            />
          )
        )}

      </main>

      {/* Student Profile Modal for comfortable mobile & tablet access */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        student={currentStudent}
        user={user}
        onLogin={handleLogin}
        onCredentialsLogin={handleCredentialsLogin}
        isLoggingIn={isLoggingIn}
        onLogout={handleLogout}
        onOpenCoupon={() => setIsCouponOpen(true)}
        onOpenPlacementTest={() => setIsPlacementQuizOpen(true)}
        onOpenRegister={() => {
          setIsProfileOpen(false);
          setActiveTab('register');
        }}
        onOpenPaymentModal={() => {
          setIsProfileOpen(false);
          setIsPaymentModalOpen(true);
        }}
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
      />

      {/* Payment / Checkout Modal for $5 Pase Digital */}
      <PaymentCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Coupon / Beca Modal */}
      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Standalone Placement Quiz Modal */}
      <PlacementQuizModal
        isOpen={isPlacementQuizOpen}
        studentName="Aspirante"
        onClose={() => setIsPlacementQuizOpen(false)}
        onFinishTest={() => {
          setIsPlacementQuizOpen(false);
          setActiveTab('register');
        }}
      />

      {/* Pedagogical Optimizer Modal */}
      <ScheduleOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 La Teacher Cokitö • Programa Curricular Internacional de Inmersión y Fluidez</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Privacidad y Confidencialidad Garantizada
            </span>
            <span>•</span>
            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="text-blue-700 hover:underline font-bold"
            >
              Análisis Pedagógico de Tiempos
            </button>
          </div>
        </div>
      </footer>

      {/* Cyber Owl Gemini AI Chatbot with WhatsApp Bridge */}
      <CyberOwlChatbot 
        studentName={currentStudent?.name}
        teacherWhatsAppUsername="CokitoVZLA"
      />

    </div>
  );
}
