// globals.d.ts
import { Server as SocketIOServer } from 'socket.io';

declare global {
  const io: SocketIOServer;
}

export {};
