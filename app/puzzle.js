import data from '../constants/data.js';

export function initPuzzle() {
  const puzzles = data.puzzles;
  let currentPuzzleIndex = 0;
  window.stage = "Puzzle";

  function getRandomPuzzlesByLevel(questions, level, count = 3) {
    const filtered = questions.filter(q => q.level === level);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const selectedPuzzles = getRandomPuzzlesByLevel(puzzles, "Intermediate");

  function resetOptionStyles() {
    document.querySelectorAll('.option').forEach(option => {
      option.style.backgroundColor = "#4c566a";
      option.style.color = "#eceff4";
      option.classList.remove("selected");
    });
  }

  function loadPuzzle() {
    resetOptionStyles();
    const puzzle = selectedPuzzles[currentPuzzleIndex];
    document.getElementById('puzzle-prompt').textContent = puzzle.prompt;
    
    // Display the Boxicons shape
    const shapeElement = document.getElementById('puzzle-shape');
    shapeElement.innerHTML = `<i class="${puzzle.shapeIcon}" style="font-size: 100px; color: white;"></i>`;
    
    if (puzzle.shapeIconList) {
      for (var i = 0; i < puzzle.shapeIconList.length; i++) {
        shapeElement.innerHTML += `<i class="${puzzle.shapeIconList[i]}" style="font-size: 40px; color: white;"></i>`;
      }
      
    }

    document.getElementById('optionA').textContent = 'A: ' + puzzle.options[0];
    document.getElementById('optionB').textContent = 'B: ' + puzzle.options[1];
    document.getElementById('optionC').textContent = 'C: ' + puzzle.options[2];
    document.getElementById('optionD').textContent = 'D: ' + puzzle.options[3];
    
    document.getElementById('score').firstElementChild.textContent = window.puzzleTotalScore + ' Points';
    document.getElementById('puzzle-number').textContent = (currentPuzzleIndex + 1) + ' / ' + selectedPuzzles.length;
  }

  function selectPuzzleOption(selectedOption) {
    const puzzle = selectedPuzzles[currentPuzzleIndex];
    if (selectedOption === puzzle.answer) {
      window.puzzleTotalScore += puzzle.reward;
      showMsgToast("Correct! You've earned " + puzzle.reward + " points");
    } else {
      showMsgToast("Incorrect! The correct answer was " + puzzle.answer + ".");
    }
    currentPuzzleIndex++;

    if (currentPuzzleIndex < selectedPuzzles.length) {
      loadPuzzle();
    } else {
      const initialPage = 'info';
      window.setPageName(initialPage);
      window.router();
    }
  }

  // Make selectOption globally available to inline HTML onclicks
  window.selectPuzzleOption = selectPuzzleOption;
  // Load the first puzzle
  loadPuzzle();
}
