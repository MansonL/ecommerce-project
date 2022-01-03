import http from 'http';
import { PORT } from '..';
import { app } from './app';
import { socketConnection } from './socket';



export const server: http.Server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server hosted at PORT: ${PORT}`);
    socketConnection(server);
});