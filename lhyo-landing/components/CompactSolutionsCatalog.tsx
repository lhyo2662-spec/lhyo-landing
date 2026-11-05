// ============================================================================
// BLOQUE QUIRÚRGICO PARA CompactSolutionsCatalog.tsx (COTIZADOR DE 06 SOLUCIONES)
// Regla exacta:
// 1. Cuando "Paquete Completo (Todo Incluido)" está activo (allIncluded = true),
//    las 06 soluciones individuales quedan bloqueadas.
// 2. Al hacer clic en "Paquete Completo (Todo Incluido)", se desbloquea para elegir de 1 a 5.
// 3. Al elegir la 6ta solución individual, pasa automáticamente a "Paquete Completo (Todo Incluido)"
//    y vuelve a bloquear las individuales.
// ============================================================================
const SIX_OPTIONS = [
  "01 · Asistentes Inteligentes WhatsApp / IG (24/7)",
  "02 · Plataformas Web Modernas y Catálogos",
  "03 · Organización Automática de Clientes (CRM)",
  "04 · Automatización Total con Tecnología Propia",
  "05 · IA Personalizada con Memoria de su Empresa",
  "06 · Su Propia Plataforma Empresarial Todo-en-Uno"
];

const [allIncluded, setAllIncluded] = useState<boolean>(true);
const [selectedSix, setSelectedSix] = useState<string[]>([]);

const handleToggleAllIncluded = () => {
  if (allIncluded) {
    // Desbloquea para elegir de 1 a 5 soluciones individuales
    setAllIncluded(false);
    setSelectedSix([SIX_OPTIONS[0]]);
  } else {
    // Activa Todo Incluido y bloquea las 06 soluciones individuales
    setAllIncluded(true);
    setSelectedSix([]);
  }
};

const handleToggleIndividualSolution = (item: string) => {
  // Si Todo Incluido está activo, no permite pulsar las opciones individuales
  if (allIncluded) return;

  const exists = selectedSix.includes(item);
  let updated: string[];
  if (exists) {
    if (selectedSix.length === 1) return; // Mantiene al menos 1 seleccionada
    updated = selectedSix.filter((x) => x !== item);
  } else {
    updated = [...selectedSix, item];
  }

  // REGLA DE ORO: Si elige las 6 soluciones juntas, pasa automáticamente a Todo Incluido
  if (updated.length >= 6) {
    setAllIncluded(true);
    setSelectedSix([]);
    return;
  }

  setSelectedSix(updated);
};

const selectedPackageSummary = allIncluded
  ? "Paquete Completo (Todo Incluido · Las 06 Soluciones)"
  : selectedSix.join(" + ");