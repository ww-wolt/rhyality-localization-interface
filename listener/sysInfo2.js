import si from 'systeminformation';
import * as oscBridge from "./oscBridge.js";

// Helper function to format percentages
const toPercentage = (value) => `${value.toFixed(2)}%`;

// Helper function to convert bytes to megabytes
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

// Store previous network stats to calculate deltas
let previousNetworkStats = { rx_bytes: 0, tx_bytes: 0 };

// Fetch and display system stats at regular intervals
setInterval(async () => {
  try {
    console.clear();

    // === CPU Stats ===
    const cpuLoad = await si.currentLoad();

    console.log(`\n--- CPU Stats ---`);
    console.log(`Overall CPU Usage: ${toPercentage(cpuLoad.currentLoad)}`);
    console.log(`CPU Usage Per Core:`);
    cpuLoad.cpus.forEach((core, index) => {
      console.log(`  Core ${index + 1}: ${toPercentage(core.load)}`);
    });

    // === GPU Stats ===
    const gpuData = await si.graphics();

    console.log(`\n--- GPU Stats ---`);
    if (gpuData.controllers && gpuData.controllers.length > 0) {
      gpuData.controllers.forEach((gpu, index) => {
        console.log(`  GPU ${index + 1} (${gpu.model}): ${toPercentage(gpu.utilizationGpu || 0)}`);
      });
    } else {
      console.log("  No GPU information available.");
    }

    // === Network Stats ===
    const networkStats = await si.networkStats();

    console.log(`\n--- Network Stats ---`);
    if (networkStats.length > 0) {
      const stats = networkStats[0]; // Use the first network interface

      // Calculate data received and transmitted since the last check
      const rxBytesDelta = stats.rx_bytes - previousNetworkStats.rx_bytes;
      const txBytesDelta = stats.tx_bytes - previousNetworkStats.tx_bytes;

      // Update the previous stats
      previousNetworkStats = { rx_bytes: stats.rx_bytes, tx_bytes: stats.tx_bytes };

      // Convert to MB/s
      const rxMBps = bytesToMB(rxBytesDelta);
      const txMBps = bytesToMB(txBytesDelta);

      console.log(`Download Speed: ${rxMBps} MB/s`);
      console.log(`Upload Speed: ${txMBps} MB/s`);
    } else {
      console.log("  No network stats available.");
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}, 1000); // Update every second


import { exec } from 'child_process';

const getGPUUsage = () => {
  return new Promise((resolve, reject) => {
    exec("sudo powermetrics --samplers gpu_power -i2000 -n1", (error, stdout) => {
      if (error) {
        reject("Error executing powermetrics. Ensure script is run with 'sudo'.");
      } else {
        // Extract the "GPU HW active residency" value
        const match = stdout.match(/GPU HW active residency:\s+([\d.]+)%/);
        if (match && match[1]) {
          resolve(parseFloat(match[1])); // Return GPU usage as a percentage
        } else {
          reject("Could not parse GPU usage from powermetrics output.");
        }
      }
    });
  });
};

// Example Usage:
setInterval(async () => {
  try {
    const gpuUsage = await getGPUUsage();
    console.log(`GPU Usage: ${gpuUsage}%`);
  } catch (error) {
    console.error(error);
  }
}, 3000); // Update every 2 seconds
