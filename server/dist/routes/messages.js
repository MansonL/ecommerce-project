"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const messages_1 = require("../controller/messages");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.get('/list', messages_1.messagesController.get);
exports.messagesRouter.post('/save', messages_1.messagesController.save);
