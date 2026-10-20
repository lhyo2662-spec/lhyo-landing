"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface AuditButtonProps {
  label?: string;
  serviceTag?: string;
}

export default function AuditTriggerButton({ 
  label = "AGENDAR AUDITORÍA", 
  serviceTag = "general_audit" 
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
      data-cal-config={`{"layout":"month_view","metadata":{"source_component":"${serviceTag}"}}`}
      className="btn-primary-lhyo"
    >
      {label}
    </button>
  );
}