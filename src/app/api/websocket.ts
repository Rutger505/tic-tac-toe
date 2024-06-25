import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const cors = process.env.NEXT_PUBLIC_BASE_URL;

console.log("Cors", cors);

const io = new Server(server, {
  cors: {
    origin: cors,
  },
});

let queueSize = 0;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-queue", () => {
    console.log("user joined queue");
    queueSize++;
    console.log("queue size", queueSize);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    queueSize--;
    console.log("queue size", queueSize);
  });
});

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`✔️ Server listening on port ${port}`);
});
