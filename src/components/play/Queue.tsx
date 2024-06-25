"use client";

import { io } from "socket.io-client";

export function Queue() {
  const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);
  socket.emit("join-queue");

  return null;
}
