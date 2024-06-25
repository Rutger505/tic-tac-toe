import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import db from "@/lib/db";
import { User } from "lucide-react";

const app = express();
const server = http.createServer(app);

const cors = process.env.NEXT_PUBLIC_BASE_URL;

console.log("CORS:", cors);

const io = new Server(server, {
  cors: {
    origin: cors,
  },
});

interface Player {
  socket: Socket;
  user: User;
}

const queue: Player[] = [];

io.on("connection", (socket: Socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-queue", async ({ userId }) => {
    const user = (await db.user.findUnique({
      where: {
        id: userId,
      },
    })) as User | null;

    if (!user) {
      socket.disconnect();
      return;
    }

    queue.push({ socket, user });
    console.log("Player joined queue:", user.name);

    // Try to match players if there are at least two in the queue
    if (queue.length >= 2) {
      matchPlayers();
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    const index = queue.findIndex((player) => player.socket.id === socket.id);
    if (index !== -1) {
      queue.splice(index, 1);
    }
  });
});

function matchPlayers() {
  const player1 = queue.shift();
  const player2 = queue.shift();

  if (!player1 || !player2) {
    if (player1) {
      queue.unshift(player1);
    }
    if (player2) {
      queue.unshift(player2);
    }
    return;
  }

  console.log(`Matched players: ${player1.user.name}, ${player2.user.name}`);
  player1.socket.emit("match", { opponent: player2.user, symbol: "X" });
  player2.socket.emit("match", { opponent: player1.user, symbol: "O" });

  startGame(player1.socket, player2.socket);
}

function startGame(socket1: Socket, socket2: Socket) {
  socket1.on("make-move", (data) => {
    socket2.emit("opponent-move", data);
  });
  socket2.on("make-move", (data) => {
    socket1.emit("opponent-move", data);
  });

  socket1.on("disconnect", () => {
    socket2.emit("opponent-disconnected");
  });
  socket2.on("disconnect", () => {
    socket1.emit("opponent-disconnected");
  });
}

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
