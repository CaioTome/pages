import {
  MatchState,
  Position,
  ActionCandidate,
  OrientationMode,
  Board,
} from '../core/types';
import {
  gameReducer,
  createInitialMatchState,
  GameEvent,
} from '../core/reducer';
import { PIECE_CATALOG } from '../core/catalog';
import { getPieceSvg } from './pieceArt';
import { PieceInspector } from './PieceInspector';
import { arePositionsEqual, colToLetter, isWithinBoard } from '../core/moveGenerator';

export class MatchScreen {
  private element: HTMLElement;
  private state: MatchState;
  private stateHistory: MatchState[] = [];
  private whiteArmy: Board;
  private blackArmy: Board;
  private orientation: OrientationMode = 'pc_fixed';
  private inspector: PieceInspector;
  private onRematchCallback: () => void = () => {};
  private onNewSetupCallback: () => void = () => {};

  constructor(inspector: PieceInspector) {
    this.inspector = inspector;
    this.element = document.createElement('div');
    this.element.className = 'match-screen-container';
    this.whiteArmy = [];
    this.blackArmy = [];
    this.state = createInitialMatchState(this.whiteArmy, this.blackArmy);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public startMatch(
    whiteArmy: Board,
    blackArmy: Board,
    onRematch: () => void,
    onNewSetup: () => void
  ): void {
    this.whiteArmy = whiteArmy;
    this.blackArmy = blackArmy;
    this.onRematchCallback = onRematch;
    this.onNewSetupCallback = onNewSetup;
    this.state = createInitialMatchState(whiteArmy, blackArmy);
    this.stateHistory = [];
    this.render();
  }

  private dispatch(event: GameEvent): void {
    if (event.type === 'EXECUTE_ACTION' || event.type === 'RESPOND_GUARD') {
      this.stateHistory.push(JSON.parse(JSON.stringify(this.state)));
    }
    this.state = gameReducer(this.state, event);
    this.render();
  }

  private undo(): void {
    if (this.stateHistory.length > 0) {
      this.state = this.stateHistory.pop()!;
      this.render();
    }
  }

  private render(): void {
    const isP1 = this.state.turn === 'white';
    const isUratalActive = this.state.lastUratalScreechTurn?.player === this.state.turn;

    // Orientation class for board
    let boardOrientationClass = '';
    if (this.orientation === 'turn_rotate' && !isP1) {
      boardOrientationClass = 'rotate-180';
    } else if (this.orientation === 'table_face_to_face') {
      boardOrientationClass = 'table-mode';
    }

    this.element.innerHTML = `
      <header class="match-header">
        <div class="turn-indicator player-${this.state.turn}">
          <span class="player-icon">${isP1 ? '🐱' : '🐾'}</span>
          <div class="turn-text">
            <h3>Vez do ${isP1 ? 'Jogador 1 (Brancas / Gatito)' : 'Jogador 2 (Pretas / Gatita)'}</h3>
            <span>Rodada ${this.state.fullMoves}</span>
          </div>
        </div>

        <div class="match-controls">
          <div class="orientation-select-wrap">
            <label for="orientation-select">Orientação:</label>
            <select id="orientation-select" class="select-control">
              <option value="pc_fixed" ${this.orientation === 'pc_fixed' ? 'selected' : ''}>💻 PC (Fixo)</option>
              <option value="turn_rotate" ${this.orientation === 'turn_rotate' ? 'selected' : ''}>🔄 Girar por Turno</option>
              <option value="table_face_to_face" ${this.orientation === 'table_face_to_face' ? 'selected' : ''}>🪑 Mesa (Frente a Frente)</option>
            </select>
          </div>
          <button class="btn btn-secondary" id="btn-undo" ${this.stateHistory.length > 0 ? '' : 'disabled'}>
            ↩ Desfazer
          </button>
          <button class="btn btn-secondary" id="btn-rematch">
            🔄 Revanche
          </button>
          <button class="btn btn-secondary" id="btn-new-setup">
            ⚙️ Nova Montagem
          </button>
        </div>
      </header>

      ${
        this.state.inCheck
          ? `<div class="check-banner">⚠️ ATENÇÃO: XEQUE! Sua peça Real está sob ataque!</div>`
          : ''
      }

      ${
        isUratalActive
          ? `<div class="screech-banner">🦅 GRITO DO URATAL ATIVO: Movimentos permitidos apenas para casas que maximizam a distância ao pássaro!</div>`
          : ''
      }

      <main class="match-main-layout">
        <!-- Tabuleiro -->
        <div class="board-frame">
          <div class="board-grid match-grid ${boardOrientationClass}" id="match-board-grid"></div>
        </div>

        <!-- Painel Lateral: Histórico e Ações -->
        <aside class="match-sidebar">
          <div class="sidebar-section">
            <h4>Registro de Batalha</h4>
            <div class="history-log" id="history-log">
              ${this.state.history.map((h) => `<div class="history-item">${h}</div>`).join('')}
            </div>
          </div>
          <div class="sidebar-section">
            <p class="match-hint">💡 <em>Dica:</em> Clique com o botão direito ou clique no ícone (ℹ️) para inspecionar qualquer peça e rever seus poderes especiais.</p>
          </div>
        </aside>
      </main>

      <!-- Sub-step e Reaction Overlays -->
      <div id="substep-container"></div>
    `;

    this.renderBoard();
    this.renderSubSteps();
    this.attachEventListeners();
  }

  private renderBoard(): void {
    const grid = this.element.querySelector('#match-board-grid')!;
    grid.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        const cell = document.createElement('div');
        cell.className = `board-cell ${isDark ? 'dark' : 'light'}`;
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);

        // Highlight selected pos
        if (this.state.selectedPos && arePositionsEqual(this.state.selectedPos, { r, c })) {
          cell.classList.add('selected');
        }

        // Highlight action targets
        const matchingActions = this.state.validActions.filter((a) => {
          if (arePositionsEqual(a.to, { r, c })) return true;
          if (a.target && arePositionsEqual(a.target, { r, c })) return true;
          return false;
        });

        if (matchingActions.length > 0) {
          const act = matchingActions[0];
          const marker = document.createElement('div');
          marker.className = `action-marker marker-${act.badgeColor}`;
          marker.title = act.description;
          cell.appendChild(marker);

          cell.addEventListener('click', (e) => {
            e.stopPropagation();
            if (act.type === 'MAGO_SWAP') {
              this.startMagoSwap({ r, c });
            } else {
              this.dispatch({ type: 'EXECUTE_ACTION', action: act });
            }
          });
        }

        const piece = this.state.board[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = `board-piece ${piece.player === 'black' && this.orientation === 'table_face_to_face' ? 'upside-down' : ''} ${piece.frozenRounds ? 'frozen-piece' : ''}`;
          pieceEl.innerHTML = getPieceSvg(piece.type, piece.player, 56);

          if (piece.frozenRounds) {
            const freezeBadge = document.createElement('span');
            freezeBadge.className = 'freeze-badge';
            freezeBadge.textContent = '❄️';
            pieceEl.appendChild(freezeBadge);
          }

          // Inspect on right click or double click
          pieceEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.inspector.show(piece.type, piece.player);
          });

