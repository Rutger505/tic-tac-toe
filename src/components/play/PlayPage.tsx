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
  const [status, setStatus] = useState("Searching for opponent...");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [opponentSymbol, setOpponentSymbol] = useState<PlayerSymbol | null>(
    null,
  );

  useEffect(() => {
    if (playerSymbol === null || opponent === null || opponentSymbol === null) {
      return;
    }

    setStatus(
      isPlayerTurn
        ? `Your (${getSymbolCharacter(playerSymbol)}) turn`
        : `${opponent.name}'s (${getSymbolCharacter(opponentSymbol)}) turn`,
    );
  }, [isPlayerTurn, opponent, opponentSymbol, playerSymbol]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    setSocket(socket);

    socket.on("match", handleMatch);

    socket.on("opponent-move", handleOpponentMove);

    socket.on("opponent-disconnect", handleOpponentDisconnect);

    socket.on("game-end", handleGameEnd);

    socket.emit("join-queue", { userId: loggedInUser.id });

    return () => {
      socket.disconnect();
    };
  }, []);

  function handleMatch(data: MatchData) {
    setPlayerSymbol(data.symbol);
    setIsPlayerTurn(playerSymbol === PlayerSymbol.X);
    setOpponent(data.opponent);
    setOpponentSymbol(
      playerSymbol === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X,
    );
  }

  function handleOpponentMove({ position, symbol }: MoveData) {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[position] = symbol;
      return newBoard;
    });
    setIsPlayerTurn(true);
  }

  function handleOpponentDisconnect() {
    console.log("Opponent disconnected");

    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    setStatus("Opponent disconnected. Waiting for a new match...");
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(false);
    setPlayerSymbol(null);
    // setOpponent(null);
    socket.emit("join-queue", { userId: loggedInUser.id });
  }

  function getOpponentOpponentSymbolPlayerSymbol() {
    if (!opponent || !opponentSymbol || !playerSymbol) {
      throw new Error("Opponent, opponentSymbol, or playerSymbol is null");
    }
    return { opponent, opponentSymbol, playerSymbol };
  }

  function handleGameEnd({ state }: { state: GameState }) {
    const { opponent, opponentSymbol, playerSymbol } =
      getOpponentOpponentSymbolPlayerSymbol();

    console.log("Game end", { opponent, opponentSymbol, playerSymbol, state });

    const opponentWonMessage = `${opponent.name} (${getSymbolCharacter(opponentSymbol)}) won!`;
    const playerWonMessage = `You (${getSymbolCharacter(playerSymbol!)} won!`;

    switch (state) {
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
  }

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
