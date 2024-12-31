const SOCKET_SERVER_PORT = 4444;
const CLIENT_LIST_TIMEOUT = 2000;

import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
export const connected = writable(false);

export const x = writable(null);
export const y = writable(null);
export const angle = writable(null);
export const radius = writable(null);

export const clientList = writable([]);
const clientsObject = {};

let socket;
// createSocket();

const ORIGIN = 'tablet';
const EVENTS = {
	LOCALIZATION_UPDATE: `${ORIGIN}:localization-update`,
	ACKNOWLEDGMENT: `${ORIGIN}:acknowledgment`
};

export function createSocket() {
	socket = io("http://192.168.178.45:4444", {
		reconnection: true,
		transports: ['websocket'],
		query: { clientType: ORIGIN },
		reconnectionDelay: 100,
		reconnectionDelayMax: 300,
		timeout: 1000,
	});

	connected.set(false);

	// receive acknowledgment event
	// socket.on('acknowledgment', (data) => {
	//     console.log('acknowledgment', data);
	// });

	socket.on('connect', () => {
		connected.set(true);
	});

	socket.on('disconnect', () => {
		connected.set(false);
	});

	socket.on('listener:acknowledgment', (data) => {
		handleAcknoledgment(data);
	});

	socket.on('server:acknowledgment', (data) => {
		handleAcknoledgment(data);
	});
}

function handleAcknoledgment(data) {
	const clientName = data.clientName;
	// Divide by 2 to get an estimate of the latency in one direction
	const latency = (performance.now() - data.originalTimestamp) / 2;
	console.log(clientName + ': Latency: ' + latency + 'ms');

	clientsObject[clientName] = {
		latency: latency,
		lastUpdate: performance.now()
	};

	updateClientList();
}

// Check every 100ms for non updated clients
function removeOldClientsFromList() {
	for (const clientName in clientsObject) {
		if (performance.now() - clientsObject[clientName].lastUpdate > CLIENT_LIST_TIMEOUT) {
			delete clientsObject[clientName];
		}
	}
	updateClientList();
}
setInterval(removeOldClientsFromList, 100);

function updateClientList() {
	const list = [];
	for (const [key, value] of Object.entries(clientsObject)) {
		list.push({ name: key, latency: value.latency });
	}
	list.sort((a, b) => a.name.localeCompare(b.name));

	// If list contains object with name "Server" move it to the start of the list
	const serverIndex = list.findIndex((element) => element.name === 'Server');
	if (serverIndex !== -1) {
		// Remove it from the list
		const server = list.splice(serverIndex, 1);
		// Add it to the start of the list
		list.unshift(server[0]);
	}

	clientList.set(list);
}

// takes x and y as normalized input between -1 and 1
export function sendLocalization(x, y) {
	// Cartesian to Polar conversion
	const radius = Math.sqrt(x * x + y * y);
	const angleRaw = (Math.atan2(y, x) + Math.PI / 2) * (180 / Math.PI);
	const angle = wrapToRange(angleRaw, 0, 360);

	const data = {
		eventName: EVENTS.LOCALIZATION_UPDATE,
		origin: ORIGIN,
		timestamp: performance.now(),
		localization: {
			x,
			y: -y, // hacky y axis flip
			angle,
			radius
		}
	};
	socket.emit(EVENTS.LOCALIZATION_UPDATE, data);
	updateLocalizationStores(data);
}

function updateLocalizationStores(data) {
	x.set(data.localization.x);
	y.set(data.localization.y);
	angle.set(data.localization.angle);
	radius.set(data.localization.radius);
}

function wrapToRange(x, min, max) {
	const d = max - min;
	return ((((x - min) % d) + d) % d) + min;
}

function getSocketAdress() {
	try {
		// Parse the URL
		const url = new URL(window.location.href);

		// Construct the base URL
		const baseUrl = `${url.protocol}//${url.hostname}`;

		// Return socket url
		return `${baseUrl}:${SOCKET_SERVER_PORT}`;
	} catch (error) {
		console.error('Socket URL retrieval error:', error);
		return null;
	}
}
