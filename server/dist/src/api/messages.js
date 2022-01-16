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
exports.messagesApi = exports.MessagesApi = void 0;
const usersFactory_1 = require("../models/usersFactory");
const messagesFactory_1 = require("../models/messagesFactory");
class MessagesApi {
    constructor() {
        this.messages = messagesFactory_1.MessagesFactory.get(usersFactory_1.storage);
    }
    getMsg(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.messages.get(user_id);
            return result;
        });
    }
    addMsg(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.messages.add(message);
            return result;
        });
    }
}
exports.MessagesApi = MessagesApi;
exports.messagesApi = new MessagesApi();
