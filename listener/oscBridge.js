import osc from "osc";

const udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 2000,
  metadata: true,
});

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
  console.log("JS: An OSC message just arrived!", oscMsg);
});

// Open the socket.
udpPort.open();

// When the port is read, send an OSC message to someone
udpPort.on("ready", function () {
  // ...
});

export function sendFloat(eventName, value){
  udpPort.send(
    {
      address: "/" + eventName,
      args: [{ type: 'f', value: value }],
    },
    "127.0.0.1",
    1000
  );
}