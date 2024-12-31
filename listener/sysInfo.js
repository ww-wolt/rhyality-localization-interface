import si from 'systeminformation';
import * as oscBridge from "./oscBridge.js";

// Helper function to convert bytes to megabytes
function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)); 
}

// Store previous network stats to calculate deltas
let previousStats = { rx_bytes: 0, tx_bytes: 0 };

// Measure network stats at regular intervals
setInterval(async () => {
  try {
    const networkStats = await si.networkStats();

    if (networkStats.length > 0) {
      const stats = networkStats[0]; // Use the first network interface

      // Calculate data received and transmitted since the last check
      const rxBytesDelta = stats.rx_bytes - previousStats.rx_bytes;
      const txBytesDelta = stats.tx_bytes - previousStats.tx_bytes;

      // Update the previous stats
      previousStats = { rx_bytes: stats.rx_bytes, tx_bytes: stats.tx_bytes };

      // Convert to MB/s
      const rxMBps = bytesToMB(rxBytesDelta);
      const txMBps = bytesToMB(txBytesDelta);

      oscBridge.sendFloat("inMBps", rxMBps);
      oscBridge.sendFloat("outMBps", txMBps);

      // console.log(`Download: ${rxMBps.toFixed(1)} MB/s, Upload: ${txMBps.toFixed(1)} MB/s`);
    } else {
      console.log("No network interface stats available.");
    }
  } catch (error) {
    console.error("Error fetching network stats:", error);
  }
}, 1000); // Update every second
