import {
  Board,
  Player,
  Position,
  ActionCandidate,
  PieceInstance,
} from './types';
import { PIECE_CATALOG } from './catalog';

export function isWithinBoard(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

export function arePositionsEqual(a: Position, b: Position): boolean {
  return a.r === b.r && a.c === b.c;
}

export function getChebyshevDistance(a: Position, b: Position): number {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c));
}

export function getEuclideanDistanceSq(a: Position, b: Position): number {
  const dr = a.r - b.r;
  const dc = a.c - b.c;
  return dr * dr + dc * dc;
}

export function getAliveRoyalPieces(
  board: Board,
  player: Player
): { piece: PieceInstance; pos: Position }[] {
  const royals: { piece: PieceInstance; pos: Position }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.player === player && PIECE_CATALOG[p.type]?.isRoyal) {
        royals.push({ piece: p, pos: { r, c } });
      }
    }
  }
  return royals;
}

export function isAdjacentToEnemyGoham(
  board: Board,
  pos: Position,
  player: Player
): boolean {
  const opponent: Player = player === 'white' ? 'black' : 'white';
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (isWithinBoard(nr, nc)) {
        const neighbor = board[nr][nc];
        if (neighbor && neighbor.player === opponent && neighbor.type === 'goham') {
          return true;
        }
      }
    }
  }
  return false;
}

export function playerHasPapa(board: Board, player: Player): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === 'papa') {
        return true;
      }
    }
  }
  return false;
}

