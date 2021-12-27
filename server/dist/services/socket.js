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
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketConnection = void 0;
const socket = __importStar(require("socket.io"));
const socketConnection = (server) => {
    const io = new socket.Server(server);
    io.on('connection', (socket) => {
        console.log('New client connected!');
        socket.on('products', () => {
            console.log('Updating DB Products...');
            io.sockets.emit('productsUpdate');
        });
        socket.on('randomProducts', () => {
            console.log('Updating random products...');
            io.sockets.emit('randomProductsUpdate');
        });
        socket.on('cart', () => {
            console.log('Updating cart products...');
            io.sockets.emit('cartUpdate');
        });
        socket.on('messages', () => {
            console.log('Updating chat messages...');
            io.sockets.emit('messagesUpdate');
        });
        socket.on('users', () => {
            console.log('Updating chat users...');
            io.sockets.emit('usersUpdate');
        });
    });
};
exports.socketConnection = socketConnection;
