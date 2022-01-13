import { Server } from 'http';
import { verify } from 'jsonwebtoken';
import * as socket from 'socket.io';
import { Utils } from '../common/utils';
import { Config } from '../config/config';
import { logger } from './logger';

export const socketConnection = (server: Server) => {
    const io = new socket.Server(server);
    io.on('connection', (socket) => {
        logger.info('New client connected!');
        socket.on('messages', () => {
            logger.info('Updating chat messages...');
            socket.emit('messagesUpdate');
        });
        socket.on('BOTMessage', async (message: string, token: string) => {
            const isLoggedIn = verify(token, Config.JWT_SECRET);
            if(typeof isLoggedIn === 'string')
                socket.emit(`Your token expired, you need to log in again...`);
            else{
                const user = isLoggedIn.user;
                const response = await Utils.botAnswer(message, user.user_id, user.username);
                socket.emit('BOTAnswer', response)
            }
        })
    });
};
