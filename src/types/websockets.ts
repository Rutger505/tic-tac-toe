import { Server } from "socket.io";

export interface WebSocketNamespace {
  setupNamespace(io: Server): void;
}