// Generate raw candidate actions for a piece without filtering for King check
export function generateRawActionsForPiece(
  board: Board,
  pos: Position
): ActionCandidate[] {
  const piece = board[pos.r][pos.c];
  if (!piece) return [];

  // Frozen piece cannot act
  if ((piece.frozenRounds ?? 0) > 0) return [];

  // Distracted by adjacent enemy Goham
  if (isAdjacentToEnemyGoham(board, pos, piece.player)) return [];

  const actions: ActionCandidate[] = [];
  const player = piece.player;
  const opponent: Player = player === 'white' ? 'black' : 'white';
  const fwd = player === 'white' ? -1 : 1;
  const startPawnRank = player === 'white' ? 6 : 1;
  const def = PIECE_CATALOG[piece.type];

  const canOccupyEnemy = (targetPiece: PieceInstance | null): boolean => {
    if (!targetPiece) return false;
    if (targetPiece.player === player) return false;
    if (targetPiece.type === 'baratinha') return false; // Immune
    return true;
  };

  const addMove = (to: Position) => {
    actions.push({
      type: 'MOVE',
      from: pos,
      to,
      description: `Mover para ${colToLetter(to.c)}${8 - to.r}`,
      badgeColor: 'blue',
    });
  };

  const addCapture = (to: Position) => {
    actions.push({
      type: 'CAPTURE',
      from: pos,
      to,
      target: to,
      description: `Capturar em ${colToLetter(to.c)}${8 - to.r}`,
      badgeColor: 'red',
    });
  };

  const addRayMoves = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      let step = 1;
      while (true) {
        const nr = pos.r + dr * step;
        const nc = pos.c + dc * step;
        if (!isWithinBoard(nr, nc)) break;
        const occupant = board[nr][nc];
        if (!occupant) {
          addMove({ r: nr, c: nc });
        } else {
          if (!def.cannotCapture && canOccupyEnemy(occupant)) {
            addCapture({ r: nr, c: nc });
          }
          break; // Ray blocked
        }
        step++;
      }
    }
  };

  const addStepMoves = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (!isWithinBoard(nr, nc)) continue;
      const occupant = board[nr][nc];
      if (!occupant) {
        addMove({ r: nr, c: nc });
      } else if (!def.cannotCapture && canOccupyEnemy(occupant)) {
        addCapture({ r: nr, c: nc });
      }
    }
  };

  // Specific piece rules
  switch (piece.type) {
    case 'rei':
    case 'principe': {
      addStepMoves([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]);
      break;
    }

    case 'rainha': {
      addRayMoves([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]);
      break;
    }

    case 'torre': {
      addRayMoves([
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ]);
      break;
    }

    case 'bispo': {
      addRayMoves([
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ]);
      // If allied Papa is alive, Bishop gains King moves
      if (playerHasPapa(board, player)) {
        addStepMoves([
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1],
        ]);
      }
      break;
    }

    case 'cavalo':
    case 'boto_cor_de_rosa': {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = pos.r + dr;
        const nc = pos.c + dc;
        if (!isWithinBoard(nr, nc)) continue;
        const occupant = board[nr][nc];
        if (!occupant) {
          addMove({ r: nr, c: nc });
        } else if (canOccupyEnemy(occupant)) {
          addCapture({ r: nr, c: nc });
        }
      }
      break;
    }

    case 'peao':
    case 'homem_bomba':
    case 'guarda':
    case 'pimentinha': {
      // 1 step forward
      const f1r = pos.r + fwd;
      if (isWithinBoard(f1r, pos.c) && !board[f1r][pos.c]) {
        addMove({ r: f1r, c: pos.c });
        // 2 steps forward from initial rank
        if (pos.r === startPawnRank) {
          const f2r = pos.r + 2 * fwd;
          if (isWithinBoard(f2r, pos.c) && !board[f2r][pos.c]) {
            addMove({ r: f2r, c: pos.c });
          }
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        const cr = pos.r + fwd;
        const cc = pos.c + dc;
        if (isWithinBoard(cr, cc)) {
          const occupant = board[cr][cc];
          if (occupant && canOccupyEnemy(occupant)) {
            addCapture({ r: cr, c: cc });
          }
        }
      }
      break;
    }

    case 'sniper': {
      // Moves to empty squares like Bishop
      // Ranged capture without moving when an enemy is in line of sight
      const diagDirs: [number, number][] = [
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ];
      for (const [dr, dc] of diagDirs) {
        let step = 1;
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          const occupant = board[nr][nc];
          if (!occupant) {
            addMove({ r: nr, c: nc });
          } else {
            if (canOccupyEnemy(occupant)) {
              actions.push({
                type: 'RANGED_ATTACK',
                from: pos,
                to: pos, // Does not move
                target: { r: nr, c: nc },
                description: `Tiro Sniper em ${colToLetter(nc)}${8 - nr}`,
                badgeColor: 'red',
              });
            }
            break;
          }
          step++;
        }
      }
      break;
    }

    case 'arqueiro': {
      // Moves like King to empty squares only
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = pos.r + dr;
          const nc = pos.c + dc;
          if (isWithinBoard(nr, nc) && !board[nr][nc]) {
            addMove({ r: nr, c: nc });
          }
        }
      }
      // Captures in Knight L pattern at distance without moving
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = pos.r + dr;
        const nc = pos.c + dc;
        if (isWithinBoard(nr, nc)) {
          const occupant = board[nr][nc];
          if (occupant && canOccupyEnemy(occupant)) {
            actions.push({
              type: 'RANGED_ATTACK',
              from: pos,
              to: pos, // Does not move
              target: { r: nr, c: nc },
              description: `Disparo de Flecha em ${colToLetter(nc)}${8 - nr}`,
              badgeColor: 'red',
            });
          }
        }
      }
      break;
    }

    case 'baratinha': {
      // Moves like Queen to empty squares only, no captures
      const queenDirs: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      for (const [dr, dc] of queenDirs) {
        let step = 1;
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          if (!board[nr][nc]) {
            addMove({ r: nr, c: nc });
          } else {
            break;
          }
          step++;
        }
      }
      break;
    }

    case 'construtor': {
      // Moves to empty squares like King
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = pos.r + dr;
          const nc = pos.c + dc;
          if (isWithinBoard(nr, nc)) {
            const occupant = board[nr][nc];
            if (!occupant) {
              addMove({ r: nr, c: nc });
            } else if (occupant.player === player && occupant.type === 'peao') {
              // Active ability: build Torre on adjacent allied classic pawn
              actions.push({
                type: 'CONSTRUCTOR_BUILD',
                from: pos,
                to: pos,
                target: { r: nr, c: nc },
                description: `Construir Torre sobre Peão em ${colToLetter(nc)}${8 - nr}`,
                badgeColor: 'green',
              });
            }
          }
        }
      }
      break;
    }

    case 'mago': {
      // Moves to empty squares like King
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = pos.r + dr;
          const nc = pos.c + dc;
          if (isWithinBoard(nr, nc) && !board[nr][nc]) {
            addMove({ r: nr, c: nc });
          }
        }
      }
      // Mago active ability can be triggered if there are at least 2 adjacent squares
      // (one can be empty, but immune Baratinha cannot be swapped)
      actions.push({
        type: 'MAGO_SWAP',
        from: pos,
        to: pos,
        description: 'Transmutar: Permutar 2 casas vizinhas',
        badgeColor: 'purple',
      });
      break;
    }

    case 'papa': {
      // Moves and captures like King
      addStepMoves([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]);
      break;
    }

    case 'baleia_cinzenta': {
      // Slides orthogonally like Rook, can pass through and capture up to 2 enemy pieces
      const rookDirs: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];
      for (const [dr, dc] of rookDirs) {
        let step = 1;
        const capturedEnemies: Position[] = [];
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          const occupant = board[nr][nc];

          if (!occupant) {
            // Empty square
            if (capturedEnemies.length === 0) {
              addMove({ r: nr, c: nc });
            } else {
              // Sliding further after 1st capture
              actions.push({
                type: 'BALEIA_CINZENTA_SWEEP',
                from: pos,
                to: { r: nr, c: nc },
                secondaryTargets: [...capturedEnemies],
                description: `Tsunami Devastador até ${colToLetter(nc)}${8 - nr} (capturando ${capturedEnemies.length})`,
                badgeColor: 'red',
              });
            }
          } else if (occupant.player === player) {
            // Blocked by friendly piece
            break;
          } else {
            // Enemy piece
            if (occupant.type === 'baratinha') {
              break; // Immune blocks path
            }
            if (capturedEnemies.length === 0) {
              // 1st enemy hit
              capturedEnemies.push({ r: nr, c: nc });
              actions.push({
                type: 'BALEIA_CINZENTA_SWEEP',
                from: pos,
                to: { r: nr, c: nc },
                secondaryTargets: [{ r: nr, c: nc }],
                description: `Capturar 1ª presa em ${colToLetter(nc)}${8 - nr}`,
                badgeColor: 'red',
              });
              // Continue sliding to check for 2nd enemy
            } else if (capturedEnemies.length === 1) {
              // 2nd enemy hit!
              capturedEnemies.push({ r: nr, c: nc });
              actions.push({
                type: 'BALEIA_CINZENTA_SWEEP',
                from: pos,
                to: { r: nr, c: nc },
                secondaryTargets: [...capturedEnemies],
                description: `Captura dupla (2 presas) em ${colToLetter(nc)}${8 - nr}`,
                badgeColor: 'red',
              });
              break; // Max 2 enemies captured
            }
          }
          step++;
        }
      }
      break;
    }

    case 'baleia_assassina': {
      // Moves to empty squares orthogonally like Rook
      const rookDirs: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];
      for (const [dr, dc] of rookDirs) {
        let step = 1;
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          if (!board[nr][nc]) {
            addMove({ r: nr, c: nc });
          } else {
            break;
          }
          step++;
        }
      }
      // Captures only 1 square away in the 3 forward positions
      for (const dc of [-1, 0, 1]) {
        const nr = pos.r + fwd;
        const nc = pos.c + dc;
        if (isWithinBoard(nr, nc)) {
          const occupant = board[nr][nc];
          if (occupant && canOccupyEnemy(occupant)) {
            addCapture({ r: nr, c: nc });
          }
        }
      }
      break;
    }

    case 'gatito_gasoso': {
      // Jumps like Knight, toxic gas sweeping chosen L curve
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of knightOffsets) {
        const destR = pos.r + dr;
        const destC = pos.c + dc;
        if (!isWithinBoard(destR, destC)) continue;

        // Path A & Path B
        let pathA: Position[];
        let pathB: Position[];

        if (Math.abs(dr) === 2) {
          // dr = ±2, dc = ±1
          const midR = pos.r + dr / 2;
          pathA = [
            { r: midR, c: pos.c },
            { r: destR, c: pos.c },
          ];
          pathB = [
            { r: pos.r, c: destC },
            { r: midR, c: destC },
          ];
        } else {
          // dr = ±1, dc = ±2
          const midC = pos.c + dc / 2;
          pathA = [
            { r: pos.r, c: midC },
            { r: pos.r, c: destC },
          ];
          pathB = [
            { r: destR, c: pos.c },
            { r: destR, c: midC },
          ];
        }

        const makeGasAction = (route: Position[], label: string) => {
          actions.push({
            type: 'GATITO_GASOSO_JUMP',
            from: pos,
            to: { r: destR, c: destC },
            route,
            description: `Salto Tóxico (${label}) até ${colToLetter(destC)}${8 - destR}`,
            badgeColor: 'purple',
          });
        };

        // If path A and path B have different contents, offer both; otherwise one is sufficient
        const aHasTargets = pathA.some((p) => {
          const oc = board[p.r][p.c];
          return oc && oc.type !== 'baratinha';
        });
        const bHasTargets = pathB.some((p) => {
          const oc = board[p.r][p.c];
          return oc && oc.type !== 'baratinha';
        });

        if (aHasTargets || bHasTargets) {
          makeGasAction(pathA, 'Curva A');
          makeGasAction(pathB, 'Curva B');
        } else {
          makeGasAction(pathA, 'Salto');
        }
      }
      break;
    }

    case 'gatito_apaixonado': {
      // Moves and captures like Knight
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = pos.r + dr;
        const nc = pos.c + dc;
        if (!isWithinBoard(nr, nc)) continue;
        const occupant = board[nr][nc];
        if (!occupant) {
          addMove({ r: nr, c: nc });
        } else if (canOccupyEnemy(occupant)) {
          addCapture({ r: nr, c: nc });
        }
      }
      // Additionally: can jump onto enemy Queen if within Chebyshev distance <= 2
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = pos.r + dr;
          const nc = pos.c + dc;
          if (isWithinBoard(nr, nc)) {
            const occupant = board[nr][nc];
            if (occupant && occupant.player === opponent && occupant.type === 'rainha') {
              // Avoid duplicate if already covered by Knight jump
              if (!actions.some((a) => a.to.r === nr && a.to.c === nc)) {
                actions.push({
                  type: 'CAPTURE',
                  from: pos,
                  to: { r: nr, c: nc },
                  target: { r: nr, c: nc },
                  description: `Pulo Apaixonado na Rainha em ${colToLetter(nc)}${8 - nr}! ❤️`,
                  badgeColor: 'red',
                });
              }
            }
          }
        }
      }
      break;
    }

    case 'gatito_mahchia': {
      // Moves to empty squares like Queen
      // If targeting enemy in line of sight, transforms them into Sapo
      // (or regular capture if last Royal piece)
      const queenDirs: [number, number][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      const opponentRoyals = getAliveRoyalPieces(board, opponent);
      for (const [dr, dc] of queenDirs) {
        let step = 1;
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          const occupant = board[nr][nc];
          if (!occupant) {
            addMove({ r: nr, c: nc });
          } else {
            if (occupant.player === opponent && occupant.type !== 'baratinha') {
              const isLastRoyal =
                opponentRoyals.length === 1 &&
                arePositionsEqual(opponentRoyals[0].pos, { r: nr, c: nc });

              if (isLastRoyal) {
                // Regular capture against last King
                addCapture({ r: nr, c: nc });
              } else {
                // Transform into Sapo: stops 1 square before (or stays in place if step === 1)
                const stopR = step === 1 ? pos.r : pos.r + dr * (step - 1);
                const stopC = step === 1 ? pos.c : pos.c + dc * (step - 1);
                actions.push({
                  type: 'TRANSFORM_SAPO',
                  from: pos,
                  to: { r: stopR, c: stopC },
                  target: { r: nr, c: nc },
                  description: `Enfeitiçar em Sapo em ${colToLetter(nc)}${8 - nr}`,
                  badgeColor: 'green',
                });
              }
            }
            break;
          }
          step++;
        }
      }
      break;
    }

    case 'sapo': {
      // Moves only 1 square forward, empty only, cannot capture
      const nr = pos.r + fwd;
      if (isWithinBoard(nr, pos.c) && !board[nr][pos.c]) {
        addMove({ r: nr, c: pos.c });
      }
      break;
    }

    case 'passaro_uratal': {
      // Moves to empty squares like Bishop, cannot capture
      const diagDirs: [number, number][] = [
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ];
      for (const [dr, dc] of diagDirs) {
        let step = 1;
        while (true) {
          const nr = pos.r + dr * step;
          const nc = pos.c + dc * step;
          if (!isWithinBoard(nr, nc)) break;
          if (!board[nr][nc]) {
            addMove({ r: nr, c: nc });
          } else {
            break;
          }
          step++;
        }
      }
      break;
    }

    case 'bela_adormecida':
    case 'mirra': {
      // Moves 1 square forward to empty
      const nr = pos.r + fwd;
      if (isWithinBoard(nr, pos.c)) {
        const occupant = board[nr][pos.c];
        if (!occupant) {
          addMove({ r: nr, c: pos.c });
        } else if (canOccupyEnemy(occupant)) {
          // Captures 1 square directly forward!
          addCapture({ r: nr, c: pos.c });
        }
      }
      break;
    }

    case 'perereca': {
      // Moves and captures 1 square any direction like King
      addStepMoves([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]);
      // Special leap over adjacent enemy to empty square behind
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const adjR = pos.r + dr;
          const adjC = pos.c + dc;
          const behindR = pos.r + 2 * dr;
          const behindC = pos.c + 2 * dc;
          if (isWithinBoard(adjR, adjC) && isWithinBoard(behindR, behindC)) {
            const enemy = board[adjR][adjC];
            const behind = board[behindR][behindC];
            if (enemy && enemy.player === opponent && !behind) {
              actions.push({
                type: 'PERERECA_LEAP',
                from: pos,
                to: { r: behindR, c: behindC },
                description: `Pulo da Perereca sobre inimigo para ${colToLetter(behindC)}${8 - behindR}`,
                badgeColor: 'purple',
              });
            }
          }
        }
      }
      break;
    }

    case 'goham': {
      // Moves 1 square forward to empty (no capture)
      const nr = pos.r + fwd;
      if (isWithinBoard(nr, pos.c) && !board[nr][pos.c]) {
        addMove({ r: nr, c: pos.c });
      }
      break;
    }

    case 'quero_quero': {
      // Moves 1 square forward to empty
      const nr = pos.r + fwd;
      if (isWithinBoard(nr, pos.c) && !board[nr][pos.c]) {
        addMove({ r: nr, c: pos.c });
      }
      // Swoop capture 1 to 4 squares forward in a straight line
      for (let step = 1; step <= 4; step++) {
        const sr = pos.r + fwd * step;
        if (!isWithinBoard(sr, pos.c)) break;
        const occupant = board[sr][pos.c];
        if (!occupant) {
          continue; // Path continues
        } else {
          if (canOccupyEnemy(occupant)) {
            addCapture({ r: sr, c: pos.c });
          }
          break; // First obstacle stops swoop
        }
      }
      break;
    }

    case 'tartaruga_maligna': {
      // Moves 1 square forward to empty
      const nr = pos.r + fwd;
      if (isWithinBoard(nr, pos.c)) {
        const occupant = board[nr][pos.c];
        if (!occupant) {
          addMove({ r: nr, pos: { r: nr, c: pos.c } }.pos);
        } else if (occupant.player === opponent && occupant.type !== 'baratinha') {
          // Attack forward without moving, turning enemy into Sapo
          actions.push({
            type: 'TRANSFORM_SAPO',
            from: pos,
            to: pos,
            target: { r: nr, c: pos.c },
            description: `Enfeitiçar em Sapo em ${colToLetter(pos.c)}${8 - nr}`,
            badgeColor: 'green',
          });
        }
      }
      break;
    }
  }

  return actions;
}

