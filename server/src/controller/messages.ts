import { Request, NextFunction, Response } from "express";
import { messagesApi } from "../api/messages";
import { ApiError } from "../api/errorApi";
import { ObjectId } from "mongodb";
import {
  IMessageSentPopulated,
  IMongoMessage,
  INew_Message,
} from "../interfaces/messages";
import { CUDResponse } from "../interfaces/others";
import { EmailUtilities, htmlFooter, htmlGeneral } from "../utils/emails";

/**
 *
 * Messages Controller Class
 *
 */

class MessagesController {
  async getAllMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result: IMongoMessage[] | ApiError = await messagesApi.getMsg(
      undefined
    );
    if (result instanceof ApiError) next(result);
    else res.status(200).send(result);
  }

  async getUserMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user_id: string = req.params.id;
    if (ObjectId.isValid(user_id)) {
      const result: IMongoMessage[] | ApiError = await messagesApi.getMsg(
        user_id
      );
      if (result instanceof ApiError) next(result);
      else res.status(200).send(result);
    }
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    const message: INew_Message = req.body;
    const { name, surname } = req.user as Express.User;
    const result: CUDResponse | ApiError = await messagesApi.addMsg(message);
    if (result instanceof ApiError) next(result);
    else {
      const htmlEmail = htmlGeneral
        .concat(
          `<h2>You have received a new message!</h2><h4>Here are the details:</h4>`.concat(
            `<p ="products-list" style="text-align: left; margin-left: 2.5rem;">${message.timestamp} | ${name} ${surname}: ${message.message}</p>`
          )
        )
        .concat(htmlFooter);
      const toEmail = (result.data as IMessageSentPopulated).to.username;
      await EmailUtilities.sendEmail(
        toEmail,
        `[NEW MESSAGE]: You have received a new message from ${name} ${surname}`,
        htmlEmail
      );

      res.status(201).send(result);
    }
  }
}

export const messagesController = new MessagesController();
