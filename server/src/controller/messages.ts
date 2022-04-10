import { Request, NextFunction, Response } from "express";
import { messagesApi } from "../api/messages";
import { ApiError } from "../api/errorApi";
import { ObjectId } from "mongodb";
import {
  IMessageSentPopulated,
  IMongoPopulatedMessages,
  INew_Message,
} from "../interfaces/messages";
import { CUDResponse } from "../interfaces/others";
import { EmailUtilities, htmlFooter, htmlGeneral } from "../utils/emails";
import { logger } from "../services/logger";
import { EUsersErrors } from "../interfaces/EErrors";

/**
 *
 * Messages Controller Class
 *
 */

class MessagesController {
  async getUserMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user_id = req.user?._id.toString() as string; // There always gonna be an user defined in request object because of the only way to access this method is passing the authorized auth controller.
    const { user } = req.query as {
      user: string | undefined;
    };
    if (ObjectId.isValid(user_id)) {
      if (user) {
        if (ObjectId.isValid(user)) {
          const result: IMongoPopulatedMessages[] | ApiError =
            (await messagesApi.getMsg(user_id, user)) as
              | IMongoPopulatedMessages[]
              | ApiError;
          // This line is just cause inside the model we already know that if there's an user specified in the query, the answer is gonna be the array or an ApiError.
          if (result instanceof ApiError) res.send(result);
          else res.status(200).send(result);
        } else res.send(ApiError.badRequest(EUsersErrors.UserNotFound));
      } else {
        const result: Map<string, IMongoPopulatedMessages[]> | ApiError =
          (await messagesApi.getMsg(user_id, undefined)) as
            | Map<string, IMongoPopulatedMessages[]>
            | ApiError;
        // This line is just cause inside the model we already know that if there's no user specified in the query, the answer is gonna be the map or an ApiError.
        console.log(JSON.stringify(result, null, "\t"));
        if (result instanceof ApiError) next(result);
        else res.status(200).send(result);
      }
    } else res.send(ApiError.badRequest(EUsersErrors.UserNotFound));
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
