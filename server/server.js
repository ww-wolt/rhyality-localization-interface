const PORT = 4444;

import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import pino from "pino";
import pretty from "pino-pretty";

import cors from "@fastify/cors";

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
});

app.register(fastifySocketIO, {
  cors: {
    origin: true,
    credentials: true,
  },
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
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  
});

// Run the server!
try {
  const networkIp = getNetworkIP();
  await app.listen({ port: PORT });
  console.log("Server listening on http://localhost:" + PORT);
  console.log(`Server listening on http://${networkIp}:${PORT}`);
} catch (err) {
  app.log.error(err);
  console.error(err);
  process.exit(1);
}
