"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.socketConnection = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const socket = __importStar(require("socket.io"));
const utils_1 = require("../common/utils");
const config_1 = require("../config/config");
const logger_1 = require("./logger");
const socketConnection = (server) => {
    const io = new socket.Server(server);
    io.attach(server);
    io.on('connection', (socket) => {
        logger_1.logger.info('New client connected!');
        socket.on('messages', () => {
            logger_1.logger.info('Updating chat messages...');
            socket.emit('messagesUpdate');
        });
        socket.on('BOTMessage', (message, token) => __awaiter(void 0, void 0, void 0, function* () {
            const isLoggedIn = (0, jsonwebtoken_1.verify)(token, config_1.Config.JWT_SECRET);
            if (typeof isLoggedIn === 'string')
                socket.emit(`Your token expired, you need to log in again...`);
            else {
                const user = isLoggedIn.user;
                const response = yield utils_1.Utils.botAnswer(message, user.user_id, user.username);
                socket.emit('BOTAnswer', response);
            }
        }));
    });
};
exports.socketConnection = socketConnection;
