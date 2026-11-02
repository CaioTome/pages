import { describe, it, expect } from 'vitest';
import {
  Board,
  MatchState,
  ActionCandidate,
} from '../core/types';
import {
  generateRawActionsForPiece,
  getLegalActionsForPiece,
  simulateMove,
  isSquareUnderAttack,
  isPlayerInCheck,
} from '../core/moveGenerator';
import {
  validateArmy,
  createStandardArmy,
} from '../core/setupValidator';
import {
  gameReducer,
  createInitialMatchState,
} from '../core/reducer';

function createEmptyBoard(): Board {
  return Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
}

describe('Setup Validator', () => {
  it('validates a standard chess army successfully', () => {
    const board = createStandardArmy('white');
    const result = validateArmy(board, 'white');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails if no King is present', () => {
    const board = createStandardArmy('white');
    board[7][4] = null; // Remove King
    const result = validateArmy(board, 'white');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KING_COUNT_INVALID')).toBe(true);
  });

  it('fails if both Papa and Rainha are in the army', () => {
    const board = createStandardArmy('white');
    // Replace one bishop with Papa
    board[7][2] = {
      instanceId: 'white-papa-1',
      type: 'papa',
      player: 'white',
    };
    const result = validateArmy(board, 'white');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.code === 'PAPA_RAINHA_CONFLICT')).toBe(true);
  });

  it('fails if special copies limit is exceeded (e.g. 3 Snipers)', () => {
    const board = createStandardArmy('white');
    board[6][0] = { instanceId: 's1', type: 'sniper', player: 'white' };
    board[6][1] = { instanceId: 's2', type: 'sniper', player: 'white' };
    board[6][2] = { instanceId: 's3', type: 'sniper', player: 'white' };
    const result = validateArmy(board, 'white');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.code === 'EXCEEDED_MAX_COPIES')).toBe(true);
  });
});

