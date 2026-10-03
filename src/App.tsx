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
import { ClassroomHub } from './components/ClassroomHub';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ScheduleOptimizerModal } from './components/ScheduleOptimizerModal';
import { Student, ScheduleSlot, AudienceTheme } from './types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from './data/curriculumData';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Theme State
  const [activeRole, setActiveRole] = useState<'student' | 'teacher'>('student');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [audienceTheme, setAudienceTheme] = useState<AudienceTheme>('adults');
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Persistent LocalStorage State
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('cokito_students_data_v2');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [slots, setSlots] = useState<ScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem('cokito_slots_data_v2');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_SLOTS;
    } catch {
      return INITIAL_SCHEDULE_SLOTS;
    }
  });

  // Current active student
  const [currentStudentId, setCurrentStudentId] = useState<string>('student_mariana');

  useEffect(() => {
    try {
      localStorage.setItem('cokito_students_data_v2', JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('cokito_slots_data_v2', JSON.stringify(slots));
    } catch {}
  }, [slots]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => setUser(currentUser),
      () => setUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

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

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // Find active student
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0] || null;

  // Registration Callback (Saved in state and localStorage!)
  const handleRegisterComplete = (newStudent: Student, bookedSlotIds: string[]) => {
    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);

    // If student is kid, adapt audience theme automatically
    if (newStudent.isKid) {
      setAudienceTheme('kids');
    }

    // Reserve slots
    if (bookedSlotIds.length > 0) {
      setSlots(prev =>
        prev.map(slot => {
          if (bookedSlotIds.includes(slot.id)) {
            return {
              ...slot,
              status: 'booked',
              studentId: newStudent.id,
              studentName: `${newStudent.name} ${newStudent.lastName || ''}`.trim(),
              levelId: newStudent.levelId,
              meetLink: 'https://meet.google.com/eng-class'
            };
          }
          return slot;
        })
      );
    }
  };

  const handleFreeSlot = (slotId: string) => {
    setSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: 'available',
            studentId: undefined,
            studentName: undefined,
            levelId: undefined,
            meetLink: undefined
          };
        }
        return slot;
      })
    );
  };

  const handleAwardXp = (studentId: string, amount: number) => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id === studentId) {
          return {
            ...st,
            xp: st.xp + amount,
            streak: st.streak + 1
          };
        }
        return st;
      })
    );
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(st => (st.id === updatedStudent.id ? updatedStudent : st))
    );

    // Also update slots if level or slots changed
    if (updatedStudent.assignedSlots && updatedStudent.assignedSlots.length > 0) {
      setSlots(prev =>
        prev.map(slot => {
          const slotTag = `${slot.day}-${slot.startTime}`;
          if (updatedStudent.assignedSlots.includes(slotTag)) {
            return {
              ...slot,
              status: 'booked',
              studentId: updatedStudent.id,
              studentName: `${updatedStudent.name} ${updatedStudent.lastName || ''}`.trim(),
              levelId: updatedStudent.levelId,
              meetLink: 'https://meet.google.com/eng-cokito-class'
            };
          }
          return slot;
        })
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      audienceTheme === 'kids' ? 'bg-sky-50/50 text-slate-800' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Header
        user={user}
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          if (role === 'teacher' && activeTab === 'landing') {
            setActiveTab('teacher');
          }
        }}
        audienceTheme={audienceTheme}
        onAudienceChange={setAudienceTheme}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        currentStudentXp={currentStudent?.xp || 0}
        currentStudentStreak={currentStudent?.streak || 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: LANDING PAGE (Initial Welcome Page) */}
        {activeTab === 'landing' && (
          <LandingHero
            audienceTheme={audienceTheme}
            onStartRegistration={() => setActiveTab('register')}
            onExploreCalendar={() => setActiveTab('calendar')}
            onExploreGamification={() => setActiveTab('duolingo')}
            onOpenOptimizer={() => setIsOptimizerOpen(true)}
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
            activeRole={activeRole}
            audienceTheme={audienceTheme}
            onFreeSlot={handleFreeSlot}
            onOpenRegister={() => setActiveTab('register')}
          />
        )}

        {/* TAB 4: DUOLINGO GAMIFICATION & LEADERBOARD */}
        {activeTab === 'duolingo' && (
          <GamificationHub
            currentStudent={currentStudent}
            students={students}
            onAwardXp={handleAwardXp}
            activeRole={activeRole}
            audienceTheme={audienceTheme}
          />
        )}

        {/* TAB 5: GOOGLE CLASSROOM MATERIALS */}
        {activeTab === 'classroom' && (
          <ClassroomHub
            activeRole={activeRole}
          />
        )}

        {/* TAB 6: TEACHER COKITO DASHBOARD (Placement Evaluator & Student Progress) */}
        {activeTab === 'teacher' && (
          <TeacherDashboard
            students={students}
            onUpdateStudent={handleUpdateStudent}
            onOpenOptimizer={() => setIsOptimizerOpen(true)}
          />
        )}

      </main>

      {/* Pedagogical Optimizer Modal */}
      <ScheduleOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 La Teacher Cokito • Programa Académico Oficial McGraw-Hill</p>
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

    </div>
  );
}
