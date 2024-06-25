import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import db from "@/lib/db";

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

    if (queue.length >= 2) {
      await matchPlayers();
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

async function matchPlayers() {
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

  const game = await db.game.create({
    data: {
      playerXId: player1.user.id,
      playerOId: player2.user.id,
      result: "ongoing",
    },
  });

  player1.socket.emit("match", {
    opponent: player2.user,
    symbol: "X",
    gameId: game.id,
  });
  player2.socket.emit("match", {
    opponent: player1.user,
    symbol: "O",
    gameId: game.id,
  });

  startGame(player1.socket, player2.socket, game.id);

  player1.socket.on("make-move", async (data) => {
    await db.move.create({
      data: {
        gameId: game.id,
        playerId: player1.user.id,
        position: data.position,
        symbol: data.symbol,
      },
    });
    player2.socket.emit("opponent-move", data);
  });

  player2.socket.on("make-move", async (data) => {
    await db.move.create({
      data: {
        gameId: game.id,
        playerId: player2.user.id,
        position: data.position,
        symbol: data.symbol,
      },
    });
    player1.socket.emit("opponent-move", data);
  });

  player1.socket.on("disconnect", async () => {
    await db.game.update({
      where: { id: game.id },
      data: {
        winnerId: player2.user.id,
        result: "player O wins by disconnect",
      },
    });
    player2.socket.emit("opponent-disconnected");
  });

  player2.socket.on("disconnect", async () => {
    await db.game.update({
      where: { id: game.id },
      data: {
        winnerId: player1.user.id,
        result: "player X wins by disconnect",
      },
    });
    player1.socket.emit("opponent-disconnected");
  });
}

function startGame(socket1: Socket, socket2: Socket, gameId: string) {}

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