          cell.appendChild(pieceEl);

          // Click handling for selecting piece
          if (matchingActions.length === 0) {
            cell.addEventListener('click', () => {
              if (piece.player === this.state.turn) {
                if (this.state.selectedPos && arePositionsEqual(this.state.selectedPos, { r, c })) {
                  this.dispatch({ type: 'DESELECT' });
                } else {
                  this.dispatch({ type: 'SELECT_PIECE', pos: { r, c } });
                }
              } else {
                this.inspector.show(piece.type, piece.player);
              }
            });
          }
        } else {
          // Empty cell click
          if (matchingActions.length === 0) {
            cell.addEventListener('click', () => {
              if (this.state.selectedPos) {
                this.dispatch({ type: 'DESELECT' });
              }
            });
          }
        }

        grid.appendChild(cell);
      }
    }
  }

  private startMagoSwap(magoPos: Position): void {
    // Collect adjacent squares around Mago
    const adjSquares: Position[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = magoPos.r + dr;
        const nc = magoPos.c + dc;
        if (isWithinBoard(nr, nc)) {
          const occ = this.state.board[nr][nc];
          if (!occ || occ.type !== 'baratinha') {
            adjSquares.push({ r: nr, c: nc });
          }
        }
      }
    }

    const container = this.element.querySelector('#substep-container')!;
    container.innerHTML = `
      <div class="substep-modal-overlay">
        <div class="substep-modal-card">
          <h3>🪄 Habilidade do Mago: Transmutação Espacial</h3>
          <p>Selecione a <strong>1ª casa vizinha</strong> para permutar:</p>
          <div class="mago-targets-grid" id="mago-grid-1">
            ${adjSquares
              .map(
                (sq) => `
              <button class="btn btn-secondary mago-sq-btn" data-r="${sq.r}" data-c="${sq.c}">
                ${colToLetter(sq.c)}${8 - sq.r} ${this.state.board[sq.r][sq.c] ? `(${PIECE_CATALOG[this.state.board[sq.r][sq.c]!.type].name})` : '(Vazio)'}
              </button>
            `
              )
              .join('')}
          </div>
          <button class="btn btn-secondary" id="btn-cancel-mago">Cancelar</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-cancel-mago')?.addEventListener('click', () => {
      container.innerHTML = '';
    });

    container.querySelectorAll('.mago-sq-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = parseInt((btn as HTMLElement).dataset.r!, 10);
        const c = parseInt((btn as HTMLElement).dataset.c!, 10);
        this.selectMagoFirst({ r, c }, adjSquares);
      });
    });
  }

  private selectMagoFirst(firstPos: Position, allAdj: Position[]): void {
    const remaining = allAdj.filter((p) => !arePositionsEqual(p, firstPos));
    const container = this.element.querySelector('#substep-container')!;
    container.innerHTML = `
      <div class="substep-modal-overlay">
        <div class="substep-modal-card">
          <h3>🪄 Mago: 1ª Casa Escolhida (${colToLetter(firstPos.c)}${8 - firstPos.r})</h3>
          <p>Agora selecione a <strong>2ª casa vizinha</strong> para trocar de lugar:</p>
          <div class="mago-targets-grid" id="mago-grid-2">
            ${remaining
              .map(
                (sq) => `
              <button class="btn btn-secondary mago-sq-btn" data-r="${sq.r}" data-c="${sq.c}">
                ${colToLetter(sq.c)}${8 - sq.r} ${this.state.board[sq.r][sq.c] ? `(${PIECE_CATALOG[this.state.board[sq.r][sq.c]!.type].name})` : '(Vazio)'}
              </button>
            `
              )
              .join('')}
          </div>
          <button class="btn btn-secondary" id="btn-cancel-mago">Cancelar</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-cancel-mago')?.addEventListener('click', () => {
      container.innerHTML = '';
    });

    container.querySelectorAll('.mago-sq-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = parseInt((btn as HTMLElement).dataset.r!, 10);
        const c = parseInt((btn as HTMLElement).dataset.c!, 10);
        this.dispatch({
          type: 'SELECT_MAGO_FIRST_TARGET',
          firstPos,
        });
        this.dispatch({
          type: 'SELECT_MAGO_SECOND_TARGET',
          secondPos: { r, c },
        });
        container.innerHTML = '';
      });
    });
  }

  private renderSubSteps(): void {
    const container = this.element.querySelector('#substep-container')!;
    container.innerHTML = '';

    // 1. Guard reaction
    if (this.state.pendingReaction) {
      const rx = this.state.pendingReaction;
      const targetName = PIECE_CATALOG[rx.targetPiece.type].name;
      container.innerHTML = `
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">🛡️</div>
            <h3>Reação Defensiva do Guarda!</h3>
            <p>O <strong>${targetName}</strong> aliado em <strong>${colToLetter(rx.targetPos.c)}${8 - rx.targetPos.r}</strong> está prestes a ser capturado!</p>
            <p>O <strong>Guarda</strong> adjacente deseja trocar de lugar e se sacrificar no lugar dele?</p>
            <div class="modal-buttons">
              <button class="btn btn-primary btn-large" id="btn-guard-yes">Sim, Sacrificar o Guarda! 🛡️</button>
              <button class="btn btn-secondary" id="btn-guard-no">Não, Deixar Capturar ❌</button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-guard-yes')?.addEventListener('click', () => {
        this.dispatch({ type: 'RESPOND_GUARD', sacrifice: true });
      });
      container.querySelector('#btn-guard-no')?.addEventListener('click', () => {
        this.dispatch({ type: 'RESPOND_GUARD', sacrifice: false });
      });
      return;
    }

    // 2. Homem Bomba decision
    if (this.state.pendingSubStep?.type === 'HOMEM_BOMBA_DECISION') {
      container.innerHTML = `
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">💥</div>
            <h3>Detonação do Homem Bomba</h3>
            <p>O Homem Bomba concluiu o seu movimento. Deseja detonar agora e explodir todas as 8 casas adjacentes?</p>
            <div class="modal-buttons">
              <button class="btn btn-danger btn-large" id="btn-bomba-explode">💥 Explodir Tudo Agora!</button>
              <button class="btn btn-secondary" id="btn-bomba-skip">Apenas Parar Aqui ✓</button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-bomba-explode')?.addEventListener('click', () => {
        this.dispatch({ type: 'EXPLODE_BOMBA' });
      });
      container.querySelector('#btn-bomba-skip')?.addEventListener('click', () => {
        this.dispatch({ type: 'SKIP_BOMBA' });
      });
      return;
    }

    // 3. Pimentinha decision
    if (this.state.pendingSubStep?.type === 'PIMENTINHA_DECISION') {
      container.innerHTML = `
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">🌶️</div>
            <h3>Ardência da Pimentinha</h3>
            <p>Deseja detonar a Pimentinha, congelando todas as peças nas 3 casas à sua frente por 1 rodada inteira?</p>
            <div class="modal-buttons">
              <button class="btn btn-danger btn-large" id="btn-pimenta-explode">🌶️ Liberar Ardência Congelante!</button>
              <button class="btn btn-secondary" id="btn-pimenta-skip">Apenas Parar Aqui ✓</button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-pimenta-explode')?.addEventListener('click', () => {
        this.dispatch({ type: 'EXPLODE_PIMENTINHA' });
      });
      container.querySelector('#btn-pimenta-skip')?.addEventListener('click', () => {
        this.dispatch({ type: 'SKIP_PIMENTINHA' });
      });
      return;
    }

    // 4. Pawn promotion
    if (this.state.pendingSubStep?.type === 'PROMOTION') {
      container.innerHTML = `
        <div class="substep-modal-overlay">
          <div class="substep-modal-card">
            <div class="modal-icon">👑</div>
            <h3>Promoção de Peão Clássico</h3>
            <p>Seu peão bravamente alcançou a última fileira! Escolha sua nova forma:</p>
            <div class="promotion-choices">
              <button class="btn btn-secondary promo-btn" data-type="rainha">
                ${getPieceSvg('rainha', this.state.turn, 48)}
                <span>Rainha</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="torre">
                ${getPieceSvg('torre', this.state.turn, 48)}
                <span>Torre</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="bispo">
                ${getPieceSvg('bispo', this.state.turn, 48)}
                <span>Bispo</span>
              </button>
              <button class="btn btn-secondary promo-btn" data-type="cavalo">
                ${getPieceSvg('cavalo', this.state.turn, 48)}
                <span>Cavalo</span>
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.promo-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const newType = (btn as HTMLElement).dataset.type as 'rainha' | 'torre' | 'bispo' | 'cavalo';
          this.dispatch({ type: 'PROMOTE_PAWN', newType });
        });
      });
      return;
    }

    // 5. Game over modal
    if (this.state.winner) {
      const isDraw = this.state.winner === 'draw';
      const winnerName = this.state.winner === 'white' ? 'Jogador 1 (Brancas / Gatito)' : 'Jogador 2 (Pretas / Gatita)';

      container.innerHTML = `
        <div class="substep-modal-overlay">
          <div class="substep-modal-card game-over-card">
            <div class="modal-icon">${isDraw ? '🤝' : '🏆'}</div>
            <h2>${isDraw ? 'Fim de Jogo: Empate!' : `Vitória de ${winnerName}!`}</h2>
            <p class="game-over-reason">${this.state.winReason || 'Partida finalizada.'}</p>
            <div class="modal-buttons">
              <button class="btn btn-primary btn-large" id="btn-modal-rematch">🔄 Revanche (Mesmos Exércitos)</button>
              <button class="btn btn-secondary" id="btn-modal-new-setup">⚙️ Nova Montagem</button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-modal-rematch')?.addEventListener('click', () => {
        this.onRematchCallback();
      });
      container.querySelector('#btn-modal-new-setup')?.addEventListener('click', () => {
        this.onNewSetupCallback();
      });
    }
  }

  private attachEventListeners(): void {
    // Orientation
    const orientSelect = this.element.querySelector('#orientation-select') as HTMLSelectElement;
    orientSelect?.addEventListener('change', () => {
      this.orientation = orientSelect.value as OrientationMode;
      this.render();
    });

    // Undo
    this.element.querySelector('#btn-undo')?.addEventListener('click', () => {
      this.undo();
    });

    // Rematch
    this.element.querySelector('#btn-rematch')?.addEventListener('click', () => {
      this.onRematchCallback();
    });

    // New Setup
    this.element.querySelector('#btn-new-setup')?.addEventListener('click', () => {
      this.onNewSetupCallback();
    });
  }
}

