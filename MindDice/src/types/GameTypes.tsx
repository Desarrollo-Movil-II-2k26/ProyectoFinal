// ─── Tipos del juego ────────────────────────────────────────────────────────

export type Phase =
  | 'waiting_for_players'
  | 'making_predictions'
  | 'selecting_dice'
  | 'showing_play_results'
  | 'showing_round_results'
  | 'game_over';

export type PredictionCard = 'Zero' | 'Min' | 'More' | 'Max';
export type ComboType = 'Triple' | 'Straight' | 'Pair' | 'None';

// ─── FRONTEND → BACKEND ─────────────────────────────────────────────────────

export interface MsgCreateRoom {
  type: 'create_room';
  player_name: string;
}

export interface MsgJoinRoom {
  type: 'join_room';
  room_code: string;
  player_name: string;
}

export interface MsgStartGame {
  type: 'start_game';
}

export interface MsgMakePrediction {
  type: 'make_prediction';
  card: PredictionCard;
}

export interface MsgSelectDice {
  type: 'select_dice';
  white_indices: number[]; // 0–8, máx 3 elementos
  use_red: boolean;
  use_blue: boolean;
  // REGLA: white_indices.length + (use_red?1:0) + (use_blue?1:0) === 3
}

// ─── BACKEND → FRONTEND ─────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  total_score: number;
  round_score: number;
  prediction_made: boolean;
  prediction_correct: boolean;
  is_leader: boolean;
  connected: boolean;
}

export interface MsgRoomCreated {
  type: 'room_created';
  room_code: string;
  player_id: string;
}

export interface MsgRoomJoined {
  type: 'room_joined';
  room_code: string;
  player_id: string;
}

export interface MsgGameState {
  type: 'game_state';
  room_code: string;
  phase: Phase;
  current_round: number;
  current_play: number;
  current_turn_player_id: string;
  players: Player[];
}

export interface MsgHiddenDice {
  type: 'your_hidden_dice';
  red: number;
  blue: number;
}

export interface PlayResultEntry {
  player_id: string;
  player_name: string;
  dice_used: number[];
  combo_type: ComboType;
  points_earned: number;
}

export interface MsgPlayResult {
  type: 'play_result';
  results: PlayResultEntry[];
}

export interface RoundScoreEntry {
  player_id: string;
  player_name: string;
  round_score: number;
  bonus_applied: boolean;
  prediction_card: string;
  final_round_score: number;
  total_score: number;
}

export interface MsgRoundResult {
  type: 'round_result';
  round: number;
  scores: RoundScoreEntry[];
}

export interface FinalScoreEntry {
  player_id: string;
  player_name: string;
  total_score: number;
  position: number;
}

export interface MsgGameOver {
  type: 'game_over';
  winner_name: string;
  final_scores: FinalScoreEntry[];
}

export interface MsgError {
  type: 'error';
  message: string;
}

export type ServerMessage =
  | MsgRoomCreated
  | MsgRoomJoined
  | MsgGameState
  | MsgHiddenDice
  | MsgPlayResult
  | MsgRoundResult
  | MsgGameOver
  | MsgError;

// ─── Estado local del cliente (nunca viene del server) ───────────────────────

export interface LocalState {
  playerId: string | null;
  roomCode: string | null;
  isLeader: boolean;
  myHiddenDice: { red: number; blue: number } | null;
}