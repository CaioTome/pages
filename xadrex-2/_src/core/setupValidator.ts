import { PieceId, Player, Board } from './types';
import { PIECE_CATALOG } from './catalog';

export interface SetupValidationError {
  code: string;
  message: string;
}

export interface SetupValidationResult {
  isValid: boolean;
  errors: SetupValidationError[];
  pieceCounts: Record<PieceId, number>;
}

export function getPlayerSetupRanks(player: Player): [number, number] {
  // player 'white': rank 7 and 8 (indices 6 and 7)
  // player 'black': rank 1 and 2 (indices 0 and 1)
  return player === 'white' ? [6, 7] : [0, 1];
}

export function validateArmy(
  board: Board,
  player: Player
): SetupValidationResult {
  const errors: SetupValidationError[] = [];
  const ranks = getPlayerSetupRanks(player);
  const counts = {} as Record<PieceId, number>;

  // Initialize counts
  for (const id in PIECE_CATALOG) {
    counts[id as PieceId] = 0;
  }

  let totalPieces = 0;

  for (const r of ranks) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.player !== player) {
          errors.push({
            code: 'WRONG_PLAYER_PIECE',
            message: `Peça de outro jogador encontrada em (${r}, ${c}).`,
          });
        }
        counts[piece.type] = (counts[piece.type] || 0) + 1;
        totalPieces++;
      }
    }
  }

  // 1. Must fill all 16 squares
  if (totalPieces < 16) {
    errors.push({
      code: 'INCOMPLETE_ARMY',
      message: `O exército possui apenas ${totalPieces} de 16 peças posicionadas.`,
    });
  } else if (totalPieces > 16) {
    errors.push({
      code: 'TOO_MANY_PIECES',
      message: `O exército possui ${totalPieces} peças (máximo 16).`,
    });
  }

  // 2. Exactly 1 King
  if (counts['rei'] !== 1) {
    errors.push({
      code: 'KING_COUNT_INVALID',
      message: `O exército precisa ter exatamente 1 Rei (atual: ${counts['rei']}).`,
    });
  }

  // 3. Papa and Rainha are mutually exclusive
  if (counts['papa'] > 0 && counts['rainha'] > 0) {
    errors.push({
      code: 'PAPA_RAINHA_CONFLICT',
      message: 'O Papa substitui a Rainha: não é permitido ter Papa e Rainha no mesmo exército.',
    });
  }

  // 4. Max copies check
  for (const [id, count] of Object.entries(counts)) {
    const pieceId = id as PieceId;
    const def = PIECE_CATALOG[pieceId];
    if (def && count > def.maxCopies) {
      errors.push({
        code: 'EXCEEDED_MAX_COPIES',
        message: `Limite de cópias excedido para ${def.name}: máximo ${def.maxCopies}, atual ${count}.`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    pieceCounts: counts,
  };
}

export function createStandardArmy(player: Player): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const [pawnRow, backRow] = player === 'white' ? [6, 7] : [1, 0];
  const backRankPieces: PieceId[] = [
    'torre',
    'cavalo',
    'bispo',
    'rainha',
    'rei',
    'bispo',
    'cavalo',
    'torre',
  ];

  for (let c = 0; c < 8; c++) {
    board[pawnRow][c] = {
      instanceId: `${player}-peao-${c}`,
      type: 'peao',
      player,
      hasMoved: false,
    };
    board[backRow][c] = {
      instanceId: `${player}-${backRankPieces[c]}-${c}`,
      type: backRankPieces[c],
      player,
      hasMoved: false,
    };
  }

  return board;
}
