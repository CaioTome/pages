import {
  Player,
  Board,
  PieceId,
  PieceCategory,
  PresetArmy,
} from '../core/types';
import { PIECE_CATALOG } from '../core/catalog';
import {
  validateArmy,
  createStandardArmy,
  getPlayerSetupRanks,
  SetupValidationResult,
} from '../core/setupValidator';
import { getPieceSvg } from './pieceArt';
import { PieceInspector } from './PieceInspector';

const PRESETS_STORAGE_KEY = 'xadrex2_army_presets_v1';

export class SetupScreen {
  private element: HTMLElement;
  private player: Player = 'white';
  private board: Board = createStandardArmy('white');
  private selectedDeckPiece: PieceId | null = null;
  private selectedBoardSquare: { r: number; c: number } | null = null;
  private currentTab: PieceCategory = 'classic';
  private inspector: PieceInspector;
  private onCompleteCallback: (army: Board) => void = () => {};

  constructor(inspector: PieceInspector) {
    this.inspector = inspector;
    this.element = document.createElement('div');
    this.element.className = 'setup-screen-container';
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public startSetup(player: Player, onComplete: (army: Board) => void): void {
    this.player = player;
    this.onCompleteCallback = onComplete;
    this.board = createStandardArmy(player);
    this.selectedDeckPiece = null;
    this.selectedBoardSquare = null;
    this.currentTab = 'classic';
    this.render();
  }

  private render(): void {
    const isP1 = this.player === 'white';
    const validation = validateArmy(this.board, this.player);
    const ranks = getPlayerSetupRanks(this.player);

    this.element.innerHTML = `
      <header class="setup-header">
        <div class="player-badge player-${this.player}">
          <span class="player-icon">${isP1 ? '🐱' : '🐾'}</span>
          <div class="player-info">
            <h2>Montagem de Exército: ${isP1 ? 'Jogador 1 (Brancas / Gatito)' : 'Jogador 2 (Pretas / Gatita)'}</h2>
            <p>Posicione suas 16 peças livremente nas suas 2 fileiras iniciais.</p>
          </div>
        </div>
        <div class="setup-quick-actions">
          <button class="btn btn-secondary" id="btn-reset-standard" title="Restaurar formação clássica de xadrez">♟️ Padrão Clássico</button>
          <button class="btn btn-secondary" id="btn-clear-board" title="Esvaziar todas as casas">🗑️ Limpar</button>
          <button class="btn btn-secondary" id="btn-save-preset" title="Salvar exército no navegador">💾 Salvar Preset</button>
          <button class="btn btn-secondary" id="btn-load-preset" title="Carregar exército salvo">📂 Carregar Preset</button>
        </div>
      </header>

      <main class="setup-main-layout">
        <!-- Tabuleiro -->
        <section class="setup-board-section">
          <div class="board-frame">
            <div class="board-grid setup-grid" id="setup-board-grid"></div>
          </div>
          <div class="setup-status-bar ${validation.isValid ? 'valid' : 'invalid'}">
            <div class="status-message">
              ${
                validation.isValid
                  ? '<strong>✅ Exército Pronto!</strong> Todas as 16 peças posicionadas respeitando as regras.'
                  : `<strong>⚠️ Ajustes Necessários:</strong> ${validation.errors.map((e) => e.message).join(' | ')}`
              }
            </div>
            <button class="btn btn-primary btn-large" id="btn-confirm-army" ${validation.isValid ? '' : 'disabled'}>
              Confirmar Exército ➔
            </button>
          </div>
        </section>

        <!-- Menu Lateral em Abas -->
        <aside class="setup-deck-section">
          <div class="deck-tabs">
            <button class="deck-tab ${this.currentTab === 'classic' ? 'active' : ''}" data-tab="classic">
              Clássicas (6)
            </button>
            <button class="deck-tab ${this.currentTab === 'gatito' ? 'active' : ''}" data-tab="gatito">
              Gatito (10)
            </button>
            <button class="deck-tab ${this.currentTab === 'gatita' ? 'active' : ''}" data-tab="gatita">
              Gatita (14)
            </button>
          </div>

          <div class="deck-piece-list" id="deck-piece-list"></div>
        </aside>
      </main>
    `;

    this.renderBoard(ranks, validation);
    this.renderDeckList(validation);
    this.attachEventListeners();
  }

  private renderBoard(ranks: [number, number], _validation: SetupValidationResult): void {
    const grid = this.element.querySelector('#setup-board-grid')!;
    grid.innerHTML = '';

    // Board rows: for White, top is row 0, bottom is row 7.
    // For Black, let's keep it comfortable. If Black is setting up, ranks are 0 and 1.
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isSetupZone = ranks.includes(r);
        const isDark = (r + c) % 2 === 1;
        const cell = document.createElement('div');
        cell.className = `board-cell ${isDark ? 'dark' : 'light'} ${isSetupZone ? 'setup-zone' : 'neutral-zone'}`;
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);

        if (this.selectedBoardSquare?.r === r && this.selectedBoardSquare?.c === c) {
          cell.classList.add('selected');
        }

        const piece = this.board[r][c];
        if (piece) {
          const pieceContainer = document.createElement('div');
          pieceContainer.className = 'board-piece';
          pieceContainer.setAttribute('draggable', 'true');
          pieceContainer.innerHTML = getPieceSvg(piece.type, piece.player, 56);
          cell.appendChild(pieceContainer);

          // Drag handlers
          pieceContainer.addEventListener('dragstart', (e) => {
            e.dataTransfer?.setData('text/plain', JSON.stringify({ r, c, from: 'board' }));
          });
        }

        // Drop target
        if (isSetupZone) {
          cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('drag-over');
          });
          cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
          });
          cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const dataStr = e.dataTransfer?.getData('text/plain');
            if (dataStr) {
              const data = JSON.parse(dataStr);
              if (data.from === 'deck' && data.pieceId) {
                this.placePiece(data.pieceId, r, c);
              } else if (data.from === 'board') {
                this.swapOrMoveBoardSquares({ r: data.r, c: data.c }, { r, c });
              }
            }
          });

          // Click handling
          cell.addEventListener('click', () => {
            if (this.selectedDeckPiece) {
              this.placePiece(this.selectedDeckPiece, r, c);
            } else if (this.selectedBoardSquare) {
              this.swapOrMoveBoardSquares(this.selectedBoardSquare, { r, c });
              this.selectedBoardSquare = null;
              this.render();
            } else if (piece) {
              this.selectedBoardSquare = { r, c };
              this.render();
            }
          });
        }

        grid.appendChild(cell);
      }
    }
  }

  private renderDeckList(validation: SetupValidationResult): void {
    const list = this.element.querySelector('#deck-piece-list')!;
    list.innerHTML = '';

    const piecesInTab = Object.values(PIECE_CATALOG).filter(
      (p) => p.category === this.currentTab
    );

    for (const def of piecesInTab) {
      const currentCount = validation.pieceCounts[def.id] || 0;
      const isMaxReached = currentCount >= def.maxCopies;
      const isPapaConflict =
        (def.id === 'papa' && validation.pieceCounts['rainha'] > 0) ||
        (def.id === 'rainha' && validation.pieceCounts['papa'] > 0);
      const isSelected = this.selectedDeckPiece === def.id;

      const card = document.createElement('div');
      card.className = `deck-card ${isSelected ? 'selected' : ''} ${isMaxReached ? 'limit-reached' : ''}`;
      card.setAttribute('draggable', isMaxReached ? 'false' : 'true');

      card.innerHTML = `
        <div class="card-icon">${getPieceSvg(def.id, this.player, 48)}</div>
        <div class="card-details">
          <div class="card-title-row">
            <span class="card-name">${def.name}</span>
            <button class="card-info-btn" data-id="${def.id}" title="Ver detalhes das regras">ℹ️</button>
          </div>
          <span class="card-subtitle">${def.subtitle}</span>
          <div class="card-meta">
            <span class="count-pill ${isMaxReached ? 'full' : ''}">
              ${currentCount} / ${def.maxCopies}
            </span>
            ${isPapaConflict ? '<span class="conflict-badge">Conflito Papa/Rainha</span>' : ''}
          </div>
        </div>
      `;

      // Drag from deck
      card.addEventListener('dragstart', (e) => {
        if (isMaxReached) {
          e.preventDefault();
          return;
        }
        e.dataTransfer?.setData(
          'text/plain',
          JSON.stringify({ from: 'deck', pieceId: def.id })
        );
      });

      // Click to select brush
      card.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('card-info-btn')) {
          this.inspector.show(def.id, this.player);
          return;
        }
        if (this.selectedDeckPiece === def.id) {
          this.selectedDeckPiece = null;
        } else {
          this.selectedDeckPiece = def.id;
          this.selectedBoardSquare = null;
        }
        this.render();
      });

      list.appendChild(card);
    }
  }

  private placePiece(pieceId: PieceId, r: number, c: number): void {
    this.board[r][c] = {
      instanceId: `${this.player}-${pieceId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: pieceId,
      player: this.player,
      hasMoved: false,
    };
    this.render();
  }

  private swapOrMoveBoardSquares(from: { r: number; c: number }, to: { r: number; c: number }): void {
    const temp = this.board[to.r][to.c];
    this.board[to.r][to.c] = this.board[from.r][from.c];
    this.board[from.r][from.c] = temp;
    this.render();
  }

  private attachEventListeners(): void {
    // Tab switching
    const tabButtons = this.element.querySelectorAll('.deck-tab');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.tab as PieceCategory;
        if (tab) {
          this.currentTab = tab;
          this.render();
        }
      });
    });

    // Reset standard
    this.element.querySelector('#btn-reset-standard')?.addEventListener('click', () => {
      this.board = createStandardArmy(this.player);
      this.selectedDeckPiece = null;
      this.selectedBoardSquare = null;
      this.render();
    });

    // Clear board
    this.element.querySelector('#btn-clear-board')?.addEventListener('click', () => {
      const ranks = getPlayerSetupRanks(this.player);
      for (const r of ranks) {
        for (let c = 0; c < 8; c++) {
          this.board[r][c] = null;
        }
      }
      this.selectedDeckPiece = null;
      this.selectedBoardSquare = null;
      this.render();
    });

    // Save Preset
    this.element.querySelector('#btn-save-preset')?.addEventListener('click', () => {
      this.saveCurrentPreset();
    });

    // Load Preset
    this.element.querySelector('#btn-load-preset')?.addEventListener('click', () => {
      this.loadSavedPreset();
    });

    // Confirm army
    this.element.querySelector('#btn-confirm-army')?.addEventListener('click', () => {
      const val = validateArmy(this.board, this.player);
      if (val.isValid) {
        this.onCompleteCallback(this.board);
      }
    });
  }

  private saveCurrentPreset(): void {
    const name = window.prompt('Digite um nome para o seu Preset de Exército:', `Exército ${this.player === 'white' ? 'Gatito' : 'Gatita'} 1`);
    if (!name) return;

    const ranks = getPlayerSetupRanks(this.player);
    const layout: { r: number; c: number; pieceId: PieceId }[] = [];
    for (const r of ranks) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece) {
          // Normalize row relative to player's ranks (0 or 1)
          const relRow = r === ranks[0] ? 0 : 1;
          layout.push({ r: relRow, c, pieceId: piece.type });
        }
      }
    }

    const preset: PresetArmy = {
      id: `preset-${Date.now()}`,
      name,
      createdAt: Date.now(),
      layout,
    };

    const existingStr = localStorage.getItem(PRESETS_STORAGE_KEY);
    const presets: PresetArmy[] = existingStr ? JSON.parse(existingStr) : [];
    presets.push(preset);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    alert(`Preset "${name}" salvo com sucesso no navegador!`);
  }

  private loadSavedPreset(): void {
    const existingStr = localStorage.getItem(PRESETS_STORAGE_KEY);
    const presets: PresetArmy[] = existingStr ? JSON.parse(existingStr) : [];

    if (presets.length === 0) {
      alert('Nenhum preset encontrado no armazenamento local. Crie e salve um primeiro!');
      return;
    }

    const options = presets.map((p, idx) => `${idx + 1}: ${p.name}`).join('\n');
    const choice = window.prompt(`Escolha o número do preset a carregar:\n${options}`);
    if (!choice) return;

    const idx = parseInt(choice, 10) - 1;
    if (idx >= 0 && idx < presets.length) {
      const preset = presets[idx];
      const ranks = getPlayerSetupRanks(this.player);

      // Clear rows first
      for (const r of ranks) {
        for (let c = 0; c < 8; c++) {
          this.board[r][c] = null;
        }
      }

      // Populate from preset
      for (const item of preset.layout) {
        const actualRow = item.r === 0 ? ranks[0] : ranks[1];
        this.board[actualRow][item.c] = {
          instanceId: `${this.player}-${item.pieceId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: item.pieceId,
          player: this.player,
          hasMoved: false,
        };
      }
      this.render();
      alert(`Preset "${preset.name}" carregado!`);
    } else {
      alert('Opção inválida.');
    }
  }
}
