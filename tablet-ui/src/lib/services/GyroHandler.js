
import { writable } from "svelte/store";
export const OrientationData = writable({ alpha: 0, beta: 0, gamma: 0 });
export const SensorAccess = writable(null);

let currentSocket;
let sensorAccess;
let currentScene;

let deltaAlpha = 0;
let deltaBeta = 0;
let deltaGamma = 0;

let alphaRounds = 0.0;
let betaRounds = 0.0;
let gammaRounds = 0.0;

let lastAlpha = 0;
let lastBeta = 0;
let lastGamma = 0;

let alphaOffset = 0;

let lastAlphaValue;

let wasOffline = false;

let wakeLockSupport;

export function handleGyroActivationClick() {
    console.log("try to access device orientation data");
    
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        // Request Device Motion Sensor data for iOS 13+ devices
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                // Access is not granted
                if (response == "granted") {
                    console.log("add deviceorientation listener");
                    window.addEventListener(
                        "deviceorientation",
                        handleOrientation,
                        true
                    );
                    SensorAccess.set(true);
                    // currentSocket.emit("mobile:sensor-access", true);
                } else {
                    // Access not granted
                    SensorAccess.set(false);
                    // currentSocket.emit("mobile:sensor-access", false);
                }
            })
            .catch((error) => {
                console.log(error);
                SensorAccess.set(false);
                // currentSocket.emit("mobile:sensor-access", false);
            });
    } else if (window.DeviceOrientationEvent) {
        // access sensor for iOS 13+ and Android
        console.log("add deviceorientation listener");

        // check again in a second, special case for some Android devices without a sensor
        setTimeout(checkSensorAccess, 1000);
        window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
        // No sonser data available
        SensorAccess.set(false);
        console.log("Device does not have an orientation sensor | 1");
        // currentSocket.emit("mobile:sensor-access", false);
    }
    // activate always on displays
    // acquireWakeLock();

    // register listener
    document.addEventListener("visibilitychange", (e) => {
        if (document.visibilityState === "visible") {
            wasOffline = true;
        }
    });
}

let orientationDataCount = 0;
function checkSensorAccess() {
    // check if listener callback was called at least once, if not, no sensor available
    if (orientationDataCount == 0) {
        // sensor missing
        SensorAccess.set(false);
        // currentSocket.emit("mobile:sensor-access", false);
    }
}

function handleOrientation(e) {
    // Check if orientation listener is called, but data are not abailable.
    // Special case for some Android phones that call the function once despite no sensor present
    if (
        e.alpha === null ||
        e.alpha === undefined ||
        e.alpha + e.beta + e.gamma == 0
    ) {
        console.log("Device does not have an orientation sensor | 2");
        SensorAccess.set(false);
        // currentSocket.emit("mobile:sensor-access", false);
    } else {
        // Sensordata are available, only send the event once for successfull sensor access
        if (orientationDataCount == 0) {
            SensorAccess.set(true);
            // currentSocket.emit("mobile:sensor-access", true);
        }
        orientationDataCount += 1;
    }

    if (wasOffline) {
        restoreSensorOffset(normalized(e.alpha + alphaOffset));
        wasOffline = false;
    }

    // let alpha = e.alpha - (alphaOffset % 360); // correct for initial or compass restored offset
    let alpha = normalized(e.alpha + alphaOffset);
    let beta = e.beta;
    let gamma = e.gamma;

    lastAlphaValue = alpha;

    let orientationData = calculateEndlessRotation(alpha, beta, gamma);
    OrientationData.set(orientationData);
    // sendOrientationData(orientationData, currentScene);
}

function calculateEndlessRotation(alpha, beta, gamma) {
    let orientationData = null;

    // Calculate Delta
    deltaAlpha = alpha - lastAlpha;
    deltaBeta = beta - lastBeta;
    deltaGamma = gamma - lastGamma;

    // Calculate alpha rounds
    if (deltaAlpha > 180) {
        alphaRounds -= 1;
    } else if (deltaAlpha < -180) {
        alphaRounds += 1;
    }

    // Calculate beta rounds
    if (deltaBeta > 180) {
        betaRounds -= 1;
    } else if (deltaBeta < -180) {
        betaRounds += 1;
    }

    // Calculate gamma rounds
    if (deltaGamma > 90) {
        gammaRounds -= 1;
    } else if (deltaGamma < -90) {
        gammaRounds += 1;
    }

    orientationData = {
        alpha: alpha + alphaRounds * 360,
        beta: beta + betaRounds * 360,
        gamma: gamma + gammaRounds * 180,
    };

    // Update last values
    lastAlpha = alpha;
    lastBeta = beta;
    lastGamma = gamma;

    return orientationData;
}

export function releaseSensorPermission() {
    SensorAccess.set(false);
    window.removeEventListener("deviceorientation", handleOrientation, true);
}

export function calibrateSensor() {
    alphaOffset -= lastAlphaValue;
}

export function restoreSensorOffset(currentAlpha) {
    alphaOffset = lastAlphaValue;
}

function normalized(angle) {
    return (angle + 360 * 10000) % 360;
}
