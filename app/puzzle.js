puzzles = [
  {
    level: "Easy",
    prompt: "Identify the currency represented by the icon below:",
    shapeIcon: "bx bx-pound",  // Triangle shape
    options: ["Swiss Franc", "Nigerian Naira", "British Pound", "Canadian Dollar"],
    answer: "C",
    reward: 5
  },
  {
    level: "Easy",
    prompt: "Which shape has 4 equal sides?",
    shapeIcon: "bx bx-square",  // Square shape
    options: ["Circle", "Square", "Triangle", "Rectangle"],
    answer: "B",
    reward: 5
  },
  {
    level: "Intermediate",
    prompt: "What shape has no corners?",
    shapeIcon: "bx bx-circle",  // Circle shape
    options: ["Square", "Hexagon", "Triangle", "Circle"],
    answer: "D",
    reward: 10
  },
  {
    level: "Intermediate",
    prompt: "What shape is missing from the list?",
    shapeIconList: ["bx bx-user, bx-right-arrow-circle", "bx bx-up-arrow-circle", "bx bx-left-arrow-circle"],  // Circle shape
    options: ["Down arrow", "A cross", "Triangle", "Two Triangles"],
    answer: "A",
    reward: 10
  },
  {
    level: "Intermediate",
    prompt: "Which device is used in gaming consoles?",
    shapeIconList: ["bx bx-memory-card", "bx bx-mouse", "bx bx-joystick", "bx bx-printer"],  // Circle shape
    options: ["Memory Card", "Mouse", "Joystick", "Printer"],
    answer: "C",
    reward: 10
  },
  {
    level: "Intermediate",
    prompt: "Which of the following emojis represents a ghost",
    shapeIconList: ["bx bx-meh-alt", "bx bx-sad", "bx bx-dizzy", "bx bx-ghost"],  // Circle shape
    options: ["Emoji 1", "Emoji 2", "Emoji 3", "Emoji 4"],
    answer: "D",
    reward: 10
  }
];

currentPuzzleIndex = 0;
puzzleTotalScore = 0;
stage = "Puzzle";

function resetOptionStyles() {
  document.querySelectorAll('.option').forEach(option => {
    option.style.backgroundColor = "#4c566a";
    option.style.color = "#eceff4";
    option.classList.remove("selected");
  });
}

function loadPuzzle() {
  resetOptionStyles();
  const puzzle = puzzles[currentPuzzleIndex];
  document.getElementById('puzzle-prompt').textContent = puzzle.prompt;
  
  // Display the Boxicons shape
  const shapeElement = document.getElementById('puzzle-shape');
  shapeElement.innerHTML = `<i class="${puzzle.shapeIcon}" style="font-size: 100px; color: red;"></i>`;
  
  if (currentPuzzleIndex > 2) {
    for (var i = 0; i < puzzle.shapeIconList.length; i++) {
      shapeElement.innerHTML += `<i class="${puzzle.shapeIconList[i]}" style="font-size: 40px; color: red;"></i>`;
    }
    
  }

  document.getElementById('optionA').textContent = 'A: ' + puzzle.options[0];
  document.getElementById('optionB').textContent = 'B: ' + puzzle.options[1];
  document.getElementById('optionC').textContent = 'C: ' + puzzle.options[2];
  document.getElementById('optionD').textContent = 'D: ' + puzzle.options[3];
  
  document.getElementById('score').firstElementChild.textContent = puzzleTotalScore + ' Points';
  document.getElementById('puzzle-number').textContent = (currentPuzzleIndex + 1) + ' / ' + puzzles.length;
}

function selectOption(selectedOption) {
  const puzzle = puzzles[currentPuzzleIndex];
  if (selectedOption === puzzle.answer) {
    puzzleTotalScore += puzzle.reward;
    showMsgToast("Correct! You've earned " + puzzle.reward + " points");
  } else {
    showMsgToast("Incorrect! The correct answer was " + puzzle.answer + ".");
  }
  currentPuzzleIndex++;

  if (currentPuzzleIndex < puzzles.length) {
    loadPuzzle();
  } else {
    totalScore = puzzleTotalScore;
    const initialPage = 'info';
    window.setPageName(initialPage);
    window.router();
  }
}

// Load the first puzzle
loadPuzzle();
