"use client";

import { GameState, PlayerSymbol, User } from "@/types/types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface MatchData {
  opponent: User;
  symbol: PlayerSymbol;
}

interface MoveData {
  position: number;
  symbol: PlayerSymbol;
}

interface PlayPageProps {
  loggedInUser: User;
}

function getSymbolCharacter(symbol: PlayerSymbol) {
  switch (symbol) {
    case PlayerSymbol.X:
      return "⨉";
    case PlayerSymbol.O:
      return "〇";
    default:
      throw new Error("Invalid player symbol");
  }
}

export default function PlayPage({ loggedInUser }: Readonly<PlayPageProps>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<(PlayerSymbol | null)[]>(
    Array(9).fill(null),
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [status, setStatus] = useState("Searching for opponent...");

  useEffect(() => {
    if (opponent === null || playerSymbol === null) {
      return;
    }
    const opponentSymbol =
      playerSymbol === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X;

    setStatus(
      isPlayerTurn
        ? `Your (${getSymbolCharacter(playerSymbol)}) turn`
        : `${opponent.name}'s (${getSymbolCharacter(opponentSymbol)}) turn`,
    );
  }, [isPlayerTurn, opponent]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    setSocket(socket);

    socket.on("match", ({ opponent, symbol }: MatchData) => {
      console.log(opponent);
      setOpponent(opponent);
      setPlayerSymbol(symbol);
      setIsPlayerTurn(symbol === PlayerSymbol.X);
    });

    socket.on("opponent-move", (data: MoveData) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[data.position] = data.symbol;
        return newBoard;
      });
      setIsPlayerTurn(true);
    });

    socket.on("opponent-disconnected", () => {
      setStatus("Opponent disconnected. Waiting for a new match...");
      setBoard(Array(9).fill(null));
      setIsPlayerTurn(false);
      setPlayerSymbol(null);
      setOpponent(null);
      socket.emit("join-queue", { userId: loggedInUser.id });
    });

    socket.on("game-end", (data) => {
      console.log(opponent);

      const opponentSymbol =
        playerSymbol === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X;
      const opponentWonMessage = `${opponent.name} (${getSymbolCharacter(opponentSymbol)}) won!`;
      const playerWonMessage = `You (${getSymbolCharacter(playerSymbol!)} won!`;

      switch (data.state) {
        case GameState.Draw:
          setStatus("It's a draw!");
          break;
        case GameState.XWins:
          setStatus(
            playerSymbol === PlayerSymbol.X
              ? playerWonMessage
              : opponentWonMessage,
          );
          break;
        case GameState.OWins:
          setStatus(
            playerSymbol === PlayerSymbol.O
              ? playerWonMessage
              : opponentWonMessage,
          );
          break;
        case GameState.Cancelled:
          setStatus("Opponent disconnected. Waiting for a new match...");
          break;
        default:
          throw new Error("Invalid game state");
      }
    });
    setIsPlayerTurn(false);
    setPlayerSymbol(null);
    setOpponent(null);

    socket.emit("join-queue", { userId: loggedInUser.id });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCellClick = (index: number) => {
    if (
      !isPlayerTurn ||
      board[index] !== null ||
      playerSymbol === null ||
      opponent === null
    ) {
      return;
    }
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[index] = playerSymbol;
      return newBoard;
    });
    setIsPlayerTurn(false);

    socket.emit("make-move", { position: index, symbol: playerSymbol });
  };

  return (
    <main className="flex flex-col items-center gap-10">
      <h1 className="font-bold text-3xl text-center max-w-xl">{status}</h1>
      <div className="relative grid grid-cols-3 grid-rows-3 h-96 w-96">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            className="w-full h-full flex items-center justify-center text-7xl"
            onClick={() => handleCellClick(index)}
          >
            {board[index] !== null ? getSymbolCharacter(board[index]!) : ""}
          </button>
        ))}

        {/* Rounded lines */}
        <div className="absolute inset-0 flex flex-col justify-evenly -z-10">
          <div className="w-full h-[6px] bg-black rounded-full"></div>
          <div className="w-full h-[6px] bg-black rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex justify-evenly -z-10">
          <div className="w-[6px] h-full bg-black rounded-full"></div>
          <div className="w-[6px] h-full bg-black rounded-full"></div>
        </div>
      </div>
      {opponent && (
        <p className="text-center text-lg font-medium">
          Opponent: {opponent.name}
        </p>
      )}
    </main>
  );
}
