"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function PlayPage() {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    socket.emit("join-queue");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className={"mx-auto"}>
      <div className={"space-y-10"}>
        <h1 className={"font-bold text-3xl text-center"}>
          Searchng for opponent
        </h1>
        <div className={`relative grid grid-cols-3 grid-rows-3 h-96 w-96`}>
          <button></button>
          <button></button>
          <button></button>
          <button></button>
          <button></button>
          <button></button>
          <button></button>
          <button></button>
          <button></button>

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

        <p className={"text-center text-lg font-medium"}>
          Opponent: Searching...
        </p>
      </div>
    </main>
  );
}
