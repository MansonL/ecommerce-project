"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const messages_1 = require("../controller/messages");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.get('/list', auth_1.authController.isAdmin, messages_1.messagesController.getAllMessages);
exports.messagesRouter.get('/list/:id', auth_1.authController.isAuthorized, messages_1.messagesController.getUserMessages);
exports.messagesRouter.post('/save', auth_1.authController.isAuthorized, messages_1.messagesController.save);
