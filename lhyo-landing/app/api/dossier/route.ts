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
<title>LHYO GROUP · Catálogo Privado de Soluciones - ${ceo}</title>
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
    background-color: #070707;
    color: #F8F9FA;
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
    background-color: rgba(7, 7, 7, 0.94);
    border-bottom: 1px solid rgba(191, 149, 63, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    z-index: 9999;
    backdrop-filter: blur(12px);
  }
  .btn-download-pdf {
    background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%);
    color: #070707;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 10px 22px;
    border-radius: 999px;
    border: 1px solid rgba(252, 246, 186, 0.8);
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0 6px 20px -4px rgba(191, 149, 63, 0.45);
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
    background-color: #030303;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    background-color: #070707;
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
  .eyebrow-confidential { font-size: 8.5pt; font-weight: 500; color: #FCF6BA; opacity: 0.8; letter-spacing: 2px; text-transform: uppercase; text-align: right; line-height: 1.5; }
  .h1-hero { font-size: 36pt; font-weight: 600; letter-spacing: -0.025em; line-height: 1.12; color: #FFFFFF; margin-bottom: 9mm; }
  .subtitle-hero { border-left: 2px solid #BF953F; padding-left: 6mm; font-size: 13.5pt; font-weight: 400; color: #D1D5DB; max-width: 148mm; line-height: 1.55; }
  .footer-meta { border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 4.5mm; font-size: 8.5pt; font-weight: 500; letter-spacing: 1.5px; color: #9CA3AF; text-transform: uppercase; }
  .footer-meta strong { color: #FCF6BA; font-weight: 600; }
  .h2-section { font-size: 24pt; font-weight: 600; letter-spacing: -0.02em; line-height: 1.18; color: #FFFFFF; margin-bottom: 6mm; }
  .gold-divider { width: 100%; height: 1px; background: linear-gradient(90deg, #BF953F, rgba(191,149,63,0.1)); margin-bottom: 9mm; }
  .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; align-items: start; }
  .body-copy { font-size: 10.8pt; font-weight: 400; color: #D1D5DB; line-height: 1.65; margin-bottom: 5mm; }
  .quote-box { border-left: 2px solid #BF953F; background: rgba(191, 149, 63, 0.06); border-radius: 0 8px 8px 0; padding: 4mm 6mm; margin-top: 7mm; font-size: 13pt; font-weight: 600; color: #FCF6BA; line-height: 1.45; }
  .service-row { display: grid; grid-template-columns: 24mm 1fr; gap: 6mm; padding: 7mm 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); align-items: start; }
  .service-num { font-size: 30pt; font-weight: 300; color: #BF953F; line-height: 1; letter-spacing: -0.03em; }
  .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5mm; }
  .service-title { font-size: 13pt; font-weight: 600; color: #FFFFFF; letter-spacing: -0.01em; }
  .badge-gold { background: rgba(191, 149, 63, 0.14); border: 1px solid rgba(191, 149, 63, 0.45); color: #FCF6BA; font-size: 7.5pt; font-weight: 600; padding: 1.2mm 3.5mm; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.8px; }
  .boxed-frame {
    border: 1px solid rgba(191, 149, 63, 0.35);
    border-radius: 12px;
    background: linear-gradient(145deg, rgba(191, 149, 63, 0.05) 0%, rgba(12, 14, 20, 0.85) 60%, #070707 100%);
    padding: 10mm 11mm;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .phase-table {
    width: 100%;
    border: 1px solid rgba(191, 149, 63, 0.35);
    border-radius: 8px;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    margin-top: 4.5mm;
  }
  .phase-table th {
    text-align: left;
    padding: 3mm 4.5mm;
    font-size: 10pt;
    font-weight: 600;
    color: #FCF6BA;
    border-bottom: 1px solid rgba(191, 149, 63, 0.35);
    background-color: rgba(191, 149, 63, 0.1);
  }
  .phase-table td {
    width: 50%;
    padding: 2.6mm 4.5mm;
    font-size: 9.3pt;
    color: #E5E7EB;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    line-height: 1.38;
  }
  .center-header { text-align: center; margin-bottom: 10mm; }
  .rule-item { display: grid; grid-template-columns: 16mm 1fr; gap: 4mm; padding: 6mm 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); align-items: start; }
  .rule-num { font-size: 26pt; font-weight: 300; color: #BF953F; line-height: 1; }
  .seal-footer { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10mm; background: transparent !important; }
  .seal-caption { margin-top: 5mm; font-size: 8.5pt; font-weight: 500; letter-spacing: 2.5px; color: #9CA3AF; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="top-action-bar">
    <span style="font-size: 11px; letter-spacing: 0.14em; color: #FCF6BA; font-weight: 600;">LHYO GROUP &nbsp;·&nbsp; CATÁLOGO PRIVADO PREPARADO PARA: ${ceo}</span>
    <button class="btn-download-pdf" onclick="window.print()">Descargar / Guardar en PDF (A4) ↓</button>
  </div>

  <svg style="display: none;">
    <symbol id="lhyo-monogram" viewBox="0 0 200 200">
      <path d="M25 65 L75 25 L75 140 L175 140 L152 178 L52 178 L52 140 L25 140 Z M43 74 L43 122 L57 122 L57 62 Z M75 154 L75 164 L142 164 L148 154 Z" fill="#FFFFFF" fill-rule="evenodd"/>
      <polygon points="88,20 108,5 108,122 88,122" fill="#FFFFFF"/>
    </symbol>
    <symbol id="lhyo-full-logo" viewBox="0 0 540 140">
      <path d="M15 48 L55 18 L55 102 L132 102 L115 130 L38 130 L38 102 L15 102 Z M29 55 L29 88 L41 88 L41 46 Z M55 113 L55 120 L106 120 L111 113 Z" fill="#F8F9FA" fill-rule="evenodd"/>
      <polygon points="65,16 81,4 81,88 65,88" fill="#BF953F"/>
      <text x="96" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="66" font-weight="700" fill="#F8F9FA" letter-spacing="1">HYO</text>
      <line x1="278" y1="26" x2="278" y2="96" stroke="#BF953F" stroke-width="2.5"/>
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
          <div class="eyebrow-confidential">CATÁLOGO PRIVADO OFICIAL<br>PRESENTACIÓN EJECUTIVA</div>
        </header>
        <div>
          <span style="font-size: 9.5pt; font-weight: 600; color: #BF953F; letter-spacing: 2.5px; text-transform: uppercase; display: block; margin-bottom: 4mm;">
            INNOVACIÓN, PRESENCIA DIGITAL Y AUTOMATIZACIÓN COMERCIAL
          </span>
          <h1 class="h1-hero">Soluciones digitales<br>para multiplicar<br>tus ventas.</h1>
          <div class="subtitle-hero">
            Páginas web de primer nivel, asistentes inteligentes que atienden a tus clientes las 24 horas y sistemas que organizan todo tu negocio de forma automática.
          </div>
        </div>
        <footer class="footer-meta">
          PREPARADO EXCLUSIVAMENTE PARA:<br>
          <strong>${ceo} &nbsp;·&nbsp; ${empresa}</strong>
        </footer>
      </div>
    </section>

    <!-- PÁGINA 2: POR QUÉ LO NECESITAS -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <span style="font-size: 9pt; font-weight: 600; color: #BF953F; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2.5mm;">
            VISIÓN ESTRATÉGICA
          </span>
          <h2 class="h2-section">El secreto de los negocios<br>que crecen sin detenerse</h2>
          <div class="gold-divider"></div>
          <div class="two-col-grid">
            <div>
              <p class="body-copy">
                Hoy en día, los clientes buscan rapidez, confianza y atención inmediata. Cuando una persona escribe a tu negocio y tarda horas en recibir respuesta, o entra a una página que no le transmite seguridad, simplemente se va con la competencia.
              </p>
              <p class="body-copy">
                Si todavía dependes de responder cada mensaje a mano, agendar citas una por una o anotar clientes de forma manual, estás perdiendo tiempo valioso y dejando escapar ventas todos los días.
              </p>
            </div>
            <div>
              <p class="body-copy">
                En Lhyo Group transformamos la imagen y el funcionamiento de tu empresa. Instalamos soluciones elegantes, rápidas y fáciles de usar que trabajan por ti día y noche para captar y atender más clientes.
              </p>
              <div class="quote-box">
                Tu tiempo es para dirigir y hacer crecer tu negocio.<br>Nuestro sistema se encarga del resto.
              </div>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP &nbsp;·&nbsp; INNOVACIÓN Y CRECIMIENTO COMERCIAL</footer>
      </div>
    </section>

    <!-- PÁGINA 3: NUESTROS 3 SERVICIOS PRINCIPALES -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <span style="font-size: 9pt; font-weight: 600; color: #BF953F; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2.5mm;">
            SOLUCIONES EMPRESARIALES A MEDIDA
          </span>
          <h2 class="h2-section">Nuestros Servicios Diseñados<br>para tu Empresa</h2>
          <div class="gold-divider"></div>

          <div class="service-row">
            <div class="service-num">01</div>
            <div>
              <div class="service-header">
                <div class="service-title">Asistentes Inteligentes 24/7 (WhatsApp e Instagram)</div>
                <span class="badge-gold">✦ Atención 24/7</span>
              </div>
              <p class="body-copy">
                Nunca más dejes a un cliente esperando. Creamos un asistente virtual entrenado con toda la información de tu negocio que responde consultas al instante, guía al cliente con amabilidad y agenda tus citas de venta incluso mientras descansas.
              </p>
            </div>
          </div>

          <div class="service-row">
            <div class="service-num">02</div>
            <div>
              <div class="service-header">
                <div class="service-title">Páginas Web Modernas y Catálogos Digitales</div>
                <span class="badge-gold">✦ Imagen Ejecutiva</span>
              </div>
              <p class="body-copy">
                Proyecta una imagen impecable y de alto prestigio. Desarrollamos tu página web rápida, elegante y muy fácil de usar en celulares y computadoras, diseñada para que tus visitantes conozcan tus servicios y te contraten con un solo clic.
              </p>
            </div>
          </div>

          <div class="service-row">
            <div class="service-num">03</div>
            <div>
              <div class="service-header">
                <div class="service-title">Organización Automática de Clientes (CRM)</div>
                <span class="badge-gold">✦ Orden Total</span>
              </div>
              <p class="body-copy">
                Ten el control absoluto de todas tus ventas en un solo lugar. Cada persona que se interesa o agenda contigo queda registrada y ordenada automáticamente con su nombre, contacto, presupuesto y servicio de interés, sin trabajo manual.
              </p>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP &nbsp;·&nbsp; CATÁLOGO DE SOLUCIONES EMPRESARIALES</footer>
      </div>
    </section>

    <!-- PÁGINA 4: EL PAQUETE COMPLETO -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div class="boxed-frame">
          <div>
            <span style="font-size: 8.5pt; font-weight: 600; color: #BF953F; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2mm;">
              ARQUITECTURA LLAVE EN MANO
            </span>
            <h2 class="h2-section" style="font-size: 20pt; margin-bottom: 4mm;">Sistema Integral Lhyo Group:<br>Todo tu negocio conectado y funcionando en automático</h2>
            <p class="body-copy" style="font-size: 10.2pt; line-height: 1.52; margin-bottom: 4mm;">
              Puedes contratar cualquiera de nuestros servicios por separado, o implementar nuestro Paquete Completo donde tu página web, tu asistente de WhatsApp y tu base de datos trabajan juntos para multiplicar tus resultados.
            </p>

            <table class="phase-table">
              <thead><tr><th colspan="2">Etapa 1 · Creación e Instalación Completa (Llave en Mano)</th></tr></thead>
              <tbody>
                <tr><td>✦ Diseño y programación de tu Página Web</td><td>✦ Configuración de tu Catálogo Interactivo</td></tr>
                <tr><td>✦ Entrenamiento de tu Asistente Inteligente</td><td>✦ Conexión directa con tu WhatsApp e Instagram</td></tr>
                <tr><td>✦ Instalación de tu Agenda de Citas Online</td><td>✦ Creación de tu Panel de Control de Clientes</td></tr>
                <tr><td>✦ Pruebas completas de funcionamiento</td><td>✦ Entrega lista para recibir clientes desde el día 1</td></tr>
              </tbody>
            </table>

            <table class="phase-table" style="margin-top: 5mm;">
              <thead><tr><th colspan="2">Etapa 2 · Acompañamiento, Soporte y Mejora Continua</th></tr></thead>
              <tbody>
                <tr><td>✦ Mantenimiento activo de toda tu plataforma</td><td>✦ Actualización de información y promociones</td></tr>
                <tr><td>✦ Ajuste continuo de respuestas del asistente</td><td>✦ Soporte técnico directo con nuestro equipo</td></tr>
                <tr><td>✦ Respaldo seguro de tu lista de clientes</td><td>✦ Optimización constante para mejorar tus ventas</td></tr>
                <tr><td>✦ Servidores rápidos y seguros las 24 horas</td><td>✦ Tranquilidad total sin complicaciones técnicas</td></tr>
              </tbody>
            </table>
          </div>
          <footer class="footer-meta" style="border-top: 1px solid rgba(191, 149, 63, 0.3); padding-top: 3.5mm; font-size: 8.2pt;">
            NOTA: TARIFAS PERSONALIZADAS EN REUNIÓN SEGÚN TU PAÍS Y SERVICIOS ELEGIDOS.
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
            <span style="font-size: 9pt; font-weight: 600; color: #BF953F; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 2.5mm;">
              PRÓXIMOS PASOS
            </span>
            <h2 class="h2-section" style="font-size: 23pt;">Cómo aprovechar al máximo<br>nuestra reunión personalizada</h2>
          </div>

          <div class="rule-item">
            <div class="rule-num">01</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Define tus prioridades:</strong> Piensa en cuál de los 3 servicios (o el paquete completo) le daría el mayor impulso a tu negocio en este momento.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">02</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Espacio tranquilo:</strong> Conéctate a nuestra llamada desde un lugar cómodo donde podamos conversar con calma y mostrarte cómo funcionará tu sistema.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">03</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#FCF6BA; font-weight:600;">Propuesta a tu medida:</strong> En la sesión te entregaremos los precios exactos correspondientes a tu país y el plan de trabajo paso a paso para comenzar.
            </p>
          </div>
        </div>

        <div class="seal-footer">
          <svg class="brand-logo-svg" width="230" height="60"><use href="#lhyo-full-logo"/></svg>
          <div class="seal-caption">LHYO GROUP &nbsp;·&nbsp; SOLUCIONES DIGITALES Y AUTOMATIZACIÓN</div>
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
