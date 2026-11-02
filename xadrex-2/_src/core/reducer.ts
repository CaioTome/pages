import {
  Board,
  Player,
  Position,
  ActionCandidate,
  MatchState,
  PieceInstance,
  PieceId,
} from './types';
import {
  cloneBoard,
  arePositionsEqual,
  isSquareUnderAttack,
  getAliveRoyalPieces,
  getAllLegalActionsForPlayer,
  getLegalActionsForPiece,
  colToLetter,
  isWithinBoard,
} from './moveGenerator';
import { PIECE_CATALOG } from './catalog';

export type GameEvent =
  | { type: 'SELECT_PIECE'; pos: Position }
  | { type: 'DESELECT' }
  | { type: 'EXECUTE_ACTION'; action: ActionCandidate }
  | { type: 'RESPOND_GUARD'; sacrifice: boolean }
  | { type: 'EXPLODE_BOMBA' }
  | { type: 'SKIP_BOMBA' }
  | { type: 'EXPLODE_PIMENTINHA' }
  | { type: 'SKIP_PIMENTINHA' }
  | { type: 'PROMOTE_PAWN'; newType: 'rainha' | 'torre' | 'bispo' | 'cavalo' }
  | { type: 'SELECT_MAGO_FIRST_TARGET'; firstPos: Position }
  | { type: 'SELECT_MAGO_SECOND_TARGET'; secondPos: Position };

export function createInitialMatchState(
  whiteArmy: Board,
  blackArmy: Board
): MatchState {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Rows 6 & 7 from whiteArmy
  for (let r = 6; r <= 7; r++) {
    for (let c = 0; c < 8; c++) {
      if (whiteArmy[r][c]) {
        board[r][c] = { ...whiteArmy[r][c]! };
      }
    }
  }

  // Rows 0 & 1 from blackArmy
  for (let r = 0; r <= 1; r++) {
    for (let c = 0; c < 8; c++) {
      if (blackArmy[r][c]) {
        board[r][c] = { ...blackArmy[r][c]! };
      }
    }
  }

  return {
    board,
    turn: 'white',
    halfMoves: 0,
    fullMoves: 1,
    history: ['Partida iniciada! Exércitos revelados.'],
    lastUratalScreechTurn: null,
    winner: null,
    winReason: undefined,
    inCheck: false,
    selectedPos: null,
    validActions: [],
    pendingSubStep: null,
    pendingReaction: null,
  };
}

