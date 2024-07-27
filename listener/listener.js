
const SOCKET_SERVER_ADDRESS = "http://localhost:4444"
import * as oscBridge from "./oscBridge.js";

import { io } from 'socket.io-client';

const ORIGIN = 'listener';
const CLIENT_NAME = 'Jonas Computer';

let socket;
createSocket();


const EVENTS = {
    LOCALIZATION_UPDATE: `${ORIGIN}:localization-update`,
    ACKNOWLEDGMENT: `${ORIGIN}:acknowledgment`,
};

export function createSocket() {
    socket = io(SOCKET_SERVER_ADDRESS, {
        reconnection: true,
        transports: ['websocket'],
        query: { clientType: ORIGIN },
        reconnectionDelay: 100,
    });

    socket.on('tablet:localization-update', (data) => {
        console.log('tablet:localization-update', data);
        oscBridge.sendFloat("x", data[0].localization.x);
        oscBridge.sendFloat("y", data[0].localization.y);
        oscBridge.sendFloat("angle", data[0].localization.angle);
        oscBridge.sendFloat("radius", data[0].localization.radius);


        // Send acknowledgment back
        const acknowledgmentData = {
            eventName: EVENTS.ACKNOWLEDGMENT,
            origin: ORIGIN,
            clientName: CLIENT_NAME,
            originalTimestamp: data[0].timestamp,
        };
        socket.emit(EVENTS.ACKNOWLEDGMENT, acknowledgmentData);
    });
}