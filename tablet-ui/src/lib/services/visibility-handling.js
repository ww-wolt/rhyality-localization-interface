import {
    sendVisibleEvent,
    sendHiddenEvent,
} from "$lib/scripts/socket-io-handling";
import { SensorAccess, WakeLockSupport } from "./store";

let wakeLock;
let sensorAccess;

SensorAccess.subscribe((data) => {
    sensorAccess = data;
});

export function handleVisibilityChange(e) {
    if (document.visibilityState === "visible") {
        sendVisibleEvent();
        acquireWakeLock();
        console.log("visible");
    } else if (sensorAccess === true) {
        sendHiddenEvent(e);
        console.log("hidden");
        releaseWakeLock();
        document.cookie =
            "disconnect=" + new Date().getTime() + ";max-age=60*60*24*7";
    }
}

export const acquireWakeLock = async () => {
    if ("wakeLock" in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            console.log("Wake lock is activated.");
            WakeLockSupport.set(true);
        } catch (err) {
            console.log("Wake lock could not get activated");
            console.log(err);
        }
    } else {
        WakeLockSupport.set(false);
    }
};
const releaseWakeLock = async () => {
    if ("wakeLock" in navigator) {
        try {
            wakeLock.release();
            console.log("Wake lock has been released.");
        } catch (err) {
            console.log(err);
        }
    }
};
