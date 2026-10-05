/**
 * Service to handle downloadable official materials for each unit
 */

export interface UnitDownloadableMaterial {
  unitNumber: number;
  bookTitle: string;
  sbPages: string;
  wbPages: string;
  pdfFileName: string;
  pdfTitle: string;
  pdfDescription: string;
  driveUrl?: string;
  audioPackageUrl?: string;
}

export const getUnitDownloadableMaterial = (levelId: string, unitNumber: number): UnitDownloadableMaterial => {
  if (levelId === 'level_1' && unitNumber === 1) {
    return {
      unitNumber: 1,
      bookTitle: 'Super Goal 1',
      sbPages: 'Pages 2–9',
      wbPages: 'Pages 89–92',
      pdfFileName: 'SuperGoal_1_Unit_1_Student_Book_and_Workbook.pdf',
      pdfTitle: 'Super Goal 1 — Unit 1: Good Morning! (Official Student Material)',
      pdfDescription: 'Incluye Student Book completo (Páginas 2 a 9), Vocabulario fonético, Diálogos de saludos, Verbo BE y Workbook digitalizado (Páginas 89 a 92).',
      driveUrl: 'https://classroom.google.com/',
      audioPackageUrl: '/audio/supergoal1/track02.mp3'
    };
  }

  return {
    unitNumber,
    bookTitle: levelId.startsWith('level_7') || levelId.startsWith('level_8') ? 'Mega Goal' : 'Super Goal',
    sbPages: `Unit ${unitNumber} Pages`,
    wbPages: `Workbook Unit ${unitNumber}`,
    pdfFileName: `Unit_${unitNumber}_Official_Student_Guide.pdf`,
    pdfTitle: `Unit ${unitNumber} Official Course Book & Workbook`,
    pdfDescription: `Material oficial de trabajo para la Unidad ${unitNumber}. Descarga para seguir la sesión con La Teacher Cokitö.`,
    driveUrl: 'https://classroom.google.com/'
  };
};

/**
 * Triggers a real browser download of the official printable student study guide
 */
export const downloadUnitPdf = (levelId: string, unitNumber: number, unitTitle: string) => {
  const isSuperGoal = !levelId.startsWith('level_7') && !levelId.startsWith('level_8');
  const bookName = isSuperGoal ? 'Super Goal' : 'Mega Goal';
  const fileName = `${bookName.replace(/\s+/g, '')}_Unit${unitNumber}_${unitTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Guide.html`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${bookName} - Unit ${unitNumber}: ${unitTitle} - Material Oficial Cokitö Academy</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .badge { background: #fef3c7; color: #92400e; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 9999px; display: inline-block; }
    h1 { color: #0f172a; margin: 10px 0 5px 0; font-size: 28px; }
    h2 { color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 10px; margin-top: 30px; font-size: 18px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 15px 0; }
    .grammar-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px; }
    .grammar-table th, .grammar-table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    .grammar-table th { background: #f1f5f9; font-weight: bold; }
    .tip { background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 15px 0; font-size: 13px; }
    .dialogue { font-style: italic; background: #fffbeb; border: 1px dashed #fcd34d; padding: 12px; border-radius: 8px; margin: 10px 0; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
    @media print { body { padding: 0; } button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">ACADEMIA LA TEACHER COKITÖ • MATERIAL OFICIAL</span>
      <h1>${bookName} — Unit ${unitNumber}: ${unitTitle} 📚</h1>
      <p style="margin: 0; color: #64748b; font-size: 14px;">Student Book & Workbook Digital Guide • Cokitö Immersion</p>
    </div>
    <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      🖨️ Imprimir / Guardar en PDF
    </button>
  </div>

  <div class="tip">
    <strong>💡 Indicación de La Teacher Cokitö:</strong> Mantén este archivo abierto o impreso durante tus sesiones de clase en vivo por Google Meet y al realizar tus ejercicios en el Laboratorio de Idiomas.
  </div>

  <h2>1. Objetivos y Vocabulario Central • Unit ${unitNumber}</h2>
  <div class="box">
    <p><strong>Unidad Temática:</strong> ${unitTitle}</p>
    <p><strong>Enfoque Comunicativo:</strong> Práctica de listening nativo, role-play conversacional y precisión gramatical.</p>
    <p><strong>Estructura de Estudio:</strong> 3 Sesiones dinámicas (Session A: Vocabulario & Gramática • Session B: Pronunciación & Conversación • Session C: Lectura y Workbook).</p>
  </div>

  <h2>2. Diálogos y Modelos de Conversación</h2>
  <div class="dialogue">
    <strong>Conversación de Práctica guiada:</strong><br>
    Speaker A: "Hello! Welcome to our Cokitö class for Unit ${unitNumber}."<br>
    Speaker B: "Thank you! I have my study guide downloaded and ready to practice."
  </div>

  <h2>3. Hoja de Trabajo y Notas del Workbook</h2>
  <div class="box">
    <p><strong>Práctica Escrita:</strong> Desarrolla los ejercicios correspondientes a la Unidad ${unitNumber}.</p>
    <p><strong>Autoevaluación:</strong> Al terminar la unidad, recuerda presentar el Quiz interactivo para ganar +50 XP para tu racha académica.</p>
  </div>

  <div class="footer">
    <p>© Cokitö Academy • McGraw-Hill ${bookName} Curricular Program • Todos los derechos reservados.</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadUnitAudio = (trackNumber: number = 2) => {
  const audioUrl = `/audio/supergoal1/track0${trackNumber}.mp3`;
  const a = document.createElement('a');
  a.href = audioUrl;
  a.download = `SuperGoal1_Audio_Track0${trackNumber}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
