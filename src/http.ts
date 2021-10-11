import http from 'http';
import path from 'path';
import express from 'express';
import { Server } from 'socket.io';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

const httpServer = http.createServer(app);

const io = new Server(httpServer);

export {
    httpServer,
    io,
}
