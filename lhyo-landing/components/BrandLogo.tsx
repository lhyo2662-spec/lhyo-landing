"use client";

export default function BrandLogo() {
  return (
    <a href="#" className="flex items-center group select-none" aria-label="Lhyo Group Inicio">
      <svg
        viewBox="0 0 395 105"
        className="h-10 md:h-11 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Símbolo Geométrico "L" con base inferior en Y=70..95 */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 42 L40 18 L40 70 L94 70 L78 95 L28 95 L28 79 L10 79 Z M20 46 L30 38 L30 70 L20 70 Z M40 79 L80 79 L74 86 L40 86 Z"
          fill="#FFFFFF"
        />
        {/* Barra Vertical Secundaria de la "L" (X=48..58, termina arriba de la base en Y=61) */}
        <path
          d="M48 11 L58 3 L58 61 L48 61 Z"
          fill="#BF953F"
        />
        {/* Letra "H": Acercada horizontalmente (X=66) y separada verticalmente (termina en Y=61, dejando 9px libres sobre Y=70) */}
        <path
          d="M66 25 H78 V39 H95 V25 H107 V61 H95 V48 H78 V61 H66 V25 Z"
          fill="#FFFFFF"
        />
        {/* Letra "Y": Compactada junto a la H (X=111..151, Y=25..61) */}
        <path
          d="M125 46 L111 25 H124 L131 36 L138 25 H151 L137 46 V61 H125 V46 Z"
          fill="#FFFFFF"
        />
        {/* Letra "O": Compactada junto a la Y (Centro en X=171, Y=24..62) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M171 24 C182 24 191 32.5 191 43 C191 53.5 182 62 171 62 C160 62 151 53.5 151 43 C151 32.5 160 24 171 24 Z M171 33.5 C165.5 33.5 161.5 37.5 161.5 43 C161.5 48.5 165.5 52.5 171 52.5 C176.5 52.5 180.5 48.5 180.5 43 C180.5 37.5 176.5 33.5 171 33.5 Z"
          fill="#FFFFFF"
        />
        {/* Línea Divisoria Vertical "|" centrada con HYO | GROUP */}
        <rect x="208" y="21" width="2.2" height="44" fill="#BF953F" />
        {/* Texto "GROUP" alineado con la nueva altura */}
        <text
          x="225"
          y="53"
          fill="#E2E8F0"
          fontSize="29"
          fontWeight="400"
          letterSpacing="0.13em"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          GROUP
        </text>
      </svg>
    </a>
  );
}
