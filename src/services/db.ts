import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';
import { Student, ScheduleSlot } from '../types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from '../data/curriculumData';

// Load config
let db: any = null;

try {
  // If applet config exists, initialize firestore
  const apps = getApps();
  if (apps.length > 0) {
    db = getFirestore(apps[0]);
  }
} catch (err) {
  console.warn('Firestore fallback to localStorage:', err);
}

const STORAGE_KEYS = {
  STUDENTS: 'cokito_students_data_v2',
  SLOTS: 'cokito_slots_data_v2'
};

// 1. SAVE STUDENT
export async function saveStudent(student: Student): Promise<void> {
  // Always save locally first for instant offline response
  try {
    const local = getLocalStudents();
    const filtered = local.filter(s => s.id !== student.id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([student, ...filtered]));
  } catch {}

  // If Cloud DB available, persist to Firestore
  if (db) {
    try {
      const docRef = doc(db, 'students', student.id);
      await setDoc(docRef, student, { merge: true });
    } catch (e) {
      console.warn('Could not sync student to Firestore cloud, kept in local storage:', e);
    }
  }
}

// 2. GET STUDENTS
export function getLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

// 3. SUBSCRIBE TO STUDENTS IN REALTIME
export function subscribeToStudents(callback: (students: Student[]) => void): () => void {
  // Initialize with local
  callback(getLocalStudents());

  if (!db) {
    return () => {};
  }

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(studentsCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudStudents: Student[] = [];
        snapshot.forEach((d) => cloudStudents.push(d.data() as Student));
        // Merge with initial if needed
        callback(cloudStudents);
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cloudStudents));
        } catch {}
      }
    }, (error) => {
      console.warn('Firestore subscription notice (using local):', error.message);
    });

    return unsubscribe;
  } catch (err) {
    return () => {};
  }
}

// 4. SAVE SCHEDULE SLOTS
export async function saveSlots(slots: ScheduleSlot[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  } catch {}

  if (db) {
    try {
      const docRef = doc(db, 'system', 'schedule_slots');
      await setDoc(docRef, { slots }, { merge: true });
    } catch (e) {
      console.warn('Could not sync slots to Firestore cloud:', e);
    }
  }
}

// 5. GET SCHEDULE SLOTS
export function getLocalSlots(): ScheduleSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return raw ? JSON.parse(raw) : INITIAL_SCHEDULE_SLOTS;
  } catch {
    return INITIAL_SCHEDULE_SLOTS;
  }
}
