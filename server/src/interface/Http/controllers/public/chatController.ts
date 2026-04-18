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
    private _getMessagesByChatUC: IGetMessagesByChatUseCase,
    private _createChatUC: ICreateChatUSeCase,
    private _getChatByParticipantsUseCase: IGetChatByParticipants,
    private _getUserChatsUC: IGetUserChatsUseCase,
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

      const result = await this._getMessagesByChatUC.execute({
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
     const data= await this._createChatUC.execute({ participantA, participantB });
    res.status(HttpStatus.CREATED).json({
  success: true,
  message: "chat created",
  data,
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
      const chat = await this._getChatByParticipantsUseCase.execute({
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

      const result = await this._getUserChatsUC.execute({
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
