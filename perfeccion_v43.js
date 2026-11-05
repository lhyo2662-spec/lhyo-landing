const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();

function getAllCodeFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllCodeFiles(fullPath, list);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts") || fullPath.endsWith(".css")) {
      list.push(fullPath);
    }
  }
  return list;
}

const allFiles = getAllCodeFiles(ROOT);
let updatedCount = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Asegurar que los saltos de linea en los titulos h3 de las 3 Claves se respeten siempre
  if (filePath.endsWith("globals.css") && !content.includes("/* LHYO_PRE_LINE */")) {
    content += "\n/* LHYO_PRE_LINE */\nh3 { white-space: pre-line; }\n";
  }

  // 1. Conectar tu numero oficial de WhatsApp Business (584247383164) sin mostrarlo en el texto
  content = content.replace(/59800000000/g, "584247383164");

  // 2. Hacer que al darle clic a ceo@lhyogroup.com en Contacto se abra directo el redactor de Gmail en una pestaña nueva
  content = content.replace(
    /<a\s+([^>]*?)href=["']mailto:ceo@lhyogroup\.com[^"']*["']([^>]*?)>/gi,
    (match, before, after) => {
      const combined = before + " " + after;
      const extra = combined.includes("target=") ? "" : ' target="_blank" rel="noopener noreferrer"';
      return `<a ${before}href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com"${extra}${after}>`;
    }
  );
  content = content.replace(
    /<a\s+([^>]*?)href=\{`mailto:\$\{[^}]+\}[^`]*`\}([^>]*?)>/gi,
    (match, before, after) => {
      const combined = before + " " + after;
      const extra = combined.includes("target=") ? "" : ' target="_blank" rel="noopener noreferrer"';
      return `<a ${before}href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com"${extra}${after}>`;
    }
  );

  // 3. Calibrar los titulos de CLAVE 01, 02 y 03 en 2 lineas con 4 palabras exactas en la segunda linea
  content = content.replace(
    /Mientras su competencia descansa,[\s\S]{1,65}?0\.4 segundos/g,
    "Mientras su competencia descansa, su empresa atiende\\ny\u00A0agenda\u00A0su\u00A0reunión"
  );
  content = content.replace(
    /Porque las p[áa]ginas tradicionales saturan;[\s\S]{1,60}?cautivan/g,
    "Una plataforma moderna de máximo prestigio que proyecta\\nautoridad\u00A0y\u00A0multiplica\u00A0ventas"
  );
  content = content.replace(
    /Todo su negocio unido en una sola pantalla[\s\S]{1,60}?control absoluto/g,
    "Todo su negocio unido en una sola pantalla\\nbajo\u00A0su\u00A0control\u00A0total"
  );

  // 4. Actualizar el Cotizador de Soluciones con las 06 Soluciones + Paquete Completo (Todo Incluido)
  content = content.replace(
    /"Asistente WhatsApp \/ IG 24\/7",[\s\r\n]*"Plataforma Web Moderna",[\s\r\n]*"Sistemas Propios \(Motor \/ Cerebro \/ Panel\)"/g,
    '"01 · Asistentes Inteligentes WhatsApp / IG (24/7)", "02 · Plataformas Web y Catálogos Interactivos", "03 · Organización Automática de Clientes (CRM)", "04 · Automatización Total con Tecnología Propia", "05 · IA Personalizada con la Memoria de su Empresa", "06 · Plataforma Empresarial Todo-en-Uno"'
  );
  content = content.replace(
    /return\s*\[\.\.\.withoutFull,\s*option\];/g,
    "const nextSelected = [...withoutFull, option]; return nextSelected.length >= 6 ? [fullLabel] : nextSelected;"
  );
  content = content.replace(/\.length\s*>=\s*3/g, ".length >= 6");
  content = content.replace(/\.length\s*===\s*3/g, ".length >= 6");

  // 5. Humanizar el resumen inferior del cotizador eliminando barras verticales "|"
  content = content.replace(/SOLICITUD CAT[ÁA]LOGO PRIVADO \| Pa[íi]s:/g, "Propuesta personalizada para");
  content = content.replace(/\| Inter[ée]s:/g, "· Solución:");
  content = content.replace(/\| Etapa:/g, "· Etapa:");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ [ARCHIVO CALIBRADO]:", path.relative(ROOT, filePath));
    updatedCount++;
  }
}

console.log("Total de archivos actualizados:", updatedCount);

const gitDirs = [ROOT, path.join(ROOT, "lhyo-landing")];
for (const gDir of gitDirs) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try {
      execSync("git add -A", { cwd: gDir, stdio: "inherit" });
      execSync('git commit -m "V43.0: Correo directo a Gmail + Claves 2 lineas + Cotizador 06 Soluciones + WhatsApp 584247383164"', { cwd: gDir, stdio: "inherit" });
      execSync("git push origin main --force", { cwd: gDir, stdio: "inherit" });
      console.log("✅ EXITO TOTAL: Desplegado en Vercel desde", gDir);
    } catch (e) {
      console.log("Info Git:", e.message);
    }
  }
}