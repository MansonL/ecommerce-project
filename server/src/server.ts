import http from 'http';
import { PORT } from '.';
import { app } from './services/app';
import { socketConnection } from './services/socket';



export const server: http.Server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server hosted at PORT: ${PORT}`);
    socketConnection(server);
});