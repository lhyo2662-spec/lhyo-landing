"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface AuditButtonProps {
  label?: string;
  selectedPlan?: string;
  fullWidth?: boolean;
}

export default function AuditTriggerButton({ 
  label = "AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO", 
  selectedPlan = "AUDITORÍA GENERAL (Botón Principal)",
  fullWidth = false
}: AuditButtonProps) {
  
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "auditoria-lhyo" });
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#BF953F" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <button
      data-cal-namespace="auditoria-lhyo"
      data-cal-link="lhyonneth-araque-hdkdtz/auditoria-sistemas"
      data-cal-config={JSON.stringify({
        layout: "month_view",
        plan_elegido: selectedPlan,
        notes: `Selección del cliente en la web: ${selectedPlan}`,
        metadata: { source_component: selectedPlan }
      })}
      className={`btn-primary-lhyo ${fullWidth ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
}
