import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { registerChatHandlers } from "./chatSocketHandler";
import { registerUserHandlers } from "./userSocketHandler";
import { buildChatUseCases, socketEmitter } from "../config/di";
import { UserOnlineStatusUseCase } from "../../application/usecases/chat/userOnlineStatusUSeCase";

export function initSocket(httpServer: HttpServer, corsOrigin: string): SocketServer {
    console.log("🔧 Socket CORS origin:", corsOrigin); 


  const io = new SocketServer(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

socketEmitter.setIO(io);
  const useCases = buildChatUseCases();
const userOnlineStatusUSeCase= new UserOnlineStatusUseCase(socketEmitter)

  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);
    registerUserHandlers(socket,{userOnlineStatusUC:userOnlineStatusUSeCase})
    registerChatHandlers(socket,useCases);
  });

  return io;
}