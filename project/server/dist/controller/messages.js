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
const compression_1 = require("../common/compression");
const checkType_1 = require("../interfaces/checkType");
const errorApi_1 = require("../utils/errorApi");
/**
 *
 * Messages Controller Class
 *
 */
class MessagesController {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield messages_1.messagesApi.getMsg();
            console.log(`[PATH] Inside controller.`);
            if ((0, checkType_1.isMessages)(result)) {
                /**
                 * Result was previously checked to have properties according to Messages interface
                 */
                const normalizedData = (0, compression_1.normalizeData)(result);
                res.status(200).send(normalizedData);
            }
            else if (result instanceof errorApi_1.ApiError) {
                res.status(result.error).send(result);
            }
            else {
                res.status(500).send(result); // Internal Error sent.
            }
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = req.body;
            console.log(`[PATH] Inside controller.`);
            const result = yield messages_1.messagesApi.addMsg(message);
            if ((0, checkType_1.isCUDResponse)(result)) {
                res.status(201).send(result);
            }
            else {
                res.status(500).send(result); // Internal Error sent.
            }
        });
    }
}
exports.messagesController = new MessagesController();