export function gameReducer(state: MatchState, event: GameEvent): MatchState {
  if (state.winner) {
    return state; // Game over, no changes
  }

  switch (event.type) {
    case 'SELECT_PIECE': {
      if (state.pendingSubStep || state.pendingReaction) return state;
      const piece = state.board[event.pos.r][event.pos.c];
      if (!piece || piece.player !== state.turn) {
        return {
          ...state,
          selectedPos: null,
          validActions: [],
        };
      }
      const uratalPos =
        state.lastUratalScreechTurn?.player === state.turn
          ? state.lastUratalScreechTurn.birdPos
          : null;

      const validActions = getLegalActionsForPiece(
        state.board,
        event.pos,
        uratalPos
      );

      return {
        ...state,
        selectedPos: event.pos,
        validActions,
      };
    }

    case 'DESELECT': {
      if (state.pendingSubStep || state.pendingReaction) return state;
      return {
        ...state,
        selectedPos: null,
        validActions: [],
      };
    }

    case 'EXECUTE_ACTION': {
      if (state.pendingSubStep || state.pendingReaction) return state;
      return handleExecuteAction(state, event.action);
    }

    case 'RESPOND_GUARD': {
      if (!state.pendingReaction) return state;
      return handleGuardResponse(state, event.sacrifice);
    }

    case 'EXPLODE_BOMBA': {
      if (state.pendingSubStep?.type !== 'HOMEM_BOMBA_DECISION') return state;
      return handleExplodeBomba(state, state.pendingSubStep.piecePos);
    }

    case 'SKIP_BOMBA': {
      if (state.pendingSubStep?.type !== 'HOMEM_BOMBA_DECISION') return state;
      const afterBombaState = {
        ...state,
        pendingSubStep: null,
      };
      return finalizeTurn(afterBombaState);
    }

    case 'EXPLODE_PIMENTINHA': {
      if (state.pendingSubStep?.type !== 'PIMENTINHA_DECISION') return state;
      return handleExplodePimentinha(state, state.pendingSubStep.piecePos);
    }

    case 'SKIP_PIMENTINHA': {
      if (state.pendingSubStep?.type !== 'PIMENTINHA_DECISION') return state;
      const afterPimentinhaState = {
        ...state,
        pendingSubStep: null,
      };
      return finalizeTurn(afterPimentinhaState);
    }

    case 'PROMOTE_PAWN': {
      if (state.pendingSubStep?.type !== 'PROMOTION') return state;
      const { r, c } = state.pendingSubStep.piecePos;
      const nextBoard = cloneBoard(state.board);
      const pawn = nextBoard[r][c];
      if (pawn) {
        nextBoard[r][c] = {
          ...pawn,
          type: event.newType,
        };
      }
      const historyMsg = `${state.turn === 'white' ? 'Brancas' : 'Pretas'}: Peão promovido a ${PIECE_CATALOG[event.newType].name} em ${colToLetter(c)}${8 - r}!`;
      const nextState: MatchState = {
        ...state,
        board: nextBoard,
        pendingSubStep: null,
        history: [historyMsg, ...state.history],
      };
      return finalizeTurn(nextState);
    }

    case 'SELECT_MAGO_FIRST_TARGET': {
      if (!state.selectedPos) return state;
      const magoPiece = state.board[state.selectedPos.r][state.selectedPos.c];
      if (!magoPiece || magoPiece.type !== 'mago') return state;
      return {
        ...state,
        pendingSubStep: {
          type: 'MAGO_FIRST_SELECTED',
          magoPos: state.selectedPos,
          firstPos: event.firstPos,
        },
      };
    }

    case 'SELECT_MAGO_SECOND_TARGET': {
      if (state.pendingSubStep?.type !== 'MAGO_FIRST_SELECTED') return state;
      const { firstPos, magoPos } = state.pendingSubStep;
      const secondPos = event.secondPos;

      const nextBoard = cloneBoard(state.board);
      const temp = nextBoard[firstPos.r][firstPos.c];
      nextBoard[firstPos.r][firstPos.c] = nextBoard[secondPos.r][secondPos.c];
      nextBoard[secondPos.r][secondPos.c] = temp;

      const historyMsg = `${state.turn === 'white' ? 'Brancas' : 'Pretas'}: Mago permutou ${colToLetter(firstPos.c)}${8 - firstPos.r} com ${colToLetter(secondPos.c)}${8 - secondPos.r}!`;

      const nextState: MatchState = {
        ...state,
        board: nextBoard,
        selectedPos: null,
        validActions: [],
        pendingSubStep: null,
        history: [historyMsg, ...state.history],
      };
      return finalizeTurn(nextState);
    }

    default:
      return state;
  }
}

function findAdjacentGuard(
  board: Board,
  targetPos: Position,
  targetPlayer: Player
): { pos: Position; piece: PieceInstance } | null {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = targetPos.r + dr;
      const nc = targetPos.c + dc;
      if (isWithinBoard(nr, nc)) {
        const occ = board[nr][nc];
        if (occ && occ.player === targetPlayer && occ.type === 'guarda') {
          return { pos: { r: nr, c: nc }, piece: occ };
        }
      }
    }
  }
  return null;
}

function handleExecuteAction(
  state: MatchState,
  action: ActionCandidate
): MatchState {
  const mover = state.board[action.from.r][action.from.c];
  if (!mover) return state;

  // Determine if this is a capture action that targets an enemy piece
  let targetPos: Position | null = null;
  if (action.type === 'CAPTURE') {
    targetPos = action.to;
  } else if (action.type === 'RANGED_ATTACK' || action.type === 'TRANSFORM_SAPO') {
    targetPos = action.target || null;
  }

  // Check for Guarda reaction if targeting an enemy piece with an adjacent Guarda
  if (targetPos) {
    const targetPiece = state.board[targetPos.r][targetPos.c];
    if (targetPiece && targetPiece.player !== state.turn) {
      const guardInfo = findAdjacentGuard(state.board, targetPos, targetPiece.player);
      if (guardInfo) {
        return {
          ...state,
          pendingReaction: {
            attacker: mover,
            attackAction: action,
            targetPiece,
            targetPos,
            guardPos: guardInfo.pos,
            guardPiece: guardInfo.piece,
          },
        };
      }
    }
  }

  return applyActionToBoard(state, action);
}

