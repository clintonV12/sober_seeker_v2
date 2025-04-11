const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const cameraErrorAlert = document.getElementById('camera-error');
const modelErrorAlert = document.getElementById('model-error');
const detectionErrorAlert = document.getElementById('detection-error');
const blinkAlert = document.getElementById('blink-alert');
const headTiltAlert = document.getElementById('head-tilt-alert');
const asymmetryAlert = document.getElementById('asymmetry-alert');
const yawnAlert = document.getElementById('yawn-alert');

let facemeshModel = null;
let isDetecting = false;

// --- Constants ---
const BLINK_THRESHOLD = 0.25; // Reduced threshold for sensitivity
const BLINK_DURATION_THRESHOLD = 150; //ms
const HEAD_TILT_THRESHOLD = 20; // Degrees
const ASYMMETRY_THRESHOLD = 12; // Pixels
const YAWN_THRESHOLD = 25; // Pixels
const MAX_ALERTS = 4; // Limit displayed alerts

let blinkCounter = 0;
let yawnCounter = 0;
let lastBlinkTime = 0;
let previousFaceData = null; // For tracking head movement

// --- Utility Functions ---
function distance(p1, p2) {
    if (!p1 || !p2) return 0; // Handle undefined points
    return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

function midpoint(p1, p2) {
    if (!p1 || !p2) return [0,0];
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}

/**
 * Calculates the angle between three points to determine head tilt
 * @param {Array} p1 First point
 * @param {Array} p2 Second point (center)
 * @param {Array} p3 Third point
 * @returns {number} Angle in degrees
 */
function calculateAngle(p1, p2, p3) {
    if (!p1 || !p2 || !p3) return 0;
    const a = distance(p2, p3);
    const b = distance(p1, p2);
    const c = distance(p1, p3);
    if (a === 0 || b === 0 || c === 0) return 0;
    const angleRad = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    return angleRad * (180 / Math.PI);
}

// --- Alert Management ---
const alerts = []; // Use an array for better management

/**
 * Displays an alert message.  Will not duplicate.
 * @param {string} message The alert message to display.
 * @param {HTMLElement} element The HTML element to display the alert.
 */
function showAlert(message, element) {
    if (!alerts.includes(message)) { //check for duplicates
        alerts.push(message);
        element.classList.remove('hidden');
    }
}

/**
 * Hides an alert message.
 * @param {HTMLElement} element The HTML element to hide.
 */
function hideAlert(element) {
    element.classList.add('hidden');
    const message = element.textContent.slice(2); // Remove the '⚠️ ' or 'Alert: '
    const index = alerts.indexOf(message);
    if (index > -1) {
        alerts.splice(index, 1); // Remove from alerts array
    }
}

// --- Setup Functions ---
/**
 * Sets up the camera and video stream.
 * @returns {Promise<HTMLVideoElement>} The video element.
 */
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // Use the front camera
                width: { ideal: 640 },  // Request 640x480, browser may choose otherwise
                height: { ideal: 480 }
            },
            audio: false
        });
        video.srcObject = stream;
        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
                //set the canvas size to ভিডিও size
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            };
        });
    } catch (err) {
        console.error('Camera setup error:', err);
        cameraErrorAlert.classList.remove('hidden');
        throw err; // Re-throw to stop initialization
    }
}

/**
 * Loads the FaceMesh model.
 * @returns {Promise<facemesh.FaceMesh>} The loaded FaceMesh model.
 */
async function loadFaceMeshModel() {
    try {
        const model = await facemesh.load();
        return model;
    } catch (err) {
        console.error('Failed to load FaceMesh model:', err);
        modelErrorAlert.classList.remove('hidden');
        throw err; // Re-throw to stop initialization
    }
}

// --- Detection Functions ---

/**
 * Detects drowsiness based on eye aspect ratio and blink frequency.
 * @param {Array} keypoints Array of facial keypoints.
 */
function detectDrowsiness(keypoints) {
    if (!keypoints || keypoints.length < 375) {
        return;
    }
    const leftEyeTop = keypoints[159];
    const leftEyeBottom = keypoints[145];
    const rightEyeTop = keypoints[386];
    const rightEyeBottom = keypoints[374];

    const leftEyeOpen = distance(leftEyeTop, leftEyeBottom);
    const rightEyeOpen = distance(rightEyeTop, rightEyeBottom);
    const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2;
    const eyeAspectRatio = avgEyeOpen / distance(keypoints[130], keypoints[243]); // Use eye width

    const now = Date.now();
    if (eyeAspectRatio < BLINK_THRESHOLD) {
        if(now - lastBlinkTime > BLINK_DURATION_THRESHOLD){
            blinkCounter++;
            lastBlinkTime = now;
        }
        if (blinkCounter > 3) { // Reduced consecutive blink count
            showAlert("Frequent blinking detected (possible drowsiness)", blinkAlert);
        }
    } else {
        blinkCounter = 0; // Reset counter if eyes are open
        hideAlert(blinkAlert);
    }
}

