"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type PlayerSymbol = "X" | "O" | null;

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

export default function PlayPage({ loggedInUser }: Readonly<PlayPageProps>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<PlayerSymbol[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [status, setStatus] = useState("Searching for opponent...");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    setSocket(socket);

    socket.on("match", (data: MatchData) => {
      setOpponent(data.opponent);
      setPlayerSymbol(data.symbol);
      setIsPlayerTurn(data.symbol === "X");
      setStatus(`You are ${data.symbol}`);
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

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
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
            className="w-full h-full flex items-center justify-center text-3xl"
            onClick={() => handleCellClick(index)}
          >
            {board[index]}
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
