import { Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teacher_cokito',
    name: 'Coquito',
    lastName: 'Sandoval (La Teacher)',
    email: 'anateresa.csb@gmail.com',
    phone: '+58 414 1234567',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Fundamentos Pedagógicos, Super Goal 1–3 y Kids',
    levelsAssigned: ['level_1', 'level_2', 'level_3', 'level_4'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '06:00 - 12:00 / 15:00 - 19:00',
    status: 'active',
    hourlyRate: 15,
    bio: 'Fundadora pedagógica de La Teacher Cokitö. Especialista en fonética lúdica, eliminación de miedo al hablar y speaking interactivo.'
  },
  {
    id: 'teacher_marcos',
    name: 'Marcos',
    lastName: 'Villalobos',
    email: 'marcos.villalobos@cokito.com',
    phone: '+58 424 9876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialty: 'Conversacional Intermedio, Super Goal 4–6 y Teens',
    levelsAssigned: ['level_4', 'level_5', 'level_6'],
    assignedDays: ['Lunes', 'Miércoles', 'Viernes'],
    workingHours: '14:00 - 20:00 (Tardes y Noches)',
    status: 'active',
    hourlyRate: 12,
    bio: 'Coach de debate juvenil y fluidez en tiempo real. Certificación TEFL y dinámicas de grupo.'
  },
  {
    id: 'teacher_elena',
    name: 'Elena',
    lastName: 'Rondón',
    email: 'elena.rondon@cokito.com',
    phone: '+58 412 5556789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Inglés Avanzado, Mega Goal 1–6 y TOEFL/IELTS',
    levelsAssigned: ['level_7', 'level_8', 'level_9', 'level_10', 'level_11', 'level_12'],
    assignedDays: ['Martes', 'Jueves', 'Sábado'],
    workingHours: '08:00 - 14:00 (Mañanas)',
    status: 'active',
    hourlyRate: 18,
    bio: 'Preparadora de certificaciones internacionales de inglés profesional y ensayos académicos universitarios.'
  },
  {
    id: 'teacher_david',
    name: 'David',
    lastName: 'Pérez',
    email: 'david.perez@cokito.com',
    phone: '+58 416 3334455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialty: 'Auxiliar Institucional CSB Preschool & Primeros Pasos',
    levelsAssigned: ['level_1'],
    assignedDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    workingHours: '15:00 - 18:00 (Turno Colegio CSB)',
    status: 'active',
    hourlyRate: 10,
    bio: 'Docente auxiliar enfocado en fonética para niños y apoyo al convenio institucional con el Colegio Simón Bolívar.'
  }
];
