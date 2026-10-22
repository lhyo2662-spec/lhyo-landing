import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ceo = (url.searchParams.get("ceo") || "EJECUTIVO ACREDITADO").toUpperCase();
  const empresa = (url.searchParams.get("empresa") || "EXPEDIENTE RESERVADO B2B").toUpperCase();

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>LHYO GROUP | Catálogo Privado B2B - ${ceo}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    background-color: #070707;
    color: #F8F9FA;
    font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    line-height: 1.5;
  }
  .top-action-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: rgba(11, 19, 43, 0.95);
    border-bottom: 1px solid #BF953F;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    z-index: 9999;
    backdrop-filter: blur(8px);
  }
  .btn-download-pdf {
    background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%);
    color: #070707;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
  }
  @media print {
    .top-action-bar { display: none !important; }
    .doc-wrapper { padding-top: 0 !important; }
  }
  .doc-wrapper {
    padding-top: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #000000;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    background-color: #070707;
    padding: 22mm 20mm;
    overflow: hidden;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #1C1C1E;
  }
  .watermark-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-22deg);
    width: 135mm;
    height: 135mm;
    pointer-events: none;
    z-index: 1;
    opacity: 0.035;
    background: transparent !important;
  }
  .content-layer {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .brand-logo-svg { background: transparent !important; display: block; }
  .header-bar { display: flex; justify-content: space-between; align-items: center; width: 100%; }
  .eyebrow-confidential { font-size: 9pt; color: #8E8E93; letter-spacing: 2px; text-transform: uppercase; text-align: right; line-height: 1.4; }
  .h1-hero { font-size: 42pt; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; color: #F8F9FA; text-transform: uppercase; margin-bottom: 10mm; }
  .subtitle-hero { border-left: 3px solid #BF953F; padding-left: 6mm; font-size: 14pt; font-weight: 400; color: #8E8E93; max-width: 145mm; line-height: 1.45; }
  .footer-meta { border-top: 1px solid rgba(191, 149, 63, 0.35); padding-top: 5mm; font-family: 'Courier New', monospace; font-size: 9.5pt; letter-spacing: 1.5px; color: #8E8E93; text-transform: uppercase; }
  .footer-meta strong { color: #F8F9FA; font-weight: 700; }
  .h2-section { font-size: 28pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.12; text-transform: uppercase; color: #F8F9FA; margin-bottom: 8mm; }
  .gold-divider { width: 100%; height: 1px; background-color: #BF953F; margin-bottom: 10mm; opacity: 0.6; }
  .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; align-items: start; }
  .body-copy { font-size: 11pt; color: #8E8E93; line-height: 1.65; margin-bottom: 6mm; }
  .quote-box { border-left: 3px solid #BF953F; padding-left: 6mm; margin-top: 8mm; font-size: 15pt; font-weight: 700; color: #F8F9FA; line-height: 1.35; }
  .service-row { display: grid; grid-template-columns: 28mm 1fr; gap: 6mm; padding: 8mm 0; border-bottom: 1px solid #1C1C1E; align-items: start; }
  .service-num { font-size: 34pt; font-weight: 800; color: #BF953F; line-height: 1; letter-spacing: -0.03em; }
  .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3mm; }
  .service-title { font-size: 14pt; font-weight: 700; color: #F8F9FA; text-transform: uppercase; }
  .badge-gold { background: linear-gradient(135deg, #BF953F 0%, #B38728 100%); color: #070707; font-size: 7.5pt; font-weight: 800; padding: 1.5mm 3.5mm; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; }
  .boxed-frame { border: 1px solid #262629; background-color: rgba(17, 17, 18, 0.65); padding: 12mm; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  .phase-table { width: 100%; border: 1px solid rgba(191, 149, 63, 0.5); border-collapse: collapse; margin-top: 6mm; }
  .phase-table th { text-align: left; padding: 4mm 5mm; font-size: 11pt; font-weight: 700; color: #F8F9FA; border-bottom: 1px solid rgba(191, 149, 63, 0.5); background-color: rgba(191, 149, 63, 0.06); }
  .phase-table td { width: 50%; padding: 3.5mm 5mm; font-size: 9.5pt; color: #8E8E93; border-bottom: 1px solid #1C1C1E; border-right: 1px solid #1C1C1E; }
  .center-header { text-align: center; margin-bottom: 10mm; }
  .rule-item { display: grid; grid-template-columns: 16mm 1fr; gap: 4mm; padding: 6mm 0; border-bottom: 1px solid #1C1C1E; align-items: start; }
  .rule-num { font-size: 28pt; font-weight: 800; color: #BF953F; line-height: 1; }
  .seal-footer { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10mm; background: transparent !important; }
  .seal-caption { margin-top: 5mm; font-size: 8.5pt; letter-spacing: 3px; color: #8E8E93; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="top-action-bar">
    <span style="font-size: 11px; letter-spacing: 0.15em; color: #F8F9FA; font-weight: 700;">LHYO GROUP // EXPEDIENTE CONFIDENCIAL DE: ${ceo}</span>
    <button class="btn-download-pdf" onclick="window.print()">DESCARGAR / GUARDAR EN PDF (A4) ↓</button>
  </div>

  <svg style="display: none;">
    <symbol id="lhyo-monogram" viewBox="0 0 200 200">
      <path d="M25 65 L75 25 L75 140 L175 140 L152 178 L52 178 L52 140 L25 140 Z M43 74 L43 122 L57 122 L57 62 Z M75 154 L75 164 L142 164 L148 154 Z" fill="#FFFFFF" fill-rule="evenodd"/>
      <polygon points="88,20 108,5 108,122 88,122" fill="#FFFFFF"/>
    </symbol>
    <symbol id="lhyo-full-logo" viewBox="0 0 540 140">
      <path d="M15 48 L55 18 L55 102 L132 102 L115 130 L38 130 L38 102 L15 102 Z M29 55 L29 88 L41 88 L41 46 Z M55 113 L55 120 L106 120 L111 113 Z" fill="#F8F9FA" fill-rule="evenodd"/>
      <polygon points="65,16 81,4 81,88 65,88" fill="#BF953F"/>
      <text x="96" y="88" font-family="'Helvetica Neue', 'Inter', sans-serif" font-size="68" font-weight="900" fill="#F8F9FA" letter-spacing="1">HYO</text>
      <line x1="278" y1="26" x2="278" y2="96" stroke="#BF953F" stroke-width="3"/>
      <text x="302" y="81" font-family="'Helvetica Neue', 'Inter', sans-serif" font-size="40" font-weight="300" fill="#A0AAB2" letter-spacing="7">GROUP</text>
    </symbol>
  </svg>

  <div class="doc-wrapper">
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <header class="header-bar">
          <svg class="brand-logo-svg" width="210" height="55"><use href="#lhyo-full-logo"/></svg>
          <div class="eyebrow-confidential">DOCUMENTO CONFIDENCIAL //<br>PRE-AUDITORÍA ESTRATÉGICA</div>
        </header>
        <div>
          <h1 class="h1-hero">EL SISTEMA<br>OPERATIVO DEL<br>ESCALADO B2B.</h1>
          <div class="subtitle-hero">Arquitectura de Sistemas, Agentes Cognitivos y Embudos de Alta Conversión exclusivos para empresas superando su techo operativo.</div>
        </div>
        <footer class="footer-meta">
          PREPARADO EXCLUSIVAMENTE PARA:<br>
          <strong>${ceo} &nbsp;|&nbsp; ${empresa}</strong>
        </footer>
      </div>
    </section>

    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <h2 class="h2-section">TU CRECIMIENTO<br>ESTÁ SECUESTRADO<br>POR LA LATENCIA<br>HUMANA.</h2>
          <div class="gold-divider"></div>
          <div class="two-col-grid">
            <div>
              <p class="body-copy">Agendaste esta auditoría porque tu empresa tiene un techo operativo. Y ese techo está hecho de carne, hueso y horarios de oficina.</p>
              <p class="body-copy">Si actualmente dependes de humanos para responder mensajes a tiempo, calificar prospectos, mover datos de una hoja de cálculo a un CRM, o perseguir seguimientos... estás perdiendo capital cada segundo.</p>
            </div>
            <div>
              <p class="body-copy">La competencia no duerme. El tráfico se encarece. Y el cliente moderno exige gratificación instantánea. En Lhyo Group no vendemos "herramientas de marketing". Instalamos infraestructura de alto rendimiento para que las máquinas asuman el trabajo táctico.</p>
              <div class="quote-box">El talento humano es para dirigir.<br>Todo lo demás, es trabajo de máquinas.</div>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP // DIAGNÓSTICO DE LATENCIA OPERATIVA</footer>
      </div>
    </section>

    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <h2 class="h2-section">INFRAESTRUCTURA DE<br>CONVERSIÓN A LA CARTA</h2>
          <div class="gold-divider"></div>
          <div class="service-row">
            <div class="service-num">01</div>
            <div>
              <div class="service-header"><div class="service-title">EMPLEADOS DIGITALES AUTÓNOMOS</div><span class="badge-gold">AGENTES IA</span></div>
              <p class="body-copy">Olvida los bots rígidos con respuestas pre-programadas. Desplegamos Agentes Cognitivos entrenados con el ADN y la base de datos de tu empresa. Resuelven objeciones complejas, califican leads y agendan citas en WhatsApp o Instagram a las 3:00 AM.</p>
            </div>
          </div>
          <div class="service-row">
            <div class="service-num">02</div>
            <div>
              <div class="service-header"><div class="service-title">INTERFACES B2B DE ALTA CONVERSIÓN</div><span class="badge-gold">WEB ÉLITE</span></div>
              <p class="body-copy">Una web que solo "se ve bien" es un pasivo financiero. Construimos arquitecturas web bajo rigor estético suizo con un único objetivo matemático: capturar tráfico frío, inyectar autoridad inmediata y forzarlos hacia tu calendario de ventas.</p>
            </div>
          </div>
          <div class="service-row">
            <div class="service-num">03</div>
            <div>
              <div class="service-header"><div class="service-title">AUTOMATIZACIÓN DE ECOSISTEMAS</div><span class="badge-gold">FLUJO CRM</span></div>
              <p class="body-copy">Centralizamos tu caos operativo. Interconectamos tus pasarelas de pago, correos, calendarios y CRM. Cuando un lead entra, el sistema lo nutre, lo clasifica y notifica a tu equipo de ventas sin que un solo humano tenga que teclear un dato.</p>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP // ARSENAL TÁCTICO B2B</footer>
      </div>
    </section>

    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div class="boxed-frame">
          <div>
            <h2 class="h2-section" style="font-size: 24pt;">THE FULL STACK<br>ARCHITECTURE: EL SISTEMA<br>NERVIOSO CENTRAL</h2>
            <p class="body-copy">Contratar sistemas aislados resuelve problemas aislados. El verdadero apalancamiento ocurre cuando la captura, la persuasión y la automatización operan bajo un solo cerebro.</p>
            <table class="phase-table">
              <thead><tr><th colspan="2">Fase I: Despliegue de Infraestructura</th></tr></thead>
              <tbody>
                <tr><td>Ingeniería de Sistemas B2B</td><td>Inyección de Código de Producción</td></tr>
                <tr><td>Diseño UI/UX bajo Canon Suizo</td><td>Automatización de Tuberías CRM</td></tr>
                <tr><td>Entrenamiento de Agentes IA</td><td>Integración de Pasarelas y Calendarios</td></tr>
                <tr><td>Arquitectura de Conversión</td><td>Despliegue Único de Instalación</td></tr>
              </tbody>
            </table>
            <table class="phase-table" style="margin-top: 8mm;">
              <thead><tr><th colspan="2">Fase II: Mantenimiento Cognitivo y Optimización</th></tr></thead>
              <tbody>
                <tr><td>Hosting de Modelos de IA</td><td>Soporte Dedicado de Servidores</td></tr>
                <tr><td>Iteración Matemática de Prompts</td><td>Mantenimiento Cognitivo Continuo</td></tr>
                <tr><td>Optimización de Conversión</td><td>Auditoría de Flujos sin Fricción</td></tr>
                <tr><td>Seguridad del Ecosistema</td><td>Licencia Operativa Mensual</td></tr>
              </tbody>
            </table>
          </div>
          <footer class="footer-meta" style="border-top: none; padding-top: 0;">NOTA: INVERSIÓN CALIBRADA EN AUDITORÍA SEGÚN VOLUMEN OPERATIVO.</footer>
        </div>
      </div>
    </section>

    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <div class="center-header"><h2 class="h2-section" style="font-size: 24pt;">LA AUDITORÍA NO ES UNA<br>CHARLA. ES UN DIAGNÓSTICO<br>QUIRÚRGICO.</h2></div>
          <div class="rule-item"><div class="rule-num">1</div><p class="body-copy" style="margin-bottom:0;"><strong style="color:#F8F9FA;">Conoce tus métricas:</strong> Necesitaremos saber tu costo de adquisición (CAC), volumen de leads actual y ticket promedio para proyectar el retorno de inversión.</p></div>
          <div class="rule-item"><div class="rule-num">2</div><p class="body-copy" style="margin-bottom:0;"><strong style="color:#F8F9FA;">Entorno aislado:</strong> Ingresa a la sala de Zoom desde una computadora de escritorio. Sin distracciones. Sin llamadas en movimiento.</p></div>
          <div class="rule-item"><div class="rule-num">3</div><p class="body-copy" style="margin-bottom:0;"><strong style="color:#F8F9FA;">Capacidad de decisión:</strong> Si requieres la aprobación de un socio para ejecutar cambios de infraestructura operativa, asegúrate de que esté presente en la sesión.</p></div>
        </div>
        <div class="seal-footer">
          <svg class="brand-logo-svg" width="230" height="60"><use href="#lhyo-full-logo"/></svg>
          <div class="seal-caption">LHYO GROUP &nbsp;|&nbsp; DIVISIÓN DE ESCALADO B2B</div>
        </div>
      </div>
    </section>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
