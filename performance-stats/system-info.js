import si from 'systeminformation';
import * as oscBridge from "./oscBridge.js";

let macGpuLoad = 0;

// Helper function to format percentages
const toPercentage = (value) => `${value.toFixed(0)}%`;

// Helper function to convert bytes to megabytes
const bytesToMbits = (bytes) => (bytes / (1024 * 1024)) * 8; // Multiply by 8 to convert to Mbit/s


// Store previous network stats to calculate deltas
let previousNetworkStats = { rx_bytes: 0, tx_bytes: 0 };

// Fetch and display system stats at regular intervals
setInterval(async () => {
  try {
    console.clear();

    // === Network Stats ===
    console.log(`\n--- Network Stats ---`);
    const networkStats = await si.networkStats();
    console.log("🚀 ~ setInterval ~ networkStats:", networkStats)

    if (networkStats.length > 0) {
      const stats = networkStats[0]; // Use the first network interface

      // Calculate data received and transmitted since the last check
      const rxBytesDelta = stats.rx_bytes - previousNetworkStats.rx_bytes;
      const txBytesDelta = stats.tx_bytes - previousNetworkStats.tx_bytes;

      // Update the previous stats
      previousNetworkStats = { rx_bytes: stats.rx_bytes, tx_bytes: stats.tx_bytes };

      // Convert to MB/s
      const rxMBits = bytesToMbits(rxBytesDelta);
      const txMbits = bytesToMbits(txBytesDelta);

      oscBridge.sendFloat("stats/network_in", rxMBits);
      oscBridge.sendFloat("stats/network_out", txMbits);

      console.log(`Network In: ${rxMBits.toFixed(1)} MBit/s`);
      console.log(`Network Out: ${txMbits.toFixed(1)} MBit/s`);
    } else {
      console.log("  No network stats available.");
    }

    // === CPU Stats ===
    console.log(`\n--- CPU Stats ---`);
    const cpuLoad = await si.currentLoad();

    console.log(`Overall CPU Usage: ${toPercentage(cpuLoad.currentLoad)}`);

    oscBridge.sendFloat('stats/cpu', cpuLoad.currentLoad);

    console.log(`CPU Usage Per Core:`);
    cpuLoad.cpus.forEach((core, index) => {
        console.log(`  Core ${index + 1}: ${toPercentage(core.load)}`);
        oscBridge.sendFloat(`stats/cpu_core${index + 1}`, core.load);
    });

    // === GPU Stats ===
    console.log(`\n--- GPU Stats ---`);
    console.log(`  Mac GPU: ${macGpuLoad}%`);

    // Fetch GPU stats (uncomment on non MacOS systems)
    // const gpuData = await si.graphics();
    // if (gpuData.controllers && gpuData.controllers.length > 0) {
    //   gpuData.controllers.forEach((gpu, index) => {
    //     oscBridge.sendFloat(`stats/gpu${index + 1}`, gpu.utilizationGpu || 0);
    //     console.log(`  GPU ${index + 1} (${gpu.model}): ${toPercentage(gpu.utilizationGpu || 0)}`);
    //   });
    // } else {
    //   console.log("  No GPU information available.");
    // }
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
    oscBridge.sendFloat("stats/mac_gpu", gpuUsage);
    macGpuLoad = gpuUsage;
  } catch (error) {
    console.error(error);
  }
}, 3000); // Update every 3 seconds
