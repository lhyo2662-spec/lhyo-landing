import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ceo = (url.searchParams.get("ceo") || "CLIENTE DISTINGUIDO").toUpperCase();
  const empresa = (url.searchParams.get("empresa") || "DIRECCIÓN GENERAL").toUpperCase();

  const html = `<!DOCTYPE html>
<html lang="es" translate="no">
<head>
<meta charset="UTF-8">
<meta name="google" content="notranslate">
<title>LHYO GROUP · Catálogo Privado & División Enterprise - ${ceo}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
    background-color: #050507;
    color: #FFFFFF;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.55;
    letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }
  .top-action-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: rgba(5, 5, 7, 0.95);
    border-bottom: 1px solid rgba(197, 160, 89, 0.45);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    z-index: 9999;
    backdrop-filter: blur(12px);
  }
  .btn-download-pdf {
    background: linear-gradient(135deg, #C5A059 0%, #FCF6BA 50%, #9A7B38 100%);
    color: #050507;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 10px 22px;
    border-radius: 999px;
    border: 1px solid rgba(252, 246, 186, 0.8);
    cursor: pointer;
    text-transform: uppercase;
  }
  @media print {
    .top-action-bar { display: none !important; }
    .doc-wrapper { padding-top: 0 !important; }
  }
  .doc-wrapper {
    padding-top: 68px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #020203;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    background-color: #050507;
    padding: 20mm 20mm;
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
  .eyebrow-confidential { font-size: 8.5pt; font-weight: 500; color: #FCF6BA; opacity: 0.85; letter-spacing: 2px; text-transform: uppercase; text-align: right; line-height: 1.5; }
  .h1-hero { font-size: 35pt; font-weight: 600; letter-spacing: -0.025em; line-height: 1.12; color: #FFFFFF; margin-bottom: 9mm; }
  .subtitle-hero { border-left: 2px solid #C5A059; padding-left: 6mm; font-size: 13pt; font-weight: 400; color: #D1D5DB; max-width: 150mm; line-height: 1.55; }
  .footer-meta { border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 4.5mm; font-size: 8.5pt; font-weight: 500; letter-spacing: 1.5px; color: #9CA3AF; text-transform: uppercase; }
  .footer-meta strong { color: #FCF6BA; font-weight: 600; }
  .h2-section { font-size: 23pt; font-weight: 600; letter-spacing: -0.02em; line-height: 1.18; color: #FFFFFF; margin-bottom: 5mm; }
  .gold-divider { width: 100%; height: 1px; background: linear-gradient(90deg, #C5A059, rgba(197,160,89,0.1)); margin-bottom: 7mm; }
  .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; align-items: start; }
  .body-copy { font-size: 10.4pt; font-weight: 400; color: #D1D5DB; line-height: 1.6; margin-bottom: 4.5mm; }
  .quote-box { border-left: 2px solid #C5A059; background: rgba(10, 17, 40, 0.75); border-radius: 0 8px 8px 0; padding: 4mm 6mm; margin-top: 6mm; font-size: 12.5pt; font-weight: 600; color: #FCF6BA; line-height: 1.45; }
  .service-row { display: grid; grid-template-columns: 22mm 1fr; gap: 5mm; padding: 5.5mm 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); align-items: start; }
  .service-num { font-size: 27pt; font-weight: 300; color: #C5A059; line-height: 1; letter-spacing: -0.03em; }
  .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm; }
  .service-title { font-size: 12.2pt; font-weight: 600; color: #FFFFFF; letter-spacing: -0.01em; }
  .badge-gold { background: rgba(197, 160, 89, 0.14); border: 1px solid rgba(197, 160, 89, 0.45); color: #FCF6BA; font-size: 7.2pt; font-weight: 600; padding: 1mm 3.2mm; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.8px; }
  .boxed-frame {
    border: 1px solid rgba(197, 160, 89, 0.4);
    border-radius: 12px;
    background: linear-gradient(145deg, rgba(10, 17, 40, 0.85) 0%, #050507 100%);
    padding: 9mm 10mm;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .center-header { text-align: center; margin-bottom: 10mm; }
  .rule-item { display: grid; grid-template-columns: 16mm 1fr; gap: 4mm; padding: 6mm 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); align-items: start; }
  .rule-num { font-size: 26pt; font-weight: 300; color: #C5A059; line-height: 1; }
  .seal-footer { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10mm; background: transparent !important; }
  .seal-caption { margin-top: 5mm; font-size: 8.5pt; font-weight: 500; letter-spacing: 2.5px; color: #9CA3AF; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="top-action-bar">
    <span style="font-size: 11px; letter-spacing: 0.14em; color: #FCF6BA; font-weight: 600;">LHYO GROUP &nbsp;·&nbsp; DOSSIER CORPORATIVO PREPARADO PARA: ${ceo}</span>
    <button class="btn-download-pdf" onclick="window.print()">Descargar / Guardar en PDF (A4) ↓</button>
  </div>

  <svg style="display: none;">
    <symbol id="lhyo-monogram" viewBox="0 0 200 200">
      <path d="M25 65 L75 25 L75 140 L175 140 L152 178 L52 178 L52 140 L25 140 Z M43 74 L43 122 L57 122 L57 62 Z M75 154 L75 164 L142 164 L148 154 Z" fill="#FFFFFF" fill-rule="evenodd"/>
      <polygon points="88,20 108,5 108,122 88,122" fill="#FFFFFF"/>
    </symbol>
    <symbol id="lhyo-full-logo" viewBox="0 0 540 140">
      <path d="M15 48 L55 18 L55 102 L132 102 L115 130 L38 130 L38 102 L15 102 Z M29 55 L29 88 L41 88 L41 46 Z M55 113 L55 120 L106 120 L111 113 Z" fill="#FFFFFF" fill-rule="evenodd"/>
      <polygon points="65,16 81,4 81,88 65,88" fill="#C5A059"/>
      <text x="96" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="66" font-weight="700" fill="#FFFFFF" letter-spacing="1">HYO</text>
      <line x1="278" y1="26" x2="278" y2="96" stroke="#C5A059" stroke-width="2.5"/>
      <text x="302" y="81" font-family="'Plus Jakarta Sans', sans-serif" font-size="38" font-weight="300" fill="#D1D5DB" letter-spacing="7">GROUP</text>
    </symbol>
  </svg>

  <div class="doc-wrapper">
    <!-- PÁGINA 1: PORTADA -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <header class="header-bar">
          <svg class="brand-logo-svg" width="210" height="55"><use href="#lhyo-full-logo"/></svg>
          <div class="eyebrow-confidential">CATÁLOGO PRIVADO &amp; ENTERPRISE<br>LHYOGROUP.COM</div>
        </header>
        <div>
          <span style="font-size: 9.5pt; font-weight: 600; color: #C5A059; letter-spacing: 2.5px; text-transform: uppercase; display: block; margin-bottom: 4mm;">
            INGENIERÍA DE SISTEMAS, INTELIGENCIA ARTIFICIAL Y SOBERANÍA DIGITAL
          </span>
          <h1 class="h1-hero">Soluciones digitales e<br>infraestructura para<br>escalar tu empresa.</h1>
          <div class="subtitle-hero">
            Desde asistentes inteligentes 24/7 y páginas web de lujo hasta servidores privados n8n libres de costos mensuales, cerebros RAG locales y software SaaS corporativo propio.
          </div>
        </div>
        <footer class="footer-meta">
          PREPARADO EXCLUSIVAMENTE PARA:<br>
          <strong>${ceo} &nbsp;·&nbsp; ${empresa}</strong>
        </footer>
      </div>
    </section>

    <!-- PÁGINA 2: VISIÓN ESTRATÉGICA -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <span style="font-size: 9pt; font-weight: 600; color: #C5A059; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2.5mm;">
            VISIÓN ESTRATÉGICA
          </span>
          <h2 class="h2-section">El secreto de las empresas<br>que escalan con control total</h2>
          <div class="gold-divider"></div>
          <div class="two-col-grid">
            <div>
              <p class="body-copy">
                Hoy en día, las empresas pierden miles de dólares por dos fugas silenciosas: la demora en atender a sus clientes potenciales y el pago interminable de múltiples suscripciones de software desconectadas entre sí.
              </p>
              <p class="body-copy">
                Depender de procesos manuales o de herramientas externas que cobran por cada mensaje u operación limita el crecimiento y reduce el margen de rentabilidad de tu organización.
              </p>
            </div>
            <div>
              <p class="body-copy">
                En Lhyo Group diseñamos e instalamos tu propia infraestructura tecnológica: sistemas comerciales que atienden 24/7 y arquitecturas privadas donde tu empresa es dueña absoluta de sus datos y su operación.
              </p>
              <div class="quote-box">
                Tu tiempo es para dirigir y expandir tu compañía.<br>Nuestra infraestructura ejecuta el resto en automático.
              </div>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP &nbsp;·&nbsp; ARQUITECTURA DE CRECIMIENTO B2B</footer>
      </div>
    </section>

    <!-- PÁGINA 3: SOLUCIONES COMERCIALES -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <span style="font-size: 9pt; font-weight: 600; color: #C5A059; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2mm;">
            DIVISIÓN 01 · CAPTACIÓN Y VENTAS AUTOMATIZADAS
          </span>
          <h2 class="h2-section">Soluciones Comerciales y Presencia Digital</h2>
          <div class="gold-divider"></div>

          <div class="service-row">
            <div class="service-num">01</div>
            <div>
              <div class="service-header">
                <div class="service-title">Asistentes Inteligentes 24/7 (WhatsApp e Instagram)</div>
                <span class="badge-gold">✦ Atención 24/7</span>
              </div>
              <p class="body-copy">
                Atención inmediata sin tiempos de espera. Implementamos asistentes entrenados a la medida de tu negocio que responden consultas, califican prospectos y agendan citas comerciales en automático día y noche.
              </p>
            </div>
          </div>

          <div class="service-row">
            <div class="service-num">02</div>
            <div>
              <div class="service-header">
                <div class="service-title">Páginas Web Modernas y Catálogos Digitales</div>
                <span class="badge-gold">✦ Imagen de Lujo</span>
              </div>
              <p class="body-copy">
                Desarrollamos plataformas web rápidas, elegantes e intuitivas para celulares y computadoras, conectadas directamente a tu calendario ejecutivo y canales de conversión.
              </p>
            </div>
          </div>

          <div class="service-row">
            <div class="service-num">03</div>
            <div>
              <div class="service-header">
                <div class="service-title">Organización Automática de Clientes y Ventas (CRM)</div>
                <span class="badge-gold">✦ Orden Total</span>
              </div>
              <p class="body-copy">
                Centralización automática de cada prospecto con su nombre, contacto, facturación y servicio de interés clasificado en tiempo real sin intervención manual.
              </p>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP &nbsp;·&nbsp; DIVISIÓN COMERCIAL</footer>
      </div>
    </section>

    <!-- PÁGINA 4: NUEVA DIVISIÓN INFRAESTRUCTURA ENTERPRISE -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div class="boxed-frame">
          <div>
            <span style="font-size: 8.5pt; font-weight: 600; color: #C5A059; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2mm;">
              DIVISIÓN 02 · SOBERANÍA TECNOLÓGICA HIGH-TICKET
            </span>
            <h2 class="h2-section" style="font-size: 21pt; margin-bottom: 3mm;">Infraestructura Enterprise:<br>Sistemas Privados Libres de Suscripciones</h2>
            <p class="body-copy" style="font-size: 9.8pt; margin-bottom: 4mm;">
              Arquitecturas corporativas diseñadas para empresas que buscan eliminar cobros mensuales de herramientas de terceros, blindar su información confidencial y poseer su propio software centralizado:
            </p>

            <div class="service-row" style="padding: 4.2mm 0;">
              <div class="service-num" style="font-size: 23pt;">01</div>
              <div>
                <div class="service-header">
                  <div class="service-title" style="font-size: 11.2pt;">AUTOMATIZACIÓN LIBRE DE COSTOS (Infraestructura n8n)</div>
                  <span class="badge-gold">✦ Self-Hosted · ∞</span>
                </div>
                <p class="body-copy" style="font-size: 9.6pt; margin-bottom: 0;">
                  Migramos su operación a n8n en servidores privados (Self-hosted). Eliminamos sus costos mensuales de herramientas de terceros y construimos un motor de procesos ilimitado.
                </p>
              </div>
            </div>

            <div class="service-row" style="padding: 4.2mm 0;">
              <div class="service-num" style="font-size: 23pt;">02</div>
              <div>
                <div class="service-header">
                  <div class="service-title" style="font-size: 11.2pt;">AGENTES RAG (Memoria Institucional Privada)</div>
                  <span class="badge-gold">✦ IA Privada Local</span>
                </div>
                <p class="body-copy" style="font-size: 9.6pt; margin-bottom: 0;">
                  Cerebros de IA locales conectados a sus bases de datos, contratos y documentos internos. Privacidad absoluta para que su equipo consulte información corporativa en segundos.
                </p>
              </div>
            </div>

            <div class="service-row" style="padding: 4.2mm 0; border-bottom: none;">
              <div class="service-num" style="font-size: 23pt;">03</div>
              <div>
                <div class="service-header">
                  <div class="service-title" style="font-size: 11.2pt;">SAAS CORPORATIVO INTERNO (Ecosistema Propio)</div>
                  <span class="badge-gold">✦ Panel Único</span>
                </div>
                <p class="body-copy" style="font-size: 9.6pt; margin-bottom: 0;">
                  Desarrollo de ecosistemas a medida. Unificamos sus operaciones en un panel de control centralizado, eliminando la dependencia de múltiples suscripciones ineficientes.
                </p>
              </div>
            </div>
          </div>
          <footer class="footer-meta" style="border-top: 1px solid rgba(197, 160, 89, 0.35); padding-top: 3.5mm; font-size: 8.2pt;">
            NOTA: PROPUESTA ECONÓMICA Y ARQUITECTURA CALIBRADA EN SESIÓN EJECUTIVA.
          </footer>
        </div>
      </div>
    </section>

    <!-- PÁGINA 5: PREPARACIÓN PARA NUESTRA REUNIÓN -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <div class="center-header">
            <span style="font-size: 9pt; font-weight: 600; color: #C5A059; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2.5mm;">
              PRÓXIMOS PASOS
            </span>
            <h2 class="h2-section" style="font-size: 23pt;">Cómo aprovechar al máximo<br>nuestra reunión personalizada</h2>
          </div>

          <div class="rule-item">
            <div class="rule-num">01</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Define tus prioridades:</strong> Identifica cuál de nuestras soluciones comerciales o arquitecturas Enterprise (n8n, Agentes RAG o SaaS Interno) generará el mayor impacto inmediato en tu operación.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">02</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Espacio tranquilo:</strong> Conéctate a nuestra videollamada en Google Meet desde un lugar cómodo donde podamos evaluar tu caso y mostrarte la arquitectura en funcionamiento.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">03</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Propuesta llave en mano:</strong> En la sesión te entregaremos el presupuesto exacto, el cálculo de retorno de inversión y el cronograma de implementación paso a paso.
            </p>
          </div>
        </div>

        <div class="seal-footer">
          <svg class="brand-logo-svg" width="230" height="60"><use href="#lhyo-full-logo"/></svg>
          <div class="seal-caption">LHYO GROUP &nbsp;·&nbsp; LHYOGROUP.COM</div>
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
