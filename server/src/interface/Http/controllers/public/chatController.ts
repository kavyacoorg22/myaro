import { NextFunction, Request, Response } from "express";
import { IGetMessagesByChatUseCase } from "../../../../application/interface/chat/IGetMessagesByChat";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { ICreateChatUSeCase } from "../../../../application/interface/chat/ICreateChatUSeCase";
import { IGetChatByParticipants } from "../../../../application/interface/chat/IGetChatByParticipants";
import { IGetUserChatsUseCase } from "../../../../application/interface/chat/IGetUserChatUseCase";

export class ChatController {
  constructor(
    private getMessagesByChatUC: IGetMessagesByChatUseCase,
    private createChatUC: ICreateChatUSeCase,
    private getChatByParticipantsUseCase: IGetChatByParticipants,
    private getUserChatsUC: IGetUserChatsUseCase,
  ) {}

  getMessageByChat = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId)
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      const chatId = req.params.chatId;
      const { cursor, limit } = req.query;

      if (!chatId || typeof chatId !== "string") {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.getMessagesByChatUC.execute({
        chatId,
        userId,
        cursor: typeof cursor === "string" ? cursor : undefined,
        limit: limit ? parseInt(limit as string) : 30,
      });

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  createChat = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const participantA = req.user?.id;
      const participantB = req.body.participantB;

      if (!participantA) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!participantB) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.createChatUC.execute({ participantA, participantB });
      res.send(HttpStatus.CREATED).json({
        success: true,
        message: "chat created",
      });
    } catch (err) {
      next(err);
    }
  };

  getChatByParticipants = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const participantA = req.user?.id;
      const participantB = req.params.id;

      if (!participantA) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!participantB) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const chat = await this.getChatByParticipantsUseCase.execute({
        participantA,
        participantB,
      });
      res.json(HttpStatus.OK).json({
        success: true,
        message: "fetched",
        chat: chat,
      });
    } catch (err) {
      next(err);
    }
  };

  getUserChats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId)
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );

      const { cursor, limit } = req.query;

      const result = await this.getUserChatsUC.execute({
        userId,
        cursor: typeof cursor === "string" ? cursor : undefined,
        limit: limit ? parseInt(limit as string) : 20,
      });

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
