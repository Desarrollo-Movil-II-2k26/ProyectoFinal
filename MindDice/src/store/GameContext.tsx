import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { socketService } from '../services/SocketService';
import {
  GamePhase,
  Player,
  PlayResultEntry,
  RoundScoreEntry,
  FinalScoreEntry,
  ServerMessage,
  Shape,
} from '../types/GameTypes';

interface HiddenDice {
  red: number;
  blue: number;
}

interface HiddenDiceUsed {
  red:  boolean;
  blue: boolean;
}

interface GameState {
  connected:           boolean;
  playerId:            string | null;
  roomCode:            string | null;
  isLeader:            boolean;
  phase:               GamePhase;
  currentRound:        number;
  currentPlay:         number;
  currentTurnPlayerId: string;
  players:             Player[];
  hiddenDice:          HiddenDice | null;
  hiddenDiceUsed:      HiddenDiceUsed;
  playResult:          PlayResultEntry[] | null;
  roundResult:         RoundScoreEntry[] | null;
  gameOver:            { finalScores: FinalScoreEntry[]; winnerName: string } | null;
  error:               string | null;
  playerShapes:        Record<string, Shape>;
  shapeSelected:       boolean;
  roomDeleted:         boolean;
}

const initialState: GameState = {
  connected:           false,
  playerId:            null,
  roomCode:            null,
  isLeader:            false,
  phase:               'WaitingForPlayers',
  currentRound:        1,
  currentPlay:         1,
  currentTurnPlayerId: '',
  players:             [],
  hiddenDice:          null,
  hiddenDiceUsed:      { red: false, blue: false },
  playResult:          null,
  roundResult:         null,
  gameOver:            null,
  error:               null,
  playerShapes:        {},
  shapeSelected:       false,
  roomDeleted:         false,
};

type Action =
  | { type: 'SET_CONNECTED';           payload: boolean }
  | { type: 'ROOM_CREATED';            payload: { roomCode: string; playerId: string } }
  | { type: 'ROOM_JOINED';             payload: { roomCode: string; playerId: string } }
  | { type: 'GAME_STATE';              payload: { phase: GamePhase; currentRound: number; currentPlay: number; currentTurnPlayerId: string; players: Player[]; roomCode: string } }
  | { type: 'HIDDEN_DICE';             payload: HiddenDice }
  | { type: 'PLAY_RESULT';             payload: PlayResultEntry[] }
  | { type: 'ROUND_RESULT';            payload: RoundScoreEntry[] }
  | { type: 'GAME_OVER';               payload: { finalScores: FinalScoreEntry[]; winnerName: string } }
  | { type: 'SET_ERROR';               payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' }
  | { type: 'ROOM_DELETED' }
  | { type: 'SET_PLAYER_SHAPE';        payload: { playerId: string; shape: Shape } }
  | { type: 'CLEAR_ROUND_RESULT' }
  | { type: 'CLEAR_PLAY_RESULT' }
  | { type: 'SET_SHAPE_SELECTED' }
  | { type: 'MARK_HIDDEN_DICE_USED';   payload: { useRed: boolean; useBlue: boolean } }
  | { type: 'RESET_HIDDEN_DICE_USED' };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    case 'ROOM_CREATED':
      return { ...state, roomCode: action.payload.roomCode, playerId: action.payload.playerId, isLeader: true };
    case 'ROOM_JOINED':
      return { ...state, roomCode: action.payload.roomCode, playerId: action.payload.playerId, isLeader: false };
    case 'GAME_STATE': {
      const newRound     = action.payload.currentRound;
      const roundChanged = newRound !== state.currentRound;
      return {
        ...state,
        phase:               action.payload.phase,
        currentRound:        newRound,
        currentPlay:         action.payload.currentPlay,
        currentTurnPlayerId: action.payload.currentTurnPlayerId,
        players:             action.payload.players,
        roomCode:            action.payload.roomCode,
        hiddenDiceUsed: roundChanged ? { red: false, blue: false } : state.hiddenDiceUsed,
      };
    }
    case 'HIDDEN_DICE':
      return { ...state, hiddenDice: action.payload };
    case 'PLAY_RESULT':
      return { ...state, playResult: action.payload };
    case 'CLEAR_PLAY_RESULT':
      return { ...state, playResult: null };
    case 'ROUND_RESULT':
      return { ...state, roundResult: action.payload };
    case 'CLEAR_ROUND_RESULT':
      return { ...state, roundResult: null };
    case 'GAME_OVER':
      return { ...state, gameOver: action.payload, phase: 'GameOver' };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'ROOM_DELETED':
      return { ...initialState, connected: state.connected, shapeSelected: state.shapeSelected, roomDeleted: true };
    case 'RESET':
      return { ...initialState, connected: state.connected, shapeSelected: state.shapeSelected };
    case 'SET_PLAYER_SHAPE':
      return { ...state, playerShapes: { ...state.playerShapes, [action.payload.playerId]: action.payload.shape } };
    case 'SET_SHAPE_SELECTED':
      return { ...state, shapeSelected: true };
    case 'MARK_HIDDEN_DICE_USED':
      return { ...state, hiddenDiceUsed: { red: state.hiddenDiceUsed.red || action.payload.useRed, blue: state.hiddenDiceUsed.blue || action.payload.useBlue } };
    case 'RESET_HIDDEN_DICE_USED':
      return { ...state, hiddenDiceUsed: { red: false, blue: false } };
    default:
      return state;
  }
}

