import http from 'http';
import { app } from './app';
import { socketConnection } from './socket';



export const server: http.Server = http.createServer(app);
socketConnection(server);