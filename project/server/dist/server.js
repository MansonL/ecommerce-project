"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const http_1 = __importDefault(require("http"));
const _1 = require(".");
const app_1 = require("./services/app");
const socket_1 = require("./services/socket");
exports.server = http_1.default.createServer(app_1.app);
exports.server.listen(_1.PORT, () => {
    console.log(`Server hosted at PORT: ${_1.PORT}`);
    (0, socket_1.socketConnection)(exports.server);
});
