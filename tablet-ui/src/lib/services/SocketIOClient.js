import { io } from 'socket.io-client';
import { writable } from "svelte/store";

export const connected = writable(false);

let socket;
// createSocket();

const ORIGIN = 'tablet';
const EVENTS = {
    LOCALIZATION_UPDATE: `${ORIGIN}:localization-update`,
};

const EVENT_TYPES = {
    EVENT: 'event',
    ACKNOWLEDGMENT: 'acknowledgment',
}

export function createSocket(socketServerAdress) {
    socket = io(socketServerAdress, {
        reconnection: true,
        transports: ['websocket'],
        query: { clientType: ORIGIN },
        reconnectionDelay: 100,
        rejectUnauthorized: false
    });

    connected.set(true);

    // receive acknowledgment event
    socket.on('acknowledgment', (data) => {
        console.log('acknowledgment', data);
    });
}

// takes x and y as normalized input between -1 and 1
export function sendLocalization(x, y) {

    // Cartesian to Polar conversion
    const radius = Math.sqrt(x * x + y * y);
    const angleRaw = (Math.atan2(y, x) + Math.PI/2) * (180/Math.PI);
    const angle = wrapToRange(angleRaw, 0, 360);

    const data = {
        eventName: EVENTS.LOCALIZATION_UPDATE,
        origin: ORIGIN,
        timestamp:  performance.now(),
        eventType: EVENT_TYPES.EVENT,
        localization: {
           x,
           y,
           angle,
           radius
        },
    };
    // console.log("send event", EVENTS.LOCALIZATION_UPDATE, data)
    socket.emit(EVENTS.LOCALIZATION_UPDATE, data);
}

function wrapToRange(x, min, max) {
    const d = max - min;
    return ((x - min) % d + d) % d + min;
}

    

// socket.emit('hello', { hi: 'yo' });