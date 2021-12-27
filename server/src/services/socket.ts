import { Server } from 'http';
import * as socket from 'socket.io';

export const socketConnection = (server: Server) => {
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
