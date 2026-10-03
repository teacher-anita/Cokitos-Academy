import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Student, ScheduleSlot } from '../types';
import { INITIAL_STUDENTS, INITIAL_SCHEDULE_SLOTS } from '../data/curriculumData';

const STORAGE_KEYS = {
  STUDENTS: 'cokito_students_data_v2',
  SLOTS: 'cokito_slots_data_v2'
};

// 1. SAVE STUDENT (Local + Firestore Cloud)
export async function saveStudent(student: Student): Promise<void> {
  // Always save locally first for instant offline response
  try {
    const local = getLocalStudents();
    const filtered = local.filter(s => s.id !== student.id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([student, ...filtered]));
  } catch {}

  // Persist directly to Firestore Cloud
  try {
    const path = `students/${student.id}`;
    const docRef = doc(db, 'students', student.id);
    await setDoc(docRef, student, { merge: true });
    console.log('✅ Student persisted to Firestore Cloud:', student.name);
  } catch (e) {
    console.warn('Firestore cloud save note:', e);
  }
}

// 2. GET STUDENTS LOCAL FALLBACK
export function getLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

// 3. SUBSCRIBE TO STUDENTS IN REALTIME FROM FIRESTORE
export function subscribeToStudents(callback: (students: Student[]) => void): () => void {
  // Initialize immediately with local data
  callback(getLocalStudents());

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(
      studentsCol, 
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudStudents: Student[] = [];
          snapshot.forEach((d) => cloudStudents.push(d.data() as Student));
          callback(cloudStudents);
          try {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cloudStudents));
          } catch {}
        } else {
          // Seed cloud if empty
          for (const s of INITIAL_STUDENTS) {
            setDoc(doc(db, 'students', s.id), s).catch(() => null);
          }
        }
      }, 
      (error) => {
        console.warn('Firestore real-time subscription note:', error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup Firestore onSnapshot:', err);
    return () => {};
  }
}

// 4. SAVE SCHEDULE SLOTS (Local + Cloud)
export async function saveSlots(slots: ScheduleSlot[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  } catch {}

  try {
    for (const slot of slots) {
      const docRef = doc(db, 'slots', slot.id);
      await setDoc(docRef, slot, { merge: true });
    }
  } catch (e) {
    console.warn('Could not sync slots to Firestore cloud:', e);
  }
}

// 5. GET SCHEDULE SLOTS LOCAL
export function getLocalSlots(): ScheduleSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return raw ? JSON.parse(raw) : INITIAL_SCHEDULE_SLOTS;
  } catch {
    return INITIAL_SCHEDULE_SLOTS;
  }
}