// Check if square (targetPos) is under attack by opponent
export function isSquareUnderAttack(
  board: Board,
  targetPos: Position,
  byPlayer: Player
): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.player !== byPlayer) continue;
      const def = PIECE_CATALOG[p.type];
      if (def?.noThreatCheck) continue; // Baratinhas do not threaten

      const rawActions = generateRawActionsForPiece(board, { r, c });
      for (const act of rawActions) {
        if (
          act.type === 'CAPTURE' ||
          act.type === 'RANGED_ATTACK' ||
          act.type === 'TRANSFORM_SAPO' ||
          act.type === 'BALEIA_CINZENTA_SWEEP'
        ) {
          if (arePositionsEqual(act.to, targetPos)) return true;
          if (act.target && arePositionsEqual(act.target, targetPos)) return true;
          if (
            act.secondaryTargets &&
            act.secondaryTargets.some((st) => arePositionsEqual(st, targetPos))
          ) {
            return true;
          }
        }
        if (act.type === 'GATITO_GASOSO_JUMP') {
          if (arePositionsEqual(act.to, targetPos)) return true;
          if (act.route && act.route.some((rp) => arePositionsEqual(rp, targetPos))) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Applies a move in a temporary/sandbox simulation (without full state machine side-effects)
export function simulateMove(board: Board, action: ActionCandidate): Board {
  const next = cloneBoard(board);
  const mover = next[action.from.r][action.from.c];
  if (!mover) return next;

  switch (action.type) {
    case 'MOVE':
    case 'CAPTURE':
    case 'PERERECA_LEAP': {
      next[action.from.r][action.from.c] = null;
      next[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }
    case 'RANGED_ATTACK': {
      if (action.target) {
        next[action.target.r][action.target.c] = null;
      }
      break;
    }
    case 'BALEIA_CINZENTA_SWEEP': {
      next[action.from.r][action.from.c] = null;
      if (action.secondaryTargets) {
        for (const st of action.secondaryTargets) {
          next[st.r][st.c] = null;
        }
      }
      next[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }
    case 'GATITO_GASOSO_JUMP': {
      next[action.from.r][action.from.c] = null;
      if (action.route) {
        for (const rp of action.route) {
          const occ = next[rp.r][rp.c];
          if (occ && occ.type !== 'baratinha') {
            next[rp.r][rp.c] = null;
          }
        }
      }
      next[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      break;
    }
    case 'TRANSFORM_SAPO': {
      next[action.from.r][action.from.c] = null;
      next[action.to.r][action.to.c] = { ...mover, hasMoved: true };
      if (action.target) {
        const victim = next[action.target.r][action.target.c];
        if (victim && victim.type !== 'baratinha') {
          next[action.target.r][action.target.c] = {
            ...victim,
            originalType: victim.originalType || victim.type,
            type: 'sapo',
          };
        }
      }
      break;
    }
    case 'CONSTRUCTOR_BUILD': {
      if (action.target) {
        const pawn = next[action.target.r][action.target.c];
        if (pawn) {
          next[action.target.r][action.target.c] = {
            ...pawn,
            type: 'torre',
          };
        }
      }
      break;
    }
    case 'MAGO_SWAP': {
      // Swapping happens via sub-step
      break;
    }
  }

  return next;
}

// Generate all legal actions for a piece, filtering:
// 1. King check (if player has only 1 royal piece, king cannot remain in check)
// 2. Uratal screech (if active, must maximize distance to Uratal)
export function getLegalActionsForPiece(
  board: Board,
  pos: Position,
  uratalScreechBirdPos: Position | null = null
): ActionCandidate[] {
  const piece = board[pos.r][pos.c];
  if (!piece) return [];

  const rawActions = generateRawActionsForPiece(board, pos);
  const player = piece.player;
  const opponent: Player = player === 'white' ? 'black' : 'white';

  // Filter 1: Check validation if exactly 1 Royal piece is alive
  const legalActions: ActionCandidate[] = [];

  for (const act of rawActions) {
    if (act.type === 'MAGO_SWAP') {
      // Mago swap will open sub-steps, we allow opening it
      legalActions.push(act);
      continue;
    }

    const simBoard = simulateMove(board, act);
    const simRoyals = getAliveRoyalPieces(simBoard, player);

    // If candidate move captured own last royal or left single royal in check:
    if (simRoyals.length === 0) {
      continue; // Illegal, cannot commit suicide with sole king
    } else if (simRoyals.length === 1) {
      const soleRoyalPos = simRoyals[0].pos;
      if (isSquareUnderAttack(simBoard, soleRoyalPos, opponent)) {
        continue; // Leaves sole King in check!
      }
    }
    // If simRoyals.length > 1 (e.g. King + Príncipe alive), moves are freely legal!

    legalActions.push(act);
  }

  // Filter 2: Uratal screech filter
  if (uratalScreechBirdPos && legalActions.length > 0) {
    // Find maximum distance to the bird among these legal actions
    let maxDist = -1;
    for (const act of legalActions) {
      const endPos = act.to;
      const d = getEuclideanDistanceSq(endPos, uratalScreechBirdPos);
      if (d > maxDist) maxDist = d;
    }
    return legalActions.filter((act) => {
      const d = getEuclideanDistanceSq(act.to, uratalScreechBirdPos);
      return d === maxDist;
    });
  }

  return legalActions;
}

export function getAllLegalActionsForPlayer(
  board: Board,
  player: Player,
  uratalScreechBirdPos: Position | null = null
): { from: Position; actions: ActionCandidate[] }[] {
  const result: { from: Position; actions: ActionCandidate[] }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.player === player) {
        const actions = getLegalActionsForPiece(board, { r, c }, uratalScreechBirdPos);
        if (actions.length > 0) {
          result.push({ from: { r, c }, actions });
        }
      }
    }
  }
  return result;
}

export function isPlayerInCheck(board: Board, player: Player): boolean {
  const royals = getAliveRoyalPieces(board, player);
  if (royals.length !== 1) {
    return false; // With >1 royal (Rei + Príncipe) or 0, standard check doesn't apply
  }
  const opponent: Player = player === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(board, royals[0].pos, opponent);
}

export function colToLetter(c: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + c);
}

