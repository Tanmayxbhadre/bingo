import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocketHandlers } from './socket/socketHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for dev / Render deployment simplicity
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Bingo.io',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

setupSocketHandlers(io);

// In production, serve the built client if dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/health') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // If client not built yet, return informative dev status
      res.status(200).send('Bingo.io Server is running! Connect client at ' + CLIENT_URL);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎯 Bingo.io server listening on port ${PORT}`);
  console.log(`🌐 Health check at http://localhost:${PORT}/health`);
});

export { app, server, io };