/**
 * Detects head tilt based on ear keypoint positions.
 * @param {Array} keypoints Array of facial keypoints.
 */
function detectHeadTilt(keypoints) {
    if (!keypoints || keypoints.length < 455) {
        return;
    }
    const leftEar = keypoints[234];
    const rightEar = keypoints[454];
    if(!leftEar || !rightEar) return;
    const headTilt = calculateAngle(leftEar, midpoint(leftEar, rightEar), rightEar);

    if (Math.abs(headTilt) > HEAD_TILT_THRESHOLD) {
        showAlert("Head tilt detected (possible imbalance)", headTiltAlert);
    } else {
        hideAlert(headTiltAlert);
    }
}

/**
 * Detects facial asymmetry.
 * @param {Array} keypoints Array of facial keypoints.
 */
function detectFacialAsymmetry(keypoints) {
    if (!keypoints || keypoints.length < 281) {
        return;
    }
    const leftCheek = keypoints[50];
    const rightCheek = keypoints[280];
    const nose = keypoints[1];

    if(!leftCheek || !rightCheek || !nose) return;

    const leftDist = distance(nose, leftCheek);
    const rightDist = distance(nose, rightCheek);
    const asymmetry = Math.abs(leftDist - rightDist);

    if (asymmetry > ASYMMETRY_THRESHOLD) {
        showAlert("Facial asymmetry detected (possible impairment)", asymmetryAlert);
    } else {
        hideAlert(asymmetryAlert);
    }
}

/**
 * Detects yawning.
 * @param {Array} keypoints Array of facial keypoints.
 */
function detectYawning(keypoints) {
    if (!keypoints || keypoints.length < 15) {
        return;
    }
    const upperLip = keypoints[13];
    const lowerLip = keypoints[14];
    if(!upperLip || !lowerLip) return;
    const mouthOpen = distance(upperLip, lowerLip);

    if (mouthOpen > YAWN_THRESHOLD) {
        yawnCounter++;
        if (yawnCounter > 2) { // Reduced consecutive yawn count
            showAlert("Yawning detected (fatigue or intoxication)", yawnAlert);
            yawnCounter = 0;
        }
    } else {
        yawnCounter = 0;
        hideAlert(yawnAlert);
    }
}

/**
 * Main detection loop.
 */
async function detectFaces() {
    if (!video || !facemeshModel || !isDetecting) return;

    try {
        const predictions = await facemeshModel.estimateFaces(video, {
            flipHorizontal: false,  // Mirrored by default, set to false
            returnTensors: false, // Return data as arrays, not tensors
            predictIrises: false  // We don't need iris detection
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const keypoints = prediction.scaledMesh;

                // Check if keypoints array is valid
                if (!keypoints || keypoints.length === 0) {
                    console.warn("No keypoints detected for a face.");
                    return; // Skip this face if no keypoints
                }

                // Draw landmarks (optional, for visual feedback)
                
                ctx.fillStyle = "lime";
                keypoints.forEach(([x, y]) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                detectDrowsiness(keypoints);
                detectHeadTilt(keypoints);
                detectFacialAsymmetry(keypoints);
                detectYawning(keypoints);
            });
        } else {
            hideAlert(blinkAlert);
            hideAlert(headTiltAlert);
            hideAlert(asymmetryAlert);
            hideAlert(yawnAlert);
        }
        previousFaceData = predictions[0]?.scaledMesh; //store the face data.
    } catch (err) {
        console.error('Error during face detection:', err);
        detectionErrorAlert.classList.remove('hidden');
        isDetecting = false; // Stop detection loop
    }

    if (isDetecting) {
        requestAnimationFrame(detectFaces); // Continue the loop
    }
}

/**
 * Initializes the application.
 */
async function initialize() {
    try {
        await setupCamera();
        facemeshModel = await loadFaceMeshModel();
        isDetecting = true; // Start the detection loop
        detectFaces(); //start the loop.
    } catch (err) {
        // уже обработано в setupCamera и loadFaceMeshModel
        console.error("Initialization failed", err);
    }
}

// --- Event Listeners ---
video.addEventListener('loadeddata', () => {
    //on video loaded, set the canvas size.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

// --- Start the Application ---
initialize();