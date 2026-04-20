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
} from '../types/GameTypes';

// ── Estado global ─────────────────────────────────────────────

interface HiddenDice {
  red: number;
  blue: number;
}

interface GameState {
  connected: boolean;
  playerId: string | null;
  roomCode: string | null;
  isLeader: boolean;
  phase: GamePhase;
  currentRound: number;
  currentPlay: number;
  currentTurnPlayerId: string;
  players: Player[];
  hiddenDice: HiddenDice | null;
  playResult: PlayResultEntry[] | null;
  roundResult: RoundScoreEntry[] | null;
  gameOver: { finalScores: FinalScoreEntry[]; winnerName: string } | null;
  error: string | null;
}

const initialState: GameState = {
  connected: false,
  playerId: null,
  roomCode: null,
  isLeader: false,
  phase: 'waiting_for_players',
  currentRound: 1,
  currentPlay: 1,
  currentTurnPlayerId: '',
  players: [],
  hiddenDice: null,
  playResult: null,
  roundResult: null,
  gameOver: null,
  error: null,
};

// ── Acciones del reducer ──────────────────────────────────────

type Action =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'ROOM_CREATED'; payload: { roomCode: string; playerId: string } }
  | { type: 'ROOM_JOINED'; payload: { roomCode: string; playerId: string } }
  | { type: 'GAME_STATE'; payload: {
      phase: GamePhase;
      currentRound: number;
      currentPlay: number;
      currentTurnPlayerId: string;
      players: Player[];
      roomCode: string;
    }}
  | { type: 'HIDDEN_DICE'; payload: HiddenDice }
  | { type: 'PLAY_RESULT'; payload: PlayResultEntry[] }
  | { type: 'ROUND_RESULT'; payload: RoundScoreEntry[] }
  | { type: 'GAME_OVER'; payload: { finalScores: FinalScoreEntry[]; winnerName: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };

    case 'ROOM_CREATED':
      return {
        ...state,
        roomCode: action.payload.roomCode,
        playerId: action.payload.playerId,
        isLeader: true,
      };

    case 'ROOM_JOINED':
      return {
        ...state,
        roomCode: action.payload.roomCode,
        playerId: action.payload.playerId,
        isLeader: false,
      };

    case 'GAME_STATE':
      return {
        ...state,
        phase: action.payload.phase,
        currentRound: action.payload.currentRound,
        currentPlay: action.payload.currentPlay,
        currentTurnPlayerId: action.payload.currentTurnPlayerId,
        players: action.payload.players,
        roomCode: action.payload.roomCode,
        // Limpiar resultados anteriores al cambiar fase
        playResult: null,
        roundResult: null,
      };

    case 'HIDDEN_DICE':
      return { ...state, hiddenDice: action.payload };

    case 'PLAY_RESULT':
      return { ...state, playResult: action.payload };

    case 'ROUND_RESULT':
      return { ...state, roundResult: action.payload };

    case 'GAME_OVER':
      return { ...state, gameOver: action.payload, phase: 'game_over' };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'RESET':
      return { ...initialState, connected: state.connected };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  connect: () => Promise<void>;
  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  startGame: () => void;
  makePrediction: (card: 'Zero' | 'Min' | 'More' | 'Max') => void;
  selectDice: (whiteIndices: number[], useRed: boolean, useBlue: boolean) => void;
  clearError: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Escuchar mensajes del servidor
  useEffect(() => {
    const unsubscribe = socketService.onMessage((message: ServerMessage) => {
      switch (message.type) {
        case 'room_created':
          dispatch({
            type: 'ROOM_CREATED',
            payload: { roomCode: message.room_code, playerId: message.player_id },
          });
          break;

        case 'room_joined':
          dispatch({
            type: 'ROOM_JOINED',
            payload: { roomCode: message.room_code, playerId: message.player_id },
          });
          break;

        case 'game_state':
          dispatch({
            type: 'GAME_STATE',
            payload: {
              phase: message.phase,
              currentRound: message.current_round,
              currentPlay: message.current_play,
              currentTurnPlayerId: message.current_turn_player_id,
              players: message.players,
              roomCode: message.room_code,
            },
          });
          break;

        case 'your_hidden_dice':
          dispatch({
            type: 'HIDDEN_DICE',
            payload: { red: message.red, blue: message.blue },
          });
          break;

        case 'play_result':
          dispatch({ type: 'PLAY_RESULT', payload: message.results });
          break;

        case 'round_result':
          dispatch({ type: 'ROUND_RESULT', payload: message.scores });
          break;

        case 'game_over':
          dispatch({
            type: 'GAME_OVER',
            payload: {
              finalScores: message.final_scores,
              winnerName: message.winner_name,
            },
          });
          break;

        case 'error':
          dispatch({ type: 'SET_ERROR', payload: message.message });
          break;
      }
    });

    return unsubscribe;
  }, []);
  
  // Conexión automática al iniciar la app
  useEffect(() => {
    socketService.connect()
      .then(() => dispatch({ type: 'SET_CONNECTED', payload: true }))
      .catch(() => dispatch({ type: 'SET_CONNECTED', payload: false }));

    // Detectar desconexión
    return () => {
      socketService.disconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      await socketService.connect();
      dispatch({ type: 'SET_CONNECTED', payload: true });
    } catch {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    }
  }, []);

  const createRoom = useCallback((playerName: string) => {
    socketService.createRoom(playerName);
  }, []);

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    socketService.joinRoom(roomCode, playerName);
  }, []);

  const startGame = useCallback(() => {
    socketService.startGame();
  }, []);

  const makePrediction = useCallback((card: 'Zero' | 'Min' | 'More' | 'Max') => {
    socketService.makePrediction(card);
  }, []);

  const selectDice = useCallback((
    whiteIndices: number[],
    useRed: boolean,
    useBlue: boolean,
  ) => {
    socketService.selectDice(whiteIndices, useRed, useBlue);
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      connect,
      createRoom,
      joinRoom,
      startGame,
      makePrediction,
      selectDice,
      clearError,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider');
  }
  return context;
}