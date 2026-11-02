import { PieceId, Player } from '../core/types';
import { PIECE_CATALOG } from '../core/catalog';
import { getPieceSvg } from './pieceArt';

export class PieceInspector {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'inspector-overlay hidden';
    this.overlay.innerHTML = `
      <div class="inspector-card" role="dialog" aria-modal="true">
        <button class="inspector-close" aria-label="Fechar">&times;</button>
        <div class="inspector-header">
          <div class="inspector-icon" id="inspector-icon"></div>
          <div class="inspector-titles">
            <span class="inspector-category-badge" id="inspector-category"></span>
            <h3 class="inspector-name" id="inspector-name"></h3>
            <span class="inspector-subtitle" id="inspector-subtitle"></span>
          </div>
        </div>
        <div class="inspector-body">
          <div class="inspector-section">
            <h4>Como se move e age</h4>
            <p id="inspector-desc"></p>
          </div>
          <div class="inspector-stats" id="inspector-stats"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    const closeBtn = this.overlay.querySelector('.inspector-close')!;
    closeBtn.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  public show(pieceId: PieceId, player: Player = 'white'): void {
    const def = PIECE_CATALOG[pieceId];
    if (!def) return;

    const iconEl = this.overlay.querySelector('#inspector-icon')!;
    const nameEl = this.overlay.querySelector('#inspector-name')!;
    const subtitleEl = this.overlay.querySelector('#inspector-subtitle')!;
    const categoryEl = this.overlay.querySelector('#inspector-category')!;
    const descEl = this.overlay.querySelector('#inspector-desc')!;
    const statsEl = this.overlay.querySelector('#inspector-stats')!;

    iconEl.innerHTML = getPieceSvg(pieceId, player, 72);
    nameEl.textContent = def.name;
    subtitleEl.textContent = def.subtitle;

    const categoryNames = {
      classic: 'Clássica',
      gatito: 'Peças do Gatito',
      gatita: 'Peças da Gatita',
    };
    categoryEl.textContent = categoryNames[def.category];
    categoryEl.className = `inspector-category-badge badge-${def.category}`;

    descEl.textContent = def.description;

    let statsHtml = `
      <div class="stat-pill"><strong>Limite:</strong> até ${def.maxCopies} no exército</div>
    `;
    if (def.isRoyal) {
      statsHtml += `<div class="stat-pill stat-royal">👑 Peça Real (Sujeita a Xeque)</div>`;
    }
    if (def.isImmune) {
      statsHtml += `<div class="stat-pill stat-immune">🛡️ Imune a Capturas e Feitiços</div>`;
    }
    if (def.cannotCapture) {
      statsHtml += `<div class="stat-pill stat-peace">🕊️ Não Captura Peças</div>`;
    }
    if (pieceId === 'papa') {
      statsHtml += `<div class="stat-pill stat-warning">⚠️ Não pode coexistir com Rainha</div>`;
    }

    statsEl.innerHTML = statsHtml;
    this.overlay.classList.remove('hidden');
  }

  public hide(): void {
    this.overlay.classList.add('hidden');
  }
}
