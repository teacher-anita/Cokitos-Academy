export type PlanIntensity = 'basic' | 'regular' | 'intensive' | 'super_intensive';
export type AudienceTheme = 'adults' | 'kids';
export type ClassModality = 'online' | 'presencial';
export type GroupSize = 'individual' | 'duo' | 'squad3' | 'crew4';

export interface PlanConfig {
  id: PlanIntensity;
  name: string;
  hoursPerWeek: number;
  description: string;
  badge: string;
  recommendedFor: string;
  recommendedFormat: string;
  prices: {
    individual: number; // 1 pax $/week
    duo: number;        // 2 pax total $/week
    squad3: number;     // 3 pax total $/week
    crew4: number;      // 4 pax total $/week
  };
}

export interface EnglishLevel {
  id: string; // e.g. 'level_1'
  levelName: string; // 'Level I'
  cefrEquiv: string; // 'Begginer I (A1)'
  book: string; // 'Super Goal 1'
  category: 'Super Goal' | 'Mega Goal';
  module: 1 | 2 | 3 | 4;
  moduleName: string;
  units: number;
  sections: number;
  expositions: number;
  hoursPerUnit: number;
  totalHours: number;
  durations: Record<PlanIntensity, { weeks: number; months: number }>;
}

export interface Student {
  id: string;
  name: string;
  lastName?: string;
  cedula?: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  age: number;
  isKid: boolean;
  schoolOrProfession: string; // school name if kid, job/profession if adult
  learningGoal: string; // work, travel, school, personal
  avatar: string;
  
  // Package & Registration
  plan: PlanIntensity;
  modality: ClassModality;
  groupSize: GroupSize;
  preferredTimeSlot: string; // "Mañanas", "Tardes", "Noches", "Sábados"
  
  // Level Assignment
  levelId?: string; // Assigned by Teacher Cokito!
  status: 'pending_evaluation' | 'enrolled' | 'completed';
  placementTestScore?: number; // 0-25
  placementTestDiagnosis?: string;
  placementTestDate?: string;
  
  registeredAt: string;
  currentUnit: number;
  completedHours: number;
  xp: number;
  streak: number;
  league: 'Bronce' | 'Plata' | 'Oro' | 'Diamante';
  rating: {
    fluency: number; // 1-5
    grammar: number;
    vocabulary: number;
    pronunciation: number;
  };
  notes: string;
  assignedSlots: string[]; // e.g. ['Lunes-16:00', 'Miercoles-16:00']
}

export interface ScheduleSlot {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  studentId?: string;
  studentName?: string;
  levelId?: string;
  meetLink?: string;
  status: 'available' | 'booked' | 'break';
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening';
  audience: 'all' | 'kids' | 'adults';
  xpReward: number;
  prompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ClassroomMaterial {
  id: string;
  levelId: string;
  levelTitle: string;
  unit: number;
  title: string;
  description: string;
  type: 'pdf' | 'audio' | 'video' | 'quiz' | 'slides';
  url: string;
  classroomCourseId?: string;
  updatedAt: string;
}

export interface PlacementQuestion {
  id: number;
  part: 1 | 2;
  partTitle: string;
  category: 'grammar' | 'reading' | 'fill_in';
  question: string;
  contextText?: string;
  options?: string[];
  correctAnswer: string; // option letter like "a" or exact word like "bring"
  explanation: string;
}
