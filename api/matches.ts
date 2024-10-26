import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let matches = [];

io.on('connection', (socket) => {
  // Send current matches to newly connected client
  socket.emit('initialMatches', { matches });

  // Handle match updates
  socket.on('updateMatches', (data) => {
    matches = data.matches;
    // Broadcast to all clients except sender
    socket.broadcast.emit('matchesUpdated', { matches });
  });
});

httpServer.listen(3001);