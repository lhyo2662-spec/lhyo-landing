"use client";

export default function BrandLogo() {
  return (
    <a href="#" className="flex items-center gap-4 group select-none" aria-label="Lhyo Group Inicio">
      <div className="flex items-center">
        {/* ISOTIPO OFICIAL "L" GEOMÉTRICO + TEXTO "HYO | GROUP" (IMAGEN 7) */}
        <svg
          viewBox="0 0 430 110"
          className="h-10 md:h-11 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Símbolo Geométrico "L" */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
            fill="#FFFFFF"
          />
          {/* Barra Vertical Secundaria de la "L" */}
          <path
            d="M48 11 L58 3 L58 63 L48 63 Z"
            fill="#BF953F"
          />
          {/* Letras "HYO" en Geometría Sólida */}
          <path
            d="M82 32 H94 V47 H114 V32 H126 V70 H114 V57 H94 V70 H82 V32 Z"
            fill="#FFFFFF"
          />
          <path
            d="M148 54 L132 32 H146 L154 44 L162 32 H176 L160 54 V70 H148 V54 Z"
            fill="#FFFFFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M202 31 C214 31 224 40 224 51 C224 62 214 71 202 71 C190 71 180 62 180 51 C180 40 190 31 202 31 Z M202 41 C196 41 192 45 192 51 C192 57 196 61 202 61 C208 61 212 57 212 51 C212 45 208 41 202 41 Z"
            fill="#FFFFFF"
          />
          {/* Línea Divisoria Vertical "|" */}
          <rect x="244" y="28" width="2.5" height="46" fill="#BF953F" />
          {/* Texto "GROUP" */}
          <text
            x="264"
            y="61"
            fill="#E2E8F0"
            fontSize="31"
            fontWeight="400"
            letterSpacing="0.14em"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            GROUP
          </text>
        </svg>
      </div>
    </a>
  );
}
