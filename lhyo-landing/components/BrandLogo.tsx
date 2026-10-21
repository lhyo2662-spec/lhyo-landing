"use client";

import { useState } from "react";

export default function BrandLogo() {
  const [hasCustomLogo, setHasCustomLogo] = useState(true);

  return (
    <a href="#" className="flex items-center gap-3.5 group">
      {hasCustomLogo ? (
        <img
          src="/logo.png"
          alt="Lhyo Group Logo"
          onError={() => setHasCustomLogo(false)}
          className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="w-10 h-10 border border-[#BF953F] bg-gradient-to-br from-[#BF953F]/20 via-[#070707] to-[#BF953F]/10 flex items-center justify-center font-bold text-[#FCF6BA] text-sm shadow-inner">
          LG
        </div>
      )}
      <div>
        <span className="font-bold tracking-widest text-sm text-white block leading-tight">
          LHYO GROUP
        </span>
        <span className="text-[11px] text-[#BF953F] font-medium tracking-wider block mt-0.5">
          SOLUCIONES DIGITALES & IA
        </span>
      </div>
    </a>
  );
}
