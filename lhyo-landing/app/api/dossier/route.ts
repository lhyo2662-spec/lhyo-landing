import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ceo = (url.searchParams.get("ceo") || "CLIENTE DISTINGUIDO").toUpperCase();
  const empresa = (url.searchParams.get("empresa") || "DIRECCIÓN GENERAL").toUpperCase();

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>LHYO GROUP | Catálogo Privado de Soluciones - ${ceo}</title>
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
  .eyebrow-confidential { font-size: 9pt; color: #8E8E93; letter-spacing: 2px; text-transform: uppercase; text-align: right; line-height: 1.4; }
  .h1-hero { font-size: 40pt; font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: #F8F9FA; text-transform: uppercase; margin-bottom: 10mm; }
  .subtitle-hero { border-left: 3px solid #BF953F; padding-left: 6mm; font-size: 14pt; font-weight: 400; color: #D1D5DB; max-width: 148mm; line-height: 1.5; }
  .footer-meta { border-top: 1px solid rgba(191, 149, 63, 0.35); padding-top: 4.5mm; font-size: 9pt; letter-spacing: 1.5px; color: #8E8E93; text-transform: uppercase; }
  .footer-meta strong { color: #F8F9FA; font-weight: 700; }
  .h2-section { font-size: 26pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; text-transform: uppercase; color: #F8F9FA; margin-bottom: 7mm; }
  .gold-divider { width: 100%; height: 1px; background-color: #BF953F; margin-bottom: 9mm; opacity: 0.6; }
  .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; align-items: start; }
  .body-copy { font-size: 11pt; color: #CCCCCC; line-height: 1.62; margin-bottom: 5mm; }
  .quote-box { border-left: 3px solid #BF953F; padding-left: 6mm; margin-top: 8mm; font-size: 14.5pt; font-weight: 700; color: #F8F9FA; line-height: 1.4; }
  .service-row { display: grid; grid-template-columns: 28mm 1fr; gap: 6mm; padding: 7mm 0; border-bottom: 1px solid #1C1C1E; align-items: start; }
  .service-num { font-size: 34pt; font-weight: 800; color: #BF953F; line-height: 1; letter-spacing: -0.03em; }
  .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5mm; }
  .service-title { font-size: 13.5pt; font-weight: 700; color: #F8F9FA; text-transform: uppercase; }
  .badge-gold { background: linear-gradient(135deg, #BF953F 0%, #B38728 100%); color: #070707; font-size: 7.5pt; font-weight: 800; padding: 1.5mm 3.5mm; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; }
  
  /* PÁGINA 4 CALIBRADA AL MILÍMETRO PARA ENCUADRE PERFECTO DENTRO DEL MARCO */
  .boxed-frame {
    border: 1px solid #262629;
    background-color: rgba(17, 17, 18, 0.65);
    padding: 10mm 11mm;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .phase-table {
    width: 100%;
    border: 1px solid rgba(191, 149, 63, 0.5);
    border-collapse: collapse;
    margin-top: 4.5mm;
  }
  .phase-table th {
    text-align: left;
    padding: 3mm 4.5mm;
    font-size: 10.5pt;
    font-weight: 700;
    color: #F8F9FA;
    border-bottom: 1px solid rgba(191, 149, 63, 0.5);
    background-color: rgba(191, 149, 63, 0.08);
  }
  .phase-table td {
    width: 50%;
    padding: 2.6mm 4.5mm;
    font-size: 9.4pt;
    color: #D1D5DB;
    border-bottom: 1px solid #1C1C1E;
    border-right: 1px solid #1C1C1E;
    line-height: 1.35;
  }
  .center-header { text-align: center; margin-bottom: 10mm; }
  .rule-item { display: grid; grid-template-columns: 16mm 1fr; gap: 4mm; padding: 6mm 0; border-bottom: 1px solid #1C1C1E; align-items: start; }
  .rule-num { font-size: 28pt; font-weight: 800; color: #BF953F; line-height: 1; }
  .seal-footer { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10mm; background: transparent !important; }
  .seal-caption { margin-top: 5mm; font-size: 8.5pt; letter-spacing: 3px; color: #8E8E93; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="top-action-bar">
    <span style="font-size: 11px; letter-spacing: 0.15em; color: #F8F9FA; font-weight: 700;">LHYO GROUP // CATÁLOGO PRIVADO PREPARADO PARA: ${ceo}</span>
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
    <!-- PÁGINA 1: PORTADA -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <header class="header-bar">
          <svg class="brand-logo-svg" width="210" height="55"><use href="#lhyo-full-logo"/></svg>
          <div class="eyebrow-confidential">CATÁLOGO PRIVADO OFICIAL //<br>PRESENTACIÓN EJECUTIVA</div>
        </header>
        <div>
          <h1 class="h1-hero">SOLUCIONES DIGITALES<br>PARA MULTIPLICAR<br>TUS VENTAS.</h1>
          <div class="subtitle-hero">
            Páginas web de primer nivel, asistentes inteligentes que atienden a tus clientes las 24 horas y sistemas que organizan todo tu negocio de forma automática.
          </div>
        </div>
        <footer class="footer-meta">
          PREPARADO EXCLUSIVAMENTE PARA:<br>
          <strong>${ceo} &nbsp;|&nbsp; ${empresa}</strong>
        </footer>
      </div>
    </section>

    <!-- PÁGINA 2: POR QUÉ LO NECESITAS -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <h2 class="h2-section">EL SECRETO DE LOS<br>NEGOCIOS QUE CRECEN<br>SIN DETENERSE.</h2>
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
        <footer class="footer-meta">LHYO GROUP // INNOVACIÓN Y CRECIMIENTO COMERCIAL</footer>
      </div>
    </section>

    <!-- PÁGINA 3: NUESTROS 3 SERVICIOS PRINCIPALES -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div>
          <h2 class="h2-section">NUESTROS SERVICIOS<br>DISEÑADOS PARA TU EMPRESA</h2>
          <div class="gold-divider"></div>

          <div class="service-row">
            <div class="service-num">01</div>
            <div>
              <div class="service-header">
                <div class="service-title">ASISTENTES INTELIGENTES 24/7 (WHATSAPP E INSTAGRAM)</div>
                <span class="badge-gold">ATENCIÓN 24/7</span>
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
                <div class="service-title">PÁGINAS WEB MODERNAS Y CATÁLOGOS DIGITALES</div>
                <span class="badge-gold">WEB DE LUJO</span>
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
                <div class="service-title">ORGANIZACIÓN AUTOMÁTICA DE CLIENTES (CRM)</div>
                <span class="badge-gold">ORDEN TOTAL</span>
              </div>
              <p class="body-copy">
                Ten el control absoluto de todas tus ventas en un solo lugar. Cada persona que se interesa o agenda contigo queda registrada y ordenada automáticamente con su nombre, contacto, presupuesto y servicio de interés, sin trabajo manual.
              </p>
            </div>
          </div>
        </div>
        <footer class="footer-meta">LHYO GROUP // CATÁLOGO DE SOLUCIONES EMPRESARIALES</footer>
      </div>
    </section>

    <!-- PÁGINA 4: EL PAQUETE COMPLETO (ENCUADRE INTERNO CALIBRADO) -->
    <section class="page">
      <div class="watermark-container"><svg viewBox="0 0 200 200" width="100%" height="100%"><use href="#lhyo-monogram"/></svg></div>
      <div class="content-layer">
        <div class="boxed-frame">
          <div>
            <h2 class="h2-section" style="font-size: 20.5pt; margin-bottom: 4.5mm;">SISTEMA INTEGRAL LHYO GROUP:<br>TODO TU NEGOCIO CONECTADO<br>Y FUNCIONANDO EN AUTOMÁTICO</h2>
            <p class="body-copy" style="font-size: 10.3pt; line-height: 1.5; margin-bottom: 4mm;">
              Puedes contratar cualquiera de nuestros servicios por separado, o implementar nuestro Paquete Completo donde tu página web, tu asistente de WhatsApp y tu base de datos trabajan juntos para multiplicar tus resultados.
            </p>

            <table class="phase-table">
              <thead><tr><th colspan="2">Etapa 1: Creación e Instalación Completa (Llave en Mano)</th></tr></thead>
              <tbody>
                <tr><td>Diseño y programación de tu Página Web</td><td>Configuración de tu Catálogo Interactivo</td></tr>
                <tr><td>Entrenamiento de tu Asistente Inteligente</td><td>Conexión directa con tu WhatsApp e Instagram</td></tr>
                <tr><td>Instalación de tu Agenda de Citas Online</td><td>Creación de tu Panel de Control de Clientes</td></tr>
                <tr><td>Pruebas completas de funcionamiento</td><td>Entrega lista para recibir clientes desde el día 1</td></tr>
              </tbody>
            </table>

            <table class="phase-table" style="margin-top: 5.5mm;">
              <thead><tr><th colspan="2">Etapa 2: Acompañamiento, Soporte y Mejora Continua</th></tr></thead>
              <tbody>
                <tr><td>Mantenimiento activo de toda tu plataforma</td><td>Actualización de información y promociones</td></tr>
                <tr><td>Ajuste continuo de respuestas del asistente</td><td>Soporte técnico directo con nuestro equipo</td></tr>
                <tr><td>Respaldo seguro de tu lista de clientes</td><td>Optimización constante para mejorar tus ventas</td></tr>
                <tr><td>Servidores rápidos y seguros las 24 horas</td><td>Tranquilidad total sin complicaciones técnicas</td></tr>
              </tbody>
            </table>
          </div>
          <footer class="footer-meta" style="border-top: 1px solid rgba(191, 149, 63, 0.35); padding-top: 3.5mm; font-size: 8.5pt;">
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
            <h2 class="h2-section" style="font-size: 24pt;">CÓMO APROVECHAR AL MÁXIMO<br>NUESTRA REUNIÓN PERSONALIZADA</h2>
          </div>

          <div class="rule-item">
            <div class="rule-num">1</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#F8F9FA;">Define tus prioridades:</strong> Piensa en cuál de los 3 servicios (o el paquete completo) le daría el mayor impulso a tu negocio en este momento.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">2</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#F8F9FA;">Espacio tranquilo:</strong> Conéctate a nuestra llamada desde un lugar cómodo donde podamos conversar con calma y mostrarte cómo funcionará tu sistema.
            </p>
          </div>

          <div class="rule-item">
            <div class="rule-num">3</div>
            <p class="body-copy" style="margin-bottom:0;">
              <strong style="color:#F8F9FA;">Propuesta a tu medida:</strong> En la sesión te entregaremos los precios exactos correspondientes a tu país y el plan de trabajo paso a paso para comenzar.
            </p>
          </div>
        </div>

        <div class="seal-footer">
          <svg class="brand-logo-svg" width="230" height="60"><use href="#lhyo-full-logo"/></svg>
          <div class="seal-caption">LHYO GROUP &nbsp;|&nbsp; SOLUCIONES DIGITALES Y AUTOMATIZACIÓN</div>
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
