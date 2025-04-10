function initIrisScan() {
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const scanText = document.querySelector('.scan-text');
    const video = document.getElementById('camera-stream');
    const successSound = new Audio('assets/audio/success.wav');

    // Access the user's webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
            scanText.textContent = "Camera access denied";
            scanText.style.color = '#FF0000';
            showMsgToast(scanText.textContent);
        });

    const scanInterval = setInterval(() => {
        if (progress < 100) {
            progress += 1;
            progressBar.style.width = progress + '%';
        } else {
            clearInterval(scanInterval);
            scanText.textContent = "Scan Complete";
            scanText.style.animation = 'none';
            scanText.style.color = '#00FF00';
            successSound.play();

            // Stop the webcam stream once the scan is complete
            const stream = video.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }

            const initialPage = 'physical_result';
            window.setPageName(initialPage);
            window.router();
        }
    }, 40);

    successSound.volume = 0.5;
}


initIrisScan()
