export type Player = 'white' | 'black'; // white = Jogador 1 (Gatito/Gatita), black = Jogador 2

export interface Position {
  r: number; // 0-7, 0 is row 8 (Black backrank), 7 is row 1 (White backrank)
  c: number; // 0-7, 0 is 'a', 7 is 'h'
}

export type PieceCategory = 'classic' | 'gatito' | 'gatita';

export type PieceId =
  // Clássicas (6)
  | 'rei'
  | 'rainha'
  | 'torre'
  | 'bispo'
  | 'cavalo'
  | 'peao'
  // Peças do Gatito (10)
  | 'boto_cor_de_rosa'
  | 'sniper'
  | 'homem_bomba'
  | 'principe'
  | 'arqueiro'
  | 'baratinha'
  | 'construtor'
  | 'mago'
  | 'papa'
  | 'guarda'
  // Peças da Gatita (14)
  | 'baleia_cinzenta'
  | 'baleia_assassina'
  | 'gatito_gasoso'
  | 'gatito_apaixonado'
  | 'gatito_mahchia'
  | 'sapo'
  | 'passaro_uratal'
  | 'bela_adormecida'
  | 'perereca'
  | 'goham'
  | 'mirra'
  | 'quero_quero'
  | 'tartaruga_maligna'
  | 'pimentinha';

export interface PieceDef {
  id: PieceId;
  name: string;
  category: PieceCategory;
  subtitle: string;
  description: string;
  maxCopies: number; // e.g. 1, 2, 8
  isRoyal?: boolean; // rei, principe
  isImmune?: boolean; // baratinha
  cannotCapture?: boolean; // baratinha, construtor, mago, sapo, goham, passaro_uratal
  noThreatCheck?: boolean; // baratinha
}

export interface PieceInstance {
  instanceId: string;
  type: PieceId;
  player: Player;
  originalType?: PieceId; // If transformed into Sapo
  frozenRounds?: number; // Frozen by Pimentinha
  hasMoved?: boolean;
}

export type Board = (PieceInstance | null)[][]; // 8x8

export type ActionType =
  | 'MOVE' // Move to empty
  | 'CAPTURE' // Normal capture (occupies square)
  | 'RANGED_ATTACK' // Sniper, Arqueiro, Tartaruga Maligna (hits target without moving)
  | 'BALEIA_CINZENTA_SWEEP' // Captures 1 or 2 targets in line and ends at pos
  | 'GATITO_GASOSO_JUMP' // L jump with gas clearing chosen route
  | 'TRANSFORM_SAPO' // Gatito Mahchia, Tartaruga Maligna
  | 'CONSTRUCTOR_BUILD' // Turn adjacent pawn into rook
  | 'MAGO_SWAP' // Swap 2 adjacent squares
  | 'PERERECA_LEAP'; // Jump over adjacent enemy into empty square behind

export interface ActionCandidate {
  type: ActionType;
  from: Position;
  to: Position;
  target?: Position; // for ranged attack / sweep / frog
  secondaryTargets?: Position[]; // for gasoso / baleia cinzenta
  route?: Position[]; // exact route squares for gasoso curve
  extraData?: Record<string, unknown>;
  description: string;
  badgeColor: 'blue' | 'red' | 'purple' | 'green';
}

export interface ReactionGuardContext {
  attacker: PieceInstance;
  attackAction: ActionCandidate;
  targetPiece: PieceInstance;
  targetPos: Position;
  guardPos: Position;
  guardPiece: PieceInstance;
}

export interface MatchState {
  board: Board;
  turn: Player;
  halfMoves: number;
  fullMoves: number;
  history: string[];
  lastUratalScreechTurn: { player: Player; birdPos: Position } | null;
  winner: Player | 'draw' | null;
  winReason?: string;
  inCheck: boolean;
  selectedPos: Position | null;
  validActions: ActionCandidate[];
  pendingSubStep:
    | { type: 'HOMEM_BOMBA_DECISION'; piecePos: Position }
    | { type: 'PIMENTINHA_DECISION'; piecePos: Position }
    | { type: 'PROMOTION'; piecePos: Position }
    | { type: 'MAGO_FIRST_SELECTED'; magoPos: Position; firstPos: Position }
    | null;
  pendingReaction: ReactionGuardContext | null;
}

export interface PresetArmy {
  id: string;
  name: string;
  createdAt: number;
  // Map of 16 positions (r: 0|1, c: 0..7) to piece IDs
  layout: { r: number; c: number; pieceId: PieceId }[];
}

export type OrientationMode = 'pc_fixed' | 'turn_rotate' | 'table_face_to_face';
