import { Server as SocketServer } from "socket.io";
import { ISocketEmitter } from "../../application/serviceInterface/ISocketEmitter";

export class SocketIOEmitter implements ISocketEmitter {
  constructor(private readonly io: SocketServer) {}

  emitToRoom(room: string, event: string, payload: unknown): void {
    this.io.to(room).emit(event, payload);
  }

  emitToRoomExcept(
    excludeSocketId: string,
    room: string,
    event: string,
    payload: unknown,
  ): void {
    const socket = this.io.sockets.sockets.get(excludeSocketId);
    if (socket) {
      socket.to(room).emit(event, payload);
    } else {
      this.io.to(room).emit(event, payload);
    }
  }

  emitToSocket(socketId: string, event: string, payload: unknown): void {
    this.io.to(socketId).emit(event, payload);
  }

  joinRoom(socketId: string, room: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    socket?.join(room);
  }

  leaveRoom(socketId: string, room: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    socket?.leave(room);
  }
}
