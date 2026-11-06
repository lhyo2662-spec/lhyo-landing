import { jsPDF } from "jspdf";

export interface DossierSolutionItem {
  id: string;
  code: string;
  category: string;
  title: string;
  badge: string;
  challenge: string;
  architecture: string;
  deliverables: string[];
  metrics: string;
}

export interface DossierPayload {
  companyName: string;
  prospectName: string;
  region?: string;
  scheduledSlot?: string;
  selectedPlanText?: string;
}

export const OFFICIAL_SOLUTIONS_CATALOG: DossierSolutionItem[] = [
  {
    id: "SOL-1",
    code: "01",
    category: "SOLUCIÓN 01 · ATENCIÓN Y CONVERSIÓN INMEDIATA",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    badge: "Respuesta en < 1 segundo · 24/7",
    challenge: "El 78% de los prospectos contrata a la primera empresa que responde con claridad. La demora humana fuera de horario destruye la conversión comercial.",
    architecture: "Desplegamos agentes conversacionales en WhatsApp Business e Instagram que responden en menos de 1 segundo las 24 horas, califican al prospecto y agendan sesiones en su calendario.",
    deliverables: [
      "Atención ininterrumpida 24/7/365 con trato corporativo de Usted.",
      "Calificación automática de prospectos según volumen y necesidad.",
      "Agendamiento directo en calendario sin intervención manual.",
      "Sincronización en tiempo real con el CRM corporativo."
    ],
    metrics: "Latencia < 1.0s | Conversión +340% | Operación 24/7"
  },
  {
    id: "SOL-2",
    code: "02",
    category: "SOLUCIÓN 02 · PRESENCIA DIGITAL DE MÁXIMO PRESTIGIO",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    badge: "Estética Obsidiana y Oro · Carga < 0.8s",
    challenge: "Las páginas tradicionales son lentas y estáticas; provocan que 8 de cada 10 visitantes abandonen en menos de 4 segundos sin percibir la autoridad de la firma.",
    architecture: "Construimos plataformas en arquitectura Next.js Edge con diseño corporativo de alto prestigio, demostraciones interactivas y generación dinámica de Dossiers en PDF.",
    deliverables: [
      "Arquitectura web ultrarrápida optimizada para móviles y escritorio.",
      "Catálogo interactivo en acordeón con demostraciones en vivo.",
      "Generador automático de Dossier Corporativo PDF personalizado.",
      "Indexación avanzada en Google mediante esquema JSON-LD."
    ],
    metrics: "Apertura < 0.8s | Retención Ejecutiva | SEO Omnipresente"
  },
  {
    id: "SOL-3",
    code: "03",
    category: "SOLUCIÓN 03 · CONTROL COMERCIAL AUTOMATIZADO",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    badge: "Cero Carga Manual · Clasificación VIP",
    challenge: "Gestionar prospectos en chats dispersos o notas manuales genera fugas de capital, olvidos de seguimiento y pérdida de oportunidades prioritarias.",
    architecture: "Enlazamos todos los canales hacia una base centralizada que registra nombre, empresa, región, facturación en USD y prioridad en tiempo real.",
    deliverables: [
      "Captura instantánea de cada prospecto desde web, WhatsApp o Instagram.",
      "Segmentación automática (HIGH_TICKET vs LOW_TICKET) por facturación.",
      "Disparo automático de confirmación y enlace de Google Meet.",
      "Trazabilidad completa en huso horario oficial (America/Caracas)."
    ],
    metrics: "0 Minutos Manuales | Trazabilidad 100% | Alertas en 1s"
  },
  {
    id: "SOL-4",
    code: "04",
    category: "SOLUCIÓN 04 · INDEPENDENCIA Y AUTOMATIZACIÓN SIN LÍMITES",
    title: "Automatización Total de Procesos con Tecnología Propia (n8n)",
    badge: "Cero Cobro por Operación · Soberanía Total",
    challenge: "Las plataformas externas de automatización encarecen sus cobros mensuales a medida que el volumen de clientes y envíos de la empresa crece.",
    architecture: "Instalamos una central privada basada en n8n bajo control exclusivo de su empresa, ejecutando flujos ilimitados entre CRM, correo, WhatsApp y agenda.",
    deliverables: [
      "Motor privado n8n sin recargos por tarea u operación ejecutada.",
      "Webhooks de baja latencia para intercepción de formularios y citas.",
      "Privacidad absoluta de los datos comerciales sin depender de terceros.",
      "Ahorro operativo de hasta un 85% anual en suscripciones externas."
    ],
    metrics: "Ejecuciones Ilimitadas (∞) | Ahorro 85% | 100% Propiedad"
  },
  {
    id: "SOL-5",
    code: "05",
    category: "SOLUCIÓN 05 · EL CEREBRO INTELIGENTE DE SU NEGOCIO",
    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa (RAG)",
    badge: "99.4% Exactitud · 100% Confidencial",
    challenge: "Los equipos comerciales pierden horas buscando tarifas, cláusulas de contratos o procedimientos técnicos en múltiples archivos dispersos.",
    architecture: "Entrenamos un modelo de IA privado mediante arquitectura RAG conectado exclusivamente a los PDFs, contratos, manuales y listas de precios de su negocio.",
    deliverables: [
      "Indexación vectorial privada de contratos, catálogos y tarifarios.",
      "Respuestas exactas en 1 segundo sin alucinaciones ni datos inventados.",
      "Blindaje de seguridad: sus archivos jamás salen a modelos públicos.",
      "Asistencia continua 24/7 para directivos, ventas y soporte."
    ],
    metrics: "Precisión 99.4% | Respuesta en 1s | Blindaje Total"
  },
  {
    id: "SOL-6",
    code: "06",
    category: "SOLUCIÓN 06 · TODA SU EMPRESA EN UNA SOLA PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    badge: "100% Su Marca · Usuarios Ilimitados",
    challenge: "Operar con múltiples programas desconectados fragmenta la dirección del negocio y multiplica los pagos mensuales por cada empleado.",
    architecture: "Desarrollamos el software centralizado oficial de su empresa con su logotipo y dominio propio, unificando ventas, CRM, agenda y asistentes IA en una sola pantalla.",
    deliverables: [
      "Panel ejecutivo con la identidad visual exclusiva de su organización.",
      "Accesos ilimitados para su equipo sin cobros adicionales por usuario.",
      "Integración nativa con sus asistentes 24/7, n8n y base de clientes.",
      "Acceso multiplataforma desde teléfonos móviles, tablets y PC."
    ],
    metrics: "1 Sola Pantalla | Licencias Ilimitadas | Soberanía B2B"
  }
];