function handleGuardResponse(
  state: MatchState,
  sacrifice: boolean
): MatchState {
  const rx = state.pendingReaction!;
  if (!sacrifice) {
    // Defender declined guard sacrifice, proceed with original attack
    const cleanState = { ...state, pendingReaction: null };
    return applyActionToBoard(cleanState, rx.attackAction);
  }

  // Guard sacrifices: Guarda swaps with target, and Guarda takes the attack
  const nextBoard = cloneBoard(state.board);
  const targetPos = rx.targetPos;
  const guardPos = rx.guardPos;

  // Swap target piece and guard
  const targetPiece = nextBoard[targetPos.r][targetPos.c];
  const guardPiece = nextBoard[guardPos.r][guardPos.c];
  nextBoard[guardPos.r][guardPos.c] = targetPiece;
  nextBoard[targetPos.r][targetPos.c] = guardPiece;

  const historyMsg = `🛡️ Guarda se sacrificou para salvar ${PIECE_CATALOG[rx.targetPiece.type].name} em ${colToLetter(targetPos.c)}${8 - targetPos.r}!`;

  const cleanState: MatchState = {
    ...state,
    board: nextBoard,
    pendingReaction: null,
    history: [historyMsg, ...state.history],
  };

  // Now the attack hits targetPos (where the Guarda now stands)
  return applyActionToBoard(cleanState, rx.attackAction);
}

