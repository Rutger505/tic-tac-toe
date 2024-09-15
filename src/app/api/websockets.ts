import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import PlayWebSocketNamespace from "@/app/api/play/websocket";

const cors = process.env.BASE_URL;
if (!cors) {
  console.error("BASE_URL environment variable is not set");
  process.exit(1);
}
console.log("CORS:", cors);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: cors,
  },
});

const namespaces = [new PlayWebSocketNamespace()];

namespaces.forEach((namespace) => {
  namespace.setupNamespace(io);
});

const port = process.env.WEBSOCKET_PORT
  ? parseInt(process.env.WEBSOCKET_PORT)
  : 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
