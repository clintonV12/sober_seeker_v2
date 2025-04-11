export function initPhysical() {
    let startTime, reactionTimeout;
    const box = document.getElementById('reactionTest');
    const result = document.getElementById('reactionResult');
    const scoreBar = document.getElementById('reactionScore');
    const averageResult = document.getElementById('reactionAverage');
    const attemptsResult = document.getElementById('reactionAttempts');
    const resultDisplay = document.getElementById('result_display');
    const finalMessageDisplay = document.getElementById('finalMessage'); // Element to show final message

    let reactionTimes = [];
    let attempts = 0;
    const maxAttempts = 3;
    const slowAverageThreshold = 500; // Milliseconds - adjust this value as needed

    function resetTestDisplay() {
        box.style.backgroundColor = '#333';
        box.textContent = 'Click to Start';
        result.textContent = '';
        finalMessageDisplay.textContent = ''; // Clear final result message
        scoreBar.value = 0;
    }

    function startGame() {
        resetTestDisplay();
        reactionTimes = []; // Reset reaction times for a new game
        attempts = 0;
        attemptsResult.textContent = `Attempts: ${attempts}/${maxAttempts}`;
        box.onclick = waitForGreen;
    }

    function waitForGreen() {
        box.style.backgroundColor = 'gray';
        box.textContent = 'Wait for green...';
        result.textContent = '';

        const delay = Math.random() * 3000 + 1000;

        reactionTimeout = setTimeout(() => {
            box.style.backgroundColor = 'green';
            box.textContent = 'CLICK!';
            startTime = Date.now();
            box.onclick = handleReaction;
        }, delay);

        box.onclick = () => {
            clearTimeout(reactionTimeout);
            result.textContent = '⚠️ Too soon! Wait for green.';
            scoreBar.value = 0;
            box.textContent = `Try again (${attempts + 1}/${maxAttempts})`;
            setTimeout(startGame, 1500);
        };
    }

    function handleReaction() {
        if (box.style.backgroundColor === 'green') {
            const reactionTime = Date.now() - startTime;
            result.textContent = `⏱️ Reaction time: ${reactionTime} ms`;
            updateFeedback(reactionTime);
            updateScore(reactionTime);
            updateStatistics(reactionTime);

            if (attempts < maxAttempts) {
                box.textContent = `Try again (${attempts + 1}/${maxAttempts})`;
                box.onclick = waitForGreen; // Prepare for the next attempt
            } else {
                endGame();
            }
        }
    }

    function updateFeedback(reactionTime) {
        if (reactionTime < 200) result.textContent += " ⚡️ Excellent!";
        else if (reactionTime < 350) result.textContent += " 👍 Good";
        else if (reactionTime < 500) result.textContent += " 🤏 Okay";
        else result.textContent += " 🐌 Slow";
    }

    function updateScore(reactionTime) {
        const score = Math.max(1000 - reactionTime, 0);
        scoreBar.value = score;
    }

    function updateStatistics(reactionTime) {
        reactionTimes.push(reactionTime);
        attempts++;
        attemptsResult.textContent = `Attempts: ${attempts}/${maxAttempts}`;

        if (attempts > 0) {
            const averageTime = reactionTimes.reduce((sum, time) => sum + time, 0) / attempts;
            averageResult.textContent = `Avg: ${averageTime.toFixed(0)} ms`;
        }
    }

    function endGame() {
        if (attempts === 0) {
            resultDisplay.textContent = "No attempts recorded.";
            box.textContent = 'Test Incomplete';
            box.onclick = startGame; // Allow restart
            return;
        }

        const averageTime = reactionTimes.reduce((sum, time) => sum + time, 0) / attempts;
        box.textContent = 'Test Finished';
        box.onclick = null; // Disable further clicks
        resultDisplay.textContent = `Final Average: ${averageTime.toFixed(0)} ms`;

        // Ensure finalMessageDisplay element exists in the HTML
        if (finalMessageDisplay) {
            // Clear any previous content
            finalMessageDisplay.innerHTML = '';

            const messageParagraph = document.createElement('p');
            const actionButton = document.createElement('button');
            actionButton.className = 'btn btn-secondary mt-2'; // Added mt-2 for spacing
            actionButton.type = 'button';

            const actionButton2 = document.createElement('button');
            actionButton2.className = 'btn btn-secondary mt-2'; // Added mt-2 for spacing
            actionButton2.type = 'button';

            if (averageTime > slowAverageThreshold) {
                messageParagraph.textContent = "⚠️ Your reaction time is slow. Consider whether you are fit to drive.";
                messageParagraph.style.color = 'red';
                messageParagraph.style.fontWeight = 'bold';
                actionButton.textContent = 'Request Transport';
                actionButton.addEventListener('click', () => {
                    alert('Transport request initiated (simulated)');
                    // In a real application, you would trigger a transport request here
                });

                actionButton2.textContent = 'Try Another Challenge';
                actionButton2.addEventListener('click', () => {
                    window.setPageName('physical2');
                    window.router();
                });
            } else {
                messageParagraph.textContent = "👍 Your reaction time seems within a reasonable range.";
                messageParagraph.style.color = 'green';
                actionButton.textContent = 'Restart Test';
                actionButton.addEventListener('click', startGame); // Restart the game

                actionButton2.textContent = 'Exit';
                actionButton2.addEventListener('click', () => {
                    window.setPageName('quiz');
                    window.router();
                });
            }

            finalMessageDisplay.appendChild(messageParagraph);
            finalMessageDisplay.appendChild(actionButton);
            finalMessageDisplay.appendChild(actionButton2);
        } else {
            console.error("Error: 'finalMessageDisplay' element not found in the HTML.");
            // Fallback behavior if the target element doesn't exist
            if (averageTime > slowAverageThreshold) {
                alert("⚠️ Your reaction time is slow. Consider whether you are fit to drive.");
            } else {
                alert("👍 Your reaction time seems within a reasonable range.");
            }
            box.textContent = 'Click to Restart';
            box.onclick = startGame;
        }
    }

    // Initialize the game
    startGame();
}