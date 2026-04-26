export type GamePhase =
  | 'WaitingForPlayers'
  | 'MakingPredictions'
  | 'SelectingDice'
  | 'ShowingPlayResults'
  | 'ShowingRoundResults'
  | 'GameOver';

export type PredictionCard = 'Zero' | 'Min' | 'More' | 'Max';
export type ComboType = 'Triple' | 'Straight' | 'Pair' | 'None';
export type Shape = 'circle' | 'diamond' | 'square' | 'triangle';
export type SelectDiceMessage = { type: 'select_dice'; white_indices: number[]; use_red: boolean; use_blue: boolean };

export interface Player {
  id: string;
  name: string;
  total_score: number;
  round_score: number;
  white_dice: number[];
  prediction_made: boolean;
  prediction_correct: boolean;
  is_leader: boolean;
  connected: boolean;
}

export interface PlayResultEntry {
  player_id: string;
  player_name: string;
  dice_used: number[];
  combo_type: ComboType;
  points_earned: number;
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

export interface FinalScoreEntry {
  player_id: string;
  player_name: string;
  total_score: number;
  position: number;
}

export type ClientMessage =
  | { type: 'create_room'; player_name: string }
  | { type: 'join_room'; room_code: string; player_name: string }
  | { type: 'start_game' }
  |  { type: 'leave_room' }
  | { type: 'make_prediction'; card: PredictionCard }
  | { type: 'select_dice'; white_indices: number[]; use_red: boolean; use_blue: boolean };

export type ServerMessage =
  | { type: 'room_created'; room_code: string; player_id: string }
  | { type: 'room_joined'; room_code: string; player_id: string }
  | { type: 'game_state'; room_code: string; phase: GamePhase; current_round: number; current_play: number; current_turn_player_id: string; players: Player[] }
  | { type: 'your_hidden_dice'; red: number; blue: number }
  | { type: 'play_result'; results: PlayResultEntry[] }
  | { type: 'round_result'; round: number; scores: RoundScoreEntry[] }
  | { type: 'game_over'; winner_name: string; final_scores: FinalScoreEntry[] }
  | { type: 'error'; message: string };