function drawCorporateFrame(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setFillColor(5, 5, 7);
  doc.rect(0, 0, 210, 297, "F");
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.45);
  doc.rect(10, 10, 190, 277, "S");
  doc.setDrawColor(26, 23, 17);
  doc.setLineWidth(2.2);
  doc.line(82, 110, 82, 182);
  doc.line(82, 182, 134, 182);
  doc.setDrawColor(36, 30, 19);
  doc.line(94, 98, 94, 168);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("LHYO", 16, 18);
  doc.setTextColor(197, 160, 89);
  doc.text("|", 28, 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(215, 215, 215);
  doc.text("GROUP · DOSSIER CORPORATIVO PRIVADO", 31, 18);
  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text("www.lhyogroup.com · ceo@lhyogroup.com", 194, 18, { align: "right" });
  doc.setLineWidth(0.2);
  doc.line(16, 22, 194, 22);
  doc.line(16, 276, 194, 276);
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 165);
  doc.text("CONFIDENCIAL · ARQUITECTURA DIGITAL, SISTEMAS INTELIGENTES Y AUTOMATIZACIÓN B2B", 16, 282);
  doc.setTextColor(197, 160, 89);
  doc.text(`Página ${pageNum} de ${totalPages}`, 194, 282, { align: "right" });
}