function applyActionToBoard(
  state: MatchState,
  action: ActionCandidate
): MatchState {
  const nextBoard = cloneBoard(state.board);
  const mover = nextBoard[action.from.r][action.from.c]!;
  const player = state.turn;
  const opponent: Player = player === 'white' ? 'black' : 'white';

  let specialWin: { winner: Player; reason: string } | null = null;
  let historyEntry = `${player === 'white' ? 'Brancas' : 'Pretas'}: ${action.description}`;
  let triggeredUratalPos: Position | null = null;

  switch (action.type) {
    case 'MOVE': {
      nextBoard[action.from.r][action.from.c] = null;
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      if (mover.type === 'passaro_uratal') {
        triggeredUratalPos = action.to;
      }
      break;
    }

    case 'CAPTURE': {
      const victim = nextBoard[action.to.r][action.to.c];
      // Boto Cor-de-Rosa instant win
      if (mover.type === 'boto_cor_de_rosa' && victim?.type === 'rainha') {
        specialWin = {
          winner: player,
          reason: 'O Boto Cor-de-Rosa capturou a Rainha inimiga e conquistou o reino! Vitória instantânea!',
        };
      }
      nextBoard[action.from.r][action.from.c] = null;
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'RANGED_ATTACK': {
      if (action.target) {
        const victim = nextBoard[action.target.r][action.target.c];
        if (mover.type === 'boto_cor_de_rosa' && victim?.type === 'rainha') {
          specialWin = {
            winner: player,
            reason: 'O Boto Cor-de-Rosa eliminou a Rainha inimiga! Vitória instantânea!',
          };
        }
        nextBoard[action.target.r][action.target.c] = null;
      }
      nextBoard[action.from.r][action.from.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'BALEIA_CINZENTA_SWEEP': {
      nextBoard[action.from.r][action.from.c] = null;
      if (action.secondaryTargets) {
        for (const st of action.secondaryTargets) {
          nextBoard[st.r][st.c] = null;
        }
      }
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'GATITO_GASOSO_JUMP': {
      nextBoard[action.from.r][action.from.c] = null;
      if (action.route) {
        for (const rp of action.route) {
          const occ = nextBoard[rp.r][rp.c];
          if (occ && occ.type !== 'baratinha') {
            nextBoard[rp.r][rp.c] = null;
          }
        }
      }
      // Target square destroyed as well if occupied
      const destOcc = nextBoard[action.to.r][action.to.c];
      if (destOcc && destOcc.type !== 'baratinha') {
        nextBoard[action.to.r][action.to.c] = null;
      }
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'TRANSFORM_SAPO': {
      nextBoard[action.from.r][action.from.c] = null;
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      if (action.target) {
        const victim = nextBoard[action.target.r][action.target.c];
        if (victim && victim.type !== 'baratinha') {
          nextBoard[action.target.r][action.target.c] = {
            ...victim,
            originalType: victim.originalType || victim.type,
            type: 'sapo',
          };
          historyEntry += ` (transformou ${PIECE_CATALOG[victim.type].name} em Sapo! 🐸)`;
        }
      }
      break;
    }

    case 'CONSTRUCTOR_BUILD': {
      if (action.target) {
        const pawn = nextBoard[action.target.r][action.target.c];
        if (pawn) {
          nextBoard[action.target.r][action.target.c] = {
            ...pawn,
            type: 'torre',
          };
          historyEntry = `${player === 'white' ? 'Brancas' : 'Pretas'}: Construtor ergueu uma Torre sobre o Peão em ${colToLetter(action.target.c)}${8 - action.target.r}! 🏰`;
        }
      }
      nextBoard[action.from.r][action.from.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'PERERECA_LEAP': {
      nextBoard[action.from.r][action.from.c] = null;
      nextBoard[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }

    case 'MAGO_SWAP': {
      // Initiates Mago sub-step
      return {
        ...state,
        pendingSubStep: null, // Will wait for first target
      };
    }
  }

  // Queen frog healing: if a Queen moved, heal any adjacent friendly frogs
  if (mover.type === 'rainha') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = action.to.r + dr;
        const nc = action.to.c + dc;
        if (isWithinBoard(nr, nc)) {
          const occ = nextBoard[nr][nc];
          if (occ && occ.player === player && occ.type === 'sapo' && occ.originalType) {
            historyEntry += ` (A Rainha curou o Sapo em ${colToLetter(nc)}${8 - nr} de volta a ${PIECE_CATALOG[occ.originalType].name}! ✨)`;
            nextBoard[nr][nc] = {
              ...occ,
              type: occ.originalType,
              originalType: undefined,
            };
          }
        }
      }
    }
  }

  let nextState: MatchState = {
    ...state,
    board: nextBoard,
    selectedPos: null,
    validActions: [],
    history: [historyEntry, ...state.history],
    lastUratalScreechTurn: triggeredUratalPos
      ? { player: opponent, birdPos: triggeredUratalPos }
      : state.lastUratalScreechTurn?.player === player
      ? null
      : state.lastUratalScreechTurn,
  };

  if (specialWin) {
    return {
      ...nextState,
      winner: specialWin.winner,
      winReason: specialWin.reason,
    };
  }

  // Check sub-step decisions
  if (mover.type === 'homem_bomba') {
    return {
      ...nextState,
      pendingSubStep: {
        type: 'HOMEM_BOMBA_DECISION',
        piecePos: action.to,
      },
    };
  }

  if (mover.type === 'pimentinha') {
    return {
      ...nextState,
      pendingSubStep: {
        type: 'PIMENTINHA_DECISION',
        piecePos: action.to,
      },
    };
  }

  // Check promotion for classic pawn
  if (mover.type === 'peao') {
    const lastRank = player === 'white' ? 0 : 7;
    if (action.to.r === lastRank) {
      return {
        ...nextState,
        pendingSubStep: {
          type: 'PROMOTION',
          piecePos: action.to,
        },
      };
    }
  }

  return finalizeTurn(nextState);
}

function handleExplodeBomba(state: MatchState, pos: Position): MatchState {
  const nextBoard = cloneBoard(state.board);
  // Bomb kills itself
  nextBoard[pos.r][pos.c] = null;

  // Destroys all 8 adjacent pieces except Baratinhas
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (isWithinBoard(nr, nc)) {
        const occ = nextBoard[nr][nc];
        if (occ && occ.type !== 'baratinha') {
          nextBoard[nr][nc] = null;
        }
      }
    }
  }

  const historyMsg = `💥 BUM! O Homem Bomba detonou em ${colToLetter(pos.c)}${8 - pos.r}, varrendo as casas vizinhas!`;

  const nextState: MatchState = {
    ...state,
    board: nextBoard,
    pendingSubStep: null,
    history: [historyMsg, ...state.history],
  };

  return finalizeTurn(nextState);
}

function handleExplodePimentinha(state: MatchState, pos: Position): MatchState {
  const nextBoard = cloneBoard(state.board);
  const player = state.turn;
  const fwd = player === 'white' ? -1 : 1;

  // Pimentinha sacrifices itself
  nextBoard[pos.r][pos.c] = null;

  // Freezes 3 forward squares for 1 round
  for (const dc of [-1, 0, 1]) {
    const nr = pos.r + fwd;
    const nc = pos.c + dc;
    if (isWithinBoard(nr, nc)) {
      const occ = nextBoard[nr][nc];
      if (occ) {
        nextBoard[nr][nc] = {
          ...occ,
          frozenRounds: 1,
        };
      }
    }
  }

  const historyMsg = `🌶️ Pimentinha explodiu em ardência, congelando as 3 casas à frente por 1 rodada!`;

  const nextState: MatchState = {
    ...state,
    board: nextBoard,
    pendingSubStep: null,
    history: [historyMsg, ...state.history],
  };

  return finalizeTurn(nextState);
}

export function finalizeTurn(state: MatchState): MatchState {
  const nextPlayer: Player = state.turn === 'white' ? 'black' : 'white';
  const nextBoard = cloneBoard(state.board);

  // Decrement freeze counters for nextPlayer
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = nextBoard[r][c];
      if (p && p.player === nextPlayer && (p.frozenRounds ?? 0) > 0) {
        nextBoard[r][c] = {
          ...p,
          frozenRounds: Math.max(0, (p.frozenRounds ?? 1) - 1),
        };
      }
    }
  }

  // Check victory / royals alive
  const nextPlayerRoyals = getAliveRoyalPieces(nextBoard, nextPlayer);
  const currentPlayerRoyals = getAliveRoyalPieces(nextBoard, state.turn);

  // If current player has no royals (suicide explosion or similar):
  if (currentPlayerRoyals.length === 0 && nextPlayerRoyals.length === 0) {
    return {
      ...state,
      board: nextBoard,
      winner: 'draw',
      winReason: 'Todas as peças reais de ambos os jogadores foram destruídas!',
    };
  }
  if (currentPlayerRoyals.length === 0) {
    return {
      ...state,
      board: nextBoard,
      winner: nextPlayer,
      winReason: 'O jogador ficou sem peças reais!',
    };
  }
  if (nextPlayerRoyals.length === 0) {
    return {
      ...state,
      board: nextBoard,
      winner: state.turn,
      winReason: 'Todas as peças reais inimigas foram eliminadas!',
    };
  }

  // Check check status for nextPlayer
  let inCheck = false;
  if (nextPlayerRoyals.length === 1) {
    inCheck = isSquareUnderAttack(nextBoard, nextPlayerRoyals[0].pos, state.turn);
  }

  // Evaluate legal moves for nextPlayer
  const uratalPos =
    state.lastUratalScreechTurn?.player === nextPlayer
      ? state.lastUratalScreechTurn.birdPos
      : null;

  const legalMoves = getAllLegalActionsForPlayer(nextBoard, nextPlayer, uratalPos);

  if (legalMoves.length === 0) {
    if (inCheck) {
      return {
        ...state,
        board: nextBoard,
        turn: nextPlayer,
        winner: state.turn,
        inCheck: true,
        winReason: `Xeque-Mate! As ${state.turn === 'white' ? 'Brancas' : 'Pretas'} venceram a partida!`,
      };
    } else {
      return {
        ...state,
        board: nextBoard,
        turn: nextPlayer,
        winner: 'draw',
        inCheck: false,
        winReason: 'Empate por Afogamento! O jogador da vez não possui jogadas legais.',
      };
    }
  }

  return {
    ...state,
    board: nextBoard,
    turn: nextPlayer,
    halfMoves: state.halfMoves + 1,
    fullMoves: nextPlayer === 'white' ? state.fullMoves + 1 : state.fullMoves,
    inCheck,
    selectedPos: null,
    validActions: [],
    pendingSubStep: null,
    pendingReaction: null,
  };
}
