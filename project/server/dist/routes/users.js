"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_1 = require("../controller/users");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get('/list', users_1.usersController.getAll);
exports.usersRouter.get('/list/?:id', users_1.usersController.getOne);
exports.usersRouter.post('/save', users_1.usersController.save);
