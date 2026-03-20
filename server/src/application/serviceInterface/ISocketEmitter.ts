export interface ISocketEmitter {
  emitToRoom(room: string, event: string, payload: unknown): void;
  emitToRoomExcept(
    excludeSocketId: string,
    room: string,
    event: string,
    payload: unknown,
  ): void;
  emitToSocket(socketId: string, event: string, payload: unknown): void;
  joinRoom(socketId: string, room: string): void;
  leaveRoom(socketId: string, room: string): void;
}
