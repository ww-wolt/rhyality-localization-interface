
const PORT = 4444;

import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket';
import cors from '@fastify/cors'

import { getNetworkIP } from './utils.js';


const fastify = Fastify({
  // logger: true
})

fastify.register(fastifyWebsocket);
await fastify.register(cors, { 
  origin: true,
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

// Define a WebSocket route
fastify.get('/ws', { websocket: true }, (connection, req) => {
  console.log('Client connected');

  // Handle incoming messages
  connection.socket.on('message', message => {
    console.log('Received message:', message.toString());

    // Echo the message back to the client
    connection.socket.send(`Echo: ${message}`);
  });

  // Handle connection close
  connection.socket.on('close', () => {
    console.log('Client disconnected');
  });
});

// Run the server!
try {
  const networkIp = getNetworkIP();
  await fastify.listen({ port: PORT })
  console.log('Server listening on http://localhost:' + PORT);
  console.log(`Server listening on http://${networkIp}:${PORT}`);

} catch (err) {
  fastify.log.error(err)
  console.error(err)
  process.exit(1)
}


