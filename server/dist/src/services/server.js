"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const socket_1 = require("./socket");
exports.server = http_1.default.createServer(app_1.app);
(0, socket_1.socketConnection)(exports.server);