export function generateDynamicDossierPdf(payload: DossierPayload): void {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const cleanCompany = (payload.companyName || "Su Empresa").trim();
    const cleanProspect = (payload.prospectName || "Dirección Ejecutiva").trim();
    const cleanSlot = (payload.scheduledSlot || "Sesión Ejecutiva Confirmada").trim();
    const rawPlan = String(payload.selectedPlanText || "");

    const matchedSolutions = OFFICIAL_SOLUTIONS_CATALOG.filter((sol) => {
      return (
        rawPlan.includes(sol.code + " ") ||
        rawPlan.includes("SOLUCIÓN " + sol.code) ||
        rawPlan.includes("Solución " + sol.code) ||
        rawPlan.toLowerCase().includes(sol.title.slice(0, 18).toLowerCase())
      );
    });

    const finalSolutions = matchedSolutions.length > 0 ? matchedSolutions : OFFICIAL_SOLUTIONS_CATALOG;
    const totalPages = 1 + finalSolutions.length;

    drawCorporateFrame(doc, 1, totalPages);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("DOCUMENTO EJECUTIVO DE ARQUITECTURA B2B · PREPARADO EN EXCLUSIVA", 16, 42);
    doc.setFontSize(21);
    doc.setTextColor(255, 255, 255);
    doc.text(doc.splitTextToSize(`ARQUITECTURA TECNOLÓGICA PARA ${cleanCompany.toUpperCase()}`, 175), 16, 54);

    doc.setFillColor(10, 17, 40);
    doc.setDrawColor(197, 160, 89);
    doc.roundedRect(16, 76, 178, 36, 3, 3, "FD");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("EMPRESA / ORGANIZACIÓN:", 22, 86);
    doc.setTextColor(255, 255, 255);
    doc.text(cleanCompany, 72, 86);
    doc.setTextColor(197, 160, 89);
    doc.text("ATENCIÓN EJECUTIVA:", 22, 95);
    doc.setTextColor(255, 255, 255);
    doc.text(cleanProspect, 72, 95);
    doc.setTextColor(197, 160, 89);
    doc.text("TURNO Y SALA MEET:", 22, 104);
    doc.setTextColor(255, 255, 255);
    doc.text(`${cleanSlot} · meet.google.com/krc-vdii-zzh`, 72, 104);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(197, 160, 89);
    doc.text(`SOLUCIONES INCLUIDAS EN SU DOSSIER (${finalSolutions.length} DE 06):`, 16, 128);

    let yIdx = 136;
    finalSolutions.forEach((sol, idx) => {
      doc.setFillColor(12, 15, 24);
      doc.setDrawColor(197, 160, 89);
      doc.roundedRect(16, yIdx, 178, 14, 2, 2, "FD");
      doc.setFontSize(9);
      doc.setTextColor(197, 160, 89);
      doc.text(`SOLUCIÓN ${sol.code}`, 21, yIdx + 9);
      doc.setTextColor(255, 255, 255);
      doc.text(sol.title, 48, yIdx + 9);
      doc.setTextColor(197, 160, 89);
      doc.text(`Pág. ${idx + 2}`, 188, yIdx + 9, { align: "right" });
      yIdx += 18;
    });

    finalSolutions.forEach((sol, idx) => {
      doc.addPage();
      drawCorporateFrame(doc, idx + 2, totalPages);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(197, 160, 89);
      doc.text(sol.category, 16, 36);
      doc.setFontSize(17);
      doc.setTextColor(255, 255, 255);
      doc.text(doc.splitTextToSize(`${sol.code} · ${sol.title}`, 176), 16, 46);
      doc.setFillColor(18, 16, 11);
      doc.setDrawColor(197, 160, 89);
      doc.roundedRect(16, 60, 178, 12, 2, 2, "FD");
      doc.setFontSize(8.5);
      doc.setTextColor(197, 160, 89);
      doc.text(`IMPACTO VERIFICADO: ${sol.metrics}  |  ${sol.badge}`, 21, 67.5);

      doc.setFillColor(10, 13, 22);
      doc.setDrawColor(70, 75, 90);
      doc.roundedRect(16, 78, 178, 34, 2.5, 2.5, "FD");
      doc.setFontSize(9);
      doc.setTextColor(197, 160, 89);
      doc.text("1. DIAGNÓSTICO DEL CUELLO DE BOTELLA HABITUAL:", 21, 87);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(230, 230, 235);
      doc.text(doc.splitTextToSize(sol.challenge, 168), 21, 95);

      doc.setFillColor(10, 17, 40);
      doc.setDrawColor(197, 160, 89);
      doc.roundedRect(16, 118, 178, 38, 2.5, 2.5, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(197, 160, 89);
      doc.text(`2. ARQUITECTURA LHYO GROUP PARA ${cleanCompany.toUpperCase()}:`, 21, 127);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.text(doc.splitTextToSize(sol.architecture, 168), 21, 135);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(197, 160, 89);
      doc.text("3. ENTREGABLES EJECUTIVOS INCLUIDOS:", 16, 170);

      let yDeliv = 178;
      sol.deliverables.forEach((item) => {
        doc.setFillColor(10, 12, 18);
        doc.setDrawColor(197, 160, 89);
        doc.roundedRect(16, yDeliv, 178, 14, 2, 2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(197, 160, 89);
        doc.text("✦", 21, yDeliv + 9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(255, 255, 255);
        doc.text(doc.splitTextToSize(item, 162), 27, yDeliv + 9);
        yDeliv += 18;
      });
    });

    const safeFileName = cleanCompany.replace(/[^a-zA-Z0-9_-]/g, "_") || "Empresa";
    doc.save(`Dossier_Corporativo_Lhyo_Group_${safeFileName}.pdf`);
  } catch (err) {
    console.error("Error generando PDF:", err);
  }
}