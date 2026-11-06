"use client";

import AuditTriggerButton from "./AuditTriggerButton";

export default function DirectContactSection() {
  return (
    <section id="contacto" className="relative py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto rounded-3xl border border-[#C5A059]/45 bg-gradient-to-b from-[#090D1A]/95 to-[#050507]/95 p-8 sm:p-12 text-center shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#C5A059] mb-3">
          ✦ CANAL EJECUTIVO DIRECTO · ATENCIÓN INMEDIATA 24/7
        </p>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white max-w-3xl mx-auto leading-tight mb-4">
          ¿Listo para llevar la presencia digital y la automatización de su empresa al siguiente nivel?
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Reserve su sesión diagnóstica por videollamada para recibir de inmediato nuestro Catálogo Privado PDF con las 06 Soluciones Oficiales o comuníquese por nuestros canales corporativos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AuditTriggerButton
            label="AGENDAR REUNIÓN Y RECIBIR CATÁLOGO →"
            preselectedService="AUDITORÍA GENERAL (Sección Contacto)"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
          />
          <a
            href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20deseo%20informaci%C3%B3n%20sobre%20sus%2006%20soluciones%20empresariales."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-white/[0.04] border border-[#C5A059]/50 text-[#FCF6BA] font-bold text-xs uppercase tracking-wider hover:bg-[#C5A059]/15 transition"
          >
            ABRIR WHATSAPP DIRECTO →
          </a>
          <a
            href="mailto:ceo@lhyogroup.com"
            className="px-6 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200 font-semibold text-xs hover:border-[#C5A059]/40 transition"
          >
            ceo@lhyogroup.com
          </a>
        </div>
      </div>
    </section>
  );
}