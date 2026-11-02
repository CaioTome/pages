import { PieceId, Player } from '../core/types';

export function getPieceSvg(pieceId: PieceId, player: Player, size: number = 64): string {
  const isWhite = player === 'white';
  // Palette
  const bgFill = isWhite ? '#f8fafc' : '#1e1b4b';
  const borderStroke = isWhite ? '#38bdf8' : '#e879f9';
  const mainColor = isWhite ? '#0284c7' : '#f43f5e';
  const secondaryColor = isWhite ? '#fbbf24' : '#c084fc';
  const detailColor = isWhite ? '#0f172a' : '#ffffff';

  // SVG internal glyphs for each of the 30 pieces
  let glyph = '';

  switch (pieceId) {
    // CLÁSSICAS
    case 'rei':
      glyph = `
        <!-- Coroa Real Clássica -->
        <path d="M22 46 L42 46 L44 32 L36 36 L32 24 L28 36 L20 32 Z" fill="${secondaryColor}" stroke="${detailColor}" stroke-width="2"/>
        <line x1="32" y1="18" x2="32" y2="24" stroke="${secondaryColor}" stroke-width="3" stroke-linecap="round"/>
        <line x1="29" y1="21" x2="35" y2="21" stroke="${secondaryColor}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="32" cy="16" r="2.5" fill="${detailColor}"/>
      `;
      break;

    case 'rainha':
      glyph = `
        <!-- Tiara com Jóias da Rainha -->
        <path d="M19 46 L45 46 L47 30 L39 37 L32 23 L25 37 L17 30 Z" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="17" cy="27" r="2.5" fill="${secondaryColor}"/>
        <circle cx="25" cy="34" r="2.5" fill="${secondaryColor}"/>
        <circle cx="32" cy="20" r="3" fill="${secondaryColor}"/>
        <circle cx="39" cy="34" r="2.5" fill="${secondaryColor}"/>
        <circle cx="47" cy="27" r="2.5" fill="${secondaryColor}"/>
      `;
      break;

    case 'torre':
      glyph = `
        <!-- Fortaleza Ameiada -->
        <path d="M22 46 L42 46 L41 30 L44 30 L44 22 L39 22 L39 26 L34 26 L34 22 L30 22 L30 26 L25 26 L25 22 L20 22 L20 30 L23 30 Z" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
        <rect x="29" y="34" width="6" height="8" rx="3" fill="${bgFill}"/>
      `;
      break;

    case 'bispo':
      glyph = `
        <!-- Mitra Clériga com Cruz -->
        <path d="M24 46 L40 46 L40 38 C40 28 32 20 32 20 C32 20 24 28 24 38 Z" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="32" cy="18" r="2.5" fill="${secondaryColor}"/>
        <path d="M30 32 L34 32 M32 28 L32 36" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      `;
      break;

    case 'cavalo':
      glyph = `
        <!-- Cavalo Nobre -->
        <path d="M22 46 L42 46 C42 44 41 38 38 34 C36 31 38 27 38 23 C38 18 34 16 30 18 L26 21 C24 23 23 27 24 29 L21 31 C19 33 21 37 24 37 C22 41 22 46 22 46 Z" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="33" cy="23" r="2" fill="${detailColor}"/>
      `;
      break;

    case 'peao':
      glyph = `
        <!-- Elmo de Peão -->
        <circle cx="32" cy="25" r="7" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
        <path d="M24 46 L40 46 C40 37 36 34 32 34 C28 34 24 37 24 46 Z" fill="${mainColor}" stroke="${detailColor}" stroke-width="2"/>
      `;
      break;

    // PEÇAS DO GATITO (10)
    case 'boto_cor_de_rosa':
      glyph = `
        <!-- Boto Saltitante com Coração -->
        <path d="M18 42 C20 30 28 22 36 22 C43 22 46 28 44 34 C42 38 34 40 26 44 Z" fill="#f472b6" stroke="${detailColor}" stroke-width="2"/>
        <path d="M36 22 C40 17 48 20 44 26 Z" fill="#ec4899"/>
        <circle cx="25" cy="30" r="2" fill="${detailColor}"/>
        <path d="M34 14 C34 14 36 11 39 13 C41 15 39 18 34 21 C29 18 27 15 29 13 C32 11 34 14 34 14 Z" fill="#f43f5e"/>
      `;
      break;

    case 'sniper':
      glyph = `
        <!-- Mira Telescópica / Retículo de Alta Precisão -->
        <circle cx="32" cy="32" r="14" fill="none" stroke="${mainColor}" stroke-width="3"/>
        <circle cx="32" cy="32" r="7" fill="none" stroke="${secondaryColor}" stroke-width="2"/>
        <line x1="32" y1="14" x2="32" y2="50" stroke="${detailColor}" stroke-width="2"/>
        <line x1="14" y1="32" x2="50" y2="32" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="32" cy="32" r="2" fill="#ef4444"/>
      `;
      break;

    case 'homem_bomba':
      glyph = `
        <!-- Bomba Redonda com Pavio Aceso -->
        <circle cx="32" cy="35" r="12" fill="#334155" stroke="${detailColor}" stroke-width="2"/>
        <rect x="29" y="20" width="6" height="4" rx="1" fill="#64748b"/>
        <path d="M32 20 Q35 14 42 16" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="43" cy="16" r="3" fill="#ef4444"/>
        <path d="M28 33 Q32 37 36 33" stroke="#f8fafc" stroke-width="2" fill="none" stroke-linecap="round"/>
      `;
      break;

    case 'principe':
      glyph = `
        <!-- Pequena Coroa de Príncipe com Penacho -->
        <path d="M22 46 L42 46 L44 34 L36 37 L32 27 L28 37 L20 34 Z" fill="${secondaryColor}" stroke="${detailColor}" stroke-width="2"/>
        <path d="M32 27 Q37 18 35 13 Q31 16 32 27 Z" fill="#38bdf8"/>
        <circle cx="32" cy="33" r="2" fill="${mainColor}"/>
      `;
      break;

    case 'arqueiro':
      glyph = `
        <!-- Arco e Flecha Élfico -->
        <path d="M22 20 Q38 32 22 44" fill="none" stroke="${mainColor}" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="20" x2="22" y2="44" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="18" y1="32" x2="44" y2="32" stroke="${secondaryColor}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M40 28 L46 32 L40 36 Z" fill="${secondaryColor}"/>
      `;
      break;

    case 'baratinha':
      glyph = `
        <!-- Baratinha Fofa e Indestrutível com Óculos/Antenas -->
        <ellipse cx="32" cy="35" rx="8" ry="11" fill="#78350f" stroke="${detailColor}" stroke-width="2"/>
        <path d="M28 25 Q22 15 16 16" fill="none" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
        <path d="M36 25 Q42 15 48 16" fill="none" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="28" cy="31" r="2" fill="#fbbf24"/>
        <circle cx="36" cy="31" r="2" fill="#fbbf24"/>
        <path d="M20 33 L14 30 M20 38 L13 40 M44 33 L50 30 M44 38 L51 40" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
      `;
      break;

    case 'construtor':
      glyph = `
        <!-- Capacete de Obra com Martelo/Tijolos -->
        <path d="M20 34 C20 24 44 24 44 34 L46 38 L18 38 Z" fill="#eab308" stroke="${detailColor}" stroke-width="2"/>
        <rect x="23" y="38" width="18" height="8" rx="2" fill="#b45309" stroke="${detailColor}" stroke-width="1.5"/>
        <line x1="32" y1="38" x2="32" y2="46" stroke="${detailColor}" stroke-width="1.5"/>
        <line x1="28" y1="20" x2="36" y2="28" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
      `;
      break;

    case 'mago':
      glyph = `
        <!-- Chapéu Pontudo de Mago com Estrelas -->
        <path d="M18 44 Q32 46 46 44 L38 24 L32 14 L26 24 Z" fill="#6366f1" stroke="${detailColor}" stroke-width="2"/>
        <ellipse cx="32" cy="44" rx="16" ry="4" fill="#4f46e5" stroke="${detailColor}" stroke-width="1.5"/>
        <polygon points="32,22 34,26 38,26 35,28 36,32 32,29 28,32 29,28 26,26 30,26" fill="#facc15"/>
      `;
      break;

    case 'papa':
      glyph = `
        <!-- Mitra Papal Imponente com Cruz Dourada Dupla -->
        <path d="M22 46 L42 46 C42 40 44 30 32 16 C20 30 22 40 22 46 Z" fill="#f8fafc" stroke="${detailColor}" stroke-width="2"/>
        <path d="M32 24 L32 40 M26 30 L38 30 M28 34 L36 34" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="32" cy="15" r="2.5" fill="#eab308"/>
      `;
      break;

    case 'guarda':
      glyph = `
        <!-- Escudo de Guarda Robusto com Insígnia -->
        <path d="M22 20 L42 20 C42 34 32 46 32 46 C32 46 22 34 22 20 Z" fill="#0284c7" stroke="${detailColor}" stroke-width="2.5"/>
        <path d="M32 24 L32 38 M26 30 L38 30" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
      `;
      break;

    // PEÇAS DA GATITA (14)
    case 'baleia_cinzenta':
      glyph = `
        <!-- Baleia Cinzenta Gigante com Jato d'água -->
        <path d="M16 38 C18 26 32 24 44 30 C48 32 50 38 46 42 C38 46 22 46 16 38 Z" fill="#94a3b8" stroke="${detailColor}" stroke-width="2"/>
        <path d="M16 38 L10 32 L12 42 Z" fill="#64748b"/>
        <circle cx="42" cy="34" r="2" fill="${detailColor}"/>
        <path d="M36 24 C36 18 33 16 30 16 M36 24 C38 18 42 16 44 18" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      `;
      break;

    case 'baleia_assassina':
      glyph = `
        <!-- Orca (Preta e Branca com Mancha) -->
        <path d="M16 38 C20 26 34 24 46 30 C50 33 48 39 44 42 C34 46 20 46 16 38 Z" fill="#0f172a" stroke="${detailColor}" stroke-width="2"/>
        <path d="M32 24 L36 16 L38 25 Z" fill="#0f172a"/>
        <ellipse cx="40" cy="33" rx="3" ry="2" fill="#ffffff"/>
        <circle cx="44" cy="35" r="1.5" fill="#38bdf8"/>
      `;
      break;

    case 'gatito_gasoso':
      glyph = `
        <!-- Gatinho com Fumaça / Máscara de Gás Fofa -->
        <circle cx="32" cy="34" r="10" fill="#a7f3d0" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="23,28 26,20 29,27" fill="#10b981"/>
        <polygon points="41,28 38,20 35,27" fill="#10b981"/>
        <circle cx="28" cy="34" r="3" fill="#065f46"/>
        <circle cx="36" cy="34" r="3" fill="#065f46"/>
        <path d="M30 46 Q24 44 26 40 Q32 38 34 42 Q38 44 42 41" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
      `;
      break;

    case 'gatito_apaixonado':
      glyph = `
        <!-- Gatinho com Olhos de Coração Radiante -->
        <circle cx="32" cy="33" r="11" fill="#fbcfe8" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="22,26 25,18 29,25" fill="#f43f5e"/>
        <polygon points="42,26 39,18 35,25" fill="#f43f5e"/>
        <!-- Olhos de coração -->
        <path d="M28 32 C28 30 26 29 25 30 C24 31 25 33 28 35 C31 33 32 31 31 30 C30 29 28 30 28 32 Z" fill="#e11d48"/>
        <path d="M36 32 C36 30 34 29 33 30 C32 31 33 33 36 35 C39 33 40 31 39 30 C38 29 36 30 36 32 Z" fill="#e11d48"/>
      `;
      break;

    case 'gatito_mahchia':
      glyph = `
        <!-- Bruxinha Mágica com Varinha de Estrela -->
        <circle cx="30" cy="34" r="9" fill="#e9d5ff" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="22,28 24,20 28,26" fill="#a855f7"/>
        <polygon points="38,28 36,20 32,26" fill="#a855f7"/>
        <line x1="36" y1="36" x2="48" y2="20" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="48,16 49,20 53,20 50,22 51,26 48,23 45,26 46,22 43,20 47,20" fill="#fbbf24"/>
      `;
      break;

    case 'sapo':
      glyph = `
        <!-- Sapo Encantado com Olhinhos Esbugalhados -->
        <ellipse cx="32" cy="36" rx="12" ry="9" fill="#4ade80" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="26" cy="27" r="4.5" fill="#22c55e" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="38" cy="27" r="4.5" fill="#22c55e" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="26" cy="27" r="2" fill="${detailColor}"/>
        <circle cx="38" cy="27" r="2" fill="${detailColor}"/>
        <path d="M26 38 Q32 42 38 38" fill="none" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
      `;
      break;

    case 'passaro_uratal':
      glyph = `
        <!-- Pássaro Urutau com Penas Hipnóticas -->
        <ellipse cx="32" cy="34" rx="9" ry="12" fill="#78716c" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="29" cy="28" r="4" fill="#facc15" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="29" cy="28" r="2" fill="#000000"/>
        <polygon points="36,28 44,30 36,32" fill="#f97316"/>
        <path d="M24 44 Q32 50 40 44" fill="none" stroke="#d6d3d1" stroke-width="2"/>
      `;
      break;

    case 'bela_adormecida':
      glyph = `
        <!-- Gatinha Dorminhoca com "Zzz" e Travesseirinho -->
        <ellipse cx="32" cy="36" rx="11" ry="8" fill="#fed7aa" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="23,31 25,24 28,30" fill="#f97316"/>
        <polygon points="41,31 39,24 36,30" fill="#f97316"/>
        <!-- Olhinhos fechados dormindo -->
        <path d="M26 35 Q28 37 30 35 M34 35 Q36 37 38 35" fill="none" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
        <!-- Zzz -->
        <text x="40" y="22" font-size="9" font-weight="bold" fill="#818cf8">Z</text>
        <text x="46" y="16" font-size="7" font-weight="bold" fill="#a5b4fc">z</text>
      `;
      break;

    case 'perereca':
      glyph = `
        <!-- Perereca Ágil em Posição de Salto -->
        <ellipse cx="32" cy="35" rx="10" ry="7" fill="#84cc16" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="25" cy="29" r="4" fill="#a3e635" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="39" cy="29" r="4" fill="#a3e635" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="25" cy="29" r="2" fill="#0f172a"/>
        <circle cx="39" cy="29" r="2" fill="#0f172a"/>
        <path d="M18 40 Q22 36 24 38 M46 40 Q42 36 40 38" stroke="${detailColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
      `;
      break;

    case 'goham':
      glyph = `
        <!-- Goham: Fofura Hipnótica e Bochechuda -->
        <circle cx="32" cy="34" r="12" fill="#fef08a" stroke="${detailColor}" stroke-width="2"/>
        <ellipse cx="25" cy="37" rx="3" ry="2" fill="#f472b6"/>
        <ellipse cx="39" cy="37" rx="3" ry="2" fill="#f472b6"/>
        <circle cx="27" cy="31" r="2" fill="${detailColor}"/>
        <circle cx="37" cy="31" r="2" fill="${detailColor}"/>
        <path d="M30 34 Q32 36 34 34" fill="none" stroke="${detailColor}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="32" cy="18" r="3" fill="#ec4899"/>
      `;
      break;

    case 'mirra':
      glyph = `
        <!-- Mirra: Gatinha Branca Valente com Laço Vermelho -->
        <circle cx="32" cy="34" r="10" fill="#ffffff" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="23,27 25,19 29,26" fill="#fbcfe8"/>
        <polygon points="41,27 39,19 35,26" fill="#fbcfe8"/>
        <circle cx="28" cy="33" r="2" fill="#0f172a"/>
        <circle cx="36" cy="33" r="2" fill="#0f172a"/>
        <path d="M31 36 L33 36" stroke="#f43f5e" stroke-width="2"/>
        <!-- Lacinho -->
        <polygon points="23,22 27,24 23,26" fill="#ef4444"/>
        <polygon points="27,22 23,24 27,26" fill="#ef4444"/>
      `;
      break;

    case 'quero_quero':
      glyph = `
        <!-- Pássaro Quero-quero com Esporão e Penacho -->
        <ellipse cx="30" cy="35" rx="10" ry="8" fill="#64748b" stroke="${detailColor}" stroke-width="2"/>
        <circle cx="35" cy="28" r="5" fill="#f8fafc" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="36" cy="27" r="1.5" fill="#ef4444"/>
        <polygon points="40,28 48,30 40,32" fill="#0f172a"/>
        <path d="M33 23 Q28 15 25 18" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      `;
      break;

    case 'tartaruga_maligna':
      glyph = `
        <!-- Casco Espinhoso Enfeitiçado com Olhos Maliciosos -->
        <path d="M20 40 C20 28 44 28 44 40 Z" fill="#15803d" stroke="${detailColor}" stroke-width="2"/>
        <polygon points="32,24 29,28 35,28" fill="#84cc16"/>
        <ellipse cx="44" cy="37" rx="4" ry="3" fill="#166534" stroke="${detailColor}" stroke-width="1.5"/>
        <circle cx="45" cy="36" r="1.5" fill="#dc2626"/>
      `;
      break;

    case 'pimentinha':
      glyph = `
        <!-- Pimenta Vermelha Ardente com Fogo -->
        <path d="M38 22 C34 22 28 26 26 34 C24 42 32 46 34 46 C34 46 34 38 40 32 C43 28 42 22 38 22 Z" fill="#dc2626" stroke="${detailColor}" stroke-width="2"/>
        <path d="M38 22 Q42 16 44 14" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
        <!-- Gotinhas de fogo / gelo ardente -->
        <circle cx="23" cy="28" r="2" fill="#38bdf8"/>
        <circle cx="43" cy="38" r="2.5" fill="#f97316"/>
      `;
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" class="piece-svg piece-${pieceId} player-${player}">
      <defs>
        <radialGradient id="grad-${pieceId}-${player}" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="${bgFill}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${bgFill}" stop-opacity="0.75"/>
        </radialGradient>
        <filter id="shadow-${pieceId}-${player}" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <!-- Base circular de medalhão -->
      <circle cx="32" cy="32" r="27" fill="url(#grad-${pieceId}-${player})" stroke="${borderStroke}" stroke-width="2.5" filter="url(#shadow-${pieceId}-${player})"/>
      <circle cx="32" cy="32" r="23" fill="none" stroke="${borderStroke}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
      <!-- Ilustração interna -->
      ${glyph}
    </svg>
  `.trim();
}
