import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketIOEmitter } from "../service/socketIOEmitter";
import { registerChatHandlers } from "./chatSocketHandler";
import { registerUserHandlers } from "./userSocketHandler";
import { buildChatUseCases } from "../config/di";
import { UserOnlineStatusUseCase } from "../../application/usecases/chat/userOnlineStatusUSeCase";

export function initSocket(httpServer: HttpServer, corsOrigin: string): SocketServer {

  const io = new SocketServer(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  const socketEmitter = new SocketIOEmitter(io);
  const useCases = buildChatUseCases(socketEmitter);
const userOnlineStatusUSeCase= new UserOnlineStatusUseCase(socketEmitter)

  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);
    registerUserHandlers(socket,{userOnlineStatusUC:userOnlineStatusUSeCase})
    registerChatHandlers(socket,useCases);
  });

  return io;
}