interface GameContextValue {
  state:             GameState;
  connect:           () => Promise<void>;
  createRoom:        (playerName: string) => void;
  joinRoom:          (roomCode: string, playerName: string) => void;
  startGame:         () => void;
  leaveRoom:         () => void;
  makePrediction:    (card: 'Zero' | 'Min' | 'More' | 'Max') => void;
  selectDice:        (whiteIndices: number[], useRed: boolean, useBlue: boolean) => void;
  clearError:        () => void;
  resetGame:         () => void;
  setPlayerShape:    (playerId: string, shape: Shape) => void;
  confirmShape:      () => void;
  clearRoundResult:  () => void;
  clearPlayResult:   () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const unsubscribe = socketService.onMessage((message: ServerMessage) => {
      switch (message.type) {
        case 'room_created':
          dispatch({ type: 'ROOM_CREATED', payload: { roomCode: message.room_code, playerId: message.player_id } });
          break;
        case 'room_joined':
          dispatch({ type: 'ROOM_JOINED', payload: { roomCode: message.room_code, playerId: message.player_id } });
          break;
        case 'game_state':
          dispatch({ type: 'GAME_STATE', payload: { phase: message.phase, currentRound: message.current_round, currentPlay: message.current_play, currentTurnPlayerId: message.current_turn_player_id, players: message.players, roomCode: message.room_code } });
          break;
        case 'your_hidden_dice':
          dispatch({ type: 'HIDDEN_DICE', payload: { red: message.red, blue: message.blue } });
          break;
        case 'play_result':
          console.log('[PLAY_RESULT recibido]', message.results);
          dispatch({ type: 'PLAY_RESULT', payload: message.results });
          break;
        case 'round_result':
          dispatch({ type: 'ROUND_RESULT', payload: message.scores });
          break;
        case 'game_over':
          dispatch({ type: 'GAME_OVER', payload: { finalScores: message.final_scores, winnerName: message.winner_name } });
          break;
        case 'error':
          // Detectar si la sala fue eliminada o un jugador abandonó
          if (
            message.message.toLowerCase().includes('eliminada') ||
            message.message.toLowerCase().includes('lider abandono') ||
            message.message.toLowerCase().includes('abandonó la sala') ||
            message.message.toLowerCase().includes('partida ha terminado')
          ) {
            console.log('[SALA ELIMINADA]', message.message);
            dispatch({ type: 'ROOM_DELETED' });
          } else {
            dispatch({ type: 'SET_ERROR', payload: message.message });
          }
          break;
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    socketService.connect()
      .then(() => dispatch({ type: 'SET_CONNECTED', payload: true }))
      .catch(() => dispatch({ type: 'SET_CONNECTED', payload: false }));
    return () => { socketService.disconnect(); };
  }, []);

  const connect        = useCallback(async () => {
    try {
      await socketService.connect();
      dispatch({ type: 'SET_CONNECTED', payload: true });
    } catch {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    }
  }, []);

  const createRoom     = useCallback((playerName: string) => { socketService.createRoom(playerName); }, []);
  const joinRoom       = useCallback((roomCode: string, playerName: string) => { socketService.joinRoom(roomCode, playerName); }, []);
  const startGame      = useCallback(() => { socketService.startGame(); }, []);
  const leaveRoom      = useCallback(() => { socketService.leaveRoom(); dispatch({ type: 'RESET' }); }, []);
  const makePrediction = useCallback((card: 'Zero' | 'Min' | 'More' | 'Max') => { socketService.makePrediction(card); }, []);
  const selectDice     = useCallback((w: number[], r: boolean, b: boolean) => { socketService.selectDice(w, r, b); dispatch({ type: 'MARK_HIDDEN_DICE_USED', payload: { useRed: r, useBlue: b } }); }, []);
  const clearError     = useCallback(() => { dispatch({ type: 'CLEAR_ERROR' }); }, []);
  const resetGame      = useCallback(() => { dispatch({ type: 'RESET' }); }, []);
  const setPlayerShape = useCallback((playerId: string, shape: Shape) => { dispatch({ type: 'SET_PLAYER_SHAPE', payload: { playerId, shape } }); }, []);
  const confirmShape   = useCallback(() => { dispatch({ type: 'SET_SHAPE_SELECTED' }); }, []);
  const clearRoundResult = useCallback(() => { dispatch({ type: 'CLEAR_ROUND_RESULT' }); }, []);
  const clearPlayResult  = useCallback(() => { dispatch({ type: 'CLEAR_PLAY_RESULT' }); }, []);

  return (
    <GameContext.Provider value={{ state, connect, createRoom, joinRoom, startGame, leaveRoom, makePrediction, selectDice, clearError, resetGame, setPlayerShape, confirmShape, clearRoundResult, clearPlayResult }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de GameProvider');
  return context;
}