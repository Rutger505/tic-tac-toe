import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const cors = process.env.NEXT_PUBLIC_BASE_URL;

const io = new Server(server, {
  cors: {
    origin: cors,
  },
});

interface Player {
  id: string;
  socket: Socket;
}

const queue: Player[] = [];

io.on("connection", (socket: Socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-queue", () => {
    console.log("Player joined queue:", socket.id);
    queue.push({ id: socket.id, socket });

    // Try to match players if there are at least two in the queue
    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();

      if (player1 && player2) {
        // Check if both players are still connected
        if (
          io.sockets.sockets.get(player1.id) &&
          io.sockets.sockets.get(player2.id)
        ) {
          console.log("Matched players:", player1.id, player2.id);
          player1.socket.emit("match", { opponentId: player2.id, symbol: "X" });
          player2.socket.emit("match", { opponentId: player1.id, symbol: "O" });

          startGame(player1.socket, player2.socket);
        } else {
          // Push back the connected player to the queue
          if (io.sockets.sockets.get(player1.id)) {
            queue.unshift(player1);
          }
          if (io.sockets.sockets.get(player2.id)) {
            queue.unshift(player2);
          }
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    // Remove the player from the queue if they disconnect
    const index = queue.findIndex((player) => player.id === socket.id);
    if (index !== -1) {
      queue.splice(index, 1);
    }
  });
});

function startGame(socket1: Socket, socket2: Socket) {
  socket1.on("make-move", (data) => {
    socket2.emit("opponent-move", data);
  });

  socket2.on("make-move", (data) => {
    socket1.emit("opponent-move", data);
  });

  // Handle disconnection during the game
  const handleDisconnect = (
    disconnectedSocket: Socket,
    remainingSocket: Socket,
  ) => {
    disconnectedSocket.on("disconnect", () => {
      remainingSocket.emit("opponent-disconnected");
    });
  };

  handleDisconnect(socket1, socket2);
  handleDisconnect(socket2, socket1);
}

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`✔️ Server listening on port ${port}`);
});
