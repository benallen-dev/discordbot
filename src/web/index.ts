import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import open from 'open';

interface WebserverConfig {
  port: number;
  startChromium?: boolean;
}

export const startWebserver = (config: WebserverConfig ) => {
  const {
    port = 3000,
    startChromium
  } = config;

  const app = express();
  const httpServer = new http.Server(app);
  const io = new socketio(httpServer);

  app.use(express.static('./public'));

  httpServer.listen(port, async () => {
    console.log(`Listening on *:${port}`);
    if (startChromium) {
      await open('http://localhost:3000', { app: ['chromium-browser', '--start-fullscreen']});
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected!');
  });

  return io;
};