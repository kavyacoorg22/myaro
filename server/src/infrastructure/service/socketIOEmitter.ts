
import { Server as SocketServer } from "socket.io";
import { ISocketEmitter } from "../../application/serviceInterface/ISocketEmitter";

export class SocketIOEmitter implements ISocketEmitter {
  private io: SocketServer | null = null;

  setIO(io: SocketServer): void {
    this.io = io;
  }

  private getIO(): SocketServer {
    if (!this.io) throw new Error("Socket.io not initialized yet.");
    return this.io;
  }

  emitToRoom(room: string, event: string, payload: unknown): void {
    this.getIO().to(room).emit(event, payload);
  }

  emitToRoomExcept(excludeSocketId: string, room: string, event: string, payload: unknown): void {
    const socket = this.getIO().sockets.sockets.get(excludeSocketId);
    if (socket) {
      socket.to(room).emit(event, payload);
    } else {
      this.getIO().to(room).emit(event, payload);
    }
  }

  emitToSocket(socketId: string, event: string, payload: unknown): void {
    this.getIO().to(socketId).emit(event, payload);
  }

  joinRoom(socketId: string, room: string): void {
    const socket = this.getIO().sockets.sockets.get(socketId);
    socket?.join(room);
  }

  leaveRoom(socketId: string, room: string): void {
    const socket = this.getIO().sockets.sockets.get(socketId);
    socket?.leave(room);
  }
}