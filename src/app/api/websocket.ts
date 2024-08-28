import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import db from "@/lib/db";
// @ts-ignore
import {
  GameState,
  PlayerSymbol,
  User,
  WebsocketErrorCode,
} from "@/types/types";

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

const queue: Record<string, Player[]> = {};

io.on("connection", (socket: Socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-queue", async ({ userId, roomId }) => {
    const user = (await db.user.findUnique({
      where: {
        id: userId,
      },
    })) as User | null;

    if (!user) {
      socket.emit("error", {
        message: "Invalid User",
        code: WebsocketErrorCode.InvalidUser,
      });
      socket.disconnect();
      return;
    }
    // Check if user is already in the queue
    const userInQueue = queue[roomId]?.find(
      (player) => player.user.id === userId,
    );
    if (userInQueue) {
      socket.emit("error", {
        message: "User already in queue",
        code: WebsocketErrorCode.AlreadyInQueue,
      });
      return;
    }

    if (!queue[roomId]) {
      queue[roomId] = [];
    }

    queue[roomId].push({ socket, user });
    console.log(`Player joined queue in room ${roomId}:`, user.name);

    if (queue[roomId].length >= 2) {
      await matchPlayers(roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    for (const roomId in queue) {
      const index = queue[roomId].findIndex(
        (player) => player.socket.id === socket.id,
      );
      if (index !== -1) {
        queue[roomId].splice(index, 1);
      }
    }
  });
});

async function matchPlayers(roomId: string) {
  const player1 = queue[roomId].shift();
  const player2 = queue[roomId].shift();

  if (!player1 || !player2) {
    if (player1) {
      queue[roomId].unshift(player1);
    }
    if (player2) {
      queue[roomId].unshift(player2);
    }
    return;
  }

  console.log(
    `Matched players in room ${roomId}: ${player1.user.name}, ${player2.user.name}`,
  );

  const game = await db.game.create({
    data: {
      playerXId: player1.user.id,
      playerOId: player2.user.id,
      state: GameState.Ongoing,
    },
  });

  createEvents(player1, player2, game.id, PlayerSymbol.X);
  createEvents(player2, player1, game.id, PlayerSymbol.O);
}

function createEvents(
  player: Player,
  opponent: Player,
  gameId: string,
  symbol: PlayerSymbol,
) {
  player.socket.on("make-move", async (data) => {
    await db.move.create({
      data: {
        gameId,
        playerId: player.user.id,
        position: data.position,
        symbol: data.symbol,
      },
    });
    opponent.socket.emit("opponent-move", data);

    const board = await getBoardPositions(gameId);
    const gameState = checkGameState(board, data.symbol);

    if (gameState === GameState.Ongoing) {
      return;
    }

    let winnerId = null;

    const playerWon =
      (symbol === PlayerSymbol.X && gameState === GameState.XWins) ||
      (symbol === PlayerSymbol.O && gameState === GameState.OWins);
    const opponentWon =
      (symbol === PlayerSymbol.O && gameState === GameState.XWins) ||
      (symbol === PlayerSymbol.X && gameState === GameState.OWins);

    if (playerWon) {
      winnerId = player.user.id;
    } else if (opponentWon) {
      winnerId = opponent.user.id;
    }

    await db.game.update({
      where: { id: gameId },
      data: {
        state: gameState,
        winnerId,
      },
    });

    player.socket.emit("game-end", { state: gameState });
    opponent.socket.emit("game-end", { state: gameState });

    removeEvents(player.socket);
    removeEvents(opponent.socket);
  });

  opponent.socket.on("disconnect", async () => {
    console.log("Opponent disconnected:", opponent.user.name);
    await db.game.update({
      where: { id: gameId },
      data: {
        state: GameState.Cancelled,
      },
    });
    player.socket.emit("opponent-disconnect");
  });

  player.socket.emit("match", {
    opponent: opponent.user,
    symbol,
  });
}

function removeEvents(socket: Socket) {
  socket.removeAllListeners("make-move");
  socket.removeAllListeners("disconnect");
}

async function getBoardPositions(gameId: string) {
  const moves = await db.move.findMany({
    where: { gameId },
  });

  const board: (PlayerSymbol | null)[] = Array(9).fill(null);
  moves.forEach((move) => {
    board[move.position] = move.symbol;
  });

  return board;
}

function checkGameState(board: (PlayerSymbol | null)[], symbol: PlayerSymbol) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    if (pattern.every((index) => board[index] === symbol)) {
      return symbol === PlayerSymbol.X ? GameState.XWins : GameState.OWins;
    }
  }

  if (board.every((cell) => cell !== null)) {
    return GameState.Draw;
  }

  return GameState.Ongoing;
}

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
