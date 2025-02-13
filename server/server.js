const PORT = 4444;

import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import pino from "pino";
import pretty from "pino-pretty";

import { getNetworkIP } from "./utils.js";

const ORIGIN = "server";
const CLIENT_NAME = "Server";

const EVENTS = {
  LOCALIZATION_UPDATE: `${ORIGIN}:localization-update`,
  ACKNOWLEDGMENT: `${ORIGIN}:acknowledgment`,
};

// Use pino pretty logger for more readable logs (otherwise it's only JSON)
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

      // Broadcast to everyone except the sender
      socket.broadcast.emit(event, ...args);

      // reply to the sender
      // socket.emit('REPLY_MESSAGE', `Reply to your message: ${message}`);

      // Broadcast the event to all connected clients
      // app.io.emit(event, ...args);
    });

    socket.on("tablet:localization-update", (data) => {
      // Send acknowledgment back
      const acknowledgmentData = {
        eventName: EVENTS.ACKNOWLEDGMENT,
        origin: ORIGIN,
        clientName: CLIENT_NAME,
        originalTimestamp: data.timestamp,
      };
      socket.emit(EVENTS.ACKNOWLEDGMENT, acknowledgmentData);
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
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log("Server listening on http://localhost:" + PORT);
  console.log(`Server listening on http://${networkIp}:${PORT}`);
} catch (err) {
  app.log.error(err);
  console.error(err);
  process.exit(1);
}
