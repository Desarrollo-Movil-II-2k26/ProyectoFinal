import { ClientMessage, ServerMessage } from '../types/GameTypes';

type MessageHandler = (message: ServerMessage) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url: string = 'ws://18.216.73.40:5000';
  private shouldReconnect: boolean = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      this.shouldReconnect = true;
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WS] Conectado');
        resolve();
      };
      this.socket.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(h => h(message));
        } catch (e) {
          console.error('[WS] Error parseando:', e);
        }
      };
      this.socket.onerror = (error) => {
        console.error('[WS] Error:', error);
        reject(error);
      };
      this.socket.onclose = () => {
        console.log('[WS] Desconectado');
        if (this.shouldReconnect) {
          this.reconnectTimer = setTimeout(() => this.connect().catch(() => {}), 3000);
        }
      };
    });
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = null;
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private send(message: ClientMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[WS] No conectado:', message);
    }
  }

  createRoom(playerName: string)  { this.send({ type: 'create_room', player_name: playerName }); }
  joinRoom(roomCode: string, playerName: string) { this.send({ type: 'join_room', room_code: roomCode, player_name: playerName }); }
  startGame() { this.send({ type: 'start_game' }); }
  makePrediction(card: 'Zero' | 'Min' | 'More' | 'Max') { this.send({ type: 'make_prediction', card }); }
  selectDice(whiteIndices: number[], useRed: boolean, useBlue: boolean) {
    this.send({ type: 'select_dice', white_indices: whiteIndices, use_red: useRed, use_blue: useBlue });
  }
}

export const socketService = new SocketService();