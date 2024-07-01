
const SOCKET_SERVER_ADDRESS = "http://localhost:4444"
import * as oscBridge from "./oscBridge.js";

import { io } from 'socket.io-client';

const ORIGIN = 'listener';

let socket;
createSocket();


// const EVENTS = {
//     LOCALIZATION_UPDATE: `${ORIGIN}:localization-update`,
// };

const EVENT_TYPES = {
    EVENT: 'event',
    ACKNOWLEDGMENT: 'acknowledgment',
}

export function createSocket() {
    socket = io(SOCKET_SERVER_ADDRESS, {
        reconnection: true,
        transports: ['websocket'],
        query: { clientType: ORIGIN },
        reconnectionDelay: 100,
    });

    // receive acknowledgment event
    socket.on('tablet:localization-update', (data) => {
        console.log('tablet:localization-update', data);
        oscBridge.sendFloat("x", data[0].localization.x);
        oscBridge.sendFloat("y", data[0].localization.y);
        oscBridge.sendFloat("angle", data[0].localization.angle);
        oscBridge.sendFloat("radius", data[0].localization.radius);
    });
}