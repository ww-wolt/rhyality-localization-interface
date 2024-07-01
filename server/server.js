const PORT = 4444;

import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import pino from "pino";
import pretty from "pino-pretty";

import cors from "@fastify/cors";
import {readFileSync} from "fs";
import path from "path";

import { getNetworkIP } from "./utils.js";
// import logger from './logger.js';

const app = Fastify({
  logger: pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
  https: {
    key: readFileSync( "localhost+2-key.pem"),
    cert: readFileSync("localhost+2.pem")
  }
});

app.register(fastifySocketIO, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
});

app.get("/", async () => {
  return "Socket Server working!";
});

app.get("/ping", async () => {
  return "pong";
});

// // Declare a route
// app.get('/', async function handler (request, reply) {
//   return { hello: 'world' }
// })

app.ready((err) => {
  if (err) throw err;

  app.io.on("connect", (socket) =>
    console.info("Socket connected!", socket.id)
  );

  app.io.on("connection", (socket) => {
    console.log("a user connected");

    // Listen for any event from the client
    socket.onAny((event, ...args) => {
      console.log(`Event received: ${event}`, args);

      // Broadcast the event to all connected clients
      // app.io.emit(event, ...args);
    });

    socket.on("hello", () => {
      console.info("received hello!");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
});

// Run the server!
try {
  const networkIp = getNetworkIP();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log("Server listening on https://localhost:" + PORT);
  console.log(`Server listening on https://${networkIp}:${PORT}`);
} catch (err) {
  app.log.error(err);
  console.error(err);
  process.exit(1);
}