describe('Piece Abilities & Rules', () => {
  it('Boto Cor-de-Rosa: instant win upon capturing enemy Queen', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // White Boto at (4, 4), Black Queen at (2, 5) - Knight jump
    board[4][4] = { instanceId: 'w-boto', type: 'boto_cor_de_rosa', player: 'white' };
    board[2][5] = { instanceId: 'b-queen', type: 'rainha', player: 'black' };

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    const captureAction: ActionCandidate = {
      type: 'CAPTURE',
      from: { r: 4, c: 4 },
      to: { r: 2, c: 5 },
      target: { r: 2, c: 5 },
      description: 'Capturar Rainha',
      badgeColor: 'red',
    };

    const nextState = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: captureAction,
    });

    expect(nextState.winner).toBe('white');
    expect(nextState.winReason).toContain('Boto Cor-de-Rosa');
  });

  it('Sniper: eliminates target at distance without moving from own square', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    board[5][2] = { instanceId: 'w-sniper', type: 'sniper', player: 'white' };
    board[2][5] = { instanceId: 'b-peao', type: 'peao', player: 'black' };

    const actions = getLegalActionsForPiece(board, { r: 5, c: 2 });
    const shootAction = actions.find((a) => a.type === 'RANGED_ATTACK' && a.target?.r === 2 && a.target?.c === 5);
    expect(shootAction).toBeDefined();
    expect(shootAction?.to).toEqual({ r: 5, c: 2 }); // Doesn't move

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    const nextState = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: shootAction!,
    });

    // Sniper remains at (5,2), enemy at (2,5) is gone!
    expect(nextState.board[5][2]?.type).toBe('sniper');
    expect(nextState.board[2][5]).toBeNull();
  });

  it('Homem Bomba: explodes destroying adjacent pieces except Baratinhas', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // Bomba at (4,4)
    board[4][4] = { instanceId: 'w-bomb', type: 'homem_bomba', player: 'white' };
    // Adjacent pieces:
    board[3][4] = { instanceId: 'b-p1', type: 'peao', player: 'black' };
    board[3][5] = { instanceId: 'b-barata', type: 'baratinha', player: 'black' }; // Immune
    board[5][4] = { instanceId: 'w-p2', type: 'peao', player: 'white' }; // Friendly piece

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    // Move bomba 1 step to (3, 3) where it's empty
    const moveAct: ActionCandidate = {
      type: 'MOVE',
      from: { r: 4, c: 4 },
      to: { r: 3, c: 3 },
      description: 'Mover Bomba',
      badgeColor: 'blue',
    };

    const afterMove = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: moveAct,
    });

    expect(afterMove.pendingSubStep?.type).toBe('HOMEM_BOMBA_DECISION');

    // Place an adjacent target to (3,3)
    afterMove.board[2][3] = { instanceId: 'b-victim', type: 'torre', player: 'black' };
    afterMove.board[2][4] = { instanceId: 'b-bara2', type: 'baratinha', player: 'black' };

    const afterExplosion = gameReducer(afterMove, { type: 'EXPLODE_BOMBA' });

    // Bomba died
    expect(afterExplosion.board[3][3]).toBeNull();
    // Non-immune adjacent died
    expect(afterExplosion.board[2][3]).toBeNull();
    // Baratinha survived!
    expect(afterExplosion.board[2][4]?.type).toBe('baratinha');
  });

  it('Baratinha: immune to capture and cannot give check', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // Black Baratinha right next to White King
    board[6][4] = { instanceId: 'b-barata', type: 'baratinha', player: 'black' };

    // King is NOT in check
    expect(isSquareUnderAttack(board, { r: 7, c: 4 }, 'black')).toBe(false);

    // White King cannot capture Baratinha
    const kingActions = getLegalActionsForPiece(board, { r: 7, c: 4 });
    const capturesBaratinha = kingActions.some((a) => a.to.r === 6 && a.to.c === 4 && a.type === 'CAPTURE');
    expect(capturesBaratinha).toBe(false);
  });

  it('Papa: gives allied Bishops King-like moves', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    board[6][3] = { instanceId: 'w-bishop', type: 'bispo', player: 'white' };

    // Without Papa: Bishop at (6,3) cannot move directly forward to (5,3)
    const actionsWithoutPapa = generateRawActionsForPiece(board, { r: 6, c: 3 });
    expect(actionsWithoutPapa.some((a) => a.to.r === 5 && a.to.c === 3)).toBe(false);

    // Add Papa for white
    board[7][0] = { instanceId: 'w-papa', type: 'papa', player: 'white' };
    const actionsWithPapa = generateRawActionsForPiece(board, { r: 6, c: 3 });
    // Now Bishop can move 1 step orthogonally like a King!
    expect(actionsWithPapa.some((a) => a.to.r === 5 && a.to.c === 3)).toBe(true);
  });

  it('Goham: distacts adjacent enemies so they have no legal actions', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // Black Goham at (4,4)
    board[4][4] = { instanceId: 'b-goham', type: 'goham', player: 'black' };
    // White Knight adjacent to Goham at (4,3)
    board[4][3] = { instanceId: 'w-cavalo', type: 'cavalo', player: 'white' };

    const knightActions = getLegalActionsForPiece(board, { r: 4, c: 3 });
    expect(knightActions).toHaveLength(0); // Totally distracted!
  });

  it('Guarda: prompts defensive reaction and sacrifices itself to save ally', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // White Rook attacking Black Bishop at (3, 4)
    board[7][2] = { instanceId: 'w-torre', type: 'torre', player: 'white' };
    board[3][2] = { instanceId: 'b-bispo', type: 'bispo', player: 'black' };
    // Black Guarda adjacent to Bishop at (3, 3)
    board[3][3] = { instanceId: 'b-guarda', type: 'guarda', player: 'black' };

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    const rookCapture: ActionCandidate = {
      type: 'CAPTURE',
      from: { r: 7, c: 2 },
      to: { r: 3, c: 2 },
      target: { r: 3, c: 2 },
      description: 'Capturar Bispo',
      badgeColor: 'red',
    };

    // White attacks -> triggers Guard reaction!
    const reactionState = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: rookCapture,
    });

    expect(reactionState.pendingReaction).toBeDefined();
    expect(reactionState.pendingReaction?.guardPiece.type).toBe('guarda');

    // Defender agrees to sacrifice Guard
    const finalState = gameReducer(reactionState, {
      type: 'RESPOND_GUARD',
      sacrifice: true,
    });

    // Guard died in the attack at (3,2) where Rook now sits
    expect(finalState.board[3][2]?.type).toBe('torre');
    // Saved Bishop now safely stands on the Guard's former square (3,3)!
    expect(finalState.board[3][3]?.type).toBe('bispo');
  });

  it('Gatito Mahchia: transforms enemy into Sapo, Rainha cures Sapo', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // Gatito Mahchia at (5, 2) targeting Black Rook at (2, 2)
    board[5][2] = { instanceId: 'w-mahchia', type: 'gatito_mahchia', player: 'white' };
    board[2][2] = { instanceId: 'b-torre', type: 'torre', player: 'black' };

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    const transformAction: ActionCandidate = {
      type: 'TRANSFORM_SAPO',
      from: { r: 5, c: 2 },
      to: { r: 3, c: 2 }, // Stops 1 square before victim
      target: { r: 2, c: 2 },
      description: 'Enfeitiçar em Sapo',
      badgeColor: 'green',
    };

    const afterFrogState = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: transformAction,
    });

    const frog = afterFrogState.board[2][2];
    expect(frog?.type).toBe('sapo');
    expect(frog?.originalType).toBe('torre');

    // Now Black Rainha moves adjacent to Sapo (e.g. from (2, 5) to (2, 3))
    afterFrogState.board[2][5] = { instanceId: 'b-queen', type: 'rainha', player: 'black' };

    const queenMove: ActionCandidate = {
      type: 'MOVE',
      from: { r: 2, c: 5 },
      to: { r: 2, c: 3 }, // adjacent to (2, 2)
      description: 'Mover Rainha',
      badgeColor: 'blue',
    };

    const curedState = gameReducer(afterFrogState, {
      type: 'EXECUTE_ACTION',
      action: queenMove,
    });

    // Sapo at (2,2) should now be cured back to 'torre'!
    expect(curedState.board[2][2]?.type).toBe('torre');
  });

  it('Baleia Cinzenta: sweeps 2 enemies in a straight line', () => {
    const board = createEmptyBoard();
    board[7][4] = { instanceId: 'w-king', type: 'rei', player: 'white' };
    board[0][4] = { instanceId: 'b-king', type: 'rei', player: 'black' };

    // Baleia at (6, 2)
    board[6][2] = { instanceId: 'w-baleia', type: 'baleia_cinzenta', player: 'white' };
    board[4][2] = { instanceId: 'b-e1', type: 'peao', player: 'black' };
    board[2][2] = { instanceId: 'b-e2', type: 'torre', player: 'black' };

    const actions = getLegalActionsForPiece(board, { r: 6, c: 2 });
    const sweep2 = actions.find((a) => a.secondaryTargets?.length === 2);
    expect(sweep2).toBeDefined();
    expect(sweep2?.to).toEqual({ r: 2, c: 2 });

    const initialMatch: MatchState = {
      board,
      turn: 'white',
      halfMoves: 0,
      fullMoves: 1,
      history: [],
      lastUratalScreechTurn: null,
      winner: null,
      inCheck: false,
      selectedPos: null,
      validActions: [],
      pendingSubStep: null,
      pendingReaction: null,
    };

    const nextState = gameReducer(initialMatch, {
      type: 'EXECUTE_ACTION',
      action: sweep2!,
    });

    // Baleia is at (2, 2), (4, 2) is cleared!
    expect(nextState.board[2][2]?.type).toBe('baleia_cinzenta');
    expect(nextState.board[4][2]).toBeNull();
    expect(nextState.board[6][2]).toBeNull();
  });
});

