import { Server, createServer } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import initializeSocketIO from './socketIo';

let server: Server;
export const io = initializeSocketIO(createServer(app));
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(Number(config.port), 
    // config.ip as string, 
    () => {
      console.log(`app is listening on port ${config.ip} : ${config.port}`);
    });
    io.listen(Number(config.socket_port));
    console.log(
      `Socket is listening on port ${config.ip} : ${config.socket_port}`,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    global.socketio = io;
  } catch (err) {
    console.log(err);
  }
}
main();
process.on('unhandledRejection', err => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
