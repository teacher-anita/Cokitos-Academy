import { TeacherAnnouncement, LoungeMessage, TeacherAttendanceLog } from '../types';

const ANNOUNCEMENTS_KEY = 'cokito_teacher_announcements';
const LOUNGE_MESSAGES_KEY = 'cokito_lounge_messages';
const ATTENDANCE_LOGS_KEY = 'cokito_attendance_logs';

const INITIAL_ANNOUNCEMENTS: TeacherAnnouncement[] = [
  {
    id: 'ann-1',
    title: '☕ ¡Bienvenidos a la Sala de Profesores & Staff Hub!',
    content: 'Estimado equipo docente: este espacio es para nosotros. Aquí coordinamos horarios, compartimos avances de alumnos, novedades pedagógicas de Super Goal y Mega Goal, y resolvemos dudas directas con la Dirección.',
    authorName: 'Directora Waky',
    authorRole: 'principal',
    priority: 'important',
    createdAt: 'Hoy, 08:30 AM'
  },
  {
    id: 'ann-2',
    title: '📌 Proceso de Validación de Alumnos Nuevos',
    content: 'Recuerden que ningún alumno entra a los salones de Google Meet sin previa confirmación de pago y cupo por parte de Dirección. Si ven un alumno en modo cortesía (24h) en sus listas, ayúdenlo a resolver dudas diagnósticas.',
    authorName: 'Directora Waky',
    authorRole: 'principal',
    priority: 'urgent',
    createdAt: 'Ayer, 04:15 PM'
  }
];

const INITIAL_MESSAGES: LoungeMessage[] = [
  {
    id: 'msg-1',
    authorId: 'principal-waky',
    authorName: 'Directora Waky',
    authorRole: 'principal',
    avatar: '👑',
    text: '¡Buenos días equipo! Dejé en la cartelera los lineamientos de las evaluaciones de diagnóstico. Un cafecito virtual para todos ☕✨',
    timestamp: '09:00 AM',
    reactions: { '☕': 5, '❤️': 3 }
  },
  {
    id: 'msg-2',
    authorId: 'teacher-cokito',
    authorName: 'Teacher Cokitö',
    authorRole: 'teacher',
    avatar: '👩‍🏫',
    text: '¡Recibido Directora! Los chicos de Super Goal 1 están fascinados con el módulo de pronunciación y el Cyber Owl.',
    timestamp: '09:12 AM',
    reactions: { '🦉': 4, '👏': 3 }
  },
  {
    id: 'msg-3',
    authorId: 'teacher-carlos',
    authorName: 'Teacher Carlos',
    authorRole: 'teacher',
    avatar: '👨‍🏫',
    text: 'Colegas, hoy tengo disponible el bloque de 5:00 a 6:00 pm por si algún grupo necesita refuerzo intensivo.',
    timestamp: '09:45 AM',
    reactions: { '👍': 2 }
  }
];

export const getTeacherAnnouncements = (): TeacherAnnouncement[] => {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ANNOUNCEMENTS;
};

export const saveTeacherAnnouncement = (ann: Omit<TeacherAnnouncement, 'id' | 'createdAt'>): TeacherAnnouncement => {
  const announcements = getTeacherAnnouncements();
  const newAnn: TeacherAnnouncement = {
    ...ann,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Hoy'
  };
  const updated = [newAnn, ...announcements];
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
  } catch {}
  return newAnn;
};

export const deleteTeacherAnnouncement = (id: string): void => {
  const announcements = getTeacherAnnouncements().filter(a => a.id !== id);
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
  } catch {}
};

export const getLoungeMessages = (): LoungeMessage[] => {
  try {
    const raw = localStorage.getItem(LOUNGE_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MESSAGES;
};

export const postLoungeMessage = (
  authorId: string,
  authorName: string,
  authorRole: 'principal' | 'teacher',
  avatar: string,
  text: string
): LoungeMessage => {
  const messages = getLoungeMessages();
  const newMsg: LoungeMessage = {
    id: `msg-${Date.now()}`,
    authorId,
    authorName,
    authorRole,
    avatar,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: {}
  };
  const updated = [...messages, newMsg];
  try {
    localStorage.setItem(LOUNGE_MESSAGES_KEY, JSON.stringify(updated));
  } catch {}
  return newMsg;
};

export const addLoungeReaction = (messageId: string, emoji: string): void => {
  const messages = getLoungeMessages();
  const msg = messages.find(m => m.id === messageId);
  if (msg) {
    if (!msg.reactions) msg.reactions = {};
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    try {
      localStorage.setItem(LOUNGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }
};

export const getAttendanceLogs = (): TeacherAttendanceLog[] => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveAttendanceLog = (log: Omit<TeacherAttendanceLog, 'id'>): TeacherAttendanceLog => {
  const logs = getAttendanceLogs();
  const newLog: TeacherAttendanceLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  const updated = [newLog, ...logs];
  try {
    localStorage.setItem(ATTENDANCE_LOGS_KEY, JSON.stringify(updated));
  } catch {}
  return newLog;
};
