"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function PlayPage() {
  useEffect(() => {
    // Initialize the WebSocket connection
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    // Emit join-queue event
    socket.emit("join-queue");

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  return "Test";
}
