"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesController = void 0;
const messages_1 = require("../api/messages");
const errorApi_1 = require("../api/errorApi");
const mongodb_1 = require("mongodb");
const utils_1 = require("../common/utils");
/**
 *
 * Messages Controller Class
 *
 */
class MessagesController {
    getAllMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield messages_1.messagesApi.getMsg(undefined);
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else
                res.status(200).send(result);
        });
    }
    getUserMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.params.id;
            if (mongodb_1.ObjectId.isValid(user_id)) {
                const result = yield messages_1.messagesApi.getMsg(user_id);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result);
            }
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = req.body;
            const { name, surname } = req.user;
            const result = yield messages_1.messagesApi.addMsg(message);
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else {
                const htmlEmail = utils_1.htmlGeneral.concat(`<h2>You have received a new message!</h2><h4>Here are the details:</h4>`.concat(`<p ="products-list" style="text-align: left; margin-left: 2.5rem;">${message.timestamp} | ${name} ${surname}: ${message.message}</p>`)).concat(utils_1.htmlFooter);
                const toEmail = result.data.to.data.username;
                yield utils_1.Utils.sendEmail(toEmail, `[NEW MESSAGE]: You have received a new message from ${name} ${surname}`, htmlEmail);
                res.status(201).send(result);
            }
        });
    }
}
exports.messagesController = new MessagesController();
