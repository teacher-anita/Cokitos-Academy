export interface PathwaySession {
  sessionCode: 'A' | 'B' | 'C';
  sessionName: string;
  itemsRange: string;
  items: {
    number: number;
    title: string;
    description: string;
    audioTrack?: string;
  }[];
  workbookPages?: string;
  practiceInteractive?: string;
}

export interface UnitQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PathwayUnit {
  unitNumber: number;
  title: string;
  bookTitle: string;
  sbPages: string;
  wbPages: string;
  grammarFocus: string;
  vocabularyTheme: string;
  sessions: PathwaySession[];
  quizQuestions: UnitQuizQuestion[];
  googleFormUrl?: string;
  tipCokito: string;
}

export interface PathwayLevel {
  levelId: string;
  levelNumber: number;
  levelName: string;
  series: 'SuperGoal' | 'MegaGoal';
  book: string;
  module: number;
  moduleName: string;
  cefrEquiv: string;
  audience: 'kids' | 'adults' | 'all';
  isIntegratedWorkbook: boolean;
  units: PathwayUnit[];
  bossFights: {
    id: string;
    afterUnit: number;
    title: string;
    badgeName: string;
    badgeIcon: string;
    description: string;
    googleFormUrl?: string;
  }[];
}

export const PATHWAY_LEVELS: PathwayLevel[] = [
  // 1. NIVEL I: SuperGoal 1
  {
    levelId: 'level_1',
    levelNumber: 1,
    levelName: 'Nivel I (SuperGoal 1)',
    series: 'SuperGoal',
    book: 'Super Goal 1 (Student Book & Workbook Integrado)',
    module: 1,
    moduleName: 'Pierde el Miedo',
    cefrEquiv: 'A1',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Global Novice 🌍',
        badgeIcon: '🏅',
        description: 'Language Review integral de las primeras 4 unidades + Chant Along + Reto de consolidación de saludos, números, objetos y países.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-1/viewform'
      },
      {
        id: 'boss_m1_2',
        afterUnit: 8,
        title: 'EXPANSION Units 5–8: Boss Fight Final',
        badgeName: 'Master Beginner 🏆',
        badgeIcon: '🎓',
        description: 'Certificación oficial de cierre de Nivel I (SuperGoal 1). Desbloqueo del Nivel II.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-bossfight-2/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Good Morning!',
        bookTitle: 'SuperGoal 1',
        sbPages: 'Págs. 2 a 9',
        wbPages: 'Págs. 89 a 92 (Sección final del libro)',
        grammarFocus: 'Verb Be (Singular & Plural) • Possessive Adjectives (my, your, his, her)',
        vocabularyTheme: 'Greetings, Farewells, Titles (Mr., Mrs., Miss, Ms.), Introductions & School Supplies',
        tipCokito: 'Recuerda que no memorizamos listas de palabras: ¡asociamos sonidos e imágenes a situaciones cotidianas!',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg1/viewform',
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Sesión A: Vocabulario y Gramática Esencial',
            itemsRange: 'Ítems 1 a 4',
            items: [
              { number: 1, title: 'Listen and Discuss', description: 'Greetings & Farewells a distintas horas (7:00 am, 1:00 pm, 7:00 pm, 8:00 pm).', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work', description: 'Presentaciones personales (Hi, I am... Nice to meet you).', audioTrack: 'CD 1 • Track 3' },
              { number: 3, title: 'Grammar Focus', description: 'Verb Be (I am, You are, He is, She is) y adjetivos posesivos (my, your, his, her).', audioTrack: undefined },
              { number: 4, title: 'Language in Context', description: 'Títulos de cortesía (Mr., Mrs., Miss, Ms.) y saludos formales vs informales.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Sesión B: Audio, Pronunciación y Conversación',
            itemsRange: 'Ítems 5 a 8',
            items: [
              { number: 5, title: 'Listening', description: 'Deletreo de nombres, correos y números telefónicos.', audioTrack: 'CD 1 • Track 4' },
              { number: 6, title: 'Pronunciation', description: 'Entonación ascendente y descendente en preguntas y saludos.', audioTrack: 'CD 1 • Track 5' },
              { number: 7, title: 'About You', description: 'Formulario personal (First name, Last name, How old are you?).' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Diálogo con Carlos Rodriguez y Rick Morgan en el aeropuerto.', audioTrack: 'CD 1 • Track 6' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Sesión C: Lectura, Proyecto y Workbook',
            itemsRange: 'Ítems 9 a 11 + Desbloqueo del Workbook',
            workbookPages: 'Págs. 89 a 92 (Ejercicios A, B, C, D, E, F y Crucigrama G)',
            items: [
              { number: 9, title: 'Reading: A New Student!', description: 'Lectura comprensiva sobre la llegada de Ali y Ahmed a la escuela.', audioTrack: 'CD 1 • Track 7' },
              { number: 10, title: 'Writing & Writing Corner', description: 'Mayúsculas en oraciones, nombres propios y signos de interrogación.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Útiles escolares (pen, pencil, eraser, scissors, notebook, crayon).' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: '¿Qué saludo es el más apropiado para las 7:30 PM en un ambiente formal?',
            options: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
            correctIndex: 2,
            explanation: '"Good evening" es el saludo al llegar en la noche. "Good night" se usa únicamente para despedirse antes de dormir.'
          },
          {
            id: 2,
            question: 'Completa: "This is my friend. _____ name is Carlos."',
            options: ['Her', 'His', 'Your', 'Their'],
            correctIndex: 1,
            explanation: 'Para un varón en singular (Carlos), el adjetivo posesivo correcto es "His".'
          },
          {
            id: 3,
            question: 'Selecciona la forma correcta del verbo Be: "We _____ students in Teacher Cokito\'s academy."',
            options: ['am', 'is', 'are', 'be'],
            correctIndex: 2,
            explanation: 'El pronombre "We" (nosotros) se conjuga con "are".'
          },
          {
            id: 4,
            question: 'En la sección de School Supplies, ¿para qué se utiliza "an eraser"?',
            options: ['To cut paper', 'To erase pencil marks', 'To paint colors', 'To write in the notebook'],
            correctIndex: 1,
            explanation: '"Eraser" significa borrador y se utiliza para borrar trazos de lápiz.'
          },
          {
            id: 5,
            question: 'En la lectura "A New Student!", ¿de qué ciudad viene Ahmed?',
            options: ['Riyadh', 'Dammam', 'Abha', 'Jeddah'],
            correctIndex: 2,
            explanation: 'Ahmed menciona explícitamente: "I am from Abha".'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'What Day Is Today?',
        bookTitle: 'SuperGoal 1',
        sbPages: 'Págs. 10 a 17',
        wbPages: 'Págs. 93 a 96 (Workbook Integrado)',
        grammarFocus: 'Possessive \'s • Question Words (What, When, How old) • Prepositions of Time (in, on with dates)',
        vocabularyTheme: 'Days of the week, Months of the year, Numbers 1-100, Ordinal numbers (1st to 100th)',
        tipCokito: 'Para días de la semana y fechas exactas usa ON (on Monday, on May 4th). Para meses solos usa IN (in May).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit2-sg1/viewform',
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Sesión A: Días, Meses y Números',
            itemsRange: 'Ítems 1 a 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Calendar', description: 'Days of the week (Sunday to Saturday) y Months (January to December).', audioTrack: 'CD 1 • Track 8' },
              { number: 2, title: 'Pair Work: Dates & Ages', description: 'Preguntar y responder cumpleaños y edades (How old are you?).' },
              { number: 3, title: 'Grammar: In & On with Dates', description: 'Reglas de "in" para meses y años, "on" para días específicos y fechas.' },
              { number: 4, title: 'Numbers & Ordinals', description: 'Diferencia entre números cardinales (one, two) y ordinales (first, second, third).' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Sesión B: Pronunciación de Ordinales y Conversación',
            itemsRange: 'Ítems 5 a 8',
            items: [
              { number: 5, title: 'Listening for Dates', description: 'Identificación de días y fechas en conversaciones grabadas.', audioTrack: 'CD 1 • Track 9' },
              { number: 6, title: 'Pronunciation /θ/', description: 'El sonido interdental /θ/ en "fourth, fifth, tenth, twentieth".' },
              { number: 7, title: 'About You Form', description: 'Completar tu Information Form con fecha de nacimiento y amigos.' },
              { number: 8, title: 'Conversation: Special Holidays', description: 'Invitación a eventos y días feriados nacionales.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Sesión C: Redacción, Proyecto y Workbook',
            itemsRange: 'Ítems 9 a 11 + Desbloqueo del Workbook',
            workbookPages: 'Págs. 93 a 96',
            items: [
              { number: 9, title: 'Reading: School Clubs & Schedules', description: 'Horarios de clases y asignaturas escolares.' },
              { number: 10, title: 'Writing: Party Invitation', description: 'Redacción de una tarjeta de invitación a cumpleaños.' },
              { number: 11, title: 'Project: Birthday Calendar', description: 'Creación del mural de cumpleaños del salón.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: '¿Cuál preposición es la correcta? "Our final English exam is _____ Monday."',
            options: ['in', 'at', 'on', 'to'],
            correctIndex: 2,
            explanation: 'Con días de la semana siempre se utiliza la preposición "ON".'
          },
          {
            id: 2,
            question: '¿Cómo se escribe en palabras el número ordinal 12th?',
            options: ['twelfth', 'twelveth', 'twelth', 'twenty'],
            correctIndex: 0,
            explanation: 'La regla ortográfica cambia la "v" por "f": twelfth.'
          },
          {
            id: 3,
            question: 'Completa: "My mother\'s birthday is _____ September."',
            options: ['on', 'in', 'at', 'from'],
            correctIndex: 1,
            explanation: 'Cuando se menciona solo el mes sin día específico, se utiliza "IN".'
          },
          {
            id: 4,
            question: 'Si hoy es miércoles (Wednesday), ¿qué día fue anteayer?',
            options: ['Thursday', 'Friday', 'Monday', 'Tuesday'],
            correctIndex: 2,
            explanation: 'El día antes de ayer (dos días atrás de miércoles) es Monday (lunes).'
          },
          {
            id: 5,
            question: '¿Qué pregunta se usa para consultar la edad de alguien?',
            options: ['How are you?', 'How old are you?', 'What is your day?', 'When are you?'],
            correctIndex: 1,
            explanation: '"How old are you?" es la fórmula en inglés para preguntar la edad.'
          }
        ]
      }
    ]
  },

  // 2. NIVEL II: SuperGoal 2
  {
    levelId: 'level_2',
    levelNumber: 2,
    levelName: 'Nivel II (SuperGoal 2)',
    series: 'SuperGoal',
    book: 'Super Goal 2 (Student Book & Workbook Integrado)',
    module: 1,
    moduleName: 'Pierde el Miedo',
    cefrEquiv: 'A2',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_sg2_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Career Pioneer 🛠️',
        badgeIcon: '🚀',
        description: 'Consolidación de rutinas, profesiones, adjetivos y habilidades con Can/Can\'t.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-sg2-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'What Do You Do?',
        bookTitle: 'SuperGoal 2',
        sbPages: 'Págs. 2 a 9',
        wbPages: 'Págs. 89 a 92 (Sección final del libro)',
        grammarFocus: 'Simple Present Tense (Affirmative & Negative) • Third person singular endings (-s, -es) • Questions with What',
        vocabularyTheme: 'Occupations: doctor, teacher, pilot, chef, mechanic, reporter, architect, flight attendant',
        tipCokito: '¡Ojo con la tercera persona! He/She agrega una -s al verbo (He works, She teaches).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg2/viewform',
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Sesión A: Profesiones y Presente Simple',
            itemsRange: 'Ítems 1 a 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Dream Jobs', description: 'Adnan (high-tech designer) y Majid (tennis player). Diálogo ilustrado.', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work', description: 'Preguntar y responder sobre profesiones (What does Majid do? He is a student).', audioTrack: 'CD 1 • Track 3' },
              { number: 3, title: 'Grammar: Simple Present', description: 'He works, She cooks, They work. Preguntas con What do you do / What does he do?', audioTrack: undefined },
              { number: 4, title: 'Language in Context', description: 'Lugares de trabajo: in a hospital, for an airline, in an office.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Sesión B: Pronunciación /s/ vs /z/ y Conversación',
            itemsRange: 'Ítems 5 a 8',
            items: [
              { number: 5, title: 'Listening: Job Identification', description: 'Escuchar a 4 personas y emparejarlas con su lugar de trabajo.', audioTrack: 'CD 1 • Track 4' },
              { number: 6, title: 'Pronunciation /s/ vs /z/', description: 'Diferencia en las terminaciones verbales: writes /s/ vs drives /z/.', audioTrack: 'CD 1 • Track 5' },
              { number: 7, title: 'About You: Career Dreams', description: '¿Qué deseas ser en el futuro y por qué?' },
              { number: 8, title: 'Conversation: Future Plans', description: 'Steve y Adel conversando en la banca sobre diseño web y arquitectura.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Sesión C: Lectura "Follow Your Dream" y Workbook',
            itemsRange: 'Ítems 9 a 11 + Desbloqueo del Workbook',
            workbookPages: 'Págs. 89 a 92',
            items: [
              { number: 9, title: 'Reading: Follow Your Dream', description: 'La historia de Omar Hamdan y su sueño de ser futbolista profesional.', audioTrack: 'CD 1 • Track 6' },
              { number: 10, title: 'Writing: Dream Job Essay', description: 'Uso de "because" para dar razones y "so" para consecuencias.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Preguntas con Why y respuestas con Because.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: '¿Qué significa la pregunta cotidiana "What do you do?" en inglés?',
            options: ['¿Qué estás haciendo ahora mismo?', '¿A qué te dedicas / Cuál es tu trabajo?', '¿Qué quieres hacer mañana?', '¿Cómo te sientes?'],
            correctIndex: 1,
            explanation: '"What do you do?" es el modismo estándar para preguntar la profesión u ocupación.'
          },
          {
            id: 2,
            question: 'Completa con la tercera persona singular: "Fahd is a pilot. He _____ planes for an airline."',
            options: ['fly', 'flys', 'flies', 'flying'],
            correctIndex: 2,
            explanation: 'Los verbos que terminan en consonante + y cambian a -ies en tercera persona: fly -> flies.'
          },
          {
            id: 3,
            question: '¿Dónde trabaja un chef?',
            options: ['in a clinic', 'in an elegant restaurant', 'at the airport', 'in a garage'],
            correctIndex: 1,
            explanation: 'Un chef trabaja preparando comida en un restaurante o cocina profesional.'
          },
          {
            id: 4,
            question: 'Completa: "He wants to be a doctor _____ he likes to help sick people."',
            options: ['so', 'because', 'but', 'or'],
            correctIndex: 1,
            explanation: '"Because" se utiliza para dar la razón o causa.'
          },
          {
            id: 5,
            question: 'En la lectura, ¿cuántos años tiene Omar Hamdan y cuál es su pasión?',
            options: ['14 años y la tecnología', '16 años y el fútbol', '20 años y la medicina', '18 años y la arquitectura'],
            correctIndex: 1,
            explanation: 'El texto indica: "Omar Hamdan lives in Tabuk. He is sixteen years old, and he\'s on the school football team."'
          }
        ]
      }
    ]
  },

  // 3. NIVEL III: SuperGoal 3 (Nivel actual de Mariana)
  {
    levelId: 'level_3',
    levelNumber: 3,
    levelName: 'Nivel III (SuperGoal 3)',
    series: 'SuperGoal',
    book: 'Super Goal 3 (Student Book & Workbook Integrado)',
    module: 1,
    moduleName: 'Pierde el Miedo',
    cefrEquiv: 'A2+',
    audience: 'all',
    isIntegratedWorkbook: true,
    bossFights: [
      {
        id: 'boss_m1_sg3_1',
        afterUnit: 4,
        title: 'EXPANSION Units 1–4: Boss Fight 1',
        badgeName: 'Spelling & Grammar Ace ⚡',
        badgeIcon: '👑',
        description: 'Evaluación de consolidación de Simple Past vs Past Progressive y Comparativos.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-sg3-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Are You Here on Vacation?',
        bookTitle: 'SuperGoal 3',
        sbPages: 'Págs. 2 a 9',
        wbPages: 'Págs. 89 a 92',
        grammarFocus: 'Short Answers • Simple Present vs. Present Progressive • Travel vocabulary',
        vocabularyTheme: 'Airport, vacations, nationalities, hotel check-in',
        tipCokito: 'Distingue lo habitual de lo que pasa ahora: "I live in Caracas" (rutina) vs "I am traveling this week" (en progreso).',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-sg3/viewform',
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Sesión A: Vacaciones y Contrastes de Tiempos',
            itemsRange: 'Ítems 1 a 4',
            items: [
              { number: 1, title: 'Listen & Discuss: Vacation Spot', description: 'Diálogo de turistas en el hotel y aeropuerto.', audioTrack: 'CD 1 • Track 2' },
              { number: 2, title: 'Pair Work', description: 'Are you traveling for business or pleasure?' },
              { number: 3, title: 'Grammar Focus', description: 'Simple Present vs Present Progressive con expresiones temporales.' },
              { number: 4, title: 'Language in Context', description: 'Preguntas con "Are you here on vacation?"' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Sesión B: Pronunciación y Conversación en el Hotel',
            itemsRange: 'Ítems 5 a 8',
            items: [
              { number: 5, title: 'Listening', description: 'Identificación de motivos de viaje y destinos.', audioTrack: 'CD 1 • Track 3' },
              { number: 6, title: 'Pronunciation', description: 'Contracciones en respuestas cortas.' },
              { number: 7, title: 'About You', description: 'Tus últimas vacaciones y destinos soñados.' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Check-in en el mostrador del hotel.' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Sesión C: Lectura y Workbook',
            itemsRange: 'Ítems 9 a 11 + Workbook',
            workbookPages: 'Págs. 89 a 92',
            items: [
              { number: 9, title: 'Reading: Tourist Hotspots', description: 'Lectura sobre las atracciones más famosas del mundo.' },
              { number: 10, title: 'Writing: Travel Blog Post', description: 'Escribir una postal o post de blog de viaje.' },
              { number: 11, title: 'Workbook Unlocking', description: 'Resolución de ejercicios prácticos de la unidad 1.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: '¿Cuál oración describe una acción que está ocurriendo en este momento?',
            options: ['I live in Miami.', 'I am sitting at the airport right now.', 'I fly every summer.', 'I like vacations.'],
            correctIndex: 1,
            explanation: '"I am sitting... right now" utiliza el Present Progressive para una acción en el instante del habla.'
          },
          {
            id: 2,
            question: 'Completa: "Are you here on vacation?" — "Yes, _____."',
            options: ['I am', 'I do', 'I have', 'I was'],
            correctIndex: 0,
            explanation: 'A preguntas con el verbo Be ("Are you...?"), se responde afirmativamente "Yes, I am".'
          },
          {
            id: 3,
            question: 'En un hotel, ¿qué significa "check-in"?',
            options: ['Pagar la cuenta al irse', 'Registrarse a la llegada', 'Pedir comida a la habitación', 'Llamar al taxi'],
            correctIndex: 1,
            explanation: '"Check-in" es el proceso de registro formal a la llegada de un hotel o aeropuerto.'
          }
        ]
      }
    ]
  },

  // 4. NIVEL VII: MegaGoal 1 (Módulo 3)
  {
    levelId: 'level_7',
    levelNumber: 7,
    levelName: 'Nivel VII (MegaGoal 1)',
    series: 'MegaGoal',
    book: 'Mega Goal 1 (Student Book & Workbook por Separado)',
    module: 3,
    moduleName: 'Piensa en Inglés',
    cefrEquiv: 'B1+',
    audience: 'adults',
    isIntegratedWorkbook: false,
    bossFights: [
      {
        id: 'boss_m3_mg1_1',
        afterUnit: 3,
        title: 'EXPANSION Units 1–3: Boss Fight 1',
        badgeName: 'Visionary Thinker 🔮',
        badgeIcon: '💎',
        description: 'Debate de tecnología: The Computer and the Internet: Good or Bad? + Chant Along + Present Perfect Progressive.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-bossfight-mg1-1/viewform'
      }
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Big Changes',
        bookTitle: 'MegaGoal 1',
        sbPages: 'Págs. 6 a 19',
        wbPages: 'Págs. 1 a 10 (Libro de ejercicios separado)',
        grammarFocus: 'Simple Present vs. Present Progressive • Simple Past vs. Present Perfect • Past Progressive with When',
        vocabularyTheme: 'Historical milestones: Space Race, Communications Revolution, Global Issues',
        tipCokito: 'Usa Simple Past para eventos concluidos (en 1957) y Present Perfect para experiencias que continúan hoy.',
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-unit1-mg1/viewform',
        sessions: [
          {
            sessionCode: 'A',
            sessionName: 'Sesión A: Eventos Mundiales y Contrastes Temporales',
            itemsRange: 'Ítems 1 a 4',
            items: [
              { number: 1, title: 'Listen & Discuss: World Milestones', description: 'The Space Race (Sputnik 1 y Apollo 11), The Communications Revolution (Telstar).', audioTrack: 'CD 1 • Track 7' },
              { number: 2, title: 'Pair Work: Global Issues', description: 'Global warming, pollution, security, fresh water, unemployment.', audioTrack: 'CD 1 • Track 8' },
              { number: 3, title: 'Grammar: Past vs. Present Perfect', description: 'The Russians launched Sputnik in 1957 vs. Many countries have launched satellites.', audioTrack: undefined },
              { number: 4, title: 'Language in Context: Biographical Timeline', description: 'Entrevistar a tu compañero sobre sus orígenes y cómo ha cambiado su vida.' }
            ]
          },
          {
            sessionCode: 'B',
            sessionName: 'Sesión B: Ellis Island, Pronunciación y Real Talk',
            itemsRange: 'Ítems 5 a 8',
            items: [
              { number: 5, title: 'Listening: Immigrants at Ellis Island', description: 'La historia de los 12 millones de inmigrantes entre 1892 y 1954.', audioTrack: 'CD 1 • Track 9' },
              { number: 6, title: 'Pronunciation: Sentence Stress', description: 'Énfasis tonal en sustantivos y verbos principales.', audioTrack: 'CD 1 • Track 10' },
              { number: 7, title: 'About You: Inmigración y Familia', description: 'Preguntas sobre raíces familiares y viajes.' },
              { number: 8, title: 'Conversation & Real Talk', description: 'Samir y Hans en Berlín. Expresiones: in fact, you see, by the way, fit in.', audioTrack: 'CD 1 • Track 11' }
            ]
          },
          {
            sessionCode: 'C',
            sessionName: 'Sesión C: Saudi Vision 2030, Redacción y Self Reflection',
            itemsRange: 'Ítems 9 a 13 + Workbook',
            workbookPages: 'Workbook Págs. 1 a 10',
            items: [
              { number: 9, title: 'Reading: Progress Towards the Future', description: 'Transformación de infraestructuras y economía sostenible.', audioTrack: 'CD 1 • Track 12' },
              { number: 10, title: 'Writing: How the Internet Changed the World', description: 'Redacción de un ensayo comparando el pasado con el presente digital.' },
              { number: 11, title: 'Form, Meaning & Function', description: 'Past progressive con when (Hans was walking when he saw Samir).' },
              { number: 12, title: 'Self Reflection Checklist', description: 'Autoevaluación de competencias de la unidad 1.' }
            ]
          }
        ],
        quizQuestions: [
          {
            id: 1,
            question: '¿Qué tiempo verbal se utiliza para un hecho que ocurrió en una fecha específica y ya terminó (ej. en 1969)?',
            options: ['Present Perfect', 'Simple Past', 'Future Progressive', 'Present Continuous'],
            correctIndex: 1,
            explanation: 'Cuando el tiempo está especificado y concluido (en 1969), se utiliza Simple Past (The Americans landed on the moon in 1969).'
          },
          {
            id: 2,
            question: 'En la sección de Real Talk de la Unidad 1, ¿qué significa la frase "by the way"?',
            options: ['Por cierto / Cambiando de tema', 'En realidad / De hecho', 'Encajar en un grupo', 'Tener suerte'],
            correctIndex: 0,
            explanation: '"By the way" se utiliza para introducir un nuevo tema en la conversación (Por cierto...).'
          },
          {
            id: 3,
            question: 'Completa con la estructura de interrupción en pasado: "Hans _____ to college when he _____ Samir."',
            options: ['walked / was seeing', 'was walking / saw', 'is walking / sees', 'walked / saw'],
            correctIndex: 1,
            explanation: 'La acción larga en progreso va en Past Progressive (was walking) y la interrupción en Simple Past (saw).'
          }
        ]
      }
    ]
  }
];
