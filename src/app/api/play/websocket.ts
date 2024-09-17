import { WebSocketNamespace } from "@/types/websockets";
import { Server, Socket } from "socket.io";
import { GameState, PlayerSymbol, WebsocketErrorCode } from "@/types/types";
import db from "@/lib/db";
import { User } from "@/types/user";

interface Player {
  socket: Socket;
  user: User;
}

export default class PlayWebSocketNamespace implements WebSocketNamespace {
  private readonly queue: Record<string, Player[]> = {};

  public setupNamespace(io: Server): void {
    io.of("/play").on("connection", (socket) => {
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

        const userInQueue = this.queue[roomId]?.find(
          (player) => player.user.id === userId,
        );
        if (userInQueue) {
          socket.emit("error", {
            message: "User already in queue",
            code: WebsocketErrorCode.AlreadyInQueue,
          });
          return;
        }

        if (!this.queue[roomId]) {
          this.queue[roomId] = [];
        }

        this.queue[roomId].push({ socket, user });
        console.log(`Player joined queue in room ${roomId}:`, user.name);

        if (this.queue[roomId].length >= 2) {
          await this.matchPlayers(roomId);
        }
      });

      socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
        for (const roomId in this.queue) {
          const index = this.queue[roomId].findIndex(
            (player) => player.socket.id === socket.id,
          );
          if (index !== -1) {
            this.queue[roomId].splice(index, 1);
          }
        }
      });
    });
  }

  private async matchPlayers(roomId: string) {
    const player1 = this.queue[roomId].shift();
    const player2 = this.queue[roomId].shift();

    if (!player1) {
      if (player2) {
        this.queue[roomId].unshift(player2);
      }
      return;
    }

    if (!player2) {
      if (player1) {
        this.queue[roomId].unshift(player1);
      }
      return;
    }

    console.log(
      `Matched players in room ${roomId}: ${player1.user.name} and ${player2.user.name}`,
    );

    const game = await db.game.create({
      data: {
        playerXId: player1.user.id,
        playerOId: player2.user.id,
        state: GameState.Ongoing,
      },
    });

    if (!("id" in game)) {
      throw new Error("Game not created");
    }

    this.createEvents(player1, player2, game.id, PlayerSymbol.X);
    this.createEvents(player2, player1, game.id, PlayerSymbol.O);
  }

  private createEvents(
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

      const board = await this.getBoardPositions(gameId);
      const gameState = this.checkGameState(board, data.symbol);

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

      this.removeEvents(player.socket);
      this.removeEvents(opponent.socket);
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

  private removeEvents(socket: Socket) {
    socket.removeAllListeners("make-move");
    socket.removeAllListeners("disconnect");
  }

  private async getBoardPositions(gameId: string) {
    const moves = await db.move.findMany({
      where: { gameId },
    });

    const board: (PlayerSymbol | null)[] = Array(9).fill(null);
    moves.forEach((move) => {
      board[move.position] = move.symbol;
    });

    return board;
  }

  private checkGameState(board: (PlayerSymbol | null)[], symbol: PlayerSymbol) {
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
}
