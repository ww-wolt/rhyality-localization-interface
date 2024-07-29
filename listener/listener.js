
const SOCKET_SERVER_ADDRESS = "http://localhost:4444"


import { io } from 'socket.io-client';
import * as oscBridge from "./oscBridge.js";


const ORIGIN = 'listener';
const CLIENT_NAME = getComputerName();

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
		reconnectionDelayMax: 300,
		timeout: 1000,
	});

    socket.on('tablet:localization-update', (data) => {
        console.log('tablet:localization-update', data);
        oscBridge.sendFloat("x", data.localization.x);
        oscBridge.sendFloat("y", data.localization.y);
        oscBridge.sendFloat("angle", data.localization.angle);
        oscBridge.sendFloat("radius", data.localization.radius);


        // Send acknowledgment back
        const acknowledgmentData = {
            eventName: EVENTS.ACKNOWLEDGMENT,
            origin: ORIGIN,
            clientName: CLIENT_NAME,
            originalTimestamp: data.timestamp,
        };
        socket.emit(EVENTS.ACKNOWLEDGMENT, acknowledgmentData);
    });
}


// Util function

import { hostname } from 'os';
import { execSync } from 'child_process';

function getComputerName() {
  switch (process.platform) {
    case "win32":
      return process.env.COMPUTERNAME;
    case "darwin":
      return execSync("scutil --get ComputerName").toString().trim();
    case "linux":
      const prettyname = execSync("hostnamectl --pretty").toString().trim();
      return prettyname === "" ? hostname() : prettyname;
    default:
      return hostname();
  }
};
